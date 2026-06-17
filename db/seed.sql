-- ============================================================================
-- Seed data Portal P3DN BMKG (PSIMKG)
-- Jalankan: psql -U p3dn -d bmkg_p3dn -f db/seed.sql  atau  npm run db:seed
-- Idempoten: data lama dikosongkan lalu diisi ulang.
-- ============================================================================

TRUNCATE TABLE announcements RESTART IDENTITY CASCADE;
TRUNCATE TABLE documents RESTART IDENTITY CASCADE;
TRUNCATE TABLE bmn_items RESTART IDENTITY CASCADE;
TRUNCATE TABLE procurement_stats RESTART IDENTITY CASCADE;
TRUNCATE TABLE external_links RESTART IDENTITY CASCADE;

-- ----------------------------------------------------------------------------
-- Pengumuman & Informasi PBJ
-- ----------------------------------------------------------------------------
INSERT INTO announcements
  (slug, title, category, reference_no, method, status, hps_value, summary, content, contact, published_at, closing_at)
VALUES
('pengadaan-peralatan-observasi-mkg-2026',
 'Pengadaan Peralatan Observasi MKG Tahun Anggaran 2026',
 'Tender', 'PSIMKG/PBJ/2026/001', 'Tender Pascakualifikasi', 'Pengumuman', 4850000000.00,
 'Pengadaan peralatan observasi meteorologi, klimatologi, dan geofisika dengan mengutamakan produk dalam negeri ber-TKDN.',
 E'Pusat Standardisasi Instrumen MKG (PSIMKG) BMKG mengumumkan pelaksanaan tender pengadaan peralatan observasi MKG untuk Tahun Anggaran 2026.\n\nLingkup pekerjaan meliputi pengadaan dan instalasi instrumen observasi otomatis (AWS), sensor cuaca, serta perangkat pendukung kalibrasi. Penyedia WAJIB mengutamakan produk dalam negeri dengan nilai TKDN minimal sesuai ketentuan Permenperin yang berlaku.\n\nPersyaratan utama:\n1. Memiliki NIB dan kualifikasi usaha sesuai bidang.\n2. Melampirkan sertifikat TKDN produk yang ditawarkan.\n3. Mengisi formulir komitmen penggunaan produk dalam negeri (P3DN).\n\nJadwal lengkap dan dokumen pemilihan dapat diunduh melalui LPSE BMKG.',
 'Pokja Pemilihan PSIMKG — pbj.psimkg@bmkg.go.id',
 '2026-01-15', '2026-02-05'),

('belanja-modal-alat-kalibrasi-2026',
 'Belanja Modal Alat Kalibrasi Laboratorium PSIMKG',
 'Seleksi', 'PSIMKG/PBJ/2026/004', 'Tender Cepat', 'Pendaftaran', 2150000000.00,
 'Pengadaan alat kalibrasi standar untuk laboratorium instrumentasi MKG, prioritas produk ber-TKDN.',
 E'Pengadaan alat kalibrasi standar laboratorium guna mendukung kegiatan standardisasi instrumen MKG.\n\nPaket ini diutamakan untuk produk dalam negeri yang telah terdaftar pada e-katalog dan memiliki sertifikat TKDN. Penyedia diharapkan menyertakan dukungan purna jual dan pelatihan operator.',
 'Pokja Pemilihan PSIMKG — pbj.psimkg@bmkg.go.id',
 '2026-02-01', '2026-02-18'),

('jasa-konsultansi-pengembangan-sistem-p3dn',
 'Jasa Konsultansi Pengembangan Sistem Monitoring P3DN',
 'Seleksi', 'PSIMKG/PBJ/2026/007', 'Seleksi Jasa Konsultansi', 'Evaluasi', 980000000.00,
 'Pekerjaan konsultansi penyusunan sistem monitoring realisasi P3DN/TKDN di lingkungan PSIMKG.',
 E'Kegiatan konsultansi untuk menyusun sistem monitoring dan pelaporan realisasi penggunaan produk dalam negeri (P3DN) serta capaian TKDN pengadaan.\n\nKeluaran pekerjaan mencakup dokumen analisis kebutuhan, rancangan basis data, serta dashboard pelaporan. Tahapan saat ini berada pada evaluasi penawaran.',
 'Pokja Pemilihan PSIMKG — pbj.psimkg@bmkg.go.id',
 '2026-01-28', '2026-02-12'),

('e-purchasing-perangkat-pengolah-data-2026',
 'E-Purchasing Perangkat Pengolah Data Produk Dalam Negeri',
 'E-Purchasing', 'PSIMKG/PBJ/2026/011', 'E-Purchasing Katalog', 'Selesai', 765000000.00,
 'Pembelian perangkat pengolah data (workstation & server) produk dalam negeri melalui e-katalog.',
 E'Pembelian perangkat pengolah data melalui e-katalog dengan memilih produk dalam negeri yang memiliki nilai TKDN dan BMP memenuhi ambang batas.\n\nSeluruh perangkat yang diadakan merupakan produk rakitan dalam negeri yang terdaftar pada katalog elektronik. Proses telah selesai dan barang diterima dengan kondisi baik.',
 'Pejabat Pengadaan PSIMKG — pbj.psimkg@bmkg.go.id',
 '2025-11-10', '2025-11-20'),

('pengumuman-rencana-umum-pengadaan-2026',
 'Pengumuman Rencana Umum Pengadaan (RUP) PSIMKG 2026',
 'Pengumuman', 'RUP/PSIMKG/2026', 'Informasi', 'Pengumuman', 0.00,
 'Rencana Umum Pengadaan barang/jasa PSIMKG Tahun Anggaran 2026 telah diumumkan melalui SiRUP.',
 E'Rencana Umum Pengadaan (RUP) PSIMKG untuk Tahun Anggaran 2026 telah ditayangkan pada aplikasi SiRUP LKPP.\n\nRUP memuat seluruh rencana paket pengadaan, baik swakelola maupun penyedia, dengan komitmen mengutamakan produk dalam negeri. Masyarakat dan penyedia dapat memantau perkembangan paket melalui kanal resmi.',
 'Sekretariat PSIMKG — psimkg@bmkg.go.id',
 '2026-01-05', NULL),

('pemeliharaan-jaringan-instrumentasi-2026',
 'Pemeliharaan Jaringan Instrumentasi Geofisika',
 'Penunjukan Langsung', 'PSIMKG/PBJ/2026/013', 'Penunjukan Langsung', 'Pendaftaran', 540000000.00,
 'Pekerjaan pemeliharaan jaringan instrumentasi geofisika dengan suku cadang produk dalam negeri.',
 E'Pekerjaan pemeliharaan berkala jaringan instrumentasi geofisika termasuk penggantian suku cadang.\n\nPenyedia diwajibkan memprioritaskan suku cadang dan komponen produksi dalam negeri sepanjang tersedia di pasar, sesuai kebijakan P3DN.',
 'Pejabat Pengadaan PSIMKG — pbj.psimkg@bmkg.go.id',
 '2026-02-08', '2026-02-22');

-- ----------------------------------------------------------------------------
-- Dokumen & Regulasi
-- ----------------------------------------------------------------------------
INSERT INTO documents
  (title, doc_type, description, file_path, external_url, doc_number, year, published_at, sort_order)
VALUES
('Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah',
 'Peraturan', 'Dasar hukum pelaksanaan pengadaan barang/jasa pemerintah, termasuk kewajiban penggunaan produk dalam negeri.',
 '/documents/perpres-16-2018.pdf', NULL, 'Perpres 16/2018', 2018, '2018-03-22', 1),

('Peraturan Pemerintah Nomor 29 Tahun 2018 tentang Pemberdayaan Industri',
 'Peraturan', 'Mengatur kebijakan penggunaan dan pemberdayaan produk dalam negeri serta TKDN.',
 '/documents/pp-29-2018.pdf', NULL, 'PP 29/2018', 2018, '2018-07-02', 2),

('Permenperin Nomor 35 Tahun 2025 tentang Ketentuan dan Tata Cara Penghitungan TKDN',
 'Peraturan', 'Pedoman teknis penghitungan Tingkat Komponen Dalam Negeri (TKDN) dan Bobot Manfaat Perusahaan (BMP).',
 '/documents/permenperin-35-2025.pdf', NULL, 'Permenperin 35/2025', 2025, '2025-04-10', 3),

('SOP Perencanaan Pengadaan Mengutamakan Produk Dalam Negeri',
 'SOP', 'Standar Operasional Prosedur perencanaan pengadaan dengan prioritas produk dalam negeri di lingkungan PSIMKG.',
 NULL, NULL, 'SOP/PSIMKG/P3DN/01', 2025, '2025-06-01', 4),

('Panduan Pengisian Formulir Komitmen P3DN',
 'Panduan', 'Petunjuk teknis pengisian formulir komitmen penggunaan produk dalam negeri bagi PPK dan penyedia.',
 NULL, NULL, 'PND/PSIMKG/P3DN/02', 2025, '2025-06-15', 5),

('Formulir Justifikasi Penggunaan Produk Impor',
 'Formulir', 'Template justifikasi apabila terpaksa menggunakan produk impor karena ketiadaan produk dalam negeri.',
 '/documents/template-justifikasi-import.doc', NULL, 'FRM/PSIMKG/P3DN/03', 2025, '2025-07-01', 6);

-- ----------------------------------------------------------------------------
-- Inventaris BMN
-- ----------------------------------------------------------------------------
INSERT INTO bmn_items
  (kode_barang, nup, name, category, unit, quantity, acquisition_year, acquisition_value, condition, location, is_domestic, tkdn_percentage)
VALUES
('3.10.01.01.001', '0001', 'Automatic Weather Station (AWS)', 'Peralatan dan Mesin', 'Unit', 12, 2024, 1850000000.00, 'Baik', 'Gudang Instrumentasi PSIMKG', TRUE, 48.50),
('3.10.01.02.004', '0007', 'Server Rakitan Dalam Negeri', 'Peralatan dan Mesin', 'Unit', 4, 2025, 420000000.00, 'Baik', 'Ruang Server PSIMKG', TRUE, 40.20),
('3.10.02.03.011', '0015', 'Workstation Pengolah Data', 'Peralatan dan Mesin', 'Unit', 20, 2025, 360000000.00, 'Baik', 'Laboratorium Data MKG', TRUE, 35.80),
('3.10.01.03.022', '0023', 'Seismograph Broadband', 'Peralatan dan Mesin', 'Unit', 6, 2023, 1320000000.00, 'Baik', 'Gudang Geofisika', FALSE, NULL),
('3.10.03.01.005', '0031', 'Alat Kalibrasi Suhu Standar', 'Peralatan dan Mesin', 'Set', 3, 2024, 540000000.00, 'Baik', 'Laboratorium Kalibrasi', TRUE, 42.00),
('3.10.02.01.009', '0040', 'UPS Industri Produk Lokal', 'Peralatan dan Mesin', 'Unit', 8, 2025, 192000000.00, 'Baik', 'Ruang Server PSIMKG', TRUE, 55.30),
('3.05.01.04.013', '0052', 'Kendaraan Operasional Lapangan', 'Kendaraan', 'Unit', 2, 2022, 760000000.00, 'Rusak Ringan', 'Pool Kendaraan BMKG', TRUE, 38.00),
('3.10.01.05.030', '0066', 'Sensor Curah Hujan Otomatis', 'Peralatan dan Mesin', 'Unit', 30, 2024, 450000000.00, 'Baik', 'Gudang Instrumentasi PSIMKG', TRUE, 44.10),
('3.10.04.02.018', '0074', 'Spektrum Analyzer', 'Peralatan dan Mesin', 'Unit', 2, 2021, 680000000.00, 'Rusak Berat', 'Laboratorium Elektronika', FALSE, NULL),
('3.06.02.01.007', '0085', 'Meubelair Laboratorium', 'Peralatan dan Mesin', 'Paket', 5, 2023, 145000000.00, 'Baik', 'Laboratorium Kalibrasi', TRUE, 60.00),
('3.10.02.03.044', '0092', 'Perangkat Jaringan (Switch & Router)', 'Peralatan dan Mesin', 'Unit', 14, 2025, 238000000.00, 'Baik', 'Ruang Jaringan PSIMKG', TRUE, 33.50),
('3.10.01.06.051', '0101', 'Data Logger Multikanal', 'Peralatan dan Mesin', 'Unit', 18, 2024, 324000000.00, 'Baik', 'Gudang Instrumentasi PSIMKG', TRUE, 41.70);

-- ----------------------------------------------------------------------------
-- Statistik pengadaan tahunan
-- ----------------------------------------------------------------------------
INSERT INTO procurement_stats
  (year, domestic_value, import_value, package_count, tkdn_realization)
VALUES
(2021, 8200000000.00, 5400000000.00, 34, 60.30),
(2022, 9650000000.00, 4900000000.00, 41, 66.30),
(2023, 11200000000.00, 4100000000.00, 47, 73.20),
(2024, 13850000000.00, 3600000000.00, 55, 79.40),
(2025, 15400000000.00, 3100000000.00, 62, 83.20);

-- ----------------------------------------------------------------------------
-- Tautan sistem eksternal
-- ----------------------------------------------------------------------------
INSERT INTO external_links
  (name, url, description, category, sort_order)
VALUES
('LPSE BMKG', 'https://lpse.bmkg.go.id', 'Layanan Pengadaan Secara Elektronik BMKG untuk tender/seleksi.', 'Pengadaan', 1),
('SPSE — INAPROC', 'https://spse.inaproc.id', 'Sistem Pengadaan Secara Elektronik nasional (LKPP).', 'Pengadaan', 2),
('E-Katalog LKPP', 'https://e-katalog.lkpp.go.id', 'Katalog elektronik produk barang/jasa pemerintah, termasuk produk dalam negeri.', 'Pengadaan', 3),
('SiRUP LKPP', 'https://sirup.lkpp.go.id', 'Sistem Informasi Rencana Umum Pengadaan.', 'Pengadaan', 4),
('SIMAK-BMN', 'https://www.djkn.kemenkeu.go.id', 'Sistem Informasi Manajemen dan Akuntansi Barang Milik Negara.', 'Aset', 5),
('TKDN Kemenperin', 'https://tkdn.kemenperin.go.id', 'Sistem sertifikasi dan informasi TKDN Kementerian Perindustrian.', 'TKDN', 6),
('P3DN Kemenperin', 'https://p3dn.kemenperin.go.id', 'Portal Peningkatan Penggunaan Produk Dalam Negeri Kementerian Perindustrian.', 'TKDN', 7),
('Portal PSIMKG', 'https://psimkg.bmkg.go.id', 'Beranda Pusat Standardisasi Instrumen MKG — BMKG.', 'Internal', 8);
