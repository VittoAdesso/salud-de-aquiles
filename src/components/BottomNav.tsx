import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  ChefHat,
  Activity,
  PlusCircle,
  History,
  MoreHorizontal,
  CalendarDays,
  ShoppingCart,
  Apple,
  Flame,
  GitBranch,
  Settings2,
  TrendingUp,
  X,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onNavigateToSincro: () => void;
  isSincroRoute: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onNavigateToSincro,
  isSincroRoute,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close more menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreOpen]);

  const mainTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'preparacion', label: 'Preparación', icon: ChefHat },
    { id: 'seguimiento', label: 'Seguimiento', icon: Activity },
    { id: 'registro', label: 'Registro', icon: PlusCircle },
    { id: 'historial', label: 'Historial', icon: History },
  ];

  const procesoTabs = [
    { id: 'plan', label: 'Plan Suplementos', icon: CalendarDays },
    { id: 'compra', label: 'Compra Semanal', icon: ShoppingCart },
    { id: 'nutricion', label: 'Nutrición', icon: Apple },
    { id: 'coccion', label: 'Guía Cocción', icon: Flame },
    { id: 'transicion', label: 'Transición', icon: GitBranch },
    { id: 'general', label: 'General / Potes', icon: Settings2 },
  ];

  const isProcesoActive = procesoTabs.some((t) => t.id === activeTab);

  return (
    <>
      {/* Popover Menu for 'Más' / 'Proceso' */}
      <AnimatePresence>
        {isMoreOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            ref={moreRef}
            className="fixed bottom-20 right-4 sm:right-10 z-50 w-72 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Módulos de Proceso
              </span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {procesoTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setIsMoreOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  onNavigateToSincro();
                  setIsMoreOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isSincroRoute
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold">Sincro-Evolución</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200">
                  Ruta
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Bottom Navigation Bar */}
      <nav
        aria-label="Navegación principal"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 pb-safe"
      >
        <div className="max-w-3xl mx-auto px-2 sm:px-4 h-16 flex items-center justify-around">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = !isSincroRoute && activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  onSelectTab(tab.id);
                  setIsMoreOpen(false);
                }}
                className={`relative flex flex-col items-center justify-center min-w-[52px] sm:min-w-[72px] h-14 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                aria-label={tab.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[11px] mt-0.5 hidden sm:inline tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* Más button */}
          <button
            onClick={() => setIsMoreOpen((prev) => !prev)}
            className={`relative flex flex-col items-center justify-center min-w-[52px] sm:min-w-[72px] h-14 rounded-xl transition-all ${
              isMoreOpen || isProcesoActive || isSincroRoute
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            aria-label="Más opciones de proceso"
            aria-expanded={isMoreOpen}
          >
            {(isProcesoActive || isSincroRoute) && (
              <span className="absolute top-2 right-3 w-2 h-2 rounded-full bg-emerald-500" />
            )}
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[11px] mt-0.5 hidden sm:inline tracking-tight">
              Más
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
