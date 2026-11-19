import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddItemModalProps {
  onClose: () => void;
  onAdd: (
    name: string,
    neto: number,
    unidad: 'g' | 'unidades',
    merma: number,
    excludeFromPot: boolean
  ) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [neto, setNeto] = useState<number>(500);
  const [unidad, setUnidad] = useState<'g' | 'unidades'>('g');
  const [merma, setMerma] = useState<number>(0);
  const [exclude, setExclude] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || neto <= 0) return;
    onAdd(name.trim(), neto, unidad, merma, exclude);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
              Añadir Ingrediente a la Receta
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Nombre del Ingrediente
            </label>
            <input
              type="text"
              placeholder="ej. Manzana, Espinacas, Salmón..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Neto Semanal
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={neto}
                onChange={(e) => setNeto(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                min="1"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Unidad
              </label>
              <select
                value={unidad}
                onChange={(e) => setUnidad(e.target.value as 'g' | 'unidades')}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="g">Gramos (g)</option>
                <option value="unidades">Unidades (u)</option>
              </select>
            </div>
          </div>

          {unidad === 'g' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Merma (%)
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
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="excludeCheck"
              checked={exclude}
              onChange={(e) => setExclude(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-700"
            />
            <label htmlFor="excludeCheck" className="text-xs text-slate-600 dark:text-slate-400">
              Excluir del cómputo de pote principal (se da aparte como suplemento/snack)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
            >
              Añadir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
