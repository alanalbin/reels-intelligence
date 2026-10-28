import React from 'react';
import { X, Eye, Heart, MessageSquare, Clock, Tag, Calendar, Activity } from 'lucide-react';
import { ReelItem } from '../types';
import { TierBadge } from './TierBadge';

interface ReelDetailDrawerProps {
  reel: ReelItem | null;
  onClose: () => void;
}

export const ReelDetailDrawer: React.FC<ReelDetailDrawerProps> = ({ reel, onClose }) => {
  if (!reel) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div 
        className="w-full sm:max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-slate-500 uppercase">{reel.reel_id}</span>
              <TierBadge tier={reel.virality_tier} />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mt-0.5">{reel.creator}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center text-[11px] sm:text-xs text-slate-500 mb-1">
                <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" /> Views
              </div>
              <div className="text-base sm:text-lg font-semibold text-slate-900 font-tabular">
                {reel.views.toLocaleString()}
              </div>
              {reel.views_percentile !== undefined && (
                <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                  Top {Math.round(100 - reel.views_percentile)}%
                </div>
              )}
            </div>

            <div className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center text-[11px] sm:text-xs text-slate-500 mb-1">
                <Activity className="w-3.5 h-3.5 mr-1 text-slate-400" /> Engagement
              </div>
              <div className="text-base sm:text-lg font-semibold text-rose-900 font-tabular">
                {reel.engagement_rate}%
              </div>
              {reel.er_percentile !== undefined && (
                <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                  Top {Math.round(100 - reel.er_percentile)}%
                </div>
              )}
            </div>

            <div className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center text-[11px] sm:text-xs text-slate-500 mb-1">
                <Activity className="w-3.5 h-3.5 mr-1 text-slate-400" /> Score
              </div>
              <div className="text-base sm:text-lg font-semibold text-slate-900 font-tabular">
                {reel.virality_score} <span className="text-[11px] font-normal text-slate-400">/ 100</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                Composite Index
              </div>
            </div>
          </div>

          {/* Interaction Breakdown */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4">
            <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
              Audience Interaction Decomposition
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center"><Heart className="w-3 h-3 mr-1 text-rose-600" /> Likes</span>
                  <span className="font-tabular font-medium text-slate-900">{reel.likes.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className="bg-rose-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(100, (reel.likes / (reel.likes + reel.comments || 1)) * 100)}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center"><MessageSquare className="w-3 h-3 mr-1 text-blue-600" /> Comments</span>
                  <span className="font-tabular font-medium text-slate-900">{reel.comments.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(100, (reel.comments / (reel.likes + reel.comments || 1)) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
              <span>Comments-to-Likes Friction</span>
              <span className="font-medium text-slate-800 font-tabular">
                {((reel.comments / Math.max(1, reel.likes)) * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 space-y-2 text-xs">
            <h4 className="font-semibold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
              Publication & Content Metadata
            </h4>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center"><Tag className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Niche</span>
              <span className="font-medium text-slate-800">{reel.content_niche}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Runtime</span>
              <span className="font-medium text-slate-800 font-tabular">{reel.video_duration}s</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Timestamp</span>
              <span className="font-mono text-slate-800 text-[11px] truncate max-w-[200px]">{reel.publication_timestamp}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Caption Density</span>
              <span className="font-medium text-slate-800">{reel.word_count} words • {reel.hashtag_count} tags</span>
            </div>
          </div>

          {/* Full Caption */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4">
            <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Full Caption Content
            </h4>
            <div className="p-3 bg-slate-50 rounded text-xs text-slate-800 leading-relaxed font-sans border border-slate-100 select-text whitespace-pre-wrap">
              {reel.caption}
            </div>
          </div>

          {/* Niche Benchmark */}
          {reel.niche_avg_views && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
              <span className="font-medium text-slate-700">Niche Benchmark ({reel.content_niche})</span>
              <div className="flex justify-between text-slate-600">
                <span>Niche Avg Views:</span>
                <span className="font-medium font-tabular">{reel.niche_avg_views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Niche Avg Engagement:</span>
                <span className="font-medium font-tabular">{reel.niche_avg_er}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-100 transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
