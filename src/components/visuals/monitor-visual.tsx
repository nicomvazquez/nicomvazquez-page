import { DemoTag } from "@/components/ui/primitives";

/**
 * Representación de la interfaz del monitor (layout real, sin cifras):
 * las celdas numéricas se dibujan como barras neutras para no mostrar
 * cotizaciones inventadas.
 */

const fx = ["Oficial", "Blue", "MEP", "CCL", "Mayorista", "Cripto"];
const macro = ["Reservas", "Inflación mensual", "Inflación i.a.", "Tasa política", "BADLAR", "UVA"];
const panels = [
  { title: "Panel Líder", rows: ["GGAL", "YPFD", "PAMP", "BMA", "TXAR"] },
  { title: "Bonos MEP", rows: ["AL30D", "GD30D", "GD35D", "AE38D", "GD41D"] },
  { title: "CEDEARs", rows: ["AAPL", "MSFT", "NVDA", "KO", "MELI"] },
  { title: "Criptomonedas", rows: ["BTC", "ETH", "SOL", "USDT", "BNB"] },
];

function Bar({ w, tone = "bg-line" }: { w: string; tone?: string }) {
  return <span className={`block h-1.5 rounded-full ${tone}`} style={{ width: w }} />;
}

export function MonitorVisual({ host }: { host: string }) {
  return (
    <figure
      className="overflow-hidden rounded-xl border border-line bg-ink shadow-[0_40px_120px_-50px_rgba(56,189,248,0.25)]"
      aria-label="Representación de la interfaz del monitor de mercados, sin datos de cotización"
    >
      <div className="flex items-center gap-3 border-b border-line bg-ink-2 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
        </span>
        <span className="mx-auto truncate rounded-md border border-line bg-ink px-3 py-1 font-mono text-[10.5px] text-subtle sm:min-w-64 sm:text-center">
          {host}
        </span>
        <DemoTag className="hidden sm:inline-flex">Interfaz · sin datos</DemoTag>
      </div>

      <div aria-hidden>
        {/* carrusel de dólares */}
        <div className="flex gap-2 overflow-hidden border-b border-line px-4 py-3">
          {fx.map((d) => (
            <div key={d} className="min-w-[96px] shrink-0 rounded-md border border-line-soft bg-ink-2 px-3 py-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{d}</p>
              <div className="mt-2 flex gap-2">
                <Bar w="34px" />
                <Bar w="26px" tone="bg-surface-2" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
          {/* barra lateral macro */}
          <aside className="hidden space-y-3 border-r border-line p-4 sm:block">
            <div className="rounded-md border border-sky/30 bg-sky/[0.06] p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-sky">Riesgo país</p>
              <div className="mt-2.5">
                <Bar w="60%" tone="bg-sky/40" />
              </div>
            </div>
            <p className="pt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">Macro · Argentina</p>
            <ul className="space-y-2.5">
              {macro.map((m, i) => (
                <li key={m} className="flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] text-muted">{m}</span>
                  <Bar w={`${20 + ((i * 7) % 16)}px`} />
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-md border border-line px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-fg/80">
              Reporte PDF
            </div>
          </aside>

          {/* paneles */}
          <div className="grid grid-cols-2 gap-px bg-line">
            {panels.map((p) => (
              <div key={p.title} className="bg-ink p-3 sm:p-4">
                <p className="text-[12px] font-medium text-fg">{p.title}</p>
                <div className="mt-2.5 grid grid-cols-[1fr_auto_auto] gap-x-3 font-mono text-[9.5px] uppercase tracking-[0.1em] text-subtle">
                  <span>Símbolo</span>
                  <span>Último</span>
                  <span>Var.</span>
                </div>
                <ul className="mt-2 space-y-2">
                  {p.rows.map((r) => (
                    <li key={r} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3">
                      <span className="font-mono text-[11px] text-fg/85">{r}</span>
                      <Bar w="30px" tone="bg-surface-2" />
                      <Bar w="22px" tone="bg-line" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
