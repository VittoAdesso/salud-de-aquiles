import { SemaphoreColor } from './types';

export interface WeightSemaphore {
  color: SemaphoreColor;
  label: string;
  diffKg: number;
  pctDiff: number;
}

export interface FluidRetentionStatus {
  color: SemaphoreColor;
  statusTitle: string;
  statusMessage: string;
  chestDelta: number;
  bellyDelta: number;
  maxDelta: number;
  isNormal: boolean;
  isWarning: boolean;
  isCritical: boolean;
}

/**
 * Calculate age in years and months from birth date
 */
export function calculateAge(birthDateStr: string, asOfDate: Date = new Date()): { years: number; months: number; text: string } {
  const [bYear, bMonth, bDay] = birthDateStr.split('-').map(Number);
  const birth = new Date(bYear, bMonth - 1, bDay);

  let years = asOfDate.getFullYear() - birth.getFullYear();
  let months = asOfDate.getMonth() - birth.getMonth();

  if (asOfDate.getDate() < birth.getDate()) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    text: `${years} años y ${months} meses`,
  };
}

/**
 * Weight semaphore:
 * 🟢 ±2%
 * 🟡 ±2–5%
 * 🔴 >5%
 */
export function getWeightSemaphore(currentWeight: number, idealWeight: number): WeightSemaphore {
  if (!currentWeight || !idealWeight) {
    return { color: 'green', label: 'Sin datos', diffKg: 0, pctDiff: 0 };
  }

  const diffKg = Number((currentWeight - idealWeight).toFixed(2));
  const pctDiff = Number(((diffKg / idealWeight) * 100).toFixed(1));
  const absPct = Math.abs(pctDiff);

  if (absPct <= 2.0) {
    return {
      color: 'green',
      label: `Óptimo (${pctDiff >= 0 ? '+' : ''}${pctDiff}%)`,
      diffKg,
      pctDiff,
    };
  } else if (absPct <= 5.0) {
    return {
      color: 'yellow',
      label: `Desviación leve (${pctDiff >= 0 ? '+' : ''}${pctDiff}%)`,
      diffKg,
      pctDiff,
    };
  } else {
    return {
      color: 'red',
      label: `Desviación acusada (${pctDiff >= 0 ? '+' : ''}${pctDiff}%)`,
      diffKg,
      pctDiff,
    };
  }
}

/**
 * Fluid retention semaphore:
 * 🟢 0–1 cm ("Dentro del rango normal")
 * 🟡 1.1–2.5 cm ("Aviso: Incremento leve detectado")
 * 🔴 >2.5 cm ("Alerta Crítica: Posible retención de líquidos. Consultar médico")
 */
export function getFluidRetentionSemaphore(
  pecho: number,
  barriga: number,
  basePecho: number,
  baseBarriga: number
): FluidRetentionStatus {
  const chestDelta = Number((pecho - basePecho).toFixed(1));
  const bellyDelta = Number((barriga - baseBarriga).toFixed(1));
  const maxDelta = Math.max(chestDelta, bellyDelta);

  if (maxDelta <= 1.0) {
    return {
      color: 'green',
      statusTitle: 'Estable · Dentro del rango normal',
      statusMessage: 'Las medidas de pecho y barriga se mantienen en niveles normales respecto a la base configurada.',
      chestDelta,
      bellyDelta,
      maxDelta,
      isNormal: true,
      isWarning: false,
      isCritical: false,
    };
  } else if (maxDelta <= 2.5) {
    return {
      color: 'yellow',
      statusTitle: 'Aviso · Incremento leve detectado',
      statusMessage: `Se detecta un incremento de +${maxDelta.toFixed(1)} cm respecto a la base. Mantener vigilancia diaria continua.`,
      chestDelta,
      bellyDelta,
      maxDelta,
      isNormal: false,
      isWarning: true,
      isCritical: false,
    };
  } else {
    return {
      color: 'red',
      statusTitle: 'Alerta Crítica · Posible retención de líquidos',
      statusMessage: `Incremento significativo (+${maxDelta.toFixed(1)} cm). Consultar con el equipo veterinario de forma preferente.`,
      chestDelta,
      bellyDelta,
      maxDelta,
      isNormal: false,
      isWarning: false,
      isCritical: true,
    };
  }
}

/**
 * Health Score from 0 to 100 based on weight adherence and alert health
 */
export function calculateHealthScore(
  currentWeight: number,
  idealWeight: number,
  overdueAlertsCount: number,
  maxFluidDelta: number
): { score: number; label: string } {
  let score = 100;

  // Weight penalty
  if (currentWeight && idealWeight) {
    const absPct = Math.abs((currentWeight - idealWeight) / idealWeight) * 100;
    if (absPct > 5) score -= 20;
    else if (absPct > 2) score -= 10;
  }

  // Alerts penalty
  score -= overdueAlertsCount * 12;

  // Fluid retention penalty
  if (maxFluidDelta > 2.5) score -= 30;
  else if (maxFluidDelta > 1.0) score -= 15;

  score = Math.max(10, Math.min(100, Math.round(score)));

  let label = 'Excelente';
  if (score < 60) label = 'Atención requerida';
  else if (score < 80) label = 'Bueno';
  else if (score < 90) label = 'Muy Bueno';

  return { score, label };
}
