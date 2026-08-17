export default function StepShell({ kicker, title, lead, actions, children }) {
  return (
    <section className="panel">
      <div className="step-head">
        <div>
          <p className="kicker">{kicker}</p>
          <h2>{title}</h2>
          {lead ? <p className="lead">{lead}</p> : null}
        </div>
        {actions ? <div className="actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
