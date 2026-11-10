import { ArrowDown, ArrowRight } from "lucide-react";
import { Container, LinkButton } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { HeroVisual } from "@/components/visuals/hero-visual";

const specialties = ["Financial Markets", "Algorithmic Trading", "Quantitative Research", "Financial Technology"];

export function Hero() {
  return (
    <section id="inicio" className="relative isolate overflow-hidden pt-28 pb-24 sm:pt-36 lg:pb-32">
      {/* Fondo: retícula enmascarada + halo muy tenue */}
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_30%,black,transparent_75%)]" />
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-[520px] w-[720px] rounded-full bg-brand/10 blur-[120px]" />

      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 xl:col-span-6">
          <Reveal>
            <p className="eyebrow flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sky">
              <span>Financial Markets</span>
              <span aria-hidden className="text-line">·</span>
              <span>Quantitative Finance</span>
              <span aria-hidden className="text-line">·</span>
              <span>Technology</span>
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="text-balance mt-7 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] text-fg sm:text-6xl lg:text-[4.1rem]">
              Entendiendo los mercados.{" "}
              <span className="text-muted">Construyendo tecnología.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-pretty mt-7 max-w-[34rem] text-[17px] leading-[1.65] text-muted">
              Exploro los mercados financieros a través del análisis económico, los datos y la tecnología.
              Desarrollo herramientas, modelos cuantitativos y sistemas que transforman información en decisiones.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <LinkButton
                href="#proyectos"
                icon={<ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
              >
                Explorar proyectos
              </LinkButton>
              <LinkButton
                href="#sobre-mi"
                variant="secondary"
                icon={<ArrowDown aria-hidden className="size-4 text-muted transition-transform duration-200 group-hover:translate-y-0.5" />}
              >
                Conocer mi trabajo
              </LinkButton>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="mt-14 grid grid-cols-2 border-t border-line pt-6 sm:grid-cols-4" aria-label="Áreas de especialización">
              {specialties.map((s, i) => (
                <li key={s} className="py-2 pr-4">
                  <span className="block font-mono text-[10.5px] text-subtle">0{i + 1}</span>
                  <span className="mt-1.5 block text-[13.5px] leading-snug text-fg/90">{s}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:pl-6 xl:pl-10">
          <Reveal delay={0.15} y={24}>
            <HeroVisual />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
