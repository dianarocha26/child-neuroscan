import type { LucideIcon } from 'lucide-react';

type Tone = 'blue' | 'teal' | 'red' | 'amber' | 'purple' | 'slate' | 'green' | 'pink';

const TONES: Record<Tone, { tile: string; button: string }> = {
  blue: { tile: 'bg-blue-50 text-blue-600', button: 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500' },
  teal: { tile: 'bg-teal-50 text-teal-700', button: 'bg-teal-700 hover:bg-teal-800 focus-visible:ring-teal-500' },
  red: { tile: 'bg-red-50 text-red-600', button: 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500' },
  amber: { tile: 'bg-amber-50 text-amber-600', button: 'bg-amber-700 hover:bg-amber-800 focus-visible:ring-amber-500' },
  purple: { tile: 'bg-purple-50 text-purple-600', button: 'bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500' },
  slate: { tile: 'bg-slate-100 text-slate-700', button: 'bg-slate-700 hover:bg-slate-800 focus-visible:ring-slate-500' },
  green: { tile: 'bg-green-50 text-green-700', button: 'bg-green-700 hover:bg-green-800 focus-visible:ring-green-500' },
  pink: { tile: 'bg-pink-50 text-pink-600', button: 'bg-pink-600 hover:bg-pink-700 focus-visible:ring-pink-500' },
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  tone?: Tone;
  /** Primary page action. Full width on phones, auto width from sm up. */
  action?: { label: string; onClick: () => void; icon?: LucideIcon };
}

/**
 * Title block shared by the tracker screens so every page has the same
 * title size, icon tile, subtitle spacing and primary-button size.
 */
export function PageHeader({ title, subtitle, icon: Icon, tone = 'blue', action }: PageHeaderProps) {
  const colors = TONES[tone];
  const ActionIcon = action?.icon;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <span className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${colors.tile}`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm sm:text-base text-gray-600">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={`inline-flex items-center justify-center gap-2 h-11 px-5 w-full sm:w-auto flex-shrink-0 rounded-lg font-medium text-white whitespace-nowrap shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${colors.button}`}
        >
          {ActionIcon && <ActionIcon className="w-5 h-5" aria-hidden="true" />}
          {action.label}
        </button>
      )}
    </div>
  );
}
