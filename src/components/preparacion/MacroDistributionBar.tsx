import React from 'react';
import { DietKPIs } from '../../lib/diet';

interface MacroDistributionBarProps {
  kpis: DietKPIs;
  protein: 'merluza' | 'pavo';
  season: 'verano' | 'invierno';
  batchMultiplier: number;
}

export const MacroDistributionBar: React.FC<MacroDistributionBarProps> = ({
  kpis,
  protein,
  season,
  batchMultiplier,
}) => {
  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <span>Equilibrio Nutricional de la Receta</span>
            <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
              (Porcentaje sobre masa de pote en crudo)
            </span>
          </h3>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          Energía estimada: <strong className="text-slate-800 dark:text-slate-200">{kpis.estimatedPotKcal} kcal/pote</strong>
        </div>
      </div>

      {/* Visual Stacked Progress Bar */}
      <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 p-0.5 gap-0.5">
        <div
          style={{ width: `${kpis.proteinPct}%` }}
          className="h-full rounded-l-full bg-emerald-500 transition-all duration-300 relative group cursor-pointer"
          title={`Proteína: ${kpis.proteinPct}% (${Math.round(kpis.proteinGrams * batchMultiplier)}g)`}
        />
        <div
          style={{ width: `${kpis.carbsPct}%` }}
          className="h-full bg-amber-500 transition-all duration-300 relative group cursor-pointer"
          title={`Carbohidratos: ${kpis.carbsPct}% (${Math.round(kpis.carbsGrams * batchMultiplier)}g)`}
        />
        <div
          style={{ width: `${kpis.veggiesPct}%` }}
          className="h-full rounded-r-full bg-teal-500 transition-all duration-300 relative group cursor-pointer"
          title={`Verduras y Fibra: ${kpis.veggiesPct}% (${Math.round(kpis.veggiesGrams * batchMultiplier)}g)`}
        />
      </div>

      {/* Legend Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <div className="flex-1 flex items-center justify-between">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              🐟 Proteína ({protein === 'merluza' ? 'Merluza' : 'Pavo'})
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
              {kpis.proteinPct}% <span className="text-[10px] font-normal text-slate-500">({Math.round(kpis.proteinGrams * batchMultiplier)}g)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <div className="flex-1 flex items-center justify-between">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              🍠 Tubérculo ({season === 'verano' ? 'Batata' : 'Patata'})
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
              {kpis.carbsPct}% <span className="text-[10px] font-normal text-slate-500">({Math.round(kpis.carbsGrams * batchMultiplier)}g)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
          <div className="flex-1 flex items-center justify-between">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              🥦 Verdura & Fibra
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
              {kpis.veggiesPct}% <span className="text-[10px] font-normal text-slate-500">({Math.round(kpis.veggiesGrams * batchMultiplier)}g)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
