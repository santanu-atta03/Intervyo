const otpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Your OTP Code</title>
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
                  Verify Your Email
                </h2>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="
                padding-top:16px;
                font-size:14px;
                color:#374151;
                line-height:1.6;
              ">
                Hello,<br /><br />
                Use the following One-Time Password (OTP) to complete your verification.
                This code is valid for <strong>5 minutes</strong>.
              </td>
            </tr>

            <!-- OTP Box -->
            <tr>
              <td align="center" style="padding:24px 0;">
                <div style="
                  display:inline-block;
                  background:#f9fafb;
                  border:1px dashed #d1d5db;
                  border-radius:8px;
                  padding:14px 28px;
                  font-size:28px;
                  letter-spacing:6px;
                  font-weight:600;
                  color:#111827;
                ">
                  ${otp}
                </div>
              </td>
            </tr>

            <!-- Footer Text -->
            <tr>
              <td style="
                font-size:13px;
                color:#6b7280;
                line-height:1.5;
              ">
                If you didn’t request this, you can safely ignore this email.
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
                Regards,<br />
                <strong>Intervyo Team</strong>
              </td>
            </tr>

          </table>

          <!-- Footer -->
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

export default otpEmailTemplate;
