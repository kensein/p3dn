import { MapPin, Mail, Phone, Printer, Globe, ExternalLink } from 'lucide-react';

const SOCIAL = [
  { name: 'JMG', url: 'https://jmg.bmkg.go.id' },
  { name: 'BMKG', url: 'https://www.bmkg.go.id/' },
  { name: 'Facebook', url: 'https://facebook.com/BMKGIndonesia' },
  { name: 'Instagram', url: 'https://instagram.com/infobmkg' },
  { name: 'YouTube', url: 'https://youtube.com/user/BMKGIndonesia' },
];

export default function PortalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-[#334155] pb-10 md:grid-cols-2">
          {/* Kolom 1 — Kontak Kami */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#f6c453]">Kontak Kami</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f6c453]" />
                <span>
                  Jl. Angkasa I No. 2. Kemayoran, Jakarta 10720
                  <br />
                  P.O Box 3540 Jakarta
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#f6c453]" />
                <span>Telp. (021) 4246321 Ext. 1900</span>
              </li>
              <li className="flex items-start gap-3">
                <Printer className="mt-0.5 h-4 w-4 shrink-0 text-[#f6c453]" />
                <span>Fax. (021) 65866238</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#f6c453]" />
                <a
                  href="mailto:psimkg@bmkg.go.id"
                  className="hover:text-white hover:underline"
                >
                  psimkg@bmkg.go.id
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 2 — Tautan & Sosial */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#f6c453]">
              Tautan &amp; Sosial
            </h3>
            <ul className="grid grid-cols-2 gap-3 text-sm text-slate-300">
              {SOCIAL.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-white hover:underline"
                  >
                    {s.name === 'JMG' || s.name === 'BMKG' ? (
                      <Globe className="h-4 w-4 text-[#f6c453]" />
                    ) : (
                      <ExternalLink className="h-4 w-4 text-[#f6c453]" />
                    )}
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="pt-6 text-center text-xs text-slate-400">
          &copy; {year} — Badan Meteorologi, Klimatologi, dan Geofisika · PSIMKG
        </p>
      </div>
    </footer>
  );
}
