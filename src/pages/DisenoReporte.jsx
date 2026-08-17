import { Download } from "lucide-react";
import StepShell from "../components/StepShell";
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
      kicker="Paso 04"
      title="Diseño de reporte"
      lead="El informe se arma sobre los cuatro pilares de NIIF S1/S2 —gobernanza, estrategia, gestión de riesgos, métricas y metas— más alcance, juicios, presentación y transición."
      actions={
        <button className="btn btn-primary" type="button" onClick={exportar}>
          <Download size={16} />
          Generar informe PDF
        </button>
      }
    >
      <p className="card">{informe.declaracionReferencia}</p>

      <div className="grid grid-4" style={{ margin: "18px 0" }}>
        {informe.pilaresCore.map((p) => (
          <article className="card pilar-card" key={p.id}>
            <p className="num">{p.numero}</p>
            <h3>{p.nombre}</h3>
            <p>{p.pregunta}</p>
            <p className="muted">{p.referencias.join(" · ")}</p>
          </article>
        ))}
      </div>

      {informe.capitulos.map((cap) => (
        <article className="card" key={cap.id} style={{ marginTop: 12 }}>
          <p className="kicker">Capítulo {cap.numero}</p>
          <h3>{cap.titulo}</h3>
          {cap.puntos.map((p) => (
            <div key={p.titulo} style={{ marginTop: 12 }}>
              <strong>{p.titulo}</strong>
              <p className="muted" style={{ margin: "4px 0" }}>{p.norma}</p>
              <p style={{ margin: 0 }}>{p.contenido}</p>
            </div>
          ))}
        </article>
      ))}
    </StepShell>
  );
}
