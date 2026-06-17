'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Megaphone,
  BarChart3,
  FileText,
  Boxes,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { withBasePath } from '../../lib/base-path';

const NAV_ITEMS = [
  { href: '/', label: 'Beranda P3DN', icon: Home },
  { href: '/pengumuman', label: 'Pengumuman', icon: Megaphone },
  { href: '/statistik', label: 'Dashboard', icon: BarChart3 },
  { href: '/dokumen', label: 'Dokumen', icon: FileText },
  { href: '/bmn', label: 'BMN', icon: Boxes },
  { href: '/tautan', label: 'Tautan', icon: ExternalLink },
];

const PORTAL_HOME = 'https://psimkg.bmkg.go.id';

function LiveClock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    // Placeholder agar tidak terjadi hydration mismatch sebelum mounted.
    return <span suppressHydrationWarning>Memuat waktu…</span>;
  }

  const date = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(now);

  const time = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(now);

  return (
    <span suppressHydrationWarning>
      {date} · {time} WIB
    </span>
  );
}

function isActive(pathname, href) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PortalHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* TopBar tipis */}
      <div className="bg-[#003366] text-white text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8">
          <span className="truncate">
            <LiveClock />
          </span>
          <span className="font-medium tracking-wide">PSIMKG — BMKG</span>
        </div>
      </div>

      {/* Bar utama */}
      <div className="border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a
            href={PORTAL_HOME}
            className="flex items-center gap-3"
            title="Beranda portal PSIMKG"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath('/logo-bmkg.svg')}
              alt="Logo BMKG"
              width={40}
              height={40}
              className="h-10 w-10 shrink-0"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-[#0052A3]">PSIMKG</span>
              <span className="text-[11px] text-slate-500">
                Pusat Standardisasi Instrumen MKG
              </span>
            </div>
          </a>

          <span className="hidden rounded-full bg-[#E8F4FC] px-3 py-1 text-xs font-semibold text-[#0052A3] md:inline">
            Portal P3DN · TKDN
          </span>

          {/* Tombol menu mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Buka menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Navigasi internal P3DN (desktop) */}
      <nav className="hidden border-b border-slate-100 bg-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? 'border-[#0066CC] text-[#0052A3]'
                    : 'border-transparent text-slate-600 hover:bg-[#E8F4FC] hover:text-[#0052A3]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Navigasi mobile */}
      {mobileOpen && (
        <nav className="border-b border-slate-200 bg-white lg:hidden">
          <div className="space-y-1 px-4 py-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                    active
                      ? 'bg-[#0066CC] text-white'
                      : 'text-slate-700 hover:bg-[#E8F4FC]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
