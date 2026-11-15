import { notify } from "../../utils/sileoNotifications";
import { contactEndpoints } from "../apis.js";
import { apiConnector } from "../apiConnector.js";

const { CONTACT_US_API } = contactEndpoints;

export const submitContactForm = async (data, setLoading) => {
  if (setLoading) setLoading(true);
  const toastId = notify.loading("Sending message...");
  try {
    const response = await apiConnector("POST", CONTACT_US_API, data);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to send message");
    }

    notify.success(response.data.message || "Message sent successfully!", {
      title: response.data.emailSent === false ? "Message received" : "Success",
      description: response.data.message,
    });
    return true;
  } catch (error) {
    console.error("Contact Form Error:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to send message";
    notify.error(message, {
      title: "Something Went Wrong",
      description: message,
    });
    return false;
  } finally {
    notify.dismiss(toastId);
    if (setLoading) setLoading(false);
  }
};
