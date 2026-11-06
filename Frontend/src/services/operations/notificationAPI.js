import { apiConnector } from "../apiConnector";
import { notify } from "../../utils/sileoNotifications";
import { BASE_URL } from "../apis";

// Get all notifications
export const getNotifications = async (token, params = {}) => {
  try {
    if (!token) {
      return { data: { data: [], unreadCount: 0, count: 0, success: false } };
    }

    const { limit = 20, skip = 0, unreadOnly = false } = params;

    const response = await apiConnector(
      "GET",
      `${BASE_URL}/notifications?limit=${limit}&skip=${skip}&unreadOnly=${unreadOnly}`,
      null,
      { Authorization: `Bearer ${token}` },
    );

    if (!response?.data?.success) {
      throw new Error(
        response?.data?.message || "Failed to fetch notifications",
      );
    }

    return response;
  } catch (error) {
    // Silently fail for auth errors (user not logged in)
    if (error?.response?.status === 401) {
      return { data: { data: [], unreadCount: 0, count: 0, success: false } };
    }
    
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Failed to fetch notifications";
    
    console.error("Error fetching notifications:", error);
    throw new Error(message);
  }
};

// Get unread count
export const getUnreadCount = async (token) => {
  try {
    if (!token) {
      return 0;
    }

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
  } catch {
    // Silently return 0 for any errors
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

    notify.success("All notifications marked as read");
    return response.data;
  } catch (error) {
    notify.error("Failed to mark notifications as read");
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
    notify.error("Failed to delete notification");
    throw error;
  }
};

// Clear all read notifications
export const clearReadNotifications = async (token) => {
  const clearOperation = async () => {
    const response = await apiConnector(
      "DELETE",
      `${BASE_URL}/notifications/read/clear`,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  };

  return notify.promise(clearOperation(), {
    loading: { title: "Clearing notifications..." },
    success: {
      title: "Success",
      description: "Read notifications cleared",
    },
    error: {
      title: "Something Went Wrong",
      description: "Failed to clear notifications",
    },
  });
};
