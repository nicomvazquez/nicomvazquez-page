import Image from "next/image";
import { site } from "@/config/site";
import { Container, LinkButton, SectionIndex } from "@/components/ui/primitives";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Reveal } from "@/components/ui/reveal";
import { BotMockup } from "@/components/visuals/bot-mockup";

const features = [
  {
    title: "Strategy Development",
    body: "Interfaz común para todas las estrategias, con registro automático y formularios de parámetros generados desde el código.",
  },
  {
    title: "Historical Backtesting",
    body: "Datos históricos reales del exchange y un modelo de ejecución configurable: fees, slippage, spread, funding y resolución intravela.",
  },
  {
    title: "Performance Analytics",
    body: "Equity, drawdown, trades y costos por corrida, con historial guardado y exportación a Excel/CSV.",
  },
  {
    title: "Risk Metrics",
    body: "Sharpe, Sortino, Calmar, VaR y CVaR, exposición y costos. En vivo: kill-switch y límites de pérdida diaria.",
  },
  {
    title: "Parameter Optimization",
    body: "Sensibilidad, barrido multi-parámetro, walk-forward con re-optimización y validación in-sample / out-of-sample.",
  },
  {
    title: "Monte Carlo Simulation",
    body: "Shuffle, bootstrap y block bootstrap para estimar la distribución de drawdowns. Stress tests por escenario.",
  },
];

const stack = ["Python", "FastAPI", "NiceGUI", "PostgreSQL · TimescaleDB", "Docker", "Bybit API"];

export function FeaturedBot() {
  const { repoUrl, screenshot } = site.projects.tradingBot;

  return (
    <section id="proyectos" className="relative border-t border-line bg-ink-2 py-24 sm:py-32">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <Container className="relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionIndex index="02" label="Proyecto destacado" />
          <span className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/[0.07] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-sky">
            <span aria-hidden className="size-1.5 rounded-full bg-sky" />
            Open source project
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="text-balance text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
                Algorithmic Trading System
              </h2>
              <p className="mt-4 text-xl tracking-tight text-sky sm:text-2xl">From strategy research to systematic execution.</p>
            </Reveal>
          </div>
          <Reveal delay={0.08} className="lg:col-span-5 lg:pt-3">
            <p className="text-pretty text-[16.5px] leading-[1.7] text-muted">
              Un entorno de desarrollo y evaluación de estrategias de trading algorítmico. Permite diseñar estrategias,
              configurar parámetros, realizar backtesting y analizar su comportamiento histórico antes de considerar su
              implementación en el mercado.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={repoUrl} external icon={<GithubIcon className="size-4" />}>
                Explorar en GitHub
              </LinkButton>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={28} className="mt-16">
          {screenshot ? (
            <figure className="overflow-hidden rounded-xl border border-line">
              <Image
                src={screenshot}
                alt="Captura del dashboard de backtesting del Algorithmic Trading System"
                width={2400}
                height={1400}
                sizes="(min-width: 1200px) 1136px, 100vw"
                className="h-auto w-full"
              />
            </figure>
          ) : (
            <BotMockup />
          )}
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-x-12 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.05}>
              <div className="group h-full border-b border-line py-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-sky">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[17px] font-medium tracking-tight text-fg">{f.title}</h3>
                </div>
                <p className="text-pretty mt-3 pl-8 text-[14.5px] leading-relaxed text-muted">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="eyebrow shrink-0 text-subtle">Stack</span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-muted">
            {stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
