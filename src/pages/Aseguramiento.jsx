import { Download, BadgeCheck } from "lucide-react";
import StepShell from "../components/StepShell";
import Kpi from "../components/Kpi";
import { useWorkflow } from "../context/WorkflowContext";

export default function Aseguramiento() {
  const {
    aseguramiento,
    diagnostico,
    selectedFactores,
    evidenciasFiltradas,
    completed,
    mark,
  } = useWorkflow();

  const exportar = async () => {
    const { descargarAseguramiento } = await import("../utils/pdf");
    descargarAseguramiento({
      aseguramiento,
      diagnostico,
      factores: selectedFactores,
      evidencias: evidenciasFiltradas,
      completedCount: completed.size,
    });
    mark(6);
  };

  return (
    <StepShell
      kicker="Paso 06 · Dashboard"
      title="Aseguramiento"
      lead="Declaración de confiabilidad del ciclo. Referencia a NIIF S1/S2, no conformidad plena."
      actions={
        <button className="btn btn-gold" type="button" onClick={exportar}>
          <Download size={16} />
          Emitir PDF
        </button>
      }
    >
      <div className="seal">
        <BadgeCheck size={40} strokeWidth={1.5} />
      </div>

      <div className="dash">
        <Kpi value={`${completed.size}/6`} label="pasos del ciclo" />
        <Kpi value={selectedFactores.length} label="factores ASG" tone="ok" />
        <Kpi value={evidenciasFiltradas.length} label="evidencias" />
        <Kpi value={aseguramiento.limitaciones.length} label="limitaciones" tone="warn" />
      </div>

      <div className="grid grid-3" style={{ marginBottom: 14 }}>
        <article className="card dash-card">
          <span className="tag">Tipo</span>
          <h3>Aseguramiento limitado</h3>
          <p className="clamp" style={{ margin: 0 }}>{aseguramiento.marco}</p>
        </article>
        <article className="card dash-card">
          <span className="tag">Periodo</span>
          <h3>2025–2026</h3>
          <p className="clamp" style={{ margin: 0 }}>{aseguramiento.periodo}</p>
        </article>
        <article className="card dash-card">
          <span className="tag">Destinatario</span>
          <h3>Gerencia y DMARS</h3>
          <p className="clamp" style={{ margin: 0 }}>{aseguramiento.destinatario}</p>
        </article>
      </div>

      <div className="grid grid-2">
        <article className="card">
          <h3>Criterios</h3>
          {aseguramiento.criterios.map((c) => (
            <div className="check-item" key={c}>
              <span className="check-dot" />
              <span>{c}</span>
            </div>
          ))}
        </article>
        <article className="card">
          <h3>Trabajo realizado</h3>
          {aseguramiento.trabajoRealizado.map((c) => (
            <div className="check-item" key={c}>
              <span className="check-dot" />
              <span>{c}</span>
            </div>
          ))}
        </article>
      </div>

      <details className="accordion" style={{ marginTop: 14 }}>
        <summary>Limitaciones y conclusión</summary>
        <div className="acc-body">
          <ul className="list">
            {aseguramiento.limitaciones.map((c) => <li key={c}>{c}</li>)}
          </ul>
          <p>{aseguramiento.conclusion}</p>
        </div>
      </details>

      <div className="grid grid-3" style={{ marginTop: 14 }}>
        {aseguramiento.firmas.map((f) => (
          <article className="card" key={f.rol}>
            <p className="muted">{f.rol}</p>
            <h3>{f.nombre}</h3>
            <p style={{ margin: 0 }}>{f.entidad}</p>
          </article>
        ))}
      </div>
    </StepShell>
  );
}
