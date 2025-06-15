// contexts/NotificationContext.js
"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import webSocketService from "@/lib/websocketService";
import apiService from "@/lib/apiService";

// Notification types
const NOTIFICATION_TYPES = {
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  SET_NOTIFICATIONS: "SET_NOTIFICATIONS",
  MARK_AS_READ: "MARK_AS_READ",
  MARK_ALL_AS_READ: "MARK_ALL_AS_READ",
  SET_UNREAD_COUNT: "SET_UNREAD_COUNT",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Reducer
function notificationReducer(state, action) {
  switch (action.type) {
    case NOTIFICATION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case NOTIFICATION_TYPES.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        loading: false,
      };
    case NOTIFICATION_TYPES.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, read: true, readAt: new Date().toISOString() }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case NOTIFICATION_TYPES.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
          readAt: new Date().toISOString(),
        })),
        unreadCount: 0,
      };
    case NOTIFICATION_TYPES.SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload,
      };
    case NOTIFICATION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case NOTIFICATION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case NOTIFICATION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Context
const NotificationContext = createContext();

// Provider component
export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Add notification methods to API service
  useEffect(() => {
    // Add notification methods to API service if not already present
    if (!apiService.getNotifications) {
      apiService.getNotifications = async () => {
        return await apiService.get("/api/v1/notifications");
      };

      apiService.getUnreadNotifications = async () => {
        return await apiService.get("/api/v1/notifications/unread");
      };

      apiService.getUnreadNotificationsCount = async () => {
        return await apiService.get("/api/v1/notifications/unread/count");
      };

      apiService.markNotificationAsRead = async (notificationId) => {
        return await apiService.put(
          `/api/v1/notifications/${notificationId}/read`
        );
      };

      apiService.markAllNotificationsAsRead = async () => {
        return await apiService.put("/api/v1/notifications/mark-all-read");
      };

      apiService.deleteReadNotifications = async () => {
        return await apiService.delete("/api/v1/notifications/read");
      };
    }
  }, []);

  // Load initial notifications
  const loadNotifications = async () => {
    try {
      dispatch({ type: NOTIFICATION_TYPES.SET_LOADING, payload: true });
      dispatch({ type: NOTIFICATION_TYPES.CLEAR_ERROR });

      const [notifications, unreadCount] = await Promise.all([
        apiService.getNotifications(),
        apiService.getUnreadNotificationsCount(),
      ]);

      dispatch({
        type: NOTIFICATION_TYPES.SET_NOTIFICATIONS,
        payload: notifications,
      });
      dispatch({
        type: NOTIFICATION_TYPES.SET_UNREAD_COUNT,
        payload: unreadCount,
      });
    } catch (error) {
      console.error("Failed to load notifications:", error);
      dispatch({ type: NOTIFICATION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  // Initialize WebSocket connection and load notifications
  useEffect(() => {
    const token = apiService.getToken();
    if (!token) return;

    // Connect to WebSocket
    webSocketService
      .connect(token)
      .then(() => {
        console.log("WebSocket connected successfully");

        // Get current user to subscribe to their notifications
        return apiService.getCurrentUser();
      })
      .then((user) => {
        if (user && user.email) {
          // Subscribe to notifications for this user
          webSocketService.subscribeToNotifications(
            user.email,
            (notification) => {
              console.log("Received real-time notification:", notification);
              dispatch({
                type: NOTIFICATION_TYPES.ADD_NOTIFICATION,
                payload: notification,
              });

              // Show browser notification if permission granted
              if (Notification.permission === "granted") {
                new Notification(notification.title, {
                  body: notification.message,
                  icon: "/favicon.ico",
                });
              }
            }
          );
        }
      })
      .catch((error) => {
        console.error("Failed to setup WebSocket notifications:", error);
      });

    // Load initial notifications
    loadNotifications();

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  // Request notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Action creators
  const markAsRead = async (notificationId) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      dispatch({
        type: NOTIFICATION_TYPES.MARK_AS_READ,
        payload: notificationId,
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      dispatch({ type: NOTIFICATION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      dispatch({ type: NOTIFICATION_TYPES.MARK_ALL_AS_READ });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      dispatch({ type: NOTIFICATION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const deleteReadNotifications = async () => {
    try {
      await apiService.deleteReadNotifications();
      // Reload notifications after deletion
      await loadNotifications();
    } catch (error) {
      console.error("Failed to delete read notifications:", error);
      dispatch({ type: NOTIFICATION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const clearError = () => {
    dispatch({ type: NOTIFICATION_TYPES.CLEAR_ERROR });
  };

  const value = {
    ...state,
    markAsRead,
    markAllAsRead,
    deleteReadNotifications,
    clearError,
    loadNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook to use notification context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
