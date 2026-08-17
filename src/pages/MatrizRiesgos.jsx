import { Download } from "lucide-react";
import StepShell from "../components/StepShell";
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

  return (
    <StepShell
      kicker="Paso 03"
      title="Matriz de riesgos"
      lead="Semáforo de probabilidad e impacto según el formato de la matriz FTTG: riesgos, oportunidades, mapa de calor y guía de criterios."
      actions={
        <button className="btn btn-primary" type="button" onClick={exportar} disabled={!riesgosFiltrados.length}>
          <Download size={16} />
          Descargar matriz PDF
        </button>
      }
    >
      <div className="legend">
        {matriz.leyenda.map((n) => (
          <span className="chip" key={n}>
            <span className={`heat ${nivelClass(n)}`} style={{ minHeight: 18, width: 18, borderRadius: 4 }} />
            {n}
          </span>
        ))}
      </div>

      <h3 className="serif">1. Matriz de riesgos</h3>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Categoría / Tipo</th>
              <th>Riesgo / oportunidad</th>
              <th>Amenaza / Vulnerabilidad</th>
              <th>Plazo</th>
              <th>Probabilidad</th>
              <th>Nivel</th>
              <th>Impacto</th>
            </tr>
          </thead>
          <tbody>
            {riesgosFiltrados.map((r) => (
              <tr key={r.id}>
                <td>{r.categoria} | {r.tipo}</td>
                <td>{r.descripcion}</td>
                <td>
                  <strong>Amenaza:</strong> {r.amenaza}<br />
                  <strong>Vulnerabilidad:</strong> {r.vulnerabilidad}
                </td>
                <td>{r.plazo}</td>
                <td><span className={`heat ${nivelClass(r.probabilidad)}`} style={{ minHeight: 32, padding: 6 }}>{r.probabilidad}</span></td>
                <td><span className={`heat ${nivelClass(r.nivel)}`} style={{ minHeight: 32, padding: 6 }}>{r.nivel}</span></td>
                <td>{r.impacto}. {r.efecto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="serif" style={{ marginTop: 22 }}>2. Matriz de oportunidades</h3>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Categoría / Tipo</th>
              <th>Oportunidad</th>
              <th>Plazo</th>
              <th>Probabilidad</th>
              <th>Nivel</th>
              <th>Impacto</th>
            </tr>
          </thead>
          <tbody>
            {oportunidadesFiltradas.map((o) => (
              <tr key={o.id}>
                <td>{o.categoria} | {o.tipo}</td>
                <td>{o.descripcion}</td>
                <td>{o.plazo}</td>
                <td>{o.probabilidad}</td>
                <td><span className={`heat nivel-Oportunidad`} style={{ minHeight: 32, padding: 6 }}>{o.nivel}</span></td>
                <td>{o.impacto}. {o.efecto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="serif" style={{ marginTop: 22 }}>3. Mapa de calor: probabilidad × impacto</h3>
      <p className="muted">Cruce que determina el nivel de riesgo inherente de cada evento identificado.</p>
      <div className="heatmap">
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

      <h3 className="serif" style={{ marginTop: 22 }}>4. Guía de criterios de evaluación</h3>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Criterio</th>
              <th>Nivel</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {matriz.criterios.map((c) => (
              <tr key={`${c.criterio}-${c.nivel}`}>
                <td>{c.criterio}</td>
                <td><span className={`heat ${nivelClass(c.nivel)}`} style={{ minHeight: 28, padding: 6 }}>{c.nivel}</span></td>
                <td>{c.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StepShell>
  );
}
