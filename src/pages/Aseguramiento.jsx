import { Download, BadgeCheck } from "lucide-react";
import StepShell from "../components/StepShell";
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
      kicker="Paso 06"
      title="Aseguramiento"
      lead="Cierre del ciclo: una declaración de confiabilidad sobre el proceso, las fuentes y las limitaciones — no una conformidad plena con NIIF S1/S2."
      actions={
        <button className="btn btn-gold" type="button" onClick={exportar}>
          <Download size={16} />
          Emitir declaración PDF
        </button>
      }
    >
      <div className="seal">
        <BadgeCheck size={48} strokeWidth={1.5} />
      </div>
      <p className="quote">{aseguramiento.cierre}</p>

      <article className="card">
        <p className="kicker">{aseguramiento.tipo}</p>
        <h3>{aseguramiento.titulo}</h3>
        <p>{aseguramiento.marco}</p>
        <p><strong>Destinatario. </strong>{aseguramiento.destinatario}</p>
        <p><strong>Periodo. </strong>{aseguramiento.periodo}</p>
        <p><strong>Alcance. </strong>{aseguramiento.alcance}</p>
      </article>

      <div className="grid grid-2" style={{ marginTop: 14 }}>
        <article className="card">
          <h3>Criterios aplicados</h3>
          <ul className="list">
            {aseguramiento.criterios.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </article>
        <article className="card">
          <h3>Trabajo realizado</h3>
          <ul className="list">
            {aseguramiento.trabajoRealizado.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </article>
      </div>

      <article className="card" style={{ marginTop: 14 }}>
        <h3>Limitaciones</h3>
        <ul className="list">
          {aseguramiento.limitaciones.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </article>

      <article className="card" style={{ marginTop: 14, background: "#fbf8e8" }}>
        <h3>Conclusión</h3>
        <p>{aseguramiento.conclusion}</p>
      </article>

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
