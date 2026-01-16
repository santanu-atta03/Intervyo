import { apiConnector } from "../apiConnector";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.REACT_APP_BASE_URL;

// Get all notifications
export const getNotifications = async (token, params = {}) => {
  const toastId = toast.loading("Loading notifications...");

  try {
    if (!token) {
      throw new Error("No authentication token found");
    }

    const { limit = 20, skip = 0, unreadOnly = false } = params;

    const response = await apiConnector(
      "GET",
      `${BASE_URL}/notifications?limit=${limit}&skip=${skip}&unreadOnly=${unreadOnly}`,
      null,
      { Authorization: `Bearer ${token}` },
    );
    console.log("Res : ",response)
    toast.dismiss(toastId);

    if (!response?.data?.success) {
      throw new Error(
        response?.data?.message || "Failed to fetch notifications",
      );
    }

    return response;
  } catch (error) {
    toast.dismiss(toastId);
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Failed to fetch notifications";
    toast.error(message);
    throw new Error(message);
  }
};

// Get unread count
export const getUnreadCount = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${BASE_URL}/notifications/unread-count`,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.count;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId, token) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${BASE_URL}/notifications/${notificationId}/read`,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (token) => {
  try {
    const response = await apiConnector(
      "PATCH",
      `${BASE_URL}/notifications/read-all`,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("All notifications marked as read");
    return response.data;
  } catch (error) {
    toast.error("Failed to mark notifications as read");
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId, token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${BASE_URL}/notifications/${notificationId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    toast.error("Failed to delete notification");
    throw error;
  }
};

// Clear all read notifications
export const clearReadNotifications = async (token) => {
  const toastId = toast.loading("Clearing notifications...");
  try {
    const response = await apiConnector(
      "DELETE",
      `${BASE_URL}/notifications/read/clear`,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );

    toast.dismiss(toastId);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Read notifications cleared");
    return response.data;
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Failed to clear notifications");
    throw error;
  }
};
