import { OverviewScreen } from "./overview-screen";
import { RobustnessScreen } from "./robustness-screen";
import { ScreenStack } from "./screen-stack";

/**
 * Representación del Algorithmic Trading System reconstruida a partir de la
 * aplicación real: pantallas Resumen y Backtesting → Robustness.
 *
 * El interior conserva la interfaz clara original de la app (tokens app-*);
 * el entorno (selector, nota, sombra) pertenece a la estética oscura de la
 * landing. Datos de demostración, sin lógica operativa.
 *
 * Ancho máximo 880px y alto de una sola ventana: el mockup acompaña al
 * texto, no lo domina.
 */
export function BotMockup() {
  return (
    <figure
      className="mx-auto w-full max-w-[880px]"
      aria-label="Interfaz del Algorithmic Trading System: pantalla de resumen de operación en vivo y módulo de backtesting con análisis de robustez. Datos de demostración."
    >
      <ScreenStack live={<OverviewScreen className="h-full" />} research={<RobustnessScreen className="h-full" />} />
      <figcaption className="mt-4 font-mono text-[10.5px] leading-relaxed text-subtle">
        Interfaz reconstruida a partir de la aplicación real, con sus colores originales. Cifras de demostración: no son
        resultados de ninguna cuenta ni estrategia.
      </figcaption>
    </figure>
  );
}
