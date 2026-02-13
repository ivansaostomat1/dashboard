import pandas as pd
from typing import List, Dict
import numpy as np

DATA_PATH = "../data/processed/final_car_data.csv"


def load_df() -> pd.DataFrame:
    return pd.read_csv(DATA_PATH)


# =============================
# RAW TABLE
# =============================
def get_all_cars() -> List[dict]:
    df = load_df()

    df = make_json_safe(df)

    return df.to_dict(orient="records")



# =============================
# KPI SUMMARY
# =============================
def get_summary() -> Dict:
    df = load_df()

    def safe(v):
        if pd.isna(v) or np.isinf(v):
            return None
        return float(v)

    return {
        "total_cars": int(len(df)),
        "total_brands": int(df["BRAND"].nunique()),
        "price_min": safe(df["HARGAOTR"].min()),
        "price_max": safe(df["HARGAOTR"].max()),
        "avg_feature": safe(df["SCORE_FEATURE"].mean()),
        "avg_safety": safe(df["SCORE_SAFETY"].mean()),
        "avg_performance": safe(df["SCORE_PERFORMANCE"].mean()),
        "avg_popularity": safe(df["SCORE_POPULARITY"].mean()),
        "avg_value": safe(df["SCORE_VALUE"].mean()),
    }

# =============================
# PRICE DISTRIBUTION
# =============================
def get_price_distribution():
    df = load_df()

    bins = [0, 200e6, 300e6, 500e6, 800e6, 1e9, 2e9, 1e12]
    labels = ["<200 Juta", "200-300 Juta", "300-500 Juta", "500-800 Juta", "800 Juta-1 Miliar", "1-2 Miliar", ">2 Miliar"]

    df["segment"] = pd.cut(df["HARGAOTR"], bins=bins, labels=labels)

    result = df["segment"].value_counts().sort_index()

    return [{"segment": k, "count": int(v)} for k, v in result.items()]


# =============================
# SCORE DISTRIBUTION
# =============================
def get_score_distribution():
    df = load_df()

    return {
        "feature": df["SCORE_FEATURE"].tolist(),
        "safety": df["SCORE_SAFETY"].tolist(),
        "performance": df["SCORE_PERFORMANCE"].tolist(),
        "popularity": df["SCORE_POPULARITY"].tolist(),
        "value": df["SCORE_VALUE"].tolist(),
    }
def make_json_safe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Replace NaN, inf, -inf → None
    agar bisa diserialisasi JSON.
    """
    return df.replace([np.inf, -np.inf], np.nan).where(pd.notnull(df), None)


# =============================
# BRAND ANALYSIS
# =============================
def get_brand_analysis():
    df = load_df()

    grouped = (
        df.groupby("BRAND")
        .agg(
            avg_price=("HARGAOTR", "mean"),
            avg_feature=("SCORE_FEATURE", "mean"),
            avg_safety=("SCORE_SAFETY", "mean"),
            avg_performance=("SCORE_PERFORMANCE", "mean"),
            avg_value=("SCORE_VALUE", "mean"),
            total_sales=("TOTAL_2025", "sum"),
            total_models=("MODEL", "count"),
        )
        .reset_index()
    )

    return grouped.to_dict(orient="records")

# =============================
# CORRELATION MATRIX
# =============================
def get_correlation_matrix():
    df = load_df()

    numeric_cols = [
        "HARGAOTR",
        "HORSE POWER (HP)",
        "TORQUE (Nm)",
        "SCORE_FEATURE",
        "SCORE_SAFETY",
        "SCORE_PERFORMANCE",
        "SCORE_POPULARITY",
        "SCORE_VALUE",
    ]

    corr = df[numeric_cols].corr().round(3)

    # JSON-safe
    corr = corr.replace([np.inf, -np.inf], np.nan).where(pd.notnull(corr), None)

    return {
        "columns": list(corr.columns),
        "matrix": corr.values.tolist(),
    }
