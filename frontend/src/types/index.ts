export interface ReelItem {
  reel_id: string;
  creator: string;
  content_niche: string;
  publication_timestamp: string;
  video_duration: number;
  views: number;
  likes: number;
  comments: number;
  engagement_rate: number;
  caption: string;
  caption_length: number;
  word_count: number;
  hashtag_count: number;
  posting_hour: number;
  day_of_week: string;
  virality_score: number;
  virality_tier: 'Viral Hit' | 'High Reach' | 'Moderate Reach' | 'Standard';
  niche_avg_views?: number;
  niche_avg_er?: number;
  views_percentile?: number;
  er_percentile?: number;
}

export interface ReelsResponse {
  items: ReelItem[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  available_creators: string[];
  available_niches: string[];
  available_tiers: string[];
}

export interface DashboardSummary {
  total_reels: number;
  total_views: number;
  avg_engagement_rate: number;
  avg_virality_score: number;
  viral_hits_count: number;
  creators_count: number;
  niches_count: number;
  dataset_version: string;
  is_reference_dataset: boolean;
  views_distribution: Array<{ range: string; count: number; min: number; max: number }>;
  engagement_distribution: Array<{ range: string; count: number }>;
  virality_tier_distribution: Array<{ tier: string; count: number }>;
  views_vs_engagement: Array<{
    reel_id: string;
    creator: string;
    niche: string;
    views: number;
    engagement_rate: number;
    virality_score: number;
    virality_tier: string;
  }>;
  timeline_performance: Array<{
    period: string;
    total_views: number;
    avg_views: number;
    avg_engagement_rate: number;
    reels_count: number;
  }>;
  niche_performance: Array<{
    niche: string;
    total_views: number;
    avg_views: number;
    avg_engagement_rate: number;
    avg_virality_score: number;
    reels_count: number;
  }>;
  recent_reels: ReelItem[];
}

export interface ViralityAnalytics {
  tier_distribution: Array<{ tier: string; count: number; percentage: number }>;
  avg_metrics_by_tier: Array<{
    tier: string;
    count: number;
    percentage: number;
    avg_views: number;
    avg_engagement_rate: number;
    avg_duration: number;
    avg_virality_score: number;
    min_views: number;
    max_views: number;
  }>;
  top_performers: ReelItem[];
  virality_score_histogram: Array<{ score_range: string; count: number }>;
  views_vs_engagement_matrix: Array<{
    reel_id: string;
    tier: string;
    views: number;
    engagement_rate: number;
    duration: number;
    niche: string;
  }>;
  methodology: {
    formula_name: string;
    reach_component: string;
    reach_weight: number;
    engagement_component: string;
    engagement_weight: number;
    tier_thresholds: Record<string, string>;
    parameters_configurable: boolean;
  };
  correlation_notes: string;
}

export interface EngagementAnalytics {
  mean_engagement_rate: number;
  median_engagement_rate: number;
  std_engagement_rate: number;
  p25: number;
  p75: number;
  min_engagement_rate: number;
  max_engagement_rate: number;
  distribution: Array<{ range: string; count: number }>;
  by_niche: Array<{
    niche: string;
    mean_engagement: number;
    median_engagement: number;
    std_engagement: number;
    reels_count: number;
  }>;
  by_creator: Array<{
    creator: string;
    mean_engagement: number;
    median_engagement: number;
    total_views: number;
    reels_count: number;
  }>;
  by_duration_group: Array<{
    duration_bucket: string;
    mean_engagement: number;
    median_engagement: number;
    avg_views: number;
    count: number;
  }>;
  likes_vs_comments: Array<{
    reel_id: string;
    views: number;
    likes: number;
    comments: number;
    engagement_rate: number;
    comments_to_likes_ratio: number;
  }>;
  duration_vs_engagement_scatter: Array<{
    reel_id: string;
    duration: number;
    engagement_rate: number;
    views: number;
    niche: string;
  }>;
  statistical_disclaimer: string;
}

export interface CaptionAnalytics {
  avg_caption_length: number;
  avg_word_count: number;
  avg_hashtag_count: number;
  avg_emoji_count: number;
  top_hashtags: Array<{
    hashtag: string;
    frequency: number;
    avg_views: number;
    avg_engagement: number;
  }>;
  top_keywords: Array<{ keyword: string; frequency: number }>;
  metrics_by_tier: Array<{
    tier: string;
    avg_words: number;
    avg_length: number;
    avg_hashtags: number;
    reels_count: number;
  }>;
  metrics_by_niche: Array<{
    niche: string;
    avg_words: number;
    avg_length: number;
    avg_hashtags: number;
  }>;
  sentiment_distribution: Array<{ sentiment: string; count: number; percentage: number }>;
  sentiment_disclaimer: string;
}

export interface PostingTimeAnalytics {
  by_hour: Array<{
    hour: string;
    hour_num: number;
    reels_count: number;
    avg_views: number;
    avg_engagement_rate: number;
    is_low_sample: boolean;
  }>;
  by_weekday: Array<{
    day: string;
    reels_count: number;
    avg_views: number;
    avg_engagement_rate: number;
  }>;
  heatmap_matrix: Array<{
    day: string;
    slot: string;
    reels_count: number;
    avg_views: number;
    avg_engagement_rate: number;
  }>;
  by_niche_hour: Array<{
    niche: string;
    hour: number;
    reels_count: number;
    avg_views: number;
  }>;
  timezone_note: string;
  sample_size_warning: string;
}

export interface ViralityPredictionRequest {
  video_duration: number;
  caption_word_count: number;
  hashtag_count: number;
  posting_hour: number;
  day_of_week: string;
  content_niche: string;
  caption_sample?: string;
}

export interface ViralityPredictionResponse {
  predicted_tier: string;
  tier_probabilities: Record<string, number>;
  model_name: string;
  model_version: string;
  feature_contributions: Array<{ feature: string; value: string; impact: string }>;
  confidence_level: string;
  caveat_notes: string;
}

export interface EngagementPredictionRequest {
  video_duration: number;
  caption_word_count: number;
  hashtag_count: number;
  posting_hour: number;
  day_of_week: string;
  content_niche: string;
}

export interface EngagementPredictionResponse {
  predicted_engagement_rate: number;
  confidence_interval_low: number;
  confidence_interval_high: number;
  benchmark_niche_average: number;
  model_name: string;
  model_r2_score: number;
  mae: number;
  limitations: string;
}

export interface ModelPerformanceReport {
  model_id: string;
  training_timestamp: string;
  dataset_version: string;
  total_records: number;
  train_records: number;
  test_records: number;
  classification_metrics: {
    algorithm: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    comparison: Array<{ algorithm: string; accuracy: number; f1_score: number }>;
  };
  regression_metrics: {
    algorithm: string;
    mae: number;
    rmse: number;
    r2_score: number;
  };
  confusion_matrix: {
    labels: string[];
    matrix: number[][];
  };
  feature_importance: Array<{ feature: string; importance: number }>;
  comparison_history: Array<{
    model_id: string;
    timestamp: string;
    records: number;
    clf_accuracy: number;
    reg_r2: number;
    reg_mae: number;
  }>;
  small_sample_discussion: string;
}

export interface DatasetValidationReport {
  total_rows: number;
  imported_rows: number;
  rejected_rows: number;
  duplicates_detected: number;
  missing_values_count: number;
  null_rate_percentage: number;
  columns_detected: string[];
  column_mappings: Record<string, string>;
  validation_status: string;
  validation_messages: string[];
  dataset_source: string;
  reference_comparison: {
    reference_reels: number;
    current_reels: number;
    reference_views: number;
    current_views: number;
    reference_avg_er: number;
    current_avg_er: number;
  };
}
