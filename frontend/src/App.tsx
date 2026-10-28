import React, { useState, useEffect } from 'react';
import { Sidebar, PageId } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardPage } from './pages/DashboardPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { ViralityPage } from './pages/ViralityPage';
import { EngagementPage } from './pages/EngagementPage';
import { CaptionsPage } from './pages/CaptionsPage';
import { PostingTimePage } from './pages/PostingTimePage';
import { PredictionsPage } from './pages/PredictionsPage';
import { DatasetPage } from './pages/DatasetPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { AboutPage } from './pages/AboutPage';
import { DashboardSummary } from './types';
import { fetchDashboardSummary } from './services/api';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const loadSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const data = await fetchDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const getPageMeta = (page: PageId) => {
    switch (page) {
      case 'dashboard':
        return {
          title: 'Analytics Dashboard',
          description: 'High-level performance KPIs, view distributions, and cohort summary'
        };
      case 'explorer':
        return {
          title: 'Reel Explorer',
          description: 'Multi-dimensional filtering, searching, and granular reel inspection'
        };
      case 'virality':
        return {
          title: 'Virality Analysis',
          description: 'Tier distributions, log-normalized virality scoring, and reach benchmarks'
        };
      case 'engagement':
        return {
          title: 'Engagement Analysis',
          description: 'Statistical dispersion, niche benchmarks, and interaction decompositions'
        };
      case 'captions':
        return {
          title: 'Caption & Hashtag Analysis',
          description: 'Lexical frequency, hashtag correlations, and linguistic density'
        };
      case 'posting-time':
        return {
          title: 'Posting Time Analysis',
          description: 'Hourly temporal distributions, weekday performance, and daypart matrix'
        };
      case 'predictions':
        return {
          title: 'Audience Forecaster',
          description: 'Pre-publication virality classification and engagement rate regression'
        };
      case 'dataset':
        return {
          title: 'Dataset Management',
          description: 'CSV data ingestion, schema validation diagnostics, and cohort auditing'
        };
      case 'model-performance':
        return {
          title: 'Model Evaluation',
          description: 'Scikit-Learn accuracy, confusion matrix, and feature importance telemetry'
        };
      case 'about':
        return {
          title: 'Research & Methodology',
          description: 'Academic objectives, Kaggle data source, 9-step methodology, and ethics'
        };
    }
  };

  const meta = getPageMeta(currentPage);

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-slate-900 font-sans overflow-hidden">
      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar
          currentPage={currentPage}
          onSelectPage={setCurrentPage}
          datasetVersion={summary?.dataset_version || 'v1.0-kaggle'}
          totalRecords={summary?.total_reels || 88}
        />
      </div>

      {/* Mobile Slide-Over Drawer Navigation */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileNavOpen(false)}
          />
          {/* Drawer Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar
              currentPage={currentPage}
              onSelectPage={setCurrentPage}
              datasetVersion={summary?.dataset_version || 'v1.0-kaggle'}
              totalRecords={summary?.total_reels || 88}
              onCloseMobile={() => setIsMobileNavOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Compact Top Navigation Bar */}
        <TopBar
          title={meta.title}
          description={meta.description}
          datasetVersion={summary?.dataset_version || 'v1.0-kaggle'}
          isReference={summary?.is_reference_dataset ?? true}
          onRefresh={loadSummary}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          isLoading={isLoadingSummary}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto">
          {currentPage === 'dashboard' && (
            <DashboardPage
              summary={summary}
              isLoading={isLoadingSummary}
              onNavigateToExplorer={() => setCurrentPage('explorer')}
            />
          )}

          {currentPage === 'explorer' && <ExplorerPage />}

          {currentPage === 'virality' && <ViralityPage />}

          {currentPage === 'engagement' && <EngagementPage />}

          {currentPage === 'captions' && <CaptionsPage />}

          {currentPage === 'posting-time' && <PostingTimePage />}

          {currentPage === 'predictions' && <PredictionsPage />}

          {currentPage === 'dataset' && (
            <DatasetPage onDatasetUpdated={loadSummary} />
          )}

          {currentPage === 'model-performance' && <ModelPerformancePage />}

          {currentPage === 'about' && <AboutPage />}
        </main>
      </div>
    </div>
  );
};

export default App;
