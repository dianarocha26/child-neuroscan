import { MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LinkDirectory, LinkList } from './LinkDirectory';
import { RESOURCE_GROUPS, LOCAL_RESOURCES } from '../data/supportLinks';

interface ResourceFinderProps {
  userId?: string;
  onBack?: () => void;
}

export default function ResourceFinder({ onBack }: ResourceFinderProps) {
  const { t } = useLanguage();

  return (
    <LinkDirectory
      icon={MapPin}
      title={t('Resources', 'Recursos')}
      subtitle={t('Trusted organizations for each condition, in English and Spanish',
        'Organizaciones confiables para cada condición, en inglés y español')}
      groups={RESOURCE_GROUPS}
      onBack={onBack}
    >
      <section className="mt-4 bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{LOCAL_RESOURCES.title}</h2>
        <LinkList links={LOCAL_RESOURCES.links} />
      </section>
    </LinkDirectory>
  );
}
