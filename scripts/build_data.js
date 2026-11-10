import fs from 'node:fs';

function parseLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

function parseCSVLines(text) {
  const lines = text.trim().split('\n');
  if (lines.length <= 1) return [];
  const header = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;
    const values = parseLine(lines[i]);
    const obj = {};
    header.forEach((h, idx) => {
      obj[h.trim()] = values[idx] !== undefined ? values[idx].trim() : '';
    });
    rows.push(obj);
  }
  return rows;
}

const content = fs.readFileSync('public/assets/aistudio/aquiles_completo_2026-11-06_92841af0.csv', 'utf8');
const sections = content.split('### ');

const data = {};

for (const s of sections) {
  const lines = s.split('\n');
  const title = lines[0].trim();
  const rest = lines.slice(1).join('\n');
  if (title.includes('Perfil de Aquiles')) {
    data.dogProfile = parseCSVLines(rest)[0];
  } else if (title.includes('Alertas y recordatorios')) {
    data.alertLogs = parseCSVLines(rest);
  } else if (title.includes('Tratamiento articular')) {
    data.jointCycles = parseCSVLines(rest);
  } else if (title.includes('Registros de peso')) {
    data.healthRecords = parseCSVLines(rest);
  } else if (title.includes('Dieta (ingredientes)')) {
    data.dietItems = parseCSVLines(rest);
  } else if (title.includes('Suplementos semanales')) {
    data.weeklySupplements = parseCSVLines(rest);
  } else if (title.includes('Comida húmeda')) {
    data.wetFood = parseCSVLines(rest);
  } else if (title.includes('Cambios de peso y dieta')) {
    data.logAjustes = parseCSVLines(rest);
  } else if (title.includes('Medida base')) {
    data.configBase = parseCSVLines(rest)[0];
  } else if (title.includes('Mediciones de pecho y cintura')) {
    data.registrosMediciones = parseCSVLines(rest);
  } else if (title.includes('Ingredientes, cantidades y mermas')) {
    data.preparacionItems = parseCSVLines(rest);
  }
}

const dogProfile = {
  id: data.dogProfile?.id || '20fae792-d366-4fa7-8cb8-8b342c15fac7',
  name: 'Aquiles',
  birth_date: data.dogProfile?.birth_date || '2016-10-03',
  ideal_weight: parseFloat(data.dogProfile?.ideal_weight || '12'),
  created_at: data.dogProfile?.created_at,
  updated_at: data.dogProfile?.updated_at,
};

const alertLogs = (data.alertLogs || []).map((r) => ({
  id: r.id,
  alert_type: r.alert_type,
  completed_date: r.completed_date,
  year: parseInt(r.year || '2026', 10),
  next_date: r.next_date || undefined,
  previous_next_date: r.previous_next_date || undefined,
  created_at: r.created_at,
}));

const jointCycles = (data.jointCycles || []).map((r) => ({
  id: r.id,
  start_date: r.start_date,
  cycle_month: parseInt(r.cycle_month || '11', 10),
  active: r.active === 'true',
  completed_date: r.completed_date || undefined,
  last_dose_date: r.last_dose_date || undefined,
  created_at: r.created_at,
  updated_at: r.updated_at,
}));

const healthRecords = (data.healthRecords || []).map((r) => ({
  id: r.id,
  record_date: r.record_date,
  weight: r.weight ? parseFloat(r.weight) : undefined,
  has_allergy: r.has_allergy === 'true',
  medication: r.medication || 'Ninguno',
  is_mock: r.is_mock === 'true',
  created_at: r.created_at,
}));

const dietItems = (data.dietItems || []).map((r) => ({
  id: r.id,
  season: r.season,
  item_name: r.item_name,
  quantity: r.quantity,
  sort_order: parseInt(r.sort_order || '0', 10),
  shrinkage: r.shrinkage ? parseFloat(r.shrinkage) : 1,
  created_at: r.created_at,
}));

const weeklySupplements = (data.weeklySupplements || []).map((r) => ({
  id: r.id,
  day_of_week: parseInt(r.day_of_week || '0', 10),
  content: r.content,
  morning: r.morning || undefined,
  afternoon: r.afternoon || undefined,
  created_at: r.created_at,
}));

const wetFood = (data.wetFood || []).map((r) => ({
  id: r.id,
  product_name: r.product_name,
  image_url: r.image_url,
  created_at: r.created_at,
  updated_at: r.updated_at,
}));

const configBase = {
  id: data.configBase?.id || '6c06d7c8-c4ba-4dad-98a7-906d44272591',
  base_pecho: parseFloat(data.configBase?.base_pecho || '60'),
  base_barriga: parseFloat(data.configBase?.base_barriga || '44'),
  created_at: data.configBase?.created_at,
  updated_at: data.configBase?.updated_at,
};

const registrosMediciones = (data.registrosMediciones || []).map((r) => ({
  id: r.id,
  fecha: r.fecha,
  medida_pecho: parseFloat(r.medida_pecho),
  medida_barriga: parseFloat(r.medida_barriga),
  created_at: r.created_at,
}));

const logAjustes = (data.logAjustes || []).map((r) => {
  let snap = {};
  try {
    snap = JSON.parse(r.snapshot_dieta || '{}');
  } catch (e) {}
  return {
    id: r.id,
    created_at: r.created_at,
    peso_anterior: parseFloat(r.peso_anterior),
    peso_nuevo: parseFloat(r.peso_nuevo),
    resumen_cambio: r.resumen_cambio,
    snapshot_dieta: snap,
  };
});

const preparacionItems = (data.preparacionItems || []).map((r) => ({
  ingrediente: r.ingrediente,
  neto_semanal: parseFloat(r.neto_semanal || '0'),
  unidad: r.unidad || 'g',
  merma_pct: r.merma_pct ? parseFloat(r.merma_pct) : 0,
  total_compra: parseFloat(r.total_compra || '0'),
  exclude_from_pot: ['Sardina', 'Cáscara de huevo molida', 'Arándanos'].some((k) => r.ingrediente.includes(k)),
}));

const fileContent = `// Auto-generated complete authentic dataset from CSV export
import { DogProfile, AlertLog, JointCycle, HealthRecord, DietItem, WeeklySupplement, WetFood, ConfigBase, RegistroMedicion, LogAjuste, PreparacionItem } from './types';

export const INITIAL_DOG_PROFILE: DogProfile = ${JSON.stringify(dogProfile, null, 2)};

export const INITIAL_ALERT_LOGS: AlertLog[] = ${JSON.stringify(alertLogs, null, 2)};

export const INITIAL_JOINT_CYCLES: JointCycle[] = ${JSON.stringify(jointCycles, null, 2)};

export const INITIAL_HEALTH_RECORDS: HealthRecord[] = ${JSON.stringify(healthRecords, null, 2)};

export const INITIAL_DIET_ITEMS: DietItem[] = ${JSON.stringify(dietItems, null, 2)};

export const INITIAL_WEEKLY_SUPPLEMENTS: WeeklySupplement[] = ${JSON.stringify(weeklySupplements, null, 2)};

export const INITIAL_WET_FOOD: WetFood[] = ${JSON.stringify(wetFood, null, 2)};

export const INITIAL_CONFIG_BASE: ConfigBase = ${JSON.stringify(configBase, null, 2)};

export const INITIAL_REGISTROS_MEDICIONES: RegistroMedicion[] = ${JSON.stringify(registrosMediciones, null, 2)};

export const INITIAL_LOG_AJUSTES: LogAjuste[] = ${JSON.stringify(logAjustes, null, 2)};

export const INITIAL_PREPARACION_ITEMS: PreparacionItem[] = ${JSON.stringify(preparacionItems, null, 2)};
`;

fs.writeFileSync('src/lib/initialData.ts', fileContent, 'utf8');
console.log('Successfully written src/lib/initialData.ts');
console.log({
  healthRecords: healthRecords.length,
  mediciones: registrosMediciones.length,
  logAjustes: logAjustes.length,
  dietItems: dietItems.length,
  alertLogs: alertLogs.length,
  jointCycles: jointCycles.length,
});
