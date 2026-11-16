import { jest } from "@jest/globals";

const createContact = jest.fn();
const mailSender = jest.fn();

jest.unstable_mockModule("../models/Contact.model.js", () => ({
  default: { create: createContact },
}));
jest.unstable_mockModule("../config/email.js", () => ({
  mailSender,
}));

const { contactUs } = await import("../controllers/Contact.controller.js");

const createResponse = () => {
  const response = {};
  response.status = jest.fn(() => response);
  response.json = jest.fn(() => response);
  return response;
};

describe("Contact form notifications", () => {
  const body = {
    name: "Sam <script>",
    email: "sam@example.com",
    subject: "Help & support",
    message: "I need help with <my account>.",
  };
  const savedContact = { ...body, _id: "contact-123" };

  beforeEach(() => {
    createContact.mockReset().mockResolvedValue(savedContact);
    mailSender.mockReset().mockResolvedValue({ id: "mail-123" });
    process.env.CONTACT_EMAIL_TO = "owner@gmail.com";
  });

  it("sends a structured, escaped notification to the configured inbox", async () => {
    const response = createResponse();

    await contactUs({ body }, response);

    expect(createContact).toHaveBeenCalledWith(body);
    expect(mailSender).toHaveBeenNthCalledWith(
      1,
      "owner@gmail.com",
      "New contact message: Help & support",
      expect.stringContaining("<th scope=\"row\""),
      expect.stringContaining("Email: sam@example.com"),
    );
    const notificationHtml = mailSender.mock.calls[0][2];
    expect(notificationHtml).toContain("Sam &lt;script&gt;");
    expect(notificationHtml).toContain("Help &amp; support");
    expect(notificationHtml).toContain("I need help with &lt;my account&gt;.");
    expect(notificationHtml).not.toContain("<script>");
    expect(mailSender).toHaveBeenNthCalledWith(
      2,
      "sam@example.com",
      "Contact Us - Intervyo",
      expect.any(String),
      expect.any(String),
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        emailSent: true,
        confirmationEmailSent: true,
      }),
    );
  });

  it("reports when the inbox notification fails while keeping the message saved", async () => {
    mailSender
      .mockRejectedValueOnce(new Error("Mail provider unavailable"))
      .mockResolvedValueOnce({ id: "ack-123" });
    const response = createResponse();

    await contactUs({ body }, response);

    expect(createContact).toHaveBeenCalledWith(body);
    expect(response.status).toHaveBeenCalledWith(202);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        emailSent: false,
        confirmationEmailSent: true,
      }),
    );
  });
});
