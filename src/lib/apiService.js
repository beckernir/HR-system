// class ApiService {
//   constructor() {
//     this.baseURL =
//       process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9005";
//     this.defaultHeaders = {
//       "Content-Type": "application/json",
//     };
//   }

//   // Get auth headers with token
//   getAuthHeaders() {
//     const token = this.getToken();
//     return {
//       ...this.defaultHeaders,
//       ...(token && { Authorization: `Bearer ${token}` }),
//     };
//   }

//   // Get token from localStorage
//   getToken() {
//     if (typeof window !== "undefined") {
//       return localStorage.getItem("jwt_token");
//     }
//     return null;
//   }

//   // Handle authentication failure
//   handleAuthFailure() {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("jwt_token");
//       localStorage.removeItem("refresh_token");
//       window.location.href = "/login";
//     }
//   }

//   // Generic request method with simple 401 handling
//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;
//     const config = {
//       headers: this.getAuthHeaders(),
//       credentials: "include",
//       ...options,
//       headers: {
//         ...this.getAuthHeaders(),
//         ...options.headers,
//       },
//     };

//     try {
//       const response = await fetch(url, config);

//       // Handle 401 Unauthorized - redirect to login
//       if (response.status === 401) {
//         const isAuthEndpoint =
//           endpoint.includes("/auth/login") ||
//           endpoint.includes("/auth/register");

//         if (!isAuthEndpoint) {
//           this.handleAuthFailure();
//           throw new Error("Session expired. Please login again.");
//         }
//       }

//       if (!response.ok) {
//         // Try to get error message from response
//         const errorData = await response.json().catch(() => null);
//         const errorMessage =
//           errorData?.message || `HTTP error! status: ${response.status}`;
//         throw new Error(errorMessage);
//       }

//       // Check if response has content and if it's JSON
//       const contentType = response.headers.get("content-type");
//       const contentLength = response.headers.get("content-length");

//       // If no content or content-length is 0, return success object
//       if (contentLength === "0" || !contentType) {
//         return { success: true, message: "Operation completed successfully" };
//       }

//       // If content-type indicates JSON, parse as JSON
//       if (contentType && contentType.includes("application/json")) {
//         const data = await response.json();
//         return data;
//       } else {
//         // If it's text or other format, return as text
//         const text = await response.text();
//         return { success: true, message: text };
//       }
//     } catch (error) {
//       console.error("API request failed:", error);
//       throw error;
//     }
//   }

//   // HTTP Methods
//   async get(endpoint, options = {}) {
//     return this.request(endpoint, { method: "GET", ...options });
//   }

//   async post(endpoint, data, options = {}) {
//     return this.request(endpoint, {
//       method: "POST",
//       body: JSON.stringify(data),
//       ...options,
//     });
//   }

//   async put(endpoint, data, options = {}) {
//     return this.request(endpoint, {
//       method: "PUT",
//       body: JSON.stringify(data),
//       ...options,
//     });
//   }

//   async delete(endpoint, options = {}) {
//     return this.request(endpoint, { method: "DELETE", ...options });
//   }

//   // Authentication methods
//   async login(email, password) {
//     const response = await this.post("/api/v1/auth/login", { email, password });

//     // Store tokens after successful login
//     if (response.accessToken) {
//       localStorage.setItem("jwt_token", response.accessToken);
//     }
//     if (response.refreshToken) {
//       localStorage.setItem("refresh_token", response.refreshToken);
//     }

//     return response;
//   }

//   async logout() {
//     try {
//       await this.post("/api/v1/auth/logout");
//     } finally {
//       // Clear tokens regardless of logout API success
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("jwt_token");
//         localStorage.removeItem("refresh_token");
//       }
//     }
//   }
//   // User Profile methods
//   async getCurrentUser() {
//     return this.get("/api/users/profile");
//   }

//   async getUserProfile(userId) {
//     return this.get(`/api/users/${userId}`);
//   }

//   async updateUserProfile(userData) {
//     return this.put("/api/usersprofile", userData);
//   }

//   // Leave Management API methods
//   async createLeaveRequest(leaveData) {
//     return this.post("/api/v1/leaves", leaveData);
//   }

//   async getLeaveRequests(params = {}) {
//     const queryString = new URLSearchParams(params).toString();
//     const endpoint = queryString
//       ? `/api/v1/leaves?${queryString}`
//       : "/api/v1/leaves";
//     return this.get(endpoint);
//   }

//   async getLeaveRequestById(id) {
//     return this.get(`/api/v1/leaves/${id}`);
//   }

//   async updateLeaveRequest(id, leaveData) {
//     return this.put(`/api/v1/leaves/${id}`, leaveData);
//   }

//   async deleteLeaveRequest(id) {
//     return this.delete(`/api/v1/leaves/${id}`);
//   }

//   async approveLeaveRequest(id) {
//     return this.put(`/api/v1/leaves/${id}/approve`);
//   }

//   async rejectLeaveRequest(id, reason = "") {
//     return this.put(`/api/v1/leaves/${id}/reject`, { reason });
//   }

//   async cancelLeaveRequest(id) {
//     return this.put(`/api/v1/leaves/${id}/cancel`);
//   }

//   async getLeaveBalance(year = new Date().getFullYear()) {
//     return this.get(`/api/v1/leaves/balance?year=${year}`);
//   }

//   async getLeaveTypes() {
//     return this.get("/api/v1/leaves/types");
//   }
// }

// // Create a singleton instance
// const apiService = new ApiService();
// export default apiService;

class ApiService {
  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9005";
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  // Get auth headers with token
  getAuthHeaders() {
    const token = this.getToken();
    return {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get token from localStorage
  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }

  // Handle authentication failure
  handleAuthFailure() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
  }

  // Generic request method with simple 401 handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      credentials: "include",
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        const isAuthEndpoint =
          endpoint.includes("/auth/login") ||
          endpoint.includes("/auth/register");

        if (!isAuthEndpoint) {
          this.handleAuthFailure();
          throw new Error("Session expired. Please login again.");
        }
      }

      if (!response.ok) {
        // Try to get error message from response
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Check if response has content and if it's JSON
      const contentType = response.headers.get("content-type");
      const contentLength = response.headers.get("content-length");

      // If no content or content-length is 0, return success object
      if (contentLength === "0" || !contentType) {
        return { success: true, message: "Operation completed successfully" };
      }

      // If content-type indicates JSON, parse as JSON
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return data;
      } else {
        // If it's text or other format, return as text
        const text = await response.text();
        return { success: true, message: text };
      }
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // HTTP Methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: "GET", ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: "DELETE", ...options });
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.post("/api/v1/auth/login", { email, password });

    // Store tokens after successful login
    if (response.accessToken) {
      localStorage.setItem("jwt_token", response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem("refresh_token", response.refreshToken);
    }

    return response;
  }

  async logout() {
    try {
      await this.post("/api/v1/auth/logout");
    } finally {
      // Clear tokens regardless of logout API success
      if (typeof window !== "undefined") {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("refresh_token");
      }
    }
  }

  // User Profile methods
  async getCurrentUser() {
    return this.get("/api/users/profile");
  }

  async getUserProfile(userId) {
    return this.get(`/api/users/${userId}`);
  }

  async updateUserProfile(userData) {
    return this.put("/api/users/profile", userData);
  }

  // Leave Management API methods
  async createLeaveRequest(leaveData) {
    return this.post("/api/v1/leaves", leaveData);
  }

  async getLeaveRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `/api/v1/leaves?${queryString}`
      : "/api/v1/leaves";
    return this.get(endpoint);
  }

  async getLeaveRequestById(id) {
    return this.get(`/api/v1/leaves/${id}`);
  }

  async getLeaveRequestByLecturer() {
    return this.get(`/api/v1/leaves/my-requests`);
  }
  async updateLeaveRequest(id, leaveData) {
    return this.put(`/api/v1/leaves/${id}`, leaveData);
  }

  async deleteLeaveRequest(id) {
    return this.delete(`/api/v1/leaves/${id}`);
  }

  async approveLeaveRequest(id) {
    return this.put(`/api/v1/leaves/${id}/approve`);
  }

  async rejectLeaveRequest(id, reason = "") {
    return this.put(`/api/v1/leaves/${id}/reject`, { reason });
  }

  async cancelLeaveRequest(id) {
    return this.put(`/api/v1/leaves/${id}/cancel`);
  }

  async getLeaveBalance(year = new Date().getFullYear()) {
    return this.get(`/api/v1/leaves/balance?year=${year}`);
  }

  async getLeaveTypes() {
    return this.get("/api/v1/leaves/types");
  }

  // Notification API methods
  async getNotifications() {
    return this.get("/api/v1/notifications");
  }

  async getUnreadNotifications() {
    return this.get("/api/v1/notifications/unread");
  }

  async getUnreadNotificationsCount() {
    const response = await this.get("/api/v1/notifications/unread/count");
    // Handle both direct number response and object response
    return typeof response === "number" ? response : response.count || 0;
  }

  async markNotificationAsRead(notificationId) {
    return this.put(`/api/v1/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead() {
    return this.put("/api/v1/notifications/mark-all-read");
  }

  async deleteReadNotifications() {
    return this.delete("/api/v1/notifications/read");
  }
}

// Create a singleton instance
const apiService = new ApiService();
export default apiService;
