import { Container, SectionIndex } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { NewsletterForm } from "@/components/newsletter-form";
import { ReportPreview } from "@/components/visuals/report-preview";

const contents = [
  { title: "Daily Market Closing Report", when: "Cierre" },
  { title: "Premarket Analysis", when: "Pre-apertura" },
  { title: "Argentina Market Insights", when: "Local" },
  { title: "International Market Overview", when: "Global" },
  { title: "Macroeconomic Developments", when: "Macro" },
  { title: "Market Outlook", when: "Perspectiva" },
];

export function Research() {
  return (
    <section id="research" className="relative border-t border-line bg-ink-2 py-24 sm:py-32">
      <Container>
        <SectionIndex index="04" label="Research & Newsletter" />

        <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="text-balance text-[2.1rem] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl">
                Research, market insights &amp; daily analysis.
              </h2>
              <p className="text-pretty mt-6 max-w-xl text-[16.5px] leading-[1.7] text-muted">
                Análisis de mercado, seguimiento de variables económicas y reportes orientados a comprender los
                movimientos de los mercados financieros.
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <p className="eyebrow mt-12 text-subtle">Qué reciben los suscriptores</p>
              <ul className="mt-4 border-t border-line">
                {contents.map((c, i) => (
                  <li key={c.title} className="group flex items-baseline gap-4 border-b border-line-soft py-3.5">
                    <span className="w-6 shrink-0 font-mono text-[11px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[15.5px] text-fg transition-colors duration-200 group-hover:text-sky">{c.title}</span>
                    <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.12em] text-subtle">{c.when}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div id="newsletter" className="mt-12 scroll-mt-28 rounded-xl border border-line bg-ink/60 p-6 sm:p-8">
                <h3 className="text-xl font-medium tracking-tight text-fg">Suscribite al newsletter</h3>
                <p className="mt-2 mb-6 text-[14.5px] leading-relaxed text-muted">
                  Recibí los reportes y el análisis diario directamente en tu email.
                </p>
                <NewsletterForm />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} y={28} className="lg:col-span-5 lg:col-start-8 lg:pt-6">
            <div className="lg:sticky lg:top-28">
              <ReportPreview />
              <p className="mt-6 text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">
                Maqueta del reporte · contenido ilustrativo
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
