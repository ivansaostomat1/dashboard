# Car Market Analytics Dashboard

A deterministic analytics dashboard for the automotive market, designed to provide clear, data-driven insights into car specifications, sales performance, and value analysis.

## 📊 Data & Scoring Methodology

The dashboard analyzes cars based on 5 key deterministic metrics (0-10 Scale), processed from raw specification and sales data.

### 1. Feature Score (Tech & Luxury)
*Reflects the technological sophistication and luxury level of the vehicle.*
- **Algorithm**: Counts the presence of premium features such as Sunroof, Wireless Charger, Power Tailgate, Electric/Ventilated/Massage Seats, Head-Up Display, and Ambient Light.
- **ADAS weighting**: Includes Advanced Driver Assistance Systems (ACC, LKA, Lane Centering, Camera 360) as high-value features.
- **Normalization**: Scored relative to the most feature-rich car in the dataset.

### 2. Safety Score (Protection)
*Evaluates the occupant protection and accident avoidance capabilities.*
- **Passive Safety**: Weighted sum of Airbag count (0.5 points per airbag).
- **Active Safety**: Presence of ABS, EBD, ESC, TCS, AEB (Autonomous Emergency Braking), RCTA, and ISOFIX.
- **Normalization**: Scored relative to the safest car in the dataset.

### 3. Performance Score (Speed & Power)
*Measures raw engine output and driving capability.*
- **Metrics**: Combination of **Horsepower (HP)** and **Torque (Nm)**.
- **Weighting**: `Points = HP + (Torque * 0.8)`
- **Normalization**: Scored relative to the highest performance vehicle.

### 4. Popularity Score (Market Acceptance)
*Indicates market demand and buyer confidence.*
- **Metric**: Based purely on **Total Sales (Wholesales) in 2025**.
- **Normalization**: The best-selling car gets a 10; others are scaled proportionally.

### 5. Value Score (Bang for Buck)
*The ultimate buying guide metric.*
- **Formula**: `(Feature + Safety + Performance) / Price`
- **Context**: High scores indicate cars that offer substantial features and performance for their price point. Low scores typically indicate overpriced models or luxury brands where brand equity outweighs raw specs.

---

## 🛠 Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Data Processing**: Pandas, NumPy
- **Containerization**: Docker

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) (React, TypeScript)
- **Styling**: Tailwind CSS
- **Containerization**: Docker

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose

### Running the App
1. Clone the repository:
   ```bash
   git clone https://github.com/ivansaostomat1/dashboard.git
   cd dashboard
   ```
2. Start the services:
   ```bash
   docker-compose up --build
   ```
3. Access the dashboard:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000/docs