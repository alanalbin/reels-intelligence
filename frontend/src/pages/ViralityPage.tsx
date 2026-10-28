import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, Cell
} from 'recharts';
import { Flame, ShieldAlert, Award, TrendingUp, Info } from 'lucide-react';
import { ViralityAnalytics, ReelItem } from '../types';
import { fetchViralityAnalytics } from '../services/api';
import { TierBadge } from '../components/TierBadge';
import { ReelDetailDrawer } from '../components/ReelDetailDrawer';

export const ViralityPage: React.FC = () => {
  const [data, setData] = useState<ViralityAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReel, setSelectedReel] = useState<ReelItem | null>(null);

  useEffect(() => {
    fetchViralityAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return <div className="p-8 text-xs text-gray-500 animate-pulse">Computing virality metrics...</div>;
  }

  const tierColors: Record<string, string> = {
    'Viral Hit': '#D62976',
    'High Reach': '#9333EA',
    'Moderate Reach': '#3B82F6',
    'Standard': '#9CA3AF'
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Correlation vs Causation Scientific Notice */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-4 text-xs text-amber-900 shadow-2xs">
        <div className="flex items-start space-x-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-semibold text-amber-950">Methodological Note: Correlation vs. Causation</h4>
            <p className="leading-relaxed text-amber-800">
              {data.correlation_notes}
            </p>
          </div>
        </div>
      </div>

      {/* Tier Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.avg_metrics_by_tier.map((tier) => (
          <div key={tier.tier} className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <TierBadge tier={tier.tier} />
              <span className="text-xs font-mono font-medium text-gray-500 font-tabular">
                {tier.percentage}% cohort
              </span>
            </div>
            <div className="text-2xl font-semibold text-gray-900 font-tabular mt-2">
              {tier.count} <span className="text-xs font-normal text-gray-500">Reels</span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Avg Views:</span>
                <span className="font-tabular font-medium text-gray-900">{tier.avg_views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Engagement:</span>
                <span className="font-tabular font-medium text-[#D62976]">{tier.avg_engagement_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Duration:</span>
                <span className="font-tabular font-medium text-gray-900">{tier.avg_duration}s</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Virality Score Histogram */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Virality Score Distribution (0–100 Scale)</h3>
              <p className="text-xs text-gray-500">Calculated via log-normalized reach and normalized audience interaction</p>
            </div>
            <span className="text-xs font-mono text-gray-400">10-Point Bins</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.virality_score_histogram}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="score_range" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} allowDecimals={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} Reels`, 'Frequency']}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#E5E7EB', fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#D62976" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier Averages Comparative */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Average Duration by Virality Tier</h3>
              <p className="text-xs text-gray-500">Investigating length distribution across reach tiers</p>
            </div>
            <span className="text-xs font-mono text-gray-400">Seconds</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.avg_metrics_by_tier}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="tier" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis unit="s" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} seconds`, 'Avg Duration']}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#E5E7EB', fontSize: 12 }}
                />
                <Bar dataKey="avg_duration" fill="#374151" radius={[4, 4, 0, 0]}>
                  {data.avg_metrics_by_tier.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={tierColors[entry.tier] || '#4B5563'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Reels Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Top-Performing Reels Ranked by Virality Index</h3>
            <p className="text-xs text-gray-500">Reels exhibiting highest composite reach and audience response scores</p>
          </div>
          <span className="text-xs font-medium text-gray-500">Top 10 Leaders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                <th className="py-2.5 px-4">Rank</th>
                <th className="py-2.5 px-4">Reel ID</th>
                <th className="py-2.5 px-4">Creator</th>
                <th className="py-2.5 px-4">Niche</th>
                <th className="py-2.5 px-4 text-right">Views</th>
                <th className="py-2.5 px-4 text-right">Likes</th>
                <th className="py-2.5 px-4 text-right">Comments</th>
                <th className="py-2.5 px-4 text-right">Engagement</th>
                <th className="py-2.5 px-4 text-right">Virality Score</th>
                <th className="py-2.5 px-4 text-center">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {data.top_performers.map((reel, idx) => (
                <tr
                  key={reel.reel_id}
                  onClick={() => setSelectedReel(reel)}
                  className="hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="py-2.5 px-4 font-semibold text-gray-500 font-tabular">#{idx + 1}</td>
                  <td className="py-2.5 px-4 font-mono font-medium text-gray-900">{reel.reel_id}</td>
                  <td className="py-2.5 px-4 font-medium text-gray-800">{reel.creator}</td>
                  <td className="py-2.5 px-4 text-gray-600">{reel.content_niche}</td>
                  <td className="py-2.5 px-4 text-right font-tabular font-semibold text-gray-900">{reel.views.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right font-tabular text-gray-600">{reel.likes.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right font-tabular text-gray-600">{reel.comments.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right font-tabular font-medium text-[#D62976]">{reel.engagement_rate}%</td>
                  <td className="py-2.5 px-4 text-right font-tabular font-semibold text-gray-900">{reel.virality_score}</td>
                  <td className="py-2.5 px-4 text-center">
                    <TierBadge tier={reel.virality_tier} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transparent Scoring Methodology Documentation */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">Documented Virality Scoring Methodology</h3>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          The project abstract specifies a <strong>log-normalized virality index on a 0–100 scale</strong> combining reach volume and engagement responsiveness. Because Instagram view counts exhibit heavy-tailed Pareto distributions, direct linear scaling would compress 95% of standard Reels into negligible percentiles.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 text-xs space-y-1.5">
            <span className="font-semibold text-gray-900">Reach Component (Weight: {data.methodology.reach_weight * 100}%)</span>
            <p className="text-gray-600">
              <code>Reach_Score = ((log10(views) - log10(min_views)) / (log10(max_views) - log10(min_views))) × 100</code>
            </p>
            <p className="text-[11px] text-gray-500">Provides balanced logarithmically normalized sensitivity across orders of magnitude.</p>
          </div>
          <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 text-xs space-y-1.5">
            <span className="font-semibold text-gray-900">Engagement Component (Weight: {data.methodology.engagement_weight * 100}%)</span>
            <p className="text-gray-600">
              <code>Engagement_Score = min(100, (Engagement_Rate / Benchmark_95th) × 100)</code>
            </p>
            <p className="text-[11px] text-gray-500">Normalizes interaction rate relative to top 5% empirical cohort benchmark ceiling.</p>
          </div>
        </div>
      </div>

      <ReelDetailDrawer reel={selectedReel} onClose={() => setSelectedReel(null)} />
    </div>
  );
};
