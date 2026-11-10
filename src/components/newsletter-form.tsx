"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { site } from "@/config/site";
import { validate, type Subscriber } from "@/lib/subscriber";
import { cn } from "@/components/ui/primitives";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; pending: boolean }
  | { kind: "not_configured" }
  | { kind: "error" };

export function NewsletterForm() {
  const id = useId();
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<Partial<Record<keyof Subscriber, string>>>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = { name: fd.get("name"), email: fd.get("email"), company: fd.get("company") };
    const v = validate(payload);
    if (!v.ok) {
      setErrors(v.errors);
      (v.errors.name ? nameRef : emailRef).current?.focus();
      return;
    }
    setErrors({});
    setState({ kind: "submitting" });
    try {
      const res = await fetch(site.newsletter.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...v.data, company: payload.company ?? "" }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; status?: string; errors?: typeof errors };
      if (res.ok && json.ok) {
        setState({ kind: "success", pending: json.status === "pending_confirmation" });
      } else if (res.status === 503 || json.status === "not_configured") {
        setState({ kind: "not_configured" });
      } else if (res.status === 422 && json.errors) {
        setErrors(json.errors);
        setState({ kind: "idle" });
      } else {
        setState({ kind: "error" });
      }
    } catch {
      setState({ kind: "error" });
    }
  }

  if (state.kind === "success") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-lg border border-up/25 bg-up/[0.06] p-5">
        <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-up" />
        <div>
          <p className="font-medium text-fg">{state.pending ? "Revisá tu email" : "Suscripción confirmada"}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {state.pending
              ? "Te enviamos un correo para confirmar la suscripción."
              : "Vas a recibir los próximos reportes en tu casilla."}
          </p>
        </div>
      </div>
    );
  }

  const busy = state.kind === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby={`${id}-legal`} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          id={`${id}-name`}
          name="name"
          label="Nombre"
          autoComplete="given-name"
          error={errors.name}
          inputRef={nameRef}
        />
        <Field
          id={`${id}-email`}
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          inputMode="email"
          error={errors.email}
          inputRef={emailRef}
        />
      </div>
      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Empresa
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-brand px-6 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-colors duration-200 hover:bg-[#2b88e0] disabled:cursor-progress disabled:opacity-70 sm:w-auto"
      >
        {busy ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
        {busy ? "Enviando…" : "Suscribirme"}
        {!busy ? <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" /> : null}
      </button>

      <div aria-live="polite">
        {state.kind === "not_configured" ? (
          <Notice>
            La suscripción por email todavía no está activa. Mientras tanto, podés seguir el newsletter en{" "}
            <a
              href={site.newsletter.linkedinNewsletterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-azure underline decoration-azure/40 underline-offset-4 hover:decoration-azure"
            >
              LinkedIn
            </a>
            .
          </Notice>
        ) : null}
        {state.kind === "error" ? <Notice>No pudimos registrar la suscripción. Probá de nuevo en unos minutos.</Notice> : null}
      </div>

      <p id={`${id}-legal`} className="text-[12.5px] leading-relaxed text-subtle">
        Sin spam. Podés darte de baja en cualquier momento. El contenido es informativo y no constituye recomendación de
        inversión.
      </p>
    </form>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2.5 rounded-md border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted">
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-sky" />
      <span>{children}</span>
    </p>
  );
}

function Field({
  id,
  label,
  error,
  inputRef,
  ...input
}: {
  id: string;
  label: string;
  error?: string;
  inputRef: React.Ref<HTMLInputElement>;
} & React.ComponentPropsWithoutRef<"input">) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "block min-h-12 w-full rounded-md border bg-ink px-4 text-[15px] text-fg placeholder:text-subtle transition-[border-color,box-shadow] duration-200 outline-none",
          "focus:border-azure focus:shadow-[0_0_0_3px_rgba(96,165,250,0.18)] focus-visible:outline-none",
          error ? "border-down/60" : "border-line hover:border-[#2c4664]",
        )}
        {...input}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-down">
          {error}
        </p>
      ) : null}
    </div>
  );
}
