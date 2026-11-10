import React from 'react';
import { COOKING_GUIDE } from '../../lib/diet';
import { Flame, Clock, Thermometer, Gauge, Sparkles, AlertCircle } from 'lucide-react';

export const CoccionTab: React.FC = () => {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
              Guía de Cocción (Robot Mambo Mix Habana)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Parámetros de cocción suave al vapor o con pala MamboMix para conservar nutrientes y facilitar la digestión.
            </p>
          </div>
        </div>

        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <span className="font-bold">Regla de oro de cocción canina:</span> Cocinar siempre a baja/media temperatura (100–110 ºC) sin dorar ni caramelizar (evitar reacción de Maillard). El pescado se confita en su propio jugo; tubérculos bien tiernos para gelatinizar el almidón.
          </div>
        </div>
      </div>

      {/* Cooking Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COOKING_GUIDE.map((guide) => (
          <div
            key={guide.food}
            className="glass-card p-5 flex flex-col justify-between border-t-4 border-t-emerald-600 space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100">
                  {guide.food}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {guide.accessory}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3.5">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                    <Thermometer className="w-3 h-3 text-red-500" />
                    <span>Temp</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {guide.temp}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    <span>Tiempo</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {guide.time}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                    <Gauge className="w-3 h-3 text-blue-500" />
                    <span>Velocidad</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {guide.speed}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <span className="text-slate-400">Potencia: </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{guide.power}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-xl">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                Recomendación de preparación:
              </span>
              {guide.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
