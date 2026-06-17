import { Boxes, Search, CheckCircle2, Globe2 } from 'lucide-react';
import PageHeader from '../../../components/portal/PageHeader';
import { getBmnItems, getBmnFacets } from '../../../lib/portal-data';
import { formatRupiah, formatNumber, formatPercent } from '../../../lib/format';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Data Inventaris BMN — Portal P3DN BMKG',
};

const CONDITION_STYLES = {
  Baik: 'bg-green-50 text-green-700',
  'Rusak Ringan': 'bg-amber-50 text-amber-700',
  'Rusak Berat': 'bg-red-50 text-red-700',
};

export default async function BmnPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === 'string' ? sp.q : '';
  const category = typeof sp.kategori === 'string' ? sp.kategori : 'Semua';
  const condition = typeof sp.kondisi === 'string' ? sp.kondisi : 'Semua';

  const [items, facets] = await Promise.all([
    getBmnItems({ q, category, condition }),
    getBmnFacets(),
  ]);

  const totalValue = items.reduce(
    (sum, i) => sum + Number(i.acquisition_value || 0),
    0
  );
  const domesticCount = items.filter((i) => i.is_domestic).length;

  return (
    <div>
      <PageHeader
        title="Data Inventaris BMN"
        description="Daftar Barang Milik Negara (BMN) di lingkungan PSIMKG, lengkap dengan pencarian dan filter."
        icon={Boxes}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Ringkasan */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Jumlah baris ditampilkan</p>
            <p className="mt-1 text-2xl font-bold text-[#0052A3]">
              {formatNumber(items.length)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total nilai perolehan</p>
            <p className="mt-1 text-2xl font-bold text-[#0052A3]">
              {formatRupiah(totalValue)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Produk dalam negeri</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {formatNumber(domesticCount)}
              <span className="ml-1 text-sm font-medium text-slate-400">
                /{formatNumber(items.length)}
              </span>
            </p>
          </div>
        </div>

        {/* Pencarian & filter */}
        <form
          method="get"
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:flex-row lg:items-center"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Cari nama barang, kode, atau lokasi…"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
            />
          </div>
          <select
            name="kategori"
            defaultValue={category}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
          >
            <option value="Semua">Semua Kategori</option>
            {facets.categories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category} ({c.total})
              </option>
            ))}
          </select>
          <select
            name="kondisi"
            defaultValue={condition}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
          >
            <option value="Semua">Semua Kondisi</option>
            {facets.conditions.map((c) => (
              <option key={c.condition} value={c.condition}>
                {c.condition} ({c.total})
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

        {/* Tabel */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Kode / NUP</th>
                <th className="px-4 py-3 font-semibold">Nama Barang</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 text-right font-semibold">Jumlah</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Nilai Perolehan
                </th>
                <th className="px-4 py-3 font-semibold">Kondisi</th>
                <th className="px-4 py-3 font-semibold">Lokasi</th>
                <th className="px-4 py-3 font-semibold">Asal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    Tidak ada data BMN yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                items.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                      <div className="font-mono">{i.kode_barang || '-'}</div>
                      <div>NUP {i.nup || '-'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{i.name}</div>
                      {i.tkdn_percentage ? (
                        <div className="text-xs text-green-600">
                          TKDN {formatPercent(i.tkdn_percentage)}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{i.category}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-700">
                      {formatNumber(i.quantity)} {i.unit}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-800">
                      {formatRupiah(i.acquisition_value)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          CONDITION_STYLES[i.condition] ||
                          'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {i.condition}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{i.location}</td>
                    <td className="px-4 py-3">
                      {i.is_domestic ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Dalam Negeri
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                          <Globe2 className="h-3.5 w-3.5" /> Impor
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
