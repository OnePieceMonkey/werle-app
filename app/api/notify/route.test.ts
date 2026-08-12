import { beforeEach, describe, expect, test, vi } from "vitest";

const sendMock = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const { POST } = await import("./route");

describe("POST /api/notify", () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  test("sendet gültige Vormerkung per Resend", async () => {
    sendMock.mockResolvedValueOnce({ data: { id: "abc123" }, error: null });

    const req = new Request("http://localhost/api/notify", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", product: "alibi" }),
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
        subject: "Vormerkung: alibi",
      }),
    );
  });

  test("lehnt fehlende E-Mail ab", async () => {
    const req = new Request("http://localhost/api/notify", {
      method: "POST",
      body: JSON.stringify({ email: "", product: "alibi" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  test("lehnt ungültiges Produkt ab", async () => {
    const req = new Request("http://localhost/api/notify", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", product: "pulsegate" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
