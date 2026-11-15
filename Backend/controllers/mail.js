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

const sendGreetingEmail = async (toEmail, userName = "") => {
  const greetingName = escapeHtml(userName || "there");
  await mailSender(
    toEmail,
    "Welcome to Intervyo",
    `
      <div style="font-family: Arial, sans-serif; color: #17211f;">
        <h1>Welcome to Intervyo</h1>
        <p>Hi ${greetingName},</p>
        <p>Your account is ready. Start practicing interviews and building confidence with Intervyo.</p>
        <p>The Intervyo Team</p>
      </div>
    `,
    `Hi ${userName || "there"}, your account is ready. Start practicing interviews with Intervyo.`,
  );
  return true;
};

export default sendGreetingEmail;
