import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  DogProfile,
  AlertLog,
  JointCycle,
  HealthRecord,
  DietItem,
  WeeklySupplement,
  WetFood,
  ConfigBase,
  RegistroMedicion,
  LogAjuste,
  PreparacionItem,
  AlertType,
  AlertStatus,
} from './types';
import {
  INITIAL_DOG_PROFILE,
  INITIAL_ALERT_LOGS,
  INITIAL_JOINT_CYCLES,
  INITIAL_HEALTH_RECORDS,
  INITIAL_DIET_ITEMS,
  INITIAL_WEEKLY_SUPPLEMENTS,
  INITIAL_WET_FOOD,
  INITIAL_CONFIG_BASE,
  INITIAL_REGISTROS_MEDICIONES,
  INITIAL_LOG_AJUSTES,
  INITIAL_PREPARACION_ITEMS,
} from './initialData';
import { calcNextHeartDate, computeAlertStatuses, formatDate, getDefaultNextDate, calcNextDateAfterCompletion } from './alerts';
import { calculatePurchaseTotal, DEFAULT_PREPARACION_ITEMS } from './diet';
import { calculateHealthScore, getFluidRetentionSemaphore, getWeightSemaphore } from './healthScore';

interface StoreState {
  dogProfile: DogProfile;
  alertLogs: AlertLog[];
  jointCycles: JointCycle[];
  healthRecords: HealthRecord[];
  dietItems: DietItem[];
  weeklySupplements: WeeklySupplement[];
  wetFood: WetFood[];
  configBase: ConfigBase;
  registrosMediciones: RegistroMedicion[];
  logAjustes: LogAjuste[];
  preparacionItems: PreparacionItem[];
  theme: 'light' | 'dark';
}

interface StoreContextType extends StoreState {
  // Theme
  toggleTheme: () => void;

  // Profile
  updateDogProfile: (updates: Partial<DogProfile>) => void;

  // Health Records
  addHealthRecord: (record: Omit<HealthRecord, 'id' | 'created_at'>) => void;
  updateHealthRecord: (id: string, record: Partial<HealthRecord>) => void;
  deleteHealthRecord: (id: string) => void;

  // Alerts
  completeAlert: (alertType: AlertType, customNextDate?: string) => void;
  deleteAlertLog: (id: string) => void;

  // Joint Cycles
  startJointCycle: (month: number) => void;
  toggleJointCycleActive: (id: string, active: boolean) => void;

  // Fluid Measurements
  addMedicion: (medicion: Omit<RegistroMedicion, 'id' | 'created_at'>) => void;
  deleteMedicion: (id: string) => void;
  updateConfigBase: (basePecho: number, baseBarriga: number) => void;

  // Preparacion
  updatePreparacionItem: (index: number, updates: Partial<PreparacionItem>) => void;
  addPreparacionItem: (item: PreparacionItem) => void;
  removePreparacionItem: (index: number) => void;
  resetPreparacionToDefaults: () => void;

  // Diet Items (General)
  addDietItem: (item: Omit<DietItem, 'id' | 'created_at'>) => void;
  updateDietItem: (id: string, updates: Partial<DietItem>) => void;
  deleteDietItem: (id: string, deleteInBothSeasons?: boolean) => void;

  // Supplements
  updateWeeklySupplement: (id: string, updates: Partial<WeeklySupplement>) => void;

  // Sincro-Evolución
  addLogAjuste: (log: Omit<LogAjuste, 'id' | 'created_at'> & { created_at?: string }) => void;
  deleteLogAjuste: (id: string) => void;

  // Computed properties
  latestWeight?: number;
  latestHealthRecord?: HealthRecord;
  latestMedicion?: RegistroMedicion;
  alertStatuses: AlertStatus[];
  urgentAlerts: AlertStatus[];
  weightSemaphore: ReturnType<typeof getWeightSemaphore>;
  fluidRetentionStatus: ReturnType<typeof getFluidRetentionSemaphore>;
  healthScore: ReturnType<typeof calculateHealthScore>;
  activeJointCycle?: JointCycle;

  // Data reset & export
  resetAllData: () => void;
}

const STORAGE_KEY = 'salud_aquiles:state_v1';
const PREPARACION_KEY = 'preparacion:v1';
const THEME_KEY = 'salud_aquiles:theme';

function loadInitialState(): StoreState {
  let theme: 'light' | 'dark' = 'light';
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      theme = savedTheme;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }
  }

  // Load preparacion:v1 with merge of defaults
  let prepItems = [...INITIAL_PREPARACION_ITEMS];
  if (typeof window !== 'undefined') {
    try {
      const storedPrep = localStorage.getItem(PREPARACION_KEY);
      if (storedPrep) {
        const parsed: PreparacionItem[] = JSON.parse(storedPrep);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge defaults with stored items
          const itemMap = new Map<string, PreparacionItem>();
          DEFAULT_PREPARACION_ITEMS.forEach((it) => itemMap.set(it.ingrediente.toLowerCase(), it));
          parsed.forEach((it) => itemMap.set(it.ingrediente.toLowerCase(), it));
          prepItems = Array.from(itemMap.values());
        }
      }
    } catch (e) {
      console.error('Failed to parse preparacion:v1', e);
    }
  }

  // Load main storage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          dogProfile: parsed.dogProfile || INITIAL_DOG_PROFILE,
          alertLogs: parsed.alertLogs || INITIAL_ALERT_LOGS,
          jointCycles: parsed.jointCycles || INITIAL_JOINT_CYCLES,
          healthRecords: parsed.healthRecords || INITIAL_HEALTH_RECORDS,
          dietItems: parsed.dietItems || INITIAL_DIET_ITEMS,
          weeklySupplements: parsed.weeklySupplements || INITIAL_WEEKLY_SUPPLEMENTS,
          wetFood: parsed.wetFood || INITIAL_WET_FOOD,
          configBase: parsed.configBase || INITIAL_CONFIG_BASE,
          registrosMediciones: parsed.registrosMediciones || INITIAL_REGISTROS_MEDICIONES,
          logAjustes: parsed.logAjustes || INITIAL_LOG_AJUSTES,
          preparacionItems: prepItems,
          theme,
        };
      }
    } catch (e) {
      console.error('Failed to load stored state', e);
    }
  }

  return {
    dogProfile: INITIAL_DOG_PROFILE,
    alertLogs: INITIAL_ALERT_LOGS,
    jointCycles: INITIAL_JOINT_CYCLES,
    healthRecords: INITIAL_HEALTH_RECORDS,
    dietItems: INITIAL_DIET_ITEMS,
    weeklySupplements: INITIAL_WEEKLY_SUPPLEMENTS,
    wetFood: INITIAL_WET_FOOD,
    configBase: INITIAL_CONFIG_BASE,
    registrosMediciones: INITIAL_REGISTROS_MEDICIONES,
    logAjustes: INITIAL_LOG_AJUSTES,
    preparacionItems: prepItems,
    theme,
  };
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoreState>(loadInitialState);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.setItem(PREPARACION_KEY, JSON.stringify(state.preparacionItems));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  // Sync theme class to <html>
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (state.theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem(THEME_KEY, state.theme);
    }
  }, [state.theme]);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  }, []);

  const updateDogProfile = useCallback((updates: Partial<DogProfile>) => {
    setState((prev) => ({
      ...prev,
      dogProfile: { ...prev.dogProfile, ...updates, updated_at: new Date().toISOString() },
    }));
  }, []);

  const addHealthRecord = useCallback((record: Omit<HealthRecord, 'id' | 'created_at'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: crypto.randomUUID ? crypto.randomUUID() : `hr-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      healthRecords: [newRecord, ...prev.healthRecords].sort(
        (a, b) => b.record_date.localeCompare(a.record_date)
      ),
    }));
  }, []);

  const updateHealthRecord = useCallback((id: string, record: Partial<HealthRecord>) => {
    setState((prev) => ({
      ...prev,
      healthRecords: prev.healthRecords.map((r) => (r.id === id ? { ...r, ...record } : r)),
    }));
  }, []);

  const deleteHealthRecord = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      healthRecords: prev.healthRecords.filter((r) => r.id !== id),
    }));
  }, []);

  const completeAlert = useCallback((alertType: AlertType, customNextDate?: string) => {
    const today = formatDate(new Date());
    const year = new Date().getFullYear();

    setState((prev) => {
      // For control_corazon: delete or clear prior records of this type, advance anchor cycle
      let filteredLogs = prev.alertLogs;
      let nextDate = customNextDate;

      if (alertType === 'control_corazon') {
        // delete previous records of same type
        filteredLogs = prev.alertLogs.filter((l) => l.alert_type !== 'control_corazon');
        const prevScheduled = prev.alertLogs.find((l) => l.alert_type === 'control_corazon')?.next_date;
        nextDate = customNextDate || calcNextHeartDate(prevScheduled || today);
      } else if (!nextDate) {
        const prevScheduled = prev.alertLogs.find((l) => l.alert_type === alertType)?.next_date;
        nextDate = calcNextDateAfterCompletion(alertType, prevScheduled, today);
      }

      const newLog: AlertLog = {
        id: crypto.randomUUID ? crypto.randomUUID() : `alert-${Date.now()}`,
        alert_type: alertType,
        completed_date: today,
        year,
        next_date: nextDate,
        created_at: new Date().toISOString(),
      };

      return {
        ...prev,
        alertLogs: [newLog, ...filteredLogs],
      };
    });
  }, []);

  const deleteAlertLog = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      alertLogs: prev.alertLogs.filter((l) => l.id !== id),
    }));
  }, []);

  const startJointCycle = useCallback((month: number) => {
    const today = formatDate(new Date());
    setState((prev) => {
      // deactivate other cycles
      const updatedCycles = prev.jointCycles.map((c) => ({ ...c, active: false }));
      const newCycle: JointCycle = {
        id: crypto.randomUUID ? crypto.randomUUID() : `jc-${Date.now()}`,
        start_date: today,
        cycle_month: month,
        active: true,
        created_at: new Date().toISOString(),
      };
      return {
        ...prev,
        jointCycles: [newCycle, ...updatedCycles],
      };
    });
  }, []);

  const toggleJointCycleActive = useCallback((id: string, active: boolean) => {
    setState((prev) => ({
      ...prev,
      jointCycles: prev.jointCycles.map((c) => (c.id === id ? { ...c, active, updated_at: new Date().toISOString() } : c)),
    }));
  }, []);

  const addMedicion = useCallback((medicion: Omit<RegistroMedicion, 'id' | 'created_at'>) => {
    const newMed: RegistroMedicion = {
      ...medicion,
      id: crypto.randomUUID ? crypto.randomUUID() : `med-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      registrosMediciones: [newMed, ...prev.registrosMediciones].sort(
        (a, b) => b.fecha.localeCompare(a.fecha)
      ),
    }));
  }, []);

  const deleteMedicion = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      registrosMediciones: prev.registrosMediciones.filter((m) => m.id !== id),
    }));
  }, []);

  const updateConfigBase = useCallback((basePecho: number, baseBarriga: number) => {
    setState((prev) => ({
      ...prev,
      configBase: {
        ...prev.configBase,
        base_pecho: basePecho,
        base_barriga: baseBarriga,
        updated_at: new Date().toISOString(),
      },
    }));
  }, []);

  const updatePreparacionItem = useCallback((index: number, updates: Partial<PreparacionItem>) => {
    setState((prev) => {
      const items = [...prev.preparacionItems];
      const cur = items[index];
      if (!cur) return prev;
      const updated = { ...cur, ...updates };
      // Recalculate total_compra if neto or merma changed
      if ('neto_semanal' in updates || 'merma_pct' in updates) {
        updated.total_compra = calculatePurchaseTotal(updated.neto_semanal, updated.merma_pct);
      }
      items[index] = updated;
      return { ...prev, preparacionItems: items };
    });
  }, []);

  const addPreparacionItem = useCallback((item: PreparacionItem) => {
    setState((prev) => ({
      ...prev,
      preparacionItems: [...prev.preparacionItems, item],
    }));
  }, []);

  const removePreparacionItem = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      preparacionItems: prev.preparacionItems.filter((_, i) => i !== index),
    }));
  }, []);

  const resetPreparacionToDefaults = useCallback(() => {
    setState((prev) => ({
      ...prev,
      preparacionItems: [...DEFAULT_PREPARACION_ITEMS],
    }));
  }, []);

  const addDietItem = useCallback((item: Omit<DietItem, 'id' | 'created_at'>) => {
    const newItem: DietItem = {
      ...item,
      id: crypto.randomUUID ? crypto.randomUUID() : `diet-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      dietItems: [...prev.dietItems, newItem],
    }));
  }, []);

  const updateDietItem = useCallback((id: string, updates: Partial<DietItem>) => {
    setState((prev) => ({
      ...prev,
      dietItems: prev.dietItems.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  }, []);

  const deleteDietItem = useCallback((id: string, deleteInBothSeasons = false) => {
    setState((prev) => {
      const target = prev.dietItems.find((d) => d.id === id);
      if (!target) return prev;
      if (deleteInBothSeasons) {
        return {
          ...prev,
          dietItems: prev.dietItems.filter(
            (d) => d.item_name.toLowerCase() !== target.item_name.toLowerCase()
          ),
        };
      }
      return {
        ...prev,
        dietItems: prev.dietItems.filter((d) => d.id !== id),
      };
    });
  }, []);

  const updateWeeklySupplement = useCallback((id: string, updates: Partial<WeeklySupplement>) => {
    setState((prev) => ({
      ...prev,
      weeklySupplements: prev.weeklySupplements.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const addLogAjuste = useCallback((log: Omit<LogAjuste, 'id' | 'created_at'> & { created_at?: string }) => {
    const newLog: LogAjuste = {
      ...log,
      id: crypto.randomUUID ? crypto.randomUUID() : `log-${Date.now()}`,
      created_at: log.created_at || new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      logAjustes: [newLog, ...prev.logAjustes].sort(
        (a, b) => b.created_at.localeCompare(a.created_at)
      ),
    }));
  }, []);

  const deleteLogAjuste = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      logAjustes: prev.logAjustes.filter((l) => l.id !== id),
    }));
  }, []);

  const resetAllData = useCallback(() => {
    setState({
      dogProfile: INITIAL_DOG_PROFILE,
      alertLogs: INITIAL_ALERT_LOGS,
      jointCycles: INITIAL_JOINT_CYCLES,
      healthRecords: INITIAL_HEALTH_RECORDS,
      dietItems: INITIAL_DIET_ITEMS,
      weeklySupplements: INITIAL_WEEKLY_SUPPLEMENTS,
      wetFood: INITIAL_WET_FOOD,
      configBase: INITIAL_CONFIG_BASE,
      registrosMediciones: INITIAL_REGISTROS_MEDICIONES,
      logAjustes: INITIAL_LOG_AJUSTES,
      preparacionItems: [...DEFAULT_PREPARACION_ITEMS],
      theme: 'light',
    });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PREPARACION_KEY);
  }, []);

  // Computed data
  const latestHealthRecord = useMemo(() => {
    const withWeight = state.healthRecords
      .filter((r) => typeof r.weight === 'number' && !isNaN(r.weight))
      .sort((a, b) => b.record_date.localeCompare(a.record_date));
    return withWeight[0] || state.healthRecords[0];
  }, [state.healthRecords]);

  const latestWeight = latestHealthRecord?.weight;

  const latestMedicion = useMemo(() => {
    const sorted = [...state.registrosMediciones].sort((a, b) => b.fecha.localeCompare(a.fecha));
    return sorted[0];
  }, [state.registrosMediciones]);

  const activeJointCycle = useMemo(() => {
    return state.jointCycles.find((c) => c.active);
  }, [state.jointCycles]);

  const alertStatuses = useMemo(() => {
    return computeAlertStatuses(state.alertLogs, activeJointCycle);
  }, [state.alertLogs, activeJointCycle]);

  const urgentAlerts = useMemo(() => {
    return alertStatuses.filter((a) => a.color === 'red' || a.isOverdue);
  }, [alertStatuses]);

  const weightSemaphore = useMemo(() => {
    return getWeightSemaphore(latestWeight || 12.0, state.dogProfile.ideal_weight || 12.0);
  }, [latestWeight, state.dogProfile.ideal_weight]);

  const fluidRetentionStatus = useMemo(() => {
    if (!latestMedicion) {
      return getFluidRetentionSemaphore(
        state.configBase.base_pecho,
        state.configBase.base_barriga,
        state.configBase.base_pecho,
        state.configBase.base_barriga
      );
    }
    return getFluidRetentionSemaphore(
      latestMedicion.medida_pecho,
      latestMedicion.medida_barriga,
      state.configBase.base_pecho,
      state.configBase.base_barriga
    );
  }, [latestMedicion, state.configBase]);

  const healthScore = useMemo(() => {
    return calculateHealthScore(
      latestWeight || 12.0,
      state.dogProfile.ideal_weight || 12.0,
      urgentAlerts.length,
      fluidRetentionStatus.maxDelta
    );
  }, [latestWeight, state.dogProfile.ideal_weight, urgentAlerts.length, fluidRetentionStatus.maxDelta]);

  const value = useMemo(
    () => ({
      ...state,
      toggleTheme,
      updateDogProfile,
      addHealthRecord,
      updateHealthRecord,
      deleteHealthRecord,
      completeAlert,
      deleteAlertLog,
      startJointCycle,
      toggleJointCycleActive,
      addMedicion,
      deleteMedicion,
      updateConfigBase,
      updatePreparacionItem,
      addPreparacionItem,
      removePreparacionItem,
      resetPreparacionToDefaults,
      addDietItem,
      updateDietItem,
      deleteDietItem,
      updateWeeklySupplement,
      addLogAjuste,
      deleteLogAjuste,
      latestWeight,
      latestHealthRecord,
      latestMedicion,
      alertStatuses,
      urgentAlerts,
      weightSemaphore,
      fluidRetentionStatus,
      healthScore,
      activeJointCycle,
      resetAllData,
    }),
    [
      state,
      toggleTheme,
      updateDogProfile,
      addHealthRecord,
      updateHealthRecord,
      deleteHealthRecord,
      completeAlert,
      deleteAlertLog,
      startJointCycle,
      toggleJointCycleActive,
      addMedicion,
      deleteMedicion,
      updateConfigBase,
      updatePreparacionItem,
      addPreparacionItem,
      removePreparacionItem,
      resetPreparacionToDefaults,
      addDietItem,
      updateDietItem,
      deleteDietItem,
      updateWeeklySupplement,
      addLogAjuste,
      deleteLogAjuste,
      latestWeight,
      latestHealthRecord,
      latestMedicion,
      alertStatuses,
      urgentAlerts,
      weightSemaphore,
      fluidRetentionStatus,
      healthScore,
      activeJointCycle,
      resetAllData,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useAquilesStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useAquilesStore must be used within a StoreProvider');
  }
  return context;
}
