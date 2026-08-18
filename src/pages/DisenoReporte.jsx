import { Download } from "lucide-react";
import StepShell from "../components/StepShell";
import Kpi from "../components/Kpi";
import { useWorkflow } from "../context/WorkflowContext";

export default function DisenoReporte() {
  const { informe, diagnostico, selectedFactores, riesgosFiltrados, mark } = useWorkflow();

  const exportar = async () => {
    const { descargarInforme } = await import("../utils/pdf");
    descargarInforme({
      informe,
      diagnostico,
      factores: selectedFactores,
      riesgos: riesgosFiltrados,
    });
    mark(4);
  };

  return (
    <StepShell
      kicker="Paso 04 · Dashboard"
      title="Diseño de reporte"
      lead="Cuatro pilares NIIF S1/S2. El detalle va al PDF; aquí solo el tablero de estructura."
      actions={
        <button className="btn btn-primary" type="button" onClick={exportar}>
          <Download size={16} />
          Generar PDF
        </button>
      }
    >
      <div className="dash">
        <Kpi value="4" label="pilares core" />
        <Kpi value={informe.capitulos.length} label="capítulos" />
        <Kpi value={selectedFactores.length} label="factores ASG" tone="ok" />
        <Kpi value={riesgosFiltrados.length} label="riesgos en informe" tone="warn" />
      </div>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        {informe.pilaresCore.map((p) => (
          <article className="card pilar-card dash-card" key={p.id}>
            <p className="num">{p.numero}</p>
            <h3>{p.nombre}</h3>
            <p className="clamp">{p.pregunta}</p>
            <span className="tag">{p.referencias[0]}</span>
          </article>
        ))}
      </div>

      {informe.capitulos.map((cap) => (
        <details className="accordion" key={cap.id} style={{ marginBottom: 10 }}>
          <summary>Cap. {cap.numero} · {cap.titulo}</summary>
          <div className="acc-body">
            {cap.puntos.map((p) => (
              <div className="check-item" key={p.titulo}>
                <span className="check-dot" />
                <div>
                  <strong>{p.titulo}</strong>
                  <p className="muted" style={{ margin: "2px 0 0" }}>{p.norma}</p>
                </div>
              </div>
            ))}
          </div>
        </details>
      ))}
    </StepShell>
  );
}
