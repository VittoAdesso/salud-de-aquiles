import React, { useState, useEffect, lazy, Suspense } from 'react';
import { StoreProvider } from './lib/store';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { UrgentAlertsBanner } from './components/UrgentAlertsBanner';

// Lazy-loaded Modular Tabs for code-splitting and faster initial render
const DashboardTab = lazy(() =>
  import('./components/tabs/DashboardTab').then((m) => ({ default: m.DashboardTab }))
);
const PreparacionTab = lazy(() =>
  import('./components/tabs/PreparacionTab').then((m) => ({ default: m.PreparacionTab }))
);
const SeguimientoTab = lazy(() =>
  import('./components/tabs/SeguimientoTab').then((m) => ({ default: m.SeguimientoTab }))
);
const RegistroTab = lazy(() =>
  import('./components/tabs/RegistroTab').then((m) => ({ default: m.RegistroTab }))
);
const HistorialTab = lazy(() =>
  import('./components/tabs/HistorialTab').then((m) => ({ default: m.HistorialTab }))
);
const NutricionTab = lazy(() =>
  import('./components/tabs/NutricionTab').then((m) => ({ default: m.NutricionTab }))
);
const CompraTab = lazy(() =>
  import('./components/tabs/CompraTab').then((m) => ({ default: m.CompraTab }))
);
const CoccionTab = lazy(() =>
  import('./components/tabs/CoccionTab').then((m) => ({ default: m.CoccionTab }))
);
const TransicionTab = lazy(() =>
  import('./components/tabs/TransicionTab').then((m) => ({ default: m.TransicionTab }))
);
const PlanTab = lazy(() =>
  import('./components/tabs/PlanTab').then((m) => ({ default: m.PlanTab }))
);
const GeneralTab = lazy(() =>
  import('./components/tabs/GeneralTab').then((m) => ({ default: m.GeneralTab }))
);

// Standalone route page (lazy loaded)
const SincroEvolucionPage = lazy(() =>
  import('./pages/SincroEvolucionPage').then((m) => ({ default: m.SincroEvolucionPage }))
);

function TabFallback() {
  return (
    <div className="space-y-4 animate-pulse pb-24" aria-label="Cargando módulo...">
      <div className="h-32 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="h-24 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />
        <div className="h-24 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />
        <div className="h-24 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />
        <div className="h-24 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />
      </div>
      <div className="h-64 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50" />
    </div>
  );
}

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<'main' | 'sincro-evolucion'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/sincro-evolucion') {
      return 'sincro-evolucion';
    }
    return 'main';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Listen to browser navigation popstate
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/sincro-evolucion') {
        setCurrentRoute('sincro-evolucion');
      } else {
        setCurrentRoute('main');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToSincro = () => {
    setCurrentRoute('sincro-evolucion');
    if (typeof window !== 'undefined' && window.history.pushState) {
      window.history.pushState({}, '', '/sincro-evolucion');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToMainTab = (tabId: string) => {
    setCurrentRoute('main');
    setActiveTab(tabId);
    if (typeof window !== 'undefined' && window.history.pushState) {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar onNavigateTab={navigateToMainTab} activeTab={activeTab} />
      <UrgentAlertsBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        <Suspense fallback={<TabFallback />}>
          {currentRoute === 'sincro-evolucion' ? (
            <SincroEvolucionPage onBackToDashboard={() => navigateToMainTab('dashboard')} />
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardTab onNavigateTab={navigateToMainTab} />}
              {activeTab === 'preparacion' && <PreparacionTab />}
              {activeTab === 'seguimiento' && <SeguimientoTab />}
              {activeTab === 'registro' && <RegistroTab onNavigateToHistorial={() => navigateToMainTab('historial')} />}
              {activeTab === 'historial' && <HistorialTab />}
              {activeTab === 'nutricion' && <NutricionTab />}
              {activeTab === 'compra' && <CompraTab />}
              {activeTab === 'coccion' && <CoccionTab />}
              {activeTab === 'transicion' && <TransicionTab />}
              {activeTab === 'plan' && <PlanTab />}
              {activeTab === 'general' && <GeneralTab />}
            </>
          )}
        </Suspense>
      </main>

      <BottomNav
        activeTab={activeTab}
        onSelectTab={navigateToMainTab}
        onNavigateToSincro={navigateToSincro}
        isSincroRoute={currentRoute === 'sincro-evolucion'}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
