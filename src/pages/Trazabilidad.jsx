import StepShell from "../components/StepShell";
import Kpi from "../components/Kpi";
import { useWorkflow } from "../context/WorkflowContext";

export default function Trazabilidad() {
  const { trazabilidad, evidenciasFiltradas, diagnostico, wordFuentes, mark } = useWorkflow();
  const fuentes = Object.fromEntries(diagnostico.fuentes.map((f) => [f.id, f]));
  const responsables = Object.fromEntries(trazabilidad.responsables.map((r) => [r.id, r]));
  const brechas = evidenciasFiltradas.filter((i) => i.estado.startsWith("Brecha")).length;
  const ok = evidenciasFiltradas.length - brechas;

  return (
    <StepShell
      kicker="Paso 05 · Dashboard"
      title="Trazabilidad"
      lead="Evidencia, fuente y responsable por indicador. Sin dueño, el dato no entra al aseguramiento."
      actions={
        <button className="btn btn-primary" type="button" onClick={() => mark(5)}>
          Registrar trazabilidad
        </button>
      }
    >
      <div className="dash">
        <Kpi value={evidenciasFiltradas.length} label="ítems de evidencia" />
        <Kpi value={ok} label="con respaldo" tone="ok" />
        <Kpi value={brechas} label="brechas" tone="bad" />
        <Kpi value={wordFuentes.length || diagnostico.fuentes.length} label="fuentes" />
      </div>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        {trazabilidad.responsables.map((r) => (
          <article className="card dash-card" key={r.id}>
            <span className="tag">{r.area}</span>
            <h3>{r.cargo}</h3>
            <p className="clamp" style={{ margin: 0 }}>{r.rol}</p>
          </article>
        ))}
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Indicador</th>
              <th>Dato</th>
              <th>Responsable</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {evidenciasFiltradas.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.indicador}</strong>
                  <div className="muted">{fuentes[item.fuenteId]?.documento}</div>
                </td>
                <td>{item.dato}</td>
                <td>{responsables[item.responsableId]?.cargo}</td>
                <td>
                  <span className={`tag ${item.estado.startsWith("Brecha") ? "tag-brecha" : "tag-ok"}`}>
                    {item.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StepShell>
  );
}
