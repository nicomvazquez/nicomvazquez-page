/**
 * Integración de newsletter (sólo servidor).
 *
 * Elegí el proveedor con NEWSLETTER_PROVIDER y completá sus variables
 * (ver README → "Newsletter"). Mientras no haya un proveedor configurado,
 * `subscribe` devuelve `not_configured` y la UI lo informa con honestidad:
 * nunca se simula una suscripción exitosa.
 */

export type Provider = "brevo" | "resend" | "mailchimp" | "custom" | "none";

export type SubscribeResult =
  | { ok: true; status: "subscribed" | "pending_confirmation" }
  | { ok: false; status: "not_configured" | "invalid" | "provider_error"; message?: string };

import type { Subscriber } from "./subscriber";
export { validate } from "./subscriber";
export type { Subscriber };

export function getProvider(): Provider {
  const p = (process.env.NEWSLETTER_PROVIDER ?? "none").toLowerCase();
  return (["brevo", "resend", "mailchimp", "custom"].includes(p) ? p : "none") as Provider;
}

const need = (...keys: string[]) => keys.every((k) => (process.env[k] ?? "").trim().length > 0);

export function isNewsletterConfigured(): boolean {
  switch (getProvider()) {
    case "brevo":
      return need("BREVO_API_KEY", "BREVO_LIST_ID");
    case "resend":
      return need("RESEND_API_KEY", "RESEND_AUDIENCE_ID");
    case "mailchimp":
      return need("MAILCHIMP_API_KEY", "MAILCHIMP_LIST_ID");
    case "custom":
      return need("NEWSLETTER_ENDPOINT");
    default:
      return false;
  }
}

async function post(url: string, init: RequestInit) {
  const res = await fetch(url, { ...init, method: "POST", signal: AbortSignal.timeout(8000) });
  return res;
}

export async function subscribe({ name, email }: Subscriber): Promise<SubscribeResult> {
  if (!isNewsletterConfigured()) return { ok: false, status: "not_configured" };

  const env = process.env;
  try {
    switch (getProvider()) {
      case "brevo": {
        // https://developers.brevo.com/reference/createcontact
        const res = await post("https://api.brevo.com/v3/contacts", {
          headers: { "api-key": env.BREVO_API_KEY!, "content-type": "application/json", accept: "application/json" },
          body: JSON.stringify({
            email,
            attributes: { FIRSTNAME: name },
            listIds: [Number(env.BREVO_LIST_ID)],
            updateEnabled: true,
          }),
        });
        if (res.ok || res.status === 204) return { ok: true, status: "subscribed" };
        return { ok: false, status: "provider_error", message: `brevo ${res.status}` };
      }
      case "resend": {
        // https://resend.com/docs/api-reference/contacts/create-contact
        const res = await post(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
          headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
          body: JSON.stringify({ email, first_name: name, unsubscribed: false }),
        });
        if (res.ok) return { ok: true, status: "subscribed" };
        return { ok: false, status: "provider_error", message: `resend ${res.status}` };
      }
      case "mailchimp": {
        // https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/
        const key = env.MAILCHIMP_API_KEY!;
        const dc = key.split("-")[1];
        const res = await post(`https://${dc}.api.mailchimp.com/3.0/lists/${env.MAILCHIMP_LIST_ID}/members`, {
          headers: {
            authorization: `Basic ${Buffer.from(`any:${key}`).toString("base64")}`,
            "content-type": "application/json",
          },
          // "pending" = doble opt-in: Mailchimp envía el email de confirmación.
          body: JSON.stringify({ email_address: email, status: "pending", merge_fields: { FNAME: name } }),
        });
        if (res.ok) return { ok: true, status: "pending_confirmation" };
        const body = (await res.json().catch(() => ({}))) as { title?: string };
        if (body.title === "Member Exists") return { ok: true, status: "subscribed" };
        return { ok: false, status: "provider_error", message: `mailchimp ${res.status}` };
      }
      case "custom": {
        // Webhook propio (p. ej. Make, Zapier, una función serverless).
        const res = await post(env.NEWSLETTER_ENDPOINT!, {
          headers: {
            "content-type": "application/json",
            ...(env.NEWSLETTER_ENDPOINT_TOKEN ? { authorization: `Bearer ${env.NEWSLETTER_ENDPOINT_TOKEN}` } : {}),
          },
          body: JSON.stringify({ name, email, source: "landing" }),
        });
        if (res.ok) return { ok: true, status: "subscribed" };
        return { ok: false, status: "provider_error", message: `custom ${res.status}` };
      }
      default:
        return { ok: false, status: "not_configured" };
    }
  } catch (e) {
    return { ok: false, status: "provider_error", message: e instanceof Error ? e.message : "unknown" };
  }
}
