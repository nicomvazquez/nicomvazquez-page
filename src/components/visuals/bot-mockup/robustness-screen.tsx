import {
  ChevronDown,
  Dices,
  History,
  Info,
  LayoutGrid,
  ListChecks,
  Play,
  Shield,
  SlidersHorizontal,
  Table,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/components/ui/primitives";
import { buildRobustness, currentPoint, riskPcts, rsiPeriods } from "./data";
import { AppWindow, Card, CardHeader, IconRail, Label } from "./shell";

const tabs = [
  { label: "Overview", Icon: LayoutGrid },
  { label: "Equity", Icon: TrendingUp },
  { label: "Trades", Icon: Table },
  { label: "Risk", Icon: Shield },
  { label: "Monte Carlo", Icon: Dices },
  { label: "Robustness", Icon: SlidersHorizontal },
  { label: "Validation", Icon: ListChecks },
  { label: "Stress Test", Icon: TriangleAlert },
  { label: "History", Icon: History },
];

const metricTabs = ["Retorno total (%)", "Sharpe", "Sortino", "Drawdown máx. (%)", "Profit factor", "Expectativa (USD)"];

const pct = (v: number, d = 1) => `${v > 0 ? "+" : v < 0 ? "-" : ""}${Math.abs(v).toFixed(d)}%`;

/* ---------- Campo de formulario (estilo outlined de la app) ---------- */
function Field({ label, value, select }: { label: string; value: string; select?: boolean }) {
  return (
    <div className="relative min-w-0 rounded-[4px] border border-[#c9ced8] bg-app-surface px-1.5 pt-[3px] pb-1">
      <p className="truncate text-[7px] text-app-muted">{label}</p>
      <p className={cn("truncate text-[9px] text-app-ink", select && "pr-3")}>{value}</p>
      {select ? <ChevronDown className="absolute top-1/2 right-1 size-2.5 -translate-y-1/2 text-app-muted" /> : null}
    </div>
  );
}

/* ---------- Tarjeta de métrica de robustez ---------- */
function Metric({ label, value, sub, valueClass, className }: { label: string; value: string; sub?: string; valueClass?: string; className?: string }) {
  return (
    <Card className={cn("flex flex-col px-2 py-1.5", className)}>
      <Label className="flex min-h-[20px] items-start justify-between gap-1 text-[7px]">
        <span>{label}</span>
        <Info className="size-2 shrink-0 text-[#b6bbc6]" aria-hidden />
      </Label>
      <p className={cn("tnum mt-0.5 text-[13px] font-semibold leading-tight text-app-ink", valueClass)}>{value}</p>
      {sub ? <p className="tnum mt-px text-[7.5px] text-app-muted">{sub}</p> : null}
    </Card>
  );
}

/* ---------- Heatmap: rojo = mal, gris = neutro, azul = bien ---------- */
// Paradas tomadas de la captura original de la app.
const blueStops: [number, [number, number, number]][] = [
  [0, [0xd7, 0xe0, 0xe9]],
  [0.3, [0xb0, 0xc8, 0xe5]],
  [0.75, [0x58, 0x93, 0xdb]],
  [1, [0x2a, 0x78, 0xd6]],
];

function lerpStops(t: number) {
  for (let k = 1; k < blueStops.length; k++) {
    const [t1, c1] = blueStops[k];
    const [t0, c0] = blueStops[k - 1];
    if (t <= t1) {
      const u = (t - t0) / (t1 - t0);
      return c0.map((c, i) => Math.round(c + (c1[i] - c) * u));
    }
  }
  return blueStops[blueStops.length - 1][1];
}

function cellStyle(v: number, max: number) {
  if (v < 0) {
    const a = Math.min(1, Math.abs(v) / 1.2);
    const c = [0xee - a * 10, 0xdb - a * 30, 0xd8 - a * 30].map(Math.round);
    return { background: `rgb(${c.join(",")})`, color: "#14161A" };
  }
  const t = Math.min(1, v / max);
  return { background: `rgb(${lerpStops(t).join(",")})`, color: t > 0.62 ? "#FFFFFF" : "#14161A" };
}

function Heatmap({ grid, max }: { grid: number[][]; max: number }) {
  const rows = [...grid.keys()].reverse(); // risk_pct de mayor a menor, como en la app
  return (
    <div className="mt-2 flex gap-1">
      <div className="flex w-2.5 items-center justify-center">
        <span className="-rotate-90 whitespace-nowrap text-[7px] text-app-muted">risk_pct</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="grid grid-cols-[20px_repeat(7,minmax(0,1fr))] gap-px">
          {rows.map((j) => (
            <div key={j} className="contents">
              <span className="tnum self-center pr-1 text-right text-[7.5px] text-app-ink-2">{riskPcts[j].toFixed(1)}</span>
              {grid[j].map((v, i) => {
                const isCurrent = i === currentPoint.i && j === currentPoint.j;
                return (
                  <span
                    key={i}
                    style={cellStyle(v, max)}
                    className={cn(
                      "tnum flex h-[16px] items-center justify-center text-[7.5px] sm:h-[17px]",
                      isCurrent && "outline-2 outline-offset-[-2px] outline-app-ink",
                    )}
                  >
                    {v.toFixed(2)}
                  </span>
                );
              })}
            </div>
          ))}
          <span />
          {rsiPeriods.map((p) => (
            <span key={p} className="tnum pt-0.5 text-center text-[7.5px] text-app-ink-2">
              {p}
            </span>
          ))}
        </div>
        <p className="text-center text-[7px] text-app-muted">rsi_period</p>
      </div>
    </div>
  );
}

/* ---------- Pantalla Backtesting → Robustness ---------- */
export function RobustnessScreen({ className }: { className?: string }) {
  const r = buildRobustness();
  const combos = rsiPeriods.length * riskPcts.length;

  return (
    <AppWindow url="localhost:8080 / backtesting" className={className}>
      <div className="flex">
        <IconRail active="Backtesting" />
        <div className="min-w-0 flex-1 p-2.5 sm:p-3" aria-hidden>
          {/* módulos del backtester */}
          <div className="flex gap-0.5 overflow-hidden border-b border-app-line [mask-image:linear-gradient(to_right,black_88%,transparent)]">
            {tabs.map(({ label, Icon }) => (
              <span
                key={label}
                className={cn(
                  "flex shrink-0 items-center gap-1 border-b-2 px-1.5 pb-1.5 text-[9px]",
                  label === "Robustness" ? "border-app-primary text-app-primary" : "border-transparent text-app-ink-2",
                )}
              >
                <Icon className="size-2.5" />
                {label}
              </span>
            ))}
          </div>

          <Card className="mt-2 p-2.5">
            <CardHeader
              title="Sensibilidad a parámetros"
              desc="Movés uno o dos parámetros y mirás si los resultados son estables: buscá zonas amplias, no un pico aislado."
            />
            <div className="mt-2 grid grid-cols-[minmax(0,1.7fr)_repeat(3,minmax(0,1fr))] gap-1">
              <Field label="Parámetro 1" value="Período del RSI" select />
              <Field label="Mínimo" value="11" />
              <Field label="Máximo" value="17" />
              <Field label="Paso" value="1" />
              <Field label="Parámetro 2 (opcional)" value="% de equity a arriesgar" select />
              <Field label="Mínimo" value="0,7" />
              <Field label="Máximo" value="1,3" />
              <Field label="Paso" value="0,1" />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="tnum truncate text-[8.5px] text-app-ink">
                {combos} combinaciones (rsi_period: 7 × risk_pct: 7) · máximo 300
              </p>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-[4px] bg-app-primary px-1.5 py-[3px] text-[8px] font-semibold text-white">
                <Play className="size-2 fill-current" /> Calcular sensibilidad
              </span>
            </div>
          </Card>

          <div className="mt-1.5 grid grid-cols-2 gap-1 sm:grid-cols-5">
            <Metric label="Combinaciones con retorno > 0" value={`${Math.round(r.positiveShare * 100)}%`} sub={`de ${r.combos} probadas`} />
            <Metric label="Retorno (mín · mediana · máx)" value={pct(r.median)} valueClass="text-app-positive" sub={`${pct(r.min)} a ${pct(r.max)}`} />
            <Metric label="Sharpe mediano" value={r.sharpeMedian.toFixed(2)} />
            <Metric label="Peor drawdown" value={pct(r.worstDrawdown, 2)} />
            <Metric
              className="col-span-2 sm:col-span-1"
              label="Operaciones por combinación"
              value={`${r.tradesRange[0]} – ${r.tradesRange[1]}`}
              sub="14% con menos de 30"
            />
          </div>

          <p className="mt-1.5 flex items-start gap-1 rounded-md bg-[#eaf2fc] px-2 py-1 text-[8px] leading-snug text-app-nav-ink">
            <Info className="mt-px size-2.5 shrink-0" />
            <span className="tnum">
              El punto actual rinde {pct(r.current, 2)}; sus vecinos inmediatos rinden entre {pct(r.neighbors.lo, 2)} y{" "}
              {pct(r.neighbors.hi, 2)}.
            </span>
          </p>

          <Card className="mt-1.5 p-2.5">
            <CardHeader
              title="rsi_period × risk_pct"
              desc="Rojo = mal, azul = bien, gris = neutro. El recuadro negro es el punto actual."
            />
            <div className="mt-1.5 flex gap-0.5 overflow-hidden [mask-image:linear-gradient(to_right,black_88%,transparent)]">
              {metricTabs.map((m, i) => (
                <span
                  key={m}
                  className={cn(
                    "shrink-0 rounded-[4px] px-1.5 py-[3px] text-[8px]",
                    i === 0 ? "bg-app-primary font-semibold text-white" : "text-app-ink",
                  )}
                >
                  {m}
                </span>
              ))}
            </div>
            <Heatmap grid={r.grid} max={r.max} />
          </Card>
        </div>
      </div>
    </AppWindow>
  );
}
