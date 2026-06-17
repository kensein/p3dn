# 🏛️ TKDN Evaluator - BMKG

Aplikasi evaluasi **Tingkat Komponen Dalam Negeri (TKDN)** untuk Badan Meteorologi, Klimatologi, dan Geofisika (BMKG).

Sistem ini membantu mengelola pengajuan, evaluasi, dan monitoring dokumen TKDN sesuai dengan regulasi Perpres 16/2018 dan PP 29/2018.

## ✨ Fitur

- 🔐 **Autentikasi**: Login dengan role User dan Admin
- 📝 **Pengajuan TKDN**: Form lengkap dengan upload dokumen PDF
- 📊 **Dashboard**: Overview evaluasi untuk User dan Admin
- 🔍 **Review System**: Admin dapat mereview dan approve/reject pengajuan
- 📜 **History**: Tracking status evaluasi dengan timeline
- 📄 **Document Management**: Preview dan download dokumen PDF
- 🎯 **Auto Calculation**: Perhitungan TKDN otomatis berdasarkan formula

## 🛠️ Teknologi

### Frontend

- **Next.js 15.1.3** (App Router)
- **React 19** with Hooks
- **TailwindCSS** untuk styling
- **Lucide React** untuk icons

### Backend

- **Node.js + Express**
- **PostgreSQL** database
- **JWT** authentication
- **bcrypt** password hashing

## 📋 Prerequisites

- Node.js 18+ (LTS)
- PostgreSQL 14+
- npm atau yarn

## 🚀 Cara Menjalankan (Development)

### 1. Clone Repository

```bash
git clone <repository-url>
cd tkdn-evaluator
```

### 2. Setup Environment Variables

**Frontend (.env.local):**

```bash
cp .env.example .env.local
```

**Backend (backend/.env):**

```bash
cp backend/.env.example backend/.env
# Edit backend/.env dan sesuaikan dengan config database Anda
```

### 3. Setup Database

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE bmkg_p3dn;

# Jalankan migrations
psql -U postgres -d bmkg_p3dn -f backend/migrations/001_create_tables.sql
psql -U postgres -d bmkg_p3dn -f backend/migrations/002_create_users_table.sql
```

### 4. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 5. Jalankan Development Server

**Gunakan script otomatis (REKOMENDASI):**

```bash
./start-servers.sh
```

**Atau manual:**

```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
npm run dev
```

**Akses aplikasi:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### 6. Login

**Admin:**

- Email: `admin@bmkg.go.id`
- Password: `admin123`

**User:**

- Email: `jonathan@bmkg.go.id`
- Password: `jonathan123`

## 📁 Struktur Project

```
tkdn-evaluator/
├── app/                    # Next.js pages (App Router)
│   ├── admin/             # Admin pages
│   ├── dashboard/         # User dashboard
│   ├── evaluate/          # Form evaluasi
│   ├── history/           # History page
│   ├── login/             # Login page
│   └── api/               # API routes (optional)
├── backend/
│   ├── server.js          # Express server
│   ├── migrations/        # Database migrations
│   └── src/
│       ├── config/        # Database config
│       ├── controllers/   # Business logic
│       ├── middleware/    # Auth middleware
│       ├── routes/        # API routes
│       └── utils/         # Utilities
├── components/            # React components
├── lib/                   # Frontend utilities
├── public/               # Static files
│   └── documents/        # Template documents
├── .env.example          # Environment template
├── SERVER-GUIDE.md       # Panduan server management
├── DEPLOYMENT-GUIDE.md   # Panduan deployment
└── package.json
```

## 📚 Dokumentasi

- **[SERVER-GUIDE.md](SERVER-GUIDE.md)** - Cara menjalankan dan stop server
- **[DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)** - Panduan deployment ke production

## 🔐 Security

- Password di-hash menggunakan bcrypt (10 rounds)
- JWT untuk authentication
- SQL injection protected (parameterized queries)
- XSS protection (React default)
- CORS enabled dengan whitelist

## 📦 Deployment ke server PSIMKG (sub-path `/p3dn`)

Aplikasi dapat dilayani dari **`https://psimkg.bmkg.go.id/p3dn/`** sebagai service terpisah
dari portal Node (port 3001). Folder deploy: `/var/www/p3dn`.

### Environment frontend (`.env`)

```bash
cp .env.example .env
```

```env
NEXT_PUBLIC_BASE_PATH=/p3dn
NEXT_PUBLIC_API_URL=https://psimkg.bmkg.go.id/p3dn-api/api
PORT=3002
```

> `NEXT_PUBLIC_BASE_PATH` harus diset **sebelum** `npm run build`.

### Environment backend (`backend/.env`)

```bash
cp backend/.env.example backend/.env
```

Sesuaikan kredensial PostgreSQL dan:

```env
CORS_ORIGIN=https://psimkg.bmkg.go.id/p3dn
PORT=8000
```

### Build & service

```bash
npm ci
cd backend && npm ci && cd ..
export NEXT_PUBLIC_BASE_PATH=/p3dn
npm run build

# Frontend: port 3002
PORT=3002 npm run start

# Backend (terminal/service terpisah): port 8000
cd backend && node server.js
```

### Apache (contoh reverse-proxy)

```apache
ProxyPass        /p3dn     http://127.0.0.1:3002/p3dn
ProxyPassReverse /p3dn     http://127.0.0.1:3002/p3dn
ProxyPass        /p3dn-api http://127.0.0.1:8000
ProxyPassReverse /p3dn-api http://127.0.0.1:8000
```

Atur `NEXT_PUBLIC_API_URL=https://psimkg.bmkg.go.id/p3dn-api/api` lalu **build ulang** frontend.

Panduan lengkap legacy: [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)

## 🤝 Contributing

Project ini dibuat untuk magang di BMKG. Untuk kontribusi atau pertanyaan:

- Developer: Jonathan Alvarado
- Email: jonathan@bmkg.go.id

## 📄 License

Open Source - digunakan untuk keperluan BMKG

## 🙏 Credits

- **BMKG** - Badan Meteorologi, Klimatologi, dan Geofisika
- Regulasi: Perpres 16/2018, PP 29/2018, Permenperin 35/2025
