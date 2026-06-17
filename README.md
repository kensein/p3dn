# Portal P3DN BMKG (PSIMKG)

Aplikasi **P3DN — Peningkatan Penggunaan Produk Dalam Negeri / TKDN (Tingkat
Komponen Dalam Negeri)** untuk lingkungan **PSIMKG (Pusat Standardisasi
Instrumen MKG) — BMKG**.

Portal ini dipasang sebagai aplikasi **standalone** yang dilayani dari sub-path
portal utama: **https://psimkg.bmkg.go.id/p3dn/** (terpisah dari aplikasi Node
portal). Tampilan header/footer dibuat **konsisten** dengan portal PSIMKG.

---

## 1. Stack & Arsitektur

| Lapisan       | Teknologi                                                            |
| ------------- | ------------------------------------------------------------------- |
| Framework     | **Next.js 16** (App Router) + **React 19**                          |
| Styling       | **Tailwind CSS v4** (self-host, tanpa Google Fonts eksternal)       |
| Ikon          | `lucide-react` (di-bundle, bukan dari CDN)                          |
| Database      | **PostgreSQL** (driver `pg`, query berparameter)                    |
| Akses data    | Server Components + Route Handlers (`app/api/*`) — satu service     |
| Sub-path      | `basePath` dari env (`NEXT_PUBLIC_BASE_PATH=/p3dn`)                  |

Aplikasi berjalan sebagai **satu service Next.js** (mis. port 3002 di produksi)
yang membaca database PostgreSQL langsung — cocok dengan pola deploy
"reverse-proxy Apache → port aplikasi".

### Fitur portal (publik)

1. **Pengumuman PBJ** — daftar + detail (`/pengumuman`, `/pengumuman/[slug]`), pencarian & filter kategori.
2. **Dashboard / Statistik** — `/statistik`: ringkasan angka + grafik realisasi TKDN, paket, nilai PDN vs impor.
3. **Dokumen & Regulasi** — `/dokumen`: SOP, peraturan, panduan, formulir (unduh/lihat), filter jenis.
4. **Data / Inventaris BMN** — `/bmn`: tabel BMN dengan pencarian & filter kategori/kondisi.
5. **Tautan Sistem Eksternal** — `/tautan`: SPSE/LPSE, e-katalog, SIMAK-BMN, dll. (buka tab baru).

> **Catatan modul evaluator TKDN (opsional).** Repo ini juga memuat modul
> internal "TKDN Evaluator" (alur pengajuan/evaluasi terproteksi login pada
> `/login`, `/home`, `/evaluate`, `/dashboard`, `/history`, `/admin`, `/info`).
> Modul ini memakai backend Express terpisah di folder `backend/` (lihat
> `backend/`), dan **tidak diperlukan** untuk menjalankan portal publik P3DN.

---

## 2. Struktur Folder

```
p3dn/
├── app/
│   ├── layout.js                # Root layout (font system-ui, tanpa Google Fonts)
│   ├── globals.css              # Tailwind + palet warna PSIMKG
│   ├── (portal)/                # PORTAL PUBLIK P3DN (SSR, tanpa login)
│   │   ├── layout.js            # PortalHeader + PortalFooter
│   │   ├── page.js              # Beranda P3DN
│   │   ├── pengumuman/          # Daftar + detail PBJ
│   │   ├── statistik/           # Dashboard statistik
│   │   ├── dokumen/             # Dokumen & regulasi
│   │   ├── bmn/                 # Inventaris BMN
│   │   └── tautan/              # Tautan eksternal
│   ├── api/                     # Route handlers JSON (pengumuman, statistik, dokumen, bmn, tautan)
│   └── (home|login|admin|...)/  # Modul evaluator TKDN (auth, opsional)
├── components/portal/           # PortalHeader, PortalFooter, PageHeader
├── lib/
│   ├── db.js                    # Connection pool PostgreSQL (dari .env)
│   ├── portal-data.js           # Query data portal (parameterized)
│   ├── format.js                # Format Rupiah/tanggal/persen (locale id-ID)
│   └── base-path.js             # Helper withBasePath() untuk aset /public
├── db/
│   ├── migrations/001_p3dn_portal.sql   # Skema tabel portal
│   └── seed.sql                          # Data contoh
├── scripts/db-migrate.mjs / db-seed.mjs  # Runner migrasi & seed
├── public/                      # Aset self-host (logo-bmkg.svg, dokumen PDF, dll.)
├── .env.example                 # Template environment
└── next.config.ts               # basePath dari NEXT_PUBLIC_BASE_PATH
```

---

## 3. Prasyarat

- Node.js 20+ (LTS)
- PostgreSQL 14+
- npm

---

## 4. Setup Database

```bash
# 1) Buat role & database (sesuaikan password)
sudo -u postgres psql -c "CREATE ROLE p3dn LOGIN PASSWORD 'password_aman';"
sudo -u postgres psql -c "CREATE DATABASE bmkg_p3dn OWNER p3dn;"

# 2) Salin & isi environment
cp .env.example .env.local      # untuk dev (atau .env untuk produksi)
#   set DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

# 3) Jalankan migrasi + seed
npm install
npm run db:setup                # = db:migrate && db:seed
```

Perintah terpisah jika diperlukan:

```bash
npm run db:migrate              # buat/ubah skema dari db/migrations/*.sql
npm run db:seed                 # isi data contoh dari db/seed.sql
```

Atau langsung via psql:

```bash
psql -U p3dn -d bmkg_p3dn -f db/migrations/001_p3dn_portal.sql
psql -U p3dn -d bmkg_p3dn -f db/seed.sql
```

---

## 5. Menjalankan (Development)

```bash
npm install
npm run dev
# Akses: http://localhost:3000  (base path kosong saat dev)
```

API JSON tersedia di, mis. `http://localhost:3000/api/statistik`.

---

## 6. Build & Run (Produksi)

```bash
# Set base path agar aplikasi sadar sub-path /p3dn
export NEXT_PUBLIC_BASE_PATH=/p3dn
npm ci
npm run build
PORT=3002 NEXT_PUBLIC_BASE_PATH=/p3dn npm run start
# Akses internal: http://127.0.0.1:3002/p3dn/
```

> **Penting:** `NEXT_PUBLIC_BASE_PATH` di-bake saat `build`. Pastikan variabel
> sudah di-set **sebelum** `npm run build`, bukan hanya saat `start`.

---

## 7. Deploy ke `/var/www/p3dn` (sub-path portal PSIMKG)

Pola deploy: **service Next.js (systemd) + reverse-proxy Apache** ke port 3002.
Konfigurasi Apache final dikerjakan di sisi portal/server; aplikasi sudah siap.

### a. Tempatkan kode & build

```bash
sudo mkdir -p /var/www/p3dn
sudo rsync -a --exclude node_modules --exclude .next ./ /var/www/p3dn/
cd /var/www/p3dn
cp .env.example .env            # isi kredensial DB + NEXT_PUBLIC_BASE_PATH=/p3dn
npm ci
npm run db:setup                # sekali saat instalasi awal
npm run build
```

### b. systemd service (port 3002, BUKAN 3001 milik portal)

`/etc/systemd/system/p3dn.service`:

```ini
[Unit]
Description=Portal P3DN BMKG (Next.js)
After=network.target postgresql.service

[Service]
WorkingDirectory=/var/www/p3dn
Environment=NODE_ENV=production
Environment=PORT=3002
Environment=NEXT_PUBLIC_BASE_PATH=/p3dn
EnvironmentFile=/var/www/p3dn/.env
ExecStart=/usr/bin/npm run start
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now p3dn
```

### c. Reverse-proxy Apache (dikerjakan di sisi portal)

Contoh arahan yang perlu ditambahkan portal pada vhost PSIMKG (dikecualikan dari
proxy Node portal & dari CSP yang relevan):

```apache
# /p3dn dilayani oleh service Next.js di port 3002
ProxyPass        /p3dn http://127.0.0.1:3002/p3dn
ProxyPassReverse /p3dn http://127.0.0.1:3002/p3dn
```

> TLS / redirect HTTP→HTTPS **tidak** ditangani aplikasi (sudah di lapis
> Cloudflare/Apache portal).

---

## 8. Konfigurasi Sub-path & URL Relatif

- `NEXT_PUBLIC_BASE_PATH=/p3dn` membuat Next.js otomatis memberi prefiks pada
  seluruh `<Link>`, router, dan aset `_next/*`.
- Referensi langsung ke file `/public` (mis. logo) memakai helper
  `withBasePath()` dari `lib/base-path.js` agar tetap relatif terhadap `/p3dn`.
- Tidak ada path absolut yang di-hardcode mulai dari `/`.

---

## 9. Keamanan (audit CSIRT BMKG)

- **Self-host** seluruh aset (CSS/JS/ikon/font). Font memakai stack `system-ui`
  (tanpa Google Fonts eksternal). Logo berupa SVG lokal di `public/`.
- Kredensial DB hanya dari `.env` (masuk `.gitignore`); tidak ada secret di UI/repo.
- Query database **berparameter** (`$1, $2, …`) → mencegah SQL injection.
- Output di-escape otomatis oleh React → mitigasi XSS.
- Aplikasi **tidak** memasang redirect HTTP→HTTPS (ditangani lapis portal).

---

## 10. Variabel Environment

Lihat `.env.example`. Ringkasan:

| Variabel               | Keterangan                                            |
| ---------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_BASE_PATH`| Sub-path aplikasi, mis. `/p3dn` (kosong saat dev)     |
| `APP_URL`              | URL publik aplikasi (dokumentasi/metadata)            |
| `DB_HOST` `DB_PORT`    | Host & port PostgreSQL                                |
| `DB_NAME`              | Nama database (mis. `bmkg_p3dn`)                       |
| `DB_USER` `DB_PASSWORD`| Kredensial database                                   |
| `DATABASE_URL`         | Alternatif: satu connection string (diutamakan)       |
| `DB_SSL`               | `true` untuk koneksi SSL                               |
| `PORT`                 | Port service (produksi: `3002`)                       |
```
