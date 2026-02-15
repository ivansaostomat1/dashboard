from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services import (
    get_all_cars,
    get_summary,
    get_price_distribution,
    get_index_distribution,
    get_brand_analysis,
    get_correlation_matrix,
)


app = FastAPI(title="Capstone Car Market Analytics API", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "status": "online",
        "type": "market-analytics-dashboard",
        "endpoints": {
            "cars": "/api/cars",
            "summary": "/api/summary",
            "price_distribution": "/api/price-distribution",
            "index_distribution": "/api/index-distribution",
            "brand_analysis": "/api/brand-analysis",
            "correlation": "/api/correlation",
        },
    }


@app.get("/api/cars")
def cars():
    return get_all_cars()


@app.get("/api/summary")
def summary():
    return get_summary()


@app.get("/api/price-distribution")
def price_distribution():
    return get_price_distribution()


@app.get("/api/index-distribution")
def index_distribution():
    return get_index_distribution()


@app.get("/api/brand-analysis")
def brand_analysis():
    return get_brand_analysis()

@app.get("/api/correlation")
def correlation():
    return get_correlation_matrix()
