import pandas as pd
import numpy as np
import os

# Konfigurasi Path
RAW_PATH = "./data/raw"
PROCESSED_PATH = "./data/processed"

def load_data():
    print("Loading data...")
    # Pastikan file ada di folder data/raw/
    try:
        df_mobil = pd.read_csv(f"{RAW_PATH}/mobil.csv")
        df_sales = pd.read_csv(f"{RAW_PATH}/wholesales.csv")
        return df_mobil, df_sales
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        exit()

def clean_data(df_mobil, df_sales):
    print("Cleaning Data...")
    
    # 1. Standardisasi Text Key
    for col in ['BRAND', 'MODEL', 'VARIAN']:
        df_mobil[col] = df_mobil[col].astype(str).str.upper().str.strip()
        df_sales[col] = df_sales[col].astype(str).str.upper().str.strip()

    # 2. Merge Data Sales ke Spesifikasi
    df_merged = pd.merge(
        df_mobil, 
        df_sales[['BRAND', 'MODEL', 'VARIAN', 'TOTAL_2025']], 
        on=['BRAND', 'MODEL', 'VARIAN'], 
        how='left'
    )
    df_merged['TOTAL_2025'] = df_merged['TOTAL_2025'].fillna(0)

    # 3. Cleaning Harga & Angka Numerik
    # Hapus karakter non-numeric di harga kalau ada
    df_merged['HARGAOTR'] = pd.to_numeric(df_merged['HARGAOTR'], errors='coerce')
    df_merged = df_merged[df_merged['HARGAOTR'] > 0].copy() # Hapus data tanpa harga

    # 4. Helper Function: Convert Yes/No/Wired/Etc to 1/0
    def has_feature(val):
        s = str(val).lower()
        if s in ['yes', '1', 'ada', 'true', 'lengkap', 'electric', 'wireless', 'wired']:
            return 1
        if 'yes' in s: # Menangani "Yes (Front & Rear)"
            return 1
        return 0

    return df_merged, has_feature

def calculate_marketing_scores(df, has_feature_func):
    print("Calculating Marketing Scores...")

    # --- 1. FEATURE SCORE (Tech & Luxury) ---
    # Logika Marketing: "Semakin banyak tombol dan layar, semakin canggih."
    # ADAS dimasukkan ke sini karena itu fitur jualan utama saat ini.
    
    tech_columns = [
        'SUNROOF', 'WIRELESS_CHARGER', 'POWER_TAILGATE', 'ELECTRIC_SEAT', 
        'VENTILATED_SEAT', 'MASSAGE_SEAT', 'HEAD_UP_DISPLAY', 'SOFT_CLOSE_DOOR',
        'REAR_SEAT_ENTERTAINMENT', 'AMBIENT_LIGHT', 'APPLE_CARPLAY', 'ANDROID_AUTO',
        'ACC', 'LKA', 'ACC_STOP_GO', 'LANE_CENTERING', 'DRIVER_MONITOR_CAMERA',
        'CAMERA_360'
    ]
    
    df['raw_feature_points'] = 0
    for col in tech_columns:
        # Cek kalau kolom ada di CSV
        if col in df.columns:
            df['raw_feature_points'] += df[col].apply(has_feature_func)
            
    # Normalisasi Feature Score ke skala 1-10
    max_feat = df['raw_feature_points'].max()
    df['SCORE_FEATURE'] = (df['raw_feature_points'] / max_feat) * 10

    # --- 2. SAFETY SCORE (Protection) ---
    # Logika Real: Airbag banyak + Struktur Rangka + Pengereman aktif
    safety_points = pd.Series(0, index=df.index)
    
    # Airbag (Bobot tinggi)
    # Asumsi kolom AIRBAGS isinya angka. Kalau string convert dulu.
    airbags = pd.to_numeric(df['AIRBAGS'], errors='coerce').fillna(2) # Default 2 airbag
    safety_points += (airbags * 0.5) # Tiap airbag bernilai 0.5 poin

    safety_cols = ['ABS', 'EBD', 'ESC', 'TCS', 'AEB', 'RCTA', 'ISOFIX']
    for col in safety_cols:
        if col in df.columns:
            safety_points += df[col].apply(has_feature_func)
            
    # Normalisasi Safety Score ke skala 1-10
    df['SCORE_SAFETY'] = (safety_points / safety_points.max()) * 10

    # --- 3. PERFORMANCE SCORE (Speed & Power) ---
    # Logika: Gabungan HP (Top Speed) dan Torsi (Akselerasi)
    hp = pd.to_numeric(df['HORSE POWER (HP)'], errors='coerce').fillna(0)
    torque = pd.to_numeric(df['TORQUE (Nm)'], errors='coerce').fillna(0)
    
    raw_perf = hp + (torque * 0.8) # Torsi diberi bobot sedikit lebih rendah dari HP
    df['SCORE_PERFORMANCE'] = (raw_perf / raw_perf.max()) * 10

    # --- 4. POPULARITY SCORE (Market Acceptance) ---
    # Logika: Penjualan terbanyak adalah angka 10. Yang 0 penjualan dapat skor rendah.
    sales = df['TOTAL_2025']
    max_sales = sales.max()
    if max_sales == 0: max_sales = 1 # Avoid division by zero
    df['SCORE_POPULARITY'] = (sales / max_sales) * 10

    # --- 5. VALUE FOR MONEY SCORE (The Ultimate Metric) ---
    # Rumus: (Total Kebaikan Mobil) / Harga
    # Total Kebaikan = Rata-rata dari Feature, Safety, dan Performance
    total_goodness = (df['SCORE_FEATURE'] + df['SCORE_SAFETY'] + df['SCORE_PERFORMANCE'])
    
    # Karena harga dalam ratusan juta, hasil baginya akan sangat kecil (0.0000xxx).
    # Kita kalikan faktor besar (misal 100 Juta) agar angkanya mudah dibaca (Skala 1-10).
    price_factor = 100_000_000 
    raw_value = (total_goodness / df['HARGAOTR']) * price_factor
    
    # Normalisasi lagi biar rapi 1-10
    df['SCORE_VALUE'] = (raw_value / raw_value.max()) * 10

    # Rounding semua skor ke 1 desimal
    score_cols = ['SCORE_FEATURE', 'SCORE_SAFETY', 'SCORE_PERFORMANCE', 'SCORE_POPULARITY', 'SCORE_VALUE']
    df[score_cols] = df[score_cols].round(1)

    return df

def main():
    if not os.path.exists(PROCESSED_PATH):
        os.makedirs(PROCESSED_PATH)
        
    df_mobil, df_sales = load_data()
    df_clean, cleaner_func = clean_data(df_mobil, df_sales)
    
    final_df = calculate_marketing_scores(df_clean, cleaner_func)
    
    # Simpan hasil
    output_file = f"{PROCESSED_PATH}/final_car_data.csv"
    final_df.to_csv(output_file, index=False)
    print(f"✅ Data processed successfully!")
    print(f"   Saved to: {output_file}")
    print(f"   Total Cars: {len(final_df)}")
    print("   Sample Data (Top 1 Value Score):")
    print(final_df.sort_values('SCORE_VALUE', ascending=False)[['BRAND', 'MODEL', 'SCORE_VALUE', 'HARGAOTR']].head(1))

if __name__ == "__main__":
    main()