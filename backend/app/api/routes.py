import math
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Query, HTTPException, Response
from fastapi.responses import JSONResponse

from app.schemas.models import (
    ReelsResponse, ReelItem, DashboardSummary, ViralityAnalytics,
    EngagementAnalytics, CaptionAnalytics, PostingTimeAnalytics,
    ViralityPredictionRequest, ViralityPredictionResponse,
    EngagementPredictionRequest, EngagementPredictionResponse,
    ModelTrainingRequest, ModelPerformanceReport, DatasetValidationReport
)
from app.services.data_service import DataService
from app.models.ml_service import MLService
from app.analytics.engine import AnalyticsEngine

router = APIRouter()

# Global service instances
data_service: Optional[DataService] = None
ml_service: Optional[MLService] = None
analytics_engine: Optional[AnalyticsEngine] = None


def init_services(ds: DataService, mls: MLService, ae: AnalyticsEngine):
    global data_service, ml_service, analytics_engine
    data_service = ds
    ml_service = mls
    analytics_engine = ae


@router.get("/health")
def get_health():
    df = data_service.get_active_dataset()
    return {
        "status": "healthy",
        "service": "Instagram Reels Performance & Virality Intelligence API",
        "version": "1.0.0",
        "dataset_loaded": not df.empty,
        "total_records": len(df),
        "dataset_version": data_service.dataset_version,
        "is_model_trained": ml_service.classification_pipeline is not None
    }


@router.get("/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary():
    df = data_service.get_active_dataset()
    summary = analytics_engine.get_dashboard_summary(df, dataset_version=data_service.dataset_version)
    return summary


@router.get("/reels", response_model=ReelsResponse)
def get_reels(
    creator: Optional[str] = None,
    niche: Optional[str] = None,
    virality_tier: Optional[str] = None,
    min_views: Optional[int] = None,
    max_views: Optional[int] = None,
    min_duration: Optional[int] = None,
    max_duration: Optional[int] = None,
    min_engagement: Optional[float] = None,
    max_engagement: Optional[float] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "views",
    sort_dir: Optional[str] = "desc",
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100)
):
    df = data_service.get_active_dataset().copy()

    # Filter metadata before filtering
    available_creators = sorted(df["creator"].unique().tolist())
    available_niches = sorted(df["content_niche"].unique().tolist())
    available_tiers = ["Viral Hit", "High Reach", "Moderate Reach", "Standard"]

    # Apply filters
    if creator:
        df = df[df["creator"] == creator]
    if niche:
        df = df[df["content_niche"] == niche]
    if virality_tier:
        df = df[df["virality_tier"] == virality_tier]
    if min_views is not None:
        df = df[df["views"] >= min_views]
    if max_views is not None:
        df = df[df["views"] <= max_views]
    if min_duration is not None:
        df = df[df["video_duration"] >= min_duration]
    if max_duration is not None:
        df = df[df["video_duration"] <= max_duration]
    if min_engagement is not None:
        df = df[df["engagement_rate"] >= min_engagement]
    if max_engagement is not None:
        df = df[df["engagement_rate"] <= max_engagement]

    # Search filter (creator or caption or reel_id)
    if search:
        s = search.lower().strip()
        df = df[
            df["creator"].str.lower().str.contains(s) |
            df["reel_id"].str.lower().str.contains(s) |
            df["caption"].str.lower().str.contains(s)
        ]

    # Sorting
    ascending = (sort_dir.lower() == "asc")
    if sort_by in df.columns:
        df = df.sort_values(by=sort_by, ascending=ascending)
    else:
        df = df.sort_values(by="views", ascending=False)

    total_count = len(df)
    total_pages = max(1, math.ceil(total_count / page_size))
    page = min(page, total_pages)

    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    sliced = df.iloc[start_idx:end_idx]

    items = [analytics_engine._row_to_dict(row) for _, row in sliced.iterrows()]

    return {
        "items": items,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "available_creators": available_creators,
        "available_niches": available_niches,
        "available_tiers": available_tiers
    }


@router.get("/reels/{reel_id}")
def get_reel_by_id(reel_id: str):
    df = data_service.get_active_dataset()
    match = df[df["reel_id"] == reel_id]
    if match.empty:
        raise HTTPException(status_code=404, detail=f"Reel ID '{reel_id}' not found.")
    row = match.iloc[0]
    reel_data = analytics_engine._row_to_dict(row)

    # Compute contextual ranking benchmarks
    niche = row["content_niche"]
    niche_df = df[df["content_niche"] == niche]
    reel_data["niche_avg_views"] = int(niche_df["views"].mean())
    reel_data["niche_avg_er"] = round(float(niche_df["engagement_rate"].mean()), 2)
    reel_data["views_percentile"] = round(float((df["views"] < row["views"]).mean() * 100), 1)
    reel_data["er_percentile"] = round(float((df["engagement_rate"] < row["engagement_rate"]).mean() * 100), 1)

    return reel_data


@router.get("/analytics/virality", response_model=ViralityAnalytics)
def get_virality_analytics():
    df = data_service.get_active_dataset()
    return analytics_engine.get_virality_analytics(df)


@router.get("/analytics/engagement", response_model=EngagementAnalytics)
def get_engagement_analytics():
    df = data_service.get_active_dataset()
    return analytics_engine.get_engagement_analytics(df)


@router.get("/analytics/captions", response_model=CaptionAnalytics)
def get_caption_analytics(min_freq: int = Query(2, ge=1, le=20)):
    df = data_service.get_active_dataset()
    return analytics_engine.get_caption_analytics(df, min_freq=min_freq)


@router.get("/analytics/posting-time", response_model=PostingTimeAnalytics)
def get_posting_time_analytics():
    df = data_service.get_active_dataset()
    return analytics_engine.get_posting_time_analytics(df)


@router.post("/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV format is supported.")

    content = await file.read()
    res = data_service.process_csv_upload(content, file.filename)
    if not res["success"]:
        raise HTTPException(status_code=422, detail=res["error"])

    # Auto-retrain ML models on the newly imported dataset
    df = data_service.get_active_dataset()
    try:
        ml_service.train_models(df)
    except Exception:
        pass

    return res["report"]


@router.get("/dataset/validation-report", response_model=DatasetValidationReport)
def get_validation_report():
    return data_service.get_validation_report()


@router.get("/dataset/export")
def export_dataset():
    csv_bytes = data_service.export_csv_bytes()
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=instagram_reels_{data_service.dataset_version}.csv"}
    )


@router.get("/dataset/template")
def download_template():
    tpl_bytes = data_service.get_template_bytes()
    return Response(
        content=tpl_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=instagram_reels_template.csv"}
    )


@router.post("/dataset/reset")
def reset_dataset():
    res = data_service.reset_to_reference()
    df = data_service.get_active_dataset()
    ml_service.train_models(df)
    return res


@router.post("/models/train", response_model=ModelPerformanceReport)
def train_models(payload: ModelTrainingRequest):
    df = data_service.get_active_dataset()
    try:
        report = ml_service.train_models(df, test_size=payload.test_size, random_state=payload.random_state)
        return report
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/models/performance", response_model=ModelPerformanceReport)
def get_model_performance():
    if ml_service.last_trained_meta is None:
        df = data_service.get_active_dataset()
        ml_service.train_models(df)
    return ml_service.last_trained_meta


@router.post("/predict/virality", response_model=ViralityPredictionResponse)
def predict_virality(payload: ViralityPredictionRequest):
    df = data_service.get_active_dataset()
    res = ml_service.predict_virality(payload.dict(), df)
    return res


@router.post("/predict/engagement", response_model=EngagementPredictionResponse)
def predict_engagement(payload: EngagementPredictionRequest):
    df = data_service.get_active_dataset()
    res = ml_service.predict_engagement(payload.dict(), df)
    return res
