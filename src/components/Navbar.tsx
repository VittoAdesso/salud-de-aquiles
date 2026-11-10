import React from 'react';
import { useAquilesStore } from '../lib/store';
import { calculateAge } from '../lib/healthScore';
import { generateVeterinaryPdf } from '../lib/generatePdf';
import { exportFullDatabaseCSV } from '../lib/exportCsv';
import { Sun, Moon, FileText, Download, HeartPulse, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onNavigateTab: (tabId: string) => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateTab, activeTab }) => {
  const store = useAquilesStore();
  const age = calculateAge(store.dogProfile.birth_date);

  const handleExportPdf = () => {
    generateVeterinaryPdf({
      dogProfile: store.dogProfile,
      alertLogs: store.alertLogs,
      healthRecords: store.healthRecords,
      dietItems: store.dietItems,
      wetFood: store.wetFood,
      configBase: store.configBase,
      registrosMediciones: store.registrosMediciones,
      logAjustes: store.logAjustes,
      preparacionItems: store.preparacionItems,
    });
  };

  const handleExportCsv = () => {
    exportFullDatabaseCSV({
      dogProfile: store.dogProfile,
      alertLogs: store.alertLogs,
      jointCycles: store.jointCycles,
      healthRecords: store.healthRecords,
      dietItems: store.dietItems,
      weeklySupplements: store.weeklySupplements,
      wetFood: store.wetFood,
      configBase: store.configBase,
      registrosMediciones: store.registrosMediciones,
      logAjustes: store.logAjustes,
      preparacionItems: store.preparacionItems,
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">
                  Salud de Aquiles
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                  {age.text}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <span>Ideal: <span className="font-bold text-slate-700 dark:text-slate-300">{store.dogProfile.ideal_weight} kg</span></span>
                <span>·</span>
                <span>Actual: <span className="font-bold text-emerald-700 dark:text-emerald-400">{store.latestWeight ? `${store.latestWeight} kg` : '—'}</span></span>
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick PDF export */}
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-xs transition-all min-h-[40px]"
            title="Generar y descargar informe veterinario oficial en PDF (11 secciones con gráficos vectoriales)"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Informe PDF</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors min-h-[40px]"
            title="Descargar copia de seguridad completa en CSV (todas las tablas)"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Copia CSV</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={store.toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label={store.theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          >
            {store.theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
