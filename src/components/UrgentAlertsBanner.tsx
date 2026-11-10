import React, { useState } from 'react';
import { useAquilesStore } from '../lib/store';
import { AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import { AlertType } from '../lib/types';

export const UrgentAlertsBanner: React.FC = () => {
  const store = useAquilesStore();
  const [selectedAlertForAction, setSelectedAlertForAction] = useState<AlertType | null>(null);

  if (store.urgentAlerts.length === 0) return null;

  const handleConfirmComplete = () => {
    if (selectedAlertForAction) {
      store.completeAlert(selectedAlertForAction);
      setSelectedAlertForAction(null);
    }
  };

  return (
    <>
      <div className="w-full bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-red-900 dark:text-red-200 font-display">
                {store.urgentAlerts.length === 1 ? '1 alerta sanitaria urgente' : `${store.urgentAlerts.length} alertas sanitarias urgentes`}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-0.5 text-xs text-red-700 dark:text-red-300">
                {store.urgentAlerts.map((alert) => (
                  <span key={alert.key} className="inline-flex items-center gap-1.5 font-medium">
                    <span>{alert.title}</span>
                    <span className="text-[11px] font-mono opacity-80">({alert.statusLabel})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {store.urgentAlerts.slice(0, 2).map((alert) => (
              <button
                key={alert.key}
                onClick={() => setSelectedAlertForAction(alert.key)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Marcar {alert.key.split('_')[0]} hecha</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!selectedAlertForAction}
        title="Confirmar Alerta Completada"
        message={`¿Confirmas que se ha administrado o realizado ${selectedAlertForAction?.replace(/_/g, ' ')} hoy? Se registrará la fecha y se programará la próxima cita automáticamente según el ciclo correspondiente.`}
        confirmLabel="Marcar Realizada"
        isDestructive={false}
        onConfirm={handleConfirmComplete}
        onCancel={() => setSelectedAlertForAction(null)}
      />
    </>
  );
};
