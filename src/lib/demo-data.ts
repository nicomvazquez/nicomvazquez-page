/**
 * Series SINTÉTICAS para las visualizaciones decorativas.
 *
 * Se generan con un PRNG con semilla fija: son deterministas (mismo HTML en
 * servidor y cliente) y no representan cotizaciones, activos ni resultados
 * reales. Toda visualización que use estos datos debe mostrar la etiqueta
 * de "datos ilustrativos".
 */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Normal estándar vía Box-Muller */
function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export type Candle = { o: number; h: number; l: number; c: number; v: number };

export function makeCandles(n: number, seed = 7, start = 100, drift = 0.0012, vol = 0.014): Candle[] {
  const rand = mulberry32(seed);
  const out: Candle[] = [];
  let prev = start;
  for (let i = 0; i < n; i++) {
    const o = prev;
    const c = o * (1 + drift + vol * gaussian(rand));
    const h = Math.max(o, c) * (1 + Math.abs(gaussian(rand)) * vol * 0.45);
    const l = Math.min(o, c) * (1 - Math.abs(gaussian(rand)) * vol * 0.45);
    const v = 0.35 + rand() * 0.65;
    out.push({ o, h, l, c, v });
    prev = c;
  }
  return out;
}

export function makeWalk(n: number, seed = 3, start = 100, drift = 0.001, vol = 0.01): number[] {
  const rand = mulberry32(seed);
  const out = [start];
  for (let i = 1; i < n; i++) out.push(out[i - 1] * (1 + drift + vol * gaussian(rand)));
  return out;
}

export function movingAverage(values: number[], period: number): (number | null)[] {
  return values.map((_, i) => {
    if (i < period - 1) return null;
    let s = 0;
    for (let j = i - period + 1; j <= i; j++) s += values[j];
    return s / period;
  });
}

export function drawdown(values: number[]): number[] {
  let peak = -Infinity;
  return values.map((v) => {
    peak = Math.max(peak, v);
    return v / peak - 1;
  });
}

/** Bandas de percentiles de un "fan chart" Monte Carlo sobre una serie sintética */
export function monteCarloBands(n: number, paths: number, seed = 11) {
  const series = Array.from({ length: paths }, (_, p) => makeWalk(n, seed + p * 13, 100, 0.0009, 0.012));
  const pct = (arr: number[], q: number) => {
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor(q * s.length))];
  };
  const bands = Array.from({ length: n }, (_, i) => {
    const col = series.map((s) => s[i]);
    return { p5: pct(col, 0.05), p25: pct(col, 0.25), p50: pct(col, 0.5), p75: pct(col, 0.75), p95: pct(col, 0.95) };
  });
  return { series: series.slice(0, 14), bands };
}

/* ---------- helpers de geometría SVG ---------- */

export function scaleLinear(d0: number, d1: number, r0: number, r1: number) {
  const k = (r1 - r0) / (d1 - d0 || 1);
  return (v: number) => r0 + (v - d0) * k;
}

export function linePath(values: (number | null)[], x: (i: number) => number, y: (v: number) => number) {
  let d = "";
  let pen = false;
  values.forEach((v, i) => {
    if (v == null) {
      pen = false;
      return;
    }
    d += `${pen ? "L" : "M"}${x(i).toFixed(2)} ${y(v).toFixed(2)}`;
    pen = true;
  });
  return d;
}

export function areaPath(values: number[], x: (i: number) => number, y: (v: number) => number, baseY: number) {
  const top = linePath(values, x, y);
  return `${top}L${x(values.length - 1).toFixed(2)} ${baseY}L${x(0).toFixed(2)} ${baseY}Z`;
}

export function bandPath(lo: number[], hi: number[], x: (i: number) => number, y: (v: number) => number) {
  const upper = hi.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(2)} ${y(v).toFixed(2)}`).join("");
  const lower = lo
    .map((_, k) => {
      const i = lo.length - 1 - k;
      return `L${x(i).toFixed(2)} ${y(lo[i]).toFixed(2)}`;
    })
    .join("");
  return `${upper}${lower}Z`;
}

export const pctChange = (series: number[]) => series[series.length - 1] / series[0] - 1;
