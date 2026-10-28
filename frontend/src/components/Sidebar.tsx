import React from 'react';
import {
  LayoutDashboard,
  Compass,
  TrendingUp,
  HeartHandshake,
  Hash,
  Clock,
  Target,
  Database,
  BarChart3,
  BookOpen
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'explorer'
  | 'virality'
  | 'engagement'
  | 'captions'
  | 'posting-time'
  | 'predictions'
  | 'dataset'
  | 'model-performance'
  | 'about';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  datasetVersion: string;
  totalRecords: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  datasetVersion,
  totalRecords,
}) => {
  const navItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'explorer' as PageId, label: 'Reel Explorer', icon: Compass },
    { id: 'virality' as PageId, label: 'Virality Analysis', icon: TrendingUp },
    { id: 'engagement' as PageId, label: 'Engagement Analysis', icon: HeartHandshake },
    { id: 'captions' as PageId, label: 'Caption & Hashtags', icon: Hash },
    { id: 'posting-time' as PageId, label: 'Posting Time Analysis', icon: Clock },
    { id: 'predictions' as PageId, label: 'Audience Forecaster', icon: Target },
    { id: 'dataset' as PageId, label: 'Dataset Management', icon: Database },
    { id: 'model-performance' as PageId, label: 'Model Evaluation', icon: BarChart3 },
    { id: 'about' as PageId, label: 'Research & Methodology', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen select-none shrink-0">
      {/* Brand & Author */}
      <div className="h-16 px-5 flex items-center border-b border-slate-200 bg-white">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-md bg-rose-900 flex items-center justify-center text-white font-bold text-xs shadow-xs tracking-wider">
            AM
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 leading-tight">
              Aysha Malik
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Reels Virality Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-0.5">
        <div className="px-2 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Analytical Intelligence
        </div>
        {navItems.slice(0, 7).map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition text-left ${
                isActive
                  ? 'bg-rose-50/80 text-rose-900 border border-rose-200/90 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-900' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        <div className="px-2 pt-4 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Platform & Models
        </div>
        {navItems.slice(7).map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition text-left ${
                isActive
                  ? 'bg-rose-50/80 text-rose-900 border border-rose-200/90 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-900' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dataset Status Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60">
        <div className="p-2.5 rounded-md border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-slate-500">Verified Cohort</span>
            <span className="inline-flex items-center text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1" />
              Active
            </span>
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-900 truncate font-tabular">
            {totalRecords} Monitored Reels
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
            Aysha Malik Study • {datasetVersion}
          </div>
        </div>
      </div>
    </aside>
  );
};
