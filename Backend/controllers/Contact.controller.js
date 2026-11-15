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
    } catch (emailError) {
      console.error("Error sending acknowledgment email:", emailError);
      return res.status(202).json({
        success: true,
        message:
          "Your message was received, but we couldn't send the confirmation email.",
        emailSent: false,
        data: contact,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      emailSent: true,
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
