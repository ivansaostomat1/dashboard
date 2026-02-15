// app/components/BrandAnalysis.tsx
'use client';

import { useMemo, useState } from 'react';
import { Brand } from './types';
import { Icons } from './icons';
import { formatCurrency } from './helpers';

type SortKey = 'BRAND' | 'avg_price_otr' | 'avg_performance' | 'avg_efficiency' | 'avg_safety' | 'avg_comfort' | 'avg_tech' | 'avg_space' | 'avg_popularity' | 'avg_price' | 'total_sales';
type SortDir = 'asc' | 'desc';

interface BrandAnalysisProps {
    brands: Brand[];
}

export default function BrandAnalysis({ brands }: BrandAnalysisProps) {
    const [sortKey, setSortKey] = useState<SortKey>('total_sales');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    const sorted = useMemo(() => {
        const arr = [...brands];
        arr.sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            return sortDir === 'asc'
                ? (aVal as number) - (bVal as number)
                : (bVal as number) - (aVal as number);
        });
        return arr;
    }, [brands, sortKey, sortDir]);

    const maxSales = useMemo(() => Math.max(...brands.map(b => b.total_sales), 1), [brands]);

    function handleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDir(key === 'BRAND' ? 'asc' : 'desc');
        }
    }

    function SortIcon({ col }: { col: SortKey }) {
        if (sortKey !== col) return <span className="ml-1 inline-flex">{Icons.sortNeutral}</span>;
        return (
            <span className="ml-1 inline-flex">
                {sortDir === 'asc' ? Icons.sortAsc : Icons.sortDesc}
            </span>
        );
    }

    const columns: { key: SortKey; label: string; align: 'left' | 'right' }[] = [
        { key: 'BRAND', label: 'Brand', align: 'left' },
        { key: 'avg_price_otr', label: 'Avg Price', align: 'right' },
        { key: 'avg_performance', label: 'Perf', align: 'right' },
        { key: 'avg_efficiency', label: 'Eff', align: 'right' },
        { key: 'avg_safety', label: 'Safety', align: 'right' },
        { key: 'avg_comfort', label: 'Comfort', align: 'right' },
        { key: 'avg_tech', label: 'Tech', align: 'right' },
        { key: 'avg_space', label: 'Space', align: 'right' },
        { key: 'avg_popularity', label: 'Pop', align: 'right' },
        { key: 'avg_price', label: 'Price Idx', align: 'right' },
        { key: 'total_sales', label: 'Sales', align: 'right' },
    ];

    return (
        <section className="glass-card p-5 animate-in delay-4">
            <div className="section-header mb-5">
                <span style={{ color: 'var(--accent-purple)' }}>{Icons.brand}</span>
                Analisis Brand
                <span className="badge">{brands.length} brand</span>
            </div>
            <div className="overflow-auto max-h-[460px]" style={{ borderRadius: '8px' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    style={{ textAlign: col.align, minWidth: col.key === 'total_sales' ? 120 : undefined }}
                                >
                                    <button
                                        onClick={() => handleSort(col.key)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            background: 'none',
                                            border: 'none',
                                            color: 'inherit',
                                            font: 'inherit',
                                            cursor: 'pointer',
                                            padding: 0,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {col.label}
                                        <SortIcon col={col.key} />
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((b, i) => (
                            <tr key={i}>
                                <td className="font-medium" style={{ color: 'var(--text-primary)' }}>{b.BRAND}</td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {formatCurrency(b.avg_price_otr)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {b.avg_performance.toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {b.avg_efficiency.toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {b.avg_safety.toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {b.avg_comfort.toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {b.avg_tech.toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {b.avg_space.toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {b.avg_popularity.toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {b.avg_price.toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="font-mono text-xs">{b.total_sales.toLocaleString('id-ID')}</span>
                                        <div className="spark-bar">
                                            <div
                                                className="spark-bar-fill"
                                                style={{
                                                    width: `${(b.total_sales / maxSales) * 100}%`,
                                                    animationDelay: `${i * 0.05}s`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
