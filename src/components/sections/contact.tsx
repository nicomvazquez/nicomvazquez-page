import { ArrowUpRight, Mail } from "lucide-react";
import { site } from "@/config/site";
import { Container, SectionIndex } from "@/components/ui/primitives";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Reveal } from "@/components/ui/reveal";

export function Contact() {
  const { linkedin, linkedinHandle, github, githubHandle, email } = site.contact;
  const links = [
    { label: "LinkedIn", detail: linkedinHandle, href: linkedin, icon: LinkedinIcon, external: true },
    { label: "GitHub", detail: githubHandle, href: github, icon: GithubIcon, external: true },
    { label: "Email", detail: email, href: `mailto:${email}`, icon: Mail, external: false },
  ];

  return (
    <section id="contacto" className="relative overflow-hidden border-t border-line bg-ink-2 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute -bottom-48 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-brand/[0.07] blur-[120px]" />
      <Container className="relative">
        <SectionIndex index="06" label="Contacto" />
        <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="text-[2.8rem] font-semibold leading-none tracking-[-0.04em] sm:text-7xl">Let&apos;s connect.</h2>
            <p className="text-pretty mt-7 max-w-md text-[16.5px] leading-[1.7] text-muted">
              Estoy abierto a intercambiar ideas, colaborar en proyectos y conversar sobre mercados financieros,
              tecnología y análisis cuantitativo.
            </p>
          </Reveal>

          <ul className="border-t border-line lg:col-span-7">
            {links.map(({ label, detail, href, icon: Icon, external }, i) => (
              <li key={label} className="border-b border-line">
                <Reveal delay={i * 0.06}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-5 py-6 transition-colors duration-200 sm:py-7"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-line text-muted transition-colors duration-200 group-hover:border-sky/40 group-hover:text-sky">
                      <Icon className="size-[18px]" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xl font-medium tracking-tight text-fg sm:text-2xl">{label}</span>
                      <span className="mt-0.5 block truncate font-mono text-[12px] text-subtle transition-colors duration-200 group-hover:text-muted">
                        {detail}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-5 shrink-0 text-subtle transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky"
                    />
                    {external ? <span className="sr-only">(se abre en una pestaña nueva)</span> : null}
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
