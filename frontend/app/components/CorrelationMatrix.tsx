// app/components/CorrelationMatrix.tsx
'use client';

import { CorrelationData } from './types';
import { Icons } from './icons';
import { heatmapColor } from './helpers';

interface CorrelationMatrixProps {
    correlation: CorrelationData;
}

function shortenLabel(col: string) {
    return col
        .replace('INDEX_', '')
        .replace('HORSE POWER (HP)', 'HP')
        .replace('TORQUE (Nm)', 'Torque');
}

export default function CorrelationMatrix({ correlation }: CorrelationMatrixProps) {
    return (
        <section className="glass-card p-5 animate-in delay-6">
            <div className="section-header mb-5">
                <span style={{ color: 'var(--accent-emerald)' }}>{Icons.grid}</span>
                Matriks Korelasi
                <span className="badge">heatmap</span>
            </div>
            <div className="overflow-auto" style={{ borderRadius: '8px' }}>
                <table className="data-table" style={{ borderCollapse: 'separate', borderSpacing: '3px' }}>
                    <thead>
                        <tr>
                            <th style={{ background: 'transparent' }} />
                            {correlation.columns.map(col => (
                                <th
                                    key={col}
                                    style={{
                                        background: 'transparent',
                                        textAlign: 'center',
                                        padding: '0.5rem 0.25rem',
                                        fontSize: '0.65rem',
                                        maxWidth: 60,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                    title={col}
                                >
                                    {shortenLabel(col)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {correlation.matrix.map((row, i) => (
                            <tr key={i}>
                                <td
                                    style={{
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                        color: 'var(--text-secondary)',
                                        padding: '0.4rem 0.5rem',
                                        whiteSpace: 'nowrap',
                                        borderBottom: 'none',
                                    }}
                                >
                                    {shortenLabel(correlation.columns[i])}
                                </td>
                                {row.map((val, j) => {
                                    const v = val ?? 0;
                                    const isDiagonal = i === j;
                                    return (
                                        <td
                                            key={j}
                                            style={{ padding: '2px', borderBottom: 'none' }}
                                        >
                                            <div
                                                className="heatmap-cell"
                                                style={{
                                                    background: isDiagonal
                                                        ? 'rgba(59, 130, 246, 0.2)'
                                                        : heatmapColor(v),
                                                    color: isDiagonal
                                                        ? 'var(--accent-blue)'
                                                        : Math.abs(v) > 0.5
                                                            ? '#fff'
                                                            : 'var(--text-secondary)',
                                                    fontWeight: isDiagonal ? 700 : 500,
                                                }}
                                                title={`${correlation.columns[i]} × ${correlation.columns[j]} = ${v.toFixed(3)}`}
                                            >
                                                {v.toFixed(2)}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>-1.0</span>
                <div
                    className="h-3 rounded-sm"
                    style={{
                        width: 120,
                        background: 'linear-gradient(90deg, rgba(239,68,68,0.6), rgba(30,41,59,0.3) 50%, rgba(16,185,129,0.6))',
                    }}
                />
                <span>+1.0</span>
            </div>
        </section>
    );
}
