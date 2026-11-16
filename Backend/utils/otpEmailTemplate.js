
const otpEmailTemplate = (otp) => {
  return `
    <h2 style="
      margin: 0 0 12px;
      color: #18181b;
      font-size: 22px;
      font-weight: 600;
      text-align: center;
    ">
      Verify your email address
    </h2>

    <p style="
      margin: 0 0 25px;
      color: #71717a;
      text-align: center;
      font-size: 14px;
    ">
      Thanks for joining Intervyo.
      Enter the verification code below to continue.
    </p>

    <div style="
      margin: 25px 0;
      padding: 22px;
      background: #f4f4f5;
      border-radius: 10px;
      text-align: center;
    ">
      <span style="
        color: #18181b;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 9px;
      ">
        ${String(otp).replace(/[&<>"']/g, "")}
      </span>
    </div>

    <p style="
      margin: 0;
      color: #71717a;
      font-size: 13px;
      text-align: center;
    ">
      This verification code expires in
      <strong>5 minutes</strong>.
    </p>
  `;
};

export default otpEmailTemplate;
