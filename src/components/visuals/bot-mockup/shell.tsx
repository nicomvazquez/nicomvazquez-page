import type { ReactNode } from "react";
import {
  BookOpen,
  Bot,
  ChartCandlestick,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/components/ui/primitives";

/*
 * Componentes base del mockup. Usan exclusivamente la paleta clara original de
 * la aplicación (tokens app-* en globals.css): la interfaz del bot conserva su
 * identidad; sólo el marco exterior pertenece a la estética oscura de la landing.
 */

/** Ventana de navegador con la app adentro */
export function AppWindow({ url, className, children }: { url: string; className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[10px] bg-app-page ring-1 ring-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-app-line bg-app-chrome px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2 rounded-full bg-[#c9ced8]" />
          <span className="size-2 rounded-full bg-[#c9ced8]" />
          <span className="size-2 rounded-full bg-[#c9ced8]" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-app-surface px-2.5 py-[3px] font-mono text-[9.5px] text-app-muted">
          {url}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-app-warn-bg px-2 py-[2px] text-[9px] font-semibold text-app-warn">
          <span className="size-1 rounded-full bg-[#d9a441]" />
          Datos de demostración
        </span>
      </div>
      {children}
    </div>
  );
}

const navItems = [
  { label: "Resumen", Icon: LayoutDashboard },
  { label: "Operaciones", Icon: ReceiptText },
  { label: "Estrategias", Icon: Bot },
  { label: "Backtesting", Icon: FlaskConical },
  { label: "Configuración", Icon: SlidersHorizontal },
  { label: "Ayuda", Icon: BookOpen },
] as const;

export type NavLabel = (typeof navItems)[number]["label"];

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-app-primary text-white">
        <ChartCandlestick className="size-3.5" aria-hidden />
      </span>
      {compact ? null : (
        <span className="leading-tight">
          <span className="block text-[11.5px] font-semibold text-app-ink">Bot Trading</span>
          <span className="block text-[9px] text-app-muted">Bybit Futures</span>
        </span>
      )}
    </div>
  );
}

/** Sidebar blanca completa (pantalla Resumen) */
export function Sidebar({ active, running, total }: { active: NavLabel; running: number; total: number }) {
  return (
    <aside className="hidden w-[132px] shrink-0 flex-col border-r border-app-line bg-app-surface px-2 py-3 md:flex">
      <div className="px-1">
        <Brand />
      </div>
      <nav className="mt-4 space-y-px" aria-hidden>
        {navItems.map(({ label, Icon }) => (
          <div
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-[5px] text-[10.5px]",
              label === active ? "bg-app-nav font-medium text-app-nav-ink" : "text-app-ink-2",
            )}
          >
            <Icon className="size-3" aria-hidden />
            {label}
          </div>
        ))}
      </nav>
      <div className="mt-auto space-y-3 pt-6">
        <div className="flex items-center gap-2 px-2 text-[10.5px] text-app-ink-2">
          <LogOut className="size-3" aria-hidden /> Cerrar sesión
        </div>
        <div className="rounded-lg bg-app-page p-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-app-warn-bg px-1.5 py-px text-[8.5px] font-semibold text-app-warn">
            <span className="size-1 rounded-full bg-[#d9a441]" /> Demo Trading
          </span>
          <p className="mt-1 text-[9px] leading-snug text-app-ink-2">
            {running} de {total} instancias corriendo
          </p>
        </div>
      </div>
    </aside>
  );
}

/** Rail compacto de iconos (ventana secundaria) */
export function IconRail({ active }: { active: NavLabel }) {
  return (
    <aside
      className="hidden w-10 shrink-0 flex-col items-center border-r border-app-line bg-app-surface py-2.5 sm:flex"
      aria-hidden
    >
      <Brand compact />
      <div className="mt-3 flex flex-col gap-0.5">
        {navItems.map(({ label, Icon }) => (
          <span
            key={label}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-md",
              label === active ? "bg-app-nav text-app-nav-ink" : "text-app-muted",
            )}
          >
            <Icon className="size-3" />
          </span>
        ))}
      </div>
    </aside>
  );
}

/** Tarjeta blanca de la app */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-lg border border-app-line bg-app-surface", className)}>{children}</div>;
}

export function CardHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-app-ink">{title}</p>
      {desc ? <p className="mt-px text-[9px] leading-snug text-app-ink-2">{desc}</p> : null}
    </div>
  );
}

/** Etiqueta de métrica: mayúsculas grises, como en la app */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[8px] font-semibold uppercase leading-tight tracking-[0.05em] text-app-muted", className)}>
      {children}
    </p>
  );
}
