import { Download, Info } from "lucide-react";
import { cn } from "@/components/ui/primitives";
import { buildDemo } from "./data";
import { AppWindow, Card, CardHeader, Label, Sidebar } from "./shell";

const usd = (v: number, sign = false) =>
  `${sign ? (v > 0 ? "+" : v < 0 ? "-" : "") : v < 0 ? "-" : ""}$${Math.abs(v).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const tone = (v: number) => (v > 0 ? "text-app-positive" : v < 0 ? "text-app-negative" : "text-app-ink");

/* ---------- KPI card ---------- */
function Kpi({ label, value, sub, valueClass, info }: { label: string; value: string; sub: string; valueClass?: string; info?: boolean }) {
  return (
    <Card className="px-2.5 py-2">
      <Label className="flex items-center gap-1">
        {label}
        {info ? <Info className="size-2.5" aria-hidden /> : null}
      </Label>
      <p className={cn("tnum mt-0.5 text-[14px] font-semibold leading-tight tracking-tight text-app-ink", valueClass)}>{value}</p>
      <p className="tnum mt-px truncate text-[8.5px] text-app-muted">{sub}</p>
    </Card>
  );
}

/* ---------- Equity curve (capital realizado) ---------- */
function EquityChart({ equity }: { equity: number[] }) {
  const W = 640;
  const H = 112;
  const lo = Math.min(...equity);
  const hi = Math.max(...equity);
  const pad = (hi - lo) * 0.12;
  const x = (i: number) => 30 + (i / (equity.length - 1)) * (W - 36);
  const y = (v: number) => 6 + (1 - (v - (lo - pad)) / (hi - lo + 2 * pad)) * (H - 22);
  // escalonada: el capital realizado sólo cambia al cerrar un trade
  let d = `M${x(0)} ${y(equity[0])}`;
  for (let i = 1; i < equity.length; i++) d += `H${x(i).toFixed(1)}V${y(equity[i]).toFixed(1)}`;
  const base = H - 16;
  const ticks = [lo, (lo + hi) / 2, hi];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-1.5 block h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id="bm-eq" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2A78D6" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#2A78D6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1="30" x2={W - 4} y1={y(t)} y2={y(t)} stroke="#EEF0F4" />
          <text x="0" y={y(t) + 3} fill="#7B8190" fontSize="7.5" className="tnum">
            {(t / 1000).toFixed(2)}k
          </text>
        </g>
      ))}
      <path d={`${d}V${base}H${x(0)}Z`} fill="url(#bm-eq)" />
      <path d={d} fill="none" stroke="#2A78D6" strokeWidth="1.3" strokeLinejoin="round" />
      {["Sep", "Oct", "Nov"].map((m, i) => (
        <text key={m} x={30 + ((i + 0.5) / 3) * (W - 36)} y={H - 3} fill="#7B8190" fontSize="7.5" textAnchor="middle">
          {m}
        </text>
      ))}
    </svg>
  );
}

/* ---------- Badge de estado ---------- */
function StatusPill({ running }: { running: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-px text-[8.5px] font-semibold",
        running ? "bg-app-good-bg text-app-positive" : "bg-app-idle-bg text-app-idle",
      )}
    >
      <span className={cn("size-1 rounded-full", running ? "bg-app-positive" : "bg-app-idle")} />
      {running ? "Corriendo" : "Apagada"}
    </span>
  );
}

/* ---------- Tabla de instancias ---------- */
function InstancesTable({ rows }: { rows: ReturnType<typeof buildDemo>["instances"] }) {
  const th = "px-1.5 py-1 text-[7.5px] font-semibold uppercase tracking-[0.05em] text-app-muted";
  return (
    <table className="tnum mt-1.5 w-full text-left text-[9px]">
      <thead className="bg-app-head">
        <tr className="border-y border-app-line">
          <th className={th}>Instancia</th>
          <th className={cn(th, "hidden sm:table-cell")}>Estrategia</th>
          <th className={cn(th, "hidden lg:table-cell")}>Mercado</th>
          <th className={th}>Estado</th>
          <th className={cn(th, "hidden text-right sm:table-cell")}>Capital</th>
          <th className={cn(th, "text-right")}>PnL</th>
          <th className={cn(th, "hidden text-right md:table-cell")}>Cerrados</th>
          <th className={cn(th, "hidden text-right md:table-cell")}>Abiertos</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} className="border-b border-app-line last:border-0 even:bg-app-zebra">
            <td className="whitespace-nowrap px-1.5 py-[4px] text-app-ink">{r.name}</td>
            <td className="hidden whitespace-nowrap px-1.5 py-[4px] text-app-ink-2 sm:table-cell">{r.strategy}</td>
            <td className="hidden whitespace-nowrap px-1.5 py-[4px] text-app-ink-2 lg:table-cell">{r.market}</td>
            <td className="px-1.5 py-[4px]">
              <StatusPill running={r.running} />
            </td>
            <td className="hidden whitespace-nowrap px-1.5 py-[4px] text-right text-app-ink-2 sm:table-cell">{usd(r.capital)}</td>
            <td className={cn("whitespace-nowrap px-1.5 py-[4px] text-right font-medium", tone(r.pnl))}>{usd(r.pnl, true)}</td>
            <td className="hidden px-1.5 py-[4px] text-right text-app-ink-2 md:table-cell">{r.closed}</td>
            <td className="hidden px-1.5 py-[4px] text-right text-app-ink-2 md:table-cell">{r.open}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------- Pantalla Resumen ---------- */
export function OverviewScreen({ className }: { className?: string }) {
  const { equity, kpis: k, instances } = buildDemo();

  return (
    <AppWindow url="localhost:8080 / resumen" className={className}>
      <div className="flex">
        <Sidebar active="Resumen" running={k.running} total={k.total} />
        <div className="min-w-0 flex-1 space-y-2 p-3 sm:p-3.5" aria-hidden>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[14px] font-semibold tracking-tight text-app-ink">Resumen</p>
              <p className="text-[9px] text-app-ink-2">Estado de la cuenta y de las estrategias en vivo. Se actualiza solo.</p>
            </div>
            <span className="hidden shrink-0 items-center gap-1 rounded-md border border-app-primary px-1.5 py-[3px] text-[9px] font-medium text-app-primary sm:inline-flex">
              <Download className="size-2.5" /> Descargar
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
            <Kpi label="Balance de margen" info value={usd(k.balance)} sub={`Disponible ${usd(k.available)}`} />
            <Kpi label="PnL realizado" value={usd(k.realized, true)} valueClass={tone(k.realized)} sub={`${k.closedTrades} trades cerrados`} />
            <Kpi label="PnL de hoy" value={usd(k.today, true)} valueClass={tone(k.today)} sub="Desde las 00:00, hora Argentina" />
            <Kpi label="Posiciones abiertas" value={String(k.openPositions)} sub={`No realizado ${usd(k.unrealized, true)}`} />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <Kpi label="Win rate" value={`${(k.winRate * 100).toFixed(2)}%`} sub="% de trades ganadores" />
            <Kpi label="Profit factor" value={k.profitFactor.toFixed(2)} sub="ganancias / pérdidas" />
            <Kpi label="Instancias" value={`${k.running} / ${k.total}`} sub="corriendo / totales" />
          </div>

          <Card className="px-3 pt-2 pb-1.5">
            <CardHeader
              title="Capital realizado"
              desc="Capital inicial de las instancias activas más el PnL de los trades cerrados. No incluye la posición abierta."
            />
            <EquityChart equity={equity} />
          </Card>

          <Card className="px-3 py-2">
            <CardHeader title="Instancias" />
            <InstancesTable rows={instances.slice(0, 6)} />
          </Card>
        </div>
      </div>
    </AppWindow>
  );
}
