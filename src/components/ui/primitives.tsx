import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>{children}</div>;
}

/** Encabezado de sección: índice en mono + regla fina + etiqueta */
export function SectionIndex({ index, label, className }: { index: string; label: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 text-muted", className)}>
      <span className="eyebrow text-sky">{index}</span>
      <span aria-hidden className="h-px w-10 bg-line" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium tracking-tight transition-[background-color,border-color,color,transform] duration-200 ease-out active:translate-y-px";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-[#2b88e0] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]",
  secondary: "border border-line bg-white/[0.02] text-fg hover:border-[#2c4664] hover:bg-white/[0.05]",
  ghost: "text-muted hover:text-fg",
};

type LinkButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  external?: boolean;
  icon?: ReactNode;
  /** Si es false el enlace no está configurado: se renderiza deshabilitado. */
  enabled?: boolean;
  disabledHint?: string;
};

export function LinkButton({
  variant = "primary",
  external,
  icon,
  enabled = true,
  disabledHint = "Enlace pendiente de configuración",
  className,
  children,
  href,
  ...rest
}: LinkButtonProps) {
  if (!enabled || !href) {
    return (
      <span className="inline-flex flex-col gap-1.5">
        <span
          role="link"
          aria-disabled="true"
          title={disabledHint}
          className={cn(base, variants[variant], "cursor-not-allowed opacity-45 hover:bg-none", className)}
        >
          {children}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">{disabledHint}</span>
      </span>
    );
  }
  return (
    <a
      href={href}
      className={cn(base, variants[variant], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
      {icon ??
        (external ? (
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        ) : null)}
      {external ? <span className="sr-only">(se abre en una pestaña nueva)</span> : null}
    </a>
  );
}

/** Etiqueta visible para cualquier visual con datos no reales */
export function DemoTag({ children = "Datos ilustrativos", className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border border-amber-400/25 bg-amber-400/[0.06] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-amber-200/80",
        className,
      )}
    >
      <span aria-hidden className="size-1 rounded-full bg-amber-300/80" />
      {children}
    </span>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-ink-2/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
