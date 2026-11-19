import React from 'react';
import { Edit2 } from 'lucide-react';
import { PreparacionItem } from '../../lib/types';
import { getIngredientCategory, MEALS_PER_DAY, TOTAL_POTS_WEEK } from '../../lib/diet';
import { BatchDuration } from '../../hooks/useDietPreparation';

interface RecipeTableProps {
  activeItems: PreparacionItem[];
  batchDays: BatchDuration;
  batchMultiplier: number;
  totalPots: number;
  onEditItem: (item: PreparacionItem) => void;
}

export const RecipeTable: React.FC<RecipeTableProps> = ({
  activeItems,
  batchDays,
  batchMultiplier,
  totalPots,
  onEditItem,
}) => {
  const getCategoryBadge = (name: string) => {
    const cat = getIngredientCategory(name);
    switch (cat) {
      case 'proteina':
        return {
          label: 'Proteína Animal',
          dot: 'bg-emerald-500',
        };
      case 'tuberculo':
        return {
          label: 'Tubérculo / Carbohidrato',
          dot: 'bg-amber-500',
        };
      case 'verdura':
        return {
          label: 'Verdura / Fibra',
          dot: 'bg-teal-500',
        };
      case 'suplemento':
      default:
        return {
          label: 'Suplemento / Extra',
          dot: 'bg-purple-500',
        };
    }
  };

  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
            Ingredientes, Raciones y Mermas de la Receta
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cálculo automático de porción unitaria (1 pote) y total del lote según el tamaño seleccionado ({batchDays} días · {totalPots} potes).
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-left font-semibold text-slate-500 dark:text-slate-400">
              <th className="pb-3 pl-2">Ingrediente & Categoría</th>
              <th className="pb-3 text-center">Por Toma (1 pote)</th>
              <th className="pb-3 text-center">Por Día (3 potes)</th>
              <th className="pb-3 text-right">Neto Lote ({batchDays}d)</th>
              <th className="pb-3 text-right">Merma (%)</th>
              <th className="pb-3 text-right">Total a Comprar</th>
              <th className="pb-3 pr-2 text-right">Editar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {activeItems.map((item) => {
              const badge = getCategoryBadge(item.ingrediente);
              const porToma =
                item.unidad === 'unidades'
                  ? (item.neto_semanal / TOTAL_POTS_WEEK).toFixed(1)
                  : Math.round(item.neto_semanal / TOTAL_POTS_WEEK);
              const porDia =
                item.unidad === 'unidades'
                  ? (item.neto_semanal / 7).toFixed(1)
                  : Math.round((item.neto_semanal / TOTAL_POTS_WEEK) * MEALS_PER_DAY);

              const scaledNeto = Math.round(item.neto_semanal * batchMultiplier);
              const scaledCompra = Math.round(item.total_compra * batchMultiplier);

              return (
                <tr
                  key={item.ingrediente}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Name & Category Badge */}
                  <td className="py-3 pl-2 font-medium text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                      <div>
                        <span className="font-bold">{item.ingrediente}</span>
                        {item.exclude_from_pot ? (
                          <span className="ml-2 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                            (Extra / fuera de pote)
                          </span>
                        ) : null}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {badge.label}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Por Toma */}
                  <td className="py-3 text-center tabular-nums">
                    <span className="font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md">
                      {porToma} {item.unidad === 'unidades' ? 'u' : 'g'}
                    </span>
                  </td>

                  {/* Por Día */}
                  <td className="py-3 text-center text-slate-600 dark:text-slate-400 tabular-nums">
                    {porDia} {item.unidad === 'unidades' ? 'u' : 'g'}
                  </td>

                  {/* Neto Lote */}
                  <td className="py-3 text-right font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                    {scaledNeto} {item.unidad}
                  </td>

                  {/* Merma */}
                  <td className="py-3 text-right tabular-nums">
                    {item.unidad === 'unidades' || item.merma_pct === 0 ? (
                      <span className="text-slate-400">0%</span>
                    ) : (
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        +{item.merma_pct}%
                      </span>
                    )}
                  </td>

                  {/* Total a Comprar */}
                  <td className="py-3 text-right font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {scaledCompra} {item.unidad}
                  </td>

                  {/* Edit Button */}
                  <td className="py-3 pr-2 text-right">
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Editar cantidades y mermas"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
