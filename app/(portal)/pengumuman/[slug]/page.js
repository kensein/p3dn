import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CalendarClock,
  CalendarX,
  FileText,
  Mail,
  Tag,
  Wallet,
} from 'lucide-react';
import { getAnnouncementBySlug } from '../../../../lib/portal-data';
import { formatRupiah, formatDate } from '../../../../lib/format';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await getAnnouncementBySlug(slug);
  return {
    title: a
      ? `${a.title} — Portal P3DN BMKG`
      : 'Pengumuman tidak ditemukan — Portal P3DN BMKG',
  };
}

export default async function PengumumanDetailPage({ params }) {
  const { slug } = await params;
  const a = await getAnnouncementBySlug(slug);
  if (!a) notFound();

  const meta = [
    { label: 'Kategori', value: a.category, icon: Tag },
    { label: 'Metode', value: a.method || '-', icon: FileText },
    {
      label: 'Pagu / HPS',
      value: Number(a.hps_value) > 0 ? formatRupiah(a.hps_value) : '-',
      icon: Wallet,
    },
    { label: 'Tanggal Terbit', value: formatDate(a.published_at), icon: CalendarClock },
    {
      label: 'Batas Akhir',
      value: a.closing_at ? formatDate(a.closing_at) : '-',
      icon: CalendarX,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/pengumuman"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0066CC] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar pengumuman
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-[#E8F4FC] px-2.5 py-0.5 font-semibold text-[#0052A3]">
          {a.category}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-600">
          {a.status}
        </span>
        {a.reference_no ? (
          <span className="text-slate-400">{a.reference_no}</span>
        ) : null}
      </div>

      <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
        {a.title}
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
        {meta.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F4FC]">
                <Icon className="h-4 w-4 text-[#0052A3]" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{m.label}</p>
                <p className="text-sm font-medium text-slate-800">{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <article className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {a.summary ? (
          <p className="mb-4 text-base font-medium text-slate-700">{a.summary}</p>
        ) : null}
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          {(a.content || '').split('\n').map((para, i) =>
            para.trim() ? <p key={i}>{para}</p> : null
          )}
        </div>

        {a.contact ? (
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <Mail className="h-4 w-4 text-[#0052A3]" />
            <span>
              Narahubung: <span className="font-medium">{a.contact}</span>
            </span>
          </div>
        ) : null}
      </article>
    </div>
  );
}
