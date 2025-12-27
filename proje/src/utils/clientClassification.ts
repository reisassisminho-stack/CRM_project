import type { Sale } from '../types';





export const calculateClientTotalSales = (clientId: string, sales: Sale[]): number => {
    if (!sales || !Array.isArray(sales)) return 0;
    return sales
        .filter(sale => sale.clientId === clientId)
        .reduce((total, sale) => total + sale.value, 0);
};

import type { ClassificationLevel } from '../types';

export const getClientClassification = (totalSales: number, levels: ClassificationLevel[]): ClassificationLevel => {
    // Sort levels by minSales descending to ensure we match highest threshold first
    const sortedLevels = [...levels].sort((a, b) => b.minSales - a.minSales);

    for (const level of sortedLevels) {
        if (totalSales >= level.minSales) {
            return level;
        }
    }

    // Fallback if no level matches (shouldn't happen if there's a 0 level, but good for safety)
    return {
        id: 'default',
        label: 'Indiferente',
        minSales: 0,
        color: 'bg-slate-100 text-slate-600 border-slate-200'
    };
};
