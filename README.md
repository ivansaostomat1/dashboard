# Dashboard Analitik Pasar Mobil

Dashboard analitik deterministik untuk pasar otomotif, dirancang untuk memberikan wawasan berbasis data yang jelas mengenai spesifikasi mobil, performa penjualan, dan analisis indeks kendaraan multi-dimensi.

## 📊 Metodologi Data & Indeks (Multi-Index Analytics)

Dashboard ini menggunakan **Framework Analisis Multi-Dimensi** yang menstandarisasi data spesifikasi mentah menggunakan metode **Z-Score Normalization**. Hal ini memungkinkan perbandingan objektif antar fitur yang memiliki skala berbeda.

### 1. Performance Index
*Mengukur output tenaga dan kemampuan teknis mesin.*
- **Metrik**: Horsepower (HP), Torsi (Nm), Kapasitas Mesin (CC), GVW, EV Range, dan Kapasitas Baterai.
- **Normalisasi**: Z-Score (Makin tinggi makin baik).

### 2. Efficiency Index
*Mengukur tingkat efisiensi penggunaan sumber daya.*
- **Metrik**: CC, Berat Kendaraan, EV Range, dan Kapasitas Baterai.
- **Logika**: CC dan Berat yang lebih rendah memberikan skor positif (makin kecil makin efisien).

### 3. Safety Index
*Mengevaluasi fitur perlindungan pasif dan aktif.*
- **Metrik**: Jumlah Airbag dan 14+ fitur ADAS/Safety (ABS, EBD, ESC, AEB, ACC, LKA, Camera 360, dll).

### 4. Comfort & Luxury Index
*Mengukur tingkat kemewahan dan kenyamanan interior.*
- **Metrik**: Ventilated/Massage Seats, Air Suspension, Sunroof, Ambient Light, Electric Seat, dan Power Tailgate.

### 5. Technology Index
*Mencerminkan kecanggihan konektivitas dan asisten digital.*
- **Metrik**: Apple CarPlay, Android Auto, Wireless Charger, HUD, Rear Seat Entertainment, dan Sistem Monitoring Pengemudi.

### 6. Space & Practicality Index
*Menilai fungsionalitas ruang dan dimensi bagi pengguna.*
- **Metrik**: Jumlah Kursi, Kapasitas Bagasi, Panjang/Lebar/Tinggi, Wheelbase, dan Ground Clearance.

### 7. Popularity Index
*Menunjukkan penerimaan pasar secara riil.*
- **Metrik**: Berdasarkan data Wholesales tahun 2025.

### 8. Price Index (Affordability)
*Metrik keterjangkauan harga relatif.*
- **Normalisasi**: Z-Score negatif terhadap Harga OTR (Harga lebih rendah mendapatkan indeks lebih tinggi).

---

## 📈 Statistik & KPI Utama
Dashboard menyediakan analisis statistik mendalam pada bagian header:
- **Median Harga**: Nilai tengah pasar untuk menghindari anomali harga mobil ultra-mewah.
- **P75 Performance/Safety/Comfort**: Performa kendaraan di kuartil atas (top 25%) sebagai tolok ukur standar tinggi.
- **Std Dev Harga**: Menunjukkan tingkat variasi harga dalam dataset.

---

## 🛠 Teknologi yang Digunakan

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Pemrosesan Data**: Pandas, NumPy (Statistik Deskriptif & Normalisasi)
- **Containerization**: Docker

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (React, TypeScript)
- **Visualisasi**: Custom Glassmorphism UI & Analytics Tables
- **Containerization**: Docker

---

## 🚀 Cara Memulai

### Prasyarat
- Docker & Docker Desktop (Aktif)

### Menjalankan Aplikasi
1. Clone repository:
   ```bash
   git clone https://github.com/ivansaostomat1/dashboard.git
   cd dashboard
   ```
2. Jalankan layanan:
   ```bash
   docker-compose up --build
   ```
3. Akses dashboard:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000/docs