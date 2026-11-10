import React, { useState, useMemo } from 'react';
import { useAquilesStore } from '../../lib/store';
import { calculateAge } from '../../lib/healthScore';
import { generateVeterinaryPdf } from '../../lib/generatePdf';
import { ConfirmationModal } from '../ConfirmationModal';
import { AlertType } from '../../lib/types';
import {
  FileText,
  Calendar,
  ShieldCheck,
  Heart,
  Pill,
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Flame,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const DashboardTab: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const store = useAquilesStore();
  const [subTab, setSubTab] = useState<'diario' | 'clinico'>('diario');
  const [alertToComplete, setAlertToComplete] = useState<AlertType | null>(null);

  const age = calculateAge(store.dogProfile.birth_date);
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const currentSeason = currentMonth >= 3 && currentMonth <= 9 ? 'Verano (Marzo - Septiembre)' : 'Invierno (Octubre - Febrero)';

  // Joint cycle active progress
  const jointCycleProgress = useMemo(() => {
    if (!store.activeJointCycle) return null;
    const start = new Date(store.activeJointCycle.start_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const elapsedDays = Math.min(40, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const pct = Math.round((elapsedDays / 40) * 100);
    const cycleMonth = store.activeJointCycle.cycle_month;
    const supplementName = cycleMonth === 2 || cycleMonth === 8 ? 'Condrovet Force HA' : 'Anticox-HD';
    const doseGuide = cycleMonth === 2 || cycleMonth === 8 ? '2 comprimidos con comida' : '1 cápsula espolvoreada';
    return {
      elapsedDays,
      pct,
      supplementName,
      doseGuide,
      startDate: store.activeJointCycle.start_date,
    };
  }, [store.activeJointCycle]);

  // Streak without allergy
  const allergyStreakDays = useMemo(() => {
    const sorted = [...store.healthRecords].sort((a, b) => b.record_date.localeCompare(a.record_date));
    const lastAllergyIndex = sorted.findIndex((r) => r.has_allergy);
    if (lastAllergyIndex === -1) {
      return sorted.length > 0 ? 90 : 0;
    }
    const lastAllergyRecord = sorted[lastAllergyIndex];
    const today = new Date();
    const lastDate = new Date(lastAllergyRecord.record_date);
    const diff = Math.max(0, Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)));
    return diff;
  }, [store.healthRecords]);

  // Sorted weights for chart
  const recentWeightRecords = useMemo(() => {
    return store.healthRecords
      .filter((h) => typeof h.weight === 'number' && !isNaN(h.weight))
      .sort((a, b) => a.record_date.localeCompare(b.record_date))
      .slice(-20); // last 20 for crisp daily chart
  }, [store.healthRecords]);

  const allWeightRecords = useMemo(() => {
    return store.healthRecords
      .filter((h) => typeof h.weight === 'number' && !isNaN(h.weight))
      .sort((a, b) => a.record_date.localeCompare(b.record_date));
  }, [store.healthRecords]);

  const handleConfirmAlert = () => {
    if (alertToComplete) {
      store.completeAlert(alertToComplete);
      setAlertToComplete(null);
    }
  };

  const handleStartJointCycle = () => {
    const m = new Date().getMonth() + 1;
    store.startJointCycle(m);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header Card with Patient Overview */}
      <div className="glass-card p-5 sm:p-6 bg-linear-to-br from-white to-slate-50/60 dark:from-slate-900 dark:to-slate-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-display font-bold text-2xl shadow-md">
              A
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">
                  {store.dogProfile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Canino · Mestizo
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Nacido el {store.dogProfile.birth_date} · <span className="font-semibold text-slate-700 dark:text-slate-300">{age.text}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-center">
            <button
              onClick={() => {
                generateVeterinaryPdf({
                  dogProfile: store.dogProfile,
                  alertLogs: store.alertLogs,
                  healthRecords: store.healthRecords,
                  dietItems: store.dietItems,
                  wetFood: store.wetFood,
                  configBase: store.configBase,
                  registrosMediciones: store.registrosMediciones,
                  logAjustes: store.logAjustes,
                  preparacionItems: store.preparacionItems,
                });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-sm transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Exportar Informe Veterinario (PDF)</span>
            </button>
          </div>
        </div>

        {/* Clinical KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          {/* Current Weight */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Último Peso Registrado
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-slate-100 tabular-nums">
                {store.latestWeight ? `${store.latestWeight} kg` : '—'}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  store.weightSemaphore.color === 'green'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : store.weightSemaphore.color === 'yellow'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                }`}
              >
                {store.weightSemaphore.pctDiff >= 0 ? '+' : ''}
                {store.weightSemaphore.pctDiff}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Ideal: {store.dogProfile.ideal_weight} kg (±2% / ±5%)
            </span>
          </div>

          {/* Health Score */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Índice Clínico Global
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 tabular-nums">
                {store.healthScore.score}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 block mt-0.5">
              {store.healthScore.label}
            </span>
          </div>

          {/* Liquid Retention */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Retención de Líquidos
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  store.fluidRetentionStatus.color === 'green'
                    ? 'bg-emerald-500'
                    : store.fluidRetentionStatus.color === 'yellow'
                    ? 'bg-amber-500'
                    : 'bg-red-500 animate-pulse'
                }`}
              />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                {store.fluidRetentionStatus.isNormal ? 'Normal (Estable)' : store.fluidRetentionStatus.isWarning ? 'Aviso Leve' : 'Alerta Crítica'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Pecho {store.latestMedicion?.medida_pecho || store.configBase.base_pecho}cm / Barriga {store.latestMedicion?.medida_barriga || store.configBase.base_barriga}cm
            </span>
          </div>

          {/* Allergy Free Streak */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Días Sin Alergia
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-slate-100 tabular-nums">
                {allergyStreakDays}
              </span>
              <span className="text-xs text-slate-500">días</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block mt-0.5">
              Vigilancia preventiva
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Resumen Diario vs Análisis Clínico */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl max-w-sm">
        <button
          onClick={() => setSubTab('diario')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            subTab === 'diario'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Resumen Diario
        </button>
        <button
          onClick={() => setSubTab('clinico')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            subTab === 'clinico'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Análisis Clínico
        </button>
      </div>

      {subTab === 'diario' ? (
        <div className="space-y-6">
          {/* Season & Seasonality banner */}
          <div className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-l-emerald-600">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Temporada Dietética Activa
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {currentSeason}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ración recomendada: 21 potes/semana (3 tomas/día). Pote crudo 243g · Pote cocido ~219g (90%).
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('preparacion')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
            >
              <span>Ver Preparación</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Joint Cycle Tracker (Mantenimiento Articular 40 días) */}
          <div className="glass-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
                    Mantenimiento Articular (4 ciclos / año)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ciclos de 40 días en Feb, May, Ago, Nov. Feb/Ago: Condrovet HA (2 comp). May/Nov: Anticox-HD (1 cáp).
                  </p>
                </div>
              </div>

              {jointCycleProgress ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ciclo Activo en Curso</span>
                </span>
              ) : (
                <button
                  onClick={handleStartJointCycle}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 active:scale-95 shadow-xs transition-all"
                >
                  Iniciar Ciclo de 40 días
                </button>
              )}
            </div>

            {jointCycleProgress && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {jointCycleProgress.supplementName} · {jointCycleProgress.doseGuide}
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {jointCycleProgress.elapsedDays} / 40 días ({jointCycleProgress.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${jointCycleProgress.pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Inicio: {jointCycleProgress.startDate}</span>
                  <span>Restan {Math.max(0, 40 - jointCycleProgress.elapsedDays)} días</span>
                </div>
              </div>
            )}
          </div>

          {/* Daily Weight Graph with Ideal Reference & ±2% / ±5% thresholds */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
                  Evolución Reciente del Peso
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Línea base ideal: {store.dogProfile.ideal_weight} kg · Bandas verde (±2%) y amarilla (±5%)
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('registro')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Nuevo Pesaje</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* SVG Weight Chart */}
            <div className="w-full h-52 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Background thresholds */}
                {/* Min: 11kg, Max: 18kg */}
                {(() => {
                  const minY = 11;
                  const maxY = 18;
                  const ideal = store.dogProfile.ideal_weight || 12;
                  const getY = (val: number) => 180 - ((val - minY) / (maxY - minY)) * 160;

                  const yIdeal = getY(ideal);
                  const yPlus2 = getY(ideal * 1.02);
                  const yMinus2 = getY(ideal * 0.98);
                  const yPlus5 = getY(ideal * 1.05);
                  const yMinus5 = getY(ideal * 0.95);

                  // Points from recentWeightRecords
                  const points = recentWeightRecords.map((r, i) => {
                    const x = 30 + (i / Math.max(1, recentWeightRecords.length - 1)) * 540;
                    const y = getY(r.weight || ideal);
                    return { x, y, weight: r.weight, date: r.record_date };
                  });

                  const pathD = points.reduce(
                    (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                    ''
                  );
                  const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z` : '';

                  return (
                    <>
                      {/* ±5% band (yellow) */}
                      <rect x="30" y={yPlus5} width="540" height={yMinus5 - yPlus5} fill="#fef3c7" opacity="0.35" />

                      {/* ±2% band (green) */}
                      <rect x="30" y={yPlus2} width="540" height={yMinus2 - yPlus2} fill="#d1fae5" opacity="0.45" />

                      {/* Ideal line */}
                      <line x1="30" y1={yIdeal} x2="570" y2={yIdeal} stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
                      <text x="575" y={yIdeal + 3} fill="#64748b" fontSize="9" textAnchor="start">
                        Ideal {ideal}kg
                      </text>

                      {/* Area fill */}
                      {areaD && <path d={areaD} fill="url(#weightGrad)" />}

                      {/* Line */}
                      {pathD && <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                      {/* Points */}
                      {points.map((p, idx) => (
                        <g key={idx} className="cursor-pointer group">
                          <circle cx={p.x} cy={p.y} r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                        </g>
                      ))}

                      {/* Bottom axis date labels */}
                      {points.length > 0 && (
                        <>
                          <text x={points[0].x} y="196" fill="#94a3b8" fontSize="8" textAnchor="start">
                            {points[0].date}
                          </text>
                          <text x={points[points.length - 1].x} y="196" fill="#94a3b8" fontSize="8" textAnchor="end">
                            {points[points.length - 1].date} ({points[points.length - 1].weight}kg)
                          </text>
                        </>
                      )}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Medical Alerts Cards with Semaphores */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
                  Alertas Sanitarias y Preventivas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Desparasitación, Corazón (anclado a 7 may/7 nov), Vacunas y Articular
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {store.alertStatuses.map((alert) => {
                const isOverdue = alert.daysRemaining < 0;
                const isUrgent = alert.color === 'red';

                return (
                  <div
                    key={alert.key}
                    className={`p-4 rounded-xl border transition-all ${
                      alert.color === 'red'
                        ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                        : alert.color === 'yellow'
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 ${
                            alert.color === 'green'
                              ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50'
                              : alert.color === 'yellow'
                              ? 'bg-amber-500 shadow-xs shadow-amber-500/50'
                              : 'bg-red-500 animate-pulse shadow-xs shadow-red-500/50'
                          }`}
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                            {alert.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {alert.subtitle}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${
                          alert.color === 'green'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : alert.color === 'yellow'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {alert.statusLabel}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="text-slate-500 dark:text-slate-400">
                        <span>Próxima cita: </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono">
                          {alert.nextDate}
                        </span>
                      </div>

                      <button
                        onClick={() => setAlertToComplete(alert.key)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          isUrgent
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Marcar hecha</span>
                      </button>
                    </div>

                    {alert.actionGuide && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                        💡 {alert.actionGuide}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Sub-Tab 2: Análisis Clínico */
        <div className="space-y-6">
          {/* Long term weight chart */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
              Histórico Integral de Peso (2021 – 2026)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Total 92 registros históricos. Reducción controlada desde 18.0 kg hasta 11.7 kg.
            </p>

            <div className="w-full h-56 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
                {(() => {
                  const minY = 10;
                  const maxY = 19;
                  const getY = (val: number) => 180 - ((val - minY) / (maxY - minY)) * 160;

                  const points = allWeightRecords.map((r, i) => ({
                    x: 35 + (i / (allWeightRecords.length - 1)) * 630,
                    y: getY(r.weight || 12),
                    weight: r.weight,
                    date: r.record_date,
                  }));

                  const pathD = points.reduce(
                    (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                    ''
                  );

                  return (
                    <>
                      {/* Grid lines */}
                      {[12, 14, 16, 18].map((kg) => (
                        <g key={kg}>
                          <line x1="35" y1={getY(kg)} x2="665" y2={getY(kg)} stroke="#e2e8f0" strokeDasharray="3 3" />
                          <text x="25" y={getY(kg) + 3} fill="#94a3b8" fontSize="8" textAnchor="end">
                            {kg}
                          </text>
                        </g>
                      ))}

                      {/* Path */}
                      <path d={pathD} fill="none" stroke="#059669" strokeWidth="2.5" />

                      {/* Highlights */}
                      {points.map((p, idx) => (
                        <circle key={idx} cx={p.x} cy={p.y} r="2.5" fill="#059669" />
                      ))}

                      <text x={points[0].x} y="196" fill="#94a3b8" fontSize="8" textAnchor="start">
                        {points[0].date} (18.0 kg)
                      </text>
                      <text x={points[points.length - 1].x} y="196" fill="#94a3b8" fontSize="8" textAnchor="end">
                        {points[points.length - 1].date} ({points[points.length - 1].weight} kg)
                      </text>
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Weight Delta Bars */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
              Variación de Peso entre Pesajes Consecutivos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Verde = ganancia (kg) · Rojo = pérdida (kg)
            </p>

            <div className="w-full h-44 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160">
                <line x1="30" y1="80" x2="670" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                <text x="20" y="83" fill="#64748b" fontSize="8" textAnchor="end">
                  0 kg
                </text>

                {(() => {
                  const deltas: { delta: number; date: string }[] = [];
                  for (let i = 1; i < allWeightRecords.length; i++) {
                    const diff = (allWeightRecords[i].weight || 0) - (allWeightRecords[i - 1].weight || 0);
                    deltas.push({ delta: diff, date: allWeightRecords[i].record_date });
                  }
                  const barW = Math.max(2, 630 / deltas.length - 1.5);

                  return deltas.map((d, i) => {
                    const x = 35 + (i / deltas.length) * 630;
                    const barH = Math.min(65, Math.abs(d.delta) * 35);
                    const y = d.delta >= 0 ? 80 - barH : 80;
                    const color = d.delta >= 0 ? '#10b981' : '#ef4444';

                    return <rect key={i} x={x} y={y} width={barW} height={Math.max(1, barH)} fill={color} rx="1" />;
                  });
                })()}
              </svg>
            </div>
          </div>

          {/* Monthly Allergy Heatmap */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
                  Matriz de Salud Mensual (Alergias)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verde = sin alergia registrada · Rojo = episodios con alergia · Gris = sin datos
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500" /> Sin alergia
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-500" /> Alergia
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                {/* Headers */}
                <div className="grid grid-cols-13 gap-1 mb-1 text-[11px] font-semibold text-slate-400 text-center">
                  <span>Año</span>
                  {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>

                {[2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
                  <div key={yr} className="grid grid-cols-13 gap-1 mb-1 items-center">
                    <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                      {yr}
                    </span>
                    {Array.from({ length: 12 }).map((_, mIdx) => {
                      const matches = store.healthRecords.filter((h) => {
                        const [yStr, mStr] = h.record_date.split('-');
                        return parseInt(yStr, 10) === yr && parseInt(mStr, 10) === mIdx + 1;
                      });

                      let bgColor = 'bg-slate-100 dark:bg-slate-800';
                      let label = 'Sin datos';
                      if (matches.length > 0) {
                        const hasAllergy = matches.some((m) => m.has_allergy);
                        if (hasAllergy) {
                          bgColor = 'bg-red-500 text-white';
                          label = 'Episodio de alergia';
                        } else {
                          bgColor = 'bg-emerald-500 text-white';
                          label = 'Sin alergia';
                        }
                      }

                      return (
                        <div
                          key={mIdx}
                          title={`${yr}-${mIdx + 1}: ${label}`}
                          className={`h-7 rounded-md flex items-center justify-center text-[10px] font-semibold transition-transform hover:scale-110 ${bgColor}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Completing an Alert */}
      <ConfirmationModal
        isOpen={!!alertToComplete}
        title="Confirmar Alerta Realizada"
        message={`¿Confirmas que se ha administrado o realizado ${alertToComplete?.replace(/_/g, ' ')}? Se registrará la fecha y se actualizará automáticamente la próxima cita.`}
        confirmLabel="Marcar Hecha"
        isDestructive={false}
        onConfirm={handleConfirmAlert}
        onCancel={() => setAlertToComplete(null)}
      />
    </div>
  );
};
