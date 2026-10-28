import React from 'react';
import { X, ExternalLink, Activity, Eye, Heart, MessageSquare, Clock, Tag, Calendar } from 'lucide-react';
import { ReelItem } from '../types';
import { TierBadge } from './TierBadge';

interface ReelDetailDrawerProps {
  reel: ReelItem | null;
  onClose: () => void;
}

export const ReelDetailDrawer: React.FC<ReelDetailDrawerProps> = ({ reel, onClose }) => {
  if (!reel) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs transition-opacity">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-gray-200 animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-gray-500 uppercase">{reel.reel_id}</span>
              <TierBadge tier={reel.virality_tier} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mt-1">{reel.creator}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <Eye className="w-3.5 h-3.5 mr-1 text-gray-400" /> Views
              </div>
              <div className="text-lg font-semibold text-gray-900 font-tabular">
                {reel.views.toLocaleString()}
              </div>
              {reel.views_percentile !== undefined && (
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Top {Math.round(100 - reel.views_percentile)}% in cohort
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <Activity className="w-3.5 h-3.5 mr-1 text-gray-400" /> Engagement
              </div>
              <div className="text-lg font-semibold text-gray-900 font-tabular text-[#D62976]">
                {reel.engagement_rate}%
              </div>
              {reel.er_percentile !== undefined && (
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Top {Math.round(100 - reel.er_percentile)}% by ER
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <Activity className="w-3.5 h-3.5 mr-1 text-gray-400" /> Virality Score
              </div>
              <div className="text-lg font-semibold text-gray-900 font-tabular">
                {reel.virality_score} / 100
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Log reach + ER index
              </div>
            </div>
          </div>

          {/* Interaction Ratios */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Audience Interaction Decomposition
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="flex items-center"><Heart className="w-3.5 h-3.5 mr-1 text-red-500" /> Direct Likes</span>
                  <span className="font-tabular font-medium text-gray-900">{reel.likes.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className="bg-red-400 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(100, (reel.likes / (reel.likes + reel.comments || 1)) * 100)}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="flex items-center"><MessageSquare className="w-3.5 h-3.5 mr-1 text-blue-500" /> Comments</span>
                  <span className="font-tabular font-medium text-gray-900">{reel.comments.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(100, (reel.comments / (reel.likes + reel.comments || 1)) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
              <span>Comments-to-Likes Ratio</span>
              <span className="font-medium text-gray-800 font-tabular">
                {((reel.comments / Math.max(1, reel.likes)) * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Publication Metadata */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2.5 text-xs">
            <h4 className="font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Publication & Content Metadata
            </h4>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500 flex items-center"><Tag className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> Content Niche</span>
              <span className="font-medium text-gray-800">{reel.content_niche}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500 flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> Video Duration</span>
              <span className="font-medium text-gray-800 font-tabular">{reel.video_duration} seconds</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> Publication Timestamp</span>
              <span className="font-mono text-gray-800">{reel.publication_timestamp}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Posting Window</span>
              <span className="font-medium text-gray-800">{reel.day_of_week} at {String(reel.posting_hour).padStart(2, '0')}:00 UTC</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Caption Density</span>
              <span className="font-medium text-gray-800">{reel.word_count} words ({reel.caption_length} chars) • {reel.hashtag_count} hashtags</span>
            </div>
          </div>

          {/* Full Caption */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Full Caption Content
            </h4>
            <div className="p-3 bg-gray-50 rounded text-xs text-gray-800 leading-relaxed font-sans border border-gray-100 select-text">
              {reel.caption}
            </div>
          </div>

          {/* Niche Benchmark Comparison */}
          {reel.niche_avg_views && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-1.5">
              <span className="font-medium text-gray-700">Niche Baseline Comparison ({reel.content_niche})</span>
              <div className="flex justify-between text-gray-600">
                <span>Niche Avg Views:</span>
                <span className="font-medium font-tabular">{reel.niche_avg_views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Niche Avg Engagement:</span>
                <span className="font-medium font-tabular">{reel.niche_avg_er}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-100 transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
