import { MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LinkDirectory } from './LinkDirectory';
import { COMMUNITY_GROUPS } from '../data/supportLinks';

interface CommunityProps {
  userId?: string;
  onBack?: () => void;
}

export default function Community({ onBack }: CommunityProps) {
  const { t } = useLanguage();

  return (
    <LinkDirectory
      icon={MessageSquare}
      title={t('Community', 'Comunidad')}
      subtitle={t('Online communities where parents and people with each condition connect',
        'Comunidades en línea donde padres y personas con cada condición se conectan')}
      groups={COMMUNITY_GROUPS}
      onBack={onBack}
    />
  );
}
