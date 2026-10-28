import React, { useState } from 'react';
import {
  Target, AlertCircle, ShieldCheck, CheckCircle2,
  Compass, ArrowRight, SlidersHorizontal, BarChart3
} from 'lucide-react';
import {
  ViralityPredictionResponse, EngagementPredictionResponse
} from '../types';
import { predictViralityTier, predictEngagementRate } from '../services/api';
import { TierBadge } from '../components/TierBadge';

export const PredictionsPage: React.FC = () => {
  // Input features strictly pre-publication (No target leakage!)
  const [duration, setDuration] = useState<number>(24);
  const [wordCount, setWordCount] = useState<number>(32);
  const [hashtagCount, setHashtagCount] = useState<number>(5);
  const [postingHour, setPostingHour] = useState<number>(18);
  const [dayOfWeek, setDayOfWeek] = useState<string>('Thursday');
  const [niche, setNiche] = useState<string>('Technology & AI');
  const [captionSample, setCaptionSample] = useState<string>(
    '3 terminal commands I genuinely wish I discovered earlier in my career. Breakdown in caption below! #codingtips #developer #linux #ayshamalik'
  );

  const [viralityResult, setViralityResult] = useState<ViralityPredictionResponse | null>(null);
  const [engagementResult, setEngagementResult] = useState<EngagementPredictionResponse | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    setErrorMsg(null);

    const payload = {
      video_duration: Number(duration),
      caption_word_count: Number(wordCount),
      hashtag_count: Number(hashtagCount),
      posting_hour: Number(postingHour),
      day_of_week: dayOfWeek,
      content_niche: niche,
      caption_sample: captionSample
    };

    try {
      const [vRes, eRes] = await Promise.all([
        predictViralityTier(payload),
        predictEngagementRate(payload)
      ]);
      setViralityResult(vRes);
      setEngagementResult(eRes);
    } catch (err: any) {
      setErrorMsg(err.message || 'Forecast calculation failed');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Integrity & Author Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-start space-x-3 text-xs text-slate-700 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-900">Pre-Publication Empirical Model • Authored by Aysha Malik:</span>
            <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-mono text-[10px]">
              Zero Target Leakage
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            This forecast model analyzes only parameters observable prior to posting (video duration, caption density, hashtag volume, and scheduling windows). No post-hoc outcome metrics (views, likes, comments) enter the input feature vector.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">Planned Reel Parameters</h3>
            <p className="text-xs text-slate-500">Configure pre-publication attributes to forecast potential audience reach</p>
          </div>

          <form onSubmit={handlePredict} className="space-y-4 text-xs">
            {/* Content Niche */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">Content Category / Niche</label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-md bg-white focus:outline-none focus:border-rose-900 text-xs"
              >
                <option value="Technology & AI">Technology & AI</option>
                <option value="Fashion & Beauty">Fashion & Beauty</option>
                <option value="Fitness & Health">Fitness & Health</option>
                <option value="Food & Cooking">Food & Cooking</option>
                <option value="Travel & Lifestyle">Travel & Lifestyle</option>
              </select>
            </div>

            {/* Video Duration */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Video Duration (Seconds)</span>
                <span className="font-mono font-semibold text-rose-900">{duration}s</span>
              </div>
              <input
                type="range"
                min={5}
                max={90}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-rose-900"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-tabular">
                <span>5s (Short)</span>
                <span>30s (Median)</span>
                <span>90s (Long)</span>
              </div>
            </div>

            {/* Word Count & Hashtags Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Caption Word Count</label>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-md font-tabular text-xs"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Hashtag Count</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={hashtagCount}
                  onChange={(e) => setHashtagCount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-md font-tabular text-xs"
                />
              </div>
            </div>

            {/* Posting Day & Hour Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Scheduled Day</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md bg-white text-xs"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Scheduled Hour (UTC)</label>
                <select
                  value={postingHour}
                  onChange={(e) => setPostingHour(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-md bg-white font-tabular text-xs"
                >
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i} value={i}>{String(i).padStart(2, '0')}:00 UTC</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Draft Caption Preview */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">Draft Caption (Optional)</label>
              <textarea
                rows={3}
                value={captionSample}
                onChange={(e) => {
                  setCaptionSample(e.target.value);
                  const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                  setWordCount(words.length);
                  const tags = (e.target.value.match(/#\w+/g) || []).length;
                  setHashtagCount(tags);
                }}
                className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-rose-900 text-xs"
                placeholder="Type your caption to auto-derive word count and hashtag density..."
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded bg-rose-50 text-rose-800 text-xs border border-rose-200 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPredicting}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md transition shadow-2xs flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <Target className="w-4 h-4" />
              <span>{isPredicting ? 'Evaluating Holdout Pipelines...' : 'Calculate Audience Forecast'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Outcomes (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {!viralityResult && !isPredicting && (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-600">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Ready for Input Parameters</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Provide planned video length, caption density, and scheduled posting window on the left. Click <strong>Calculate Audience Forecast</strong> to project the expected reach tier and estimated audience interaction rate based on the 88-reel monitored cohort.
              </p>
            </div>
          )}

          {isPredicting && (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-xs space-y-3 animate-pulse">
              <div className="text-sm font-semibold text-slate-800">Processing holdout regression and classifier trees...</div>
              <div className="text-xs text-slate-400">Normalizing features and computing cross-validated probabilities</div>
            </div>
          )}

          {viralityResult && engagementResult && !isPredicting && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Classification Outcome</span>
                    <h3 className="text-base font-semibold text-slate-900">Projected Virality Classification</h3>
                  </div>
                  <TierBadge tier={viralityResult.predicted_tier} />
                </div>

                {/* Class Probabilities Bar */}
                <div className="space-y-2 text-xs">
                  <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Model Probability Distribution Across Tiers
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(viralityResult.tier_probabilities).map(([t, prob]) => (
                      <div key={t} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                        <div className="text-[11px] text-slate-600 truncate">{t}</div>
                        <div className="text-base font-semibold text-slate-900 font-tabular mt-0.5">{prob}%</div>
                        <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5">
                          <div className="bg-rose-900 h-1 rounded-full" style={{ width: `${prob}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engagement Rate Projection */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Continuous Regression Projection</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <div className="text-2xl font-bold text-rose-900 font-tabular">
                      {engagementResult.predicted_engagement_rate}%
                    </div>
                    <div className="text-xs text-slate-500">
                      Standard Error Range (±MAE):{' '}
                      <strong className="text-slate-800 font-tabular font-semibold">
                        {engagementResult.confidence_interval_low}% – {engagementResult.confidence_interval_high}%
                      </strong>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 flex justify-between bg-slate-50 p-2 rounded border border-slate-200">
                    <span>Niche Cohort Baseline ({niche}):</span>
                    <span className="font-semibold text-slate-800 font-tabular">{engagementResult.benchmark_niche_average}%</span>
                  </div>
                </div>

                {/* Feature Sensitivity Factors */}
                <div className="pt-3 border-t border-slate-100 text-xs">
                  <h4 className="font-semibold text-slate-800 mb-2">Sensitivity Impact Factors</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {viralityResult.feature_contributions.map((fc) => (
                      <div key={fc.feature} className="p-2 rounded bg-slate-50/80 border border-slate-200 flex justify-between items-center">
                        <div>
                          <div className="font-medium text-slate-800">{fc.feature}</div>
                          <div className="text-[11px] text-slate-500 font-tabular">{fc.value}</div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium">
                          {fc.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Caveat and Telemetry */}
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Algorithm:</span>
                    <span className="font-mono text-slate-700">{viralityResult.model_name}</span>
                  </div>
                  <p className="pt-1 text-slate-400 italic">
                    {viralityResult.caveat_notes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
