import React, { useState } from 'react';
import { Edit2, X } from 'lucide-react';
import { calculatePurchaseTotal, TOTAL_POTS_WEEK } from '../../lib/diet';
import { EditingItemState } from '../../hooks/useDietPreparation';

interface EditItemModalProps {
  item: EditingItemState;
  onClose: () => void;
  onSave: (neto: number, merma: number) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  onClose,
  onSave,
}) => {
  const [neto, setNeto] = useState<number>(item.neto_semanal);
  const [merma, setMerma] = useState<number>(item.merma_pct);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(neto, merma);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
              Modificar {item.ingrediente}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Neto Semanal ({item.unidad})
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={neto}
              onChange={(e) => setNeto(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
              min="0"
              step={item.unidad === 'unidades' ? '1' : '10'}
              required
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Ración resultante: ~
              {item.unidad === 'unidades'
                ? (neto / TOTAL_POTS_WEEK).toFixed(1)
                : Math.round(neto / TOTAL_POTS_WEEK)}{' '}
              {item.unidad}/pote
            </span>
          </div>

          {item.unidad === 'g' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Merma de Pelado / Preparación (%)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={merma}
                onChange={(e) => setMerma(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                min="0"
                max="100"
              />
              {/* Quick Merma Preset Chips */}
              <div className="flex gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => setMerma(0)}
                  className={`text-[10px] px-2 py-1 rounded-md border ${
                    merma === 0
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  0% (Carne/Pescado)
                </button>
                <button
                  type="button"
                  onClick={() => setMerma(20)}
                  className={`text-[10px] px-2 py-1 rounded-md border ${
                    merma === 20
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  20% (Tubérculos)
                </button>
                <button
                  type="button"
                  onClick={() => setMerma(30)}
                  className={`text-[10px] px-2 py-1 rounded-md border ${
                    merma === 30
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  30% (Calabaza/Calabacín)
                </button>
              </div>
            </div>
          )}

          {/* Dynamic summary preview */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between font-semibold">
              <span>Total estimado a comprar:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                {calculatePurchaseTotal(neto, merma)} {item.unidad}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
