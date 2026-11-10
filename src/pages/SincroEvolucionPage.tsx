import React, { useState } from 'react';
import { useAquilesStore } from '../lib/store';
import { exportEvolutionCSV } from '../lib/exportCsv';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  TrendingUp,
  ArrowLeft,
  Download,
  Plus,
  Trash2,
  Calendar,
  Scale,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const FOOD_KEYS = [
  { key: 'merluza', label: 'Merluza', defaultUnit: 'g' },
  { key: 'calabaza', label: 'Calabaza', defaultUnit: 'g' },
  { key: 'zanahoria', label: 'Zanahoria', defaultUnit: 'g' },
  { key: 'calabacín', label: 'Calabacín', defaultUnit: 'g' },
  { key: 'salmón', label: 'Salmón', defaultUnit: 'g' },
  { key: 'pavo', label: 'Pavo', defaultUnit: 'g' },
  { key: 'batata', label: 'Batata', defaultUnit: 'g' },
  { key: 'patata', label: 'Patata', defaultUnit: 'g' },
];

export const SincroEvolucionPage: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
  const store = useAquilesStore();

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [pesoAnterior, setPesoAnterior] = useState<string>(
    store.latestWeight ? String(store.latestWeight) : '11.7'
  );
  const [pesoNuevo, setPesoNuevo] = useState<string>(
    store.latestWeight ? String(store.latestWeight) : '11.7'
  );

  const [foodGrams, setFoodGrams] = useState<Record<string, string>>({
    merluza: '',
    calabaza: '',
    zanahoria: '',
    calabacín: '',
    salmón: '',
    pavo: '',
    batata: '',
    patata: '',
  });

  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFoodChange = (key: string, val: string) => {
    setFoodGrams((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const snapshot: Record<string, number> = {};
    const summaryParts: string[] = [];

    // Ordered food summary
    FOOD_KEYS.forEach(({ key, label }) => {
      const g = parseFloat(foodGrams[key]);
      if (!isNaN(g) && g > 0) {
        snapshot[key] = g;
        summaryParts.push(g >= 1000 ? `${label} ${(g / 1000).toFixed(1)}kg` : `${label} ${g}g`);
      }
    });

    const resumen = summaryParts.length > 0 ? summaryParts.join(' - ') : 'Ajuste de peso sin cambio dietético';

    store.addLogAjuste({
      created_at: `${date}T02:00:00+00:00`,
      peso_anterior: parseFloat(pesoAnterior) || 12.0,
      peso_nuevo: parseFloat(pesoNuevo) || 12.0,
      resumen_cambio: resumen,
      snapshot_dieta: snapshot,
    });

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);

    // Reset foods
    setFoodGrams({
      merluza: '',
      calabaza: '',
      zanahoria: '',
      calabacín: '',
      salmón: '',
      pavo: '',
      batata: '',
      patata: '',
    });
  };

  const handleConfirmDelete = () => {
    if (logToDelete) {
      store.deleteLogAjuste(logToDelete);
      setLogToDelete(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Dashboard Principal</span>
        </button>

        <button
          onClick={() => exportEvolutionCSV(store.logAjustes)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Sincro CSV (UTF-8)</span>
        </button>
      </div>

      {/* Hero Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">
              Sincro-Evolución (Log de Peso y Menú)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Registro histórico y manual de cada ajuste dietético sincronizado con la báscula.
            </p>
          </div>
        </div>

        {isSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">¡Ajuste sincronizado y registrado en el historial correctamente!</span>
          </div>
        )}

        {/* Formulario de Entrada */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Fecha de Ajuste
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Peso Anterior (kg)
              </label>
              <input
                type="number"
                step="0.1"
                inputMode="numeric"
                value={pesoAnterior}
                onChange={(e) => setPesoAnterior(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs tabular-nums"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Peso Nuevo (kg)
              </label>
              <input
                type="number"
                step="0.1"
                inputMode="numeric"
                value={pesoNuevo}
                onChange={(e) => setPesoNuevo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs tabular-nums"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Alimentos del Ajuste (gramos netos semanales):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {FOOD_KEYS.map(({ key, label }) => (
                <div key={key} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block capitalize">
                    {label}
                  </span>
                  <input
                    type="number"
                    step="1"
                    inputMode="numeric"
                    placeholder="0 g"
                    value={foodGrams[key]}
                    onChange={(e) => handleFoodChange(key, e.target.value)}
                    className="w-full mt-1 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs tabular-nums"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar Registro en Sincro-Evolución</span>
            </button>
          </div>
        </form>
      </div>

      {/* History Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
            Histórico de Sincro-Evolución ({store.logAjustes.length} ajustes)
          </h3>
          <span className="text-xs text-slate-500 font-mono">Orden cronológico inverso</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {store.logAjustes.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {log.created_at.slice(0, 10)}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {log.peso_anterior.toFixed(1)} kg → {log.peso_nuevo.toFixed(1)} kg
                  </span>
                </div>
                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                  {log.resumen_cambio}
                </p>
              </div>

              <button
                onClick={() => setLogToDelete(log.id)}
                className="self-end sm:self-center p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                title="Eliminar este ajuste"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!logToDelete}
        title="Eliminar Registro de Evolución"
        message="¿Confirmas que deseas eliminar esta entrada del histórico de Sincro-Evolución? Esta acción es permanente."
        confirmLabel="Eliminar"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setLogToDelete(null)}
      />
    </div>
  );
};
