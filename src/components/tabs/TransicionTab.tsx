import React, { useState } from 'react';
import { GitBranch, Calculator, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const TransicionTab: React.FC = () => {
  const [dailyGrams, setDailyGrams] = useState<number>(657); // 3 potes * 219g
  const [oldDietName, setOldDietName] = useState<string>('Dieta Actual (Merluza)');
  const [newDietName, setNewDietName] = useState<string>('Nueva Dieta (Pavo / Salmón)');
  const [currentPhase, setCurrentPhase] = useState<number>(1);

  const phases = [
    {
      phase: 1,
      name: 'Fase 1: Introducción Suave',
      days: 'Días 1 al 3',
      oldPct: 75,
      newPct: 25,
      description: 'Adaptación de flora intestinal y tolerancia enzimática inicial.',
    },
    {
      phase: 2,
      name: 'Fase 2: Transición Media',
      days: 'Días 4 al 6',
      oldPct: 50,
      newPct: 50,
      description: 'Equilibrio 1:1. Monitorear consistencia de heces y apetito.',
    },
    {
      phase: 3,
      name: 'Fase 3: Consolidación',
      days: 'Días 7 al 9',
      oldPct: 25,
      newPct: 75,
      description: 'Predominancia del nuevo alimento con tolerancia confirmada.',
    },
    {
      phase: 4,
      name: 'Fase 4: Pauta Completa',
      days: 'Día 10 en adelante',
      oldPct: 0,
      newPct: 100,
      description: 'Transición culminada con éxito al 100% del nuevo menú.',
    },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
              Plan Reactivo de Transición Dietética
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Protocolo veterinario en 3 fases progresivas para prevenir disbiosis gastrointestinal o alergias alimentarias.
            </p>
          </div>
        </div>

        {/* Dynamic Calculator Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Ración Diaria Total (gramos cocidos)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={dailyGrams}
              onChange={(e) => setDailyGrams(Math.max(50, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              3 tomas de {Math.round(dailyGrams / 3)} g cada una
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Alimento Origen (Antiguo)
            </label>
            <input
              type="text"
              value={oldDietName}
              onChange={(e) => setOldDietName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Alimento Destino (Nuevo)
            </label>
            <input
              type="text"
              value={newDietName}
              onChange={(e) => setNewDietName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Interactive Phases Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {phases.map((p) => {
          const oldGrams = Math.round((dailyGrams * p.oldPct) / 100);
          const newGrams = Math.round((dailyGrams * p.newPct) / 100);
          const isActive = currentPhase === p.phase;

          return (
            <div
              key={p.phase}
              onClick={() => setCurrentPhase(p.phase)}
              className={`glass-card p-5 cursor-pointer transition-all border-2 ${
                isActive
                  ? 'border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                  : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-mono">
                  {p.days}
                </span>
                {isActive && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Fase Seleccionada
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100">
                {p.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                {p.description}
              </p>

              {/* Ratio visual bar */}
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700 mb-3">
                <div
                  className="h-full bg-slate-400 dark:bg-slate-500 transition-all"
                  style={{ width: `${p.oldPct}%` }}
                  title={`${oldDietName}: ${p.oldPct}%`}
                />
                <div
                  className="h-full bg-emerald-600 transition-all"
                  style={{ width: `${p.newPct}%` }}
                  title={`${newDietName}: ${p.newPct}%`}
                />
              </div>

              {/* Exact gram distribution */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 block truncate">{oldDietName}</span>
                  <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-300">
                    {oldGrams} g/día
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono">
                    ({Math.round(oldGrams / 3)} g/toma)
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40">
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block truncate">{newDietName}</span>
                  <span className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400">
                    {newGrams} g/día
                  </span>
                  <span className="block text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-mono">
                    ({Math.round(newGrams / 3)} g/toma)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
