'use client';
import { useEffect, useState } from 'react';

import { Summary, Segment, Brand, CarRecord, CorrelationData } from './components/types';
import { useTheme } from './components/ThemeProvider';
import KpiCards from './components/KpiCards';
import PriceDistribution from './components/PriceDistribution';
import BrandAnalysis from './components/BrandAnalysis';
import VehicleDataset from './components/VehicleDataset';
import CorrelationMatrix from './components/CorrelationMatrix';

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [cars, setCars] = useState<CarRecord[]>([]);
  const [correlation, setCorrelation] = useState<CorrelationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/summary').then(r => r.json()),
      fetch('http://localhost:8000/api/price-distribution').then(r => r.json()),
      fetch('http://localhost:8000/api/brand-analysis').then(r => r.json()),
      fetch('http://localhost:8000/api/cars').then(r => r.json()),
      fetch('http://localhost:8000/api/correlation').then(r => r.json()),
    ]).then(([sum, seg, br, car, corr]) => {
      setSummary(sum);
      setSegments(seg);
      setBrands(br);
      setCars(car);
      setCorrelation(corr);
      setLoading(false);
    });
  }, []);

  // ── Loading skeleton ──
  if (loading || !summary) {
    return (
      <div className="min-h-screen p-6 md:p-10 max-w-[1400px] mx-auto space-y-8" style={{ position: 'relative', zIndex: 1 }}>
        <div className="space-y-2">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-96" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-64" />
          <div className="skeleton h-64" />
        </div>
        <div className="skeleton h-80" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-[1400px] mx-auto space-y-8" style={{ position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <header className="animate-in delay-1">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Car Market <span className="gradient-text">Analytics</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Dashboard ringkasan analisis pasar kendaraan Indonesia
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {summary.total_cars} records · {summary.total_brands} brands
            </p>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 10,
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <KpiCards summary={summary} />

      {/* Price Distribution + Brand Analysis (side-by-side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceDistribution segments={segments} />
        <BrandAnalysis brands={brands} />
      </div>

      {/* Vehicle Dataset */}
      <VehicleDataset cars={cars} />

      {/* Correlation Matrix */}
      {correlation && <CorrelationMatrix correlation={correlation} />}

      {/* Footer */}
      <footer className="text-center py-6 animate-in delay-7">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {summary.total_cars} kendaraan · {summary.total_brands} brand
        </p>
      </footer>
    </div>
  );
}
