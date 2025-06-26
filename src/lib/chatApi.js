

// services/chatAPI.js
const API_BASE_URL = "http://localhost:9005";

class ChatAPI {
  constructor() {
    this.token = localStorage.getItem("authToken");
  }

  async getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        this.token || localStorage.getItem("authToken")
      }`,
    };
  }

  async getPrivateConversation(otherUserId) {
    const response = await fetch(
      `${API_BASE_URL}/chat/conversation/private/${otherUserId}`,
      {
        headers: await this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch private conversation");
    }

    return response.json();
  }

  async getGroupConversation(chatRoom) {
    const response = await fetch(
      `${API_BASE_URL}/chat/conversation/group/${chatRoom}`,
      {
        headers: await this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch group conversation");
    }

    return response.json();
  }

  async getConversationPartners() {
    const response = await fetch(`${API_BASE_URL}/chat/partners`, {
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch conversation partners");
    }

    return response.json();
  }

  async getUnreadMessagesCount() {
    const response = await fetch(`${API_BASE_URL}/chat/unread/count`, {
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch unread messages count");
    }

    return response.json();
  }

  async getUnreadMessagesFromSender(senderId) {
    const response = await fetch(
      `${API_BASE_URL}/chat/unread/sender/${senderId}`,
      {
        headers: await this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch unread messages from sender");
    }

    return response.json();
  }

  async markMessagesAsRead(senderId) {
    const response = await fetch(
      `${API_BASE_URL}/chat/messages/read/${senderId}`,
      {
        method: "PUT",
        headers: await this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark messages as read");
    }

    return response.json();
  }
}

export const chatAPI = new ChatAPI();
