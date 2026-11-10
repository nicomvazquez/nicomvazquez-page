import { DemoTag } from "@/components/ui/primitives";
import { linePath, makeCandles, makeWalk, movingAverage, pctChange, scaleLinear, areaPath } from "@/lib/demo-data";

const W = 640;
const H = 320;
const PAD = { l: 14, r: 58, t: 18, b: 12 };
const VOL_H = 44;

export function HeroVisual() {
  const candles = makeCandles(68, 278, 100, 0.0016, 0.013);
  const closes = candles.map((c) => c.c);
  const ma = movingAverage(closes, 12);
  const lo = Math.min(...candles.map((c) => c.l));
  const hi = Math.max(...candles.map((c) => c.h));
  const priceBottom = H - PAD.b - VOL_H - 10;
  const x = scaleLinear(0, candles.length - 1, PAD.l + 4, W - PAD.r - 6);
  const y = scaleLinear(lo * 0.995, hi * 1.005, priceBottom, PAD.t);
  const cw = ((W - PAD.l - PAD.r) / candles.length) * 0.56;
  const last = closes[closes.length - 1];
  const ticks = Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * i) / 4);

  return (
    <div className="relative">
      {/* Panel principal */}
      <figure
        className="relative overflow-hidden rounded-xl border border-line bg-ink-2/90 shadow-[0_40px_120px_-40px_rgba(8,13,22,0.9),0_0_0_1px_rgba(255,255,255,0.02)_inset]"
        aria-label="Visualización ilustrativa de un gráfico de velas con datos sintéticos"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2 rounded-full bg-line" />
              <span className="size-2 rounded-full bg-line" />
              <span className="size-2 rounded-full bg-line" />
            </span>
            <span className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Research workspace
            </span>
          </div>
          <DemoTag>Demo · no real</DemoTag>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-4 pt-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">SIM-IDX · Base 100</p>
            <p className="tnum mt-1 text-[28px] font-medium leading-none tracking-tight text-fg">
              {last.toFixed(2)}
              <span className="ml-2 align-middle font-mono text-[13px] text-up">
                +{(pctChange(closes) * 100).toFixed(2)}%
              </span>
            </p>
          </div>
          <div className="flex gap-1 font-mono text-[11px] text-subtle" aria-hidden>
            {["1D", "1W", "1M", "1Y"].map((t, i) => (
              <span
                key={t}
                className={i === 2 ? "rounded border border-line bg-surface px-2 py-1 text-fg" : "px-2 py-1"}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-hidden>
          <defs>
            <linearGradient id="hv-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* grilla */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#1E3045" strokeDasharray="2 4" />
              <text x={W - PAD.r + 8} y={y(t) + 3.5} className="tnum" fill="#64748B" fontSize="10" fontFamily="var(--font-mono)">
                {t.toFixed(1)}
              </text>
            </g>
          ))}
          <path d={areaPath(closes, x, y, priceBottom)} fill="url(#hv-area)" />
          {/* velas */}
          {candles.map((c, i) => {
            const up = c.c >= c.o;
            const col = up ? "#38BDF8" : "#3B5674";
            return (
              <g key={i}>
                <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth="1" />
                <rect
                  x={x(i) - cw / 2}
                  y={y(Math.max(c.o, c.c))}
                  width={cw}
                  height={Math.max(1, Math.abs(y(c.o) - y(c.c)))}
                  fill={up ? col : "#0D1522"}
                  stroke={col}
                  strokeWidth="1"
                  rx="0.5"
                />
                <rect
                  x={x(i) - cw / 2}
                  y={H - PAD.b - c.v * VOL_H}
                  width={cw}
                  height={c.v * VOL_H}
                  fill={up ? "#247BCE" : "#1E3045"}
                  opacity={up ? 0.55 : 0.9}
                />
              </g>
            );
          })}
          <path
            d={linePath(ma, x, y)}
            fill="none"
            stroke="#F1F5F9"
            strokeOpacity="0.55"
            strokeWidth="1.25"
            className="hv-draw"
            pathLength={1}
          />
          {/* último precio */}
          <line x1={PAD.l} x2={W - PAD.r} y1={y(last)} y2={y(last)} stroke="#38BDF8" strokeOpacity="0.5" strokeDasharray="3 3" />
          <rect x={W - PAD.r + 2} y={y(last) - 9} width={PAD.r - 6} height={18} rx="3" fill="#247BCE" />
          <text x={W - PAD.r + 8} y={y(last) + 3.5} fill="#fff" fontSize="10.5" fontFamily="var(--font-mono)" className="tnum">
            {last.toFixed(1)}
          </text>
        </svg>

        <div className="grid grid-cols-3 border-t border-line font-mono text-[10.5px] uppercase tracking-[0.12em] text-subtle">
          <Stat label="MA 12" value="On" />
          <Stat label="Velas" value={`${candles.length}`} />
          <Stat label="Fuente" value="Sintética" />
        </div>
      </figure>

      {/* Módulo flotante: cross-asset */}
      <CrossAsset />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-r border-line px-4 py-2.5 last:border-r-0">
      <span>{label}</span>
      <span className="text-muted">{value}</span>
    </div>
  );
}

const assets = [
  { name: "Renta variable", seed: 5, drift: 0.0014, vol: 0.011 },
  { name: "Renta fija", seed: 9, drift: 0.0004, vol: 0.003 },
  { name: "FX", seed: 14, drift: -0.0003, vol: 0.006 },
  { name: "Cripto", seed: 31, drift: 0.002, vol: 0.026 },
];

function CrossAsset() {
  return (
    <div className="relative z-10 mx-4 -mt-10 rounded-lg border border-line bg-surface/95 p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur sm:absolute sm:-bottom-16 sm:-left-8 sm:mx-0 sm:mt-0 sm:w-[280px] xl:-left-14">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">Cross-asset · base 100</p>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-amber-200/70">Sim.</span>
      </div>
      <ul className="space-y-2.5">
        {assets.map((a) => {
          const s = makeWalk(40, a.seed, 100, a.drift, a.vol);
          const ch = pctChange(s) * 100;
          const sx = scaleLinear(0, s.length - 1, 0, 64);
          const sy = scaleLinear(Math.min(...s), Math.max(...s), 18, 2);
          const up = ch >= 0;
          return (
            <li key={a.name} className="grid grid-cols-[1fr_64px_56px] items-center gap-3">
              <span className="truncate text-[13px] text-fg">{a.name}</span>
              <svg viewBox="0 0 64 20" className="h-5 w-16" aria-hidden>
                <path d={linePath(s, sx, sy)} fill="none" stroke={up ? "#38BDF8" : "#64748B"} strokeWidth="1.25" />
              </svg>
              <span className={`tnum text-right font-mono text-[12px] ${up ? "text-up" : "text-down"}`}>
                {up ? "+" : ""}
                {ch.toFixed(2)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
