import { useRef, useState } from "react";
import { FileUp, FolderOpen, Trash2, AlertCircle } from "lucide-react";
import StepShell from "../components/StepShell";
import Kpi from "../components/Kpi";
import { useWorkflow } from "../context/WorkflowContext";
import { estadoClass, estadoLabel, clasificarEstado, formatoPeso } from "../utils/helpers";

function TablaWord({ rows }) {
  if (!rows?.length) return null;
  const [header, ...body] = rows;
  const estadoIdx = header.findIndex((h) => /estado/i.test(h));
  return (
    <div className="table-wrap" style={{ margin: "12px 0" }}>
      <table className="data">
        <thead>
          <tr>
            {header.map((h, i) => <th key={`${h}-${i}`}>{h || `Columna ${i + 1}`}</th>)}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri}>
              {header.map((_, ci) => {
                const cell = row[ci] || "";
                if (ci === estadoIdx) {
                  const estado = clasificarEstado(cell);
                  if (estado) {
                    return (
                      <td key={ci}>
                        <span className={`semaforo ${estadoClass(estado)}`}>
                          <span className="dot" />
                          {cell || estadoLabel(estado)}
                        </span>
                      </td>
                    );
                  }
                }
                return <td key={ci}>{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Diagnostico() {
  const { diagnostico, wordFuentes, addWordFuentes, removeWordFuente, mark } = useWorkflow();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [abierto, setAbierto] = useState(null);

  const procesar = async (fileList) => {
    const files = [...fileList];
    if (!files.length) return;
    setError("");
    setLoading(true);
    try {
      const { parsearWord } = await import("../utils/word");
      const parsed = [];
      const errores = [];
      for (const file of files) {
        try {
          parsed.push(await parsearWord(file));
        } catch (err) {
          errores.push(err.message);
        }
      }
      if (parsed.length) {
        addWordFuentes(parsed);
        mark(1);
      }
      if (errores.length) setError(errores.join(" "));
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const conteo = diagnostico.pilares.reduce(
    (acc, p) => {
      acc[p.estado] += 1;
      return acc;
    },
    { cumple: 0, parcial: 0, ausente: 0 }
  );

  return (
    <StepShell
      kicker="Paso 01 · Dashboard"
      title="Diagnóstico"
      lead="Cargue fuentes Word (.docx). El dashboard resume el contraste con NIIF S1/S2."
      actions={
        <button className="btn btn-primary" type="button" onClick={() => inputRef.current?.click()} disabled={loading}>
          <FolderOpen size={16} />
          {loading ? "Leyendo Word…" : "Cargar Word"}
        </button>
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple
        hidden
        onChange={(e) => procesar(e.target.files)}
      />

      <div
        className={`dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          procesar(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <FileUp size={28} strokeWidth={1.6} />
        <strong>Arrastre archivos .docx</strong>
        <span>Diagnóstico, indicadores, política u otros informes internos.</span>
      </div>

      {error ? (
        <p className="error-banner">
          <AlertCircle size={16} />
          {error}
        </p>
      ) : null}

      {!wordFuentes.length ? null : (
        <>
          <div className="dash">
            <Kpi value={wordFuentes.length} label="fuentes Word" />
            <Kpi value={conteo.cumple} label="pilares en cumple" tone="ok" />
            <Kpi value={conteo.parcial} label="pilares parciales" tone="warn" />
            <Kpi value={conteo.ausente} label="pilares ausentes" tone="bad" />
          </div>

          <div className="grid grid-2" style={{ marginBottom: 16 }}>
            {wordFuentes.map((f) => (
              <article className="card fuente-card" key={f.id}>
                <div className="fuente-head">
                  <span className="tag">Word · {formatoPeso(f.size)}</span>
                  <button className="btn-icon" type="button" onClick={() => removeWordFuente(f.id)} aria-label="Quitar">
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3>{f.name}</h3>
                <p className="muted" style={{ margin: 0 }}>
                  {f.tables.length} tablas · {f.text.split(/\s+/).filter(Boolean).length} palabras
                </p>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAbierto(abierto === f.id ? null : f.id);
                  }}
                >
                  {abierto === f.id ? "Ocultar" : "Ver extracto"}
                </button>
                {abierto === f.id ? (
                  <div className="word-doc">
                    {f.tables.map((rows, i) => <TablaWord key={i} rows={rows} />)}
                    <div
                      className={`word-html ${f.tables.length ? "hide-tables" : ""}`}
                      dangerouslySetInnerHTML={{ __html: f.html }}
                    />
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <p className="group-title">Semáforo NIIF S1 / S2</p>
          <div className="grid grid-7">
            {diagnostico.pilares.map((p) => (
              <article className={`card dash-card ${p.estado}`} key={p.id}>
                <span className={`semaforo ${estadoClass(p.estado)}`}>
                  <span className="dot" />
                  {estadoLabel(p.estado)}
                </span>
                <h3>{p.nombre}</h3>
                <div className="meter"><i /></div>
              </article>
            ))}
          </div>

          <p className="group-title">Indicadores SGA</p>
          <div className="dash">
            {diagnostico.indicadores.slice(0, 4).map((i) => (
              <Kpi key={i.id} value={i.dato.split(" ")[0]} label={i.nombre} hint={i.frecuencia} />
            ))}
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Dato</th>
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

          <p className="group-title">Detalle por pilar</p>
          {diagnostico.secciones.map((s) => (
            <details className="accordion" key={s.id} style={{ marginBottom: 10 }}>
              <summary>{s.titulo}</summary>
              <div className="acc-body">
                <p className="clamp">{s.narrativa}</p>
                {s.tiene?.length || s.falta?.length ? (
                  <div className="split" style={{ marginTop: 10 }}>
                    {s.tiene?.length ? (
                      <div className="card ok">
                        <h4>Cumple ({s.tiene.length})</h4>
                        <ul className="list">
                          {s.tiene.map((t) => <li key={t}>{t}</li>)}
                        </ul>
                      </div>
                    ) : null}
                    {s.falta?.length ? (
                      <div className="card no">
                        <h4>Brecha ({s.falta.length})</h4>
                        <ul className="list">
                          {s.falta.map((t) => <li key={t}>{t}</li>)}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </details>
          ))}
        </>
      )}
    </StepShell>
  );
}
