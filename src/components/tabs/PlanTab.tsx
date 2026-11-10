import React from 'react';
import { useAquilesStore } from '../../lib/store';
import { CalendarDays, Clock, Sparkles, Sun, Moon } from 'lucide-react';

const DAYS_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const PlanTab: React.FC = () => {
  const store = useAquilesStore();
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();

  // Smart Focus at 14:00
  const isAfternoonFocus = currentHour >= 14;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                Plan Diario de Suplementos · Smart Focus
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Espejo de consulta rápida de solo lectura. Enfoque inteligente automático a las 14:00.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold self-start sm:self-center">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>
              Hora actual: {String(currentHour).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')} · {isAfternoonFocus ? '🌅 Enfoque Tarde (≥ 14:00)' : '🌄 Enfoque Mañana (< 14:00)'}
            </span>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {store.weeklySupplements
          .sort((a, b) => a.day_of_week - b.day_of_week)
          .map((sup) => {
            const isToday = sup.day_of_week === currentDay;
            const dayName = DAYS_NAMES[sup.day_of_week];

            return (
              <div
                key={sup.id}
                className={`glass-card p-5 transition-all ${
                  isToday
                    ? 'border-2 border-emerald-600 ring-4 ring-emerald-500/10 shadow-md'
                    : 'border border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
                      {dayName}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                        Día de Hoy
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Día {sup.day_of_week}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Mañana */}
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      isToday && !isAfternoonFocus
                        ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 shadow-xs ring-1 ring-amber-400'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5" />
                        <span>Toma de Mañana</span>
                      </span>
                      {isToday && !isAfternoonFocus && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                          ACTUAL
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                      {sup.morning || '—'}
                    </p>
                  </div>

                  {/* Tarde */}
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      isToday && isAfternoonFocus
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-xs ring-1 ring-blue-400'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5" />
                        <span>Toma de Tarde</span>
                      </span>
                      {isToday && isAfternoonFocus && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100">
                          ACTUAL (≥14:00)
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                      {sup.afternoon || '—'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Resumen diario:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{sup.content}</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
