import React from 'react';
import { ChefHat, RotateCcw, Plus, UtensilsCrossed, ShoppingBag, Flame } from 'lucide-react';
import { useDietPreparation } from '../../hooks/useDietPreparation';
import { PreparationSelectors } from '../preparacion/PreparationSelectors';
import { DietKpisGrid } from '../preparacion/DietKpisGrid';
import { MacroDistributionBar } from '../preparacion/MacroDistributionBar';
import { RecipeTable } from '../preparacion/RecipeTable';
import { MarketChecklist } from '../preparacion/MarketChecklist';
import { RobotCookingGuide } from '../preparacion/RobotCookingGuide';
import { EditItemModal } from '../preparacion/EditItemModal';
import { AddItemModal } from '../preparacion/AddItemModal';
import { ConfirmationModal } from '../ConfirmationModal';

export const PreparacionTab: React.FC = () => {
  const {
    season,
    setSeason,
    protein,
    setProtein,
    batchDays,
    setBatchDays,
    subView,
    setSubView,
    activeItems,
    kpis,
    batchMultiplier,
    checkedItems,
    toggleCheck,
    clearAllChecks,
    completedShoppingCount,
    editingItem,
    openEditModal,
    closeEditModal,
    saveEdit,
    isAddModalOpen,
    setIsAddModalOpen,
    addItem,
    isResetModalOpen,
    setIsResetModalOpen,
    resetToDefaults,
  } = useDietPreparation();

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header & Quick Actions */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                Fórmula Canina Oficial · Aquiles (12 kg)
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-slate-100">
                  Preparación y Dieta Cocinada
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  21 potes/semana (3 tomas/día). Cocción al vapor sin reacción de Maillard para proteger corazón y articulaciones.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Ingrediente</span>
            </button>

            <button
              onClick={() => setIsResetModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              title="Restablecer cantidades originales de la receta veterinaria"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restablecer</span>
            </button>
          </div>
        </div>

        {/* 2. Selectors: Season, Protein & Batch Size */}
        <PreparationSelectors
          season={season}
          onSeasonChange={setSeason}
          protein={protein}
          onProteinChange={setProtein}
          batchDays={batchDays}
          onBatchDaysChange={setBatchDays}
        />
      </div>

      {/* 3. Hero KPI Dashboard Cards */}
      <DietKpisGrid kpis={kpis} batchDays={batchDays} />

      {/* 4. Macro Balance Breakdown Bar */}
      <MacroDistributionBar
        kpis={kpis}
        protein={protein}
        season={season}
        batchMultiplier={batchMultiplier}
      />

      {/* 5. Sub-View Switcher: Unified Raciones vs Shopping Mode vs Cooking Guide */}
      <div className="space-y-4">
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
          <button
            onClick={() => setSubView('raciones')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              subView === 'raciones'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ficha & Raciones (Todo en Uno)</span>
          </button>

          <button
            onClick={() => setSubView('compra')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              subView === 'compra'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
            <span>Lista de Mercado ({completedShoppingCount}/{activeItems.length})</span>
          </button>

          <button
            onClick={() => setSubView('coccion')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              subView === 'coccion'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Robot MamboMix</span>
          </button>
        </div>

        {/* View 1: Ficha & Raciones (Unified, Clean Single Table) */}
        {subView === 'raciones' && (
          <RecipeTable
            activeItems={activeItems}
            batchDays={batchDays}
            batchMultiplier={batchMultiplier}
            totalPots={kpis.totalPots}
            onEditItem={openEditModal}
          />
        )}

        {/* View 2: Modo Mercado (Interactive Checklist) */}
        {subView === 'compra' && (
          <MarketChecklist
            activeItems={activeItems}
            batchDays={batchDays}
            batchMultiplier={batchMultiplier}
            batchCompraKg={kpis.batchCompraKg}
            totalPots={kpis.totalPots}
            checkedItems={checkedItems}
            onToggleCheck={toggleCheck}
            onClearAllChecks={clearAllChecks}
          />
        )}

        {/* View 3: Parámetros Robot MamboMix */}
        {subView === 'coccion' && (
          <RobotCookingGuide activeItems={activeItems} />
        )}
      </div>

      {/* 6. Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={closeEditModal}
          onSave={saveEdit}
        />
      )}

      {/* 7. Add Custom Ingredient Modal */}
      {isAddModalOpen && (
        <AddItemModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addItem}
        />
      )}

      {/* 8. Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Restablecer Receta Oficial"
        message="¿Confirmas que deseas restablecer los ingredientes y proporciones de Preparación a la receta veterinaria original? Se mantendrán tus registros históricos."
        confirmLabel="Restablecer"
        isDestructive={false}
        onConfirm={resetToDefaults}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
