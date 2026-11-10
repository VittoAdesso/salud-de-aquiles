import React, { useState, useEffect } from 'react';
import { StoreProvider } from './lib/store';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { UrgentAlertsBanner } from './components/UrgentAlertsBanner';

// Tabs
import { DashboardTab } from './components/tabs/DashboardTab';
import { PreparacionTab } from './components/tabs/PreparacionTab';
import { SeguimientoTab } from './components/tabs/SeguimientoTab';
import { RegistroTab } from './components/tabs/RegistroTab';
import { HistorialTab } from './components/tabs/HistorialTab';
import { NutricionTab } from './components/tabs/NutricionTab';
import { CompraTab } from './components/tabs/CompraTab';
import { CoccionTab } from './components/tabs/CoccionTab';
import { TransicionTab } from './components/tabs/TransicionTab';
import { PlanTab } from './components/tabs/PlanTab';
import { GeneralTab } from './components/tabs/GeneralTab';

// Standalone route page
import { SincroEvolucionPage } from './pages/SincroEvolucionPage';

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
