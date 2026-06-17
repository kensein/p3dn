// scripts/db-seed.mjs
// Mengisi data contoh ke database dari db/seed.sql.
// Penggunaan: npm run db:seed
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
dotenv.config({ path: '.env.local' });
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedFile = path.join(__dirname, '..', 'db', 'seed.sql');

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
  const sql = fs.readFileSync(seedFile, 'utf8');
  process.stdout.write('-> Mengisi data seed ... ');
  await pool.query(sql);
  console.log('OK');
  await pool.end();
  console.log('Seeding selesai.');
}

run().catch((err) => {
  console.error('Seeding gagal:', err.message);
  process.exit(1);
});
