import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER = "Werle Technologies <kontakt@mail.labrechner.de>";
const RECIPIENT = "werle.business@gmail.com";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const { name, email, message } = body;

  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(message)
  ) {
    return Response.json({ error: "Pflichtfeld fehlt" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: SENDER,
    to: RECIPIENT,
    replyTo: email,
    subject: `Kontaktanfrage von ${name}`,
    text: message,
  });

  if (error) {
    console.error("[api/contact] Resend-Fehler:", error);
    return Response.json({ error: "Versand fehlgeschlagen" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
