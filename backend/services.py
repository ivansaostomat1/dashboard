import pandas as pd
from typing import List, Dict
import numpy as np

DATA_PATH = "../data/processed/car_indices.csv"


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
        "price_median": safe(df["HARGAOTR"].median()),
        "price_std": safe(df["HARGAOTR"].std()),
        "p75_performance": safe(df["INDEX_PERFORMANCE"].quantile(0.75)),
        "p75_safety": safe(df["INDEX_SAFETY"].quantile(0.75)),
        "p75_comfort": safe(df["INDEX_COMFORT"].quantile(0.75)),
        "avg_performance": safe(df["INDEX_PERFORMANCE"].mean()),
        "avg_efficiency": safe(df["INDEX_EFFICIENCY"].mean()),
        "avg_safety": safe(df["INDEX_SAFETY"].mean()),
        "avg_comfort": safe(df["INDEX_COMFORT"].mean()),
        "avg_tech": safe(df["INDEX_TECH"].mean()),
        "avg_space": safe(df["INDEX_SPACE"].mean()),
        "avg_popularity": safe(df["INDEX_POPULARITY"].mean()),
        "avg_price": safe(df["INDEX_PRICE"].mean()),
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
# INDEX DISTRIBUTION
# =============================
def get_index_distribution():
    df = load_df()

    return {
        "performance": df["INDEX_PERFORMANCE"].tolist(),
        "efficiency": df["INDEX_EFFICIENCY"].tolist(),
        "safety": df["INDEX_SAFETY"].tolist(),
        "comfort": df["INDEX_COMFORT"].tolist(),
        "tech": df["INDEX_TECH"].tolist(),
        "space": df["INDEX_SPACE"].tolist(),
        "popularity": df["INDEX_POPULARITY"].tolist(),
        "price": df["INDEX_PRICE"].tolist(),
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
            avg_price_otr=("HARGAOTR", "mean"),
            avg_performance=("INDEX_PERFORMANCE", "mean"),
            avg_efficiency=("INDEX_EFFICIENCY", "mean"),
            avg_safety=("INDEX_SAFETY", "mean"),
            avg_comfort=("INDEX_COMFORT", "mean"),
            avg_tech=("INDEX_TECH", "mean"),
            avg_space=("INDEX_SPACE", "mean"),
            avg_popularity=("INDEX_POPULARITY", "mean"),
            avg_price=("INDEX_PRICE", "mean"),
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
        "INDEX_PERFORMANCE",
        "INDEX_EFFICIENCY",
        "INDEX_SAFETY",
        "INDEX_COMFORT",
        "INDEX_TECH",
        "INDEX_SPACE",
        "INDEX_POPULARITY",
        "INDEX_PRICE",
    ]

    # Only include columns that exist in the dataframe
    numeric_cols = [c for c in numeric_cols if c in df.columns]

    corr = df[numeric_cols].corr().round(3)

    # JSON-safe
    corr = corr.replace([np.inf, -np.inf], np.nan).where(pd.notnull(corr), None)

    return {
        "columns": list(corr.columns),
        "matrix": corr.values.tolist(),
    }
