import StepShell from "../components/StepShell";
import Kpi from "../components/Kpi";
import { useWorkflow } from "../context/WorkflowContext";
import { countByEje } from "../utils/helpers";

export default function Priorizacion() {
  const { factores, selectedIds, toggleFactor, setSelectedIds, mark, selectedFactores } = useWorkflow();
  const counts = countByEje(selectedFactores);
  const grupos = [...new Set(factores.map((f) => f.grupo))];

  const confirmar = () => mark(2);

  return (
    <StepShell
      kicker="Paso 02 · Dashboard"
      title="Priorización"
      lead="Seleccione los factores ASG que alimentan la matriz y el informe."
      actions={
        <button className="btn btn-primary" type="button" onClick={confirmar} disabled={!selectedIds.length}>
          Confirmar factores ({selectedIds.length})
        </button>
      }
    >
      <div className="dash">
        <Kpi value={selectedIds.length} label="factores priorizados" />
        <Kpi value={counts.E} label="ambientales (E)" tone="ok" />
        <Kpi value={counts.S} label="sociales (S)" />
        <Kpi value={counts.G} label="gobernanza (G)" />
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
                  <p className="clamp" style={{ margin: "4px 0 0" }}>{f.justificacion}</p>
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
