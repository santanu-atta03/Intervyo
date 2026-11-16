import { jest } from "@jest/globals";

process.env.OTP_MAIL_SERVICE_URL = "https://mail.example.test/api/send-otp";
process.env.OTP_MAIL_SERVICE_TOKEN = "test-service-token";

const originalFetch = globalThis.fetch;
const { mailSender } = await import("../config/email.js");

describe("OTP mail service adapter", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    process.env.OTP_MAIL_SERVICE_URL =
      "https://mail.example.test/api/send-otp";
    process.env.OTP_MAIL_SERVICE_TOKEN = "test-service-token";
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  it("sends Intervyo mail through the configured service with bearer auth", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, messageId: "mail-123" }),
    });

    await expect(
      mailSender("user@example.com", "Verify", "<p>Code</p>", "Code"),
    ).resolves.toEqual({ id: "mail-123" });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://mail.example.test/api/send-otp",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-service-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "user@example.com",
          subject: "Verify",
          html: "<p>Code</p>",
          text: "Code",
          fromName: "Intervyo",
        }),
      }),
    );
  });

  it("rejects unsuccessful delivery responses", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ success: false, message: "Unauthorized" }),
    });

    await expect(
      mailSender("user@example.com", "Verify", "<p>Code</p>"),
    ).rejects.toThrow("Email delivery failed");
  });

  it("trims whitespace around the configured service URL and project token", async () => {
    process.env.OTP_MAIL_SERVICE_URL =
      " https://mail.example.test/api/send-otp ";
    process.env.OTP_MAIL_SERVICE_TOKEN = " test-service-token ";
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await mailSender("user@example.com", "Verify", "<p>Code</p>");

    const [, requestOptions] = globalThis.fetch.mock.calls[0];
    expect(requestOptions.headers.Authorization).toMatch(/^Bearer \S+$/);
  });

  it("fails explicitly when the mail service is not configured", async () => {
    const serviceUrl = process.env.OTP_MAIL_SERVICE_URL;
    delete process.env.OTP_MAIL_SERVICE_URL;

    await expect(
      mailSender("user@example.com", "Verify", "<p>Code</p>"),
    ).rejects.toThrow("Email delivery is not configured");

    process.env.OTP_MAIL_SERVICE_URL = serviceUrl;
  });
});
