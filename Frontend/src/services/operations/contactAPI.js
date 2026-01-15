import { toast } from "react-hot-toast";
import { contactEndpoints } from "../apis.js";
import { apiConnector } from "../apiConnector.js";

const { CONTACT_US_API } = contactEndpoints;

export const submitContactForm = async (data, setLoading) => {
  const toastId = toast.loading("Sending message...");
  if (setLoading) setLoading(true);
  try {
    const response = await apiConnector("POST", CONTACT_US_API, data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Message sent successfully!");
    return true;
  } catch (error) {
    console.error("Contact Form Error:", error);
    toast.error(error.response?.data?.message || "Failed to send message");
    return false;
  } finally {
    if (setLoading) setLoading(false);
    toast.dismiss(toastId);
  }
};
