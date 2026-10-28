import React from 'react';
import { RefreshCw, Download, Calendar, Database, Shield } from 'lucide-react';

interface TopBarProps {
  title: string;
  description: string;
  datasetVersion: string;
  isReference: boolean;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  description,
  datasetVersion,
  isReference,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-base font-semibold text-slate-900 leading-tight tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Active Dataset Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700">
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium">
            {isReference ? 'Aysha Malik Cohort (88 Reels)' : datasetVersion}
          </span>
        </div>

        {/* Date Range Pill */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-tabular">Mar 2024 – Sep 2026</span>
        </div>

        {/* Quick CSV Export */}
        <a
          href="/api/dataset/export"
          download
          className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition shadow-2xs"
          title="Export Active Dataset as CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Export CSV</span>
        </a>

        {/* Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-md transition shadow-2xs disabled:opacity-50"
          title="Refresh Data Analytics"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-rose-700' : ''}`} />
        </button>

        {/* User Profile: Aysha Malik */}
        <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold tracking-wider shadow-xs">
            AM
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-none">
              Aysha Malik
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              Lead Data Scientist
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
