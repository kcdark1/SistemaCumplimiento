import {
  ClipboardCheck,
  Lightbulb,
  Puzzle,
  FileText,
  TrendingUp,
  Cog,
} from "lucide-react";

const ICONS = [ClipboardCheck, Lightbulb, Puzzle, FileText, TrendingUp, Cog];
const HEIGHTS = [92, 128, 164, 204, 248, 292];

export default function CycleNav({ steps, current, onSelect, canEnter, completed, compact }) {
  return (
    <div className="cycle" role="navigation" aria-label="Ciclo de aseguramiento">
      {steps.map((s, i) => {
        const Icon = ICONS[i];
        const locked = !canEnter(s.id);
        const active = current === s.id;
        const done = completed.has(s.id);
        return (
          <button
            key={s.id}
            className={`cycle-step ${s.gold ? "gold" : ""} ${active ? "active" : ""} ${locked ? "locked" : ""} ${done ? "done" : ""}`}
            onClick={() => !locked && onSelect(s.id)}
            disabled={locked}
            type="button"
          >
            <div className="icon-wrap">
              <Icon size={compact ? 20 : 24} strokeWidth={1.7} />
            </div>
            <h3>{s.title}</h3>
            <p>{s.subtitle}</p>
            <div
              className="bar"
              style={{ height: compact ? HEIGHTS[i] * 0.42 : HEIGHTS[i] }}
            >
              {String(s.id).padStart(2, "0")}
            </div>
          </button>
        );
      })}
    </div>
  );
}
