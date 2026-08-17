import StepShell from "../components/StepShell";
import { useWorkflow } from "../context/WorkflowContext";
import { countByEje } from "../utils/helpers";

export default function Priorizacion() {
  const { factores, selectedIds, toggleFactor, setSelectedIds, mark, selectedFactores } = useWorkflow();
  const counts = countByEje(selectedFactores);
  const grupos = [...new Set(factores.map((f) => f.grupo))];

  const confirmar = () => mark(2);

  return (
    <StepShell
      kicker="Paso 02"
      title="Priorización"
      lead="De las fuentes cargadas se seleccionan los factores ambientales, sociales y de gobernanza (ASG) relevantes para la FTTG. Esa selección alimenta la matriz y el informe."
      actions={
        <button className="btn btn-primary" type="button" onClick={confirmar} disabled={!selectedIds.length}>
          Confirmar factores ({selectedIds.length})
        </button>
      }
    >
      <div className="stats">
        <div className="stat"><b>{selectedIds.length}</b><span>factores priorizados</span></div>
        <div className="stat"><b>{counts.E}</b><span>ambientales (E)</span></div>
        <div className="stat"><b>{counts.S}</b><span>sociales (S)</span></div>
        <div className="stat"><b>{counts.G}</b><span>gobernanza (G)</span></div>
      </div>

      <div className="actions" style={{ justifyContent: "flex-start", marginBottom: 8 }}>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => setSelectedIds(factores.filter((f) => f.preseleccionado).map((f) => f.id))}
        >
          Restaurar materialidad del diagnóstico
        </button>
        <button className="btn btn-ghost" type="button" onClick={() => setSelectedIds(factores.map((f) => f.id))}>
          Seleccionar todos
        </button>
      </div>

      {grupos.map((grupo) => (
        <div key={grupo}>
          <p className="group-title">{grupo}</p>
          <div className="grid">
            {factores.filter((f) => f.grupo === grupo).map((f) => (
              <label className="card factor" key={f.id}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(f.id)}
                  onChange={() => toggleFactor(f.id)}
                />
                <div>
                  <h3>{f.nombre}</h3>
                  <p style={{ margin: "4px 0 0" }}>{f.justificacion}</p>
                  <p className="muted" style={{ margin: "8px 0 0" }}>
                    NIIF {f.niif} · Pilar {f.pilar}
                  </p>
                </div>
                <span className={`eje eje-${f.eje}`}>{f.eje}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </StepShell>
  );
}
