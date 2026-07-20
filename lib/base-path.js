// Helper untuk path aset di /public saat app dilayani dari sub-path (/p3dn).
// next/link & router otomatis menambahkan basePath; referensi langsung ke
// file publik (PDF, template) perlu helper ini.

export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(
  /\/$/,
  ''
);

export function withBasePath(path = '') {
  if (!path) return BASE_PATH || '/';
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
