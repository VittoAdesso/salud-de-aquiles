import React from 'react';
import { Sun, Snowflake } from 'lucide-react';
import { BatchDuration } from '../../hooks/useDietPreparation';

interface PreparationSelectorsProps {
  season: 'verano' | 'invierno';
  onSeasonChange: (season: 'verano' | 'invierno') => void;
  protein: 'merluza' | 'pavo';
  onProteinChange: (protein: 'merluza' | 'pavo') => void;
  batchDays: BatchDuration;
  onBatchDaysChange: (days: BatchDuration) => void;
}

export const PreparationSelectors: React.FC<PreparationSelectorsProps> = ({
  season,
  onSeasonChange,
  protein,
  onProteinChange,
  batchDays,
  onBatchDaysChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
      {/* Season Switcher */}
      <div>
        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">
          Temporada Dietética
        </label>
        <div className="grid grid-cols-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
          <button
            type="button"
            onClick={() => onSeasonChange('verano')}
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
            onClick={() => onSeasonChange('invierno')}
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
            onClick={() => onProteinChange('merluza')}
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
            onClick={() => onProteinChange('pavo')}
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
            onClick={() => onBatchDaysChange(7)}
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
            onClick={() => onBatchDaysChange(14)}
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
            onClick={() => onBatchDaysChange(3.5)}
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
  );
};
