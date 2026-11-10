import React from 'react';
import { useAquilesStore } from '../../lib/store';
import { Apple, Sparkles, Fish, Egg, Heart, Info } from 'lucide-react';

const DAYS_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const NutricionTab: React.FC = () => {
  const store = useAquilesStore();

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Apple className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
              Nutrición Natural y Suplementación
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fórmula nutricional cocinada con aporte biológico de ácidos grasos, calcio y probióticos.
            </p>
          </div>
        </div>

        {/* Nutritional Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide block">
              1. Proteína Monoproteica
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Rotación 3 semanas Merluza (blanca, antiinflamatoria, baja en grasa) y 1 semana Pechuga de Pavo confitada.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide block">
              2. Carbohidrato y Fibra
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Batata (verano) o Patata (invierno) muy cocida para absorción glucémica lenta, con calabacín y calabaza.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide block">
              3. Micronutrientes Esenciales
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Cáscara de huevo molida (balance Ca:P), sardinas (Omega-3 EPA/DHA), kéfir de cabra (microbioma) y arándanos.
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Supplements (Apple Health Style Grid) */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
              Calendario Semanal de Suplementos (Apple Health Style)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribución de extras por día de la semana para completar la pauta nutricional.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
          {store.weeklySupplements
            .sort((a, b) => a.day_of_week - b.day_of_week)
            .map((sup) => {
              const dayName = DAYS_NAMES[sup.day_of_week] || `Día ${sup.day_of_week}`;
              const isToday = new Date().getDay() === sup.day_of_week;

              return (
                <div
                  key={sup.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isToday
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold ${
                        isToday ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dayName}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                        Hoy
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-0.5">
                        🌅 Mañana
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                        {sup.morning || '—'}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-0.5">
                        🌇 Tarde
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                        {sup.afternoon || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block truncate">
                      {sup.content}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Comida Húmeda Autorizada */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 mb-1">
          Comida Húmeda Autorizada (Alimentación Húmeda Completa)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Lata de pescado seleccionada para alternancia puntual o emergencias.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <Fish className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Lata Salmón Monoproteico (100% Salmón)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Última verificación veterinaria: 20/03/2026. Aporte lipídico y alta palatabilidad.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Aprobado
          </span>
        </div>
      </div>
    </div>
  );
};
