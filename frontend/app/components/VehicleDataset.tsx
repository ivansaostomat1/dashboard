'use client';

import { useMemo, useState } from 'react';
import { CarRecord } from './types';
import { Icons } from './icons';
import { formatCurrency } from './helpers';

type SortKey = 'BRAND' | 'MODEL' | 'HARGAOTR' | 'SCORE_FEATURE' | 'SCORE_SAFETY' | 'SCORE_PERFORMANCE' | 'SCORE_POPULARITY' | 'SCORE_VALUE';
type SortDir = 'asc' | 'desc';

interface VehicleDatasetProps {
    cars: CarRecord[];
}

export default function VehicleDataset({ cars }: VehicleDatasetProps) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('BRAND');
    const [sortDir, setSortDir] = useState<SortDir>('asc');

    const filtered = useMemo(() => {
        if (!search) return cars;
        const q = search.toLowerCase();
        return cars.filter(
            c =>
                c.BRAND?.toLowerCase().includes(q) ||
                c.MODEL?.toLowerCase().includes(q)
        );
    }, [cars, search]);

    const sorted = useMemo(() => {
        const arr = [...filtered];
        arr.sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            return sortDir === 'asc'
                ? (Number(aVal) || 0) - (Number(bVal) || 0)
                : (Number(bVal) || 0) - (Number(aVal) || 0);
        });
        return arr;
    }, [filtered, sortKey, sortDir]);

    function handleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDir(key === 'BRAND' || key === 'MODEL' ? 'asc' : 'desc');
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
        { key: 'MODEL', label: 'Model', align: 'left' },
        { key: 'HARGAOTR', label: 'Harga OTR', align: 'right' },
        { key: 'SCORE_FEATURE', label: 'Feature', align: 'right' },
        { key: 'SCORE_SAFETY', label: 'Safety', align: 'right' },
        { key: 'SCORE_PERFORMANCE', label: 'Performance', align: 'right' },
        { key: 'SCORE_POPULARITY', label: 'Popularity', align: 'right' },
        { key: 'SCORE_VALUE', label: 'Value', align: 'right' },
    ];

    return (
        <section className="glass-card p-5 animate-in delay-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div className="section-header">
                    <span style={{ color: 'var(--accent-cyan)' }}>{Icons.car}</span>
                    Dataset Kendaraan
                    <span className="badge">{sorted.length} / {cars.length}</span>
                </div>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                        {Icons.search}
                    </span>
                    <input
                        className="search-input"
                        placeholder="Cari brand atau model..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-auto max-h-[420px]" style={{ borderRadius: '8px' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} style={{ textAlign: col.align }}>
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
                        {sorted.map((c, i) => (
                            <tr key={i}>
                                <td className="font-medium" style={{ color: 'var(--text-primary)' }}>{c.BRAND}</td>
                                <td>{c.MODEL}</td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {formatCurrency(Number(c.HARGAOTR))}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {Number(c.SCORE_FEATURE).toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {Number(c.SCORE_SAFETY).toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {Number(c.SCORE_PERFORMANCE).toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {Number(c.SCORE_POPULARITY).toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                    {Number(c.SCORE_VALUE).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
