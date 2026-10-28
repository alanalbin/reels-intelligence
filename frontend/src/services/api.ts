import {
  DashboardSummary, ReelsResponse, ReelItem, ViralityAnalytics,
  EngagementAnalytics, CaptionAnalytics, PostingTimeAnalytics,
  ViralityPredictionRequest, ViralityPredictionResponse,
  EngagementPredictionRequest, EngagementPredictionResponse,
  ModelPerformanceReport, DatasetValidationReport
} from '../types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<any> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE}/dashboard/summary`);
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  return res.json();
}

export async function fetchReels(params: Record<string, any>): Promise<ReelsResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, String(val));
    }
  });
  const res = await fetch(`${API_BASE}/reels?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch reels list');
  return res.json();
}

export async function fetchReelById(reelId: string): Promise<ReelItem> {
  const res = await fetch(`${API_BASE}/reels/${reelId}`);
  if (!res.ok) throw new Error(`Failed to fetch reel ${reelId}`);
  return res.json();
}

export async function fetchViralityAnalytics(): Promise<ViralityAnalytics> {
  const res = await fetch(`${API_BASE}/analytics/virality`);
  if (!res.ok) throw new Error('Failed to fetch virality analytics');
  return res.json();
}

export async function fetchEngagementAnalytics(): Promise<EngagementAnalytics> {
  const res = await fetch(`${API_BASE}/analytics/engagement`);
  if (!res.ok) throw new Error('Failed to fetch engagement analytics');
  return res.json();
}

export async function fetchCaptionAnalytics(minFreq: number = 2): Promise<CaptionAnalytics> {
  const res = await fetch(`${API_BASE}/analytics/captions?min_freq=${minFreq}`);
  if (!res.ok) throw new Error('Failed to fetch caption analytics');
  return res.json();
}

export async function fetchPostingTimeAnalytics(): Promise<PostingTimeAnalytics> {
  const res = await fetch(`${API_BASE}/analytics/posting-time`);
  if (!res.ok) throw new Error('Failed to fetch posting time analytics');
  return res.json();
}

export async function uploadDatasetFile(file: File): Promise<DatasetValidationReport> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/dataset/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Upload failed');
  }
  return res.json();
}

export async function fetchValidationReport(): Promise<DatasetValidationReport> {
  const res = await fetch(`${API_BASE}/dataset/validation-report`);
  if (!res.ok) throw new Error('Failed to fetch validation report');
  return res.json();
}

export async function resetDataset(): Promise<any> {
  const res = await fetch(`${API_BASE}/dataset/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset dataset');
  return res.json();
}

export async function trainMLModels(testSize: number = 0.25): Promise<ModelPerformanceReport> {
  const res = await fetch(`${API_BASE}/models/train`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ test_size: testSize, random_state: 42 })
  });
  if (!res.ok) throw new Error('Model training failed');
  return res.json();
}

export async function fetchModelPerformance(): Promise<ModelPerformanceReport> {
  const res = await fetch(`${API_BASE}/models/performance`);
  if (!res.ok) throw new Error('Failed to fetch model performance');
  return res.json();
}

export async function predictViralityTier(payload: ViralityPredictionRequest): Promise<ViralityPredictionResponse> {
  const res = await fetch(`${API_BASE}/predict/virality`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Virality prediction failed');
  return res.json();
}

export async function predictEngagementRate(payload: EngagementPredictionRequest): Promise<EngagementPredictionResponse> {
  const res = await fetch(`${API_BASE}/predict/engagement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Engagement prediction failed');
  return res.json();
}
