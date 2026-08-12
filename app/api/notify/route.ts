import { Resend } from "resend";

// Lazy statt Modulebene — siehe Kommentar in app/api/contact/route.ts.
function getResendClient(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

const SENDER = "Werle Technologies <kontakt@mail.labrechner.de>";
const RECIPIENT = "werle.business@gmail.com";

const VALID_PRODUCTS = ["alibi", "coparents"] as const;
type Product = (typeof VALID_PRODUCTS)[number];

interface NotifyPayload {
  email?: unknown;
  product?: unknown;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidProduct(value: unknown): value is Product {
  return (
    typeof value === "string" &&
    (VALID_PRODUCTS as readonly string[]).includes(value)
  );
}

export async function POST(req: Request) {
  let body: NotifyPayload;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const { email, product } = body;

  if (!isNonEmptyString(email) || !isValidProduct(product)) {
    return Response.json(
      { error: "Pflichtfeld fehlt oder ungültig" },
      { status: 400 },
    );
  }

  const { error } = await getResendClient().emails.send({
    from: SENDER,
    to: RECIPIENT,
    replyTo: email,
    subject: `Vormerkung: ${product}`,
    text: `Neue E-Mail-Vormerkung für ${product}: ${email}`,
  });

  if (error) {
    console.error("[api/notify] Resend-Fehler:", error);
    return Response.json({ error: "Versand fehlgeschlagen" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
