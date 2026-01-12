import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const mailSender = async (email, title, body) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Intervyo <no-reply@intervyo.tech>",
      to: [email],
      subject: title,
      html: body,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      throw new Error(error.message);
    }

    console.log("✅ Resend email sent, ID:", data.id);
    return data;
  } catch (err) {
    console.error("❌ Mail sender failed:", err);
    throw err;
  }
};
