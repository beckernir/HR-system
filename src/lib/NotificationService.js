import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SOCKET_URL = "http://localhost:9005/ws"; // Adjust based on your backend configuration

class NotificationService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.subscriptions = new Map();
    this.messageHandlers = new Set();
  }

  connect(username) {
    if (this.client && this.isConnected) {
      console.log("Already connected to WebSocket");
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => {
          console.log("STOMP Debug:", str);
        },
        onConnect: (frame) => {
          console.log("Connected to WebSocket", frame);
          this.isConnected = true;
          this.reconnectAttempts = 0;

          // Subscribe to user-specific notification queue
          const subscription = this.client.subscribe(
            "/user/queue/notifications",
            (message) => {
              try {
                const notification = JSON.parse(message.body);
                this.handleNotification(notification);
              } catch (error) {
                console.error("Error parsing notification:", error);
              }
            }
          );

          this.subscriptions.set("notifications", subscription);
          resolve();
        },
        onStompError: (frame) => {
          console.error("STOMP Error:", frame.headers["message"]);
          console.error("Error details:", frame.body);
          this.isConnected = false;
          reject(
            new Error(frame.headers["message"] || "WebSocket connection failed")
          );
        },
        onDisconnect: () => {
          console.log("Disconnected from WebSocket");
          this.isConnected = false;
        },
        onWebSocketError: (error) => {
          console.error("WebSocket Error:", error);
          this.isConnected = false;
        },
      });

      // Store username for reconnection
      this.username = username;

      try {
        this.client.activate();
      } catch (error) {
        console.error("Failed to activate WebSocket client:", error);
        reject(error);
      }
    });
  }

  handleNotification(notification) {
    console.log("Received notification:", notification);

    // Notify all registered handlers
    this.messageHandlers.forEach((handler) => {
      try {
        handler(notification);
      } catch (error) {
        console.error("Error in notification handler:", error);
      }
    });

    // Show browser notification if permission granted
    this.showBrowserNotification(notification);
  }

  addMessageHandler(handler) {
    this.messageHandlers.add(handler);

    // Return unsubscribe function
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  showBrowserNotification(notification) {
    if (Notification.permission === "granted") {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: "/notification-icon.png", // Add your app icon
        badge: "/notification-badge.png",
        tag: `notification-${notification.id}`,
        requireInteraction: true,
      });

      browserNotification.onclick = () => {
        window.focus();
        // You can add navigation logic here based on notification type
        browserNotification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }

  async requestNotificationPermission() {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return Notification.permission === "granted";
  }

  disconnect() {
    if (this.client && this.client.active) {
      // Unsubscribe from all subscriptions
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      this.client.deactivate();
      this.isConnected = false;
      console.log("WebSocket disconnected");
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create singleton instance
const notificationService = new NotificationService();
export default notificationService;
