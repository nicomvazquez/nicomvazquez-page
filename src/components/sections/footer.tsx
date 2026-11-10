import { nav, site } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Monogram } from "@/components/navbar";

const year = process.env.NEXT_PUBLIC_BUILD_YEAR;

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink pt-16 pb-10">
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <Monogram />
              <span className="text-[15px] font-medium tracking-tight">{site.name}</span>
            </div>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-muted">{site.shortBio}</p>
          </div>

          <nav aria-label="Pie de página" className="md:col-span-3 md:col-start-7">
            <p className="eyebrow text-subtle">Navegación</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-[14px] text-muted transition-colors hover:text-fg">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow text-subtle">Redes</p>
            <ul className="mt-4 flex gap-2">
              {[
                { label: "LinkedIn", href: site.contact.linkedin, Icon: LinkedinIcon },
                { label: "GitHub", href: site.contact.github, Icon: GithubIcon },
              ].map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (se abre en una pestaña nueva)`}
                    className="inline-flex size-11 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-sky/40 hover:text-sky"
                  >
                    <Icon className="size-[17px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-14 border-t border-line-soft pt-8 text-[12px] leading-relaxed text-subtle">
          <span className="text-muted">Disclaimer.</span> El contenido de este sitio tiene fines exclusivamente
          informativos y educativos y no constituye asesoramiento financiero, recomendación de inversión ni oferta de
          compra o venta de valores. Invertir implica riesgos, incluida la pérdida del capital. Los rendimientos pasados no
          garantizan resultados futuros. Las visualizaciones marcadas como ilustrativas usan datos sintéticos.
        </p>

        <div className="mt-8 flex flex-col gap-2 font-mono text-[11px] text-subtle sm:flex-row sm:justify-between">
          <span>
            © {year} {site.name}
          </span>
          <span>{site.role}</span>
        </div>
      </Container>
    </footer>
  );
}
