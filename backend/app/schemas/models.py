from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ReelItem(BaseModel):
    reel_id: str
    creator: str
    content_niche: str
    publication_timestamp: str
    video_duration: int
    views: int
    likes: int
    comments: int
    engagement_rate: float
    caption: str
    caption_length: int
    word_count: int
    hashtag_count: int
    posting_hour: int
    day_of_week: str
    virality_score: Optional[float] = None
    virality_tier: Optional[str] = None


class ReelsFilterQuery(BaseModel):
    creator: Optional[str] = None
    niche: Optional[str] = None
    virality_tier: Optional[str] = None
    min_views: Optional[int] = None
    max_views: Optional[int] = None
    min_duration: Optional[int] = None
    max_duration: Optional[int] = None
    min_engagement: Optional[float] = None
    max_engagement: Optional[float] = None
    search: Optional[str] = None
    sort_by: Optional[str] = "views"
    sort_dir: Optional[str] = "desc"
    page: int = 1
    page_size: int = 15


class ReelsResponse(BaseModel):
    items: List[ReelItem]
    total_count: int
    page: int
    page_size: int
    total_pages: int
    available_creators: List[str]
    available_niches: List[str]
    available_tiers: List[str]


class DashboardSummary(BaseModel):
    total_reels: int
    total_views: int
    avg_engagement_rate: float
    avg_virality_score: float
    viral_hits_count: int
    creators_count: int
    niches_count: int
    dataset_version: str
    is_reference_dataset: bool
    views_distribution: List[Dict[str, Any]]
    engagement_distribution: List[Dict[str, Any]]
    virality_tier_distribution: List[Dict[str, Any]]
    views_vs_engagement: List[Dict[str, Any]]
    timeline_performance: List[Dict[str, Any]]
    niche_performance: List[Dict[str, Any]]
    recent_reels: List[ReelItem]


class ViralityAnalytics(BaseModel):
    tier_distribution: List[Dict[str, Any]]
    avg_metrics_by_tier: List[Dict[str, Any]]
    top_performers: List[ReelItem]
    virality_score_histogram: List[Dict[str, Any]]
    views_vs_engagement_matrix: List[Dict[str, Any]]
    methodology: Dict[str, Any]
    correlation_notes: str


class EngagementAnalytics(BaseModel):
    mean_engagement_rate: float
    median_engagement_rate: float
    std_engagement_rate: float
    p25: float
    p75: float
    min_engagement_rate: float
    max_engagement_rate: float
    distribution: List[Dict[str, Any]]
    by_niche: List[Dict[str, Any]]
    by_creator: List[Dict[str, Any]]
    by_duration_group: List[Dict[str, Any]]
    likes_vs_comments: List[Dict[str, Any]]
    duration_vs_engagement_scatter: List[Dict[str, Any]]
    statistical_disclaimer: str


class CaptionAnalytics(BaseModel):
    avg_caption_length: float
    avg_word_count: float
    avg_hashtag_count: float
    avg_emoji_count: float
    top_hashtags: List[Dict[str, Any]]
    top_keywords: List[Dict[str, Any]]
    metrics_by_tier: List[Dict[str, Any]]
    metrics_by_niche: List[Dict[str, Any]]
    sentiment_distribution: List[Dict[str, Any]]
    sentiment_disclaimer: str


class PostingTimeAnalytics(BaseModel):
    by_hour: List[Dict[str, Any]]
    by_weekday: List[Dict[str, Any]]
    heatmap_matrix: List[Dict[str, Any]]
    by_niche_hour: List[Dict[str, Any]]
    timezone_note: str
    sample_size_warning: str


class ViralityPredictionRequest(BaseModel):
    video_duration: int = Field(..., ge=1, le=300, description="Duration in seconds")
    caption_word_count: int = Field(..., ge=0, le=500, description="Word count of caption")
    hashtag_count: int = Field(..., ge=0, le=50, description="Number of hashtags")
    posting_hour: int = Field(..., ge=0, le=23, description="Hour of publication (0-23)")
    day_of_week: str = Field(..., description="Day of the week (e.g. Monday)")
    content_niche: str = Field(..., description="Content niche category")
    caption_sample: Optional[str] = ""


class ViralityPredictionResponse(BaseModel):
    predicted_tier: str
    tier_probabilities: Dict[str, float]
    model_name: str
    model_version: str
    feature_contributions: List[Dict[str, Any]]
    confidence_level: str
    caveat_notes: str


class EngagementPredictionRequest(BaseModel):
    video_duration: int = Field(..., ge=1, le=300)
    caption_word_count: int = Field(..., ge=0, le=500)
    hashtag_count: int = Field(..., ge=0, le=50)
    posting_hour: int = Field(..., ge=0, le=23)
    day_of_week: str
    content_niche: str


class EngagementPredictionResponse(BaseModel):
    predicted_engagement_rate: float
    confidence_interval_low: float
    confidence_interval_high: float
    benchmark_niche_average: float
    model_name: str
    model_r2_score: float
    mae: float
    limitations: str


class ModelTrainingRequest(BaseModel):
    test_size: float = 0.25
    random_state: int = 42
    models_to_train: Optional[List[str]] = ["Random Forest", "Logistic Regression", "Decision Tree"]


class ModelPerformanceReport(BaseModel):
    model_id: str
    training_timestamp: str
    dataset_version: str
    total_records: int
    train_records: int
    test_records: int
    classification_metrics: Dict[str, Any]
    regression_metrics: Dict[str, Any]
    confusion_matrix: Dict[str, Any]
    feature_importance: List[Dict[str, Any]]
    comparison_history: List[Dict[str, Any]]
    small_sample_discussion: str


class DatasetValidationReport(BaseModel):
    total_rows: int
    imported_rows: int
    rejected_rows: int
    duplicates_detected: int
    missing_values_count: int
    null_rate_percentage: float
    columns_detected: List[str]
    column_mappings: Dict[str, str]
    validation_status: str
    validation_messages: List[str]
    dataset_source: str
    reference_comparison: Dict[str, Any]
