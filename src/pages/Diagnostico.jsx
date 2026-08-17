import { FolderOpen } from "lucide-react";
import StepShell from "../components/StepShell";
import { useWorkflow } from "../context/WorkflowContext";
import { estadoClass, estadoLabel } from "../utils/helpers";

export default function Diagnostico() {
  const { diagnostico, fuentesCargadas, setFuentesCargadas, mark } = useWorkflow();

  const cargar = () => {
    setFuentesCargadas(true);
    mark(1);
  };

  return (
    <StepShell
      kicker="Paso 01"
      title="Diagnóstico"
      lead="Las fuentes de información internas de la FTTG se contrastan con NIIF S1 y NIIF S2. Este es el insumo que alimenta todo el ciclo."
      actions={
        <button className="btn btn-primary" type="button" onClick={cargar}>
          <FolderOpen size={16} />
          {fuentesCargadas ? "Fuentes cargadas" : "Cargar fuentes JSON"}
        </button>
      }
    >
      {!fuentesCargadas ? (
        <p className="muted">
          Pulse <strong>Cargar fuentes JSON</strong> para incorporar el diagnóstico embebido
          (Acciones DMARS 2025, rendición de cuentas, indicadores de mayo 2026, política ambiental y entrevista técnica).
        </p>
      ) : (
        <>
          <p className="muted" style={{ marginTop: 0 }}>
            {diagnostico.introduccion}
          </p>

          <div className="grid grid-2" style={{ margin: "18px 0" }}>
            {diagnostico.fuentes.map((f) => (
              <article className="card fuente-card" key={f.id}>
                <span className="tag">{f.tipo}</span>
                <h3>{f.documento}</h3>
                <p style={{ margin: 0 }}>{f.naturaleza}</p>
              </article>
            ))}
          </div>

          <h3 className="serif">Semáforo frente a NIIF S1 / S2</h3>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Pilar</th>
                  <th>Estado</th>
                  <th>Observación</th>
                </tr>
              </thead>
              <tbody>
                {diagnostico.pilares.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>
                      <span className={`semaforo ${estadoClass(p.estado)}`}>
                        <span className="dot" />
                        {estadoLabel(p.estado)}
                      </span>
                    </td>
                    <td>{p.observacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="card" style={{ marginTop: 16 }}>
            {diagnostico.sintesis}
          </p>

          {diagnostico.secciones.map((s) => (
            <article className="card" key={s.id} style={{ marginTop: 12 }}>
              <h3>{s.titulo}</h3>
              <p>{s.narrativa}</p>
              {s.hallazgo ? <p><strong>Hallazgo clave. </strong>{s.hallazgo}</p> : null}
              {s.tiene?.length || s.falta?.length ? (
                <div className="split">
                  {s.tiene?.length ? (
                    <div className="card ok">
                      <h4>Sí tiene / cumple</h4>
                      <ul className="list">
                        {s.tiene.map((t) => <li key={t}>{t}</li>)}
                      </ul>
                    </div>
                  ) : null}
                  {s.falta?.length ? (
                    <div className="card no">
                      <h4>No tiene / le falta</h4>
                      <ul className="list">
                        {s.falta.map((t) => <li key={t}>{t}</li>)}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          ))}

          <h3 className="serif" style={{ marginTop: 22 }}>Indicadores del SGA (mayo 2026)</h3>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Dato más reciente</th>
                  <th>Frecuencia</th>
                </tr>
              </thead>
              <tbody>
                {diagnostico.indicadores.map((i) => (
                  <tr key={i.id}>
                    <td>{i.nombre}</td>
                    <td>{i.dato}</td>
                    <td>{i.frecuencia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </StepShell>
  );
}
