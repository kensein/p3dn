import {
  FileText,
  Download,
  ExternalLink,
  ScrollText,
  BookOpen,
  ClipboardList,
  FileSignature,
} from 'lucide-react';
import PageHeader from '../../../components/portal/PageHeader';
import { getDocuments, getDocumentTypes } from '../../../lib/portal-data';
import { formatDate } from '../../../lib/format';
import { withBasePath } from '../../../lib/base-path';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dokumen & Regulasi — Portal P3DN BMKG',
};

const TYPE_ICON = {
  Peraturan: ScrollText,
  SOP: ClipboardList,
  Panduan: BookOpen,
  Formulir: FileSignature,
};

export default async function DokumenPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const docType = typeof sp.jenis === 'string' ? sp.jenis : 'Semua';

  const [docs, types] = await Promise.all([
    getDocuments({ docType }),
    getDocumentTypes(),
  ]);

  return (
    <div>
      <PageHeader
        title="Dokumen & Regulasi"
        description="SOP, peraturan, panduan, dan formulir terkait P3DN/TKDN untuk dilihat atau diunduh."
        icon={FileText}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filter jenis dokumen */}
        <div className="mb-6 flex flex-wrap gap-2">
          <a
            href="?jenis=Semua"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              docType === 'Semua'
                ? 'bg-[#0052A3] text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-[#E8F4FC]'
            }`}
          >
            Semua
          </a>
          {types.map((t) => (
            <a
              key={t.doc_type}
              href={`?jenis=${encodeURIComponent(t.doc_type)}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                docType === t.doc_type
                  ? 'bg-[#0052A3] text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-[#E8F4FC]'
              }`}
            >
              {t.doc_type} ({t.total})
            </a>
          ))}
        </div>

        {docs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            Belum ada dokumen pada kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {docs.map((d) => {
              const Icon = TYPE_ICON[d.doc_type] || FileText;
              const href = d.external_url
                ? d.external_url
                : d.file_path
                  ? withBasePath(d.file_path)
                  : null;
              const isExternal = Boolean(d.external_url);
              return (
                <div
                  key={d.id}
                  className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F4FC]">
                    <Icon className="h-6 w-6 text-[#0052A3]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-600">
                        {d.doc_type}
                      </span>
                      {d.doc_number ? (
                        <span className="text-slate-400">{d.doc_number}</span>
                      ) : null}
                    </div>
                    <h2 className="mt-1.5 font-semibold text-slate-900">
                      {d.title}
                    </h2>
                    {d.description ? (
                      <p className="mt-1 text-sm text-slate-600">
                        {d.description}
                      </p>
                    ) : null}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {d.published_at ? formatDate(d.published_at) : `Tahun ${d.year || '-'}`}
                      </span>
                      {href ? (
                        <a
                          href={href}
                          target={isExternal ? '_blank' : '_self'}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0052A3] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#003366]"
                        >
                          {isExternal ? (
                            <>
                              <ExternalLink className="h-3.5 w-3.5" /> Buka
                            </>
                          ) : (
                            <>
                              <Download className="h-3.5 w-3.5" /> Unduh
                            </>
                          )}
                        </a>
                      ) : (
                        <span className="text-xs italic text-slate-400">
                          Segera tersedia
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
