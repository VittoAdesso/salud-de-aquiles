import React from 'react';
import { CheckSquare, Square, Printer, RotateCcw } from 'lucide-react';
import { PreparacionItem } from '../../lib/types';
import { getIngredientCategory } from '../../lib/diet';
import { BatchDuration } from '../../hooks/useDietPreparation';

interface MarketChecklistProps {
  activeItems: PreparacionItem[];
  batchDays: BatchDuration;
  batchMultiplier: number;
  batchCompraKg: number;
  totalPots: number;
  checkedItems: Record<string, boolean>;
  onToggleCheck: (name: string) => void;
  onClearAllChecks: () => void;
}

export const MarketChecklist: React.FC<MarketChecklistProps> = ({
  activeItems,
  batchDays,
  batchMultiplier,
  batchCompraKg,
  totalPots,
  checkedItems,
  onToggleCheck,
  onClearAllChecks,
}) => {
  const completedCount = activeItems.filter((it) => !!checkedItems[it.ingrediente]).length;

  const getCategoryLabel = (name: string) => {
    const cat = getIngredientCategory(name);
    switch (cat) {
      case 'proteina':
        return 'Proteína';
      case 'tuberculo':
        return 'Tubérculo';
      case 'verdura':
        return 'Verdura';
      case 'suplemento':
      default:
        return 'Suplemento';
    }
  };

  return (
    <div className="glass-card p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
            Lista de Compra para {batchDays} días ({totalPots} potes)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cantidades brutas calculadas para llevar al mercado con compensación de pelado (+20% / +30%).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Total en bolsa:</span>
            <span className="text-base font-bold font-display text-emerald-700 dark:text-emerald-400">
              {batchCompraKg} kg
            </span>
          </div>

          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-slate-800">
            {completedCount > 0 && (
              <button
                onClick={onClearAllChecks}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
                title="Desmarcar todo"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Desmarcar</span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Imprimir lista"
            >
              <Printer className="w-3 h-3" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Checklist progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>
            Progreso en el carrito: {completedCount} de {activeItems.length} ingredientes
          </span>
          <span className="font-mono">
            {Math.round((completedCount / Math.max(1, activeItems.length)) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
            style={{
              width: `${(completedCount / Math.max(1, activeItems.length)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Checklist grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
        {activeItems.map((item) => {
          const isChecked = !!checkedItems[item.ingrediente];
          const scaledCompra = Math.round(item.total_compra * batchMultiplier);
          const categoryLabel = getCategoryLabel(item.ingrediente);

          return (
            <div
              key={item.ingrediente}
              onClick={() => onToggleCheck(item.ingrediente)}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                isChecked
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 opacity-75'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-emerald-600 dark:text-emerald-400 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        isChecked
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {item.ingrediente}
                    </span>
                    {item.exclude_from_pot && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">
                        (Extra)
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {categoryLabel} · {item.merma_pct > 0 ? `+${item.merma_pct}% merma` : 'Sin merma'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-sm font-bold font-mono ${
                    isChecked
                      ? 'text-slate-400 line-through'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {scaledCompra} {item.unidad}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
