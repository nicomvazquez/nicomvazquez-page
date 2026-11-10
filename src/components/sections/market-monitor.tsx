import Image from "next/image";
import { isConfigured, site } from "@/config/site";
import { Container, LinkButton, SectionIndex } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { MonitorVisual } from "@/components/visuals/monitor-visual";

const modules = [
  { title: "Market Overview", body: "Dólares, riesgo país e indicadores macro de Argentina y EE.UU. en una sola vista." },
  { title: "Argentina Equities", body: "Panel líder, bonos, letras, CER y caución con la misma lectura tabular." },
  { title: "International Markets", body: "CEDEARs, índices americanos y commodities." },
  { title: "Cryptocurrency Markets", body: "Seguimiento de los principales criptoactivos." },
  { title: "Asset Analysis", body: "Análisis por activo y calculadora de bonos." },
  { title: "Market Data Visualization", body: "Datos de fuentes públicas y de mercado, organizados para leerse rápido." },
];

export function MarketMonitor() {
  const { url, screenshot } = site.projects.marketMonitor;
  const enabled = isConfigured(url);
  const host = enabled ? new URL(url).host : "market-monitor";

  return (
    <section id="monitor" className="relative border-t border-line py-24 sm:py-32">
      <Container>
        <SectionIndex index="03" label="Producto · Market Monitor" />

        <div className="mt-12 grid grid-cols-1 items-start gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="text-balance text-[2.1rem] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl">
                Market intelligence, all in one place.
              </h2>
              <p className="text-pretty mt-6 text-[16.5px] leading-[1.7] text-muted">
                Una plataforma de monitoreo y análisis de mercados financieros que centraliza información sobre activos,
                cotizaciones, indicadores y variables relevantes para comprender la dinámica de los mercados.
              </p>
            </Reveal>

            <ul className="mt-10 border-t border-line">
              {modules.map((m, i) => (
                <li key={m.title} className="border-b border-line-soft">
                  <Reveal delay={i * 0.04} className="grid grid-cols-[28px_1fr] gap-x-3 py-4">
                    <span className="pt-0.5 font-mono text-[11px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-[15px] font-medium tracking-tight text-fg">{m.title}</h3>
                      <p className="mt-1 text-[14px] leading-relaxed text-muted">{m.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <LinkButton
                href={url}
                external
                enabled={enabled}
                disabledHint="URL de producción pendiente de configurar"
              >
                Acceder al monitor
              </LinkButton>
            </div>
          </div>

          <Reveal delay={0.1} y={28} className="w-full max-w-[600px] justify-self-center lg:sticky lg:top-28 lg:col-span-7 lg:max-w-[580px] lg:justify-self-end">
            {screenshot ? (
              <figure className="overflow-hidden rounded-xl border border-line">
                <Image
                  src={screenshot}
                  alt="Captura del monitor de mercados financieros"
                  width={2400}
                  height={1500}
                  sizes="(min-width: 1024px) 660px, 100vw"
                  className="h-auto w-full"
                />
              </figure>
            ) : (
              <MonitorVisual host={host} />
            )}
            <p className="mt-4 font-mono text-[10.5px] leading-relaxed text-subtle">
              Representación de la interfaz. Las cifras no se muestran: en la aplicación provienen de fuentes de mercado
              en tiempo real o con demora, según el proveedor.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
