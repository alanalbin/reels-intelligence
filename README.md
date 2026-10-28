# Instagram Reels Performance & Virality Intelligence Platform

An academic machine-learning and data analytics platform for examining the empirical determinants of short-form video performance on Instagram Reels. Engineered with a human-designed business intelligence interface, clean editorial aesthetics, and zero target leakage.

---

## 1. System Overview

This platform investigates how measurable pre-publication parameters (video duration, caption word count, hashtag count, posting time window, and content niche) relate to audience reach volume and engagement rate.

### Reference Dataset Specifications (Academic Abstract Benchmark)
- **Monitored Cohort:** 88 Instagram Reels
- **Monitored Creators:** 9 creators across 5 content categories
- **Aggregated Viewership:** 40,966,919 views
- **Mean Engagement Rate:** 7.58% (`((Likes + Comments) / Views) × 100`)
- **Data Integrity:** Zero duplicate records, 0.0% null rate
- **Publication Span:** 9 March 2024 to 8 September 2026
- **Data Collection Source:** Apify Instagram Scraper API (Public Metrics Only)

---

## 2. Architecture & Tech Stack

```
Aysha/
├── backend/
│   └── app/
│       ├── main.py               # FastAPI entrypoint, CORS, startup lifecycle
│       ├── api/routes.py         # 17 REST endpoints for analytics, ML, dataset
│       ├── analytics/engine.py   # Statistical engine, log-virality scoring, NLP
│       ├── models/ml_service.py  # Scikit-learn Random Forest, Logistic Regression, Decision Tree
│       ├── services/data_service.py # CSV parsing, schema audit, column mapping, export
│       ├── schemas/models.py     # Pydantic request & response schemas
│       └── data/
│           ├── instagram_reels_dataset.csv # 88-reel benchmark reference dataset
│           ├── template.csv      # CSV upload template
│           └── generate_dataset.py
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Root assembly with routing & state management
│   │   ├── components/           # Sidebar, TopBar, MetricCard, ReelDetailDrawer, TierBadge
│   │   ├── pages/                # 10 dedicated analytical pages
│   │   ├── services/api.ts       # Type-safe API client
│   │   ├── types/index.ts        # TypeScript domain models
│   │   └── index.css             # Tailored BI CSS design system
│   ├── vite.config.ts            # Vite bundler with Tailwind CSS & API proxying
│   └── package.json
└── README.md
```

- **Backend:** Python 3.11, FastAPI, Uvicorn, Pandas, NumPy, Scikit-learn
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Design Philosophy:** Minimalist business intelligence layout (Linear/Stripe style), charcoal typography, restrained borders, single subtle Instagram-berry accent (`#D62976`), modest corner radii (6–10px), no excessive gradients, no glowing neon cards.

---

## 3. Application Pages & Capabilities

1. **Analytics Dashboard:**
   - 6 Key Performance Indicators (Total Reels, Views, Mean Engagement Rate, Virality Index, Viral Hits, Creators Monitored)
   - Views Distribution histogram
   - Engagement Rate Distribution histogram
   - Views vs. Engagement Rate scatter plot with tier coloring
   - Performance by Content Niche comparative bar chart
   - Recent Reels table with interactive row selection
2. **Reel Explorer:**
   - Granular multi-filter bar (Creator, Content Niche, Virality Tier, Min/Max Views, Min/Max Duration, Sort Metric)
   - Real-time text search across Reel IDs, creator handles, and captions
   - Formatted numbers (e.g. 1,250,000 views)
   - Sortable columns with ascending/descending toggles
   - Pagination controls
   - Interactive `ReelDetailDrawer` displaying views percentile, engagement percentile, interaction decomposition (likes vs comments ratio), and full caption
3. **Virality Analysis:**
   - 4 Virality Tiers: `Viral Hit` (score ≥ 75.0), `High Reach` (50.0–74.9), `Moderate Reach` (30.0–49.9), and `Standard` (< 30.0)
   - Virality Score distribution histogram (10-point bins)
   - Average duration by tier
   - Top 10 performing Reels ranked by virality score
   - Documented scoring formula:
     $$\text{Reach Score} = \left(\frac{\log_{10}(\text{Views}) - \log_{10}(\text{Min Views})}{\log_{10}(\text{Max Views}) - \log_{10}(\text{Min Views})}\right) \times 100$$
     $$\text{Engagement Score} = \min\left(100, \frac{\text{Engagement Rate}}{\text{Benchmark}_{95\text{th}}} \times 100\right)$$
     $$\text{Virality Score} = 0.70 \times \text{Reach Score} + 0.30 \times \text{Engagement Score}$$
   - Prominent scientific notice distinguishing correlation from causation
4. **Engagement Analysis:**
   - Mathematical formula: `Engagement Rate = ((Likes + Comments) / Views) × 100` (zero views division handled safely)
   - Parametric (Mean) vs. Non-parametric (Median) toggle
   - Statistical dispersion: Mean, Median, Standard Deviation, IQR (P25–P75), Min, Max
   - Engagement by Content Niche and Monitored Creator
   - Video Duration Group brackets (`<15s`, `15–30s`, `31–60s`, `>60s`)
   - Duration vs. Engagement Rate exact scatter plot
   - Comments-to-Likes friction ratio analysis
5. **Caption & Hashtag Analysis:**
   - Average word count, character length, hashtag count, and emoji count
   - Minimum-frequency threshold slider (1 to 6 appearances)
   - Top frequent hashtags ranked with average views and engagement
   - Cleaned keyword frequency bar chart (excluding stop words)
   - Caption density metrics broken down by Virality Tier
   - Rule-based lexical sentiment analysis with clear model-estimate disclaimer
6. **Posting Time Analysis:**
   - 24-hour UTC distribution of average views and publication volume
   - Mean engagement rate across weekdays (Monday through Sunday)
   - Weekday vs. Daypart matrix heatmap (Morning, Afternoon, Evening, Night)
   - Low-sample statistical warnings highlighting hours with < 3 observations
7. **Machine Learning Predictions:**
   - **Zero Target Leakage:** Uses exclusively pre-publication features (`video_duration`, `caption_word_count`, `hashtag_count`, `posting_hour`, `day_of_week`, `content_niche`)
   - **Task A (Classification):** Predicts virality tier with full class probability distribution
   - **Task B (Regression):** Predicts expected engagement rate with confidence interval bounded by $\pm\text{MAE}$
   - Real-time feature contribution signals
8. **Dataset Management:**
   - CSV upload with client and backend validation
   - Automatic column detection and alias mapping
   - Data integrity checks (type casting, duplicate detection, negative metric filtering)
   - Full diagnostic audit report with downloadable JSON
   - CSV export of active dataset
   - Downloadable CSV template for imports
   - "Reset to Reference Cohort" button to restore the authentic 88-reel benchmark
9. **Model Performance & Evaluation:**
   - Evaluation metrics: Accuracy, Precision, Recall, Weighted F1-score
   - Regression metrics: MAE, RMSE, R²
   - Multi-class Confusion Matrix with diagonal hit highlighting
   - Relative MDI Feature Importance weights
   - Multi-algorithm benchmark comparison: Random Forest vs. Logistic Regression vs. Decision Tree
   - Retrain models action button with holdout validation
   - Small-sample boundary discussion ($n=88$)
10. **About the Project:**
    - Academic research objectives and scope
    - Complete technology stack overview
    - Formal 9-step methodology
    - Ethical considerations, data privacy, and absence of private Instagram signals (saves, direct message forwards, watch time completion rate)

---

## 4. Running Locally

### Prerequisites
- Python 3.10+ (with `pip`)
- Node.js v18+ (with `npm`)

### 1. Start the Backend Server
```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will start at `http://127.0.0.1:8000`.
- API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/health`

### 2. Start the Frontend Dev Server
```powershell
cd frontend
npm run dev
```
The Vite dev server will start at `http://localhost:5173`.
Navigate to `http://localhost:5173` in your browser.

---

## 5. Machine Learning Limitations & Ethical Note

- **Small Sample Cohort ($n=88$):** The initial dataset contains 88 Reels from 9 creators. While Random Forest captures non-linear interactions between duration and caption density, predictive performance should be interpreted as an empirical baseline rather than a universal recommender.
- **Observational Data:** High correlations between specific posting hours or durations and reach volume reflect historical distributions within this cohort, not guarantees of algorithmic virality.
