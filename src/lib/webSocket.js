// utils/websocket.js
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      // Create SockJS connection
    //   const socket = new SockJS("http://localhost:9005/ws");
      const socket = new SockJS(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9005"}/ws`
      );
      this.stompClient = Stomp.over(socket);

      // Add authorization header
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      this.stompClient.connect(
        headers,
        (frame) => {
          console.log("Connected: " + frame);
          this.connected = true;
          resolve(frame);
        },
        (error) => {
          console.error("Connection error: ", error);
          this.connected = false;
          reject(error);
        }
      );
    });
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect();
      this.connected = false;
      this.subscriptions.clear();
    }
  }

  // Subscribe to private messages
  subscribeToPrivateMessages(username, callback) {
    if (this.stompClient && this.connected) {
      const subscription = this.stompClient.subscribe(
        `/user/${username}/queue/messages`,
        (message) => {
          const messageData = JSON.parse(message.body);
          callback(messageData);
        }
      );
      this.subscriptions.set("private-messages", subscription);
      return subscription;
    }
  }

  // Subscribe to group messages
  subscribeToGroupMessages(chatRoom, callback) {
    if (this.stompClient && this.connected) {
      const subscription = this.stompClient.subscribe(
        `/topic/room/${chatRoom}`,
        (message) => {
          const messageData = JSON.parse(message.body);
          callback(messageData);
        }
      );
      this.subscriptions.set(`group-${chatRoom}`, subscription);
      return subscription;
    }
  }

  // Subscribe to typing indicators
  subscribeToTypingIndicators(username, callback) {
    if (this.stompClient && this.connected) {
      const subscription = this.stompClient.subscribe(
        `/user/${username}/queue/typing`,
        (message) => {
          const typingData = JSON.parse(message.body);
          callback(typingData);
        }
      );
      this.subscriptions.set("typing", subscription);
      return subscription;
    }
  }

  // Subscribe to read receipts
  subscribeToReadReceipts(username, callback) {
    if (this.stompClient && this.connected) {
      const subscription = this.stompClient.subscribe(
        `/user/${username}/queue/read-receipt`,
        (message) => {
          const receiptData = JSON.parse(message.body);
          callback(receiptData);
        }
      );
      this.subscriptions.set("read-receipts", subscription);
      return subscription;
    }
  }

  // Send private message
  sendPrivateMessage(recipientId, content) {
    if (this.stompClient && this.connected) {
      const messageRequest = {
        recipientId: recipientId,
        content: content,
      };

      this.stompClient.send(
        "/app/chat.private",
        {},
        JSON.stringify(messageRequest)
      );
    }
  }

  // Send group message
  sendGroupMessage(chatRoom, content) {
    if (this.stompClient && this.connected) {
      const messageRequest = {
        chatRoom: chatRoom,
        content: content,
      };

      this.stompClient.send(
        "/app/chat.group",
        {},
        JSON.stringify(messageRequest)
      );
    }
  }

  // Send typing indicator
  sendTypingIndicator(
    recipientId,
    recipientUsername,
    isTyping,
    chatRoom = null
  ) {
    if (this.stompClient && this.connected) {
      const typingIndicator = {
        recipientId: recipientId,
        recipientUsername: recipientUsername,
        chatRoom: chatRoom,
        isTyping: isTyping,
      };

      this.stompClient.send(
        "/app/chat.typing",
        {},
        JSON.stringify(typingIndicator)
      );
    }
  }

  // Unsubscribe from a topic
  unsubscribe(subscriptionKey) {
    const subscription = this.subscriptions.get(subscriptionKey);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
    }
  }

  isConnected() {
    return this.connected;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;

// hooks/useChat.js
import { useState, useEffect, useCallback, useRef } from "react";
import webSocketService from "../utils/websocket";
import { chatAPI } from "../services/chatAPI";

export const useChat = (currentUser) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const typingTimeoutRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get your auth token
        await webSocketService.connect(token);
        setIsConnected(true);

        // Subscribe to private messages
        webSocketService.subscribeToPrivateMessages(
          currentUser.username,
          handleIncomingMessage
        );

        // Subscribe to typing indicators
        webSocketService.subscribeToTypingIndicators(
          currentUser.username,
          handleTypingIndicator
        );

        // Subscribe to read receipts
        webSocketService.subscribeToReadReceipts(
          currentUser.username,
          handleReadReceipt
        );
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
        setIsConnected(false);
      }
    };

    if (currentUser) {
      initializeConnection();
    }

    return () => {
      webSocketService.disconnect();
    };
  }, [currentUser]);

  // Handle incoming messages
  const handleIncomingMessage = useCallback(
    (messageData) => {
      setMessages((prev) => [
        ...prev,
        {
          id: messageData.id,
          senderId: messageData.senderId,
          senderName: messageData.senderName,
          recipientId: messageData.recipientId,
          content: messageData.content,
          timestamp: new Date(messageData.createdAt),
          isRead: messageData.isRead,
          messageType: messageData.messageType,
          chatRoom: messageData.chatRoom,
        },
      ]);

      // Update unread count
      if (messageData.senderId !== currentUser.id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [messageData.senderId]: (prev[messageData.senderId] || 0) + 1,
        }));
      }
    },
    [currentUser]
  );

  // Handle typing indicators
  const handleTypingIndicator = useCallback((typingData) => {
    setIsTyping(typingData.isTyping);

    if (typingData.isTyping) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to hide typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
  }, []);

  // Handle read receipts
  const handleReadReceipt = useCallback(
    (receiptData) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.recipientId === receiptData.recipientId &&
          msg.senderId === currentUser.id
            ? { ...msg, isRead: true, readAt: new Date(receiptData.readAt) }
            : msg
        )
      );
    },
    [currentUser]
  );

  // Send message
  const sendMessage = useCallback(
    async (recipientId, content, chatRoom = null) => {
      if (!isConnected) {
        throw new Error("Not connected to WebSocket");
      }

      if (chatRoom) {
        // Group message
        webSocketService.sendGroupMessage(chatRoom, content);
      } else {
        // Private message
        webSocketService.sendPrivateMessage(recipientId, content);
      }

      // Add optimistic message
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        recipientId: recipientId,
        content: content,
        timestamp: new Date(),
        isRead: false,
        isSending: true,
        chatRoom: chatRoom,
      };

      setMessages((prev) => [...prev, optimisticMessage]);
    },
    [isConnected, currentUser]
  );

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    (recipientId, recipientUsername, isTyping, chatRoom = null) => {
      if (isConnected) {
        webSocketService.sendTypingIndicator(
          recipientId,
          recipientUsername,
          isTyping,
          chatRoom
        );
      }
    },
    [isConnected]
  );

  // Load conversation history
  const loadConversation = useCallback(async (otherUserId, chatRoom = null) => {
    try {
      let conversationMessages;
      if (chatRoom) {
        conversationMessages = await chatAPI.getGroupConversation(chatRoom);
      } else {
        conversationMessages = await chatAPI.getPrivateConversation(
          otherUserId
        );
      }

      setMessages(
        conversationMessages.map((msg) => ({
          id: msg.id,
          senderId: msg.senderId,
          senderName: msg.senderName,
          recipientId: msg.recipientId,
          recipientName: msg.recipientName,
          content: msg.content,
          timestamp: new Date(msg.createdAt),
          isRead: msg.isRead,
          readAt: msg.readAt ? new Date(msg.readAt) : null,
          messageType: msg.messageType,
          chatRoom: msg.chatRoom,
        }))
      );

      // Mark messages as read
      if (!chatRoom && otherUserId) {
        await chatAPI.markMessagesAsRead(otherUserId);
        setUnreadCounts((prev) => ({ ...prev, [otherUserId]: 0 }));
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  }, []);

  return {
    messages,
    isConnected,
    isTyping,
    unreadCounts,
    sendMessage,
    sendTypingIndicator,
    loadConversation,
    setMessages,
  };
};
