import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getNotifications,
  getUnreadCount,
} from "../../services/operations/notificationAPI";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Check if user is actually authenticated
  const isAuthenticated = token && user;

  // Fetch notifications
  const fetchNotifications = async (params = {}) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const data = await getNotifications(token, params);
      setNotifications(data.data?.data || []);
      setUnreadCount(data.data?.unreadCount || 0);
    } catch (error) {
      // Silently handle errors - they're already logged in the API
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;

    try {
      const count = await getUnreadCount(token);
      setUnreadCount(count);
    } catch (error) {
      // Silently handle errors
    }
  };

  // Refresh notifications
  const refreshNotifications = () => {
    if (!isAuthenticated) return;
    fetchNotifications();
    fetchUnreadCount();
  };

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    refreshNotifications,
    setNotifications,
    setUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
