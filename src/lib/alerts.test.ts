import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calcNextHeartDate,
  getDefaultNextDate,
  getAlertSemaphoreColor,
  computeAlertStatuses,
  HEART_ANCHOR,
} from './alerts';
import { getWeightSemaphore, getFluidRetentionSemaphore, calculateAge } from './healthScore';
import {
  calculatePurchaseTotal,
  getStandardShrinkage,
  getSeasonIngredients,
  getIngredientCategory,
  calculateDietKPIs,
  DEFAULT_PREPARACION_ITEMS,
} from './diet';

test('heart control date strictly adheres to May 7 / Nov 7 cycle from HEART_ANCHOR', () => {
  assert.equal(HEART_ANCHOR, '2026-05-07');

  // If previous scheduled date is 2026-05-07, next must be 2026-11-07
  const next1 = calcNextHeartDate('2026-05-07');
  assert.equal(next1, '2026-11-07');

  // If previous is 2026-11-07, next must be 2027-05-07
  const next2 = calcNextHeartDate('2026-11-07');
  assert.equal(next2, '2027-05-07');
});

test('alert semaphores follow strict days thresholds', () => {
  // General: red < 7 days or overdue, yellow 7-30 days, green > 30 days
  assert.equal(getAlertSemaphoreColor('desparasitacion', -1), 'red');
  assert.equal(getAlertSemaphoreColor('desparasitacion', 5), 'red');
  assert.equal(getAlertSemaphoreColor('desparasitacion', 7), 'yellow');
  assert.equal(getAlertSemaphoreColor('desparasitacion', 30), 'yellow');
  assert.equal(getAlertSemaphoreColor('desparasitacion', 31), 'green');

  // Heart control: red overdue (< 0), yellow <= 30 days, green > 30 days
  assert.equal(getAlertSemaphoreColor('control_corazon', -1), 'red');
  assert.equal(getAlertSemaphoreColor('control_corazon', 0), 'yellow');
  assert.equal(getAlertSemaphoreColor('control_corazon', 20), 'yellow');
  assert.equal(getAlertSemaphoreColor('control_corazon', 35), 'green');
});

test('active joint cycle takes visual priority', () => {
  const statuses = computeAlertStatuses(
    [],
    {
      id: 'cycle-1',
      start_date: '2026-11-01',
      cycle_month: 11,
      active: true,
    },
    '2026-11-09'
  );

  const condrovet = statuses.find((s) => s.key === 'condrovet');
  assert.ok(condrovet);
  assert.equal(condrovet.color, 'green');
  assert.match(condrovet.statusLabel, /Ciclo Activo/);
});

test('weight semaphore evaluates ±2% and ±5% thresholds', () => {
  // Ideal: 12kg
  // 12.0 kg -> 0% -> green
  assert.equal(getWeightSemaphore(12.0, 12.0).color, 'green');
  // 11.8 kg -> -1.7% -> green
  assert.equal(getWeightSemaphore(11.8, 12.0).color, 'green');
  // 12.4 kg -> +3.3% -> yellow
  assert.equal(getWeightSemaphore(12.4, 12.0).color, 'yellow');
  // 13.0 kg -> +8.3% -> red
  assert.equal(getWeightSemaphore(13.0, 12.0).color, 'red');
});

test('fluid retention evaluates chest and belly delta vs base', () => {
  // Base: Pecho 60, Barriga 44
  // 59 / 42 -> delta <= 0 -> green (0-1 cm)
  const s1 = getFluidRetentionSemaphore(59, 42, 60, 44);
  assert.equal(s1.color, 'green');
  assert.equal(s1.isNormal, true);

  // 61 / 45 -> chest delta +1, belly delta +1 -> green (<= 1.0 cm)
  const s2 = getFluidRetentionSemaphore(61, 45, 60, 44);
  assert.equal(s2.color, 'green');

  // 62 / 46 -> delta +2.0 cm -> yellow (1.1-2.5 cm)
  const s3 = getFluidRetentionSemaphore(62, 46, 60, 44);
  assert.equal(s3.color, 'yellow');
  assert.equal(s3.isWarning, true);

  // 64 / 48 -> delta +4.0 cm -> red (> 2.5 cm)
  const s4 = getFluidRetentionSemaphore(64, 48, 60, 44);
  assert.equal(s4.color, 'red');
  assert.equal(s4.isCritical, true);
});

test('diet calculation and shrinkage percentages are exact', () => {
  assert.equal(getStandardShrinkage('Batata'), 20);
  assert.equal(getStandardShrinkage('Calabacín'), 30);
  assert.equal(getStandardShrinkage('Pavo'), 0);

  // 2500g Batata with 20% merma -> 3000g total
  assert.equal(calculatePurchaseTotal(2500, 20), 3000);
  // 800g Calabacín with 30% merma -> 1040g total
  assert.equal(calculatePurchaseTotal(800, 30), 1040);
  // 600g Pavo with 0% merma -> 600g total
  assert.equal(calculatePurchaseTotal(600, 0), 600);

  // Summer Merluza rotation
  const summerMerluza = getSeasonIngredients('verano', 'merluza', DEFAULT_PREPARACION_ITEMS);
  assert.ok(summerMerluza.rawPotGrams > 250);
  assert.ok(summerMerluza.cookedPotGrams > 200);

  // Ingredient category classification
  assert.equal(getIngredientCategory('Lomo de Merluza'), 'proteina');
  assert.equal(getIngredientCategory('Pechuga de Pavo'), 'proteina');
  assert.equal(getIngredientCategory('Batata'), 'tuberculo');
  assert.equal(getIngredientCategory('Patata'), 'tuberculo');
  assert.equal(getIngredientCategory('Calabacín'), 'verdura');
  assert.equal(getIngredientCategory('Calabaza'), 'verdura');
  assert.equal(getIngredientCategory('Cáscara de huevo molida'), 'suplemento');

  // Modular diet KPI calculation (7 days vs 14 days)
  const kpis7 = calculateDietKPIs(summerMerluza.activeItems, summerMerluza.rawPotGrams, summerMerluza.cookedPotGrams, 7);
  assert.equal(kpis7.totalPots, 21);
  assert.ok(kpis7.dailyCookedGrams > 600);
  assert.ok(kpis7.proteinPct > 20);
  assert.ok(kpis7.carbsPct > 20);
  assert.ok(kpis7.estimatedDailyKcal > 500 && kpis7.estimatedDailyKcal < 1000);

  const kpis14 = calculateDietKPIs(summerMerluza.activeItems, summerMerluza.rawPotGrams, summerMerluza.cookedPotGrams, 14);
  assert.equal(kpis14.totalPots, 42);
  assert.equal(kpis14.cookedPotGrams, kpis7.cookedPotGrams);
  assert.ok(kpis14.batchCompraKg > kpis7.batchCompraKg);
});

test('age calculation from 2016-10-03 is accurate', () => {
  const age = calculateAge('2016-10-03', new Date(2026, 10, 6)); // Nov 6, 2026
  assert.equal(age.years, 10);
  assert.equal(age.months, 1);
});
