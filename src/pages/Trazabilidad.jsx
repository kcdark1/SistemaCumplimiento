import StepShell from "../components/StepShell";
import { useWorkflow } from "../context/WorkflowContext";

export default function Trazabilidad() {
  const { trazabilidad, evidenciasFiltradas, diagnostico, mark } = useWorkflow();
  const fuentes = Object.fromEntries(diagnostico.fuentes.map((f) => [f.id, f]));
  const responsables = Object.fromEntries(trazabilidad.responsables.map((r) => [r.id, r]));

  return (
    <StepShell
      kicker="Paso 05"
      title="Trazabilidad"
      lead="Cada indicador material queda atado a una fuente, un responsable de elaboración y un revisor. Sin evidencia y sin dueño, el dato no entra al aseguramiento."
      actions={
        <button className="btn btn-primary" type="button" onClick={() => mark(5)}>
          Registrar trazabilidad
        </button>
      }
    >
      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        {trazabilidad.responsables.map((r) => (
          <article className="card" key={r.id}>
            <span className="tag">{r.area}</span>
            <h3>{r.cargo}</h3>
            <p style={{ margin: 0 }}>{r.rol}</p>
          </article>
        ))}
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Indicador</th>
              <th>Dato</th>
              <th>Fuente</th>
              <th>Responsable</th>
              <th>Revisor</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {evidenciasFiltradas.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.indicador}</strong>
                  <div className="muted">{item.notas}</div>
                </td>
                <td>{item.dato}</td>
                <td>{fuentes[item.fuenteId]?.documento}</td>
                <td>{responsables[item.responsableId]?.cargo}</td>
                <td>{responsables[item.revisorId]?.cargo}</td>
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
