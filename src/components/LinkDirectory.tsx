import type { ReactNode } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PageHeader } from './PageHeader';
import { LINKS_DISCLAIMER, type LinkGroup, type SupportLink } from '../data/supportLinks';

export function LinkList({ links }: { links: SupportLink[] }) {
  return (
    <ul className="space-y-1">
      {links.map(link => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 py-1 text-teal-700 hover:text-teal-900 hover:underline break-words"
          >
            {link.name}
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

interface LinkDirectoryProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  groups: LinkGroup[];
  onBack?: () => void;
  children?: ReactNode;
}

/** Static list of external links grouped by condition, with English and Spanish columns. */
export function LinkDirectory({ title, subtitle, icon, groups, onBack, children }: LinkDirectoryProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-8">
      {onBack && (
        <button
          onClick={onBack}
          className="no-print inline-flex items-center gap-1.5 -ml-2 mb-2 sm:mb-4 px-2 min-h-[44px] rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t('Back to Home', 'Volver al inicio')}
        </button>
      )}
      <PageHeader icon={icon} tone="teal" title={title} subtitle={subtitle} />

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map(group => (
          <section key={group.title} className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{group.title}</h2>
            <div className="space-y-3">
              {group.en.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">English</h3>
                  <LinkList links={group.en} />
                </div>
              )}
              {group.es.length > 0 && (
                <div lang="es">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Español</h3>
                  <LinkList links={group.es} />
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {children}

      <footer className="mt-8 border-t border-gray-200 pt-4 text-sm text-gray-600 space-y-1">
        <p>{LINKS_DISCLAIMER.en}</p>
        <p lang="es">{LINKS_DISCLAIMER.es}</p>
      </footer>
    </div>
  );
}
