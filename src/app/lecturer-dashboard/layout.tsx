"use client";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/Header2";
import apiService from "@/lib/apiService"; // Update this path to your actual apiService location

const navItems = [
  {
    text: "Dashboard",
    icon: (
      <img
        src={"/fi_layers.svg"}
        className="w-[1.4rem]"
        width={0}
        height={0}
        alt="dashboard"
      />
    ),
    path: "/lecturer-dashboard",
  },
  {
    text: "Attendance",
    icon: (
      <img
        src={"/fi_check-square.svg"}
        className="w-[1.4rem]"
        width={0}
        height={0}
        alt="attendance"
      />
    ),
    path: "/lecturer-dashboard/attendance",
  },
  {
    text: "Jobs Vancies",
    icon: (
      <img
        src={"/fi_truck.svg"}
        className="w-[1.4rem]"
        width={0}
        height={0}
        alt="jobs"
      />
    ),
    path: "/lecturer-dashboard/job-listing",
  },
  {
    text: "Leave MIS",
    icon: (
      <img
        src={"/fi_file-text.svg"}
        className="w-[1.4rem]"
        width={0}
        height={0}
        alt="leave mis"
      />
    ),
    path: "/lecturer-dashboard/leave",
  },
];

const bottomNavItems = [
  { text: "Settings", icon: <SettingsIcon /> },
  { text: "Help Center", icon: <HelpIcon /> },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [textVisible, setTextVisible] = React.useState(true);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const toggleTextVisibility = () => {
    setTextVisible(!textVisible);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Call the logout API
      await apiService.logout();

      // Clear the token from localStorage
      localStorage.removeItem("jwt_token");

      // Clear any other user-related data if needed
      localStorage.removeItem("user_data");
      sessionStorage.clear();

      // Redirect to login page
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);

      // Even if API call fails, clear local storage and redirect
      // This ensures user is logged out on the client side
      localStorage.removeItem("jwt_token");

      // Optionally show error message to user
      // You can use a toast notification library here
      console.warn("Logout API failed, but user has been logged out locally.");

      // Redirect anyway
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: textVisible ? 305 : 80,
          flexShrink: 0,
          transition: "width 0.3s ease",
          "& .MuiDrawer-paper": {
            width: textVisible ? 305 : 80,
            boxSizing: "border-box",
            boxShadow: "0px 0px 41px rgba(0, 0, 0, 0.3)",
            border: "none",
            transition: "width 0.3s ease",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="800"
            color="#09498a"
            sx={{
              display: textVisible ? "block" : "none",
            }}
          >
            AUCA - HR
          </Typography>
          <IconButton onClick={toggleTextVisibility}>
            <MenuIcon />
          </IconButton>
        </Box>

        <List>
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={index}
                href={item.path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem
                  sx={{
                    mx: 2,
                    borderRadius: 2,
                    mb: 1,
                    position: "relative",
                    bgcolor: isActive ? "#09498a" : "transparent",
                    "&:hover": {
                      bgcolor: isActive ? "#09498a" : "#eeeeee",
                    },
                  }}
                >
                  {isActive && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: -8,
                        width: 7,
                        height: 53,
                        bgcolor: "#09498a",
                        borderRadius: "11px",
                      }}
                    />
                  )}
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? "#ffffff" : "#808080",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontFamily: "Outfit",
                      fontSize: "1.25rem",
                      color: isActive ? "#ffffff" : "#808080",
                      display: textVisible ? "inline" : "none",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  />
                </ListItem>
              </Link>
            );
          })}
        </List>

        <Box sx={{ mt: "auto" }}>
          <List>
            {bottomNavItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 40, color: "#808080" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontFamily: "Outfit",
                    fontSize: "1.25rem",
                    color: "#808080",
                    display: textVisible ? "inline" : "none",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              disabled={isLoggingOut}
              sx={{
                bgcolor: "#09498a",
                borderRadius: "14px",
                py: 2,
                textTransform: "none",
                fontSize: "1.4rem",
                display: textVisible ? "flex" : "none",
                "&:disabled": {
                  bgcolor: "#09498a",
                  opacity: 0.6,
                },
              }}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;