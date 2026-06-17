import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Globe2,
  Package,
  PieChart,
} from 'lucide-react';
import PageHeader from '../../../components/portal/PageHeader';
import { getStatsSummary } from '../../../lib/portal-data';
import {
  formatRupiah,
  formatRupiahShort,
  formatPercent,
  formatNumber,
} from '../../../lib/format';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard Statistik — Portal P3DN BMKG',
};

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
    </div>
  );
}

export default async function StatistikPage() {
  const summary = await getStatsSummary();
  const { stats } = summary;

  const maxValue = Math.max(
    1,
    ...stats.map((s) => Math.max(s.domestic_value, s.import_value))
  );
  const maxPackages = Math.max(1, ...stats.map((s) => s.package_count));

  return (
    <div>
      <PageHeader
        title="Dashboard Statistik P3DN"
        description="Ringkasan realisasi TKDN, jumlah paket, serta nilai pengadaan produk dalam negeri dibanding impor."
        icon={BarChart3}
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Kartu ringkasan */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={TrendingUp}
            label="Realisasi TKDN Terkini"
            value={formatPercent(summary.latestTkdn)}
            sub={summary.latest ? `Tahun ${summary.latest.year}` : ''}
            accent="bg-green-50 text-green-600"
          />
          <StatCard
            icon={ShieldCheck}
            label="Nilai Produk Dalam Negeri"
            value={formatRupiahShort(summary.totalDomestic)}
            sub={`Porsi PDN ${formatPercent(summary.domesticShare)}`}
            accent="bg-blue-50 text-[#0052A3]"
          />
          <StatCard
            icon={Globe2}
            label="Nilai Produk Impor"
            value={formatRupiahShort(summary.totalImport)}
            sub="Akumulasi seluruh tahun"
            accent="bg-amber-50 text-amber-600"
          />
          <StatCard
            icon={Package}
            label="Total Paket Pengadaan"
            value={formatNumber(summary.totalPackages)}
            sub={`${formatNumber(summary.announcementCount)} pengumuman aktif`}
            accent="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Grafik PDN vs Impor */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Nilai Pengadaan: Produk Dalam Negeri vs Impor
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-[#0066CC]" /> Dalam Negeri
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-[#f5a623]" /> Impor
              </span>
            </div>
          </div>
          <div className="flex items-end justify-around gap-4" style={{ height: 240 }}>
            {stats.map((s) => (
              <div
                key={s.year}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >
                <div className="flex h-full w-full items-end justify-center gap-1.5">
                  <div
                    className="w-1/3 rounded-t bg-[#0066CC]"
                    style={{
                      height: `${(s.domestic_value / maxValue) * 100}%`,
                    }}
                    title={`Dalam Negeri ${formatRupiah(s.domestic_value)}`}
                  />
                  <div
                    className="w-1/3 rounded-t bg-[#f5a623]"
                    style={{
                      height: `${(s.import_value / maxValue) * 100}%`,
                    }}
                    title={`Impor ${formatRupiah(s.import_value)}`}
                  />
                </div>
                <span className="mt-2 text-xs font-medium text-slate-600">
                  {s.year}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Tren realisasi TKDN */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">
              Tren Realisasi TKDN (%)
            </h2>
            <div className="space-y-3">
              {stats.map((s) => (
                <div key={s.year} className="flex items-center gap-3">
                  <span className="w-10 text-xs font-medium text-slate-500">
                    {s.year}
                  </span>
                  <div className="h-6 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-[#0052A3] to-[#0066CC] pr-2 text-[10px] font-semibold text-white"
                      style={{ width: `${Math.min(100, s.tkdn_realization)}%` }}
                    >
                      {formatPercent(s.tkdn_realization)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jumlah paket per tahun */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">
              Jumlah Paket Pengadaan per Tahun
            </h2>
            <div className="flex items-end justify-around gap-3" style={{ height: 180 }}>
              {stats.map((s) => (
                <div
                  key={s.year}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-1 text-xs font-semibold text-slate-700">
                    {s.package_count}
                  </span>
                  <div
                    className="w-2/3 rounded-t bg-[#003366]"
                    style={{ height: `${(s.package_count / maxPackages) * 100}%` }}
                  />
                  <span className="mt-2 text-xs font-medium text-slate-600">
                    {s.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Porsi BMN dalam negeri */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F4FC]">
              <PieChart className="h-5 w-5 text-[#0052A3]" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Komposisi Aset BMN
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-[#0052A3]">
                {formatNumber(summary.bmnCount)}
              </p>
              <p className="text-xs text-slate-500">Total aset tercatat</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-green-600">
                {formatNumber(summary.bmnDomestic)}
              </p>
              <p className="text-xs text-slate-500">Aset produk dalam negeri</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-[#f5a623]">
                {summary.bmnCount
                  ? formatPercent((summary.bmnDomestic / summary.bmnCount) * 100)
                  : '0%'}
              </p>
              <p className="text-xs text-slate-500">Porsi produk dalam negeri</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Data bersumber dari basis data portal P3DN (data contoh untuk
          demonstrasi). Angka akan menyesuaikan input resmi unit pengadaan.
        </p>
      </div>
    </div>
  );
}
