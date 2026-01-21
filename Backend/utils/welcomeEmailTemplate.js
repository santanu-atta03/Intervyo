const welcomeEmailTemplate = (name = "User") => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to Intervyo</title>
  </head>
  <body style="
    margin:0;
    padding:0;
    background-color:#f3f4f6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  ">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">

          <table width="100%" cellpadding="0" cellspacing="0" style="
            max-width:520px;
            background:#ffffff;
            border-radius:10px;
            box-shadow:0 4px 12px rgba(0,0,0,0.05);
            padding:32px;
          ">
            <!-- Header -->
            <tr>
              <td style="text-align:center;">
                <h2 style="
                  margin:0;
                  font-size:22px;
                  color:#111827;
                ">
                  Welcome to Intervyo 🎉
                </h2>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="
                padding-top:16px;
                font-size:14px;
                color:#374151;
                line-height:1.6;
              ">
                Hello <strong>${name}</strong>,<br /><br />
                Your account has been created successfully.
                We’re excited to have you onboard.
              </td>
            </tr>

            <!-- Highlight Box -->
            <tr>
              <td style="padding:20px 0;">
                <div style="
                  background:#f9fafb;
                  border:1px solid #e5e7eb;
                  border-radius:8px;
                  padding:16px;
                  font-size:14px;
                  color:#374151;
                ">
                  🚀 Start exploring Intervyo to practice interviews, track progress, and level up your skills.
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="
                font-size:13px;
                color:#6b7280;
                line-height:1.5;
              ">
                If you have any questions, feel free to reach out to our support team.
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:24px 0;">
                <hr style="border:none; border-top:1px solid #e5e7eb;" />
              </td>
            </tr>

            <!-- Signature -->
            <tr>
              <td style="
                font-size:13px;
                color:#374151;
              ">
                Best regards,<br />
                <strong>Intervyo Team</strong>
              </td>
            </tr>

          </table>

          <!-- Copyright -->
          <p style="
            margin-top:16px;
            font-size:12px;
            color:#9ca3af;
          ">
            © ${new Date().getFullYear()} Intervyo. All rights reserved.
          </p>

        </td>
      </tr>
    </table>
  </body>
</html>
`;

export default welcomeEmailTemplate;
