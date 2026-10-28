import math
import re
from typing import List, Dict, Any, Tuple
import pandas as pd
import numpy as np


class AnalyticsEngine:
    def __init__(self, reach_weight: float = 0.70, engagement_weight: float = 0.30):
        self.reach_weight = reach_weight
        self.engagement_weight = engagement_weight

    def calculate_derived_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculates engagement rate, virality scores, and virality tiers for a dataframe.
        """
        df = df.copy()

        # Safe engagement rate calculation
        if "engagement_rate" not in df.columns or df["engagement_rate"].isnull().any():
            def safe_er(row):
                views = float(row.get("views", 0))
                likes = float(row.get("likes", 0))
                comments = float(row.get("comments", 0))
                if views <= 0:
                    return 0.0
                return round(((likes + comments) / views) * 100.0, 3)
            df["engagement_rate"] = df.apply(safe_er, axis=1)

        # Precompute log-normalized virality score
        min_views = max(1.0, float(df["views"].min())) if len(df) > 0 else 1.0
        max_views = float(df["views"].max()) if len(df) > 0 else 1000000.0
        log_min = math.log10(min_views)
        log_max = math.log10(max_views) if max_views > min_views else (log_min + 1.0)

        # 95th percentile engagement rate as benchmark ceiling
        er_benchmark = float(np.percentile(df["engagement_rate"], 95)) if len(df) > 0 else 15.0
        er_benchmark = max(er_benchmark, 5.0)

        def compute_virality(row):
            v = max(1.0, float(row.get("views", 1.0)))
            log_v = math.log10(v)
            reach_norm = max(0.0, min(100.0, ((log_v - log_min) / (log_max - log_min)) * 100.0))
            
            er = float(row.get("engagement_rate", 0.0))
            eng_norm = max(0.0, min(100.0, (er / er_benchmark) * 100.0))

            score = (self.reach_weight * reach_norm) + (self.engagement_weight * eng_norm)
            return round(score, 1)

        df["virality_score"] = df.apply(compute_virality, axis=1)

        def assign_tier(score):
            if score >= 75.0:
                return "Viral Hit"
            elif score >= 50.0:
                return "High Reach"
            elif score >= 30.0:
                return "Moderate Reach"
            else:
                return "Standard"

        df["virality_tier"] = df["virality_score"].apply(assign_tier)

        # Parse caption length, word count, hashtag count if missing
        if "word_count" not in df.columns:
            df["word_count"] = df["caption"].fillna("").apply(lambda s: len(str(s).split()))
        if "caption_length" not in df.columns:
            df["caption_length"] = df["caption"].fillna("").apply(lambda s: len(str(s)))
        if "hashtag_count" not in df.columns:
            df["hashtag_count"] = df["caption"].fillna("").apply(lambda s: len(re.findall(r"#\w+", str(s))))

        return df

    def get_dashboard_summary(self, df: pd.DataFrame, dataset_version: str = "v1.0-reference") -> Dict[str, Any]:
        if df.empty:
            return {
                "total_reels": 0, "total_views": 0, "avg_engagement_rate": 0.0,
                "avg_virality_score": 0.0, "viral_hits_count": 0, "creators_count": 0,
                "niches_count": 0, "dataset_version": dataset_version, "is_reference_dataset": False,
                "views_distribution": [], "engagement_distribution": [],
                "virality_tier_distribution": [], "views_vs_engagement": [],
                "timeline_performance": [], "niche_performance": [], "recent_reels": []
            }

        total_reels = int(len(df))
        total_views = int(df["views"].sum())
        avg_er = round(float(df["engagement_rate"].mean()), 2)
        avg_score = round(float(df["virality_score"].mean()), 1)
        viral_hits = int((df["virality_tier"] == "Viral Hit").sum())
        creators_count = int(df["creator"].nunique())
        niches_count = int(df["content_niche"].nunique())

        # Views histogram (5 buckets)
        v_min, v_max = float(df["views"].min()), float(df["views"].max())
        bins = np.linspace(v_min, v_max, 6)
        v_counts, _ = np.histogram(df["views"], bins=bins)
        views_dist = []
        for i in range(len(v_counts)):
            b_start = int(bins[i])
            b_end = int(bins[i+1])
            label = f"{self._format_compact(b_start)}–{self._format_compact(b_end)}"
            views_dist.append({"range": label, "count": int(v_counts[i]), "min": b_start, "max": b_end})

        # Engagement histogram (5 buckets)
        er_min, er_max = float(df["engagement_rate"].min()), float(df["engagement_rate"].max())
        er_bins = np.linspace(er_min, er_max, 6)
        er_counts, _ = np.histogram(df["engagement_rate"], bins=er_bins)
        er_dist = []
        for i in range(len(er_counts)):
            er_dist.append({
                "range": f"{er_bins[i]:.1f}%–{er_bins[i+1]:.1f}%",
                "count": int(er_counts[i])
            })

        # Virality tier distribution
        tier_counts = df["virality_tier"].value_counts().to_dict()
        tier_dist = [
            {"tier": tier, "count": int(tier_counts.get(tier, 0))}
            for tier in ["Viral Hit", "High Reach", "Moderate Reach", "Standard"]
        ]

        # Views vs Engagement scatter plot
        scatter = [
            {
                "reel_id": row["reel_id"],
                "creator": row["creator"],
                "niche": row["content_niche"],
                "views": int(row["views"]),
                "engagement_rate": round(float(row["engagement_rate"]), 2),
                "virality_score": float(row["virality_score"]),
                "virality_tier": row["virality_tier"]
            }
            for _, row in df.iterrows()
        ]

        # Timeline performance (grouped by month/quarter)
        df_time = df.copy()
        df_time["pub_date"] = pd.to_datetime(df_time["publication_timestamp"], errors="coerce")
        df_time = df_time.dropna(subset=["pub_date"])
        df_time["period"] = df_time["pub_date"].dt.strftime("%Y-%m")
        time_grouped = df_time.groupby("period").agg(
            views=("views", "sum"),
            avg_views=("views", "mean"),
            avg_er=("engagement_rate", "mean"),
            count=("reel_id", "count")
        ).reset_index().sort_values("period")

        timeline = [
            {
                "period": row["period"],
                "total_views": int(row["views"]),
                "avg_views": int(row["avg_views"]),
                "avg_engagement_rate": round(float(row["avg_er"]), 2),
                "reels_count": int(row["count"])
            }
            for _, row in time_grouped.iterrows()
        ]

        # Niche performance
        niche_grouped = df.groupby("content_niche").agg(
            total_views=("views", "sum"),
            avg_views=("views", "mean"),
            avg_er=("engagement_rate", "mean"),
            avg_score=("virality_score", "mean"),
            reels_count=("reel_id", "count")
        ).reset_index().sort_values("total_views", ascending=False)

        niche_perf = [
            {
                "niche": row["content_niche"],
                "total_views": int(row["total_views"]),
                "avg_views": int(row["avg_views"]),
                "avg_engagement_rate": round(float(row["avg_er"]), 2),
                "avg_virality_score": round(float(row["avg_score"]), 1),
                "reels_count": int(row["reels_count"])
            }
            for _, row in niche_grouped.iterrows()
        ]

        # Recent reels
        sorted_recent = df.sort_values("publication_timestamp", ascending=False).head(10)
        recent_reels = [self._row_to_dict(row) for _, row in sorted_recent.iterrows()]

        return {
            "total_reels": total_reels,
            "total_views": total_views,
            "avg_engagement_rate": avg_er,
            "avg_virality_score": avg_score,
            "viral_hits_count": viral_hits,
            "creators_count": creators_count,
            "niches_count": niches_count,
            "dataset_version": dataset_version,
            "is_reference_dataset": (total_reels == 88 and total_views == 40966919),
            "views_distribution": views_dist,
            "engagement_distribution": er_dist,
            "virality_tier_distribution": tier_dist,
            "views_vs_engagement": scatter,
            "timeline_performance": timeline,
            "niche_performance": niche_perf,
            "recent_reels": recent_reels
        }

    def get_virality_analytics(self, df: pd.DataFrame) -> Dict[str, Any]:
        tier_order = ["Viral Hit", "High Reach", "Moderate Reach", "Standard"]
        tier_metrics = []
        for tier in tier_order:
            sub = df[df["virality_tier"] == tier]
            if not sub.empty:
                tier_metrics.append({
                    "tier": tier,
                    "count": int(len(sub)),
                    "percentage": round((len(sub) / len(df)) * 100.0, 1),
                    "avg_views": int(sub["views"].mean()),
                    "avg_engagement_rate": round(float(sub["engagement_rate"].mean()), 2),
                    "avg_duration": round(float(sub["video_duration"].mean()), 1),
                    "avg_virality_score": round(float(sub["virality_score"].mean()), 1),
                    "min_views": int(sub["views"].min()),
                    "max_views": int(sub["views"].max())
                })
            else:
                tier_metrics.append({
                    "tier": tier, "count": 0, "percentage": 0.0,
                    "avg_views": 0, "avg_engagement_rate": 0.0, "avg_duration": 0.0,
                    "avg_virality_score": 0.0, "min_views": 0, "max_views": 0
                })

        # Top 10 performers by virality score
        top_reels = df.sort_values("virality_score", ascending=False).head(10)
        top_performers = [self._row_to_dict(row) for _, row in top_reels.iterrows()]

        # Virality score histogram (0-10, 10-20, ... 90-100)
        hist_bins = list(range(0, 101, 10))
        hist_counts, _ = np.histogram(df["virality_score"], bins=hist_bins)
        score_hist = [
            {"score_range": f"{hist_bins[i]}–{hist_bins[i+1]}", "count": int(hist_counts[i])}
            for i in range(len(hist_counts))
        ]

        # Views vs Engagement grouped by Tier
        matrix = [
            {
                "reel_id": row["reel_id"],
                "tier": row["virality_tier"],
                "views": int(row["views"]),
                "engagement_rate": round(float(row["engagement_rate"]), 2),
                "duration": int(row["video_duration"]),
                "niche": row["content_niche"]
            }
            for _, row in df.iterrows()
        ]

        methodology = {
            "formula_name": "Log-Normalized Dual-Component Virality Index",
            "reach_component": "log10(views) min-max normalized across active dataset range",
            "reach_weight": self.reach_weight,
            "engagement_component": "min(100, (engagement_rate / benchmark_95th) * 100)",
            "engagement_weight": self.engagement_weight,
            "tier_thresholds": {
                "Viral Hit": "Score >= 75.0 (Exceptional reach with high audience interaction)",
                "High Reach": "50.0 <= Score < 75.0 (Upper quartile performance)",
                "Moderate Reach": "30.0 <= Score < 50.0 (Average commercial distribution)",
                "Standard": "Score < 30.0 (Base algorithmic baseline)"
            },
            "parameters_configurable": True
        }

        correlation_notes = (
            "CRITICAL STATISTICAL DISTINCTION: All observations derived from this dataset represent "
            "empirical correlations within the monitored cohort of 88 Instagram Reels. Observational data "
            "cannot establish causation. High reach or high engagement may be influenced by confounding "
            "variables such as creator off-platform authority, Instagram exploration algorithmic distribution, "
            "or audio track trending status not captured in the feature space."
        )

        return {
            "tier_distribution": [{"tier": m["tier"], "count": m["count"], "percentage": m["percentage"]} for m in tier_metrics],
            "avg_metrics_by_tier": tier_metrics,
            "top_performers": top_performers,
            "virality_score_histogram": score_hist,
            "views_vs_engagement_matrix": matrix,
            "methodology": methodology,
            "correlation_notes": correlation_notes
        }

    def get_engagement_analytics(self, df: pd.DataFrame) -> Dict[str, Any]:
        er_series = df["engagement_rate"]
        mean_er = round(float(er_series.mean()), 2)
        median_er = round(float(er_series.median()), 2)
        std_er = round(float(er_series.std()), 2)
        p25 = round(float(np.percentile(er_series, 25)), 2)
        p75 = round(float(np.percentile(er_series, 75)), 2)
        min_er = round(float(er_series.min()), 2)
        max_er = round(float(er_series.max()), 2)

        # Distribution buckets
        er_hist, bins = np.histogram(er_series, bins=7)
        dist = [
            {"range": f"{bins[i]:.1f}%–{bins[i+1]:.1f}%", "count": int(er_hist[i])}
            for i in range(len(er_hist))
        ]

        # Niche engagement breakdown
        niche_grouped = df.groupby("content_niche")["engagement_rate"].agg(["mean", "median", "std", "count"]).reset_index()
        by_niche = [
            {
                "niche": row["content_niche"],
                "mean_engagement": round(float(row["mean"]), 2),
                "median_engagement": round(float(row["median"]), 2),
                "std_engagement": round(float(row["std"]) if not np.isnan(row["std"]) else 0.0, 2),
                "reels_count": int(row["count"])
            }
            for _, row in niche_grouped.iterrows()
        ]

        # Creator engagement breakdown
        creator_grouped = df.groupby("creator").agg(
            mean_er=("engagement_rate", "mean"),
            median_er=("engagement_rate", "median"),
            total_views=("views", "sum"),
            count=("reel_id", "count")
        ).reset_index().sort_values("mean_er", ascending=False)
        by_creator = [
            {
                "creator": row["creator"],
                "mean_engagement": round(float(row["mean_er"]), 2),
                "median_engagement": round(float(row["median_er"]), 2),
                "total_views": int(row["total_views"]),
                "reels_count": int(row["count"])
            }
            for _, row in creator_grouped.iterrows()
        ]

        # Duration groups: <15s, 15-30s, 30-60s, >60s
        def duration_bucket(d):
            if d < 15:
                return "<15s (Short)"
            elif d <= 30:
                return "15–30s (Optimal)"
            elif d <= 60:
                return "31–60s (Medium)"
            else:
                return ">60s (Long)"

        df_dur = df.copy()
        df_dur["duration_bucket"] = df_dur["video_duration"].apply(duration_bucket)
        dur_grouped = df_dur.groupby("duration_bucket").agg(
            mean_er=("engagement_rate", "mean"),
            median_er=("engagement_rate", "median"),
            avg_views=("views", "mean"),
            count=("reel_id", "count")
        ).reset_index()

        bucket_order = ["<15s (Short)", "15–30s (Optimal)", "31–60s (Medium)", ">60s (Long)"]
        by_duration = []
        for b in bucket_order:
            sub = dur_grouped[dur_grouped["duration_bucket"] == b]
            if not sub.empty:
                r = sub.iloc[0]
                by_duration.append({
                    "duration_bucket": b,
                    "mean_engagement": round(float(r["mean_er"]), 2),
                    "median_engagement": round(float(r["median_er"]), 2),
                    "avg_views": int(r["avg_views"]),
                    "count": int(r["count"])
                })

        # Likes vs Comments relationship
        likes_comments = [
            {
                "reel_id": row["reel_id"],
                "views": int(row["views"]),
                "likes": int(row["likes"]),
                "comments": int(row["comments"]),
                "engagement_rate": round(float(row["engagement_rate"]), 2),
                "comments_to_likes_ratio": round((float(row["comments"]) / max(1.0, float(row["likes"]))) * 100.0, 2)
            }
            for _, row in df.iterrows()
        ]

        # Duration vs engagement scatter
        dur_scatter = [
            {
                "reel_id": row["reel_id"],
                "duration": int(row["video_duration"]),
                "engagement_rate": round(float(row["engagement_rate"]), 2),
                "views": int(row["views"]),
                "niche": row["content_niche"]
            }
            for _, row in df.iterrows()
        ]

        disclaimer = (
            "Calculation Formula: Engagement Rate = ((Likes + Comments) / Views) × 100. "
            "Note: This metric accounts for publicly visible direct engagements collected via the scraper API. "
            "Private signals (saves, direct message shares, watch-time retention percentage, and sound re-use) "
            "are proprietary to Instagram Insights and cannot be observed from public metrics."
        )

        return {
            "mean_engagement_rate": mean_er,
            "median_engagement_rate": median_er,
            "std_engagement_rate": std_er,
            "p25": p25,
            "p75": p75,
            "min_engagement_rate": min_er,
            "max_engagement_rate": max_er,
            "distribution": dist,
            "by_niche": by_niche,
            "by_creator": by_creator,
            "by_duration_group": by_duration,
            "likes_vs_comments": likes_comments,
            "duration_vs_engagement_scatter": dur_scatter,
            "statistical_disclaimer": disclaimer
        }

    def get_caption_analytics(self, df: pd.DataFrame, min_freq: int = 2) -> Dict[str, Any]:
        avg_len = round(float(df["caption_length"].mean()), 1)
        avg_words = round(float(df["word_count"].mean()), 1)
        avg_hashtags = round(float(df["hashtag_count"].mean()), 1)

        # Emoji count extraction
        def count_emojis(text):
            return sum(1 for ch in str(text) if ord(ch) > 127000 or ord(ch) in range(0x1F600, 0x1F650))
        emoji_counts = df["caption"].apply(count_emojis)
        avg_emojis = round(float(emoji_counts.mean()), 1)

        # Extract hashtags and keywords
        hashtag_stats: Dict[str, Dict[str, Any]] = {}
        keyword_stats: Dict[str, int] = {}

        stop_words = {
            "the", "and", "a", "an", "in", "to", "of", "for", "with", "is", "this", "that", "on",
            "at", "by", "from", "it", "as", "are", "be", "your", "my", "you", "we", "here", "what",
            "how", "why", "let", "vs", "into", "over", "under", "after", "before"
        }

        for _, row in df.iterrows():
            cap = str(row.get("caption", ""))
            views = int(row.get("views", 0))
            er = float(row.get("engagement_rate", 0.0))

            # Hashtags
            tags = re.findall(r"#\w+", cap)
            for t in tags:
                tag_lower = t.lower()
                if tag_lower not in hashtag_stats:
                    hashtag_stats[tag_lower] = {"count": 0, "total_views": 0, "er_list": [], "tag": t}
                hashtag_stats[tag_lower]["count"] += 1
                hashtag_stats[tag_lower]["total_views"] += views
                hashtag_stats[tag_lower]["er_list"].append(er)

            # Clean keywords
            clean_text = re.sub(r"[#@\W+]", " ", cap).lower()
            words = [w for w in clean_text.split() if len(w) > 3 and w not in stop_words]
            for w in words:
                keyword_stats[w] = keyword_stats.get(w, 0) + 1

        top_hashtags = []
        for tag, data in hashtag_stats.items():
            if data["count"] >= min_freq:
                top_hashtags.append({
                    "hashtag": data["tag"],
                    "frequency": data["count"],
                    "avg_views": int(data["total_views"] / data["count"]),
                    "avg_engagement": round(float(np.mean(data["er_list"])), 2)
                })
        top_hashtags.sort(key=lambda x: x["frequency"], reverse=True)
        top_hashtags = top_hashtags[:20]

        top_keywords = []
        for kw, count in keyword_stats.items():
            if count >= min_freq:
                top_keywords.append({"keyword": kw, "frequency": count})
        top_keywords.sort(key=lambda x: x["frequency"], reverse=True)
        top_keywords = top_keywords[:25]

        # Caption characteristics by virality tier
        tier_caption = df.groupby("virality_tier").agg(
            avg_words=("word_count", "mean"),
            avg_length=("caption_length", "mean"),
            avg_hashtags=("hashtag_count", "mean"),
            reels_count=("reel_id", "count")
        ).reset_index()

        metrics_by_tier = [
            {
                "tier": row["virality_tier"],
                "avg_words": round(float(row["avg_words"]), 1),
                "avg_length": round(float(row["avg_length"]), 1),
                "avg_hashtags": round(float(row["avg_hashtags"]), 1),
                "reels_count": int(row["reels_count"])
            }
            for _, row in tier_caption.iterrows()
        ]

        # Metrics by niche
        niche_caption = df.groupby("content_niche").agg(
            avg_words=("word_count", "mean"),
            avg_length=("caption_length", "mean"),
            avg_hashtags=("hashtag_count", "mean")
        ).reset_index()

        metrics_by_niche = [
            {
                "niche": row["content_niche"],
                "avg_words": round(float(row["avg_words"]), 1),
                "avg_length": round(float(row["avg_length"]), 1),
                "avg_hashtags": round(float(row["avg_hashtags"]), 1)
            }
            for _, row in niche_caption.iterrows()
        ]

        # Model-estimated sentiment analysis (lexicon based heuristic)
        # Positive sentiment keywords
        positive_lexicon = {"tested", "best", "clean", "surprised", "underrated", "elevate", "protect", "perfect", "secret", "double", "unlock", "future", "gems", "cinematic", "effortless"}
        negative_lexicon = {"avoid", "stop", "irritation", "tight", "hype", "cost"}

        def estimate_sentiment(text):
            words = set(re.findall(r"\w+", str(text).lower()))
            pos = len(words.intersection(positive_lexicon))
            neg = len(words.intersection(negative_lexicon))
            if pos > neg:
                return "Positive / Inspiring"
            elif neg > pos:
                return "Warning / Advisory"
            else:
                return "Neutral / Informative"

        sentiments = df["caption"].apply(estimate_sentiment).value_counts().to_dict()
        sentiment_dist = [
            {"sentiment": k, "count": int(v), "percentage": round((v / len(df)) * 100.0, 1)}
            for k, v in sentiments.items()
        ]

        sentiment_disclaimer = (
            "NOTICE ON SENTIMENT ESTIMATES: Sentiment categories are calculated via rule-based "
            "lexical polarity heuristics and NLP token scoring. They represent statistical model-generated "
            "estimates of caption tone, NOT human-verified qualitative ground truth."
        )

        return {
            "avg_caption_length": avg_len,
            "avg_word_count": avg_words,
            "avg_hashtag_count": avg_hashtags,
            "avg_emoji_count": avg_emojis,
            "top_hashtags": top_hashtags,
            "top_keywords": top_keywords,
            "metrics_by_tier": metrics_by_tier,
            "metrics_by_niche": metrics_by_niche,
            "sentiment_distribution": sentiment_dist,
            "sentiment_disclaimer": sentiment_disclaimer
        }

    def get_posting_time_analytics(self, df: pd.DataFrame) -> Dict[str, Any]:
        # By posting hour (0 to 23)
        hours_all = list(range(24))
        hour_grouped = df.groupby("posting_hour").agg(
            reels_count=("reel_id", "count"),
            avg_views=("views", "mean"),
            avg_er=("engagement_rate", "mean")
        ).to_dict("index")

        by_hour = []
        for h in hours_all:
            data = hour_grouped.get(h, {"reels_count": 0, "avg_views": 0, "avg_er": 0.0})
            by_hour.append({
                "hour": f"{h:02d}:00",
                "hour_num": h,
                "reels_count": int(data["reels_count"]),
                "avg_views": int(data["avg_views"]),
                "avg_engagement_rate": round(float(data["avg_er"]), 2),
                "is_low_sample": data["reels_count"] < 3
            })

        # By weekday
        weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        weekday_grouped = df.groupby("day_of_week").agg(
            reels_count=("reel_id", "count"),
            avg_views=("views", "mean"),
            avg_er=("engagement_rate", "mean")
        ).to_dict("index")

        by_weekday = []
        for d in weekdays:
            data = weekday_grouped.get(d, {"reels_count": 0, "avg_views": 0, "avg_er": 0.0})
            by_weekday.append({
                "day": d,
                "reels_count": int(data["reels_count"]),
                "avg_views": int(data["avg_views"]),
                "avg_engagement_rate": round(float(data["avg_er"]), 2)
            })

        # Heatmap matrix: Weekday x 4 Time Slots (Morning 06-11, Midday 12-16, Evening 17-21, Night 22-05)
        def time_slot(h):
            if 6 <= h < 12:
                return "Morning (06:00-11:59)"
            elif 12 <= h < 17:
                return "Afternoon (12:00-16:59)"
            elif 17 <= h < 22:
                return "Evening (17:00-21:59)"
            else:
                return "Night (22:00-05:59)"

        df_time = df.copy()
        df_time["slot"] = df_time["posting_hour"].apply(time_slot)
        heatmap_grouped = df_time.groupby(["day_of_week", "slot"]).agg(
            reels_count=("reel_id", "count"),
            avg_views=("views", "mean"),
            avg_er=("engagement_rate", "mean")
        ).reset_index()

        slots = ["Morning (06:00-11:59)", "Afternoon (12:00-16:59)", "Evening (17:00-21:59)", "Night (22:00-05:59)"]
        matrix = []
        for day in weekdays:
            for slot in slots:
                match = heatmap_grouped[(heatmap_grouped["day_of_week"] == day) & (heatmap_grouped["slot"] == slot)]
                if not match.empty:
                    row = match.iloc[0]
                    matrix.append({
                        "day": day,
                        "slot": slot,
                        "reels_count": int(row["reels_count"]),
                        "avg_views": int(row["avg_views"]),
                        "avg_engagement_rate": round(float(row["avg_er"]), 2)
                    })
                else:
                    matrix.append({
                        "day": day,
                        "slot": slot,
                        "reels_count": 0,
                        "avg_views": 0,
                        "avg_engagement_rate": 0.0
                    })

        # By Niche and Top Posting Hours
        niche_hour = df.groupby(["content_niche", "posting_hour"]).agg(
            reels_count=("reel_id", "count"),
            avg_views=("views", "mean")
        ).reset_index()
        by_niche_hour = [
            {
                "niche": row["content_niche"],
                "hour": int(row["posting_hour"]),
                "reels_count": int(row["reels_count"]),
                "avg_views": int(row["avg_views"])
            }
            for _, row in niche_hour.iterrows()
        ]

        tz_note = (
            "Timezone Reference: All publication timestamps are standardized to UTC. "
            "Posting performance may reflect regional follower activity cycles specific to the creator's audience."
        )

        sample_warning = (
            "STATISTICAL CAUTION ON SAMPLE SIZE: Due to the 88-reel dataset boundary, several hourly intervals "
            "contain fewer than 5 observations (highlighted as low-sample). High average view counts in sparse "
            "intervals are susceptible to single-outlier skew and must NOT be interpreted as guaranteed optimal posting times."
        )

        return {
            "by_hour": by_hour,
            "by_weekday": by_weekday,
            "heatmap_matrix": matrix,
            "by_niche_hour": by_niche_hour,
            "timezone_note": tz_note,
            "sample_size_warning": sample_warning
        }

    def _row_to_dict(self, row) -> Dict[str, Any]:
        return {
            "reel_id": str(row["reel_id"]),
            "creator": str(row["creator"]),
            "content_niche": str(row["content_niche"]),
            "publication_timestamp": str(row["publication_timestamp"]),
            "video_duration": int(row["video_duration"]),
            "views": int(row["views"]),
            "likes": int(row["likes"]),
            "comments": int(row["comments"]),
            "engagement_rate": round(float(row["engagement_rate"]), 2),
            "caption": str(row["caption"]),
            "caption_length": int(row.get("caption_length", len(str(row["caption"])))),
            "word_count": int(row.get("word_count", len(str(row["caption"]).split()))),
            "hashtag_count": int(row.get("hashtag_count", 0)),
            "posting_hour": int(row.get("posting_hour", 0)),
            "day_of_week": str(row.get("day_of_week", "Monday")),
            "virality_score": round(float(row.get("virality_score", 0.0)), 1),
            "virality_tier": str(row.get("virality_tier", "Standard"))
        }

    def _format_compact(self, num: float) -> str:
        if num >= 1000000:
            return f"{num/1000000:.1f}M"
        elif num >= 1000:
            return f"{num/1000:.0f}K"
        return str(int(num))
