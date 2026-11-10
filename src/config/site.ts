/**
 * Configuración central del sitio.
 *
 * Todo dato personal, URL o integración externa vive acá. Los componentes
 * nunca deben tener URLs ni datos personales escritos a mano.
 *
 * Los valores públicos pueden sobrescribirse con variables de entorno
 * `NEXT_PUBLIC_*` (ver `.env.example`) sin tocar código. Un string vacío
 * significa "no configurado": la UI muestra el botón deshabilitado y explica
 * que el enlace todavía no está disponible, en lugar de inventar una URL.
 */

const env = (value: string | undefined, fallback: string) =>
  value && value.trim().length > 0 ? value.trim() : fallback;

export const site = {
  name: "Nicolás Vazquez Pizzi",
  shortName: "NVP",
  role: "Financial Markets · Quantitative Finance · Technology",
  description:
    "Análisis de mercados financieros, investigación cuantitativa y desarrollo de herramientas financieras. Trading algorítmico, backtesting y sistemas de monitoreo de mercado.",
  shortBio:
    "Mercados financieros, investigación cuantitativa y tecnología aplicada al análisis de inversiones.",
  url: env(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  locale: "es_AR",

  contact: {
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "vazquezpizzinicolas@gmail.com"),
    linkedin: env(
      process.env.NEXT_PUBLIC_LINKEDIN_URL,
      "https://www.linkedin.com/in/nicolasvazquezpizzi/",
    ),
    linkedinHandle: "in/nicolasvazquezpizzi",
    github: env(process.env.NEXT_PUBLIC_GITHUB_URL, "https://github.com/nicomvazquez"),
    githubHandle: "nicomvazquez",
  },

  projects: {
    tradingBot: {
      repoUrl: env(
        process.env.NEXT_PUBLIC_BOT_REPO_URL,
        "https://github.com/nicomvazquez/trading-bot-claude",
      ),
      screenshot: env(process.env.NEXT_PUBLIC_BOT_SCREENSHOT, ""),
    },
    marketMonitor: {
      // URL de producción del monitor. Vacío = botón deshabilitado.
      url: env(process.env.NEXT_PUBLIC_MARKET_MONITOR_URL, ""),
      screenshot: env(process.env.NEXT_PUBLIC_MONITOR_SCREENSHOT, ""),
    },
  },

  newsletter: {
    // Proveedor activo: "brevo" | "resend" | "mailchimp" | "custom" | "none".
    // Las credenciales NO van acá: se leen en el servidor (src/lib/newsletter.ts).
    endpoint: "/api/newsletter",
    // Canal alternativo mientras la integración propia no esté activa.
    linkedinNewsletterUrl: env(
      process.env.NEXT_PUBLIC_LINKEDIN_NEWSLETTER_URL,
      "https://www.linkedin.com/newsletters/7391256506056196097/",
    ),
  },

  investing: {
    // Enlace de referido de la ALyC. Vacío = botón deshabilitado.
    alycReferralUrl: env(process.env.NEXT_PUBLIC_ALYC_REFERRAL_URL, ""),
    // Nombre del agente/ALyC, sólo si querés mostrarlo. Vacío = no se muestra.
    alycName: env(process.env.NEXT_PUBLIC_ALYC_NAME, ""),
  },
} as const;

export const nav = [
  { label: "Inicio", href: "#inicio" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Research", href: "#research" },
  { label: "Newsletter", href: "#newsletter" },
  { label: "Contacto", href: "#contacto" },
] as const;

export const isConfigured = (url: string) => url.length > 0;
