class ApiService {
  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9005";
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
    this.wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:9005/ws";
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
      return localStorage.getItem("jwt_token") || localStorage.getItem("token");
    }
    return null;
  }

  // Check if token is expired
  isTokenExpired(token = null) {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return true;

    try {
      const payload = JSON.parse(atob(tokenToCheck.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  }

  // Validate token format
  validateToken(token = null) {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return false;

    // Check if token has proper JWT format (3 parts separated by dots)
    const parts = tokenToCheck.split(".");
    if (parts.length !== 3) return false;

    try {
      // Try to decode the payload
      const payload = JSON.parse(atob(parts[1]));
      return payload && typeof payload === "object";
    } catch (error) {
      console.error("Invalid token format:", error);
      return false;
    }
  }

  // Handle authentication failure
  handleAuthFailure() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
  }

  // Generic request method with token validation and 401 handling
  async request(endpoint, options = {}) {
    const token = this.getToken();

    // Check token validity before making request
    if (!this.validateToken(token) || this.isTokenExpired(token)) {
      const isAuthEndpoint =
        endpoint.includes("/auth/login") || endpoint.includes("/auth/register");

      if (!isAuthEndpoint) {
        this.handleAuthFailure();
        throw new Error("Session expired. Please login again.");
      }
    }

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

  // ==================== AUTHENTICATION METHODS ====================
  async login(email, password) {
    const response = await this.post("/api/v1/auth/login", { email, password });

    // Store tokens after successful login
    if (response.accessToken) {
      localStorage.setItem("jwt_token", response.accessToken);
      localStorage.setItem("token", response.accessToken); // Fallback for existing code
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
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
      }
    }
  }

  async getCurrentUser() {
    try {
      // Try different endpoints that might return current user
      return await this.get("/api/users/profile");
    } catch (error) {
      try {
        return await this.get("/api/users/profile");
      } catch (secondError) {
        // try {
        //   return await this.get("/api/v1/auth/me");
        // } catch (thirdError) {
        //   console.error(
        //     "Failed to fetch current user from all endpoints:",
        //     thirdError
        //   );
        //   throw thirdError;
        // }
      }
    }
  }

  // ==================== USER MANAGEMENT METHODS ====================
  async getUserProfile(userId) {
    return this.get(`/api/users/${userId}`);
  }
  async getUserEmail(userEmail) {
    return this.get(`/api/users/email/${userEmail}`);
  }

  async updateUserProfile(userData) {
    return this.put("/api/users/profile", userData);
  }

  async searchUsers(query) {
    const encodedQuery = encodeURIComponent(query);
    return this.get(`/api/users/search?q=${encodedQuery}`);
  }

  async getAllUsers() {
    return this.get("/api/users");
  }
  async getConversations() {
    // Updated to match backend endpoint
    return this.get("/api/chat/partners");
  }

  async getMessages(userId) {
    // Updated to match backend endpoint
    return this.get(`/api/chat/conversation/private/${userId}`);
  }

  async sendMessage(recipientId, content, messageType = "text") {
    console.log("Sending message with recipientId:", recipientId);
    console.log("Content:", content);

    if (!recipientId) {
      throw new Error("Recipient ID is required");
    }

    return this.post("/api/chat/messages", {
      recipientId,
      content,
      messageType,
    });
  }

  async markMessagesAsRead(senderId) {
    // Updated to match backend endpoint
    return this.put(`/api/chat/messages/read/${senderId}`);
  }

  async deleteMessage(messageId) {
    // This endpoint needs to be implemented in backend
    return this.delete(`/api/chat/messages/${messageId}`);
  }

  async getUnreadMessagesCount() {
    try {
      const response = await this.get("/api/chat/unread/count");
      return response.unreadCount || 0;
    } catch (error) {
      console.error("Failed to get unread messages count:", error);
      return 0;
    }
  }

  async getUnreadMessagesFromSender(senderId) {
    try {
      const response = await this.get(`/api/chat/unread/sender/${senderId}`);
      return response.unreadCount || 0;
    } catch (error) {
      console.error("Failed to get unread messages from sender:", error);
      return 0;
    }
  }

  // Additional method for group conversations if needed
  async getGroupMessages(chatRoom) {
    return this.get(`/api/chat/conversation/group/${chatRoom}`);
  }

  // ==================== WEBSOCKET METHODS ====================
  createWebSocket(onMessage, onOpen, onClose, onError) {
    const token = this.getToken();

    if (!token || !this.validateToken(token) || this.isTokenExpired(token)) {
      console.error("Cannot create WebSocket: Invalid or expired token");
      return null;
    }

    const ws = new WebSocket(`${this.wsUrl}?token=${token}`);

    ws.onopen = (event) => {
      console.log("WebSocket connected");
      if (onOpen) onOpen(event);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected", event.code, event.reason);

      // Handle authentication errors
      if (event.code === 1008) {
        // Policy Violation (auth error)
        console.error("WebSocket authentication failed");
        this.handleAuthFailure();
      }

      if (onClose) onClose(event);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (onError) onError(error);
    };

    return ws;
  }

  sendWebSocketMessage(ws, message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  // ==================== LEAVE MANAGEMENT METHODS ====================
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

  // ==================== NOTIFICATION METHODS ====================
  async getNotifications() {
    return this.get("/api/v1/notifications");
  }

  async getUnreadNotifications() {
    return this.get("/api/v1/notifications/unread");
  }

  async getUnreadNotificationsCount() {
    try {
      const response = await this.get("/api/v1/notifications/unread/count");
      // Handle both direct number response and object response
      return typeof response === "number" ? response : response.count || 0;
    } catch (error) {
      console.error("Failed to get unread notifications count:", error);
      return 0;
    }
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

  // ==================== UTILITY METHODS ====================

  // Format date for API calls
  formatDate(date) {
    return date instanceof Date ? date.toISOString() : date;
  }

  // Handle file uploads
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append("file", file);

    // Add any additional data
    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key]);
    });

    const token = this.getToken();

    if (!token || !this.validateToken(token) || this.isTokenExpired(token)) {
      this.handleAuthFailure();
      throw new Error("Session expired. Please login again.");
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });

    if (response.status === 401) {
      this.handleAuthFailure();
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Batch requests
  async batchRequest(requests) {
    try {
      const promises = requests.map(({ method, endpoint, data, options }) => {
        switch (method.toLowerCase()) {
          case "get":
            return this.get(endpoint, options);
          case "post":
            return this.post(endpoint, data, options);
          case "put":
            return this.put(endpoint, data, options);
          case "delete":
            return this.delete(endpoint, options);
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
      });

      const results = await Promise.allSettled(promises);

      return results.map((result, index) => ({
        index,
        status: result.status,
        data: result.status === "fulfilled" ? result.value : null,
        error: result.status === "rejected" ? result.reason : null,
      }));
    } catch (error) {
      console.error("Batch request failed:", error);
      throw error;
    }
  }

  // ==================== LEAVE REPORT METHODS ====================

  // Generic method to handle file downloads
  async downloadFile(endpoint, filename, params = {}) {
    const token = this.getToken();

    // Check token validity
    if (!this.validateToken(token) || this.isTokenExpired(token)) {
      this.handleAuthFailure();
      throw new Error("Session expired. Please login again.");
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== null &&
        params[key] !== undefined &&
        params[key] !== ""
      ) {
        queryParams.append(key, params[key]);
      }
    });

    const url = `${this.baseURL}${endpoint}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const config = {
      method: "GET",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.handleAuthFailure();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const blob = await response.blob();

      // Download the file
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true, message: "File downloaded successfully" };
    } catch (error) {
      console.error("File download failed:", error);
      throw error;
    }
  }

  // Generate PDF Report
  async generatePdfReport(
    search = "",
    orderColumn = null,
    orderDirection = "asc"
  ) {
    const params = {};
    if (search) params.search = search;
    if (orderColumn !== null) params.orderColumn = orderColumn;
    if (orderDirection) params.orderDirection = orderDirection;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `leaves_report_${timestamp}.pdf`;

    return this.downloadFile("/api/leave-reports/pdf", filename, params);
  }

  // Generate CSV Report
  async generateCsvReport(
    search = "",
    orderColumn = null,
    orderDirection = "asc"
  ) {
    const params = {};
    if (search) params.search = search;
    if (orderColumn !== null) params.orderColumn = orderColumn;
    if (orderDirection) params.orderDirection = orderDirection;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `leaves_report_${timestamp}.csv`;

    return this.downloadFile("/api/leave-reports/csv", filename, params);
  }

  // Generate Excel Report
  async generateExcelReport(
    search = "",
    orderColumn = null,
    orderDirection = "asc"
  ) {
    const params = {};
    if (search) params.search = search;
    if (orderColumn !== null) params.orderColumn = orderColumn;
    if (orderDirection) params.orderDirection = orderDirection;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `leaves_report_${timestamp}.xlsx`;

    return this.downloadFile("/api/leave-reports/excel", filename, params);
  }

  // Alternative method that returns blob for custom handling
  async getReportBlob(
    format,
    search = "",
    orderColumn = null,
    orderDirection = "asc"
  ) {
    const token = this.getToken();

    // Check token validity
    if (!this.validateToken(token) || this.isTokenExpired(token)) {
      this.handleAuthFailure();
      throw new Error("Session expired. Please login again.");
    }

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (orderColumn !== null) params.append("orderColumn", orderColumn);
    if (orderDirection) params.append("orderDirection", orderDirection);

    const endpoint = `/api/leave-reports/${format}`;
    const url = `${this.baseURL}${endpoint}?${params.toString()}`;

    const config = {
      method: "GET",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.handleAuthFailure();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return await response.blob();
    } catch (error) {
      console.error("Report generation failed:", error);
      throw error;
    }
  }

  // Worker Report API Methods

  // Generate Worker PDF Report
  async generateWorkerPdfReport(reportParams = {}) {
    const {
      search = "",
      orderColumn = null,
      orderDirection = "asc",
      departmentId = null,
      status = null,
      dateRange = null,
    } = reportParams;

    const params = {};
    if (search) params.search = search;
    if (orderColumn !== null) params.orderColumn = orderColumn;
    if (orderDirection) params.orderDirection = orderDirection;
    if (departmentId !== null) params.departmentId = departmentId;
    if (status !== null) params.status = status;
    if (dateRange !== null) {
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `workers_report_${timestamp}.pdf`;

    return this.downloadFile("/api/workers/reports/pdf", filename, params);
  }

  // Generate Worker CSV Report
  async generateWorkerCsvReport(reportParams = {}) {
    const {
      search = "",
      orderColumn = null,
      orderDirection = "asc",
      departmentId = null,
      status = null,
      dateRange = null,
    } = reportParams;

    const params = {};
    if (search) params.search = search;
    if (orderColumn !== null) params.orderColumn = orderColumn;
    if (orderDirection) params.orderDirection = orderDirection;
    if (departmentId !== null) params.departmentId = departmentId;
    if (status !== null) params.status = status;
    if (dateRange !== null) {
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `workers_report_${timestamp}.csv`;

    return this.downloadFile("/api/workers/reports/csv", filename, params);
  }

  // Generate Worker Excel Report
  async generateWorkerExcelReport(reportParams = {}) {
    const {
      search = "",
      orderColumn = null,
      orderDirection = "asc",
      departmentId = null,
      status = null,
      dateRange = null,
    } = reportParams;

    const params = {};
    if (search) params.search = search;
    if (orderColumn !== null) params.orderColumn = orderColumn;
    if (orderDirection) params.orderDirection = orderDirection;
    if (departmentId !== null) params.departmentId = departmentId;
    if (status !== null) params.status = status;
    if (dateRange !== null) {
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `workers_report_${timestamp}.xlsx`;

    return this.downloadFile("/api/workers/reports/excel", filename, params);
  }

  // Alternative method that returns blob for custom handling (Worker)
  async generateWorkerReportBlob(format = "pdf", reportParams = {}) {
    const {
      search = "",
      orderColumn = null,
      orderDirection = "asc",
      departmentId = null,
      status = null,
      dateRange = null,
    } = reportParams;

    const params = {};
    if (search) params.search = search;
    if (orderColumn !== null) params.orderColumn = orderColumn;
    if (orderDirection) params.orderDirection = orderDirection;
    if (departmentId !== null) params.departmentId = departmentId;
    if (status !== null) params.status = status;
    if (dateRange !== null) {
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
    }

    const token = this.getToken();

    // Check token validity
    if (!this.validateToken(token) || this.isTokenExpired(token)) {
      this.handleAuthFailure();
      throw new Error("Session expired. Please login again.");
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== null &&
        params[key] !== undefined &&
        params[key] !== ""
      ) {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `/api/workers/reports/${format}`;
    const url = `${this.baseURL}${endpoint}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const config = {
      method: "GET",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.handleAuthFailure();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Worker report generation failed:", error);
      throw error;
    }
  }

  // Get Worker Report Status (if you have async report generation)
  async getWorkerReportStatus(reportId) {
    const token = this.getToken();

    if (!this.validateToken(token) || this.isTokenExpired(token)) {
      this.handleAuthFailure();
      throw new Error("Session expired. Please login again.");
    }

    const url = `${this.baseURL}/api/worker/reports/status/${reportId}`;

    const config = {
      method: "GET",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.handleAuthFailure();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to get worker report status:", error);
      throw error;
    }
  }
}

// Create a singleton instance
const apiService = new ApiService();

// Export both the class and the singleton instance
export { ApiService };
export default apiService;