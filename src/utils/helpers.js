export function estadoClass(estado) {
  if (estado === "cumple") return "estado-cumple";
  if (estado === "parcial") return "estado-parcial";
  return "estado-ausente";
}

export function estadoLabel(estado) {
  if (estado === "cumple") return "Cumple";
  if (estado === "parcial") return "Parcial";
  return "No cumple / Ausente";
}

export function nivelClass(nivel) {
  if (String(nivel || "").startsWith("Oportunidad")) return "nivel-Oportunidad";
  const raw = String(nivel || "").trim();
  const map = {
    Alta: "Alto",
    Media: "Medio",
    "Media-Alta": "Medio-Alto",
    "Baja-Media": "Bajo",
    Bajo: "Bajo",
    Medio: "Medio",
    "Medio-Alto": "Medio-Alto",
    Alto: "Alto",
  };
  return `nivel-${map[raw] || "Medio"}`;
}

export function countByEje(factores) {
  return factores.reduce(
    (acc, f) => {
      acc[f.eje] += 1;
      return acc;
    },
    { E: 0, S: 0, G: 0 }
  );
}

export function formatoPeso(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function clasificarEstado(texto) {
  const t = String(texto || "").toLowerCase();
  if (t.includes("parcial")) return "parcial";
  if (/(no cumple|ausente|no tiene)/.test(t)) return "ausente";
  if (/\bcumple\b/.test(t)) return "cumple";
  return null;
}
