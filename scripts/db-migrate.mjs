// scripts/db-migrate.mjs
// Menjalankan seluruh file SQL di db/migrations secara berurutan.
// Penggunaan: npm run db:migrate
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
dotenv.config({ path: '.env.local' });
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');

function buildPool() {
  if (process.env.DATABASE_URL) {
    return new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'bmkg_p3dn',
    user: process.env.DB_USER || 'p3dn',
    password: process.env.DB_PASSWORD || '',
  });
}

async function run() {
  const pool = buildPool();
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('Tidak ada file migrasi ditemukan.');
    await pool.end();
    return;
  }

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    process.stdout.write(`-> Menjalankan migrasi: ${file} ... `);
    await pool.query(sql);
    console.log('OK');
  }

  await pool.end();
  console.log('Semua migrasi selesai.');
}

run().catch((err) => {
  console.error('Migrasi gagal:', err.message);
  process.exit(1);
});
