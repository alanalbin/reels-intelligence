import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell
} from 'recharts';
import {
  Eye, Activity, TrendingUp, Users, Layers, Award,
  ChevronRight, ShieldCheck
} from 'lucide-react';
import { DashboardSummary, ReelItem } from '../types';
import { MetricCard } from '../components/MetricCard';
import { TierBadge } from '../components/TierBadge';
import { ReelDetailDrawer } from '../components/ReelDetailDrawer';

interface DashboardPageProps {
  summary: DashboardSummary | null;
  isLoading: boolean;
  onNavigateToExplorer: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  summary,
  isLoading,
  onNavigateToExplorer
}) => {
  const [selectedReel, setSelectedReel] = useState<ReelItem | null>(null);

  if (isLoading || !summary) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-24 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-72 bg-slate-200 rounded-lg" />
          <div className="h-72 bg-slate-200 rounded-lg" />
        </div>
      </div>
    );
  }

  const tierColors: Record<string, string> = {
    'Viral Hit': '#9F1239',
    'High Reach': '#4338CA',
    'Moderate Reach': '#475569',
    'Standard': '#94A3B8'
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Verified Research Study Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-700 shadow-2xs gap-2">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-semibold text-slate-900">Aysha Malik Instagram Research Study:</span>
          <span>88 Empirical Reels • 40,966,919 Monitored Views • 7.58% Mean Engagement Rate</span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          9 Creators • 5 Niches • Zero Nulls
        </span>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard
          label="Total Views"
          value={(summary.total_views / 1_000_000).toFixed(2) + 'M'}
          subValue={`${summary.total_views.toLocaleString()} plays`}
          icon={<Eye className="w-4 h-4" />}
        />
        <MetricCard
          label="Avg Engagement"
          value={`${summary.avg_engagement_rate}%`}
          subValue="((Likes+Comments)/Views)"
          icon={<Activity className="w-4 h-4" />}
        />
        <MetricCard
          label="Virality Index"
          value={`${summary.avg_virality_score} / 100`}
          subValue="Log Reach + ER"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="Viral Hits"
          value={summary.viral_hits_count}
          badge="Score ≥ 75"
          subValue="Top Quintile"
          icon={<Award className="w-4 h-4" />}
        />
        <MetricCard
          label="Creators Monitored"
          value={summary.creators_count}
          subValue={`Across ${summary.niches_count} Niches`}
          icon={<Users className="w-4 h-4" />}
        />
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Views Distribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Views Distribution across Cohort</h3>
              <p className="text-xs text-slate-500">Frequency of Reels across audience reach brackets</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Histogram</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.views_distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} Reels`, 'Frequency']}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#CBD5E1', fontSize: 12, borderRadius: 6 }}
                />
                <Bar dataKey="count" fill="#334155" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Engagement Rate Distribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Engagement Rate Distribution</h3>
              <p className="text-xs text-slate-500">Spread of audience interaction rates</p>
            </div>
            <span className="text-xs font-mono text-slate-500 font-tabular">Mean: {summary.avg_engagement_rate}%</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.engagement_distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} Reels`, 'Count']}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#CBD5E1', fontSize: 12, borderRadius: 6 }}
                />
                <Bar dataKey="count" fill="#9F1239" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Views vs Engagement Scatter Plot */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Views versus Engagement Rate</h3>
              <p className="text-xs text-slate-500">Decomposition of reach volume against audience responsiveness</p>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-600">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-900" /> Viral Hit
              <span className="inline-block w-2 h-2 rounded-full bg-slate-600" /> Moderate
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  type="number"
                  dataKey="views"
                  name="Views"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={(v) => (v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`)}
                  label={{ value: 'Views (Scale)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#94A3B8' }}
                />
                <YAxis
                  type="number"
                  dataKey="engagement_rate"
                  name="Engagement Rate"
                  unit="%"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft', offset: 0, fontSize: 11, fill: '#94A3B8' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white border border-slate-200 p-2.5 rounded-md shadow-xs text-xs space-y-1">
                        <div className="font-semibold text-slate-900">{d.creator} ({d.reel_id})</div>
                        <div className="text-slate-600">Views: <span className="font-tabular font-medium">{d.views.toLocaleString()}</span></div>
                        <div className="text-slate-600">Engagement: <span className="font-tabular font-medium text-rose-900">{d.engagement_rate}%</span></div>
                        <div className="text-slate-500">Niche: {d.niche} • Tier: {d.virality_tier}</div>
                      </div>
                    );
                  }}
                />
                <Scatter data={summary.views_vs_engagement}>
                  {summary.views_vs_engagement.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={tierColors[entry.virality_tier] || '#64748B'} opacity={0.8} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Niche Performance */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Performance by Content Niche</h3>
              <p className="text-xs text-slate-500">Comparative mean engagement rate and aggregated views</p>
            </div>
            <span className="text-xs font-mono text-slate-400">5 Monitored Niches</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.niche_performance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis type="category" dataKey="niche" tick={{ fontSize: 11, fill: '#334155' }} width={130} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    name === 'avg_engagement_rate' ? `${val}%` : val.toLocaleString(),
                    name === 'avg_engagement_rate' ? 'Avg Engagement' : 'Total Views'
                  ]}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#CBD5E1', fontSize: 12, borderRadius: 6 }}
                />
                <Bar dataKey="avg_engagement_rate" fill="#1E293B" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Reels Table Section */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent Monitored Reels</h3>
            <p className="text-xs text-slate-500">Click any row to inspect complete engagement decomposition, hashtags, and benchmarks</p>
          </div>
          <button
            onClick={onNavigateToExplorer}
            className="inline-flex items-center space-x-1 text-xs font-medium text-rose-900 hover:text-rose-800 transition"
          >
            <span>Open in Reel Explorer</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-2.5 px-4">Reel ID</th>
                <th className="py-2.5 px-4">Creator</th>
                <th className="py-2.5 px-4">Content Niche</th>
                <th className="py-2.5 px-4 text-right">Duration</th>
                <th className="py-2.5 px-4 text-right">Views</th>
                <th className="py-2.5 px-4 text-right">Likes</th>
                <th className="py-2.5 px-4 text-right">Comments</th>
                <th className="py-2.5 px-4 text-right">Engagement</th>
                <th className="py-2.5 px-4 text-center">Virality Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {summary.recent_reels.map((reel) => (
                <tr
                  key={reel.reel_id}
                  onClick={() => setSelectedReel(reel)}
                  className="hover:bg-slate-50/80 cursor-pointer transition select-none"
                >
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-900">{reel.reel_id}</td>
                  <td className="py-2.5 px-4 font-medium text-slate-800">{reel.creator}</td>
                  <td className="py-2.5 px-4 text-slate-600">{reel.content_niche}</td>
                  <td className="py-2.5 px-4 text-right font-tabular text-slate-600">{reel.video_duration}s</td>
                  <td className="py-2.5 px-4 text-right font-tabular font-medium text-slate-900">
                    {reel.views.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-right font-tabular text-slate-600">{reel.likes.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right font-tabular text-slate-600">{reel.comments.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right font-tabular font-medium text-rose-900">
                    {reel.engagement_rate}%
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <TierBadge tier={reel.virality_tier} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReelDetailDrawer reel={selectedReel} onClose={() => setSelectedReel(null)} />
    </div>
  );
};
