import { Resend } from "resend";

// Lazy statt Modulebene: `new Resend(undefined)` wirft sofort, und Next.js
// wertet Route-Module beim Build aus ("Collecting page data"), nicht erst
// zur Laufzeit — ein fehlender RESEND_API_KEY hätte sonst den kompletten
// Build zum Absturz gebracht, nicht nur diesen Endpunkt zur Laufzeit.
function getResendClient(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

// Absender bewusst auf mail.werle.app, seit 15.09.2026. Vorher lief der
// Versand ueber mail.labrechner.de — eine Domain, die zu einem abgegebenen
// Projekt gehoert. Waere sie ausgelaufen oder mit uebergegangen, haette
// Resend den Versand abgelehnt und dieses Formular waere still kaputt
// gewesen. Die Subdomain ist in Resend verifiziert (Region eu-west-1).
//
// werle.app traegt DMARC p=reject mit adkim=s und aspf=s. Streng genommen
// alignt nur DKIM (d=mail.werle.app), nicht SPF (Return-Path liegt auf
// send.mail.werle.app). DMARC verlangt nur eines von beiden — Testversand am
// 15.09.2026 wurde von Gmail zugestellt. Wer den Absender aendert, prueft das
// erneut, statt es anzunehmen.
const SENDER = "Werle Technologies <kontakt@mail.werle.app>";
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

  const { error } = await getResendClient().emails.send({
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
