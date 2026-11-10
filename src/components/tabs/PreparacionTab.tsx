import React, { useState } from 'react';
import { useAquilesStore } from '../../lib/store';
import {
  getSeasonIngredients,
  getIngredientCategory,
  calculateDietKPIs,
  calculatePurchaseTotal,
  COOKING_GUIDE,
  MEALS_PER_DAY,
  TOTAL_POTS_WEEK,
} from '../../lib/diet';
import { PreparacionItem } from '../../lib/types';
import {
  ChefHat,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  ShoppingBag,
  Printer,
  Flame,
  Clock,
  Thermometer,
  Gauge,
  Apple,
  Scale,
  UtensilsCrossed,
  Package,
  Info,
  CheckCircle2,
  ListChecks,
  Percent,
  X,
  Sun,
  Snowflake,
  Fish,
  ShoppingBag as ShoppingIcon,
  CheckSquare,
  Square,
} from 'lucide-react';
import { ConfirmationModal } from '../ConfirmationModal';

type SubView = 'raciones' | 'compra' | 'coccion';
type BatchDuration = 7 | 14 | 3.5;

export const PreparacionTab: React.FC = () => {
  const store = useAquilesStore();

  // Primary controls
  const [season, setSeason] = useState<'verano' | 'invierno'>('verano');
  const [protein, setProtein] = useState<'merluza' | 'pavo'>('merluza');
  const [batchDays, setBatchDays] = useState<BatchDuration>(7);
  const [subView, setSubView] = useState<SubView>('raciones');

  // Shopping mode checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Edit item modal state
  const [editingItem, setEditingItem] = useState<{
    globalIndex: number;
    ingrediente: string;
    neto_semanal: number;
    unidad: string;
    merma_pct: number;
    exclude_from_pot?: boolean;
  } | null>(null);

  // Add new item modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemNeto, setNewItemNeto] = useState<number>(500);
  const [newItemUnidad, setNewItemUnidad] = useState<'g' | 'unidades'>('g');
  const [newItemMerma, setNewItemMerma] = useState<number>(0);
  const [newItemExclude, setNewItemExclude] = useState(false);

  // Reset confirmation modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Active items calculation based on season and protein
  const { activeItems, rawPotGrams, cookedPotGrams } = getSeasonIngredients(
    season,
    protein,
    store.preparacionItems
  );

  // Rich KPIs calculation
  const kpis = calculateDietKPIs(activeItems, rawPotGrams, cookedPotGrams, batchDays);

  // Batch multiplier for shopping & scaling
  const batchMultiplier = batchDays / 7;

  // Shopping checklist handlers
  const toggleCheck = (name: string) => {
    setCheckedItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const clearAllChecks = () => {
    setCheckedItems({});
  };

  // Edit item modal handlers
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

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    store.updatePreparacionItem(editingItem.globalIndex, {
      neto_semanal: editingItem.neto_semanal,
      merma_pct: editingItem.merma_pct,
    });
    setEditingItem(null);
  };

  // Add item handler
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || newItemNeto <= 0) return;

    const totalCompra = calculatePurchaseTotal(newItemNeto, newItemMerma);
    store.addPreparacionItem({
      ingrediente: newItemName.trim(),
      neto_semanal: newItemNeto,
      unidad: newItemUnidad,
      merma_pct: newItemMerma,
      total_compra: totalCompra,
      exclude_from_pot: newItemExclude,
    });

    setNewItemName('');
    setNewItemNeto(500);
    setNewItemMerma(0);
    setNewItemExclude(false);
    setIsAddModalOpen(false);
  };

  // Helper for category badge styling
  const getCategoryBadge = (name: string) => {
    const cat = getIngredientCategory(name);
    switch (cat) {
      case 'proteina':
        return {
          label: 'Proteína Animal',
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
          dot: 'bg-emerald-500',
        };
      case 'tuberculo':
        return {
          label: 'Tubérculo / Carbohidrato',
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
          dot: 'bg-amber-500',
        };
      case 'verdura':
        return {
          label: 'Verdura / Fibra',
          color: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800/40',
          dot: 'bg-teal-500',
        };
      case 'suplemento':
      default:
        return {
          label: 'Suplemento / Extra',
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/40',
          dot: 'bg-purple-500',
        };
    }
  };

  // Filter relevant cooking guide items for current recipe
  const relevantCookingGuide = COOKING_GUIDE.filter((guide) => {
    const guideName = guide.food.toLowerCase();
    return activeItems.some((item) => {
      const itName = item.ingrediente.toLowerCase();
      if (guideName.includes('merluza') && itName.includes('merluza')) return true;
      if (guideName.includes('pavo') && (itName.includes('pavo') || itName.includes('pechuga'))) return true;
      if (guideName.includes('batata') && (itName.includes('batata') || itName.includes('patata'))) return true;
      if (guideName.includes('calabac') && (itName.includes('calabacin') || itName.includes('calabaza'))) return true;
      if (guideName.includes('zanahoria') && itName.includes('zanahoria')) return true;
      return false;
    });
  });

  const completedShoppingCount = activeItems.filter((it) => !!checkedItems[it.ingrediente]).length;

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Modern Header & Quick Actions */}
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

        {/* 2. Sleek Segmented Selectors: Season, Protein & Batch Size */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          {/* Season Switcher */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">
              Temporada Dietética
            </label>
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
              <button
                type="button"
                onClick={() => setSeason('verano')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                  season === 'verano'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Verano (Batata)</span>
              </button>
              <button
                type="button"
                onClick={() => setSeason('invierno')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                  season === 'invierno'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Snowflake className="w-3.5 h-3.5 text-blue-500" />
                <span>Invierno (Patata)</span>
              </button>
            </div>
          </div>

          {/* Protein Switcher */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">
              Proteína Activa (Rotación)
            </label>
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
              <button
                type="button"
                onClick={() => setProtein('merluza')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                  protein === 'merluza'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>🐟 Merluza</span>
                <span className="text-[10px] px-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
                  3/4
                </span>
              </button>
              <button
                type="button"
                onClick={() => setProtein('pavo')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                  protein === 'pavo'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>🦃 Pavo</span>
                <span className="text-[10px] px-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono">
                  1/4
                </span>
              </button>
            </div>
          </div>

          {/* Batch Duration Switcher */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">
              Tamaño de Preparación
            </label>
            <div className="grid grid-cols-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
              <button
                type="button"
                onClick={() => setBatchDays(7)}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  batchDays === 7
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                7d (21 potes)
              </button>
              <button
                type="button"
                onClick={() => setBatchDays(14)}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  batchDays === 14
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                14d (42 potes)
              </button>
              <button
                type="button"
                onClick={() => setBatchDays(3.5)}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  batchDays === 3.5
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                3.5d (11 potes)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hero KPI Dashboard Cards */}
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

      {/* 4. Macro Balance Breakdown Bar */}
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

      {/* 5. Sub-View Switcher: Unified Raciones vs Shopping Mode vs Cooking Guide */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Sub-view tab pills */}
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
              <ShoppingIcon className="w-3.5 h-3.5 text-purple-600" />
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

          {/* Quick info or actions based on sub-view */}
          {subView === 'compra' && (
            <div className="flex items-center gap-2">
              {completedShoppingCount > 0 && (
                <button
                  onClick={clearAllChecks}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg"
                >
                  Desmarcar todo
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>
            </div>
          )}
        </div>

        {/* View 1: Ficha & Raciones (Unified, Clean Single Table) */}
        {subView === 'raciones' && (
          <div className="glass-card p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
                  Ingredientes, Raciones y Mermas de la Receta
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cálculo automático de porción unitaria (1 pote) y total del lote según el tamaño seleccionado ({batchDays} días · {kpis.totalPots} potes).
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
                            onClick={() => openEditModal(item)}
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
        )}

        {/* View 2: Modo Mercado (Interactive Checklist) */}
        {subView === 'compra' && (
          <div className="glass-card p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
                  Lista de Compra para {batchDays} días ({kpis.totalPots} potes)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cantidades brutas calculadas para llevar al mercado con compensación de pelado (+20% / +30%).
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Total a cargar en bolsa:</span>
                <span className="text-base font-bold font-display text-emerald-700 dark:text-emerald-400">
                  {kpis.batchCompraKg} kg
                </span>
              </div>
            </div>

            {/* Checklist progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                <span>
                  Progreso en el carrito: {completedShoppingCount} de {activeItems.length} ingredientes
                </span>
                <span className="font-mono">
                  {Math.round((completedShoppingCount / Math.max(1, activeItems.length)) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{
                    width: `${(completedShoppingCount / Math.max(1, activeItems.length)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Checklist grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
              {activeItems.map((item) => {
                const isChecked = !!checkedItems[item.ingrediente];
                const scaledCompra = Math.round(item.total_compra * batchMultiplier);
                const badge = getCategoryBadge(item.ingrediente);

                return (
                  <div
                    key={item.ingrediente}
                    onClick={() => toggleCheck(item.ingrediente)}
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
                          {badge.label} · {item.merma_pct > 0 ? `+${item.merma_pct}% merma` : 'Sin merma'}
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
        )}

        {/* View 3: Parámetros Robot MamboMix */}
        {subView === 'coccion' && (
          <div className="space-y-4">
            <div className="glass-card p-4 sm:p-5 flex items-start gap-3 border-l-4 border-l-amber-500">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  Regla de Oro en Robot Mambo Mix Habana
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Cocinar siempre a fuego suave al vapor o con la pala <strong>MamboMix</strong> (máximo 100–110 ºC). Nunca dorar ni freír para evitar compuestos de Maillard dañinos para los riñones y el corazón de Aquiles.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {relevantCookingGuide.map((guide) => (
                <div
                  key={guide.food}
                  className="glass-card p-4 flex flex-col justify-between border-t-2 border-t-emerald-600 space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <h4 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
                        {guide.food}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {guide.accessory}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                          <Thermometer className="w-3 h-3 text-red-500" />
                          <span>Temp</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {guide.temp}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                          <Clock className="w-3 h-3 text-emerald-500" />
                          <span>Tiempo</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {guide.time}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                          <Gauge className="w-3 h-3 text-blue-500" />
                          <span>Velocidad</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {guide.speed}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Potencia calorífica: </span>
                      <strong className="text-slate-700 dark:text-slate-300">{guide.power}</strong>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-xl">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                      Consejo de cocción:
                    </span>
                    {guide.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
                  Modificar {editingItem.ingrediente}
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Neto Semanal ({editingItem.unidad})
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={editingItem.neto_semanal}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      neto_semanal: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                  min="0"
                  step={editingItem.unidad === 'unidades' ? '1' : '10'}
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Ración resultante: ~
                  {editingItem.unidad === 'unidades'
                    ? (editingItem.neto_semanal / TOTAL_POTS_WEEK).toFixed(1)
                    : Math.round(editingItem.neto_semanal / TOTAL_POTS_WEEK)}{' '}
                  {editingItem.unidad}/pote
                </span>
              </div>

              {editingItem.unidad === 'g' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Merma de Pelado / Preparación (%)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={editingItem.merma_pct}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        merma_pct: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                    min="0"
                    max="100"
                  />
                  {/* Quick Merma Preset Chips */}
                  <div className="flex gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, merma_pct: 0 })}
                      className={`text-[10px] px-2 py-1 rounded-md border ${
                        editingItem.merma_pct === 0
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      0% (Carne/Pescado)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, merma_pct: 20 })}
                      className={`text-[10px] px-2 py-1 rounded-md border ${
                        editingItem.merma_pct === 20
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      20% (Tubérculos)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, merma_pct: 30 })}
                      className={`text-[10px] px-2 py-1 rounded-md border ${
                        editingItem.merma_pct === 30
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
                    {calculatePurchaseTotal(editingItem.neto_semanal, editingItem.merma_pct)}{' '}
                    {editingItem.unidad}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
      )}

      {/* 7. Add Custom Ingredient Modal */}
      {isAddModalOpen && (
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
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre del Ingrediente
                </label>
                <input
                  type="text"
                  placeholder="ej. Manzana, Espinacas, Salmón..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
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
                    value={newItemNeto}
                    onChange={(e) => setNewItemNeto(parseFloat(e.target.value) || 0)}
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
                    value={newItemUnidad}
                    onChange={(e) => setNewItemUnidad(e.target.value as 'g' | 'unidades')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="g">Gramos (g)</option>
                    <option value="unidades">Unidades (u)</option>
                  </select>
                </div>
              </div>

              {newItemUnidad === 'g' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Merma (%)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={newItemMerma}
                    onChange={(e) => setNewItemMerma(parseFloat(e.target.value) || 0)}
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
                  checked={newItemExclude}
                  onChange={(e) => setNewItemExclude(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-700"
                />
                <label htmlFor="excludeCheck" className="text-xs text-slate-600 dark:text-slate-400">
                  Excluir del cómputo de pote principal (se da aparte como suplemento/snack)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
      )}

      {/* 8. Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Restablecer Receta Oficial"
        message="¿Confirmas que deseas restablecer los ingredientes y proporciones de Preparación a la receta veterinaria original? Se mantendrán tus registros históricos."
        confirmLabel="Restablecer"
        isDestructive={false}
        onConfirm={() => {
          store.resetPreparacionToDefaults();
          setIsResetModalOpen(false);
        }}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
