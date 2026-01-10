// import nodemailer from 'nodemailer';

// export const mailSender = async (email, title, body) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       // host: process.env.MAIL_HOST,
//       // port: 587,
//       // secure: false,
//       service : "gmail",
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//     });

//     const info = await transporter.sendMail({
//       from: `"Intervyo" <${process.env.MAIL_USER}>`,
//       to: email,
//       subject: title,
//       html: body,
//     });

//     console.log('Email sent successfully:', info.messageId);
//     return info;
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const mailSender = async (email, title, body) => {
  try {
    const response = await resend.emails.send({
      from: "Intervyo <onboarding@resend.dev>",
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent via Resend:", response.id);
    return response;
  } catch (error) {
    console.error("Resend email error:", error);
    throw error;
  }
};
