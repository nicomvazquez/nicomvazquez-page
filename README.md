# Nicolás Vazquez Pizzi — Landing

Landing de marca personal: mercados financieros, finanzas cuantitativas y tecnología.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide.

```bash
npm install
cp .env.example .env.local   # completar lo que corresponda
npm run dev                  # http://localhost:3000
npm run build && npm start
```

## Dónde se configura todo

| Qué | Dónde |
|---|---|
| Nombre, bio, email, LinkedIn, GitHub, URLs de proyectos, referido ALyC | `src/config/site.ts` (o variables `NEXT_PUBLIC_*`) |
| Credenciales del newsletter | variables de servidor en `.env.local` (ver `.env.example`) |
| Tokens de diseño (colores, fuentes) | `src/app/globals.css` → bloques `@theme` |

Ningún componente tiene URLs ni datos personales escritos a mano.

## Pendiente de configurar antes de publicar

1. **`NEXT_PUBLIC_SITE_URL`**: dominio final. Sin esto, canonical, Open Graph y sitemap apuntan a `localhost`.
2. **`NEXT_PUBLIC_MARKET_MONITOR_URL`**: URL de producción del monitor. Hasta entonces, "Acceder al monitor" se muestra deshabilitado con la leyenda "URL de producción pendiente de configurar".
3. **`NEXT_PUBLIC_ALYC_REFERRAL_URL`** (y opcionalmente `NEXT_PUBLIC_ALYC_NAME`): enlace de referido. Mismo comportamiento: botón deshabilitado hasta configurarlo.
4. **Newsletter**: ver abajo.
5. **Capturas reales (opcional)**: poné las imágenes en `public/screens/` y definí `NEXT_PUBLIC_BOT_SCREENSHOT=/screens/bot.png` y/o `NEXT_PUBLIC_MONITOR_SCREENSHOT=/screens/monitor.png`. Reemplazan los mockups y se optimizan con `next/image` (AVIF/WebP).

## Newsletter

El formulario envía `POST /api/newsletter` con `{ name, email }`. El handler (`src/app/api/newsletter/route.ts`) valida el payload, filtra bots con un honeypot y delega en `src/lib/newsletter.ts`.

| `NEWSLETTER_PROVIDER` | Variables | Notas |
|---|---|---|
| `brevo` | `BREVO_API_KEY`, `BREVO_LIST_ID` | Crea o actualiza el contacto en la lista. |
| `resend` | `RESEND_API_KEY`, `RESEND_AUDIENCE_ID` | Endpoint de contactos por audience; verificalo contra la versión actual de la API de Resend. |
| `mailchimp` | `MAILCHIMP_API_KEY`, `MAILCHIMP_LIST_ID` | Doble opt-in (`status: pending`): la UI avisa "Revisá tu email". |
| `custom` | `NEWSLETTER_ENDPOINT`, `NEWSLETTER_ENDPOINT_TOKEN` (opcional) | Reenvía `{ name, email, source }` a tu webhook. |
| `none` (default) | — | La API responde `503 not_configured`. |

**Sin proveedor configurado nunca se simula una suscripción exitosa.** El formulario informa que la suscripción todavía no está activa y ofrece el newsletter de LinkedIn como alternativa.

## Datos y honestidad visual

- Los gráficos del hero, del bot y del reporte usan **series sintéticas deterministas** (`src/lib/demo-data.ts`) y están rotulados como ilustrativos ("Demo · no real", "Curvas sintéticas", "Ilustrativo").
- El mockup del bot (`src/components/visuals/bot-mockup/`) reconstruye las pantallas reales **Resumen** y **Backtesting → Robustness** con la **paleta clara original de la app** (tokens `app-*` en `globals.css`, tomados de `app/ui/layout.py`). Las dos ventanas están apiladas: el selector "Operación en vivo / Investigación y validación" las intercambia. Usa **datos de demostración** de semilla fija (`data.ts`): KPIs, curva y tabla salen de la misma serie sintética, así que son coherentes entre sí y no son resultados de ninguna cuenta. Cada ventana lleva la etiqueta "Datos de demostración".
- El mockup del monitor reproduce el layout real **sin cifras**: las celdas numéricas son barras neutras.

## Calidad

- Mobile-first, sin scroll horizontal (verificado a 390, 768, 1024 y 1440 px).
- Las animaciones de entrada no ocultan contenido sin JS, para crawlers ni con `prefers-reduced-motion`.
- Metadata, Open Graph (imagen generada en `opengraph-image.tsx`), `robots.txt`, `sitemap.xml` y JSON-LD `Person`.
- Foco visible, skip link, etiquetas de formulario visibles, errores asociados por `aria-describedby` y avisos con `aria-live`.
- Headers de seguridad básicos en `next.config.ts`.
