import { Download } from "lucide-react";
import StepShell from "../components/StepShell";
import Kpi from "../components/Kpi";
import { useWorkflow } from "../context/WorkflowContext";
import { nivelClass } from "../utils/helpers";

export default function MatrizRiesgos() {
  const { matriz, riesgosFiltrados, oportunidadesFiltradas, selectedFactores, mark } = useWorkflow();

  const exportar = async () => {
    const { descargarMatriz } = await import("../utils/pdf");
    descargarMatriz({
      matriz,
      riesgos: riesgosFiltrados,
      oportunidades: oportunidadesFiltradas,
      factores: selectedFactores,
    });
    mark(3);
  };

  const niveles = riesgosFiltrados.reduce((acc, r) => {
    acc[r.nivel] = (acc[r.nivel] || 0) + 1;
    return acc;
  }, {});

  return (
    <StepShell
      kicker="Paso 03 · Dashboard"
      title="Matriz de riesgos"
      lead="Semáforo probabilidad × impacto. El dashboard prioriza lo crítico; el PDF conserva el formato completo."
      actions={
        <button className="btn btn-primary" type="button" onClick={exportar} disabled={!riesgosFiltrados.length}>
          <Download size={16} />
          Descargar PDF
        </button>
      }
    >
      <div className="dash">
        <Kpi value={riesgosFiltrados.length} label="riesgos" />
        <Kpi value={niveles.Alto || 0} label="nivel alto" tone="bad" />
        <Kpi value={niveles["Medio-Alto"] || 0} label="medio-alto" tone="warn" />
        <Kpi value={oportunidadesFiltradas.length} label="oportunidades" tone="ok" />
      </div>

      <div className="legend">
        {matriz.leyenda.map((n) => (
          <span className="chip" key={n}>
            <span className={`heat ${nivelClass(n)}`} style={{ minHeight: 18, width: 18, borderRadius: 4 }} />
            {n}
          </span>
        ))}
      </div>

      <div className="grid grid-2">
        <article className="card">
          <h3>Mapa de calor</h3>
          <div className="heatmap" style={{ marginTop: 10 }}>
            <div />
            {matriz.heatmap.impactos.map((i) => (
              <div key={i} className="muted" style={{ textAlign: "center", fontWeight: 800 }}>{i}</div>
            ))}
            {matriz.heatmap.probabilidades.flatMap((p, ri) => [
              <div key={`p-${p}`} className="muted" style={{ fontWeight: 800, display: "grid", alignItems: "center" }}>{p}</div>,
              ...matriz.heatmap.celdas[ri].map((c, ci) => (
                <div key={`${p}-${ci}`} className={`heat ${nivelClass(c)}`}>{c}</div>
              )),
            ])}
          </div>
        </article>
        <article className="card">
          <h3>Riesgos priorizados</h3>
          {riesgosFiltrados.map((r) => (
            <div className="check-item" key={r.id}>
              <span className={`heat ${nivelClass(r.nivel)}`} style={{ minHeight: 10, width: 10, padding: 0 }} />
              <div>
                <strong>{r.categoria} · {r.tipo}</strong>
                <p className="clamp" style={{ margin: "4px 0 0" }}>{r.descripcion}</p>
              </div>
            </div>
          ))}
        </article>
      </div>

      <details className="accordion" style={{ marginTop: 14 }}>
        <summary>Tabla completa y criterios</summary>
        <div className="acc-body">
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Riesgo</th>
                  <th>Plazo</th>
                  <th>Prob.</th>
                  <th>Nivel</th>
                </tr>
              </thead>
              <tbody>
                {riesgosFiltrados.map((r) => (
                  <tr key={r.id}>
                    <td>{r.categoria} | {r.tipo}</td>
                    <td>{r.descripcion}</td>
                    <td>{r.plazo}</td>
                    <td><span className={`heat ${nivelClass(r.probabilidad)}`} style={{ minHeight: 28, padding: 6 }}>{r.probabilidad}</span></td>
                    <td><span className={`heat ${nivelClass(r.nivel)}`} style={{ minHeight: 28, padding: 6 }}>{r.nivel}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="group-title">Oportunidades</p>
          {oportunidadesFiltradas.map((o) => (
            <p key={o.id} className="muted"><strong>{o.tipo}.</strong> {o.descripcion}</p>
          ))}
        </div>
      </details>
    </StepShell>
  );
}
