import React, { useState, useEffect } from 'react';
import {
  Search, Filter, RotateCcw, Download, ChevronLeft, ChevronRight,
  ArrowUpDown, ArrowUp, ArrowDown, Eye, Activity, Sparkles
} from 'lucide-react';
import { ReelItem, ReelsResponse } from '../types';
import { fetchReels } from '../services/api';
import { TierBadge } from '../components/TierBadge';
import { ReelDetailDrawer } from '../components/ReelDetailDrawer';

export const ExplorerPage: React.FC = () => {
  const [data, setData] = useState<ReelsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedReel, setSelectedReel] = useState<ReelItem | null>(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [creator, setCreator] = useState('');
  const [niche, setNiche] = useState('');
  const [tier, setTier] = useState('');
  const [minViews, setMinViews] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [sortBy, setSortBy] = useState('views');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchReels({
        page,
        page_size: pageSize,
        search,
        creator: creator || undefined,
        niche: niche || undefined,
        virality_tier: tier || undefined,
        min_views: minViews ? Number(minViews) : undefined,
        max_views: maxViews ? Number(maxViews) : undefined,
        min_duration: minDuration ? Number(minDuration) : undefined,
        max_duration: maxDuration ? Number(maxDuration) : undefined,
        sort_by: sortBy,
        sort_dir: sortDir,
      });
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, sortBy, sortDir, creator, niche, tier]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCreator('');
    setNiche('');
    setTier('');
    setMinViews('');
    setMaxViews('');
    setMinDuration('');
    setMaxDuration('');
    setSortBy('views');
    setSortDir('desc');
    setPage(1);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
    setPage(1);
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Search & Top Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Reel ID, creator handle, or caption keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#D62976] bg-gray-50/50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#D62976] hover:bg-[#BF2165] text-white text-xs font-medium rounded-md transition shadow-2xs"
          >
            Apply Search
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center space-x-1 px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium rounded-md transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </form>

        {/* Granular Dropdown & Range Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Creator</label>
            <select
              value={creator}
              onChange={(e) => { setCreator(e.target.value); setPage(1); }}
              className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white"
            >
              <option value="">All Creators (9)</option>
              {data?.available_creators.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Content Niche</label>
            <select
              value={niche}
              onChange={(e) => { setNiche(e.target.value); setPage(1); }}
              className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white"
            >
              <option value="">All Niches (5)</option>
              {data?.available_niches.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Virality Tier</label>
            <select
              value={tier}
              onChange={(e) => { setTier(e.target.value); setPage(1); }}
              className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white"
            >
              <option value="">All Tiers</option>
              {data?.available_tiers.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Min Views</label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={minViews}
              onChange={(e) => setMinViews(e.target.value)}
              onBlur={() => { setPage(1); loadData(); }}
              className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white font-tabular"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Max Views</label>
            <input
              type="number"
              placeholder="e.g. 2000000"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              onBlur={() => { setPage(1); loadData(); }}
              className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white font-tabular"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Sort Metric</label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white"
            >
              <option value="views">Views</option>
              <option value="engagement_rate">Engagement Rate</option>
              <option value="virality_score">Virality Score</option>
              <option value="video_duration">Duration</option>
              <option value="publication_timestamp">Publication Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600 bg-gray-50/50">
          <div>
            Showing <span className="font-semibold text-gray-900">{data?.items.length || 0}</span> of{' '}
            <span className="font-semibold text-gray-900">{data?.total_count || 0}</span> matching Reels
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-gray-500">Sorted by <strong className="text-gray-800">{sortBy}</strong> ({sortDir.toUpperCase()})</span>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto min-h-[380px]">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-gray-500 animate-pulse">
              Loading reels dataset...
            </div>
          ) : data?.items.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <p className="text-sm font-semibold text-gray-800">No matching Reels found</p>
              <p className="text-xs text-gray-500">Try adjusting your view thresholds or clearing filters</p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium select-none">
                  <th className="py-2.5 px-4">Reel ID</th>
                  <th className="py-2.5 px-4">Creator</th>
                  <th className="py-2.5 px-4">Content Niche</th>
                  <th className="py-2.5 px-4 cursor-pointer hover:text-gray-900 text-right" onClick={() => handleSort('video_duration')}>
                    <div className="inline-flex items-center space-x-1">
                      <span>Duration</span>
                      {sortBy === 'video_duration' && (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="py-2.5 px-4 cursor-pointer hover:text-gray-900 text-right" onClick={() => handleSort('views')}>
                    <div className="inline-flex items-center space-x-1">
                      <span>Views</span>
                      {sortBy === 'views' && (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="py-2.5 px-4 text-right">Likes</th>
                  <th className="py-2.5 px-4 text-right">Comments</th>
                  <th className="py-2.5 px-4 cursor-pointer hover:text-gray-900 text-right" onClick={() => handleSort('engagement_rate')}>
                    <div className="inline-flex items-center space-x-1">
                      <span>Engagement</span>
                      {sortBy === 'engagement_rate' && (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="py-2.5 px-4 cursor-pointer hover:text-gray-900 text-right" onClick={() => handleSort('virality_score')}>
                    <div className="inline-flex items-center space-x-1">
                      <span>Score</span>
                      {sortBy === 'virality_score' && (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="py-2.5 px-4 text-center">Virality Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {data?.items.map((reel) => (
                  <tr
                    key={reel.reel_id}
                    onClick={() => setSelectedReel(reel)}
                    className="hover:bg-gray-50/90 cursor-pointer transition select-none"
                  >
                    <td className="py-2.5 px-4 font-mono font-medium text-gray-900">{reel.reel_id}</td>
                    <td className="py-2.5 px-4 font-medium text-gray-800">{reel.creator}</td>
                    <td className="py-2.5 px-4 text-gray-600">{reel.content_niche}</td>
                    <td className="py-2.5 px-4 text-right font-tabular text-gray-600">{reel.video_duration}s</td>
                    <td className="py-2.5 px-4 text-right font-tabular font-semibold text-gray-900">
                      {reel.views.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-tabular text-gray-600">{reel.likes.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right font-tabular text-gray-600">{reel.comments.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right font-tabular font-medium text-[#D62976]">
                      {reel.engagement_rate}%
                    </td>
                    <td className="py-2.5 px-4 text-right font-tabular font-medium text-gray-900">
                      {reel.virality_score}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <TierBadge tier={reel.virality_tier} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {data && data.total_pages > 1 && (
          <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between text-xs bg-gray-50/60">
            <span className="text-gray-500 font-tabular">
              Page {data.page} of {data.total_pages}
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                disabled={page >= data.total_pages}
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                className="px-2.5 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <ReelDetailDrawer reel={selectedReel} onClose={() => setSelectedReel(null)} />
    </div>
  );
};
