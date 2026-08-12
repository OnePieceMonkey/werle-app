import { beforeEach, describe, expect, test, vi } from "vitest";

const sendMock = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const { POST } = await import("./route");

describe("POST /api/contact", () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  test("sendet gültige Kontakt-Anfrage per Resend", async () => {
    sendMock.mockResolvedValueOnce({ data: { id: "abc123" }, error: null });

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@example.com",
        message: "Hallo",
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Werle Technologies <kontakt@mail.labrechner.de>",
        to: "werle.business@gmail.com",
        replyTo: "test@example.com",
        subject: "Kontaktanfrage von Test",
        text: "Hallo",
      }),
    );
  });

  test("lehnt fehlende Felder ab", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "", email: "", message: "" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Pflichtfeld fehlt" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  test("gibt 502 zurück, wenn Resend einen Fehler meldet", async () => {
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { message: "boom", statusCode: 500, name: "internal_server_error" },
    });

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@example.com",
        message: "Hallo",
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(502);
  });
});
