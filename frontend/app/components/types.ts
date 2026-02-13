export interface Summary {
    total_cars: number;
    total_brands: number;
    price_min: number;
    price_max: number;
    avg_feature: number;
    avg_safety: number;
    avg_performance: number;
    avg_popularity: number;
    avg_value: number;
}

export interface Segment {
    segment: string;
    count: number;
}

export interface Brand {
    BRAND: string;
    avg_price: number;
    avg_feature: number;
    avg_safety: number;
    avg_performance: number;
    avg_value: number;
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
    SCORE_FEATURE: number;
    SCORE_SAFETY: number;
    SCORE_PERFORMANCE: number;
    SCORE_POPULARITY: number;
    SCORE_VALUE: number;
    [key: string]: unknown;
}
