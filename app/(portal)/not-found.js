import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function PortalNotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F4FC]">
        <FileQuestion className="h-8 w-8 text-[#0052A3]" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 text-slate-600">
        Konten yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0052A3] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003366]"
      >
        <Home className="h-4 w-4" />
        Kembali ke Beranda P3DN
      </Link>
    </div>
  );
}
