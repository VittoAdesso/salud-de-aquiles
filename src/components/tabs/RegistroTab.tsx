import React, { useState } from 'react';
import { useAquilesStore } from '../../lib/store';
import { PlusCircle, CheckCircle2, AlertCircle, Sparkles, Scale, Pill, Calendar } from 'lucide-react';

const COMMON_MEDICATIONS = ['Ninguno', 'Pinchazo', 'Apoquel', 'Histamin', 'Antibiótico', 'MSM', 'Antialérgico'];

export const RegistroTab: React.FC<{ onNavigateToHistorial: () => void }> = ({ onNavigateToHistorial }) => {
  const store = useAquilesStore();

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weight, setWeight] = useState<string>('');
  const [hasAllergy, setHasAllergy] = useState<boolean>(false);
  const [medication, setMedication] = useState<string>('Ninguno');
  const [customMed, setCustomMed] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMed = medication === 'Otro' ? customMed.trim() || 'Ninguno' : medication;
    const parsedWeight = weight ? parseFloat(weight) : undefined;

    store.addHealthRecord({
      record_date: date,
      weight: parsedWeight,
      has_allergy: hasAllergy,
      medication: finalMed,
      is_mock: false,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    // Reset weight input
    setWeight('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
              Nuevo Registro Clínico Diario
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Control diario o semanal de peso, episodios alérgicos y administración de fármacos.
            </p>
          </div>
        </div>

        {isSaved && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">¡Registro guardado exitosamente en el historial!</span>
            </div>
            <button
              onClick={onNavigateToHistorial}
              className="text-emerald-700 dark:text-emerald-400 underline font-semibold hover:text-emerald-800"
            >
              Ver en Historial
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Fecha */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Fecha del Registro</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Peso */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                <span>Peso Corporal (kg)</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                Ideal: {store.dogProfile.ideal_weight} kg · Último: {store.latestWeight ? `${store.latestWeight} kg` : '—'}
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              inputMode="numeric"
              placeholder="Ej: 11.8"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm tabular-nums text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Opcional si no se ha pesado hoy. Los pesajes semanales bastan para registrar la tendencia.
            </p>
          </div>

          {/* Alergia (Sí / No) */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>¿Presenta picor o reacción alérgica activa?</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHasAllergy(false)}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  !hasAllergy
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${!hasAllergy ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>No (Sin alergia)</span>
              </button>

              <button
                type="button"
                onClick={() => setHasAllergy(true)}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  hasAllergy
                    ? 'bg-red-50 dark:bg-red-950/50 border-red-500 text-red-800 dark:text-red-300 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <AlertCircle className={`w-4 h-4 ${hasAllergy ? 'text-red-600' : 'text-slate-400'}`} />
                <span>Sí (Reacción activa)</span>
              </button>
            </div>
          </div>

          {/* Medicación */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
              <Pill className="w-3.5 h-3.5 text-slate-400" />
              <span>Medicación Administrada</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {COMMON_MEDICATIONS.map((med) => (
                <button
                  key={med}
                  type="button"
                  onClick={() => setMedication(med)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    medication === med
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {med}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setMedication('Otro')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  medication === 'Otro'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Otro fármaco...
              </button>
            </div>

            {medication === 'Otro' && (
              <input
                type="text"
                placeholder="Nombre del medicamento o tratamiento administrado"
                value={customMed}
                onChange={(e) => setCustomMed(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
            )}
          </div>

          {/* Botón Guardar */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Guardar Registro Diario</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
