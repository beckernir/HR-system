// lib/websocketService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(token) {
    if (this.connected || !token) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        // Create WebSocket connection
        const socket = new SockJS(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9005"
          }/ws`
        );

        this.client = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          debug: (str) => {
            console.log("STOMP Debug:", str);
          },
          reconnectDelay: this.reconnectDelay,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        this.client.onConnect = (frame) => {
          console.log("WebSocket Connected:", frame);
          this.connected = true;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.client.onStompError = (frame) => {
          console.error("STOMP Error:", frame.headers["message"]);
          console.error("Additional details:", frame.body);
          this.connected = false;
          reject(new Error(frame.headers["message"]));
        };

        this.client.onWebSocketError = (error) => {
          console.error("WebSocket Error:", error);
          this.connected = false;
          this.handleReconnection();
        };

        this.client.onDisconnect = () => {
          console.log("WebSocket Disconnected");
          this.connected = false;
          this.handleReconnection();
        };

        this.client.activate();
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        reject(error);
      }
    });
  }

  handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        const token = this.getToken();
        if (token) {
          this.connect(token);
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  subscribeToNotifications(username, callback) {
    if (!this.connected || !this.client) {
      console.error("WebSocket not connected");
      return null;
    }

    const destination = `/user/${username}/queue/notifications`;
    console.log("Subscribing to:", destination);

    try {
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const notification = JSON.parse(message.body);
          console.log("Received notification:", notification);
          callback(notification);
        } catch (error) {
          console.error("Error parsing notification:", error);
        }
      });

      this.subscriptions.set(username, subscription);
      return subscription;
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
      return null;
    }
  }

  unsubscribeFromNotifications(username) {
    const subscription = this.subscriptions.get(username);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(username);
    }
  }

  disconnect() {
    if (this.client && this.connected) {
      // Unsubscribe from all subscriptions
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      this.client.deactivate();
      this.connected = false;
    }
  }

  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }

  isConnected() {
    return this.connected;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
