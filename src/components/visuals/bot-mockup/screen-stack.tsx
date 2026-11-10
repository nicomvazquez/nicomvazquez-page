"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/components/ui/primitives";

type Key = "live" | "research";

const areas: { key: Key; n: string; label: string; short: string }[] = [
  { key: "live", n: "01", label: "Operación en vivo", short: "En vivo" },
  { key: "research", n: "02", label: "Investigación y validación", short: "Investigación" },
];

/**
 * Dos ventanas apiladas en profundidad: la del frente se ve completa y la de
 * atrás asoma (barra y módulos). El selector o un clic en la ventana de atrás
 * las intercambia. Ambas comparten celda de grid, así que el alto total es el
 * de una sola ventana más el asomo.
 */
export function ScreenStack({ live, research }: { live: ReactNode; research: ReactNode }) {
  const [front, setFront] = useState<Key>("live");
  const screens: Record<Key, ReactNode> = { live, research };

  return (
    <div>
      <div role="group" aria-label="Área del producto" className="mb-4 flex w-full rounded-lg border border-line bg-ink-2 p-1 sm:inline-flex sm:w-auto">
        {areas.map((a) => (
          <button
            key={a.key}
            type="button"
            aria-pressed={front === a.key}
            onClick={() => setFront(a.key)}
            className={cn(
              "inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-3 text-[12.5px] transition-colors duration-200 sm:min-h-9 sm:flex-none",
              front === a.key ? "bg-surface text-fg shadow-[inset_0_0_0_1px_var(--color-line)]" : "text-muted hover:text-fg",
            )}
          >
            <span className={cn("font-mono text-[10.5px]", front === a.key ? "text-sky" : "text-subtle")}>{a.n}</span>
            <span className="sm:hidden">{a.short}</span>
            <span className="hidden sm:inline">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 pt-[52px] sm:pt-[62px] [grid-template-areas:'stack']">
        {areas.map((a) => {
          const isFront = front === a.key;
          return (
            <div
              key={a.key}
              aria-hidden={!isFront}
              onClick={isFront ? undefined : () => setFront(a.key)}
              className={cn(
                "[grid-area:stack] origin-top transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                isFront
                  ? "z-10"
                  : "z-0 -translate-y-[52px] translate-x-3 scale-[0.955] cursor-pointer opacity-60 hover:opacity-85 sm:-translate-y-[62px] sm:translate-x-6",
              )}
            >
              {screens[a.key]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
