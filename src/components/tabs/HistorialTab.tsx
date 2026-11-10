import React, { useState, useMemo } from 'react';
import { useAquilesStore } from '../../lib/store';
import { HealthRecord } from '../../lib/types';
import { ConfirmationModal } from '../ConfirmationModal';
import { formatDate } from '../../lib/alerts';
import {
  History,
  Search,
  Filter,
  Trash2,
  Edit2,
  Check,
  X,
  Download,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const HistorialTab: React.FC = () => {
  const store = useAquilesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [allergyFilter, setAllergyFilter] = useState<'all' | 'allergy' | 'no-allergy'>('all');
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editWeight, setEditWeight] = useState<string>('');
  const [editHasAllergy, setEditHasAllergy] = useState<boolean>(false);
  const [editMedication, setEditMedication] = useState<string>('');

  const filteredRecords = useMemo(() => {
    return store.healthRecords
      .filter((rec) => {
        if (allergyFilter === 'allergy' && !rec.has_allergy) return false;
        if (allergyFilter === 'no-allergy' && rec.has_allergy) return false;
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const matchDate = rec.record_date.includes(q);
          const matchMed = (rec.medication || '').toLowerCase().includes(q);
          const matchWeight = rec.weight ? String(rec.weight).includes(q) : false;
          if (!matchDate && !matchMed && !matchWeight) return false;
        }
        return true;
      })
      .sort((a, b) => b.record_date.localeCompare(a.record_date));
  }, [store.healthRecords, allergyFilter, searchTerm]);

  const handleStartEdit = (rec: HealthRecord) => {
    setEditingId(rec.id);
    setEditWeight(rec.weight !== undefined ? String(rec.weight) : '');
    setEditHasAllergy(rec.has_allergy);
    setEditMedication(rec.medication || 'Ninguno');
  };

  const handleSaveEdit = (id: string) => {
    const parsedWeight = editWeight ? parseFloat(editWeight) : undefined;
    store.updateHealthRecord(id, {
      weight: parsedWeight,
      has_allergy: editHasAllergy,
      medication: editMedication,
    });
    setEditingId(null);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      store.deleteHealthRecord(recordToDelete);
      setRecordToDelete(null);
    }
  };

  const handleExportCsv = () => {
    const today = formatDate(new Date());
    let csv = `Fecha,Peso (kg),Alergia,Medicación,Tipo\n`;
    store.healthRecords.forEach((h) => {
      csv += `${h.record_date},${h.weight ?? ''},${h.has_allergy ? 'Sí' : 'No'},"${h.medication || 'Ninguno'}",${h.is_mock ? 'Mock' : 'Real'}\n`;
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historial_pesajes_aquiles_${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Controls */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                Historial de Pesajes y Salud ({store.healthRecords.length} registros)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Auditoría completa desde el 09/08/2021 hasta el presente. Edición y borrado protegido.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors self-start sm:self-center"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Descargar CSV</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por fecha, peso o fármaco..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setAllergyFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                allergyFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Todos ({store.healthRecords.length})
            </button>
            <button
              onClick={() => setAllergyFilter('no-allergy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                allergyFilter === 'no-allergy'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Sin Alergia
            </button>
            <button
              onClick={() => setAllergyFilter('allergy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                allergyFilter === 'allergy'
                  ? 'bg-white dark:bg-slate-900 text-red-700 dark:text-red-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Con Alergia
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-left font-semibold text-slate-600 dark:text-slate-300">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Peso</th>
                <th className="py-3 px-4">Alergia</th>
                <th className="py-3 px-4">Medicación</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredRecords.map((rec) => {
                const isEditing = editingId === rec.id;

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                      {rec.record_date}
                    </td>

                    <td className="py-3 px-4 tabular-nums">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          inputMode="numeric"
                          value={editWeight}
                          onChange={(e) => setEditWeight(e.target.value)}
                          className="w-20 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                          placeholder="kg"
                        />
                      ) : rec.weight !== undefined ? (
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {rec.weight.toFixed(1)} kg
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => setEditHasAllergy(!editHasAllergy)}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            editHasAllergy
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {editHasAllergy ? 'Sí (Alergia)' : 'No'}
                        </button>
                      ) : rec.has_allergy ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Sí</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>No</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editMedication}
                          onChange={(e) => setEditMedication(e.target.value)}
                          className="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                      ) : (
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {rec.medication || 'Ninguno'}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(rec.id)}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50"
                              title="Guardar cambios"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                              title="Cancelar edición"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(rec)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Editar registro"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setRecordToDelete(rec.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={!!recordToDelete}
        title="Eliminar Registro de Historial"
        message="¿Confirmas que deseas eliminar este registro de peso y salud? Esta acción no se puede deshacer."
        confirmLabel="Eliminar Registro"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setRecordToDelete(null)}
      />
    </div>
  );
};
