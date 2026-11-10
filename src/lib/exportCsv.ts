import { DogProfile, AlertLog, JointCycle, HealthRecord, DietItem, WeeklySupplement, WetFood, ConfigBase, RegistroMedicion, LogAjuste, PreparacionItem } from './types';
import { formatDate } from './alerts';

function downloadFile(content: string, filename: string, mimeType: string) {
  // UTF-8 BOM so Excel and other programs open Spanish accents correctly
  const blob = new Blob(['\uFEFF' + content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportFullDatabaseCSV(data: {
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
}) {
  const today = formatDate(new Date());
  let csv = `Salud de Aquiles — exportación completa,${today}, ${new Date().toLocaleTimeString()}\n\n`;

  // 1. Dog Profile
  csv += `### Dashboard · Perfil de Aquiles (1 registros)\n`;
  csv += `id,ideal_weight,created_at,updated_at,birth_date\n`;
  csv += `${data.dogProfile.id},${data.dogProfile.ideal_weight},${data.dogProfile.created_at || ''},${data.dogProfile.updated_at || ''},${data.dogProfile.birth_date}\n\n`;

  // 2. Alert logs
  csv += `### Dashboard · Alertas y recordatorios (${data.alertLogs.length} registros)\n`;
  csv += `id,alert_type,completed_date,year,created_at,next_date,previous_next_date\n`;
  data.alertLogs.forEach((a) => {
    csv += `${a.id},${a.alert_type},${a.completed_date},${a.year},${a.created_at || ''},${a.next_date || ''},${a.previous_next_date || ''}\n`;
  });
  csv += `\n`;

  // 3. Joint cycles
  csv += `### Dashboard · Tratamiento articular (${data.jointCycles.length} registros)\n`;
  csv += `id,start_date,cycle_month,active,created_at,updated_at,last_dose_date,completed_date\n`;
  data.jointCycles.forEach((j) => {
    csv += `${j.id},${j.start_date},${j.cycle_month},${j.active},${j.created_at || ''},${j.updated_at || ''},${j.last_dose_date || ''},${j.completed_date || ''}\n`;
  });
  csv += `\n`;

  // 4. Health records
  csv += `### Historial · Registros de peso, alergias y medicación (${data.healthRecords.length} registros)\n`;
  csv += `id,record_date,weight,has_allergy,medication,is_mock,created_at\n`;
  data.healthRecords.forEach((h) => {
    csv += `${h.id},${h.record_date},${h.weight ?? ''},${h.has_allergy},${h.medication || 'Ninguno'},${!!h.is_mock},${h.created_at || ''}\n`;
  });
  csv += `\n`;

  // 5. Diet items
  csv += `### Historial · Dieta (ingredientes) (${data.dietItems.length} registros)\n`;
  csv += `id,season,item_name,quantity,sort_order,created_at,shrinkage\n`;
  data.dietItems.forEach((d) => {
    csv += `${d.id},${d.season},"${d.item_name}",${d.quantity},${d.sort_order},${d.created_at || ''},${d.shrinkage || 1}\n`;
  });
  csv += `\n`;

  // 6. Supplements
  csv += `### Historial · Suplementos semanales (${data.weeklySupplements.length} registros)\n`;
  csv += `id,day_of_week,content,created_at,morning,afternoon\n`;
  data.weeklySupplements.forEach((s) => {
    const esc = (txt?: string) => `"${(txt || '').replace(/"/g, '""')}"`;
    csv += `${s.id},${s.day_of_week},${esc(s.content)},${s.created_at || ''},${esc(s.morning)},${esc(s.afternoon)}\n`;
  });
  csv += `\n`;

  // 7. Wet food
  csv += `### Historial · Comida húmeda (${data.wetFood.length} registros)\n`;
  csv += `id,product_name,image_url,created_at,updated_at\n`;
  data.wetFood.forEach((w) => {
    csv += `${w.id},${w.product_name},${w.image_url || ''},${w.created_at || ''},${w.updated_at || ''}\n`;
  });
  csv += `\n`;

  // 8. Log Ajustes (Sincro-Evolución)
  csv += `### Sincro-Evolución · Cambios de peso y dieta (${data.logAjustes.length} registros)\n`;
  csv += `id,created_at,peso_anterior,peso_nuevo,resumen_cambio,snapshot_dieta\n`;
  data.logAjustes.forEach((l) => {
    const escSnap = `"${JSON.stringify(l.snapshot_dieta).replace(/"/g, '""')}"`;
    csv += `${l.id},${l.created_at},${l.peso_anterior},${l.peso_nuevo},"${l.resumen_cambio.replace(/"/g, '""')}",${escSnap}\n`;
  });
  csv += `\n`;

  // 9. Config Base
  csv += `### Corazón · Medida base (1 registros)\n`;
  csv += `id,base_pecho,base_barriga,created_at,updated_at\n`;
  csv += `${data.configBase.id},${data.configBase.base_pecho},${data.configBase.base_barriga},${data.configBase.created_at || ''},${data.configBase.updated_at || ''}\n\n`;

  // 10. Mediciones
  csv += `### Corazón · Mediciones de pecho y cintura (${data.registrosMediciones.length} registros)\n`;
  csv += `id,fecha,medida_pecho,medida_barriga,created_at\n`;
  data.registrosMediciones.forEach((m) => {
    csv += `${m.id},${m.fecha},${m.medida_pecho},${m.medida_barriga},${m.created_at || ''}\n`;
  });
  csv += `\n`;

  // 11. Preparacion
  csv += `### Preparación · Ingredientes, cantidades y mermas (${data.preparacionItems.length} registros)\n`;
  csv += `ingrediente,neto_semanal,unidad,merma_pct,total_compra\n`;
  data.preparacionItems.forEach((p) => {
    csv += `"${p.ingrediente}",${p.neto_semanal},${p.unidad},${p.merma_pct},${p.total_compra}\n`;
  });

  downloadFile(csv, `aquiles_completo_${today}.csv`, 'text/csv');
}

export function exportMedicionesCSV(registros: RegistroMedicion[], basePecho: number, baseBarriga: number) {
  const today = formatDate(new Date());
  let csv = `Fecha,Pecho (cm),Barriga (cm),Delta Pecho (vs ${basePecho}),Delta Barriga (vs ${baseBarriga}),Estado\n`;
  registros.forEach((r) => {
    const dPecho = (r.medida_pecho - basePecho).toFixed(1);
    const dBarriga = (r.medida_barriga - baseBarriga).toFixed(1);
    const maxDelta = Math.max(parseFloat(dPecho), parseFloat(dBarriga));
    const estado = maxDelta <= 1.0 ? 'Estable' : maxDelta <= 2.5 ? 'Precaución' : 'Crítico';
    csv += `${r.fecha},${r.medida_pecho},${r.medida_barriga},${dPecho},${dBarriga},${estado}\n`;
  });
  downloadFile(csv, `mediciones_aquiles_${today}.csv`, 'text/csv');
}

export function exportEvolutionCSV(logs: LogAjuste[]) {
  const today = formatDate(new Date());
  let csv = `Fecha,Peso Anterior (kg),Peso Nuevo (kg),Resumen Cambio,Detalle Alimentos\n`;
  logs.forEach((l) => {
    const dateFormatted = l.created_at.slice(0, 10);
    const details = Object.entries(l.snapshot_dieta)
      .map(([k, v]) => `${k}: ${v}g`)
      .join('; ');
    csv += `${dateFormatted},${l.peso_anterior},${l.peso_nuevo},"${l.resumen_cambio.replace(/"/g, '""')}","${details}"\n`;
  });
  downloadFile(csv, `sincro_evolucion_aquiles_${today}.csv`, 'text/csv');
}
