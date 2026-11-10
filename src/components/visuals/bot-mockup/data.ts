/**
 * Datos de DEMOSTRACIÓN para el mockup del bot.
 *
 * Generados con semilla fija: no son resultados reales de ninguna cuenta ni
 * estrategia. Todos los KPIs se derivan de la misma serie sintética de trades,
 * para que el mockup sea internamente coherente (KPIs = curva = tabla).
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

export const DEMO_SEED = 7;

type Instance = {
  name: string;
  strategy: string;
  market: string;
  running: boolean;
  capital: number;
};

// Nombres de estrategia reales del proyecto; instancias y mercados ilustrativos.
const instanceDefs: Instance[] = [
  { name: "rsi-reversion-btc", strategy: "rsi_reversion", market: "BTCUSDT · 15m", running: true, capital: 1000 },
  { name: "sma-cross-eth", strategy: "sma_cross", market: "ETHUSDT · 60m", running: true, capital: 2000 },
  { name: "donchian-sol", strategy: "donchian_breakout", market: "SOLUSDT · 60m", running: false, capital: 1500 },
  { name: "squeeze-btc-4h", strategy: "volatility_squeeze", market: "BTCUSDT · 240m", running: true, capital: 3000 },
  { name: "pullback-eth", strategy: "trend_pullback", market: "ETHUSDT · 15m", running: false, capital: 1000 },
  { name: "funding-oi-btc", strategy: "funding_oi", market: "BTCUSDT · 60m", running: true, capital: 1000 },
  { name: "ema-cross-ada", strategy: "ema_crossover", market: "ADAUSDT · 60m", running: true, capital: 500 },
];

export function buildDemo(seed = DEMO_SEED) {
  const rand = mulberry32(seed);
  const initial = instanceDefs.reduce((s, i) => s + i.capital, 0);
  const n = 186;
  const trades: { pnl: number; inst: number }[] = [];
  for (let k = 0; k < n; k++) {
    const win = rand() < 0.35;
    const r = 9 + rand() * 6; // riesgo por trade en USD
    const pnl = win ? r * (1.3 + rand() * 1.5) : -r * (0.7 + rand() * 0.4);
    trades.push({ pnl: Math.round(pnl * 100) / 100, inst: Math.floor(rand() * instanceDefs.length) });
  }

  // Curva de capital realizado (escalonada: sólo cambia al cerrar trades)
  const equity = [initial];
  for (const t of trades) equity.push(equity[equity.length - 1] + t.pnl);

  const wins = trades.filter((t) => t.pnl > 0);
  const grossWin = wins.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = -trades.filter((t) => t.pnl <= 0).reduce((s, t) => s + t.pnl, 0);
  const realized = equity[equity.length - 1] - initial;

  const instances = instanceDefs.map((d, i) => {
    const own = trades.filter((t) => t.inst === i);
    return { ...d, pnl: own.reduce((s, t) => s + t.pnl, 0), closed: own.length, open: d.running && i % 3 === 0 ? 1 : 0 };
  });
  const openPositions = instances.reduce((s, i) => s + i.open, 0);
  const running = instances.filter((i) => i.running).length;
  const today = trades.slice(-3).reduce((s, t) => s + t.pnl, 0);

  return {
    initial,
    equity,
    kpis: {
      balance: initial + realized - 4.37,
      available: initial + realized - 4.37 - 612.5,
      realized,
      closedTrades: n,
      today,
      openPositions,
      unrealized: -4.37,
      winRate: wins.length / n,
      profitFactor: grossWin / grossLoss,
      running,
      total: instances.length,
    },
    instances,
  };
}

/* ---------- Robustness: grilla de sensibilidad 7×7 ---------- */

export const rsiPeriods = [11, 12, 13, 14, 15, 16, 17];
export const riskPcts = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3];
export const currentPoint = { i: 3, j: 3 }; // rsi_period=14, risk_pct=1.0

export function buildRobustness(seed = 21) {
  const rand = mulberry32(seed);
  // retorno total (%) por combinación: meseta amplia + ruido, escala con el riesgo
  const grid = riskPcts.map((risk) =>
    rsiPeriods.map((p, i) => {
      const plateau = Math.exp(-((i - 3.6) ** 2) / 5.5) * 4.6 - 0.9;
      const v = plateau * (0.75 + risk * 0.35) + (rand() - 0.5) * 0.7;
      return Math.round(v * 100) / 100 + (p === 11 ? -0.15 : 0);
    }),
  );
  const flat = grid.flat();
  const sorted = [...flat].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const positive = flat.filter((v) => v > 0).length;
  const cur = grid[currentPoint.j][currentPoint.i];
  const neighbors = [
    grid[currentPoint.j - 1][currentPoint.i],
    grid[currentPoint.j + 1][currentPoint.i],
    grid[currentPoint.j][currentPoint.i - 1],
    grid[currentPoint.j][currentPoint.i + 1],
  ].sort((a, b) => a - b);
  return {
    grid,
    combos: flat.length,
    positiveShare: positive / flat.length,
    min: sorted[0],
    median,
    max: sorted[sorted.length - 1],
    sharpeMedian: 0.21 + median * 0.17,
    worstDrawdown: -(3.1 + rand() * 1.4),
    tradesRange: [27, 44] as const,
    current: cur,
    neighbors: { lo: neighbors[0], hi: neighbors[3], med: (neighbors[1] + neighbors[2]) / 2 },
  };
}
