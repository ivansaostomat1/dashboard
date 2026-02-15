import pandas as pd
import numpy as np
import os

RAW_PATH = "../data/raw"
PROCESSED_PATH = "../data/processed"

# ======================================================
# Helpers
# ======================================================

def zscore(series: pd.Series) -> pd.Series:
    series = pd.to_numeric(series, errors="coerce")
    mean = series.mean()
    std = series.std()

    if std == 0 or np.isnan(std):
        return pd.Series(0, index=series.index)

    return (series - mean) / std


def has_feature(val) -> int:
    s = str(val).lower()
    if s in ["yes", "1", "ada", "true", "lengkap", "electric", "wireless", "wired"]:
        return 1
    if "yes" in s:
        return 1
    return 0


# ======================================================
# Load & Clean
# ======================================================

def load_data():
    df_mobil = pd.read_csv(f"{RAW_PATH}/mobil.csv")
    df_sales = pd.read_csv(f"{RAW_PATH}/wholesales.csv")
    return df_mobil, df_sales


def clean_data(df_mobil, df_sales):

    # Standardize keys
    for col in ["BRAND", "MODEL", "VARIAN"]:
        df_mobil[col] = df_mobil[col].astype(str).str.upper().str.strip()
        df_sales[col] = df_sales[col].astype(str).str.upper().str.strip()

    # Merge sales
    df = pd.merge(
        df_mobil,
        df_sales[["BRAND", "MODEL", "VARIAN", "TOTAL_2025"]],
        on=["BRAND", "MODEL", "VARIAN"],
        how="left",
    )

    df["TOTAL_2025"] = df["TOTAL_2025"].fillna(0)

    # Clean price
    df["HARGAOTR"] = pd.to_numeric(df["HARGAOTR"], errors="coerce")
    df = df[df["HARGAOTR"] > 0].copy()

    return df


# ======================================================
# Index Calculations (DATA‑DRIVEN, NO SUBJECTIVE WEIGHT)
# ======================================================

def calculate_indices(df: pd.DataFrame) -> pd.DataFrame:

    # ---------------- PERFORMANCE INDEX ----------------
    perf_cols = [
        "HORSE POWER (HP)",
        "TORQUE (Nm)",
        "CC",
        "WEIGHT (GVW)",
        "EV_RANGE_KM",
        "BATTERY (KWH)",
    ]

    perf_z = []
    for col in perf_cols:
        if col in df.columns:
            perf_z.append(zscore(df[col]))

    if perf_z:
        df["INDEX_PERFORMANCE"] = pd.concat(perf_z, axis=1).mean(axis=1)
    else:
        df["INDEX_PERFORMANCE"] = 0

    # ---------------- EFFICIENCY INDEX ----------------
    eff_cols = ["CC", "WEIGHT (GVW)", "EV_RANGE_KM", "BATTERY (KWH)"]

    eff_z = []
    for col in eff_cols:
        if col in df.columns:
            z = zscore(df[col])

            # CC & Weight → makin kecil makin efisien
            if col in ["CC", "WEIGHT (GVW)"]:
                z = -z

            eff_z.append(z)

    if eff_z:
        df["INDEX_EFFICIENCY"] = pd.concat(eff_z, axis=1).mean(axis=1)
    else:
        df["INDEX_EFFICIENCY"] = 0

    # ---------------- SAFETY INDEX ----------------
    safety_points = pd.Series(0, index=df.index)

    if "AIRBAGS" in df.columns:
        airbags = pd.to_numeric(df["AIRBAGS"], errors="coerce").fillna(2)
        safety_points += zscore(airbags)

    safety_features = [
        "ABS",
        "EBD",
        "ESC",
        "TCS",
        "AEB",
        "RCTA",
        "ACC",
        "LKA",
        "ACC_STOP_GO",
        "LANE_CENTERING",
        "CAMERA_360",
        "REAR_CAMERA",
        "PARK_SENSOR_FRONT",
        "PARK_SENSOR_REAR",
    ]

    for col in safety_features:
        if col in df.columns:
            safety_points += df[col].apply(has_feature)

    df["INDEX_SAFETY"] = zscore(safety_points)

    # ---------------- COMFORT & LUXURY INDEX ----------------
    comfort_cols = [
        "LEATHER_SEAT",
        "VENTILATED_SEAT",
        "MASSAGE_SEAT",
        "SOFT_TOUCH_INTERIOR",
        "AIR_SUSPENSION",
        "SUNROOF",
        "AMBIENT_LIGHT",
        "ELECTRIC_SEAT",
        "POWER_TAILGATE",
    ]

    comfort_points = pd.Series(0, index=df.index)

    for col in comfort_cols:
        if col in df.columns:
            comfort_points += df[col].apply(has_feature)

    df["INDEX_COMFORT"] = zscore(comfort_points)

    # ---------------- TECHNOLOGY INDEX ----------------
    tech_cols = [
        "APPLE_CARPLAY",
        "ANDROID_AUTO",
        "HEAD_UP_DISPLAY",
        "DRIVER_MONITOR_CAMERA",
        "REAR_SEAT_ENTERTAINMENT",
        "WIRELESS_CHARGER",
        "CAMERA_360",
    ]

    tech_points = pd.Series(0, index=df.index)

    for col in tech_cols:
        if col in df.columns:
            tech_points += df[col].apply(has_feature)

    df["INDEX_TECH"] = zscore(tech_points)

    # ---------------- SPACE & PRACTICALITY INDEX ----------------
    space_cols = [
        "SEAT",
        "TRUNK_CAPACITY_LITER",
        "LONG",
        "WIDTH",
        "HEIGHT",
        "WHEELBASE",
        "GROUND CLEARENCE",
        "DOOR",
    ]

    space_z = []
    for col in space_cols:
        if col in df.columns:
            space_z.append(zscore(df[col]))

    if space_z:
        df["INDEX_SPACE"] = pd.concat(space_z, axis=1).mean(axis=1)
    else:
        df["INDEX_SPACE"] = 0

    # ---------------- MARKET INDEX ----------------
    df["INDEX_POPULARITY"] = zscore(df["TOTAL_2025"])
    df["INDEX_PRICE"] = -zscore(df["HARGAOTR"])  # lebih murah → lebih tinggi

    return df


# ======================================================
# Main
# ======================================================

def main():

    if not os.path.exists(PROCESSED_PATH):
        os.makedirs(PROCESSED_PATH)

    df_mobil, df_sales = load_data()
    df = clean_data(df_mobil, df_sales)

    df_final = calculate_indices(df)

    output_file = f"{PROCESSED_PATH}/car_indices.csv"
    df_final.to_csv(output_file, index=False)

    print("✅ Analytics indices generated successfully")
    print(f"Saved to: {output_file}")
    print(f"Total cars: {len(df_final)}")


if __name__ == "__main__":
    main()
