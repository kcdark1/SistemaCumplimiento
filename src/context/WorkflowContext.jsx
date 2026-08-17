import { createContext, useContext, useMemo, useState } from "react";
import diagnostico from "../data/diagnostico.json";
import factores from "../data/factores.json";
import matriz from "../data/matriz.json";
import informe from "../data/informe.json";
import trazabilidad from "../data/trazabilidad.json";
import aseguramiento from "../data/aseguramiento.json";

const STEPS = [
  { id: 1, key: "diagnostico", title: "Diagnóstico", subtitle: "Fuentes de información" },
  { id: 2, key: "priorizacion", title: "Priorización", subtitle: "Factores ASG relevantes" },
  { id: 3, key: "matriz", title: "Matriz de riesgos", subtitle: "Semáforo probabilidad/impacto" },
  { id: 4, key: "reporte", title: "Diseño de reporte", subtitle: "4 pilares NIIF S1/S2" },
  { id: 5, key: "trazabilidad", title: "Trazabilidad", subtitle: "Evidencia y responsables" },
  { id: 6, key: "aseguramiento", title: "Aseguramiento", subtitle: "Declaración de confiabilidad", gold: true },
];

const WorkflowContext = createContext(null);

export function WorkflowProvider({ children }) {
  const defaults = factores.filter((f) => f.preseleccionado).map((f) => f.id);
  const [step, setStep] = useState(0);
  const [fuentesCargadas, setFuentesCargadas] = useState(false);
  const [selectedIds, setSelectedIds] = useState(defaults);
  const [completed, setCompleted] = useState(new Set());

  const mark = (id) =>
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  const toggleFactor = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const selectedFactores = useMemo(
    () => factores.filter((f) => selectedIds.includes(f.id)),
    [selectedIds]
  );

  const riesgosFiltrados = useMemo(
    () => matriz.riesgos.filter((r) => selectedIds.includes(r.factorId)),
    [selectedIds]
  );

  const oportunidadesFiltradas = useMemo(
    () => matriz.oportunidades.filter((o) => selectedIds.includes(o.factorId)),
    [selectedIds]
  );

  const evidenciasFiltradas = useMemo(() => {
    const ids = new Set(selectedIds);
    const linked = trazabilidad.items.filter((item) => ids.has(item.factorId));
    return linked.length ? linked : trazabilidad.items;
  }, [selectedIds]);

  const canEnter = (id) => {
    if (id <= 1) return true;
    if (id === 2) return fuentesCargadas || completed.has(1);
    if (id === 3) return selectedIds.length > 0 && (completed.has(2) || completed.has(1));
    return completed.has(id - 1) || id <= step;
  };

  const value = {
    STEPS,
    step,
    setStep,
    fuentesCargadas,
    setFuentesCargadas,
    selectedIds,
    setSelectedIds,
    toggleFactor,
    selectedFactores,
    completed,
    mark,
    canEnter,
    diagnostico,
    factores,
    matriz,
    informe,
    trazabilidad,
    aseguramiento,
    riesgosFiltrados,
    oportunidadesFiltradas,
    evidenciasFiltradas,
  };

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error("useWorkflow debe usarse dentro de WorkflowProvider");
  return ctx;
}
