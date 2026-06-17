// lib/base-path.js
// Helper untuk membuat URL yang sadar base-path (/p3dn) saat aplikasi
// dilayani dari sub-path portal PSIMKG. next/link & next/router sudah otomatis
// menambahkan basePath, namun referensi langsung ke aset di /public (mis. <img src>)
// TIDAK otomatis. Gunakan helper ini untuk aset tersebut.

export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(
  /\/$/,
  ''
);

/**
 * Menambahkan base-path ke sebuah path absolut internal.
 * @param {string} path - path yang diawali '/', mis. '/logo-bmkg.png'
 * @returns {string} path lengkap dengan base-path, mis. '/p3dn/logo-bmkg.png'
 */
export function withBasePath(path = '') {
  if (!path) return BASE_PATH || '/';
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
