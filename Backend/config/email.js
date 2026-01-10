import nodemailer from 'nodemailer';

export const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: process.env.MAIL_HOST,
      // port: 587,
      // secure: false,
      service : "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Intervyo" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};