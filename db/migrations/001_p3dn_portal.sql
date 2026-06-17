-- ============================================================================
-- Migrasi: Skema Portal P3DN (Peningkatan Penggunaan Produk Dalam Negeri) BMKG
-- Jalankan: psql -U p3dn -d bmkg_p3dn -f db/migrations/001_p3dn_portal.sql
--   atau: npm run db:migrate
-- ============================================================================

-- Fungsi util untuk kolom updated_at
CREATE OR REPLACE FUNCTION p3dn_set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1) Pengumuman & Informasi PBJ (Pengadaan Barang/Jasa)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
  id            SERIAL PRIMARY KEY,
  slug          VARCHAR(180) NOT NULL UNIQUE,
  title         VARCHAR(255) NOT NULL,
  category      VARCHAR(60)  NOT NULL DEFAULT 'Pengumuman',
  reference_no  VARCHAR(120),
  method        VARCHAR(120),
  status        VARCHAR(40)  NOT NULL DEFAULT 'Pengumuman',
  hps_value     NUMERIC(18, 2) DEFAULT 0,
  summary       TEXT,
  content       TEXT,
  contact       VARCHAR(255),
  published_at  DATE NOT NULL DEFAULT CURRENT_DATE,
  closing_at    DATE,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON announcements (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_category ON announcements (category);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements (status);

DROP TRIGGER IF EXISTS trg_announcements_updated_at ON announcements;
CREATE TRIGGER trg_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION p3dn_set_updated_at();

-- ----------------------------------------------------------------------------
-- 2) Dokumen & Regulasi (SOP, peraturan, panduan, formulir)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  doc_type      VARCHAR(60)  NOT NULL DEFAULT 'Peraturan',
  description   TEXT,
  file_path     VARCHAR(255),   -- path relatif terhadap /public, mis. /documents/pp-29-2018.pdf
  external_url  VARCHAR(500),   -- bila dokumen tersimpan di luar
  doc_number    VARCHAR(120),
  year          INTEGER,
  published_at  DATE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_documents_doc_type ON documents (doc_type);
CREATE INDEX IF NOT EXISTS idx_documents_year ON documents (year);

-- ----------------------------------------------------------------------------
-- 3) Inventaris BMN (Barang Milik Negara)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bmn_items (
  id                 SERIAL PRIMARY KEY,
  kode_barang        VARCHAR(60),
  nup                VARCHAR(60),     -- Nomor Urut Pendaftaran
  name               VARCHAR(255) NOT NULL,
  category           VARCHAR(120) NOT NULL DEFAULT 'Peralatan dan Mesin',
  unit               VARCHAR(40)  DEFAULT 'Unit',
  quantity           INTEGER NOT NULL DEFAULT 1,
  acquisition_year   INTEGER,
  acquisition_value  NUMERIC(18, 2) DEFAULT 0,
  condition          VARCHAR(40)  NOT NULL DEFAULT 'Baik',
  location           VARCHAR(255),
  is_domestic        BOOLEAN NOT NULL DEFAULT TRUE,  -- produk dalam negeri?
  tkdn_percentage    NUMERIC(5, 2),
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_bmn_category ON bmn_items (category);
CREATE INDEX IF NOT EXISTS idx_bmn_condition ON bmn_items (condition);
CREATE INDEX IF NOT EXISTS idx_bmn_is_domestic ON bmn_items (is_domestic);

-- ----------------------------------------------------------------------------
-- 4) Statistik pengadaan tahunan (untuk dashboard)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS procurement_stats (
  id                SERIAL PRIMARY KEY,
  year              INTEGER NOT NULL UNIQUE,
  domestic_value    NUMERIC(18, 2) NOT NULL DEFAULT 0, -- nilai produk dalam negeri
  import_value      NUMERIC(18, 2) NOT NULL DEFAULT 0, -- nilai produk impor
  package_count     INTEGER NOT NULL DEFAULT 0,        -- jumlah paket pengadaan
  tkdn_realization  NUMERIC(5, 2) NOT NULL DEFAULT 0,  -- realisasi TKDN (%)
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_procurement_stats_year ON procurement_stats (year);

-- ----------------------------------------------------------------------------
-- 5) Tautan ke sistem eksternal (SPSE/LPSE, SIMAK-BMN, e-katalog, dst.)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS external_links (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(160) NOT NULL,
  url          VARCHAR(500) NOT NULL,
  description  TEXT,
  category     VARCHAR(80) NOT NULL DEFAULT 'Sistem',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_external_links_category ON external_links (category);
