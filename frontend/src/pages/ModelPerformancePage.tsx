import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  BarChart2, RefreshCw, ShieldAlert, Cpu, CheckCircle2,
  TrendingUp, Award, Layers
} from 'lucide-react';
import { ModelPerformanceReport } from '../types';
import { fetchModelPerformance, trainMLModels } from '../services/api';
import { MetricCard } from '../components/MetricCard';

export const ModelPerformancePage: React.FC = () => {
  const [data, setData] = useState<ModelPerformanceReport | null>(null);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retrainSuccess, setRetrainSuccess] = useState<boolean>(false);

  const loadData = () => {
    setIsLoading(true);
    fetchModelPerformance()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRetrain = async () => {
    setIsTraining(true);
    setRetrainSuccess(false);
    try {
      const res = await trainMLModels(0.25);
      setData(res);
      setRetrainSuccess(true);
      setTimeout(() => setRetrainSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTraining(false);
    }
  };

  if (isLoading || !data) {
    return <div className="p-8 text-xs text-gray-500 animate-pulse">Loading model performance telemetry...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Small Sample Boundary Discussion Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-4 text-xs text-amber-900 shadow-2xs">
        <div className="flex items-start space-x-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-semibold text-amber-950">Academic Machine Learning Small-Sample Notice (n=88)</h4>
            <p className="leading-relaxed text-amber-800">
              {data.small_sample_discussion}
            </p>
          </div>
        </div>
      </div>

      {/* Model Identification & Retrain Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-mono text-gray-400">{data.model_id}</span>
            <span className="px-1.5 py-0.5 rounded bg-pink-50 text-[#D62976] border border-pink-200 text-[10px] font-semibold">
              Scikit-Learn Pipeline
            </span>
          </div>
          <h2 className="text-base font-semibold text-gray-900 mt-0.5">
            Random Forest Ensemble & Comparative Benchmarks
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Trained on {data.train_records} records • Evaluated on {data.test_records} holdout records (75/25 split) • {data.training_timestamp}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {retrainSuccess && (
            <span className="text-xs text-emerald-600 flex items-center space-x-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pipelines Updated!</span>
            </span>
          )}
          <button
            onClick={handleRetrain}
            disabled={isTraining}
            className="px-4 py-2 bg-[#D62976] hover:bg-[#BF2165] text-white text-xs font-semibold rounded-md transition shadow-2xs flex items-center space-x-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
            <span>{isTraining ? 'Training Scikit-Learn...' : 'Retrain All Models'}</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <MetricCard
          label="Classification Accuracy"
          value={`${(data.classification_metrics.accuracy * 100).toFixed(1)}%`}
          subValue="Holdout Test Set"
          badge="Random Forest"
        />
        <MetricCard
          label="Weighted F1-Score"
          value={data.classification_metrics.f1_score.toFixed(3)}
          subValue="Harmonic Mean"
        />
        <MetricCard
          label="Precision"
          value={data.classification_metrics.precision.toFixed(3)}
          subValue="Weighted"
        />
        <MetricCard
          label="Recall"
          value={data.classification_metrics.recall.toFixed(3)}
          subValue="Sensitivity"
        />
        <MetricCard
          label="Regression MAE"
          value={`±${data.regression_metrics.mae}%`}
          subValue="Mean Absolute Err"
          badge="Engagement"
        />
        <MetricCard
          label="Regression RMSE"
          value={data.regression_metrics.rmse.toFixed(2)}
          subValue="Root Mean Sq Err"
        />
        <MetricCard
          label="Regression R²"
          value={data.regression_metrics.r2_score.toFixed(3)}
          subValue="Variance Explained"
        />
      </div>

      {/* Two Column Layout: Feature Importance & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Pre-Publication Feature Importance</h3>
              <p className="text-xs text-gray-500">MDI importance weights extracted from Random Forest trees</p>
            </div>
            <span className="text-xs font-mono text-gray-400">Sum = 100%</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.feature_importance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: '#374151' }} width={120} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Relative Importance']}
                  contentStyle={{ backgroundColor: '#FFF', borderColor: '#E5E7EB', fontSize: 12 }}
                />
                <Bar dataKey="importance" fill="#D62976" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix Visual Grid */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Classification Confusion Matrix</h3>
              <p className="text-xs text-gray-500">Predicted versus actual holdout virality tiers</p>
            </div>
            <span className="text-xs font-mono text-gray-400">{data.test_records} Validation Instances</span>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase">
                  <th className="p-2 text-left">Actual \ Predicted</th>
                  {data.confusion_matrix.labels.map((l) => (
                    <th key={l} className="p-2 truncate max-w-[80px]">{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.confusion_matrix.labels.map((actualLabel, rowIdx) => (
                  <tr key={actualLabel}>
                    <td className="p-2 text-left font-semibold text-gray-800 text-[11px]">{actualLabel}</td>
                    {data.confusion_matrix.matrix[rowIdx]?.map((val, colIdx) => {
                      const isDiagonal = rowIdx === colIdx;
                      return (
                        <td
                          key={colIdx}
                          className={`p-2.5 font-tabular font-semibold rounded ${
                            isDiagonal
                              ? val > 0 ? 'bg-pink-100 text-[#D62976]' : 'bg-gray-50 text-gray-400'
                              : val > 0 ? 'bg-gray-100 text-gray-700' : 'text-gray-300'
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-gray-400 pt-1">
            Diagonal cells highlight correct classifications. Off-diagonal numbers show misclassification errors.
          </p>
        </div>
      </div>

      {/* Model Algorithm Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Multi-Algorithm Comparative Benchmark</h3>
        <p className="text-xs text-gray-500">
          Comparing classification accuracy and weighted F1-score across evaluated model families
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                <th className="py-2.5 px-4">Algorithm Family</th>
                <th className="py-2.5 px-4">Model Type</th>
                <th className="py-2.5 px-4 text-right">Holdout Accuracy</th>
                <th className="py-2.5 px-4 text-right">Weighted F1</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {data.classification_metrics.comparison?.map((m) => (
                <tr key={m.algorithm} className="hover:bg-gray-50">
                  <td className="py-2.5 px-4 font-semibold text-gray-900">{m.algorithm}</td>
                  <td className="py-2.5 px-4 text-gray-500">Supervised Multi-class</td>
                  <td className="py-2.5 px-4 text-right font-tabular font-semibold text-gray-900">
                    {(m.accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-4 text-right font-tabular text-[#D62976] font-medium">
                    {m.f1_score.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {m.algorithm === 'Random Forest' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                        Primary Inference
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 text-[10px]">
                        Evaluated Baseline
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
