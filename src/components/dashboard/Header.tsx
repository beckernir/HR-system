// "use client";
// import { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
// import apiService from "@/lib/apiService"; // Adjust the import path

// export default function Header() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   // Fetch current user data on component mount
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const userData = await apiService.getCurrentUser();
//         setCurrentUser(userData);
//       } catch (err) {
//         console.error("Failed to fetch current user:", err);
//         setError(err.message);
//         // If authentication fails, the apiService will handle redirect
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Only fetch if there's a token
//     if (apiService.getToken()) {
//       fetchCurrentUser();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   // Helper function to get user's full name based on User entity structure
//   const getUserFullName = (user) => {
//     if (!user) return "";
//     // Primary field from User entity
//     if (user.fullNames) return user.fullNames;
//     // Fallback options for other possible field names
//     if (user.fullName) return user.fullName;
//     if (user.name) return user.name;
//     if (user.firstName) {
//       return `${user.firstName} ${user.lastName || ""}`.trim();
//     }
//     return "";
//   };

//   // Helper function to get user initials for fallback
//   const getUserInitials = (user) => {
//     const fullName = getUserFullName(user);
//     if (!fullName) return "U";
//     return fullName
//       .split(" ")
//       .map((word) => word.charAt(0))
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Helper function to get user's profile photo based on User entity structure
//   const getUserPhoto = (user) => {
//     if (!user) return "https://i.pravatar.cc/150?img=12";
//     // Primary field from User entity
//     if (user.photo) return user.photo;
//     // Fallback options
//     if (user.profilePicture) return user.profilePicture;
//     if (user.avatar) return user.avatar;
//     return "https://i.pravatar.cc/150?img=12";
//   };

//   // Helper function to get user role based on User entity structure
//   const getUserRole = (user) => {
//     if (!user) return "User";
//     // Primary field from User entity
//     if (user.role) return user.role;
//     // Fallback options
//     if (user.userRole) return user.userRole;
//     if (user.position) return user.position;
//     if (user.workingPosition) return user.workingPosition;
//     return "User";
//   };

//   // Helper function to format role display
//   const formatRole = (role) => {
//     if (!role) return "User";
//     return role
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//       .join(" ");
//   };

//   // Helper function to get user email for display (if needed)
//   const getUserEmail = (user) => {
//     if (!user) return "";
//     return user.email || "";
//   };

//   return (
//     <header className="bg-background/50 backdrop-blur-sm py-2">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between gap-4">
//           <div className="relative flex-1 max-w-xs">
//             <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search anything"
//               className="pl-8 h-9 outline-none bg-[#D0D4D8] border-0 rounded-xl"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center gap-1">
//             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
//               <img
//                 src={"/bx_support.svg"}
//                 className="w-[1.4rem]"
//                 width={0}
//                 height={0}
//                 alt="Support"
//               />
//             </Button>

//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-9 w-9 rounded-xl"
//               onClick={() => router.push("/dashboard/message")}
//             >
//               <img
//                 src={"/lets-icons_chat-fill.svg"}
//                 className="w-[1.4rem]"
//                 width={0}
//                 height={0}
//                 alt="Messages"
//               />
//             </Button>

//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-9 w-9 rounded-xl"
//               // onClick={() => router.push("/dashboard/notifications")}
//               onClick={() => router.push("/dashboard/notifications")}
//             >
//               <img
//                 src={"/material-symbols_notifications-unread.svg"}
//                 className="w-[1.4rem]"
//                 width={0}
//                 height={0}
//                 alt="Notifications"
//               />
//             </Button>

//             <div
//               className="bg-[#D0D4D8] flex justify-center align-center p-3 rounded-full cursor-pointer"
//               onClick={() => router.push("/lecturer-dashboard/profile")}
//             >
//               <Avatar className="h-9 w-9 border-2 border-border ml-1">
//                 <AvatarImage
//                   src={getUserPhoto(currentUser)}
//                   alt={getUserFullName(currentUser) || "User"}
//                 />
//                 <AvatarFallback>{getUserInitials(currentUser)}</AvatarFallback>
//               </Avatar>

//               <div className="hidden md:block ml-3">
//                 {loading ? (
//                   <div className="animate-pulse">
//                     <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
//                     <div className="h-3 bg-gray-300 rounded w-20"></div>
//                   </div>
//                 ) : error ? (
//                   <div>
//                     <p className="text-sm font-medium leading-none text-red-500">
//                       Error loading user
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       Please refresh
//                     </p>
//                   </div>
//                 ) : currentUser ? (
//                   <div>
//                     <p className="text-sm font-medium leading-none">
//                       {getUserFullName(currentUser) || "Unknown User"}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {formatRole(getUserRole(currentUser))}
//                     </p>
//                   </div>
//                 ) : (
//                   <div>
//                     <p className="text-sm font-medium leading-none">
//                       Guest User
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       Not logged in
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }




"use client";
import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/contexts/NotificationProvider";
import apiService from "@/lib/apiService";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Use notification context
  const { unreadCount } = useNotifications();

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await apiService.getCurrentUser();
        setCurrentUser(userData);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setError(err.message);
        // If authentication fails, the apiService will handle redirect
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if there's a token
    if (apiService.getToken()) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Helper function to get user's full name based on User entity structure
  const getUserFullName = (user) => {
    if (!user) return "";
    // Primary field from User entity
    if (user.fullNames) return user.fullNames;
    // Fallback options for other possible field names
    if (user.fullName) return user.fullName;
    if (user.name) return user.name;
    if (user.firstName) {
      return `${user.firstName} ${user.lastName || ""}`.trim();
    }
    return "";
  };

  // Helper function to get user initials for fallback
  const getUserInitials = (user) => {
    const fullName = getUserFullName(user);
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to get user's profile photo based on User entity structure
  const getUserPhoto = (user) => {
    if (!user) return "https://i.pravatar.cc/150?img=12";
    // Primary field from User entity
    if (user.photo) return user.photo;
    // Fallback options
    if (user.profilePicture) return user.profilePicture;
    if (user.avatar) return user.avatar;
    return "https://i.pravatar.cc/150?img=12";
  };

  // Helper function to get user role based on User entity structure
  const getUserRole = (user) => {
    if (!user) return "User";
    // Primary field from User entity
    if (user.role) return user.role;
    // Fallback options
    if (user.userRole) return user.userRole;
    if (user.position) return user.position;
    if (user.workingPosition) return user.workingPosition;
    return "User";
  };

  // Helper function to format role display
  const formatRole = (role) => {
    if (!role) return "User";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <header className="bg-background/50 backdrop-blur-sm py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search anything"
              className="pl-8 h-9 outline-none bg-[#D0D4D8] border-0 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
              <img
                src={"/bx_support.svg"}
                className="w-[1.4rem]"
                width={0}
                height={0}
                alt="Support"
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => router.push("/dashboard/message")}
            >
              <img
                src={"/lets-icons_chat-fill.svg"}
                className="w-[1.4rem]"
                width={0}
                height={0}
                alt="Messages"
              />
            </Button>

            {/* Updated notification button with real-time count */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl relative"
              onClick={() => router.push("/dashboard/notifications")}
            >
              <img
                src={"/material-symbols_notifications-unread.svg"}
                className="w-[1.4rem]"
                width={0}
                height={0}
                alt="Notifications"
              />
              {/* Show badge if there are unread notifications */}
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold rounded-full"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Button>

            <div
              className="bg-[#D0D4D8] flex justify-center align-center p-3 rounded-full cursor-pointer"
              onClick={() => router.push("/lecturer-dashboard/profile")}
            >
              <Avatar className="h-9 w-9 border-2 border-border ml-1">
                <AvatarImage
                  src={getUserPhoto(currentUser)}
                  alt={getUserFullName(currentUser) || "User"}
                />
                <AvatarFallback>{getUserInitials(currentUser)}</AvatarFallback>
              </Avatar>

              <div className="hidden md:block ml-3">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                  </div>
                ) : error ? (
                  <div>
                    <p className="text-sm font-medium leading-none text-red-500">
                      Error loading user
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Please refresh
                    </p>
                  </div>
                ) : currentUser ? (
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {getUserFullName(currentUser) || "Unknown User"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRole(getUserRole(currentUser))}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium leading-none">
                      Guest User
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Not logged in
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}