import { notify } from "../../utils/sileoNotifications";
import { contactEndpoints } from "../apis.js";
import { apiConnector } from "../apiConnector.js";

const { CONTACT_US_API } = contactEndpoints;

export const submitContactForm = async (data, setLoading) => {
  if (setLoading) setLoading(true);
  try {
    const submission = apiConnector("POST", CONTACT_US_API, data).then(
      (response) => {
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to send message");
        }

        return response;
      },
    );
    await notify.promise(submission, {
      loading: { title: "Sending message..." },
      success: { title: "Message sent successfully!" },
      error: (error) => ({
        title:
          error.response?.data?.message ||
          error.message ||
          "Failed to send message",
      }),
    });
    return true;
  } catch (error) {
    console.error("Contact Form Error:", error);
    return false;
  } finally {
    if (setLoading) setLoading(false);
  }
};
