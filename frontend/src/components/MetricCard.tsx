import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  badge,
  icon
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
      <div className="flex items-center justify-between text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
        <span>{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-semibold text-gray-900 font-tabular tracking-tight">
          {value}
        </div>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium border border-gray-200">
            {badge}
          </span>
        )}
      </div>
      {subValue && (
        <div className="mt-1.5 text-xs text-gray-500 flex items-center">
          {subValue}
        </div>
      )}
    </div>
  );
};
