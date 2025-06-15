"use client";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  AlertCircle,
  Info,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationProvider";
import { cn } from "@/lib/utils";

// Notification type icons and colors
const getNotificationIcon = (type) => {
  switch (type) {
    case "LEAVE_REQUEST_SUBMITTED":
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case "LEAVE_REQUEST_APPROVED":
      return <Check className="h-4 w-4 text-green-500" />;
    case "LEAVE_REQUEST_REJECTED":
      return <X className="h-4 w-4 text-red-500" />;
    case "LEAVE_REQUEST_CANCELLED":
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case "LEAVE_REQUEST_SUBMITTED":
      return "bg-blue-50 border-blue-200";
    case "LEAVE_REQUEST_APPROVED":
      return "bg-green-50 border-green-200";
    case "LEAVE_REQUEST_REJECTED":
      return "bg-red-50 border-red-200";
    case "LEAVE_REQUEST_CANCELLED":
      return "bg-orange-50 border-orange-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const formatNotificationType = (type) => {
  return type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

export default function NotificationPage() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteReadNotifications,
    clearError,
  } = useNotifications();

  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.read;
      case "read":
        return notification.read;
      default:
        return true;
    }
  });

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDeleteReadNotifications = async () => {
    try {
      await deleteReadNotifications();
    } catch (error) {
      console.error("Failed to delete read notifications:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteReadNotifications}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === "read" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("read")}
        >
          Read ({notifications.length - unreadCount})
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>Error: {error}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="text-red-700 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">
                {filter === "all"
                  ? "You don't have any notifications yet."
                  : filter === "unread"
                  ? "No unread notifications."
                  : "No read notifications."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "transition-all duration-200 hover:shadow-md cursor-pointer",
                !notification.read && "ring-2 ring-blue-200 bg-blue-50/30",
                getNotificationColor(notification.type)
              )}
              onClick={() =>
                !notification.read && handleMarkAsRead(notification.id)
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Notification Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Notification Footer */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {formatNotificationType(notification.type)}
                        </Badge>
                        {notification.senderName && (
                          <span className="text-xs text-gray-500">
                            from {notification.senderName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                        {notification.read && notification.readAt && (
                          <div className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>Read</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More Button (if needed for pagination) */}
      {filteredNotifications.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Showing {filteredNotifications.length} of {notifications.length}{" "}
            notifications
          </p>
        </div>
      )}
    </div>
  );
}
// import React, { useState, useEffect } from "react";
// import {
//   Bell,
//   Check,
//   CheckCheck,
//   Trash2,
//   AlertTriangle,
//   Info,
//   Calendar,
//   User,
//   Settings,
// } from "lucide-react";

// // Mock API service to match your existing structure
// const apiService = {
//   getToken: () => localStorage.getItem("token") || "mock-token",

//   async getNotifications() {
//     // Simulate API call - replace with your actual API endpoint
//     return [
//       {
//         id: 1,
//         title: "Warning",
//         message:
//           "Your Visa Work Permit is valid for less than one year, visit www.migration.gov.rw for further help",
//         type: "warning",
//         isRead: false,
//         createdAt: new Date().toISOString(),
//         priority: "high",
//       },
//       {
//         id: 2,
//         title: "Information Update",
//         message: "Your Information has been updated successfully",
//         type: "success",
//         isRead: false,
//         createdAt: new Date(Date.now() - 3600000).toISOString(),
//         priority: "medium",
//       },
//       {
//         id: 3,
//         title: "Meeting Reminder",
//         message: "You have a meeting scheduled for tomorrow at 2:00 PM",
//         type: "info",
//         isRead: true,
//         createdAt: new Date(Date.now() - 7200000).toISOString(),
//         priority: "medium",
//       },
//     ];
//   },

//   async markNotificationAsRead(notificationId) {
//     // Simulate API call
//     console.log(`Marking notification ${notificationId} as read`);
//     return { success: true };
//   },

//   async markAllNotificationsAsRead() {
//     // Simulate API call
//     console.log("Marking all notifications as read");
//     return { success: true };
//   },

//   async deleteReadNotifications() {
//     // Simulate API call
//     console.log("Deleting read notifications");
//     return { success: true };
//   },
// };

// // WebSocket connection hook
// const useWebSocket = (url, onMessage) => {
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     // In a real implementation, you'd connect to your WebSocket server
//     // For demo purposes, we'll simulate receiving notifications
//     const simulateWebSocket = () => {
//       const interval = setInterval(() => {
//         if (Math.random() > 0.8) {
//           // 20% chance every 5 seconds
//           const mockNotification = {
//             id: Date.now(),
//             title: "New Notification",
//             message: "This is a real-time notification from WebSocket",
//             type: "info",
//             isRead: false,
//             createdAt: new Date().toISOString(),
//             priority: "medium",
//           };
//           onMessage(mockNotification);
//         }
//       }, 5000);

//       return () => clearInterval(interval);
//     };

//     const cleanup = simulateWebSocket();
//     setIsConnected(true);

//     return cleanup;
//   }, [onMessage]);

//   return { socket, isConnected };
// };

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all"); // all, unread, read
//   const [error, setError] = useState(null);

//   // Handle real-time notifications via WebSocket
//   const handleWebSocketMessage = (notification) => {
//     setNotifications((prev) => [notification, ...prev]);
//   };

//   const { isConnected } = useWebSocket(
//     "/api/notifications/websocket",
//     handleWebSocketMessage
//   );

//   // Fetch initial notifications
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const data = await apiService.getNotifications();
//         setNotifications(data);
//       } catch (err) {
//         console.error("Failed to fetch notifications:", err);
//         setError("Failed to load notifications");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   // Get notification icon based on type
//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case "warning":
//         return <AlertTriangle className="w-5 h-5 text-orange-600" />;
//       case "success":
//         return <CheckCheck className="w-5 h-5 text-green-600" />;
//       case "info":
//         return <Info className="w-5 h-5 text-blue-600" />;
//       default:
//         return <Bell className="w-5 h-5 text-gray-600" />;
//     }
//   };

//   // Get notification background color based on type
//   const getNotificationBg = (type) => {
//     switch (type) {
//       case "warning":
//         return "bg-[#F7D9A4]";
//       case "success":
//         return "bg-[#48C1B5]";
//       case "info":
//         return "bg-blue-100";
//       default:
//         return "bg-gray-100";
//     }
//   };

//   // Mark notification as read
//   const markAsRead = async (notificationId) => {
//     try {
//       await apiService.markNotificationAsRead(notificationId);
//       setNotifications((prev) =>
//         prev.map((notification) =>
//           notification.id === notificationId
//             ? { ...notification, isRead: true }
//             : notification
//         )
//       );
//     } catch (err) {
//       console.error("Failed to mark notification as read:", err);
//     }
//   };

//   // Mark all notifications as read
//   const markAllAsRead = async () => {
//     try {
//       await apiService.markAllNotificationsAsRead();
//       setNotifications((prev) =>
//         prev.map((notification) => ({ ...notification, isRead: true }))
//       );
//     } catch (err) {
//       console.error("Failed to mark all notifications as read:", err);
//     }
//   };

//   // Delete read notifications
//   const deleteReadNotifications = async () => {
//     try {
//       await apiService.deleteReadNotifications();
//       setNotifications((prev) =>
//         prev.filter((notification) => !notification.isRead)
//       );
//     } catch (err) {
//       console.error("Failed to delete read notifications:", err);
//     }
//   };

//   // Filter notifications
//   const filteredNotifications = notifications.filter((notification) => {
//     if (filter === "unread") return !notification.isRead;
//     if (filter === "read") return notification.isRead;
//     return true;
//   });

//   // Format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

//     if (diffInHours < 1) return "Just now";
//     if (diffInHours < 24) return `${diffInHours}h ago`;
//     if (diffInHours < 48) return "Yesterday";
//     return date.toLocaleDateString();
//   };

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   if (loading) {
//     return (
//       <div className="w-full px-4 py-8">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full px-4 py-6 max-w-4xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <Bell className="w-6 h-6 text-gray-700" />
//           <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
//           {unreadCount > 0 && (
//             <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//               {unreadCount}
//             </span>
//           )}
//         </div>

//         {/* WebSocket connection status */}
//         <div className="flex items-center gap-2">
//           <div
//             className={`w-2 h-2 rounded-full ${
//               isConnected ? "bg-green-500" : "bg-red-500"
//             }`}
//           ></div>
//           <span className="text-xs text-gray-500">
//             {isConnected ? "Live" : "Disconnected"}
//           </span>
//         </div>
//       </div>

//       {/* Action buttons */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         <button
//           onClick={() => setFilter("all")}
//           className={`px-3 py-1 rounded-full text-sm ${
//             filter === "all"
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200 text-gray-700"
//           }`}
//         >
//           All ({notifications.length})
//         </button>
//         <button
//           onClick={() => setFilter("unread")}
//           className={`px-3 py-1 rounded-full text-sm ${
//             filter === "unread"
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200 text-gray-700"
//           }`}
//         >
//           Unread ({unreadCount})
//         </button>
//         <button
//           onClick={() => setFilter("read")}
//           className={`px-3 py-1 rounded-full text-sm ${
//             filter === "read"
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200 text-gray-700"
//           }`}
//         >
//           Read ({notifications.length - unreadCount})
//         </button>

//         {unreadCount > 0 && (
//           <button
//             onClick={markAllAsRead}
//             className="px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition-colors"
//           >
//             Mark All Read
//           </button>
//         )}

//         {notifications.some((n) => n.isRead) && (
//           <button
//             onClick={deleteReadNotifications}
//             className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors flex items-center gap-1"
//           >
//             <Trash2 className="w-3 h-3" />
//             Clear Read
//           </button>
//         )}
//       </div>

//       {/* Error message */}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {/* Notifications list */}
//       <div className="space-y-3">
//         {filteredNotifications.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
//             <p className="text-lg font-medium">No notifications</p>
//             <p className="text-sm">You're all caught up!</p>
//           </div>
//         ) : (
//           filteredNotifications.map((notification) => (
//             <div
//               key={notification.id}
//               className={`${getNotificationBg(
//                 notification.type
//               )} p-4 flex gap-3 rounded-xl transition-all duration-200 hover:shadow-md ${
//                 !notification.isRead ? "border-l-4 border-blue-500" : ""
//               }`}
//             >
//               <div className="flex-shrink-0 mt-1">
//                 {getNotificationIcon(notification.type)}
//               </div>

//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between gap-2">
//                   <h3 className="font-bold text-gray-900 flex items-center gap-2">
//                     {notification.title}
//                     {!notification.isRead && (
//                       <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                     )}
//                   </h3>
//                   <div className="flex items-center gap-2 flex-shrink-0">
//                     <span className="text-xs text-gray-500">
//                       {formatDate(notification.createdAt)}
//                     </span>
//                     {!notification.isRead && (
//                       <button
//                         onClick={() => markAsRead(notification.id)}
//                         className="text-blue-500 hover:text-blue-700 p-1"
//                         title="Mark as read"
//                       >
//                         <Check className="w-4 h-4" />
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 <p className="text-gray-700 mt-1 text-sm leading-relaxed">
//                   {notification.message}
//                 </p>

//                 {notification.priority === "high" && (
//                   <div className="mt-2">
//                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                       High Priority
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
