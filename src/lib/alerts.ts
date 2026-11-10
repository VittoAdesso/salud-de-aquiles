import { AlertLog, AlertStatus, AlertType, JointCycle, SemaphoreColor } from './types';

export const HEART_ANCHOR = '2026-05-07';

/**
 * Format date to YYYY-MM-DD in local time
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function diffDays(targetDateStr: string, fromDateStr?: string): number {
  const target = parseDate(targetDateStr);
  const from = fromDateStr ? parseDate(fromDateStr) : new Date();
  // normalize to midnight
  const tMid = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const fMid = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  return Math.round((tMid - fMid) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate the next anchor-aligned heart control date.
 * Anchored to May 7 and Nov 7 of each year.
 * Advances in 6-month steps from the anchor without drifting to "today".
 */
export function calcNextHeartDate(currentScheduledOrFromStr?: string): string {
  const anchor = parseDate(HEART_ANCHOR); // 2026-05-07
  const reference = currentScheduledOrFromStr ? parseDate(currentScheduledOrFromStr) : new Date();

  // Find the next May 7 or Nov 7 that is strictly greater than reference (or if today is reference, next future)
  let year = anchor.getFullYear();
  // We can look at 5-07 and 11-07 for candidate years
  const candidates: Date[] = [];
  for (let y = year - 1; y <= year + 5; y++) {
    candidates.push(new Date(y, 4, 7, 12, 0, 0)); // May 7
    candidates.push(new Date(y, 10, 7, 12, 0, 0)); // Nov 7
  }
  candidates.sort((a, b) => a.getTime() - b.getTime());

  const refTime = reference.getTime();
  const next = candidates.find((c) => c.getTime() > refTime);
  return next ? formatDate(next) : `${year + 1}-05-07`;
}

/**
 * Default next date calculation for fixed scheduled events
 */
/**
 * Calculate the next scheduled date strictly after completion of the current period.
 */
export function calcNextDateAfterCompletion(
  alertType: AlertType,
  previousScheduledDate?: string,
  todayStr?: string
): string {
  const today = todayStr ? parseDate(todayStr) : new Date();
  const prevDate = previousScheduledDate ? parseDate(previousScheduledDate) : today;
  // Reference date to advance from: the later of today + 10 days or previous scheduled date + 10 days
  const refTime = Math.max(today.getTime(), prevDate.getTime()) + 10 * 24 * 60 * 60 * 1000;
  const refDate = new Date(refTime);
  const year = refDate.getFullYear();

  switch (alertType) {
    case 'control_corazon':
      return calcNextHeartDate(previousScheduledDate || todayStr);

    case 'collar_bayer': {
      // 15 may, 15 nov
      const candidates: Date[] = [];
      for (let y = year - 1; y <= year + 3; y++) {
        candidates.push(new Date(y, 4, 15, 12, 0, 0));
        candidates.push(new Date(y, 10, 15, 12, 0, 0));
      }
      candidates.sort((a, b) => a.getTime() - b.getTime());
      const next = candidates.find((c) => c.getTime() > refTime);
      return next ? formatDate(next) : `${year + 1}-05-15`;
    }

    case 'desparasitacion': {
      // 1 ene, 1 abr, 1 jul, 1 oct
      const quarters: Date[] = [];
      for (let y = year - 1; y <= year + 2; y++) {
        quarters.push(new Date(y, 0, 1, 12, 0, 0));
        quarters.push(new Date(y, 3, 1, 12, 0, 0));
        quarters.push(new Date(y, 6, 1, 12, 0, 0));
        quarters.push(new Date(y, 9, 1, 12, 0, 0));
      }
      quarters.sort((a, b) => a.getTime() - b.getTime());
      const next = quarters.find((q) => q.getTime() > refTime);
      return next ? formatDate(next) : `${year + 1}-01-01`;
    }

    case 'vacuna_rabia': {
      // 7 feb
      const next = new Date(year, 1, 7, 12, 0, 0);
      if (next.getTime() > refTime) return formatDate(next);
      return formatDate(new Date(year + 1, 1, 7, 12, 0, 0));
    }

    case 'vacuna_heptavalente': {
      // 7 mar
      const next = new Date(year, 2, 7, 12, 0, 0);
      if (next.getTime() > refTime) return formatDate(next);
      return formatDate(new Date(year + 1, 2, 7, 12, 0, 0));
    }

    case 'vacuna_tos_perrera': {
      // 1 jun
      const next = new Date(year, 5, 1, 12, 0, 0);
      if (next.getTime() > refTime) return formatDate(next);
      return formatDate(new Date(year + 1, 5, 1, 12, 0, 0));
    }

    case 'condrovet': {
      // Feb(2), May(5), Aug(8), Nov(11) on day 1
      const cycles: Date[] = [];
      for (let y = year - 1; y <= year + 2; y++) {
        cycles.push(new Date(y, 1, 1, 12, 0, 0));
        cycles.push(new Date(y, 4, 1, 12, 0, 0));
        cycles.push(new Date(y, 7, 1, 12, 0, 0));
        cycles.push(new Date(y, 10, 1, 12, 0, 0));
      }
      cycles.sort((a, b) => a.getTime() - b.getTime());
      const next = cycles.find((c) => c.getTime() > refTime);
      return next ? formatDate(next) : `${year + 1}-02-01`;
    }
  }
}

export function getDefaultNextDate(alertType: AlertType, todayStr?: string): string {
  const today = todayStr ? parseDate(todayStr) : new Date();
  const year = today.getFullYear();

  switch (alertType) {
    case 'control_corazon':
      return calcNextHeartDate(todayStr);

    case 'desparasitacion': {
      // 1 ene, 1 abr, 1 jul, 1 oct
      const quarters = [
        new Date(year, 0, 1, 12, 0, 0),
        new Date(year, 3, 1, 12, 0, 0),
        new Date(year, 6, 1, 12, 0, 0),
        new Date(year, 9, 1, 12, 0, 0),
        new Date(year + 1, 0, 1, 12, 0, 0),
      ];
      const next = quarters.find((q) => q.getTime() >= today.getTime());
      return formatDate(next || quarters[0]);
    }

    case 'collar_bayer': {
      // 15 may, 15 nov
      const dates = [
        new Date(year, 4, 15, 12, 0, 0),
        new Date(year, 10, 15, 12, 0, 0),
        new Date(year + 1, 4, 15, 12, 0, 0),
      ];
      const next = dates.find((d) => d.getTime() >= today.getTime());
      return formatDate(next || dates[0]);
    }

    case 'vacuna_rabia': {
      // 7 feb
      const feb7 = new Date(year, 1, 7, 12, 0, 0);
      if (feb7.getTime() >= today.getTime()) return formatDate(feb7);
      return formatDate(new Date(year + 1, 1, 7, 12, 0, 0));
    }

    case 'vacuna_heptavalente': {
      // 7 mar
      const mar7 = new Date(year, 2, 7, 12, 0, 0);
      if (mar7.getTime() >= today.getTime()) return formatDate(mar7);
      return formatDate(new Date(year + 1, 2, 7, 12, 0, 0));
    }

    case 'vacuna_tos_perrera': {
      // 1 jun
      const jun1 = new Date(year, 5, 1, 12, 0, 0);
      if (jun1.getTime() >= today.getTime()) return formatDate(jun1);
      return formatDate(new Date(year + 1, 5, 1, 12, 0, 0));
    }

    case 'condrovet': {
      // Feb(2), May(5), Aug(8), Nov(11) on day 1
      const cycles = [
        new Date(year, 1, 1, 12, 0, 0),
        new Date(year, 4, 1, 12, 0, 0),
        new Date(year, 7, 1, 12, 0, 0),
        new Date(year, 10, 1, 12, 0, 0),
        new Date(year + 1, 1, 1, 12, 0, 0),
      ];
      const next = cycles.find((c) => c.getTime() >= today.getTime());
      return formatDate(next || cycles[0]);
    }
  }
}

/**
 * Determine semaphore color for an alert
 * - General: red < 7 days or overdue, yellow 7-30 days, green > 30 days
 * - Heart control: red overdue (< 0 days), yellow < 30 days, green > 30 days
 */
export function getAlertSemaphoreColor(alertType: AlertType, daysRemaining: number): SemaphoreColor {
  if (alertType === 'control_corazon') {
    if (daysRemaining < 0) return 'red';
    if (daysRemaining <= 30) return 'yellow';
    return 'green';
  }

  if (daysRemaining < 7) return 'red';
  if (daysRemaining <= 30) return 'yellow';
  return 'green';
}

/**
 * Metadata for all 7 alert types
 */
export const ALERT_DEFINITIONS: Record<
  AlertType,
  {
    title: string;
    subtitle: string;
    recurrence: string;
    actionGuide: string;
  }
> = {
  desparasitacion: {
    title: 'Desparasitación Interna',
    subtitle: 'Trimestral (1 ene / 1 abr / 1 jul / 1 oct)',
    recurrence: 'Trimestral',
    actionGuide: 'Comprimido antiparasitario interno con comida según peso.',
  },
  collar_bayer: {
    title: 'Collar Bayer (Seresto)',
    subtitle: 'Semestral (15 may / 15 nov)',
    recurrence: 'Semestral (6 meses)',
    actionGuide: 'Renovar collar Seresto/Bayer para pulgas, garrapatas y flebótomos.',
  },
  control_corazon: {
    title: 'Control Corazón (Ecocardiograma / Revisión)',
    subtitle: 'Semestral anclado al día 7 (7 may / 7 nov)',
    recurrence: 'Semestral fijo (7 mayo / 7 nov)',
    actionGuide: 'Control cardiológico veterinario y ecografía pericárdica.',
  },
  condrovet: {
    title: 'Mantenimiento Articular',
    subtitle: '4 ciclos de 40 días/año (Feb, May, Ago, Nov)',
    recurrence: '4 ciclos/año · 40 días',
    actionGuide: 'Feb/Ago: Condrovet Force HA (2 comp.). May/Nov: Anticox-HD (1 cáp.).',
  },
  vacuna_tos_perrera: {
    title: 'Vacuna Tos de la Perrera',
    subtitle: 'Anual (1 de junio)',
    recurrence: 'Anual (12 meses)',
    actionGuide: 'Vacunación intranasal o inyectable anual.',
  },
  vacuna_rabia: {
    title: 'Vacuna de la Rabia',
    subtitle: 'Anual (7 de febrero)',
    recurrence: 'Anual',
    actionGuide: 'Vacuna antirrábica obligatoria anual.',
  },
  vacuna_heptavalente: {
    title: 'Vacuna Heptavalente',
    subtitle: 'Anual (7 de marzo)',
    recurrence: 'Anual',
    actionGuide: 'Revacunación polivalente anual (moquillo, parvovirus, etc.).',
  },
};

/**
 * Compute the active status for each alert type from alert logs and joint cycles
 */
export function computeAlertStatuses(
  alertLogs: AlertLog[],
  activeJointCycle?: JointCycle | null,
  referenceDateStr?: string
): AlertStatus[] {
  const refDateStr = referenceDateStr || formatDate(new Date());

  const alertTypes: AlertType[] = [
    'control_corazon',
    'condrovet',
    'desparasitacion',
    'collar_bayer',
    'vacuna_tos_perrera',
    'vacuna_rabia',
    'vacuna_heptavalente',
  ];

  return alertTypes.map((key) => {
    const meta = ALERT_DEFINITIONS[key];
    const logsOfType = alertLogs
      .filter((l) => l.alert_type === key)
      .sort((a, b) => (b.completed_date || '').localeCompare(a.completed_date || ''));

    const latestLog = logsOfType[0];

    // Determine target next date
    let nextDate = latestLog?.next_date;
    if (!nextDate) {
      nextDate = getDefaultNextDate(key, refDateStr);
    }

    const daysRemaining = diffDays(nextDate, refDateStr);
    const isOverdue = daysRemaining < 0;

    // Special joint cycle check: active cycle overrides overdue visual state
    let color = getAlertSemaphoreColor(key, daysRemaining);
    let statusLabel = '';

    if (key === 'condrovet' && activeJointCycle && activeJointCycle.active) {
      // Joint cycle is active!
      const start = parseDate(activeJointCycle.start_date);
      const elapsedDays = Math.max(0, diffDays(refDateStr, activeJointCycle.start_date));
      const remainingDaysInCycle = Math.max(0, 40 - elapsedDays);
      color = remainingDaysInCycle > 5 ? 'green' : 'yellow';
      statusLabel = `Ciclo Activo (${elapsedDays}/40 días completados)`;
    } else {
      if (isOverdue) {
        statusLabel = `Vencida hace ${Math.abs(daysRemaining)} días`;
      } else if (daysRemaining === 0) {
        statusLabel = '¡Toca hoy!';
      } else {
        statusLabel = `En ${daysRemaining} días`;
      }
    }

    // Is done this period?
    let isDoneThisPeriod = false;
    if (key === 'control_corazon') {
      // only "hecha" if next_date is in the future relative to refDate
      isDoneThisPeriod = daysRemaining > 0;
    } else if (key === 'desparasitacion') {
      isDoneThisPeriod = daysRemaining > 0;
    } else if (latestLog?.completed_date) {
      const completedYear = parseDate(latestLog.completed_date).getFullYear();
      const currentYear = parseDate(refDateStr).getFullYear();
      isDoneThisPeriod = completedYear === currentYear && daysRemaining > 0;
    }

    return {
      key,
      title: meta.title,
      subtitle: meta.subtitle,
      recurrence: meta.recurrence,
      nextDate,
      daysRemaining,
      isOverdue,
      isDoneThisPeriod,
      color,
      statusLabel,
      actionGuide: meta.actionGuide,
    };
  });
}
