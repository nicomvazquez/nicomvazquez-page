import type { CSSProperties, ReactNode } from "react";

/**
 * Aparición suave al entrar en viewport.
 *
 * El contenido es visible por defecto (sin JS, en crawlers y con
 * prefers-reduced-motion). Sólo cuando el script inicial agrega la clase
 * `js` al <html> se aplica el estado oculto, y RevealObserver lo revela
 * al entrar en pantalla. Ver estilos [data-reveal] en globals.css.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <div data-reveal="" className={className} style={{ "--rd": `${delay}s`, "--ry": `${y}px` } as CSSProperties}>
      {children}
    </div>
  );
}
