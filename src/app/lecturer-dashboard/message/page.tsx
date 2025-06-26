
// "use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import {
//   Send,
//   Search,
//   Headphones,
//   Paperclip,
//   Smile,
//   Mic,
//   Plus,
//   X,
//   Users,
// } from "lucide-react";
// import apiService from "@/lib/apiService"; // Adjust path as needed

// // Types for better type safety
// interface User {
//   id: string | number;
//   fullNames: string;
//   email?: string;
//   photo?: string;
//   online?: boolean;
//   lastSeen?: string;
// }

// interface Message {
//   id: string | number;
//   senderId: string | number;
//   recipientId: string | number;
//   content: string;
//   createdAt: string;
//   isRead: boolean;
//   messageType?: string;
// }

// interface Chat {
//   id: string | number;
//   user: User;
//   lastMessage?: string;
//   lastMessageTime?: string;
//   unreadCount: number;
// }

// const Messages = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isConnected, setIsConnected] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);

//   // New states for user search functionality
//   const [showUserSearch, setShowUserSearch] = useState(false);
//   const [userSearchTerm, setUserSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState<User[]>([]);
//   const [isSearching, setIsSearching] = useState(false);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const ws = useRef<WebSocket | null>(null);
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Fetch current user info using centralized API
//   const fetchCurrentUser = async () => {
//     try {
//       const userData = await apiService.getCurrentUser();
//       setCurrentUser(userData);
//     } catch (error) {
//       console.error("Failed to fetch current user:", error);
//       // If auth fails, apiService will handle redirect to login
//     }
//   };

//   // Search for users to start new conversations
//   const searchUsers = async (query: string) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     setIsSearching(true);
//     try {
//       const searchData = await apiService.searchUsers(query);
//       // Filter out current user from search results
//       const filteredResults = searchData.filter(
//         (user: User) => user.id !== currentUser?.id
//       );
//       setSearchResults(filteredResults);
//     } catch (error) {
//       console.error("Failed to search users:", error);
//       setSearchResults([]);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   // Debounced user search
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (userSearchTerm) {
//         searchUsers(userSearchTerm);
//       }
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [userSearchTerm, currentUser]);

//   // Start a new conversation with a user
//   const startConversation = (user: User) => {
//     // Check if chat already exists
//     const existingChat = chats.find((chat) => chat.id === user.id);

//     if (existingChat) {
//       setSelectedChat(existingChat);
//       fetchMessages(existingChat.id);
//     } else {
//       // Create new chat entry
//       const newChat: Chat = {
//         id: user.id,
//         user: user,
//         lastMessage: "",
//         lastMessageTime: "",
//         unreadCount: 0,
//       };

//       setChats((prev) => [newChat, ...prev]);
//       setSelectedChat(newChat);
//       setMessages([]); // Clear messages for new conversation
//     }

//     // Close search modal
//     setShowUserSearch(false);
//     setUserSearchTerm("");
//     setSearchResults([]);
//   };

//   // Fetch all users using centralized API
//   const fetchUsers = async () => {
//     try {
//       const usersData = await apiService.getAllUsers();
//       setUsers(usersData);
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     }
//   };

//   // Fetch conversations with recent messages
//   const fetchConversations = async () => {
//     try {
//       const conversations = await apiService.getConversations();

//       // Transform conversations to chat format
//       const chatList: Chat[] = conversations.map((conv: any) => ({
//         id: conv.otherUser.id,
//         user: conv.otherUser,
//         lastMessage: conv.lastMessage?.content || "",
//         lastMessageTime: conv.lastMessage?.createdAt
//           ? new Date(conv.lastMessage.createdAt).toLocaleTimeString("en-US", {
//               hour12: false,
//               hour: "2-digit",
//               minute: "2-digit",
//             })
//           : "",
//         unreadCount: conv.unreadCount || 0,
//       }));

//       setChats(chatList);
//     } catch (error) {
//       console.error("Failed to fetch conversations:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch messages for a specific conversation
//   const fetchMessages = async (userId: string | number) => {
//     try {
//       const messagesData = await apiService.getMessages(userId);
//       setMessages(messagesData);

//       // Mark messages as read
//       await markMessagesAsRead(userId);
//     } catch (error) {
//       console.error("Failed to fetch messages:", error);
//     }
//   };

//   // Mark messages as read
//   const markMessagesAsRead = async (userId: string | number) => {
//     try {
//       await apiService.markMessagesAsRead(userId);

//       // Update local chat state
//       setChats((prev) =>
//         prev.map((chat) =>
//           chat.id === userId ? { ...chat, unreadCount: 0 } : chat
//         )
//       );
//     } catch (error) {
//       console.error("Failed to mark messages as read:", error);
//     }
//   };

//   // Send message using centralized API
//   const sendMessageToBackend = async (
//     recipientId: string | number,
//     content: string
//   ) => {
//     try {
//       const sentMessage = await apiService.sendMessage(recipientId, content);
//       return sentMessage;
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       throw error;
//     }
//   };

//   // WebSocket connection using centralized API service
//   useEffect(() => {
//     const connectWebSocket = () => {
//       try {
//         ws.current = apiService.createWebSocket(
//           // onMessage
//           (data) => handleIncomingMessage(data),
//           // onOpen
//           () => setIsConnected(true),
//           // onClose
//           (event) => {
//             setIsConnected(false);
//             // Only reconnect if it's not an auth error
//             if (event.code !== 1008) {
//               setTimeout(connectWebSocket, 3000);
//             }
//           },
//           // onError
//           (error) => {
//             console.error("WebSocket error:", error);
//           }
//         );
//       } catch (error) {
//         console.error("Failed to connect WebSocket:", error);
//       }
//     };

//     connectWebSocket();

//     return () => {
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, []);

//   // Handle incoming messages
//   const handleIncomingMessage = useCallback((data: any) => {
//     if (data.type === "message") {
//       const newMsg: Message = {
//         id: data.id,
//         senderId: data.senderId,
//         recipientId: data.recipientId,
//         content: data.content,
//         createdAt: data.createdAt,
//         isRead: data.isRead,
//       };

//       setMessages((prev) => [...prev, newMsg]);

//       // Update chat list with latest message
//       setChats((prev) =>
//         prev.map((chat) =>
//           chat.id === data.senderId
//             ? {
//                 ...chat,
//                 lastMessage: data.content,
//                 lastMessageTime: new Date().toLocaleTimeString("en-US", {
//                   hour12: false,
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 }),
//                 unreadCount: chat.unreadCount + 1,
//               }
//             : chat
//         )
//       );
//     } else if (data.type === "typing") {
//       setIsTyping(data.isTyping);
//     }
//   }, []);

//   // Initialize data
//   useEffect(() => {
//     const initializeData = async () => {
//       // Check token validity before proceeding
//       if (!apiService.validateToken() || apiService.isTokenExpired()) {
//         console.error("Invalid or expired token detected");
//         apiService.handleAuthFailure();
//         return;
//       }

//       try {
//         await fetchCurrentUser();
//         await fetchUsers();
//         await fetchConversations();
//       } catch (error) {
//         console.error("Failed to initialize data:", error);
//         // API service will handle auth failures automatically
//       }
//     };

//     initializeData();
//   }, []);

//   // Scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   // Send message
//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedChat || !currentUser) return;

//     const messageContent = newMessage.trim();
//     setNewMessage("");

//     // Add message to local state immediately for better UX
//     const tempMessage: Message = {
//       id: `temp-${Date.now()}`,
//       senderId: currentUser.id,
//       recipientId: selectedChat.id,
//       content: messageContent,
//       createdAt: new Date().toISOString(),
//       isRead: false,
//     };

//     setMessages((prev) => [...prev, tempMessage]);

//     // Update chat list
//     setChats((prev) =>
//       prev.map((chat) =>
//         chat.id === selectedChat.id
//           ? {
//               ...chat,
//               lastMessage: messageContent,
//               lastMessageTime: new Date().toLocaleTimeString("en-US", {
//                 hour12: false,
//                 hour: "2-digit",
//                 minute: "2-digit",
//               }),
//             }
//           : chat
//       )
//     );

//     // Send to backend
//     try {
//       const sentMessage = await sendMessageToBackend(
//         selectedChat.id,
//         messageContent
//       );

//       if (sentMessage) {
//         // Replace temp message with actual message from backend
//         setMessages((prev) =>
//           prev.map((msg) => (msg.id === tempMessage.id ? sentMessage : msg))
//         );
//       }

//       // Send via WebSocket if connected
//       if (ws.current) {
//         apiService.sendWebSocketMessage(ws.current, {
//           type: "private_message",
//           recipientId: selectedChat.id,
//           content: messageContent,
//           timestamp: new Date().toISOString(),
//         });
//       }
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       // Remove the temporary message on error
//       setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
//     }
//   };

//   // Handle typing indicator
//   const handleTyping = () => {
//     if (!selectedChat || !isConnected) return;

//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     if (ws.current) {
//       apiService.sendWebSocketMessage(ws.current, {
//         type: "typing",
//         recipientId: selectedChat.id,
//         isTyping: true,
//       });
//     }

//     typingTimeoutRef.current = setTimeout(() => {
//       if (ws.current) {
//         apiService.sendWebSocketMessage(ws.current, {
//           type: "typing",
//           recipientId: selectedChat.id,
//           isTyping: false,
//         });
//       }
//     }, 1000);
//   };

//   // Filter chats based on search
//   // const filteredChats = chats.filter((chat) =>
//   //   chat.user.name.toLowerCase().includes(searchTerm.toLowerCase())
//   // );
//   const filteredChats = chats.filter((chat) =>
//     (chat.user?.fullNames || "").toLowerCase().includes(searchTerm.toLowerCase())
//   );
  

//   // Select chat and load messages
//   const selectChat = async (chat: Chat) => {
//     setSelectedChat(chat);
//     await fetchMessages(chat.id);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading messages...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <h1 className="text-center text-2xl text-blue-800 font-bold mb-4">
//         Messages
//       </h1>

//       <div className="flex bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-120px)]">
//         {/* Sidebar */}
//         <div className="w-full md:w-1/3 border-r flex flex-col">
//           {/* Current User Info */}
//           {currentUser && (
//             <div className="p-4">
//               <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl shadow-sm">
//                 <img
//                   src={currentUser.avatar || "/Male.png"}
//                   alt="user"
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//                 <div className="flex-1">
//                   <p className="font-semibold text-gray-800">
//                     {currentUser.fullNames}
//                   </p>
//                   <p className="text-sm text-gray-600">Lecturer</p>
//                   <div className="flex items-center gap-1">
//                     <div
//                       className={`w-2 h-2 rounded-full ${
//                         isConnected ? "bg-green-500" : "bg-red-500"
//                       }`}
//                     ></div>
//                     <span className="text-xs text-gray-500">
//                       {isConnected ? "online" : "offline"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Search and New Chat */}
//           <div className="px-4 pb-4">
//             <div className="relative mb-3">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 placeholder="Search conversations"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* New Chat Button */}
//             <button
//               onClick={() => setShowUserSearch(true)}
//               className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
//             >
//               <Plus className="w-4 h-4" />
//               Start New Chat
//             </button>
//           </div>

//           {/* Chat List */}
//           <div className="flex-1 overflow-y-auto px-4">
//             <ul className="space-y-2">
//               {filteredChats.map((chat) => (
//                 <li
//                   key={`chat-${chat.id}`}
//                   onClick={() => selectChat(chat)}
//                   className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
//                     selectedChat?.id === chat.id
//                       ? "bg-blue-50 border-l-4 border-blue-500"
//                       : ""
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="relative">
//                       <img
//                         src={chat.user.photo || "/Male.png"}
//                         alt="user"
//                         className="w-12 h-12 rounded-full object-cover"
//                       />
//                       {chat.user.online && (
//                         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-start">
//                         <p className="font-medium text-gray-900 truncate">
//                           {chat.user.fullNames}
//                         </p>
//                         <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
//                           {chat.lastMessageTime}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600 truncate">
//                         {chat.lastMessage || "No messages yet"}
//                       </p>
//                     </div>
//                     {chat.unreadCount > 0 && (
//                       <div className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
//                         {chat.unreadCount}
//                       </div>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Chat Window */}
//         <div className="flex-1 flex flex-col">
//           {selectedChat ? (
//             <>
//               {/* Chat Header */}
//               <div className="p-4 border-b bg-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={selectedChat.user.photo || "/Male.png"}
//                       alt="user"
//                       className="w-12 h-12 rounded-full object-cover"
//                     />
//                     <div>
//                       <h2 className="font-bold text-gray-700 text-sm">
//                         {selectedChat.user.fullNames}
//                       </h2>
//                       <p className="text-xs text-gray-500">
//                         {isTyping
//                           ? "typing..."
//                           : selectedChat.user.online
//                           ? "online"
//                           : selectedChat.user.lastSeen
//                           ? `last seen ${selectedChat.user.lastSeen}`
//                           : "offline"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex gap-3">
//                     <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                       <Headphones className="w-5 h-5 text-gray-600" />
//                     </button>
//                     <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                       <Search className="w-5 h-5 text-gray-600" />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//                 <div className="space-y-4">
//                   {messages.map((message) => (
//                     <div
//                       key={`message-${message.id}`}
//                       className={`flex ${
//                         message.senderId === currentUser?.id
//                           ? "justify-end"
//                           : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                           message.senderId === currentUser?.id
//                             ? "bg-blue-500 text-white"
//                             : "bg-white text-gray-800 shadow-sm"
//                         }`}
//                       >
//                         <p className="text-sm">{message.content}</p>
//                         <div className="flex items-center justify-between mt-1">
//                           <span
//                             className={`text-xs ${
//                               message.senderId === currentUser?.id
//                                 ? "text-blue-100"
//                                 : "text-gray-500"
//                             }`}
//                           >
//                             {new Date(message.createdAt).toLocaleTimeString(
//                               "en-US",
//                               {
//                                 hour12: false,
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               }
//                             )}
//                           </span>
//                           {message.senderId === currentUser?.id && (
//                             <span
//                               className={`text-xs ml-2 ${
//                                 message.isRead
//                                   ? "text-blue-100"
//                                   : "text-blue-200"
//                               }`}
//                             >
//                               {message.isRead ? "✓✓" : "✓"}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   <div ref={messagesEndRef} />
//                 </div>
//               </div>

//               {/* Message Input */}
//               <div className="p-4 bg-white border-t">
//                 <div className="flex items-center gap-3">
//                   <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                     <Smile className="w-5 h-5 text-gray-600" />
//                   </button>
//                   <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                     <Paperclip className="w-5 h-5 text-gray-600" />
//                   </button>
//                   <div className="flex-1 relative">
//                     <input
//                       placeholder="Type a message"
//                       value={newMessage}
//                       onChange={(e) => {
//                         setNewMessage(e.target.value);
//                         handleTyping();
//                       }}
//                       onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                       className="w-full bg-gray-100 rounded-full px-4 py-2 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                       onClick={sendMessage}
//                       disabled={!newMessage.trim() || !isConnected}
//                       className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-400"
//                     >
//                       <Send className="w-4 h-4" />
//                     </button>
//                   </div>
//                   <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                     <Mic className="w-5 h-5 text-gray-600" />
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center bg-gray-50">
//               <div className="text-center">
//                 <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Send className="w-12 h-12 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   Select a conversation
//                 </h3>
//                 <p className="text-gray-500 mb-4">
//                   Choose from your existing conversations or start a new one
//                 </p>
//                 <button
//                   onClick={() => setShowUserSearch(true)}
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//                 >
//                   Start New Chat
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Search,
  Headphones,
  Paperclip,
  Smile,
  Mic,
  Plus,
  X,
  Users,
} from "lucide-react";
import apiService from "@/lib/apiService"; // Adjust path as needed

// Types for better type safety
interface User {
  id: string | number;
  fullNames: string;
  email?: string;
  photo?: string;
  avatar?: string;
  online?: boolean;
  lastSeen?: string;
}

interface Message {
  id: string | number;
  senderId: string | number;
  recipientId: string | number;
  content: string;
  createdAt: string;
  isRead: boolean;
  messageType?: string;
}

interface Chat {
  id: string | number;
  user: User;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

// Updated interface to match backend response
interface ConversationPartner {
  id: string | number;
  fullNames: string;
  email?: string;
  photo?: string;
  avatar?: string;
  online?: boolean;
  lastSeen?: string;
}

const Messages = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // New states for user search functionality
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch current user info using centralized API
  const fetchCurrentUser = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      // If auth fails, apiService will handle redirect to login
    }
  };

  // Search for users to start new conversations
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchData = await apiService.searchUsers(query);
      // Filter out current user from search results
      const filteredResults = searchData.filter(
        (user: User) => user.id !== currentUser?.id
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Failed to search users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced user search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (userSearchTerm && currentUser) {
        searchUsers(userSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [userSearchTerm, currentUser]);

  // Start a new conversation with a user
  // const startConversation = (user: User) => {
  //   // Check if chat already exists
  //   const existingChat = chats.find((chat) => chat.user.id === user.id);

  //   if (existingChat) {
  //     setSelectedChat(existingChat);
  //     fetchMessages(user.id); // Use user.id directly
  //   } else {
  //     // Create new chat entry
  //     const newChat: Chat = {
  //       id: user.id,
  //       user: user,
  //       lastMessage: "",
  //       lastMessageTime: "",
  //       unreadCount: 0,
  //     };

  //     setChats((prev) => [newChat, ...prev]);
  //     setSelectedChat(newChat);
  //     setMessages([]); // Clear messages for new conversation
  //   }

  //   // Close search modal
  //   setShowUserSearch(false);
  //   setUserSearchTerm("");
  //   setSearchResults([]);
  // };

  // Utility function to get a valid user ID with fallbacks
  const getUserId = (user: any): string | number => {
    // Try different possible ID fields in order of preference
    return (
      user.id ||
      user._id ||
      user.userId ||
      user.employeeId ||
      user.nationalId || // Use nationalId as fallback since it's unique
      user.email || // Email as another fallback
      `fallback-${user.fullNames
        ?.replace(/\s+/g, "-")
        .toLowerCase()}-${Date.now()}`
    );
  };

  // Updated startConversation with robust ID handling
  const startConversation = (user: User) => {
    console.log("Starting conversation with user:", user);

    // Get a valid ID using fallbacks
    const validUserId = getUserId(user);
    console.log("Resolved user ID:", validUserId);

    if (!validUserId) {
      console.error(
        "Cannot start conversation: no valid user identifier found",
        user
      );
      alert("Error: Cannot start conversation. User identifier is missing.");
      return;
    }

    // Create an updated user object with valid ID
    const userWithValidId: User = {
      ...user,
      id: validUserId,
    };

    // Check if chat already exists (using the resolved ID)
    const existingChat = chats.find(
      (chat) => getUserId(chat.user) === validUserId
    );

    if (existingChat) {
      console.log("Found existing chat:", existingChat);
      setSelectedChat(existingChat);
      fetchMessages(validUserId);
    } else {
      // Create new chat entry with valid user ID
      const newChat: Chat = {
        id: validUserId,
        user: userWithValidId,
        lastMessage: "",
        lastMessageTime: "",
        unreadCount: 0,
      };

      console.log("Created new chat with valid ID:", newChat);

      setChats((prev) => [newChat, ...prev]);
      setSelectedChat(newChat);
      setMessages([]);
    }

    // Close search modal
    setShowUserSearch(false);
    setUserSearchTerm("");
    setSearchResults([]);
  };
  // Fetch all users using centralized API
  const fetchUsers = async () => {
    try {
      const usersData = await apiService.getAllUsers();
      // Log the raw response
      console.log("Raw API response:", JSON.stringify(usersData, null, 2));
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Updated fetchConversations to match backend response structure
  // const fetchConversations = async () => {
  //   try {
  //     // This should return an array of User objects who have conversations with current user
  //     const conversationPartners: ConversationPartner[] =
  //       await apiService.getConversations();

  //     // Transform conversation partners to chat format
  //     const chatList: Chat[] = conversationPartners.map((partner) => ({
  //       id: partner.id,
  //       user: {
  //         id: partner.id,
  //         fullNames: partner.fullNames,
  //         email: partner.email,
  //         photo: partner.photo || partner.avatar,
  //         online: partner.online,
  //         lastSeen: partner.lastSeen,
  //       },
  //       lastMessage: "", // Will be populated when messages are fetched
  //       lastMessageTime: "",
  //       unreadCount: 0, // Will be populated with actual unread count
  //     }));

  //     setChats(chatList);

  //     // Fetch last messages and unread counts for each conversation
  //     for (const chat of chatList) {
  //       try {
  //         // Get unread count from sender
  //         const unreadCount = await apiService.getUnreadMessagesFromSender(
  //           chat.id
  //         );

  //         // Get recent messages to determine last message
  //         const recentMessages = await apiService.getMessages(chat.id);

  //         if (recentMessages && recentMessages.length > 0) {
  //           const lastMsg = recentMessages[recentMessages.length - 1];

  //           // Update chat with last message info
  //           setChats((prev) =>
  //             prev.map((c) =>
  //               c.id === chat.id
  //                 ? {
  //                     ...c,
  //                     lastMessage: lastMsg.content,
  //                     lastMessageTime: new Date(
  //                       lastMsg.createdAt
  //                     ).toLocaleTimeString("en-US", {
  //                       hour12: false,
  //                       hour: "2-digit",
  //                       minute: "2-digit",
  //                     }),
  //                     unreadCount: unreadCount,
  //                   }
  //                 : c
  //             )
  //           );
  //         }
  //       } catch (error) {
  //         console.error(`Failed to fetch details for chat ${chat.id}:`, error);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch conversations:", error);
  //     // If no conversations exist, that's fine - just set empty array
  //     setChats([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // Updated fetchConversations to properly handle user IDs
  const fetchConversations = async () => {
    try {
      const conversationPartners: ConversationPartner[] =
        await apiService.getConversations();

      // Transform conversation partners to chat format with proper ID handling
      const chatList: Chat[] = conversationPartners.map((partner) => ({
        id: partner.id, // This should be the conversation/chat ID, not user ID
        user: {
          id: partner.id, // Make sure this is the actual user ID from the partner object
          fullNames: partner.fullNames,
          email: partner.email,
          photo: partner.photo || partner.avatar,
          online: partner.online,
          lastSeen: partner.lastSeen,
        },
        lastMessage: "",
        lastMessageTime: "",
        unreadCount: 0,
      }));

      // Debug logging to check the data structure
      console.log("Conversation partners from API:", conversationPartners);
      console.log("Transformed chat list:", chatList);

      setChats(chatList);

      // Rest of your code...
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (userId: string | number) => {
    try {
      console.log("Fetching messages for userId:", userId);

      // Ensure userId is valid
      if (!userId || userId === "undefined") {
        console.error("Invalid userId provided:", userId);
        return;
      }

      const messagesData = await apiService.getMessages(userId);
      console.log("Fetched messages:", messagesData);

      setMessages(messagesData || []);

      // Mark messages as read
      await markMessagesAsRead(userId);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]); // Set empty array on error
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (senderId: string | number) => {
    try {
      await apiService.markMessagesAsRead(senderId);

      // Update local chat state
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === senderId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  // Send message using centralized API
  const sendMessageToBackend = async (
    recipientId: string | number,
    content: string
  ) => {
    try {
      console.log("Sending message to recipientId:", recipientId);

      // Ensure recipientId is valid
      if (!recipientId || recipientId === "undefined") {
        throw new Error("Invalid recipient ID");
      }

      // Validate recipientId
      if (
        !recipientId ||
        String(recipientId).trim() === "" ||
        recipientId === "undefined"
      ) {
        throw new Error("Invalid recipient ID");
      }

      const sentMessage = await apiService.sendMessage(recipientId, content);
      return sentMessage;
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  // WebSocket connection using centralized API service
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        ws.current = apiService.createWebSocket(
          // onMessage
          (data) => handleIncomingMessage(data),
          // onOpen
          () => setIsConnected(true),
          // onClose
          (event) => {
            setIsConnected(false);
            // Only reconnect if it's not an auth error
            if (event.code !== 1008) {
              setTimeout(connectWebSocket, 3000);
            }
          },
          // onError
          (error) => {
            console.error("WebSocket error:", error);
          }
        );
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
      }
    };

    if (currentUser) {
      connectWebSocket();
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [currentUser]);

  // Handle incoming messages
  const handleIncomingMessage = useCallback((data: any) => {
    if (data.type === "message") {
      const newMsg: Message = {
        id: data.id,
        senderId: data.senderId,
        recipientId: data.recipientId,
        content: data.content,
        createdAt: data.createdAt,
        isRead: data.isRead,
      };

      setMessages((prev) => [...prev, newMsg]);

      // Update chat list with latest message
      setChats((prev) =>
        prev.map((chat) =>
          chat.user.id === data.senderId
            ? {
                ...chat,
                lastMessage: data.content,
                lastMessageTime: new Date().toLocaleTimeString("en-US", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                unreadCount: chat.unreadCount + 1,
              }
            : chat
        )
      );
    } else if (data.type === "typing") {
      setIsTyping(data.isTyping);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      // Check token validity before proceeding
      if (!apiService.validateToken() || apiService.isTokenExpired()) {
        console.error("Invalid or expired token detected");
        apiService.handleAuthFailure();
        return;
      }

      try {
        await fetchCurrentUser();
        await fetchUsers();
        await fetchConversations();
      } catch (error) {
        console.error("Failed to initialize data:", error);
        // API service will handle auth failures automatically
      }
    };

    initializeData();
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Send message
  // const sendMessage = async () => {
  //   if (!newMessage.trim() || !selectedChat || !currentUser) return;

  //   const messageContent = newMessage.trim();
  //   setNewMessage("");

  //   // Add message to local state immediately for better UX
  //   const tempMessage: Message = {
  //     id: `temp-${Date.now()}`,
  //     senderId: currentUser.id,
  //     recipientId: selectedChat.user.id, // Use selectedChat.user.id instead of selectedChat.id
  //     content: messageContent,
  //     createdAt: new Date().toISOString(),
  //     isRead: false,
  //   };

  //   setMessages((prev) => [...prev, tempMessage]);

  //   // Update chat list
  //   setChats((prev) =>
  //     prev.map((chat) =>
  //       chat.user.id === selectedChat.user.id
  //         ? {
  //             ...chat,
  //             lastMessage: messageContent,
  //             lastMessageTime: new Date().toLocaleTimeString("en-US", {
  //               hour12: false,
  //               hour: "2-digit",
  //               minute: "2-digit",
  //             }),
  //           }
  //         : chat
  //     )
  //   );
  //   // Add this before your try block
  //   console.log("selectedChat:", selectedChat);
  //   console.log("selectedChat.user:", selectedChat?.user);
  //   console.log("selectedChat.user.id:", selectedChat?.user?.id);

  //   // Send to backend
  //   try {
  //     const sentMessage = await sendMessageToBackend(
  //       selectedChat.user.id, // Use selectedChat.user.id
  //       messageContent
  //     );

  //     if (sentMessage) {
  //       // Replace temp message with actual message from backend
  //       setMessages((prev) =>
  //         prev.map((msg) => (msg.id === tempMessage.id ? sentMessage : msg))
  //       );
  //     }

  //     // Send via WebSocket if connected
  //     if (ws.current) {
  //       apiService.sendWebSocketMessage(ws.current, {
  //         type: "private_message",
  //         recipientId: selectedChat.user.id,
  //         content: messageContent,
  //         timestamp: new Date().toISOString(),
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Failed to send message:", error);
  //     // Remove the temporary message on error
  //     setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
  //   }
  // };
  // Fixed sendMessage with proper validation
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUser) {
      console.log("Cannot send message: missing required data");
      return;
    }

    // Validate recipient ID
    if (!selectedChat.user.id) {
      console.error(
        "Cannot send message: recipient ID is null or undefined",
        selectedChat
      );
      alert(
        "Error: Cannot send message. Please try selecting the conversation again."
      );
      return;
    }

    const messageContent = newMessage.trim();
    setNewMessage("");

    console.log("Sending message to user ID:", selectedChat.user.id);
    console.log("Selected chat:", selectedChat);

    // Add message to local state immediately for better UX
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUser.id,
      recipientId: selectedChat.user.id,
      content: messageContent,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => [...prev, tempMessage]);

    // Update chat list
    setChats((prev) =>
      prev.map((chat) =>
        chat.user.id === selectedChat.user.id
          ? {
              ...chat,
              lastMessage: messageContent,
              lastMessageTime: new Date().toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : chat
      )
    );

    // Send to backend
    try {
      const sentMessage = await sendMessageToBackend(
        selectedChat.user.id,
        messageContent
      );

      if (sentMessage) {
        // Replace temp message with actual message from backend
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempMessage.id ? sentMessage : msg))
        );
      }

      // Send via WebSocket if connected
      if (ws.current && isConnected) {
        apiService.sendWebSocketMessage(ws.current, {
          type: "private_message",
          recipientId: selectedChat.user.id,
          content: messageContent,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove the temporary message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      alert("Failed to send message. Please try again.");
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!selectedChat || !isConnected) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (ws.current) {
      apiService.sendWebSocketMessage(ws.current, {
        type: "typing",
        recipientId: selectedChat.user.id,
        isTyping: true,
      });
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (ws.current) {
        apiService.sendWebSocketMessage(ws.current, {
          type: "typing",
          recipientId: selectedChat.user.id,
          isTyping: false,
        });
      }
    }, 1000);
  };

  // Filter chats based on search
  const filteredChats = chats.filter((chat) =>
    (chat.user?.fullNames || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Select chat and load messages
  const selectChat = async (chat: Chat) => {
    console.log("Selecting chat:", chat);
    setSelectedChat(chat);

    // Use chat.user.id to fetch messages
    if (chat.user && chat.user.id) {
      await fetchMessages(chat.user.id);
    } else {
      console.error("Invalid chat user data:", chat);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-center text-2xl text-blue-800 font-bold mb-4">
        Messages
      </h1>

      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 border-r flex flex-col">
          {/* Current User Info */}
          {currentUser && (
            <div className="p-4">
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl shadow-sm">
                <img
                  src={currentUser.avatar || currentUser.photo || "/Male.png"}
                  alt="user"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {currentUser.fullNames}
                  </p>
                  <p className="text-sm text-gray-600">Lecturer</p>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {isConnected ? "online" : "offline"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and New Chat */}
          <div className="px-4 pb-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                placeholder="Search conversations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* New Chat Button */}
            <button
              onClick={() => setShowUserSearch(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Start New Chat
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-4">
            <ul className="space-y-2">
              {filteredChats.map((chat) => (
                <li
                  key={`chat-${chat.user.id}`}
                  onClick={() => selectChat(chat)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedChat?.user.id === chat.user.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={chat.user.photo || chat.user.avatar || "/Male.png"}
                        alt="user"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {chat.user.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-gray-900 truncate">
                          {chat.user.fullNames}
                        </p>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        selectedChat.user.photo ||
                        selectedChat.user.avatar ||
                        "/Male.png"
                      }
                      alt="user"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="font-bold text-gray-700 text-sm">
                        {selectedChat.user.fullNames}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {isTyping
                          ? "typing..."
                          : selectedChat.user.online
                          ? "online"
                          : selectedChat.user.lastSeen
                          ? `last seen ${selectedChat.user.lastSeen}`
                          : "offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Headphones className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Search className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={`message-${message.id}`}
                      className={`flex ${
                        message.senderId === currentUser?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === currentUser?.id
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800 shadow-sm"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span
                            className={`text-xs ${
                              message.senderId === currentUser?.id
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {message.senderId === currentUser?.id && (
                            <span
                              className={`text-xs ml-2 ${
                                message.isRead
                                  ? "text-blue-100"
                                  : "text-blue-200"
                              }`}
                            >
                              {message.isRead ? "✓✓" : "✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      placeholder="Type a message"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="w-full bg-gray-100 rounded-full px-4 py-2 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || !isConnected}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Mic className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500 mb-4">
                  Choose from your existing conversations or start a new one
                </p>
                <button
                  onClick={() => setShowUserSearch(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Start New Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* User Search Modal */}
      {showUserSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Start New Chat
              </h2>
              <button
                onClick={() => {
                  setShowUserSearch(false);
                  setUserSearchTerm("");
                  setSearchResults([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  placeholder="Search users by name..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="max-h-80 overflow-y-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={`search-user-${user.id}`}
                        onClick={() => startConversation(user)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <img
                          src={user.avatar || "/Male.png"}
                          alt="user"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {user.fullNames}
                          </p>
                          {user.email && (
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          )}
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            user.online ? "bg-green-500" : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                ) : userSearchTerm ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No users found</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>Search for users to start chatting</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
