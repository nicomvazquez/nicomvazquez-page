import { linePath, makeWalk, scaleLinear } from "@/lib/demo-data";

function Lines({ n, last = "62%" }: { n: number; last?: string }) {
  return (
    <div className="space-y-[7px]">
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className="block h-[5px] rounded-full bg-slate-300/80"
          style={{ width: i === n - 1 ? last : `${92 + ((i * 5) % 8)}%` }}
        />
      ))}
    </div>
  );
}

export function ReportPreview() {
  const s = makeWalk(60, 77, 100, 0.0008, 0.009);
  const x = scaleLinear(0, s.length - 1, 0, 300);
  const y = scaleLinear(Math.min(...s), Math.max(...s), 70, 6);

  return (
    <div className="relative mx-auto w-full max-w-[400px] pb-6 pr-6" aria-label="Vista previa de la maqueta del reporte de cierre" role="img">
      {/* páginas de fondo */}
      <div aria-hidden className="absolute top-0 left-0 right-6 bottom-6 translate-x-6 translate-y-6 rounded-[6px] border border-white/[0.06] bg-surface" />
      <div aria-hidden className="absolute top-0 left-0 right-6 bottom-6 translate-x-3 translate-y-3 rounded-[6px] border border-white/10 bg-[#1b2b40]" />

      <article
        aria-hidden
        className="relative sm:aspect-[1/1.26] rounded-[6px] bg-paper p-7 text-slate-900 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 sm:p-9"
      >
        <header className="flex items-center justify-between border-b border-slate-900 pb-2.5 font-mono text-[8.5px] uppercase tracking-[0.18em] text-slate-600">
          <span className="font-semibold text-slate-900">NVP · Research</span>
          <span>Edición de muestra</span>
        </header>

        <p className="mt-5 font-mono text-[8.5px] uppercase tracking-[0.2em] text-[#247BCE]">Daily market closing report</p>
        <h3 className="mt-1.5 font-serif text-[27px] leading-[1.05] tracking-[-0.01em] text-slate-900 sm:text-[31px]">
          Reporte de cierre de mercado
        </h3>
        <p className="mt-2 font-serif text-[12.5px] italic text-slate-500">
          Argentina, mercados internacionales y variables macro.
        </p>

        <div className="mt-6 grid grid-cols-[1fr_1.1fr] gap-5">
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.16em] text-slate-500">01 · Resumen</p>
              <Lines n={5} />
            </div>
            <div>
              <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.16em] text-slate-500">02 · Argentina</p>
              <Lines n={4} last="40%" />
            </div>
          </div>
          <div>
            <div className="rounded-[3px] border border-slate-300 p-2.5">
              <div className="flex items-center justify-between font-mono text-[7.5px] uppercase tracking-[0.14em] text-slate-500">
                <span>Gráfico</span>
                <span className="text-amber-700">Ilustrativo</span>
              </div>
              <svg viewBox="0 0 300 76" className="mt-1.5 block h-auto w-full">
                <path d={`${linePath(s, x, y)}L300 76L0 76Z`} fill="#247BCE" fillOpacity="0.1" />
                <path d={linePath(s, x, y)} fill="none" stroke="#247BCE" strokeWidth="1.6" />
              </svg>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-slate-300 pb-1 font-mono text-[7.5px] uppercase tracking-[0.12em] text-slate-500">
                <span>Símbolo</span>
                <span>Cierre</span>
                <span>Var.</span>
              </div>
              {[0, 1, 2, 3].map((r) => (
                <div key={r} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                  <span className="h-[5px] w-10 rounded-full bg-slate-300" />
                  <span className="h-[5px] w-8 rounded-full bg-slate-300" />
                  <span className="h-[5px] w-6 rounded-full bg-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.16em] text-slate-500">03 · Internacional y macro</p>
          <Lines n={3} last="55%" />
        </div>

        <footer className="mt-8 flex justify-between gap-4 border-t border-slate-300 pt-2 font-mono text-[7.5px] uppercase tracking-[0.14em] text-slate-400 sm:absolute sm:inset-x-9 sm:bottom-5 sm:mt-0">
          <span>Uso informativo · no constituye recomendación</span>
          <span>p. 1</span>
        </footer>
      </article>
    </div>
  );
}
