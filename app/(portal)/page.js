import Link from 'next/link';
import {
  Megaphone,
  BarChart3,
  FileText,
  Boxes,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Package,
  TrendingUp,
} from 'lucide-react';
import { getStatsSummary, getAnnouncements } from '../../lib/portal-data';
import { formatRupiahShort, formatPercent, formatDate } from '../../lib/format';

export const dynamic = 'force-dynamic';

const FEATURES = [
  {
    href: '/pengumuman',
    title: 'Pengumuman PBJ',
    desc: 'Informasi & pengumuman pengadaan barang/jasa terkini.',
    icon: Megaphone,
  },
  {
    href: '/statistik',
    title: 'Dashboard Statistik',
    desc: 'Realisasi TKDN, jumlah paket, dan nilai pengadaan PDN vs impor.',
    icon: BarChart3,
  },
  {
    href: '/dokumen',
    title: 'Dokumen & Regulasi',
    desc: 'SOP, peraturan, dan panduan P3DN untuk diunduh/dibaca.',
    icon: FileText,
  },
  {
    href: '/bmn',
    title: 'Data Inventaris BMN',
    desc: 'Tabel Barang Milik Negara dengan pencarian dan filter.',
    icon: Boxes,
  },
  {
    href: '/tautan',
    title: 'Tautan Sistem',
    desc: 'Akses cepat ke SPSE/LPSE, e-katalog, SIMAK-BMN, dan lainnya.',
    icon: ExternalLink,
  },
];

export default async function BerandaPage() {
  const [summary, latest] = await Promise.all([
    getStatsSummary(),
    getAnnouncements({ limit: 4 }),
  ]);

  const quickStats = [
    {
      label: 'Realisasi TKDN Terkini',
      value: formatPercent(summary.latestTkdn),
      icon: TrendingUp,
    },
    {
      label: 'Nilai Produk Dalam Negeri',
      value: formatRupiahShort(summary.totalDomestic),
      icon: ShieldCheck,
    },
    {
      label: 'Total Paket Pengadaan',
      value: summary.totalPackages.toLocaleString('id-ID'),
      icon: Package,
    },
    {
      label: 'Aset BMN Tercatat',
      value: summary.bmnCount.toLocaleString('id-ID'),
      icon: Boxes,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#003366] via-[#0052A3] to-[#0066CC] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              Peningkatan Penggunaan Produk Dalam Negeri
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Portal P3DN &amp; TKDN
              <span className="block text-[#f6c453]">
                Pusat Standardisasi Instrumen MKG
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-blue-100 sm:text-lg">
              Mendorong penggunaan produk dalam negeri pada pengadaan barang/jasa
              di lingkungan BMKG. Akses informasi pengadaan, statistik realisasi
              TKDN, dokumen regulasi, hingga data inventaris BMN dalam satu portal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/pengumuman"
                className="inline-flex items-center gap-2 rounded-xl bg-[#f5a623] px-6 py-3 font-semibold text-[#003366] transition hover:bg-[#f6c453]"
              >
                <Megaphone className="h-5 w-5" />
                Lihat Pengumuman
              </Link>
              <Link
                href="/statistik"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                <BarChart3 className="h-5 w-5" />
                Dashboard Statistik
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {quickStats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F4FC]">
                    <Icon className="h-5 w-5 text-[#0052A3]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#0052A3]">{s.value}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fitur utama */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Layanan Portal</h2>
          <p className="mt-1 text-slate-600">
            Lima layanan utama untuk mendukung pelaksanaan P3DN di PSIMKG.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.href}
                href={f.href}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#0066CC]/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0052A3] to-[#0066CC]">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#0066CC]">
                  Buka
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Pengumuman terbaru */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Pengumuman Terbaru
              </h2>
              <p className="mt-1 text-slate-600">
                Informasi pengadaan barang/jasa terkini.
              </p>
            </div>
            <Link
              href="/pengumuman"
              className="hidden items-center gap-1 text-sm font-medium text-[#0066CC] hover:underline sm:inline-flex"
            >
              Semua pengumuman
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {latest.map((a) => (
              <Link
                key={a.id}
                href={`/pengumuman/${a.slug}`}
                className="rounded-xl border border-slate-100 p-5 transition hover:border-[#0066CC]/40 hover:bg-[#E8F4FC]/40"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-[#E8F4FC] px-2.5 py-0.5 font-semibold text-[#0052A3]">
                    {a.category}
                  </span>
                  <span className="text-slate-400">
                    {formatDate(a.published_at)}
                  </span>
                </div>
                <h3 className="mt-2 font-semibold text-slate-900">{a.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {a.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
