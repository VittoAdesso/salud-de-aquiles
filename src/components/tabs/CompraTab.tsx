import React, { useState } from 'react';
import { useAquilesStore } from '../../lib/store';
import {
  getSeasonIngredients,
  getIngredientCategory,
  calculateDietKPIs,
} from '../../lib/diet';
import {
  ShoppingCart,
  CheckSquare,
  Square,
  ShoppingBag,
  Printer,
  RotateCcw,
  Sun,
  Snowflake,
  Package,
  Scale,
} from 'lucide-react';

export const CompraTab: React.FC = () => {
  const store = useAquilesStore();

  const currentMonth = new Date().getMonth() + 1;
  const defaultSeason = currentMonth >= 3 && currentMonth <= 9 ? 'verano' : 'invierno';

  const [season, setSeason] = useState<'verano' | 'invierno'>(defaultSeason);
  const [protein, setProtein] = useState<'merluza' | 'pavo'>('merluza');
  const [batchDays, setBatchDays] = useState<number>(7);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const { activeItems, rawPotGrams, cookedPotGrams } = getSeasonIngredients(
    season,
    protein,
    store.preparacionItems
  );

  const kpis = calculateDietKPIs(activeItems, rawPotGrams, cookedPotGrams, batchDays);
  const batchMultiplier = batchDays / 7;

  const toggleCheck = (name: string) => {
    setCheckedItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const clearAllChecks = () => {
    setCheckedItems({});
  };

  const completedCount = activeItems.filter((it) => !!checkedItems[it.ingrediente]).length;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                Lista de Compra de Mercado
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Checklist interactivo con cantidades brutas ajustadas por merma de pelado (+20% / +30%).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {completedCount > 0 && (
              <button
                onClick={clearAllChecks}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Desmarcar todo</span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Lista</span>
            </button>
          </div>
        </div>

        {/* Selectors: Season & Protein */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider">
              Temporada
            </label>
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
              <button
                onClick={() => setSeason('verano')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${
                  season === 'verano'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Verano</span>
              </button>
              <button
                onClick={() => setSeason('invierno')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${
                  season === 'invierno'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Snowflake className="w-3 h-3 text-blue-500" />
                <span>Invierno</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider">
              Proteína Principal
            </label>
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
              <button
                onClick={() => setProtein('merluza')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold ${
                  protein === 'merluza'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                🐟 Merluza
              </button>
              <button
                onClick={() => setProtein('pavo')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold ${
                  protein === 'pavo'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                🦃 Pavo
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider">
              Duración Lote
            </label>
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
              <button
                onClick={() => setBatchDays(7)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold ${
                  batchDays === 7
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                7 días (21 potes)
              </button>
              <button
                onClick={() => setBatchDays(14)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold ${
                  batchDays === 14
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                14 días (42 potes)
              </button>
            </div>
          </div>
        </div>

        {/* Shopping KPIs mini banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total en Bolsa</span>
            <p className="text-base font-bold font-display text-emerald-700 dark:text-emerald-400">
              {kpis.batchCompraKg} kg
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Mermas Pelado</span>
            <p className="text-base font-bold font-display text-amber-600 dark:text-amber-400">
              +{kpis.batchMermaKg} kg ({kpis.avgMermaPct}%)
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Potes Obtenidos</span>
            <p className="text-base font-bold font-display text-slate-900 dark:text-slate-100">
              {kpis.totalPots} potes
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Completado</span>
            <p className="text-base font-bold font-display text-purple-600 dark:text-purple-400">
              {completedCount} / {activeItems.length}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${(completedCount / Math.max(1, activeItems.length)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="glass-card divide-y divide-slate-100 dark:divide-slate-800">
        {activeItems.map((item) => {
          const isChecked = !!checkedItems[item.ingrediente];
          const scaledCompra = Math.round(item.total_compra * batchMultiplier);
          const scaledNeto = Math.round(item.neto_semanal * batchMultiplier);

          return (
            <div
              key={item.ingrediente}
              onClick={() => toggleCheck(item.ingrediente)}
              className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                isChecked
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`p-1 rounded-lg transition-colors ${
                    isChecked ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                  aria-label={`Marcar ${item.ingrediente}`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                <div>
                  <span
                    className={`text-sm font-semibold ${
                      isChecked
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {item.ingrediente}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>Neto útil: {scaledNeto} {item.unidad}</span>
                    {item.merma_pct > 0 && <span>(Merma pelado +{item.merma_pct}%)</span>}
                    {item.exclude_from_pot && (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">(Extra fuera de pote)</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-base font-bold font-mono ${
                    isChecked
                      ? 'text-slate-400 dark:text-slate-500 line-through'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {scaledCompra} {item.unidad}
                </span>
                <span className="block text-[10px] text-slate-400">a comprar</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
