import { useState, useMemo } from 'react';
import { useAquilesStore } from '../lib/store';
import {
  getSeasonIngredients,
  calculateDietKPIs,
  calculatePurchaseTotal,
  MEALS_PER_DAY,
  TOTAL_POTS_WEEK,
} from '../lib/diet';
import { PreparacionItem } from '../lib/types';

export type SubView = 'raciones' | 'compra' | 'coccion';
export type BatchDuration = 7 | 14 | 3.5;

export interface EditingItemState {
  globalIndex: number;
  ingrediente: string;
  neto_semanal: number;
  unidad: string;
  merma_pct: number;
  exclude_from_pot?: boolean;
}

export function useDietPreparation() {
  const store = useAquilesStore();

  const [season, setSeason] = useState<'verano' | 'invierno'>('verano');
  const [protein, setProtein] = useState<'merluza' | 'pavo'>('merluza');
  const [batchDays, setBatchDays] = useState<BatchDuration>(7);
  const [subView, setSubView] = useState<SubView>('raciones');

  // Shopping mode checklist
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Modals state
  const [editingItem, setEditingItem] = useState<EditingItemState | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Active items calculation based on season and protein
  const { activeItems, rawPotGrams, cookedPotGrams } = useMemo(() => {
    return getSeasonIngredients(season, protein, store.preparacionItems);
  }, [season, protein, store.preparacionItems]);

  // Rich KPIs calculation
  const kpis = useMemo(() => {
    return calculateDietKPIs(activeItems, rawPotGrams, cookedPotGrams, batchDays);
  }, [activeItems, rawPotGrams, cookedPotGrams, batchDays]);

  const batchMultiplier = batchDays / 7;

  // Shopping checklist handlers
  const toggleCheck = (name: string) => {
    setCheckedItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const clearAllChecks = () => {
    setCheckedItems({});
  };

  const completedShoppingCount = useMemo(() => {
    return activeItems.filter((it) => !!checkedItems[it.ingrediente]).length;
  }, [activeItems, checkedItems]);

  // Edit item handlers
  const openEditModal = (item: PreparacionItem) => {
    const globalIndex = store.preparacionItems.findIndex(
      (p) => p.ingrediente === item.ingrediente
    );
    if (globalIndex !== -1) {
      setEditingItem({
        globalIndex,
        ingrediente: item.ingrediente,
        neto_semanal: item.neto_semanal,
        unidad: item.unidad,
        merma_pct: item.merma_pct,
        exclude_from_pot: item.exclude_from_pot,
      });
    }
  };

  const closeEditModal = () => {
    setEditingItem(null);
  };

  const saveEdit = (neto: number, merma: number) => {
    if (!editingItem) return;
    store.updatePreparacionItem(editingItem.globalIndex, {
      neto_semanal: neto,
      merma_pct: merma,
    });
    setEditingItem(null);
  };

  // Add item handler
  const addItem = (
    name: string,
    neto: number,
    unidad: 'g' | 'unidades',
    merma: number,
    excludeFromPot: boolean
  ) => {
    const totalCompra = calculatePurchaseTotal(neto, merma);
    store.addPreparacionItem({
      ingrediente: name.trim(),
      neto_semanal: neto,
      unidad,
      merma_pct: merma,
      total_compra: totalCompra,
      exclude_from_pot: excludeFromPot,
    });
    setIsAddModalOpen(false);
  };

  const resetToDefaults = () => {
    store.resetPreparacionToDefaults();
    setIsResetModalOpen(false);
  };

  return {
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
  };
}
