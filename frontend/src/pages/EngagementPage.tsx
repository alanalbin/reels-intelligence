import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, Cell, LineChart, Line
} from 'recharts';
import { HeartHandshake, Info, ArrowUpDown, Clock, Heart, MessageSquare } from 'lucide-react';
import { EngagementAnalytics } from '../types';
import { fetchEngagementAnalytics } from '../services/api';
import { MetricCard } from '../components/MetricCard';

export const EngagementPage: React.FC = () => {
  const [data, setData] = useState<EngagementAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metricMode, setMetricMode] = useState<'mean' | 'median'>('mean');

  useEffect(() => {
    fetchEngagementAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return <div className="p-8 text-xs text-gray-500 animate-pulse">Calculating engagement statistics...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Statistical Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex items-start space-x-2.5 text-xs text-gray-600 shadow-2xs">
        <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          {data.statistical_disclaimer}
        </p>
      </div>

      {/* Summary Statistical KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Mean Engagement"
          value={`${data.mean_engagement_rate}%`}
          subValue="Cohort Average"
          badge="Parametric"
          icon={<HeartHandshake className="w-4 h-4" />}
        />
        <MetricCard
          label="Median Engagement"
          value={`${data.median_engagement_rate}%`}
          subValue="50th Percentile"
          badge="Robust"
          icon={<HeartHandshake className="w-4 h-4" />}
        />
        <MetricCard
          label="Std Deviation"
          value={`±${data.std_engagement_rate}%`}
          subValue="Cohort Dispersion"
        />
        <MetricCard
          label="IQR (P25 – P75)"
          value={`${data.p25}% – ${data.p75}%`}
          subValue="Middle 50% Spread"
        />
        <MetricCard
          label="Min Recorded"
          value={`${data.min_engagement_rate}%`}
          subValue="Lower Boundary"
        />
        <MetricCard
          label="Max Recorded"
          value={`${data.max_engagement_rate}%`}
          subValue="Peak Engagement"
        />
      </div>

      {/* Mode Toggle Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Engagement Comparative Breakdowns</h3>
        <div className="inline-flex rounded-md border border-gray-200 bg-white p-0.5 shadow-2xs text-xs">
          <button
            onClick={() => setMetricMode('mean')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              metricMode === 'mean' ? 'bg-[#D62976] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Show Mean Values
          </button>
          <button
            onClick={() => setMetricMode('median')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              metricMode === 'median' ? 'bg-[#D62976] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Show Median Values
          </button>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement by Content Niche */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Engagement by Content Niche</h3>
              <p className="text-xs text-gray-500">
                Displaying {metricMode === 'mean' ? 'arithmetic mean' : 'robust median'} engagement rate
              </p>
            </div>
            <span className="text-xs font-mono text-gray-400">Niche Breakdown</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.by_niche}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="niche" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis unit="%" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, metricMode === 'mean' ? 'Mean Engagement' : 'Median Engagement']}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#E5E7EB', fontSize: 12 }}
                />
                <Bar
                  dataKey={metricMode === 'mean' ? 'mean_engagement' : 'median_engagement'}
                  fill="#D62976"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement by Video Duration Group */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Engagement vs. Duration Groups</h3>
              <p className="text-xs text-gray-500">Audience responsiveness across standardized length brackets</p>
            </div>
            <span className="text-xs font-mono text-gray-400">4 Duration Bins</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.by_duration_group}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="duration_bucket" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis unit="%" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, metricMode === 'mean' ? 'Mean Engagement' : 'Median Engagement']}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#E5E7EB', fontSize: 12 }}
                />
                <Bar
                  dataKey={metricMode === 'mean' ? 'mean_engagement' : 'median_engagement'}
                  fill="#1F2937"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scatter: Video Duration vs Engagement Rate */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Exact Duration vs. Engagement Rate Scatter</h3>
              <p className="text-xs text-gray-500">Evaluating correlation between video length (seconds) and interaction</p>
            </div>
            <span className="text-xs font-mono text-gray-400">88 Points</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  type="number"
                  dataKey="duration"
                  name="Duration"
                  unit="s"
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  label={{ value: 'Video Duration (seconds)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#9CA3AF' }}
                />
                <YAxis
                  type="number"
                  dataKey="engagement_rate"
                  name="Engagement Rate"
                  unit="%"
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft', offset: 0, fontSize: 11, fill: '#9CA3AF' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white border border-gray-200 p-2 rounded shadow-sm text-xs">
                        <div className="font-semibold text-gray-900">{d.reel_id} ({d.niche})</div>
                        <div className="text-gray-600">Duration: {d.duration}s</div>
                        <div className="text-gray-600">Engagement: <span className="font-tabular font-medium text-[#D62976]">{d.engagement_rate}%</span></div>
                      </div>
                    );
                  }}
                />
                <Scatter data={data.duration_vs_engagement_scatter} fill="#D62976" opacity={0.75} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Creator Engagement Comparison */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Engagement by Monitored Creator</h3>
              <p className="text-xs text-gray-500">Benchmark across 9 creators monitored via Apify Scraper</p>
            </div>
            <span className="text-xs font-mono text-gray-400">Ranked</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.by_creator} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis type="category" dataKey="creator" tick={{ fontSize: 11, fill: '#374151' }} width={120} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, metricMode === 'mean' ? 'Mean Engagement' : 'Median Engagement']}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#E5E7EB', fontSize: 12 }}
                />
                <Bar
                  dataKey={metricMode === 'mean' ? 'mean_engagement' : 'median_engagement'}
                  fill="#4B5563"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Likes vs Comments Decomposition Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Likes vs. Comments Interaction Dynamics</h3>
        <p className="text-xs text-gray-500">
          Comments represent high-friction user actions compared to direct double-tap likes. In this cohort, comments average approximately 2.5% to 5.0% of total user engagements.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs">
            <span className="text-gray-500 block mb-1">Total Monitored Likes</span>
            <span className="text-lg font-semibold text-gray-900 font-tabular">
              {data.likes_vs_comments.reduce((acc, c) => acc + c.likes, 0).toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs">
            <span className="text-gray-500 block mb-1">Total Monitored Comments</span>
            <span className="text-lg font-semibold text-gray-900 font-tabular">
              {data.likes_vs_comments.reduce((acc, c) => acc + c.comments, 0).toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs">
            <span className="text-gray-500 block mb-1">Cohort Mean Comments-to-Likes Ratio</span>
            <span className="text-lg font-semibold text-[#D62976] font-tabular">
              {(
                (data.likes_vs_comments.reduce((acc, c) => acc + c.comments, 0) /
                 Math.max(1, data.likes_vs_comments.reduce((acc, c) => acc + c.likes, 0))) * 100
              ).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
