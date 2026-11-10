// Validación compartida por el formulario (cliente) y la API (servidor).
export type Subscriber = { name: string; email: string };

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(input: unknown): { ok: true; data: Subscriber } | { ok: false; errors: Partial<Record<keyof Subscriber, string>> } {
  const o = (input ?? {}) as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim().toLowerCase() : "";
  const errors: Partial<Record<keyof Subscriber, string>> = {};
  if (name.length < 2) errors.name = "Ingresá tu nombre.";
  else if (name.length > 80) errors.name = "El nombre es demasiado largo.";
  if (!EMAIL_RE.test(email) || email.length > 254) errors.email = "Ingresá un email válido.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: { name, email } };
}
