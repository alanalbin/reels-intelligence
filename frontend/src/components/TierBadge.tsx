import React from 'react';

interface TierBadgeProps {
  tier: string;
  size?: 'sm' | 'md';
}

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, size = 'md' }) => {
  const getStyles = () => {
    switch (tier) {
      case 'Viral Hit':
        return 'bg-rose-50 text-rose-900 border-rose-200 font-semibold';
      case 'High Reach':
        return 'bg-indigo-50 text-indigo-900 border-indigo-200 font-medium';
      case 'Moderate Reach':
        return 'bg-slate-100 text-slate-800 border-slate-200 font-medium';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 font-medium';
    }
  };

  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center rounded border ${sizeClass} ${getStyles()}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-60" />
      {tier}
    </span>
  );
};
