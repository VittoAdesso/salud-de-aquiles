import React, { useState } from 'react';
import { useAquilesStore } from '../../lib/store';
import { exportMedicionesCSV } from '../../lib/exportCsv';
import { ConfirmationModal } from '../ConfirmationModal';
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
  Plus,
  Settings,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';

export const SeguimientoTab: React.FC = () => {
  const store = useAquilesStore();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editBasePecho, setEditBasePecho] = useState(store.configBase.base_pecho);
  const [editBaseBarriga, setEditBaseBarriga] = useState(store.configBase.base_barriga);

  // New measurement form state
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [pecho, setPecho] = useState<string>('59.0');
  const [barriga, setBarriga] = useState<string>('42.0');
  const [medicionToDelete, setMedicionToDelete] = useState<string | null>(null);

  const status = store.fluidRetentionStatus;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateConfigBase(editBasePecho, editBaseBarriga);
    setIsConfigOpen(false);
  };

  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(pecho);
    const b = parseFloat(barriga);
    if (!fecha || isNaN(p) || isNaN(b)) return;
    store.addMedicion({
      fecha,
      medida_pecho: p,
      medida_barriga: b,
    });
  };

  const handleConfirmDelete = () => {
    if (medicionToDelete) {
      store.deleteMedicion(medicionToDelete);
      setMedicionToDelete(null);
    }
  };

  // Sorted measurements
  const sortedMediciones = [...store.registrosMediciones].sort((a, b) => b.fecha.localeCompare(a.fecha));

  // Chronological for graphs
  const chronoMediciones = [...store.registrosMediciones].sort((a, b) => a.fecha.localeCompare(b.fecha));

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Large Fluid Retention Semaphore Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          status.color === 'green'
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
            : status.color === 'yellow'
            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
            : 'bg-red-50/80 dark:bg-red-950/40 border-red-300 dark:border-red-900/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                status.color === 'green'
                  ? 'bg-emerald-600 text-white'
                  : status.color === 'yellow'
                  ? 'bg-amber-500 text-white'
                  : 'bg-red-600 text-white animate-pulse'
              }`}
            >
              {status.color === 'green' ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : status.color === 'yellow' ? (
                <AlertTriangle className="w-7 h-7" />
              ) : (
                <AlertCircle className="w-7 h-7" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  Control de Retención de Líquidos
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Post-Drenaje Pericárdico
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-0.5">
                {status.statusTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {status.statusMessage}
              </p>
            </div>
          </div>

          {/* Quick Delta Chips */}
          <div className="flex sm:flex-col gap-2 shrink-0 self-start sm:self-auto">
            <div className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 text-xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Δ Pecho vs Base:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-slate-100">
                {status.chestDelta >= 0 ? `+${status.chestDelta}` : status.chestDelta} cm
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 text-xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Δ Barriga vs Base:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-slate-100">
                {status.bellyDelta >= 0 ? `+${status.bellyDelta}` : status.bellyDelta} cm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Static Highlight Card: Intervención Drenaje Pericárdico */}
      <div className="glass-card p-5 border-l-4 border-l-red-500">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Intervención Quirúrgica Destacada
              </span>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100">
                Drenaje Pericárdico Realizado
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Fecha clínica: <span className="font-semibold text-slate-700 dark:text-slate-300">22.04.2026</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Volumen Extraído</span>
            <p className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 mt-0.5">
              Vaciado de 120 ml
            </p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Tipo de Líquido</span>
            <p className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 mt-0.5">
              Serohemorrágico
            </p>
          </div>
          <div className="sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Diagnóstico Citológico</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
              Trasudado bajo en proteínas con leve componente hemático asociado.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Base Measurement Config (Collapsed Accordion by Default) */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => setIsConfigOpen((prev) => !prev)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Configuración Inicial · Medidas Base
              </span>
              <p className="text-[11px] text-slate-500">
                Pecho base: <span className="font-semibold">{store.configBase.base_pecho} cm</span> · Barriga base: <span className="font-semibold">{store.configBase.base_barriga} cm</span>
              </p>
            </div>
          </div>
          {isConfigOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isConfigOpen && (
          <form onSubmit={handleSaveConfig} className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Estas medidas se toman como punto de referencia cero para evaluar la retención de líquidos en los gráficos.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Medida Base Pecho (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  inputMode="numeric"
                  value={editBasePecho}
                  onChange={(e) => setEditBasePecho(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Medida Base Barriga (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  inputMode="numeric"
                  value={editBaseBarriga}
                  onChange={(e) => setEditBaseBarriga(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfigOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 dark:text-slate-400"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Guardar Base
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 4. Formulario de Nueva Medición */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 mb-1">
          Nueva Medición de Perímetros
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Registra el perímetro de pecho y barriga en centímetros usando una cinta métrica flexible.
        </p>

        <form onSubmit={handleAddMeasurement} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Pecho (cm)
            </label>
            <input
              type="number"
              step="0.1"
              inputMode="numeric"
              placeholder="Ej: 59.0"
              value={pecho}
              onChange={(e) => setPecho(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs tabular-nums"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Barriga / Cintura (cm)
            </label>
            <input
              type="number"
              step="0.1"
              inputMode="numeric"
              placeholder="Ej: 42.0"
              value={barriga}
              onChange={(e) => setBarriga(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs tabular-nums"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-xs transition-all min-h-[38px]"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar Medición</span>
            </button>
          </div>
        </form>
      </div>

      {/* 5. Dos Gráficos de Área: Pecho y Barriga con Línea Base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Gráfico Pecho */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold font-display text-emerald-800 dark:text-emerald-300">
                Evolución Perímetro de Pecho
              </h4>
              <p className="text-[11px] text-slate-500">
                Línea base: <span className="font-semibold">{store.configBase.base_pecho} cm</span>
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              Último: {store.latestMedicion?.medida_pecho || store.configBase.base_pecho} cm
            </span>
          </div>

          <div className="w-full h-44 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
              <defs>
                <linearGradient id="pechoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {(() => {
                const minY = 55;
                const maxY = 66;
                const base = store.configBase.base_pecho;
                const getY = (val: number) => 140 - ((val - minY) / (maxY - minY)) * 120;

                const baseLineY = getY(base);

                const points = chronoMediciones.map((m, i) => ({
                  x: 20 + (i / (chronoMediciones.length - 1)) * 360,
                  y: getY(m.medida_pecho),
                  val: m.medida_pecho,
                }));

                const pathD = points.reduce(
                  (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                  ''
                );
                const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z` : '';

                return (
                  <>
                    {/* Base reference line */}
                    <line x1="20" y1={baseLineY} x2="380" y2={baseLineY} stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="1" />
                    <text x="382" y={baseLineY + 3} fill="#64748b" fontSize="7" textAnchor="start">
                      Base {base}cm
                    </text>

                    {areaD && <path d={areaD} fill="url(#pechoGrad)" />}
                    {pathD && <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2" />}

                    {points.map((p, idx) => (
                      <circle key={idx} cx={p.x} cy={p.y} r="2" fill="#10b981" />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Gráfico Barriga */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold font-display text-amber-800 dark:text-amber-300">
                Evolución Perímetro de Barriga / Cintura
              </h4>
              <p className="text-[11px] text-slate-500">
                Línea base: <span className="font-semibold">{store.configBase.base_barriga} cm</span>
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
              Último: {store.latestMedicion?.medida_barriga || store.configBase.base_barriga} cm
            </span>
          </div>

          <div className="w-full h-44 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
              <defs>
                <linearGradient id="barrigaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {(() => {
                const minY = 38;
                const maxY = 50;
                const base = store.configBase.base_barriga;
                const getY = (val: number) => 140 - ((val - minY) / (maxY - minY)) * 120;

                const baseLineY = getY(base);

                const points = chronoMediciones.map((m, i) => ({
                  x: 20 + (i / (chronoMediciones.length - 1)) * 360,
                  y: getY(m.medida_barriga),
                  val: m.medida_barriga,
                }));

                const pathD = points.reduce(
                  (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                  ''
                );
                const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z` : '';

                return (
                  <>
                    {/* Base reference line */}
                    <line x1="20" y1={baseLineY} x2="380" y2={baseLineY} stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="1" />
                    <text x="382" y={baseLineY + 3} fill="#64748b" fontSize="7" textAnchor="start">
                      Base {base}cm
                    </text>

                    {areaD && <path d={areaD} fill="url(#barrigaGrad)" />}
                    {pathD && <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2" />}

                    {points.map((p, idx) => (
                      <circle key={idx} cx={p.x} cy={p.y} r="2" fill="#f59e0b" />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>

      {/* 6. Historial de Mediciones en Acordeón con Exportación CSV */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHistoryOpen((prev) => !prev)}
              className="flex items-center gap-2 text-sm font-bold font-display text-slate-900 dark:text-slate-100 hover:text-emerald-600"
            >
              <span>Historial de Mediciones ({store.registrosMediciones.length} registros)</span>
              {isHistoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={() => exportMedicionesCSV(store.registrosMediciones, store.configBase.base_pecho, store.configBase.base_barriga)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar CSV</span>
          </button>
        </div>

        {isHistoryOpen && (
          <div className="max-h-96 overflow-y-auto p-4 pt-0">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-100 dark:border-slate-800">
                <tr className="text-left font-semibold text-slate-500 pb-2">
                  <th className="py-2.5">Fecha</th>
                  <th className="py-2.5">Pecho</th>
                  <th className="py-2.5">Barriga</th>
                  <th className="py-2.5">Delta Máx</th>
                  <th className="py-2.5">Estado</th>
                  <th className="py-2.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {sortedMediciones.map((m) => {
                  const dPecho = m.medida_pecho - store.configBase.base_pecho;
                  const dBarriga = m.medida_barriga - store.configBase.base_barriga;
                  const maxDelta = Math.max(dPecho, dBarriga);
                  const estado = maxDelta <= 1.0 ? 'Estable' : maxDelta <= 2.5 ? 'Precaución' : 'Crítico';

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 font-mono text-slate-700 dark:text-slate-300">
                        {m.fecha}
                      </td>
                      <td className="py-2.5 tabular-nums text-slate-900 dark:text-slate-100 font-medium">
                        {m.medida_pecho.toFixed(1)} cm
                      </td>
                      <td className="py-2.5 tabular-nums text-slate-900 dark:text-slate-100 font-medium">
                        {m.medida_barriga.toFixed(1)} cm
                      </td>
                      <td className="py-2.5 tabular-nums font-mono">
                        {maxDelta >= 0 ? `+${maxDelta.toFixed(1)}` : maxDelta.toFixed(1)} cm
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            estado === 'Estable'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : estado === 'Precaución'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          }`}
                        >
                          {estado}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => setMedicionToDelete(m.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Eliminar medición"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!medicionToDelete}
        title="Eliminar Registro de Medición"
        message="¿Confirmas que deseas eliminar esta medición de perímetro? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setMedicionToDelete(null)}
      />
    </div>
  );
};
