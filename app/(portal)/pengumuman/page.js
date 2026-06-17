import Link from 'next/link';
import { Megaphone, Search, ArrowRight, CalendarClock } from 'lucide-react';
import PageHeader from '../../../components/portal/PageHeader';
import {
  getAnnouncements,
  getAnnouncementCategories,
} from '../../../lib/portal-data';
import { formatRupiah, formatDate } from '../../../lib/format';

export const dynamic = 'force-dynamic';

const STATUS_STYLES = {
  Pengumuman: 'bg-blue-50 text-blue-700',
  Pendaftaran: 'bg-amber-50 text-amber-700',
  Evaluasi: 'bg-purple-50 text-purple-700',
  Selesai: 'bg-green-50 text-green-700',
};

export const metadata = {
  title: 'Pengumuman PBJ — Portal P3DN BMKG',
};

export default async function PengumumanPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === 'string' ? sp.q : '';
  const category = typeof sp.kategori === 'string' ? sp.kategori : 'Semua';

  const [items, categories] = await Promise.all([
    getAnnouncements({ q, category }),
    getAnnouncementCategories(),
  ]);

  return (
    <div>
      <PageHeader
        title="Informasi & Pengumuman PBJ"
        description="Pengumuman pengadaan barang/jasa di lingkungan PSIMKG dengan prioritas produk dalam negeri."
        icon={Megaphone}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Pencarian & filter */}
        <form
          method="get"
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Cari judul, ringkasan, atau nomor paket…"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
            />
          </div>
          <select
            name="kategori"
            defaultValue={category}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
          >
            <option value="Semua">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category} ({c.total})
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-[#0052A3] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003366]"
          >
            Terapkan
          </button>
        </form>

        <p className="mb-4 text-sm text-slate-500">
          Menampilkan {items.length} pengumuman
          {category !== 'Semua' ? ` · kategori "${category}"` : ''}
          {q ? ` · pencarian "${q}"` : ''}
        </p>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            Tidak ada pengumuman yang cocok dengan filter.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((a) => (
              <article
                key={a.id}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[#0066CC]/30 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-[#E8F4FC] px-2.5 py-0.5 font-semibold text-[#0052A3]">
                    {a.category}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-medium ${
                      STATUS_STYLES[a.status] || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {a.status}
                  </span>
                  {a.reference_no ? (
                    <span className="text-slate-400">{a.reference_no}</span>
                  ) : null}
                </div>

                <h2 className="mt-2 text-lg font-semibold text-slate-900">
                  <Link
                    href={`/pengumuman/${a.slug}`}
                    className="hover:text-[#0052A3]"
                  >
                    {a.title}
                  </Link>
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {a.summary}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
                  <div className="flex flex-wrap items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarClock className="h-4 w-4" />
                      {formatDate(a.published_at)}
                    </span>
                    {Number(a.hps_value) > 0 ? (
                      <span className="font-medium text-slate-700">
                        Pagu/HPS: {formatRupiah(a.hps_value)}
                      </span>
                    ) : null}
                  </div>
                  <Link
                    href={`/pengumuman/${a.slug}`}
                    className="inline-flex items-center gap-1 font-medium text-[#0066CC] hover:underline"
                  >
                    Detail
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
