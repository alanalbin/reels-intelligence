import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Clock, Calendar, AlertTriangle, Globe, Info } from 'lucide-react';
import { PostingTimeAnalytics } from '../types';
import { fetchPostingTimeAnalytics } from '../services/api';

export const PostingTimePage: React.FC = () => {
  const [data, setData] = useState<PostingTimeAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPostingTimeAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return <div className="p-8 text-xs text-gray-500 animate-pulse">Analyzing temporal distribution patterns...</div>;
  }

  // Active hours with at least 1 reel
  const activeHours = data.by_hour.filter((h) => h.reels_count > 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Timezone & Sample Size Caution Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-3.5 flex items-start space-x-2.5 text-xs text-gray-700 shadow-2xs">
          <Globe className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            {data.timezone_note}
          </p>
        </div>
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3.5 flex items-start space-x-2.5 text-xs text-amber-900 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            {data.sample_size_warning}
          </p>
        </div>
      </div>

      {/* Main Charts: Hourly Performance & Weekday Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Views & Volume by Posting Hour */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Average Views by Publication Hour</h3>
              <p className="text-xs text-gray-500">Distribution across 24-hour UTC window</p>
            </div>
            <span className="text-xs font-mono text-gray-400">Hourly UTC</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeHours}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  tickFormatter={(v) => (v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`)}
                />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${Number(val).toLocaleString()} views (${item.payload.reels_count} Reels observed)`,
                    'Avg Views'
                  ]}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#E5E7EB', fontSize: 12 }}
                />
                <Bar dataKey="avg_views" fill="#1F2937" radius={[4, 4, 0, 0]}>
                  {activeHours.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.is_low_sample ? '#9CA3AF' : '#D62976'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-gray-500 flex items-center justify-between">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded bg-gray-400 mr-1.5" /> Low sample (&lt;3 reels)
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded bg-[#D62976] mr-1.5" /> Robust sample (&ge;3 reels)
            </span>
          </div>
        </div>

        {/* Engagement Rate by Weekday */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Mean Engagement Rate by Day of Week</h3>
              <p className="text-xs text-gray-500">Comparing audience interaction across Monday through Sunday</p>
            </div>
            <span className="text-xs font-mono text-gray-400">Weekly Cycle</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.by_weekday}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis unit="%" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val}% (${item.payload.reels_count} Reels published)`,
                    'Avg Engagement'
                  ]}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#E5E7EB', fontSize: 12 }}
                />
                <Bar dataKey="avg_engagement_rate" fill="#1F2937" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekday vs. Time Slot Matrix Heatmap */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Weekday vs. Daypart Performance Heatmap</h3>
            <p className="text-xs text-gray-500">Distribution of reels count and average reach by time quadrant</p>
          </div>
          <span className="text-xs font-mono text-gray-400">Time Blocks (UTC)</span>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                <th className="py-2.5 px-3">Weekday</th>
                <th className="py-2.5 px-3">Morning (06:00–11:59)</th>
                <th className="py-2.5 px-3">Afternoon (12:00–16:59)</th>
                <th className="py-2.5 px-3">Evening (17:00–21:59)</th>
                <th className="py-2.5 px-3">Night (22:00–05:59)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                const dayEntries = data.heatmap_matrix.filter((m) => m.day === day);
                const morning = dayEntries.find((m) => m.slot.startsWith('Morning'));
                const afternoon = dayEntries.find((m) => m.slot.startsWith('Afternoon'));
                const evening = dayEntries.find((m) => m.slot.startsWith('Evening'));
                const night = dayEntries.find((m) => m.slot.startsWith('Night'));

                const renderCell = (cell?: typeof morning) => {
                  if (!cell || cell.reels_count === 0) {
                    return <span className="text-gray-300 font-mono">—</span>;
                  }
                  return (
                    <div className="p-1.5 rounded bg-pink-50/60 border border-pink-100 text-xs">
                      <div className="font-semibold text-gray-900 font-tabular">
                        {(cell.avg_views / 1000).toFixed(0)}k views
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {cell.reels_count} reel{cell.reels_count > 1 ? 's' : ''} • {cell.avg_engagement_rate}% ER
                      </div>
                    </div>
                  );
                };

                return (
                  <tr key={day} className="hover:bg-gray-50/70">
                    <td className="py-3 px-3 font-semibold text-gray-900">{day}</td>
                    <td className="py-3 px-3">{renderCell(morning)}</td>
                    <td className="py-3 px-3">{renderCell(afternoon)}</td>
                    <td className="py-3 px-3">{renderCell(evening)}</td>
                    <td className="py-3 px-3">{renderCell(night)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
