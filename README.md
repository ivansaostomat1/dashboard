# Dashboard Analitik Pasar Mobil

Dashboard analitik deterministik untuk pasar otomotif, dirancang untuk memberikan wawasan berbasis data yang jelas mengenai spesifikasi mobil, performa penjualan, dan analisis nilai (value for money).

## 📊 Metodologi Data & Penilaian

Dashboard ini menganalisis mobil berdasarkan 5 metrik deterministik utama (Skala 0-10), yang diproses dari data spesifikasi mentah dan data penjualan.

### 1. Skor Fitur (Teknologi & Kemewahan)
*Mencerminkan kecanggihan teknologi dan tingkat kemewahan kendaraan.*
- **Algoritma**: Menghitung keberadaan fitur premium seperti Sunroof, Wireless Charger, Power Tailgate, Kursi Elektrik/Ventilasi/Pijat, Head-Up Display, dan Ambient Light.
- **Bobot ADAS**: Memasukkan Sistem Bantuan Pengemudi Canggih (ACC, LKA, Lane Centering, Kamera 360) sebagai fitur bernilai tinggi.
- **Normalisasi**: Dinilai relatif terhadap mobil dengan fitur terlengkap dalam dataset.

### 2. Skor Keselamatan (Perlindungan)
*Mengevaluasi perlindungan penumpang dan kemampuan pencegahan kecelakaan.*
- **Keselamatan Pasif**: Jumlah Airbag (0.5 poin per airbag).
- **Keselamatan Aktif**: Keberadaan ABS, EBD, ESC, TCS, AEB (Pengereman Darurat Otonom), RCTA, dan ISOFIX.
- **Normalisasi**: Dinilai relatif terhadap mobil paling aman dalam dataset.

### 3. Skor Performa (Kecepatan & Tenaga)
*Mengukur output mesin mentah dan kemampuan berkendara.*
- **Metrik**: Kombinasi dari **Horsepower (HP)** dan **Torsi (Nm)**.
- **Pembobotan**: `Poin = HP + (Torsi * 0.8)`
- **Normalisasi**: Dinilai relatif terhadap kendaraan dengan performa tertinggi.

### 4. Skor Popularitas (Penerimaan Pasar)
*Menunjukkan permintaan pasar dan kepercayaan pembeli.*
- **Metrik**: Didasarkan murni pada **Total Penjualan (Wholesales) tahun 2025**.
- **Normalisasi**: Mobil terlaris mendapatkan skor 10; yang lain diskalakan secara proporsional.

### 5. Skor Value (Nilai Uang)
*Metrik panduan pembelian utama.*
- **Rumus**: `(Fitur + Keselamatan + Performa) / Harga`
- **Konteks**: Skor tinggi menunjukkan mobil yang menawarkan fitur dan performa substansial untuk harganya. Skor rendah biasanya menunjukkan model yang terlalu mahal atau merek mewah di mana ekuitas merek lebih berat daripada spesifikasi mentah.

---

## 🛠 Teknologi yang Digunakan

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Pemrosesan Data**: Pandas, NumPy
- **Containerization**: Docker

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) (React, TypeScript)
- **Styling**: Tailwind CSS
- **Containerization**: Docker

## 🚀 Cara Memulai

### Prasyarat
- Docker & Docker Compose

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