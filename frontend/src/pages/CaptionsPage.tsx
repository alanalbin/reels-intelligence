import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { Hash, AlignLeft, Smile, Sliders, ShieldAlert, Tag } from 'lucide-react';
import { CaptionAnalytics } from '../types';
import { fetchCaptionAnalytics } from '../services/api';
import { MetricCard } from '../components/MetricCard';

export const CaptionsPage: React.FC = () => {
  const [data, setData] = useState<CaptionAnalytics | null>(null);
  const [minFreq, setMinFreq] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = (freq: number) => {
    setIsLoading(true);
    fetchCaptionAnalytics(freq)
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData(minFreq);
  }, [minFreq]);

  if (isLoading && !data) {
    return <div className="p-8 text-xs text-gray-500 animate-pulse">Analyzing caption linguistics and hashtags...</div>;
  }

  if (!data) return null;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Model-Generated Sentiment Disclaimer Notice */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-3.5 flex items-start space-x-2.5 text-xs text-blue-900 shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          {data.sentiment_disclaimer}
        </p>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Avg Word Count"
          value={data.avg_word_count}
          subValue="Words per Caption"
          icon={<AlignLeft className="w-4 h-4" />}
        />
        <MetricCard
          label="Avg Characters"
          value={data.avg_caption_length}
          subValue="Length in Characters"
          icon={<AlignLeft className="w-4 h-4" />}
        />
        <MetricCard
          label="Avg Hashtags"
          value={data.avg_hashtag_count}
          subValue="Tags per Reel"
          icon={<Hash className="w-4 h-4" />}
        />
        <MetricCard
          label="Avg Emojis"
          value={data.avg_emoji_count}
          subValue="Visual Emoticons"
          icon={<Smile className="w-4 h-4" />}
        />
      </div>

      {/* Minimum Frequency Control Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between text-xs gap-3 shadow-2xs">
        <div className="flex items-center space-x-2 text-gray-700">
          <Sliders className="w-4 h-4 text-[#D62976]" />
          <span className="font-semibold">Token Frequency Filter Threshold:</span>
          <span className="text-gray-500">Excluding tokens with fewer than {minFreq} appearances</span>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs text-gray-500">Min Occurrences:</span>
          <input
            type="range"
            min={1}
            max={6}
            value={minFreq}
            onChange={(e) => setMinFreq(Number(e.target.value))}
            className="accent-[#D62976] cursor-pointer"
          />
          <span className="font-mono font-semibold text-gray-900 w-6 text-center">{minFreq}</span>
        </div>
      </div>

      {/* Two Column Charts: Top Hashtags & Top Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Hashtags Horizontal Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Most Frequent Hashtags</h3>
              <p className="text-xs text-gray-500">Hashtag occurrences in dataset captions</p>
            </div>
            <span className="text-xs font-mono text-gray-400">Tokens ≥ {minFreq}</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.top_hashtags.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} allowDecimals={false} />
                <YAxis type="category" dataKey="hashtag" tick={{ fontSize: 11, fill: '#374151' }} width={120} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} Reels (Avg Views: ${item.payload.avg_views.toLocaleString()}, Avg ER: ${item.payload.avg_engagement}%)`,
                    'Frequency'
                  ]}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#E5E7EB', fontSize: 12 }}
                />
                <Bar dataKey="frequency" fill="#D62976" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Keywords Frequency Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Top Caption Keywords (Excl. Stopwords)</h3>
              <p className="text-xs text-gray-500">Most salient lexical terms across Reels captions</p>
            </div>
            <span className="text-xs font-mono text-gray-400">Cleaned NLP Tokens</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.top_keywords.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} allowDecimals={false} />
                <YAxis type="category" dataKey="keyword" tick={{ fontSize: 11, fill: '#374151' }} width={100} />
                <Tooltip
                  formatter={(val: any) => [`${val} occurrences`, 'Frequency']}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#E5E7EB', fontSize: 12 }}
                />
                <Bar dataKey="frequency" fill="#1F2937" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Caption Characteristics by Virality Tier & Sentiment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Caption Metrics by Virality Tier Table */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Caption Characteristics by Virality Tier</h3>
          <p className="text-xs text-gray-500">Comparison of caption density across virality tiers</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                  <th className="py-2 px-3">Tier</th>
                  <th className="py-2 px-3 text-right">Avg Words</th>
                  <th className="py-2 px-3 text-right">Avg Length</th>
                  <th className="py-2 px-3 text-right">Avg Hashtags</th>
                  <th className="py-2 px-3 text-right">Reels</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {data.metrics_by_tier.map((row) => (
                  <tr key={row.tier} className="hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium text-gray-900">{row.tier}</td>
                    <td className="py-2 px-3 text-right font-tabular">{row.avg_words}</td>
                    <td className="py-2 px-3 text-right font-tabular">{row.avg_length} chars</td>
                    <td className="py-2 px-3 text-right font-tabular">{row.avg_hashtags}</td>
                    <td className="py-2 px-3 text-right font-tabular text-gray-500">{row.reels_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Sentiment Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Model-Estimated Caption Sentiment</h3>
            <span className="text-[11px] font-mono text-gray-400">Lexical Polarity</span>
          </div>
          <p className="text-xs text-gray-500">
            Categorized via rule-based polarity heuristics (educational approximation).
          </p>
          <div className="space-y-3 pt-2">
            {data.sentiment_distribution.map((sent) => (
              <div key={sent.sentiment} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-800">{sent.sentiment}</span>
                  <span className="font-tabular text-gray-500">{sent.count} Reels ({sent.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-[#D62976] h-2 rounded-full transition-all"
                    style={{ width: `${sent.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
