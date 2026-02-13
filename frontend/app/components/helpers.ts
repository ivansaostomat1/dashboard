export function formatCurrency(n: number) {
    if (n >= 1e9) return `Rp ${(n / 1e9).toFixed(1)} Miliar`;
    if (n >= 1e6) return `Rp ${(n / 1e6).toFixed(0)} Juta`;
    return `Rp ${n.toLocaleString('id-ID')}`;
}

export function heatmapColor(v: number): string {
    const clamped = Math.max(-1, Math.min(1, v));
    if (clamped >= 0) {
        const intensity = clamped;
        const r = Math.round(16 + (16 - 16) * (1 - intensity));
        const g = Math.round(185 * intensity + 30 * (1 - intensity));
        const b = Math.round(129 * intensity + 41 * (1 - intensity));
        return `rgba(${r}, ${g}, ${b}, ${0.15 + intensity * 0.5})`;
    } else {
        const intensity = -clamped;
        const r = Math.round(239 * intensity + 30 * (1 - intensity));
        const g = Math.round(68 * intensity + 41 * (1 - intensity));
        const b = Math.round(68 * intensity + 41 * (1 - intensity));
        return `rgba(${r}, ${g}, ${b}, ${0.15 + intensity * 0.5})`;
    }
}
