import './globals.css';
import ClientLayout from '../components/ClientLayout';

export const metadata = {
  title: 'P3DN BMKG — Peningkatan Penggunaan Produk Dalam Negeri | PSIMKG',
  description:
    'Portal P3DN (Peningkatan Penggunaan Produk Dalam Negeri / TKDN) Pusat Standardisasi Instrumen MKG — BMKG. Informasi pengadaan, statistik, dokumen & regulasi, serta data BMN.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
