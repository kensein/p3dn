// lib/portal-data.js
// Lapisan akses data (server-only) untuk portal publik P3DN.
// Semua query memakai parameter ($1, $2, ...) untuk mencegah SQL injection.
// Modul ini hanya boleh diimpor dari kode server (Server Components / Route Handlers).
import { query } from './db';

// --- Pengumuman / Informasi PBJ ---------------------------------------------
export async function getAnnouncements({ category, q, limit } = {}) {
  const conditions = ['is_published = TRUE'];
  const params = [];

  if (category && category !== 'Semua') {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    conditions.push(
      `(title ILIKE $${params.length} OR summary ILIKE $${params.length} OR reference_no ILIKE $${params.length})`
    );
  }

  let sql = `SELECT id, slug, title, category, reference_no, method, status,
                    hps_value, summary, contact, published_at, closing_at
             FROM announcements
             WHERE ${conditions.join(' AND ')}
             ORDER BY published_at DESC, id DESC`;
  if (limit) {
    params.push(limit);
    sql += ` LIMIT $${params.length}`;
  }

  const { rows } = await query(sql, params);
  return rows;
}

export async function getAnnouncementBySlug(slug) {
  const { rows } = await query(
    `SELECT * FROM announcements WHERE slug = $1 AND is_published = TRUE LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
}

export async function getAnnouncementCategories() {
  const { rows } = await query(
    `SELECT category, COUNT(*)::int AS total
     FROM announcements WHERE is_published = TRUE
     GROUP BY category ORDER BY category`
  );
  return rows;
}

// --- Dokumen & Regulasi -----------------------------------------------------
export async function getDocuments({ docType } = {}) {
  const params = [];
  let where = 'is_published = TRUE';
  if (docType && docType !== 'Semua') {
    params.push(docType);
    where += ` AND doc_type = $${params.length}`;
  }
  const { rows } = await query(
    `SELECT id, title, doc_type, description, file_path, external_url,
            doc_number, year, published_at
     FROM documents WHERE ${where}
     ORDER BY sort_order ASC, year DESC, id ASC`,
    params
  );
  return rows;
}

export async function getDocumentTypes() {
  const { rows } = await query(
    `SELECT doc_type, COUNT(*)::int AS total FROM documents
     WHERE is_published = TRUE GROUP BY doc_type ORDER BY doc_type`
  );
  return rows;
}

// --- Inventaris BMN ---------------------------------------------------------
export async function getBmnItems({ q, category, condition } = {}) {
  const conditions = [];
  const params = [];

  if (q) {
    params.push(`%${q}%`);
    conditions.push(
      `(name ILIKE $${params.length} OR kode_barang ILIKE $${params.length} OR location ILIKE $${params.length})`
    );
  }
  if (category && category !== 'Semua') {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  if (condition && condition !== 'Semua') {
    params.push(condition);
    conditions.push(`condition = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await query(
    `SELECT id, kode_barang, nup, name, category, unit, quantity,
            acquisition_year, acquisition_value, condition, location,
            is_domestic, tkdn_percentage
     FROM bmn_items ${where}
     ORDER BY name ASC`,
    params
  );
  return rows;
}

export async function getBmnFacets() {
  const [cats, conds] = await Promise.all([
    query(
      `SELECT category, COUNT(*)::int total FROM bmn_items GROUP BY category ORDER BY category`
    ),
    query(
      `SELECT condition, COUNT(*)::int total FROM bmn_items GROUP BY condition ORDER BY condition`
    ),
  ]);
  return { categories: cats.rows, conditions: conds.rows };
}

// --- Statistik pengadaan ----------------------------------------------------
export async function getProcurementStats() {
  const { rows } = await query(
    `SELECT year, domestic_value, import_value, package_count, tkdn_realization
     FROM procurement_stats ORDER BY year ASC`
  );
  return rows.map((r) => ({
    year: r.year,
    domestic_value: Number(r.domestic_value),
    import_value: Number(r.import_value),
    package_count: r.package_count,
    tkdn_realization: Number(r.tkdn_realization),
  }));
}

export async function getStatsSummary() {
  const stats = await getProcurementStats();
  const latest = stats[stats.length - 1] || null;
  const totalDomestic = stats.reduce((s, r) => s + r.domestic_value, 0);
  const totalImport = stats.reduce((s, r) => s + r.import_value, 0);
  const totalPackages = stats.reduce((s, r) => s + r.package_count, 0);
  const totalValue = totalDomestic + totalImport;
  const domesticShare = totalValue ? (totalDomestic / totalValue) * 100 : 0;

  const [{ rows: annRows }, { rows: bmnRows }] = await Promise.all([
    query(`SELECT COUNT(*)::int total FROM announcements WHERE is_published = TRUE`),
    query(
      `SELECT COUNT(*)::int total,
              COALESCE(SUM(CASE WHEN is_domestic THEN 1 ELSE 0 END),0)::int domestic
       FROM bmn_items`
    ),
  ]);

  return {
    stats,
    latest,
    totalDomestic,
    totalImport,
    totalValue,
    totalPackages,
    domesticShare,
    latestTkdn: latest ? latest.tkdn_realization : 0,
    announcementCount: annRows[0].total,
    bmnCount: bmnRows[0].total,
    bmnDomestic: bmnRows[0].domestic,
  };
}

// --- Tautan eksternal -------------------------------------------------------
export async function getExternalLinks() {
  const { rows } = await query(
    `SELECT id, name, url, description, category, sort_order
     FROM external_links WHERE is_active = TRUE
     ORDER BY sort_order ASC, name ASC`
  );
  return rows;
}
