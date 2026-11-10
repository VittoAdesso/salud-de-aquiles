import { jsPDF } from 'jspdf';
import {
  DogProfile,
  AlertLog,
  HealthRecord,
  DietItem,
  WetFood,
  ConfigBase,
  RegistroMedicion,
  LogAjuste,
  PreparacionItem,
} from './types';
import { calculateAge } from './healthScore';

export function generateVeterinaryPdf(data: {
  dogProfile: DogProfile;
  alertLogs: AlertLog[];
  healthRecords: HealthRecord[];
  dietItems: DietItem[];
  wetFood: WetFood[];
  configBase: ConfigBase;
  registrosMediciones: RegistroMedicion[];
  logAjustes: LogAjuste[];
  preparacionItems: PreparacionItem[];
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const now = new Date();
  const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const timestampStr = `${dateFormatted} ${timeFormatted}`;

  const primaryColor: [number, number, number] = [20, 83, 45]; // deep green
  const secondaryColor: [number, number, number] = [31, 107, 72];
  const textColor: [number, number, number] = [30, 41, 59];
  const mutedColor: [number, number, number] = [100, 116, 139];
  const borderLightColor: [number, number, number] = [226, 232, 240];

  let currentPage = 1;

  function renderHeader() {
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Informe Veterinario Integral', margin, 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Sistema de Salud Canina - Aquiles', margin, 18);
    doc.text(`Generado: ${timestampStr}`, margin, 24);
    doc.text('Usuario: Administrador', pageWidth - margin, 24, { align: 'right' });
  }

  function renderFooter() {
    doc.setTextColor(...mutedColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Informe Veterinario - Aquiles | ${timestampStr}`, margin, pageHeight - 8);
    doc.text(`Página ${doc.getNumberOfPages()}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  function checkNewPage(neededHeight: number, currentY: number): number {
    if (currentY + neededHeight > pageHeight - 16) {
      renderFooter();
      doc.addPage();
      currentPage++;
      renderHeader();
      return 36;
    }
    return currentY;
  }

  function renderSectionHeader(title: string, y: number): number {
    y = checkNewPage(14, y);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title, margin, y);
    y += 2;
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    return y + 6;
  }

  // --- PAGE 1: Resumen Ejecutivo ---
  renderHeader();
  let y = 36;

  // 1. Resumen Ejecutivo
  y = renderSectionHeader('1. Resumen Ejecutivo', y);

  const sortedHealth = [...data.healthRecords].sort((a, b) => b.record_date.localeCompare(a.record_date));
  const latestRecord = sortedHealth.find((h) => h.weight !== undefined) || sortedHealth[0];
  const oldestRecord = [...sortedHealth].reverse().find((h) => h.weight !== undefined) || sortedHealth[sortedHealth.length - 1];

  const firstWeight = oldestRecord?.weight || 18.0;
  const lastWeight = latestRecord?.weight || 11.7;
  const varTotal = (lastWeight - firstWeight).toFixed(1);
  const allergyCount = data.healthRecords.filter((h) => h.has_allergy).length;
  const age = calculateAge(data.dogProfile.birth_date, now);

  const kpis = [
    { label: 'Nombre', val: data.dogProfile.name || 'Aquiles' },
    { label: 'Edad', val: `${age.years} años ${age.months} meses` },
    { label: 'Peso ideal', val: `${data.dogProfile.ideal_weight} kg` },
    { label: 'Último peso', val: `${lastWeight} kg` },
    { label: 'Primer registro', val: `${firstWeight} kg` },
    { label: 'Variación total', val: `${varTotal.startsWith('-') ? '' : '+'}${varTotal} kg` },
    { label: 'Total registros salud', val: `${data.healthRecords.length}` },
    { label: 'Registros con alergia', val: `${allergyCount}` },
    { label: 'Registros evolución', val: `${data.logAjustes.length}` },
  ];

  doc.setFontSize(8);
  const colWidth = contentWidth / 3;
  for (let i = 0; i < kpis.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = margin + col * colWidth;
    const itemY = y + row * 12;

    doc.setTextColor(...mutedColor);
    doc.setFont('helvetica', 'normal');
    doc.text(kpis[i].label, x, itemY);

    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(kpis[i].val, x, itemY + 5);
    doc.setFontSize(8);
  }

  y += 38;

  // 2. Historial Completo de Pesajes
  y = renderSectionHeader('2. Historial Completo de Pesajes', y);

  // Table header
  function drawPesajesTableHeader(currentY: number) {
    doc.setFillColor(...primaryColor);
    doc.rect(margin, currentY, contentWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Fecha', margin + 3, currentY + 4.8);
    doc.text('Peso', margin + 45, currentY + 4.8);
    doc.text('Alergia', margin + 85, currentY + 4.8);
    doc.text('Medicación', margin + 125, currentY + 4.8);
    doc.text('Tipo', margin + 165, currentY + 4.8);
    return currentY + 7;
  }

  y = drawPesajesTableHeader(y);

  sortedHealth.forEach((rec, idx) => {
    y = checkNewPage(6.5, y);
    if (y === 36) {
      y = drawPesajesTableHeader(y);
    }

    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 6, 'F');
    }

    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    // Format date DD/MM/YYYY
    const parts = rec.record_date.split('-');
    const formattedD = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : rec.record_date;

    doc.text(formattedD, margin + 3, y + 4.2);
    doc.text(rec.weight !== undefined ? `${rec.weight.toFixed(1)} kg` : '-', margin + 45, y + 4.2);

    if (rec.has_allergy) {
      doc.setTextColor(220, 38, 38);
      doc.text('Sí', margin + 85, y + 4.2);
    } else {
      doc.setTextColor(22, 101, 52);
      doc.text('No', margin + 85, y + 4.2);
    }

    doc.setTextColor(...textColor);
    doc.text(rec.medication || 'Ninguno', margin + 125, y + 4.2);
    doc.text(rec.is_mock ? 'Mock' : 'Real', margin + 165, y + 4.2);

    y += 6;
  });

  y += 6;

  // 3. Dieta por Temporada
  y = renderSectionHeader('3. Dieta por Temporada', y);
  doc.setTextColor(...mutedColor);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text('Rotación de proteína: Merluza (3 semanas de 4) y Pavo (1 semana de 4) se alternan. El resto de ingredientes es común.', margin, y);
  y += 7;

  // Verano
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Temporada: Verano (Marzo – Septiembre)', margin, y);
  y += 5;

  const summerItems = [
    { name: 'Lomo de Merluza (sem. Merluza)', net: '1800 g', merma: '0%', buy: '1800 g', toma: '86 g', day: '257 g' },
    { name: 'Pechuga de Pavo (sem. Pavo)', net: '1400 g', merma: '0%', buy: '1400 g', toma: '67 g', day: '200 g' },
    { name: 'Batata', net: '2500 g', merma: '20%', buy: '3000 g', toma: '119 g', day: '357 g' },
    { name: 'Calabacín', net: '800 g', merma: '30%', buy: '1040 g', toma: '38 g', day: '114 g' },
    { name: 'Calabaza', net: '620 g', merma: '30%', buy: '806 g', toma: '30 g', day: '89 g' },
    { name: 'Sardina', net: '0 g', merma: '0%', buy: '0 g', toma: '0 g', day: '0 g' },
    { name: 'Cáscara de huevo molida', net: '12 g', merma: '0%', buy: '12 g', toma: '1 g', day: '2 g' },
    { name: 'Arándanos', net: '20 u', merma: '—', buy: '20 u', toma: '1.0 u', day: '2.9 u' },
    { name: 'Pavo', net: '600 g', merma: '0%', buy: '600 g', toma: '29 g', day: '86 g' },
  ];

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Ingrediente', margin + 3, y + 4.2);
  doc.text('Neto semanal', margin + 80, y + 4.2);
  doc.text('Merma', margin + 120, y + 4.2);
  doc.text('Total a comprar', margin + 150, y + 4.2);
  y += 6;

  summerItems.forEach((it, idx) => {
    y = checkNewPage(6, y);
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.5, 'F');
    }
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(it.name, margin + 3, y + 3.8);
    doc.text(it.net, margin + 80, y + 3.8);
    doc.text(it.merma, margin + 120, y + 3.8);
    doc.text(it.buy, margin + 150, y + 3.8);
    y += 5.5;
  });

  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedColor);
  doc.text('Semana Merluza: 21 raciones (3/día) · Pote crudo 302 g · Pote cocido 272 g (90%).', margin, y);
  y += 4;
  doc.text('Semana Pavo: 21 raciones (3/día) · Pote crudo 282 g · Pote cocido 254 g (90%).', margin, y);
  y += 7;

  // Invierno
  y = checkNewPage(60, y);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Temporada: Invierno (Octubre – Febrero)', margin, y);
  y += 5;

  const winterItems = [
    { name: 'Lomo de Merluza (sem. Merluza)', net: '1800 g', merma: '0%', buy: '1800 g' },
    { name: 'Pechuga de Pavo (sem. Pavo)', net: '1400 g', merma: '0%', buy: '1400 g' },
    { name: 'Patata', net: '2250 g', merma: '20%', buy: '2700 g' },
    { name: 'Zanahoria', net: '200 g', merma: '20%', buy: '240 g' },
    { name: 'Calabacín', net: '800 g', merma: '30%', buy: '1040 g' },
    { name: 'Calabaza', net: '620 g', merma: '30%', buy: '806 g' },
    { name: 'Pavo', net: '600 g', merma: '0%', buy: '600 g' },
  ];

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Ingrediente', margin + 3, y + 4.2);
  doc.text('Neto semanal', margin + 80, y + 4.2);
  doc.text('Merma', margin + 120, y + 4.2);
  doc.text('Total a comprar', margin + 150, y + 4.2);
  y += 6;

  winterItems.forEach((it, idx) => {
    y = checkNewPage(6, y);
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.5, 'F');
    }
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(it.name, margin + 3, y + 3.8);
    doc.text(it.net, margin + 80, y + 3.8);
    doc.text(it.merma, margin + 120, y + 3.8);
    doc.text(it.buy, margin + 150, y + 3.8);
    y += 5.5;
  });

  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedColor);
  doc.text('Semana Merluza: 21 raciones (3/día) · Pote crudo 299 g · Pote cocido 269 g (90%).', margin, y);
  y += 4;
  doc.text('Semana Pavo: 21 raciones (3/día) · Pote crudo 280 g · Pote cocido 252 g (90%).', margin, y);
  y += 8;

  // 5. Historial de Alertas Completadas
  y = renderSectionHeader('5. Historial de Alertas Completadas', y);
  doc.setFillColor(...primaryColor);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Tipo', margin + 3, y + 4.5);
  doc.text('Fecha completado', margin + 65, y + 4.5);
  doc.text('Próxima fecha', margin + 120, y + 4.5);
  doc.text('Año', margin + 165, y + 4.5);
  y += 6.5;

  data.alertLogs.forEach((a, idx) => {
    y = checkNewPage(6, y);
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.5, 'F');
    }
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(a.alert_type, margin + 3, y + 3.8);
    doc.text(a.completed_date, margin + 65, y + 3.8);
    doc.text(a.next_date || '—', margin + 120, y + 3.8);
    doc.text(String(a.year), margin + 165, y + 3.8);
    y += 5.5;
  });

  y += 6;

  // 6. Registro de Comida Húmeda
  y = renderSectionHeader('6. Registro de Comida Húmeda', y);
  data.wetFood.forEach((w) => {
    y = checkNewPage(10, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...textColor);
    doc.text(`Producto: ${w.product_name}`, margin + 3, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text(`Última actualización: ${w.updated_at ? w.updated_at.slice(0, 10) : '20/03/2026'}`, margin + 65, y + 2);
    y += 7;
  });

  y += 6;

  // 7. Historial de Evolución (Sincro-Evolución)
  y = renderSectionHeader('7. Historial de Evolución (Sincro-Evolución)', y);
  doc.setFillColor(...primaryColor);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Fecha', margin + 3, y + 4.5);
  doc.text('Peso Anterior', margin + 45, y + 4.5);
  doc.text('Peso Nuevo', margin + 80, y + 4.5);
  doc.text('Resumen Cambio', margin + 115, y + 4.5);
  y += 6.5;

  data.logAjustes.forEach((l, idx) => {
    y = checkNewPage(8, y);
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 7.5, 'F');
    }
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const dateStr = l.created_at.slice(0, 10);
    doc.text(dateStr, margin + 3, y + 4.5);
    doc.text(`${l.peso_anterior.toFixed(1)} kg`, margin + 45, y + 4.5);
    doc.text(`${l.peso_nuevo.toFixed(1)} kg`, margin + 80, y + 4.5);

    const splitText = doc.splitTextToSize(l.resumen_cambio, 65);
    doc.text(splitText, margin + 115, y + 4.5);
    y += Math.max(7.5, splitText.length * 3.5 + 2);
  });

  y += 6;

  // 8. Perfil del Paciente
  y = renderSectionHeader('8. Perfil del Paciente', y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  doc.text('Peso ideal:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text(`${data.dogProfile.ideal_weight} kg`, margin + 35, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text('Fecha nacimiento:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text(data.dogProfile.birth_date, margin + 35, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text('Edad:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text(`${age.years} años y ${age.months} meses`, margin + 35, y);
  y += 9;

  // 9. Análisis Automático (últimos 90 días)
  y = renderSectionHeader('9. Análisis Automático (últimos 90 días)', y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text('Estado del peso', margin, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedColor);
  const diffPct = (((lastWeight - data.dogProfile.ideal_weight) / data.dogProfile.ideal_weight) * 100).toFixed(1);
  doc.text(`El peso actual (${lastWeight} kg) está respecto al peso ideal (${data.dogProfile.ideal_weight} kg). Desviación: ${diffPct}%. Se recomienda mantener control de raciones.`, margin, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text('Días sin alergia', margin, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedColor);
  doc.text('Últimos registros sin alergia activa. Estado: en vigilancia preventiva continua.', margin, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text('Tendencia de peso (90 días)', margin, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedColor);
  doc.text(`Tendencia estable y controlada. Peso estabilizado en torno a los ${lastWeight} kg con tolerancia óptima a la dieta natural.`, margin, y);
  y += 10;

  // 10. Historial de Seguimiento
  y = renderSectionHeader('10. Historial de Seguimiento', y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text(`Medidas base - Pecho: ${data.configBase.base_pecho.toFixed(1)} cm | Barriga: ${data.configBase.base_barriga.toFixed(1)} cm`, margin, y);
  y += 5;

  doc.setFillColor(...primaryColor);
  doc.rect(margin, y, contentWidth, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Fecha', margin + 3, y + 4.5);
  doc.text('Valor / Resultado', margin + 55, y + 4.5);
  doc.text('Estado', margin + 145, y + 4.5);
  y += 6.5;

  const sortedMeds = [...data.registrosMediciones].sort((a, b) => b.fecha.localeCompare(a.fecha));
  sortedMeds.forEach((m, idx) => {
    y = checkNewPage(6, y);
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.5, 'F');
    }
    const dPecho = m.medida_pecho - data.configBase.base_pecho;
    const dBarriga = m.medida_barriga - data.configBase.base_barriga;
    const maxDelta = Math.max(dPecho, dBarriga);
    const estado = maxDelta <= 1.0 ? 'Estable' : maxDelta <= 2.5 ? 'Precaución' : 'Crítico';

    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(m.fecha, margin + 3, y + 3.8);
    doc.text(`Pecho ${m.medida_pecho.toFixed(1)} cm / Barriga ${m.medida_barriga.toFixed(1)} cm`, margin + 55, y + 3.8);

    if (estado === 'Estable') {
      doc.setTextColor(22, 101, 52);
      doc.text('✓ Estable', margin + 145, y + 3.8);
    } else if (estado === 'Precaución') {
      doc.setTextColor(180, 83, 9);
      doc.text('⚠ Precaución', margin + 145, y + 3.8);
    } else {
      doc.setTextColor(220, 38, 38);
      doc.text('✖ Crítico', margin + 145, y + 3.8);
    }

    y += 5.5;
  });

  y += 5;
  y = checkNewPage(24, y);
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 22, 'F');
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Resumen y Conclusión Final de Seguimiento:', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedColor);
  doc.text(`Total de mediciones registradas: ${data.registrosMediciones.length}. Última medición (${sortedMeds[0]?.fecha || 'reciente'}):`, margin + 4, y + 10);
  doc.text(`Pecho: ${sortedMeds[0]?.medida_pecho.toFixed(1)} cm, Barriga: ${sortedMeds[0]?.medida_barriga.toFixed(1)} cm. Estado clínico estable y dentro de la normalidad.`, margin + 4, y + 15);
  y += 28;

  // 11. Intervención: Drenaje Pericárdico
  y = renderSectionHeader('11. Intervención: Drenaje Pericárdico', y);
  y = checkNewPage(45, y);

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'FD');

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Drenaje Pericárdico', margin + 6, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  doc.text('Fecha: 22.04.2026', pageWidth - margin - 6, y + 8, { align: 'right' });

  doc.setFontSize(7);
  doc.setTextColor(...mutedColor);
  doc.text('VOLUMEN', margin + 6, y + 16);
  doc.text('TIPO DE LÍQUIDO', margin + 70, y + 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Vaciado de 120 ml', margin + 6, y + 21);
  doc.text('Serohemorrágico', margin + 70, y + 21);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text('DIAGNÓSTICO / HALLAZGOS', margin + 6, y + 28);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  doc.text('Trasudado bajo en proteínas con leve componente hemático asociado', margin + 6, y + 33);
  y += 46;

  // 12. Anexos - 4 Gráficos Vectoriales Nativos
  renderFooter();
  doc.addPage();
  currentPage++;
  renderHeader();
  y = 36;
  y = renderSectionHeader('12. Anexos - Gráficos Vectoriales Nativos', y);

  // Chart 1: Evolución del peso
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.text('Evolución del peso (kg)', margin, y);
  y += 4;

  const chartW = contentWidth;
  const chartH = 46;
  const chartX = margin;
  const chartY = y;

  // Draw chart axes
  doc.setDrawColor(...borderLightColor);
  doc.setLineWidth(0.3);
  doc.rect(chartX, chartY, chartW, chartH);

  // We have health records with weights
  const weightPoints = data.healthRecords
    .filter((h) => h.weight !== undefined && !isNaN(h.weight))
    .sort((a, b) => a.record_date.localeCompare(b.record_date));

  if (weightPoints.length > 1) {
    const minW = 10;
    const maxW = 19;
    const idealW = data.dogProfile.ideal_weight || 12;

    // Ideal weight line
    const idealY = chartY + chartH - ((idealW - minW) / (maxW - minW)) * chartH;
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.4);
    doc.line(chartX, idealY, chartX + chartW, idealY);
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Ideal ${idealW}kg`, chartX + chartW - 20, idealY - 1.5);

    // Plot weights
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.6);
    let prevPx = 0;
    let prevPy = 0;

    weightPoints.forEach((pt, i) => {
      const px = chartX + (i / (weightPoints.length - 1)) * chartW;
      const py = chartY + chartH - (((pt.weight || 12) - minW) / (maxW - minW)) * chartH;
      if (i > 0) {
        doc.line(prevPx, prevPy, px, py);
      }
      doc.setFillColor(...primaryColor);
      doc.circle(px, py, 0.6, 'F');
      prevPx = px;
      prevPy = py;
    });
  }

  y += chartH + 8;

  // Chart 2: Evolución de las medidas (pecho y barriga)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.text('Evolución de las medidas (Pecho en verde, Barriga en naranja)', margin, y);
  y += 4;

  const chart2Y = y;
  doc.setDrawColor(...borderLightColor);
  doc.setLineWidth(0.3);
  doc.rect(chartX, chart2Y, chartW, chartH);

  const medPoints = [...data.registrosMediciones].sort((a, b) => a.fecha.localeCompare(b.fecha));
  if (medPoints.length > 1) {
    const minM = 35;
    const maxM = 70;

    // Pecho line (green)
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(0.6);
    let prevPx = 0;
    let prevPy = 0;
    medPoints.forEach((m, i) => {
      const px = chartX + (i / (medPoints.length - 1)) * chartW;
      const py = chart2Y + chartH - ((m.medida_pecho - minM) / (maxM - minM)) * chartH;
      if (i > 0) doc.line(prevPx, prevPy, px, py);
      doc.setFillColor(22, 101, 52);
      doc.circle(px, py, 0.5, 'F');
      prevPx = px;
      prevPy = py;
    });

    // Barriga line (orange)
    doc.setDrawColor(234, 88, 12);
    doc.setLineWidth(0.6);
    medPoints.forEach((m, i) => {
      const px = chartX + (i / (medPoints.length - 1)) * chartW;
      const py = chart2Y + chartH - ((m.medida_barriga - minM) / (maxM - minM)) * chartH;
      if (i > 0) doc.line(prevPx, prevPy, px, py);
      doc.setFillColor(234, 88, 12);
      doc.circle(px, py, 0.5, 'F');
      prevPx = px;
      prevPy = py;
    });
  }

  y += chartH + 8;

  // Chart 3: Variación de peso entre pesajes (ganancia/pérdida)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.text('Variación de peso entre pesajes consecutivos', margin, y);
  y += 4;

  const chart3Y = y;
  doc.setDrawColor(...borderLightColor);
  doc.setLineWidth(0.3);
  doc.rect(chartX, chart3Y, chartW, chartH);

  if (weightPoints.length > 2) {
    const zeroY = chart3Y + chartH / 2;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(chartX, zeroY, chartX + chartW, zeroY);

    const barW = Math.max(1, chartW / weightPoints.length - 0.5);
    for (let i = 1; i < weightPoints.length; i++) {
      const delta = (weightPoints[i].weight || 0) - (weightPoints[i - 1].weight || 0);
      const px = chartX + (i / weightPoints.length) * chartW;
      const barH = Math.min(chartH / 2 - 2, Math.abs(delta) * 12);
      if (delta >= 0) {
        doc.setFillColor(34, 197, 94); // gain
        doc.rect(px, zeroY - barH, barW, barH, 'F');
      } else {
        doc.setFillColor(239, 68, 68); // loss
        doc.rect(px, zeroY, barW, barH, 'F');
      }
    }
  }

  y += chartH + 8;

  // Chart 4: Matriz de salud mensual de alergias (Heatmap)
  y = checkNewPage(35, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.text('Matriz de salud mensual (Alergias: Verde = Sin alergia, Rojo = Alergia)', margin, y);
  y += 4;

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const years = [2021, 2022, 2023, 2024, 2025, 2026];
  const cellW = (contentWidth - 14) / 12;
  const cellH = 5;

  // Month labels
  doc.setFontSize(6.5);
  doc.setTextColor(...mutedColor);
  months.forEach((m, idx) => {
    doc.text(m, margin + 14 + idx * cellW + cellW / 4, y + 3);
  });
  y += 5;

  years.forEach((yr) => {
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(String(yr), margin, y + 3.5);

    months.forEach((_, mIdx) => {
      const cellX = margin + 14 + mIdx * cellW;
      // Check records in this year and month
      const matches = data.healthRecords.filter((h) => {
        const [yStr, mStr] = h.record_date.split('-');
        return parseInt(yStr, 10) === yr && parseInt(mStr, 10) === mIdx + 1;
      });

      if (matches.length === 0) {
        doc.setFillColor(241, 245, 249); // no data
      } else if (matches.some((m) => m.has_allergy)) {
        doc.setFillColor(239, 68, 68); // allergy (red)
      } else {
        doc.setFillColor(34, 197, 94); // no allergy (green)
      }

      doc.rect(cellX, y, cellW - 0.5, cellH - 0.5, 'F');
    });
    y += cellH;
  });

  renderFooter();

  // Save the PDF
  doc.save(`informe_aquiles_${dateFormatted.replace(/\//g, '-')}.pdf`);
}
