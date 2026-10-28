import React from 'react';
import {
  BookOpen, GitBranch, Shield, Code2, CheckCircle2, User, Award
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header Overview Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-md bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-wider">
            AM
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Aysha Malik • Research Study</h2>
            <p className="text-xs text-slate-500">Instagram Reels Performance & Virality Intelligence Platform</p>
          </div>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed pt-2">
          Engineered by <strong>Aysha Malik</strong> (Lead Data Scientist & ML Researcher), this analytical intelligence platform investigates the empirical factors governing reach volume, viewer retention, and engagement rates on Instagram Reels. Using verified public metrics collected via the <strong>Apify Instagram Scraper API</strong>, the research formalizes a log-normalized virality scoring model and multi-factor pre-publication predictive pipelines.
        </p>
      </div>

      {/* Project Objective & Author Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-rose-900" />
            <h3>Research Objective</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            To evaluate how quantifiable pre-publication signals—such as video duration, caption word density, hashtag volume, scheduling hours, and content category—relate to audience reach. The platform implements rigorous train/test holdouts without target leakage to establish authentic empirical baselines.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
            <User className="w-4 h-4 text-rose-900" />
            <h3>Lead Author & Technology Stack</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-semibold block text-slate-900">Principal Author</span>
              <span>Aysha Malik</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-semibold block text-slate-900">Backend Core</span>
              <span>FastAPI (Python 3.11)</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-semibold block text-slate-900">Machine Learning</span>
              <span>Scikit-Learn, Pandas, NumPy</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-semibold block text-slate-900">Frontend Client</span>
              <span>React 19, TypeScript, Recharts</span>
            </div>
          </div>
        </div>
      </div>

      {/* 9-Step Research Methodology */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
          <GitBranch className="w-4 h-4 text-rose-900" />
          <h3>Formal 9-Step Research Methodology</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {[
            { step: '01', title: 'Data Ingestion', desc: 'Harvesting public metrics via Apify Instagram Scraper API' },
            { step: '02', title: 'Schema Audit', desc: 'Type validation, duplicate detection, and null elimination' },
            { step: '03', title: 'Exploratory EDA', desc: 'Power-law Pareto distributions and dispersion metrics' },
            { step: '04', title: 'Feature Extraction', desc: 'Pre-publication caption tokenization and timestamp parsing' },
            { step: '05', title: 'Engagement Calculation', desc: 'Normalized engagement formula: ((Likes+Comments)/Views)×100' },
            { step: '06', title: 'Log-Virality Index', desc: 'Dual-component normalized reach and engagement index (0–100)' },
            { step: '07', title: 'Pipeline Modeling', desc: 'Random Forest, Logistic Regression, Decision Tree training' },
            { step: '08', title: 'Holdout Evaluation', desc: 'Confusion matrix, precision, recall, F1, MAE, R² metrics' },
            { step: '09', title: 'Executive Interface', desc: 'High-density, human-designed business intelligence interface' },
          ].map((item) => (
            <div key={item.step} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                <span>Phase {item.step}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div className="font-semibold text-slate-900">{item.title}</div>
              <div className="text-slate-500 text-[11px] leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ethical Considerations & Observational Boundaries */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
          <Shield className="w-4 h-4 text-rose-900" />
          <h3>Ethical Considerations & Observational Data Boundaries</h3>
        </div>
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            • <strong>Exclusivity of Public Signals:</strong> Data points are strictly limited to publicly observable parameters (view counts, likes, comments, captions, and publication timestamps). No restricted accounts, private direct messages, or user personal records were queried.
          </p>
          <p>
            • <strong>Inaccessibility of Internal Signals:</strong> Private platform signals—including video completion rate, direct message forwarding, audio re-use, and bookmark saves—are internal to Instagram Insights and cannot be observed through external APIs.
          </p>
          <p>
            • <strong>Descriptive Association vs. Causality:</strong> All statistical correlations presented reflect empirical patterns observed within this 88-reel cohort and must not be interpreted as guaranteed causal drivers of organic virality.
          </p>
        </div>
      </div>
    </div>
  );
};
