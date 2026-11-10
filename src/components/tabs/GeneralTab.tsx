import React, { useState } from 'react';
import { useAquilesStore } from '../../lib/store';
import { ConfirmationModal } from '../ConfirmationModal';
import { Settings2, Plus, Trash2, Edit2, ChevronDown, ChevronUp, Check, Apple, Sparkles } from 'lucide-react';

export const GeneralTab: React.FC = () => {
  const store = useAquilesStore();
  const [isWinterOpen, setIsWinterOpen] = useState(false);
  const [isSummerOpen, setIsSummerOpen] = useState(false);

  // New Ingredient form
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemSeason, setNewItemSeason] = useState<'hot' | 'cold' | 'all'>('all');
  const [newItemQty, setNewItemQty] = useState('');

  // Delete modal state
  const [dietToDelete, setDietToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteBothSeasons, setDeleteBothSeasons] = useState(false);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemQty.trim()) return;

    if (newItemSeason === 'all') {
      store.addDietItem({
        item_name: newItemName.trim(),
        season: 'hot',
        quantity: newItemQty.trim(),
        sort_order: 20,
      });
      store.addDietItem({
        item_name: newItemName.trim(),
        season: 'cold',
        quantity: newItemQty.trim(),
        sort_order: 20,
      });
    } else {
      store.addDietItem({
        item_name: newItemName.trim(),
        season: newItemSeason,
        quantity: newItemQty.trim(),
        sort_order: 20,
      });
    }

    setNewItemName('');
    setNewItemQty('');
    setIsAddOpen(false);
  };

  const handleConfirmDelete = () => {
    if (dietToDelete) {
      store.deleteDietItem(dietToDelete.id, deleteBothSeasons);
      setDietToDelete(null);
      setDeleteBothSeasons(false);
    }
  };

  const summerDietItems = store.dietItems.filter((d) => d.season === 'hot' || d.season === 'all');
  const winterDietItems = store.dietItems.filter((d) => d.season === 'cold' || d.season === 'all');

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Settings2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                Pauta General y Planes Nutricionales Estacionales
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Raciones base de 21 potes/semana (3 al día). Pote crudo fijo 243g · Pote cocido ~219g (90%).
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-xs transition-all self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Ingrediente</span>
          </button>
        </div>

        {/* Add ingredient drawer/form */}
        {isAddOpen && (
          <form
            onSubmit={handleAddIngredient}
            className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Nuevo Ingrediente Dietético
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Ej: Calabaza Asada"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Cantidad / Unidad</label>
                <input
                  type="text"
                  placeholder="Ej: 300g"
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Temporada</label>
                <select
                  value={newItemSeason}
                  onChange={(e) => setNewItemSeason(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="all">Ambas Temporadas (Verano e Invierno)</option>
                  <option value="hot">Solo Verano (Marzo – Septiembre)</option>
                  <option value="cold">Solo Invierno (Octubre – Febrero)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Guardar Ingrediente
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Accordion 1: Plan Verano */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => setIsSummerOpen((prev) => !prev)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
            <div>
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
                Plan Verano (Marzo – Septiembre) · {summerDietItems.length} ingredientes
              </h3>
              <p className="text-xs text-slate-500">
                Batata, Merluza, Salmón, Calabacín, Calabaza 300g, Sardina, Cáscara 11g, Arándanos
              </p>
            </div>
          </div>
          {isSummerOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isSummerOpen && (
          <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {summerDietItems.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.item_name}</span>
                    <span className="ml-2 font-mono text-emerald-600 dark:text-emerald-400">{item.quantity}</span>
                  </div>
                  <button
                    onClick={() => setDietToDelete({ id: item.id, name: item.item_name })}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    title="Eliminar ingrediente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Plan Invierno */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => setIsWinterOpen((prev) => !prev)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
            <div>
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
                Plan Invierno (Octubre – Febrero) · {winterDietItems.length} ingredientes
              </h3>
              <p className="text-xs text-slate-500">
                Patata 2500g, Zanahoria 200g, Merluza 1250g, Salmón 250g, Calabacín 700g, Calabaza 200g
              </p>
            </div>
          </div>
          {isWinterOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isWinterOpen && (
          <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {winterDietItems.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.item_name}</span>
                    <span className="ml-2 font-mono text-emerald-600 dark:text-emerald-400">{item.quantity}</span>
                  </div>
                  <button
                    onClick={() => setDietToDelete({ id: item.id, name: item.item_name })}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    title="Eliminar ingrediente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Delete Ingredient */}
      <ConfirmationModal
        isOpen={!!dietToDelete}
        title="Eliminar Ingrediente del Plan"
        message={`¿Confirmas que deseas eliminar "${dietToDelete?.name}" de la dieta? Puedes elegir eliminarlo solo de esta temporada o de ambas temporadas.`}
        confirmLabel="Eliminar"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDietToDelete(null);
          setDeleteBothSeasons(false);
        }}
      />
    </div>
  );
};
