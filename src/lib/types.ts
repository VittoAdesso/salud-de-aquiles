export interface DogProfile {
  id: string;
  name: string;
  birth_date: string; // 2016-10-03
  ideal_weight: number; // 12.0 kg
  created_at?: string;
  updated_at?: string;
}

export type AlertType =
  | 'desparasitacion'
  | 'collar_bayer'
  | 'vacuna_rabia'
  | 'vacuna_heptavalente'
  | 'vacuna_tos_perrera'
  | 'control_corazon'
  | 'condrovet';

export interface AlertLog {
  id: string;
  alert_type: AlertType;
  completed_date: string;
  year: number;
  next_date?: string;
  previous_next_date?: string;
  created_at?: string;
}

export interface JointCycle {
  id: string;
  start_date: string;
  cycle_month: number; // 2 (Feb), 5 (May), 8 (Aug), 11 (Nov)
  active: boolean;
  completed_date?: string;
  last_dose_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HealthRecord {
  id: string;
  record_date: string;
  weight?: number;
  has_allergy: boolean;
  medication?: string;
  is_mock?: boolean;
  created_at?: string;
}

export type Season = 'cold' | 'hot' | 'all';

export interface DietItem {
  id: string;
  season: Season;
  item_name: string;
  quantity: string;
  sort_order: number;
  shrinkage?: number;
  created_at?: string;
}

export interface WeeklySupplement {
  id: string;
  day_of_week: number; // 0=Sunday..6=Saturday or Monday..Sunday
  content: string;
  morning?: string;
  afternoon?: string;
  created_at?: string;
}

export interface WetFood {
  id: string;
  product_name: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ConfigBase {
  id: string;
  base_pecho: number; // 60.0 cm
  base_barriga: number; // 44.0 cm
  created_at?: string;
  updated_at?: string;
}

export interface RegistroMedicion {
  id: string;
  fecha: string;
  medida_pecho: number;
  medida_barriga: number;
  created_at?: string;
}

export interface LogAjuste {
  id: string;
  created_at: string;
  peso_anterior: number;
  peso_nuevo: number;
  resumen_cambio: string;
  snapshot_dieta: Record<string, number>;
}

export interface PreparacionItem {
  ingrediente: string;
  neto_semanal: number;
  unidad: string;
  merma_pct: number;
  total_compra: number;
  exclude_from_pot?: boolean;
}

export type SemaphoreColor = 'green' | 'yellow' | 'red';

export interface AlertStatus {
  key: AlertType;
  title: string;
  subtitle: string;
  recurrence: string;
  nextDate: string;
  daysRemaining: number;
  isOverdue: boolean;
  isDoneThisPeriod: boolean;
  color: SemaphoreColor;
  statusLabel: string;
  actionGuide?: string;
}
