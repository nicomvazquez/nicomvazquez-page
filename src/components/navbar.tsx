"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/config/site";
import { cn } from "@/components/ui/primitives";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#inicio");
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Resalta la sección visible
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-line/80 bg-ink/75 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent",
      )}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-surface focus:px-3 focus:py-2 focus:text-sm"
      >
        Saltar al contenido
      </a>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#inicio" className="group flex items-center gap-3" aria-label={`${site.name}, inicio`}>
          <Monogram />
          <span className="text-[15px] font-medium tracking-tight text-fg">
            Nicolás Vazquez Pizzi
          </span>
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "true" : undefined}
              className={cn(
                "relative rounded-md px-3 py-2 text-[13.5px] transition-colors duration-200",
                active === item.href ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              {item.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-3 -bottom-px h-px bg-sky transition-opacity duration-300",
                  active === item.href ? "opacity-100" : "opacity-0",
                )}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#proyectos"
            className="hidden min-h-9 items-center rounded-md border border-[#2a5d93] bg-brand/15 px-4 text-[13px] font-medium text-fg transition-colors duration-200 hover:bg-brand/30 sm:inline-flex"
          >
            Explorar proyectos
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-fg lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="h-[calc(100dvh-4rem)] border-t border-line bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Móvil" className="mx-auto flex max-w-[1200px] flex-col px-5 py-6 sm:px-8">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 * i + 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-baseline justify-between border-b border-line-soft py-5 text-2xl tracking-tight text-fg"
                >
                  {item.label}
                  <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                </motion.a>
              ))}
              <a
                href="#proyectos"
                onClick={() => setOpen(false)}
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-brand text-sm font-medium text-white"
              >
                Explorar proyectos
              </a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex size-8 items-center justify-center overflow-hidden rounded-[7px] border border-line bg-ink-2",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-8">
        <path d="M7 22 L12.5 15 L17 18.5 L25 9" fill="none" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="25" cy="9" r="1.9" fill="#F1F5F9" />
      </svg>
    </span>
  );
}
