// app/components/PriceDistribution.tsx
'use client';

import { useMemo } from 'react';
import { Segment } from './types';
import { Icons } from './icons';

const barGradients = [
    'linear-gradient(90deg, #3b82f6, #06b6d4)',
    'linear-gradient(90deg, #8b5cf6, #ec4899)',
    'linear-gradient(90deg, #10b981, #06b6d4)',
    'linear-gradient(90deg, #f59e0b, #ef4444)',
    'linear-gradient(90deg, #ec4899, #8b5cf6)',
];

interface PriceDistributionProps {
    segments: Segment[];
}

export default function PriceDistribution({ segments }: PriceDistributionProps) {
    const maxCount = useMemo(() => Math.max(...segments.map(s => s.count), 1), [segments]);
    const totalCount = useMemo(() => segments.reduce((a, b) => a + b.count, 0), [segments]);

    return (
        <section className="glass-card p-5 animate-in delay-3">
            <div className="section-header mb-5">
                <span style={{ color: 'var(--accent-blue)' }}>{Icons.chart}</span>
                Distribusi Harga
                <span className="badge">{totalCount} total</span>
            </div>
            <div className="space-y-3">
                {segments.map((s, i) => {
                    const pct = (s.count / maxCount) * 100;
                    const pctOfTotal = ((s.count / totalCount) * 100).toFixed(0);
                    return (
                        <div key={s.segment}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">{s.segment}</span>
                                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                                    {s.count} ({pctOfTotal}%)
                                </span>
                            </div>
                            <div className="bar-track">
                                <div
                                    className="bar-fill"
                                    style={{
                                        width: `${pct}%`,
                                        background: barGradients[i % barGradients.length],
                                        animationDelay: `${i * 0.15}s`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
