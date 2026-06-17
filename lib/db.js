// lib/db.js
// Koneksi PostgreSQL terpusat (connection pool) untuk portal P3DN.
// Kredensial diambil dari environment (.env) — JANGAN hard-code.
import pg from 'pg';

const { Pool } = pg;

const globalForDb = globalThis;

function createPool() {
  // Dukung DATABASE_URL tunggal ATAU variabel terpisah (DB_HOST, dst).
  if (process.env.DATABASE_URL) {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DB_SSL === 'true'
          ? { rejectUnauthorized: false }
          : undefined,
    });
  }

  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'bmkg_p3dn',
    user: process.env.DB_USER || 'p3dn',
    password: process.env.DB_PASSWORD || '',
    max: parseInt(process.env.DB_POOL_MAX || '10', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl:
      process.env.DB_SSL === 'true'
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

// Reuse pool antar hot-reload di development agar tidak membuat koneksi berlebih.
const pool = globalForDb.__p3dnPool || createPool();
if (process.env.NODE_ENV !== 'production') {
  globalForDb.__p3dnPool = pool;
}

/**
 * Jalankan query berparameter (mencegah SQL injection).
 * @param {string} text - SQL dengan placeholder $1, $2, ...
 * @param {Array} params - nilai parameter
 */
export function query(text, params) {
  return pool.query(text, params);
}

export default pool;
