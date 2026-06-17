import { ExternalLink, ArrowUpRight } from 'lucide-react';
import PageHeader from '../../../components/portal/PageHeader';
import { getExternalLinks } from '../../../lib/portal-data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tautan Sistem Eksternal — Portal P3DN BMKG',
};

export default async function TautanPage() {
  const links = await getExternalLinks();

  // Kelompokkan per kategori
  const grouped = links.reduce((acc, link) => {
    (acc[link.category] = acc[link.category] || []).push(link);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Tautan Sistem Eksternal"
        description="Akses cepat ke sistem terkait pengadaan, aset, dan TKDN. Tautan dibuka di tab baru."
        icon={ExternalLink}
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#0066CC]/30 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0052A3] to-[#0066CC]">
                    <ExternalLink className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {link.name}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-[#0066CC]" />
                    </div>
                    {link.description ? (
                      <p className="mt-1 text-sm text-slate-600">
                        {link.description}
                      </p>
                    ) : null}
                    <p className="mt-2 truncate text-xs text-slate-400">
                      {link.url}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
