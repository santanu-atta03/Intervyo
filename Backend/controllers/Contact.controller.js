import Contact from "../models/Contact.model.js";
import { mailSender } from "../config/email.js";

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const createContactNotification = ({ name, email, subject, message }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);
  const text = [
    "New contact message for Intervyo",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
  ].join("\n");

  return {
    subject: `New contact message: ${subject.replace(/[\r\n]+/g, " ").trim()}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #17211f; max-width: 640px; margin: 0 auto;">
        <h1 style="font-size: 22px;">New contact message</h1>
        <p style="color: #52615b;">Someone submitted the Intervyo contact form.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tbody>
            <tr>
              <th scope="row" style="text-align: left; vertical-align: top; padding: 10px; border: 1px solid #d8e0dc; background: #f3f6f4;">Name</th>
              <td style="padding: 10px; border: 1px solid #d8e0dc;">${safeName}</td>
            </tr>
            <tr>
              <th scope="row" style="text-align: left; vertical-align: top; padding: 10px; border: 1px solid #d8e0dc; background: #f3f6f4;">Email</th>
              <td style="padding: 10px; border: 1px solid #d8e0dc;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
            </tr>
            <tr>
              <th scope="row" style="text-align: left; vertical-align: top; padding: 10px; border: 1px solid #d8e0dc; background: #f3f6f4;">Subject</th>
              <td style="padding: 10px; border: 1px solid #d8e0dc;">${safeSubject}</td>
            </tr>
            <tr>
              <th scope="row" style="text-align: left; vertical-align: top; padding: 10px; border: 1px solid #d8e0dc; background: #f3f6f4;">Message</th>
              <td style="padding: 10px; border: 1px solid #d8e0dc; white-space: pre-wrap;">${safeMessage}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    text,
  };
};

export const contactUs = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    const inboxEmail =
      process.env.CONTACT_EMAIL_TO?.trim() || "intervyo.team@gmail.com";
    let emailSent = false;
    let confirmationEmailSent = false;

    try {
      const notification = createContactNotification({
        name,
        email,
        subject,
        message,
      });
      await mailSender(
        inboxEmail,
        notification.subject,
        notification.html,
        notification.text,
      );
      emailSent = true;
    } catch (emailError) {
      console.error("Error sending contact notification email:", emailError);
    }

    try {
      await mailSender(
        email,
        "Contact Us - Intervyo",
        `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            <p>Dear ${escapeHtml(name)},</p>
            <p>Thank you for reaching out to Intervyo.</p>
            <p>We have received your message regarding "<strong>${escapeHtml(subject)}</strong>" and our support team will review it shortly.</p>
            <p>Here is a copy of your message:</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; italic">
              "${escapeHtml(message)}"
            </div>
            <br/>
            <p>Best Regards,</p>
            <p>The Intervyo Team</p>
          </div>
        `,
        `Dear ${name}, we received your message about "${subject}" and our support team will review it shortly.`,
      );
      confirmationEmailSent = true;
    } catch (emailError) {
      console.error("Error sending acknowledgment email:", emailError);
    }

    return res.status(emailSent ? 200 : 202).json({
      success: true,
      message: emailSent
        ? "Message sent successfully"
        : "Your message was saved, but we couldn't notify our team by email. Please contact intervyo.team@gmail.com directly.",
      emailSent,
      confirmationEmailSent,
      data: contact,
    });
  } catch (error) {
    console.error("Contact Us Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending message",
    });
  }
};
