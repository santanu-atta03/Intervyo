


import  nodemailer from "nodemailer"
// require("dotenv").config();

const sendGreetingEmail = async (toEmail, userName = "") => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  
      pass: process.env.EMAIL_PASS,  
    },
  });

  const mailOptions = {
  from: `"IndiAbode" <${process.env.EMAIL_USER}>`,
  to: toEmail,
  subject: "Welcome to IndiAbode 🏡",
  html: `
    <div style="background-color:#f7f7f7; padding:40px 20px; font-family: Arial, Helvetica, sans-serif;">
      <table style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden;">
        
        <!-- Header -->
        <tr>
          <td style="padding:30px; text-align:center; background:#000000;">
            <h1 style="color:#ffffff; font-size:26px; margin:0;">
              Welcome to IndiAbode
            </h1>
            <p style="color:#cccccc; margin-top:8px; font-size:14px;">
              Your stay, your way.
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:30px;">
            <p style="font-size:16px; color:#333333;">
              Hi ${userName || "there"},
            </p>

            <p style="font-size:15px; color:#555555; line-height:1.6;">
              We’re excited to have you on <strong>IndiAbode</strong> 🎉  
              Discover unique homes, book memorable stays, and experience hospitality like never before.
            </p>

            <div style="text-align:center; margin:30px 0;">
              <a href="http://localhost:5173"
                 style="display:inline-block; background:#ff385c; color:#ffffff;
                        padding:14px 28px; border-radius:30px; font-size:16px;
                        text-decoration:none;">
                Explore Listings
              </a>
            </div>

            <p style="font-size:14px; color:#666666;">
              If you need help, our support team is always here for you.
            </p>

            <p style="font-size:14px; color:#666666;">
              Happy hosting & traveling,<br/>
              <strong>Team IndiAbode</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px; background:#f2f2f2; text-align:center; font-size:12px; color:#888888;">
            © ${new Date().getFullYear()} IndiAbode. All rights reserved.
          </td>
        </tr>

      </table>
    </div>
  `
};



  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Greeting email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending greeting email:", error);
    return false;
  }
};

export default sendGreetingEmail;

