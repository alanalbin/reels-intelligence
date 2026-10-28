import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.services.data_service import DataService
from app.models.ml_service import MLService
from app.analytics.engine import AnalyticsEngine
from app.api.routes import router as api_router, init_services

app = FastAPI(
    title="Instagram Reels Performance & Virality Intelligence API",
    description="Statistical Analysis, NLP Caption Intelligence, and Machine Learning Prediction Engine for Instagram Reels",
    version="1.0.0"
)

# Enable CORS for local Vite dev server and production clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Determine data directory relative to backend folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

# Initialize core services
data_service = DataService(data_dir=DATA_DIR)
ml_service = MLService()
analytics_engine = AnalyticsEngine()

# Pre-train baseline models on startup
initial_df = data_service.get_active_dataset()
if not initial_df.empty:
    try:
        ml_service.train_models(initial_df)
        print("ML baseline pipelines successfully initialized on startup.")
    except Exception as e:
        print(f"Startup training warning: {e}")

# Register router and inject dependencies
init_services(data_service, ml_service, analytics_engine)
app.include_router(api_router, prefix="/api")

# Serve production React SPA build
FRONTEND_DIST = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "frontend", "dist"))
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path == "api":
            return
        target = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.exists(target) and os.path.isfile(target):
            return FileResponse(target)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
