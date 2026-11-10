import { subscribe, validate } from "@/lib/newsletter";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, status: "invalid" }, { status: 400 });
  }

  // Honeypot anti-bots: un campo oculto que una persona nunca completa.
  if (body && typeof body === "object" && "company" in body && (body as { company?: string }).company) {
    return Response.json({ ok: true, status: "subscribed" });
  }

  const v = validate(body);
  if (!v.ok) return Response.json({ ok: false, status: "invalid", errors: v.errors }, { status: 422 });

  const result = await subscribe(v.data);
  if (result.ok) return Response.json(result, { status: 200 });
  if (result.status === "not_configured") return Response.json(result, { status: 503 });
  console.error("[newsletter]", result.message);
  return Response.json({ ok: false, status: "provider_error" }, { status: 502 });
}
