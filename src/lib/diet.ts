import { PreparacionItem } from './types';

export const MEALS_PER_DAY = 3;
export const DAYS_PER_WEEK = 7;
export const TOTAL_POTS_WEEK = MEALS_PER_DAY * DAYS_PER_WEEK; // 21

export const DEFAULT_RAW_POT_WEIGHT = 243; // grams
export const COOKING_YIELD_FACTOR = 0.90; // 90%
export const HISTORIC_COOKING_YIELD_FACTOR = 0.83; // 83%

export const DEFAULT_COOKED_POT_WEIGHT = Math.round(DEFAULT_RAW_POT_WEIGHT * COOKING_YIELD_FACTOR); // ~219g

/**
 * Standard shrinkage (merma) percentage rules:
 * - Batata, Patata, Zanahoria: +20%
 * - Calabacín, Calabaza: +30%
 * - Pavo, Merluza, Sardina, Cáscara: 0%
 */
export function getStandardShrinkage(ingredientName: string): number {
  const norm = ingredientName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (norm.includes('batata') || norm.includes('patata') || norm.includes('zanahoria')) {
    return 20;
  }
  if (norm.includes('calabacin') || norm.includes('calabaza')) {
    return 30;
  }
  return 0;
}

/**
 * Calculate purchase total based on net weight and shrinkage percentage:
 * Total compra = neto + (neto * merma_pct / 100)
 */
export function calculatePurchaseTotal(neto: number, mermaPct: number): number {
  return Math.round(neto * (1 + mermaPct / 100));
}

/**
 * Default ingredients for Preparación (merged into localStorage 'preparacion:v1')
 */
export const DEFAULT_PREPARACION_ITEMS: PreparacionItem[] = [
  { ingrediente: 'Lomo de Merluza', neto_semanal: 1800, unidad: 'g', merma_pct: 0, total_compra: 1800 },
  { ingrediente: 'Batata', neto_semanal: 2500, unidad: 'g', merma_pct: 20, total_compra: 3000 },
  { ingrediente: 'Calabacín', neto_semanal: 800, unidad: 'g', merma_pct: 30, total_compra: 1040 },
  { ingrediente: 'Calabaza', neto_semanal: 620, unidad: 'g', merma_pct: 30, total_compra: 806 },
  { ingrediente: 'Sardina', neto_semanal: 0, unidad: 'g', merma_pct: 0, total_compra: 0, exclude_from_pot: true },
  { ingrediente: 'Cáscara de huevo molida', neto_semanal: 12, unidad: 'g', merma_pct: 0, total_compra: 12, exclude_from_pot: true },
  { ingrediente: 'Arándanos', neto_semanal: 20, unidad: 'unidades', merma_pct: 0, total_compra: 20, exclude_from_pot: true },
  { ingrediente: 'Pechuga de Pavo', neto_semanal: 1400, unidad: 'g', merma_pct: 0, total_compra: 1400 },
  { ingrediente: 'Patata', neto_semanal: 2250, unidad: 'g', merma_pct: 20, total_compra: 2700 },
  { ingrediente: 'Zanahoria', neto_semanal: 200, unidad: 'g', merma_pct: 20, total_compra: 240 },
  { ingrediente: 'Pavo', neto_semanal: 600, unidad: 'g', merma_pct: 0, total_compra: 600 },
];

/**
 * Summer (Verano: Marzo - Septiembre) and Winter (Invierno: Octubre - Febrero) ingredients
 */
export function getSeasonIngredients(season: 'verano' | 'invierno', protein: 'merluza' | 'pavo', items: PreparacionItem[]): {
  activeItems: PreparacionItem[];
  rawPotGrams: number;
  cookedPotGrams: number;
} {
  const isSummer = season === 'verano';

  const filtered = items.filter((item) => {
    const name = item.ingrediente.toLowerCase();
    // Protein selection
    if (protein === 'merluza') {
      if (name.includes('pechuga de pavo')) return false;
    } else {
      if (name.includes('lomo de merluza')) return false;
    }

    // Seasonal vegetable selection
    if (isSummer) {
      // Summer uses Batata, Calabacín, Calabaza. No Patata, No Zanahoria
      if (name.includes('patata') && !name.includes('batata')) return false;
      if (name.includes('zanahoria')) return false;
    } else {
      // Winter uses Patata, Zanahoria, Calabacín, Calabaza. No Batata
      if (name.includes('batata')) return false;
    }

    return true;
  });

  // Calculate grams per pot
  const potEligibleGrams = filtered
    .filter((it) => it.unidad === 'g' && !it.exclude_from_pot)
    .reduce((sum, it) => sum + it.neto_semanal, 0);

  const rawPotGrams = Math.round(potEligibleGrams / TOTAL_POTS_WEEK);
  const cookedPotGrams = Math.round(rawPotGrams * COOKING_YIELD_FACTOR);

  return {
    activeItems: filtered,
    rawPotGrams,
    cookedPotGrams,
  };
}

export type IngredientCategory = 'proteina' | 'tuberculo' | 'verdura' | 'suplemento';

export function getIngredientCategory(ingredientName: string): IngredientCategory {
  const norm = ingredientName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (
    norm.includes('merluza') ||
    norm.includes('pavo') ||
    norm.includes('salmon') ||
    norm.includes('pollo') ||
    norm.includes('carne') ||
    norm.includes('pescado')
  ) {
    return 'proteina';
  }
  if (
    norm.includes('batata') ||
    norm.includes('patata') ||
    norm.includes('boniato') ||
    norm.includes('arroz')
  ) {
    return 'tuberculo';
  }
  if (
    norm.includes('calabacin') ||
    norm.includes('calabaza') ||
    norm.includes('zanahoria') ||
    norm.includes('judia') ||
    norm.includes('espinaca')
  ) {
    return 'verdura';
  }
  return 'suplemento';
}

export interface DietKPIs {
  batchDays: number;
  totalPots: number;
  rawPotGrams: number;
  cookedPotGrams: number;
  dailyCookedGrams: number;
  dailyRawGrams: number;
  totalNetoGrams: number;
  totalCompraGrams: number;
  totalMermaGrams: number;
  avgMermaPct: number;
  batchCookedKg: number;
  batchRawKg: number;
  batchCompraKg: number;
  batchMermaKg: number;
  proteinGrams: number;
  carbsGrams: number;
  veggiesGrams: number;
  proteinPct: number;
  carbsPct: number;
  veggiesPct: number;
  estimatedDailyKcal: number;
  estimatedPotKcal: number;
}

export function calculateDietKPIs(
  activeItems: PreparacionItem[],
  rawPotGrams: number,
  cookedPotGrams: number,
  batchDays: number = 7
): DietKPIs {
  const totalPots = Math.round(batchDays * MEALS_PER_DAY);
  const batchMultiplier = batchDays / DAYS_PER_WEEK;

  const potEligibleItems = activeItems.filter((it) => it.unidad === 'g' && !it.exclude_from_pot);
  const potEligibleGrams = potEligibleItems.reduce((acc, it) => acc + it.neto_semanal, 0);

  const proteinGrams = potEligibleItems
    .filter((it) => getIngredientCategory(it.ingrediente) === 'proteina')
    .reduce((acc, it) => acc + it.neto_semanal, 0);

  const carbsGrams = potEligibleItems
    .filter((it) => getIngredientCategory(it.ingrediente) === 'tuberculo')
    .reduce((acc, it) => acc + it.neto_semanal, 0);

  const veggiesGrams = potEligibleItems
    .filter((it) => getIngredientCategory(it.ingrediente) === 'verdura')
    .reduce((acc, it) => acc + it.neto_semanal, 0);

  const totalPotGramsSafe = potEligibleGrams > 0 ? potEligibleGrams : 1;
  const proteinPct = Math.round((proteinGrams / totalPotGramsSafe) * 100);
  const carbsPct = Math.round((carbsGrams / totalPotGramsSafe) * 100);
  const veggiesPct = Math.max(0, 100 - proteinPct - carbsPct);

  const totalNetoGrams = activeItems
    .filter((it) => it.unidad === 'g')
    .reduce((acc, it) => acc + it.neto_semanal, 0);

  const totalCompraGrams = activeItems
    .filter((it) => it.unidad === 'g')
    .reduce((acc, it) => acc + it.total_compra, 0);

  const totalMermaGrams = Math.max(0, totalCompraGrams - totalNetoGrams);
  const avgMermaPct = totalNetoGrams > 0 ? Math.round((totalMermaGrams / totalNetoGrams) * 100) : 0;

  const batchCookedKg = Number(((cookedPotGrams * totalPots) / 1000).toFixed(2));
  const batchRawKg = Number(((rawPotGrams * totalPots) / 1000).toFixed(2));
  const batchCompraKg = Number(((totalCompraGrams * batchMultiplier) / 1000).toFixed(2));
  const batchMermaKg = Number(((totalMermaGrams * batchMultiplier) / 1000).toFixed(2));

  // Canine energy calculation calibrated for Aquiles (12.0kg ideal weight, senior/cardiac)
  const potProteinGrams = proteinGrams / TOTAL_POTS_WEEK;
  const potCarbsGrams = carbsGrams / TOTAL_POTS_WEEK;
  const potVeggiesGrams = veggiesGrams / TOTAL_POTS_WEEK;
  const estimatedPotKcal = Math.round(
    potProteinGrams * 0.95 + potCarbsGrams * 0.86 + potVeggiesGrams * 0.25 + 40
  );
  const estimatedDailyKcal = estimatedPotKcal * MEALS_PER_DAY;

  return {
    batchDays,
    totalPots,
    rawPotGrams,
    cookedPotGrams,
    dailyCookedGrams: cookedPotGrams * MEALS_PER_DAY,
    dailyRawGrams: rawPotGrams * MEALS_PER_DAY,
    totalNetoGrams,
    totalCompraGrams,
    totalMermaGrams,
    avgMermaPct,
    batchCookedKg,
    batchRawKg,
    batchCompraKg,
    batchMermaKg,
    proteinGrams,
    carbsGrams,
    veggiesGrams,
    proteinPct,
    carbsPct,
    veggiesPct,
    estimatedDailyKcal,
    estimatedPotKcal,
  };
}

/**
 * Cooking guide data for Mambo Mix Habana
 */
export interface CookingInstruction {
  food: string;
  accessory: string;
  temp: string;
  speed: string;
  time: string;
  power: string;
  notes: string;
}

export const COOKING_GUIDE: CookingInstruction[] = [
  {
    food: 'Merluza',
    accessory: 'MamboMix',
    temp: '100 ºC',
    speed: 'Velocidad 1',
    time: '12-14 min',
    power: 'Potencia calorífica 6',
    notes: 'Añadir 150ml agua base. Trocear en lomos medianos sin espinas.',
  },
  {
    food: 'Pechuga de Pavo / Pavo',
    accessory: 'MamboMix',
    temp: '100 ºC',
    speed: 'Velocidad 1',
    time: '15-18 min',
    power: 'Potencia calorífica 7',
    notes: 'Cortado en dados de 2-3 cm. Confitado suave al vapor/agua.',
  },
  {
    food: 'Salmón fresco',
    accessory: 'MamboMix o Vaporera',
    temp: '100 ºC',
    speed: 'Velocidad 0-1',
    time: '10-12 min',
    power: 'Potencia calorífica 6',
    notes: 'Cocción muy suave para preservar ácidos grasos Omega-3 esenciales.',
  },
  {
    food: 'Batata / Patata',
    accessory: 'Cestillo / Vaporera',
    temp: '110 ºC',
    speed: 'Velocidad 0',
    time: '22-25 min',
    power: 'Potencia calorífica 8',
    notes: 'Pelada y cortada en cubos de 2 cm. Muy bien cocida para digestibilidad.',
  },
  {
    food: 'Calabacín / Calabaza',
    accessory: 'Cestillo / MamboMix',
    temp: '100 ºC',
    speed: 'Velocidad 1',
    time: '12-15 min',
    power: 'Potencia calorífica 6',
    notes: 'Con piel bien lavada o pelado ligero. Suelta líquido natural rico en fibra.',
  },
  {
    food: 'Zanahoria',
    accessory: 'Vaporera',
    temp: '110 ºC',
    speed: 'Velocidad 0',
    time: '20-22 min',
    power: 'Potencia calorífica 8',
    notes: 'Cortada en rodajas finas o dados para que quede tierna y asimilable.',
  },
];
