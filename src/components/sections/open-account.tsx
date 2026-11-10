import { Scale, ShieldCheck } from "lucide-react";
import { isConfigured, site } from "@/config/site";
import { Container, LinkButton, SectionIndex } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    title: "Apertura de cuenta comitente",
    body: "Un proceso online para abrir tu cuenta a tu nombre, a través de un agente registrado.",
  },
  {
    title: "Acceso a instrumentos financieros",
    body: "Acciones, bonos, CEDEARs, letras, cauciones y otros activos disponibles en el mercado.",
  },
  {
    title: "Operatoria en mercados",
    body: "Operás desde tu propia cuenta, con tus fondos y bajo tu control.",
  },
  {
    title: "Acompañamiento y asesoramiento",
    body: "Sujeto a las habilitaciones y condiciones regulatorias correspondientes.",
  },
];

export function OpenAccount() {
  const { alycReferralUrl, alycName } = site.investing;

  return (
    <section id="invertir" className="relative border-t border-line py-24 sm:py-32">
      <Container>
        <SectionIndex index="05" label="Servicios financieros" />

        <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="text-balance text-[2.1rem] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl">
              Empezá a invertir en el mercado.
            </h2>
            <p className="text-pretty mt-6 text-[16.5px] leading-[1.7] text-muted">
              Si estás interesado en comenzar a operar en los mercados financieros, podés abrir tu propia cuenta comitente
              y acceder a instrumentos de inversión como acciones, bonos, CEDEARs y otros activos disponibles.
            </p>
            {alycName ? (
              <p className="mt-4 text-[14px] text-subtle">
                Apertura a través de <span className="text-fg">{alycName}</span>.
              </p>
            ) : null}
            <div className="mt-10">
              <LinkButton
                href={alycReferralUrl}
                external
                enabled={isConfigured(alycReferralUrl)}
                disabledHint="Enlace de apertura pendiente de configurar"
              >
                Quiero abrir una cuenta
              </LinkButton>
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <ol className="relative border-l border-line">
              {steps.map((s, i) => (
                <li key={s.title} className="relative pb-9 pl-8 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[5px] top-1.5 size-[9px] rounded-full border border-sky/70 bg-ink"
                  />
                  <Reveal delay={i * 0.05}>
                    <p className="font-mono text-[11px] text-subtle">Paso {String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1.5 text-lg font-medium tracking-tight text-fg">{s.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <Reveal delay={0.05}>
          <aside
            aria-label="Aviso legal"
            className="mt-20 grid grid-cols-1 gap-6 rounded-xl border border-line bg-ink-2 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:gap-8"
          >
            <div className="flex gap-3 md:flex-col">
              <ShieldCheck aria-hidden className="size-5 text-sky" />
              <Scale aria-hidden className="size-5 text-muted" />
            </div>
            <div className="space-y-3 text-[13.5px] leading-relaxed text-muted">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg/80">Información importante</p>
              <p>
                Las inversiones en instrumentos financieros implican riesgos, incluida la posible pérdida del capital
                invertido. Los rendimientos pasados no garantizan resultados futuros.
              </p>
              <p>
                El contenido de este sitio es informativo y no constituye una recomendación ni una oferta de compra o venta
                de valores. Cualquier servicio de asesoramiento estará sujeto a las habilitaciones regulatorias
                correspondientes. La apertura de cuenta y la operatoria se realizan con el agente registrado, conforme a
                sus términos y a la normativa vigente.
              </p>
            </div>
          </aside>
        </Reveal>
      </Container>
    </section>
  );
}
