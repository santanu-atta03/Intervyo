export const mailSender = async (email, subject, html, text) => {
  const serviceUrl = process.env.OTP_MAIL_SERVICE_URL;
  const serviceToken = process.env.OTP_MAIL_SERVICE_TOKEN;

  if (!serviceUrl || !serviceToken) {
    throw new Error(
      "Email delivery is not configured. Set OTP_MAIL_SERVICE_URL and OTP_MAIL_SERVICE_TOKEN.",
    );
  }

  let response;
  try {
    response = await fetch(serviceUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject,
        html,
        text,
        fromName: "Intervyo",
      }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    console.error("Email service request failed:", error.message);
    throw new Error("Email delivery service could not be reached.");
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    console.error("Email service returned an invalid response:", error.message);
    throw new Error("Email delivery service returned an invalid response.");
  }

  if (!response.ok || result.success !== true) {
    console.error("Email service rejected delivery:", response.status);
    throw new Error("Email delivery failed. Please try again later.");
  }

  return { id: result.messageId || null };
};
