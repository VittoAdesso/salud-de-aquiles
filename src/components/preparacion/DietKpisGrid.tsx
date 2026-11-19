import React from 'react';
import { UtensilsCrossed, Flame, Package, ShoppingBag } from 'lucide-react';
import { DietKPIs } from '../../lib/diet';
import { BatchDuration } from '../../hooks/useDietPreparation';

interface DietKpisGridProps {
  kpis: DietKPIs;
  batchDays: BatchDuration;
}

export const DietKpisGrid: React.FC<DietKpisGridProps> = ({ kpis, batchDays }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* KPI 1: Ración por Pote */}
      <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Ración por Toma
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-slate-100 tabular-nums">
              {kpis.cookedPotGrams}
            </span>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">g cocido</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Base cruda: <strong className="text-slate-800 dark:text-slate-200">{kpis.rawPotGrams} g</strong></span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">90% vapor</span>
        </div>
      </div>

      {/* KPI 2: Consumo Diario & Calorías */}
      <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Consumo Diario
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-slate-100 tabular-nums">
              {kpis.dailyCookedGrams}
            </span>
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">g/día</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>3 tomas fijas</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">~{kpis.estimatedDailyKcal} kcal/día</span>
        </div>
      </div>

      {/* KPI 3: Producción del Lote */}
      <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Producción Lote ({batchDays}d)
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-slate-100 tabular-nums">
              {kpis.totalPots}
            </span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">potes</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Masa lista tupper</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{kpis.batchCookedKg} kg cocido</span>
        </div>
      </div>

      {/* KPI 4: Compra y Mermas */}
      <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Compra con Mermas
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-slate-100 tabular-nums">
              {kpis.batchCompraKg}
            </span>
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">kg mercado</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Pelado ({kpis.avgMermaPct}%)</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">+{kpis.batchMermaKg} kg</span>
        </div>
      </div>
    </div>
  );
};
