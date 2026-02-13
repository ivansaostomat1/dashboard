'use client';

import { useMemo, useState } from 'react';
import { Brand } from './types';
import { Icons } from './icons';
import { formatCurrency } from './helpers';

type SortKey = 'BRAND' | 'avg_price' | 'avg_feature' | 'avg_safety' | 'avg_performance' | 'avg_value' | 'total_sales';
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
        { key: 'avg_price', label: 'Avg Price', align: 'right' },
        { key: 'avg_feature', label: 'Feature', align: 'right' },
        { key: 'avg_safety', label: 'Safety', align: 'right' },
        { key: 'avg_performance', label: 'Perf', align: 'right' },
        { key: 'avg_value', label: 'Value', align: 'right' },
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
                                    {formatCurrency(b.avg_price)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {b.avg_feature.toFixed(1)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {b.avg_safety.toFixed(1)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {b.avg_performance.toFixed(1)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {b.avg_value.toFixed(1)}
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
