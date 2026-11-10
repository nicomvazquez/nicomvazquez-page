import { Container, SectionIndex } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

const areas = [
  {
    n: "01",
    title: "Financial Markets",
    body: "Renta fija, renta variable, macroeconomía, análisis de instrumentos y operatoria de mercado.",
    tags: ["Bonos", "Equity", "CEDEARs", "Macro"],
  },
  {
    n: "02",
    title: "Quantitative Research",
    body: "Backtesting, estrategias algorítmicas, análisis estadístico, modelos cuantitativos y gestión de riesgo.",
    tags: ["Backtesting", "Walk-forward", "Monte Carlo", "Riesgo"],
  },
  {
    n: "03",
    title: "Software & Data",
    body: "Python, automatización, APIs financieras, procesamiento de datos y desarrollo de aplicaciones.",
    tags: ["Python", "TypeScript", "APIs", "Datos"],
  },
];

export function About() {
  return (
    <section id="sobre-mi" className="relative border-t border-line-soft py-24 sm:py-32">
      <Container>
        <SectionIndex index="01" label="Sobre mí" />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="text-balance text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
              Finanzas, tecnología y análisis cuantitativo.
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-5 text-[17px] leading-[1.7] text-muted">
              <p className="text-pretty text-[19px] leading-[1.6] text-fg/90">
                Mi trabajo se encuentra en la intersección entre los mercados financieros y la tecnología. Me interesa
                comprender cómo se comportan los activos, identificar oportunidades, desarrollar estrategias y construir
                herramientas que permitan analizar información financiera de manera más eficiente.
              </p>
              <p className="text-pretty">
                Trabajo con instrumentos de renta fija y renta variable, análisis macroeconómico, programación en Python y
                desarrollo de sistemas de trading algorítmico.
              </p>
              <p className="text-pretty">
                Mi objetivo es combinar investigación, análisis y tecnología para desarrollar soluciones aplicadas a los
                mercados.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Áreas: filas editoriales, no tarjetas */}
        <ol className="mt-20 border-t border-line">
          {areas.map((a, i) => (
            <li key={a.n} className="border-b border-line">
              <Reveal
                delay={i * 0.06}
                className="group grid grid-cols-1 gap-4 py-8 transition-colors duration-300 hover:bg-white/[0.012] sm:py-10 md:grid-cols-12 md:items-baseline"
              >
                <span className="font-mono text-sm text-sky md:col-span-1">{a.n}</span>
                <h3 className="text-2xl font-medium tracking-[-0.02em] text-fg md:col-span-4 md:text-[1.75rem]">
                  {a.title}
                </h3>
                <p className="text-pretty text-[15.5px] leading-relaxed text-muted md:col-span-4">{a.body}</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-subtle md:col-span-3 md:justify-end">
                  {a.tags.map((t) => (
                    <li key={t} className="transition-colors duration-300 group-hover:text-muted">
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
