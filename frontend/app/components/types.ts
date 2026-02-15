// app/components/types.ts
export interface Summary {
    total_cars: number;
    total_brands: number;
    price_min: number;
    price_max: number;
    price_median: number;
    price_std: number;
    p75_performance: number;
    p75_safety: number;
    p75_comfort: number;
    avg_performance: number;
    avg_efficiency: number;
    avg_safety: number;
    avg_comfort: number;
    avg_tech: number;
    avg_space: number;
    avg_popularity: number;
    avg_price: number;
}

export interface Segment {
    segment: string;
    count: number;
}

export interface Brand {
    BRAND: string;
    avg_price_otr: number;
    avg_performance: number;
    avg_efficiency: number;
    avg_safety: number;
    avg_comfort: number;
    avg_tech: number;
    avg_space: number;
    avg_popularity: number;
    avg_price: number;
    total_sales: number;
    total_models: number;
}

export interface CorrelationData {
    columns: string[];
    matrix: number[][];
}

export interface CarRecord {
    BRAND: string;
    MODEL: string;
    HARGAOTR: number;
    INDEX_PERFORMANCE: number;
    INDEX_EFFICIENCY: number;
    INDEX_SAFETY: number;
    INDEX_COMFORT: number;
    INDEX_TECH: number;
    INDEX_SPACE: number;
    INDEX_POPULARITY: number;
    INDEX_PRICE: number;
    [key: string]: unknown;
}
