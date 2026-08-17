import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import CycleNav from "./components/CycleNav";
import Diagnostico from "./pages/Diagnostico";
import Priorizacion from "./pages/Priorizacion";
import MatrizRiesgos from "./pages/MatrizRiesgos";
import DisenoReporte from "./pages/DisenoReporte";
import Trazabilidad from "./pages/Trazabilidad";
import Aseguramiento from "./pages/Aseguramiento";
import { useWorkflow } from "./context/WorkflowContext";

const PAGES = {
  1: Diagnostico,
  2: Priorizacion,
  3: MatrizRiesgos,
  4: DisenoReporte,
  5: Trazabilidad,
  6: Aseguramiento,
};

export default function App() {
  const { STEPS, step, setStep, canEnter, completed, fuentesCargadas, selectedIds, mark } = useWorkflow();
  const Page = PAGES[step];

  const nextDisabled =
    (step === 1 && !fuentesCargadas) ||
    (step === 2 && selectedIds.length === 0);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <small>FTTG · NIIF S1 / S2</small>
            <strong>Sistema de Aseguramiento</strong>
          </div>
        </div>
        <div className="pill">Terminal Terrestre de Guayaquil</div>
      </header>

      {step === 0 ? (
        <section className="hero">
          <h1>Sistema de Aseguramiento</h1>
          <p>
            El marco que la terminal necesita para anticipar riesgos ASG, dejar evidencia
            trazable y emitir una declaración de confiabilidad bajo los cuatro pilares de NIIF S1 y NIIF S2.
          </p>
          <CycleNav
            steps={STEPS}
            current={0}
            onSelect={setStep}
            canEnter={canEnter}
            completed={completed}
          />
          <div className="actions">
            <button className="btn btn-primary" type="button" onClick={() => setStep(1)}>
              <Play size={16} />
              Iniciar el ciclo
            </button>
          </div>
        </section>
      ) : (
        <>
          <CycleNav
            steps={STEPS}
            current={step}
            onSelect={setStep}
            canEnter={canEnter}
            completed={completed}
            compact
          />
          <Page />
          <div className="footer-nav">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setStep(step === 1 ? 0 : step - 1)}
            >
              <ArrowLeft size={16} />
              {step === 1 ? "Inicio" : "Anterior"}
            </button>
            {step < 6 ? (
              <button
                className="btn btn-primary"
                type="button"
                disabled={nextDisabled}
                onClick={() => {
                  mark(step);
                  setStep(step + 1);
                }}
              >
                Siguiente
                <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn btn-gold" type="button" onClick={() => setStep(0)}>
                Volver al ciclo
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
