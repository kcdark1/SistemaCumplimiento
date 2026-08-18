import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const GREEN = [0, 76, 33];
const GREEN_MID = [20, 151, 77];
const INK = [0, 76, 33];
const MUTED = [61, 107, 80];

const NIVEL_RGB = {
  Bajo: [215, 232, 184],
  Media: [243, 227, 154],
  Medio: [243, 227, 154],
  "Media-Alta": [240, 196, 138],
  "Medio-Alto": [240, 196, 138],
  Alta: [240, 178, 168],
  Alto: [240, 178, 168],
  "Baja-Media": [215, 232, 184],
  "Oportunidad Alta": [239, 231, 176],
  "Oportunidad Media-Alta": [239, 231, 176],
};

function header(doc, title, subtitle, gold = false) {
  const [r, g, b] = gold ? GREEN_MID : GREEN;
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(title, 14, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(subtitle, 14, 20);
  doc.setTextColor(...INK);
}

function footer(doc, label) {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`${label}  ·  FTTG  ·  NIIF S1 / NIIF S2`, 14, h - 8);
    doc.text(`${i} / ${pages}`, w - 18, h - 8, { align: "right" });
  }
}

function wrapList(doc, items, x, y, maxW) {
  let cursor = y;
  items.forEach((item) => {
    const lines = doc.splitTextToSize(`•  ${item}`, maxW);
    doc.text(lines, x, cursor);
    cursor += lines.length * 5 + 2;
  });
  return cursor;
}

export function descargarMatriz({ matriz, riesgos, oportunidades, factores }) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  header(
    doc,
    "MATRIZ DE RIESGOS Y OPORTUNIDADES",
    matriz.subtitulo
  );

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("1.  Matriz de riesgos", 14, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Factores ASG priorizados: ${factores.map((f) => f.nombre).join("; ")}`,
    14,
    44,
    { maxWidth: 270 }
  );

  autoTable(doc, {
    startY: 50,
    styles: { fontSize: 7.2, cellPadding: 2, valign: "top", textColor: INK },
    headStyles: { fillColor: GREEN, textColor: 255, fontStyle: "bold" },
    head: [[
      "Categoría / Tipo",
      "Riesgo específico de la FTTG",
      "Amenaza / Vulnerabilidad",
      "Plazo",
      "Probabilidad",
      "Nivel de riesgo",
      "Impacto",
    ]],
    body: riesgos.map((r) => [
      `${r.categoria} | ${r.tipo}`,
      r.descripcion,
      `Amenaza: ${r.amenaza}\nVulnerabilidad: ${r.vulnerabilidad}`,
      r.plazo,
      r.probabilidad,
      r.nivel,
      `${r.impacto}. ${r.efecto}`,
    ]),
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 70 },
      2: { cellWidth: 62 },
      3: { cellWidth: 28 },
      4: { cellWidth: 24 },
      5: { cellWidth: 26 },
      6: { cellWidth: 32 },
    },
    didParseCell: (data) => {
      if (data.section === "body" && (data.column.index === 4 || data.column.index === 5 || data.column.index === 6)) {
        const rgb = NIVEL_RGB[String(data.cell.raw).split(".")[0].trim()];
        if (rgb) data.cell.styles.fillColor = rgb;
      }
    },
  });

  let y = doc.lastAutoTable.finalY + 10;
  if (y > 170) {
    doc.addPage();
    header(doc, "MATRIZ DE RIESGOS Y OPORTUNIDADES", matriz.subtitulo);
    y = 38;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("2.  Matriz de oportunidades", 14, y);
  autoTable(doc, {
    startY: y + 4,
    styles: { fontSize: 8, cellPadding: 2.2, valign: "top", textColor: INK },
    headStyles: { fillColor: GREEN_MID, textColor: 255, fontStyle: "bold" },
    head: [["Categoría / Tipo", "Oportunidad específica de la FTTG", "Plazo", "Probabilidad", "Nivel", "Impacto"]],
    body: oportunidades.map((o) => [
      `${o.categoria} | ${o.tipo}`,
      o.descripcion,
      o.plazo,
      o.probabilidad,
      o.nivel,
      `${o.impacto}. ${o.efecto}`,
    ]),
  });

  y = doc.lastAutoTable.finalY + 12;
  if (y > 150) {
    doc.addPage();
    header(doc, "MATRIZ DE RIESGOS Y OPORTUNIDADES", matriz.subtitulo);
    y = 38;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("3.  Mapa de calor: probabilidad × impacto", 14, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "Cruce de las variables de probabilidad e impacto que determina el nivel de riesgo inherente de cada evento identificado.",
    14,
    y + 6,
    { maxWidth: 260 }
  );

  autoTable(doc, {
    startY: y + 12,
    styles: { fontSize: 9, halign: "center", valign: "middle", textColor: INK },
    headStyles: { fillColor: GREEN, textColor: 255 },
    head: [["Probabilidad \\ Impacto", ...matriz.heatmap.impactos]],
    body: matriz.heatmap.probabilidades.map((p, i) => [p, ...matriz.heatmap.celdas[i]]),
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index > 0) {
        const rgb = NIVEL_RGB[data.cell.raw];
        if (rgb) data.cell.styles.fillColor = rgb;
      }
    },
  });

  y = doc.lastAutoTable.finalY + 12;
  if (y > 155) {
    doc.addPage();
    header(doc, "MATRIZ DE RIESGOS Y OPORTUNIDADES", matriz.subtitulo);
    y = 38;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("4.  Guía de criterios de evaluación", 14, y);
  autoTable(doc, {
    startY: y + 4,
    styles: { fontSize: 8, cellPadding: 2, textColor: INK },
    headStyles: { fillColor: GREEN, textColor: 255 },
    head: [["Criterio", "Nivel", "Descripción"]],
    body: matriz.criterios.map((c) => [c.criterio, c.nivel, c.descripcion]),
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 1) {
        const rgb = NIVEL_RGB[data.cell.raw];
        if (rgb) data.cell.styles.fillColor = rgb;
      }
    },
  });

  footer(doc, "Matriz de riesgos y oportunidades climáticas");
  doc.save("Matriz_Riesgos_Oportunidades_FTTG.pdf");
}

export function descargarInforme({ informe, diagnostico, factores, riesgos }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();

  doc.setFillColor(...GREEN);
  doc.rect(0, 0, w, 297, "F");
  doc.setFillColor(247, 251, 254);
  doc.rect(0, 168, w, 129, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("FTTG  ·  SISTEMA DE ASEGURAMIENTO", 20, 36);
  doc.setFont("times", "bold");
  doc.setFontSize(28);
  const title = doc.splitTextToSize(informe.titulo, 170);
  doc.text(title, 20, 58);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(informe.subtitulo, 20, 86, { maxWidth: 170 });
  doc.text(informe.caso, 20, 102, { maxWidth: 170 });
  doc.setFontSize(10);
  doc.text(`Periodo ${diagnostico.entidad.periodo}`, 20, 120);
  doc.setTextColor(...INK);
  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.text(informe.declaracionReferencia, 20, 186, { maxWidth: 170 });

  informe.capitulos.forEach((cap) => {
    doc.addPage();
    header(doc, `Informe de sostenibilidad  ·  Capítulo ${cap.numero}`, cap.titulo);
    let y = 40;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${cap.numero}.  ${cap.titulo}`, 14, y);
    y += 10;

    if (cap.id === "estrategia") {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(
        `Factores ASG priorizados en este ciclo: ${factores.map((f) => f.nombre).join("; ")}.`,
        14,
        y,
        { maxWidth: 182 }
      );
      y += 12;
    }

    cap.puntos.forEach((p) => {
      if (y > 250) {
        doc.addPage();
        header(doc, `Informe de sostenibilidad  ·  Capítulo ${cap.numero}`, cap.titulo);
        y = 40;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...GREEN);
      doc.text(p.titulo, 14, y);
      y += 5;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(p.norma, 14, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...INK);
      const lines = doc.splitTextToSize(p.contenido, 182);
      doc.text(lines, 14, y);
      y += lines.length * 5 + 7;
    });

    if (cap.id === "metricas") {
      if (y > 210) {
        doc.addPage();
        header(doc, "Informe de sostenibilidad  ·  Capítulo 4", "Métricas y objetivos");
        y = 40;
      }
      autoTable(doc, {
        startY: y,
        styles: { fontSize: 8, textColor: INK },
        headStyles: { fillColor: GREEN, textColor: 255 },
        head: [["Indicador", "Dato más reciente", "Frecuencia"]],
        body: diagnostico.indicadores.map((i) => [i.nombre, i.dato, i.frecuencia]),
      });
    }

    if (cap.id === "riesgo") {
      if (y > 220) {
        doc.addPage();
        header(doc, "Informe de sostenibilidad  ·  Capítulo 3", cap.titulo);
        y = 40;
      }
      autoTable(doc, {
        startY: y,
        styles: { fontSize: 7.4, textColor: INK },
        headStyles: { fillColor: GREEN, textColor: 255 },
        head: [["Categoría", "Riesgo", "Prob.", "Nivel", "Impacto"]],
        body: riesgos.map((r) => [r.categoria, r.descripcion, r.probabilidad, r.nivel, r.impacto]),
      });
    }
  });

  doc.addPage();
  header(doc, "Informe de sostenibilidad", "Conclusiones del diagnóstico");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Conclusiones", 14, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let y = 50;
  diagnostico.conclusiones.forEach((c, i) => {
    const lines = doc.splitTextToSize(`${i + 1}.  ${c}`, 182);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 4;
  });
  doc.setFont("helvetica", "bold");
  doc.text("Recomendaciones de priorización", 14, y + 4);
  y += 12;
  doc.setFont("helvetica", "normal");
  diagnostico.recomendaciones.forEach((c, i) => {
    const lines = doc.splitTextToSize(`${i + 1}.  ${c}`, 182);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 3;
  });

  footer(doc, "Informe de sostenibilidad FTTG");
  doc.save("Informe_Sostenibilidad_NIIF_S1_S2_FTTG.pdf");
}

export function descargarAseguramiento({ aseguramiento, diagnostico, factores, evidencias, completedCount }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();

  doc.setFillColor(...GREEN_MID);
  doc.rect(0, 0, w, 36, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(aseguramiento.titulo.toUpperCase(), 14, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(aseguramiento.tipo, 14, 24);
  doc.text(aseguramiento.marco, 14, 30);

  doc.setTextColor(...INK);
  let y = 48;
  const block = (label, text) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...GREEN_MID);
    doc.text(label, 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    const lines = doc.splitTextToSize(text, 182);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 7;
  };

  block("Destinatario", aseguramiento.destinatario);
  block("Periodo cubierto", aseguramiento.periodo);
  block("Alcance", aseguramiento.alcance);
  block(
    "Resumen del ciclo",
    `Pasos completados: ${completedCount}/6. Factores ASG priorizados: ${factores.length}. Ítems de evidencia con responsable: ${evidencias.length}. Pilares contrastados: ${diagnostico.pilares.length}.`
  );

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GREEN_MID);
  doc.text("Criterios aplicados", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...INK);
  y = wrapList(doc, aseguramiento.criterios, 14, y, 182);

  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GREEN_MID);
  doc.text("Trabajo realizado", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...INK);
  y = wrapList(doc, aseguramiento.trabajoRealizado, 14, y, 182);

  doc.addPage();
  header(doc, aseguramiento.titulo, "Limitaciones, conclusión y firmas", true);
  y = 42;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GREEN_MID);
  doc.text("Limitaciones", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...INK);
  y = wrapList(doc, aseguramiento.limitaciones, 14, y, 182);

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GREEN_MID);
  doc.text("Conclusión", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...INK);
  const concl = doc.splitTextToSize(aseguramiento.conclusion, 182);
  doc.text(concl, 14, y);
  y += concl.length * 5 + 10;

  doc.setFont("times", "italic");
  doc.setFontSize(12);
  const cierre = doc.splitTextToSize(aseguramiento.cierre, 182);
  doc.text(cierre, 14, y);
  y += cierre.length * 6 + 16;

  autoTable(doc, {
    startY: y,
    styles: { fontSize: 9, textColor: INK },
    headStyles: { fillColor: GREEN_MID, textColor: 255 },
    head: [["Rol", "Nombre", "Entidad"]],
    body: aseguramiento.firmas.map((f) => [f.rol, f.nombre, f.entidad]),
  });

  footer(doc, "Declaración de confiabilidad");
  doc.save("Declaracion_Confiabilidad_FTTG.pdf");
}
