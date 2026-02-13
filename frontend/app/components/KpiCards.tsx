'use client';

import { Summary } from './types';
import { Icons } from './icons';

interface KpiCardsProps {
    summary: Summary;
}

export default function KpiCards({ summary }: KpiCardsProps) {
    const kpis = [
        { title: 'Total Kendaraan', value: summary.total_cars.toLocaleString('id-ID'), icon: Icons.car, gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
        { title: 'Total Brand', value: summary.total_brands.toLocaleString('id-ID'), icon: Icons.brand, gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
        { title: 'Avg Feature', value: summary.avg_feature.toFixed(1), icon: Icons.feature, gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
        { title: 'Avg Safety', value: summary.avg_safety.toFixed(1), icon: Icons.safety, gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
        { title: 'Avg Value', value: summary.avg_value.toFixed(1), icon: Icons.value, gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
    ];

    return (
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {kpis.map((kpi, i) => (
                <div key={kpi.title} className={`kpi-card animate-in delay-${i + 1}`}>
                    <div className="flex items-center justify-between mb-3">
                        <div
                            className="p-2 rounded-lg"
                            style={{ background: kpi.gradient, opacity: 0.85 }}
                        >
                            <span className="text-white">{kpi.icon}</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {kpi.title}
                    </p>
                </div>
            ))}
        </section>
    );
}
