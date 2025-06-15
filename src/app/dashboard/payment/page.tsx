"use client";

import GetAppIcon from "@mui/icons-material/GetApp";
import MessageIcon from "@mui/icons-material/Message";
import SupportIcon from "@mui/icons-material/Support";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DescriptionIcon from "@mui/icons-material/Description";
import HelpIcon from "@mui/icons-material/Help";
import LayersIcon from "@mui/icons-material/Layers";
import TruckIcon from "@mui/icons-material/LocalShipping";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import UsersIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import SortIcon from "@mui/icons-material/Sort";
import CheckSquareIcon from "@mui/icons-material/Star";
import {
  AppBar,
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";

// Mock data for the workers table
const workersData = [
  {
    id: "0001",
    fullname: "Muhongayire Claudia",
    nid: "1199080012304567",
    salary: "345,000 Rwf",
    account: "275889011234",
    status: "Pending",
  },
  {
    id: "0002",
    fullname: "Abayo Laurent",
    nid: "1199080012304567",
    salary: "874,012 Rwf",
    account: "275889011234",
    status: "Pending",
  },
  {
    id: "0003",
    fullname: "Rugwiza Bernard",
    nid: "1199080012304567",
    salary: "1,035,500 Rwf",
    account: "275889011234",
    status: "Pending",
  },
  {
    id: "0004",
    fullname: "Twizere Phanuel",
    nid: "1199080012304567",
    salary: "201,400 Rwf",
    account: "275889011234",
    status: "Received",
  },
  {
    id: "0005",
    fullname: "Humure Jean Pierre",
    nid: "1199080012304567",
    salary: "874,012 Rwf",
    account: "275889011234",
    status: "Received",
  },
  {
    id: "0006",
    fullname: "Murinzi Ayman",
    nid: "1199080012304567",
    salary: "1,035,500 Rwf",
    account: "275889011234",
    status: "Received",
  },
  {
    id: "0007",
    fullname: "Kamali Patrick",
    nid: "1199080012304567",
    salary: "201,400 Rwf",
    account: "275889011234",
    status: "Not Payed",
  },
];

// Navigation items
const navItems = [
  { text: "Dashboard", icon: <LayersIcon />, path: "/dashboard" },
  {
    text: "Attendance",
    icon: <CheckSquareIcon />,
    path: "/dashboard/attendance",
  },
  {
    text: "Payments",
    icon: <CreditCardIcon />,
    path: "/dashboard/payment",
    active: true,
  },
  { text: "Jobs", icon: <TruckIcon />, path: "/dashboard/job-management" },
  {
    text: "Leave MIS",
    icon: <DescriptionIcon />,
    path: "/dashboard/leave-application",
  },
  {
    text: "Workers MIS",
    icon: <UsersIcon />,
    path: "/dashboard/work-management",
  },
];
// Bottom nav items
const bottomNavItems = [
  { text: "Settings", icon: <SettingsIcon /> },
  { text: "Help Center", icon: <HelpIcon /> },
];
const AdminDashboard = () => {
  const [searchValue, setSearchValue] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Get status color based on status text
  const getStatusColor = (status: any) => {
    switch (status) {
      case "Pending":
        return "#e0b404";
      case "Received":
        return "#179804";
      case "Not Payed":
        return "#e73131";
      default:
        return "grey";
    }
  };

  // Get authorization button props based on status
  const getAuthButtonProps = (status: any) => {
    if (status === "Received") {
      return {
        text: "Authorized",
        bgcolor: "#179804",
      };
    } else {
      return {
        text: "Unauthorized",
        bgcolor: "#e73131",
      };
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 2, width: "100%" }}>
      {/* Main content area */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          fontWeight={500}
          color="#09498a"
          align="center"
          sx={{ mb: 4 }}
        >
          Payment
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
          }}
          width="100%"
        >
          <Box sx={{ mb: 3, width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={500}
                color="#09498A"
                sx={{ mb: 1 }}
              >
                View Records
              </Typography>
              <Select
                value=""
                displayEmpty
                sx={{
                  height: 43,
                  borderRadius: "12px",
                  border: "1.5px solid rgba(0, 0, 0, 0.58)",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  width: isTablet ? "100%" : 169,
                }}
                renderValue={() => "Choose Year"}
              >
                <MenuItem value="">Choose Year</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
              </Select>

              <Select
                value=""
                displayEmpty
                sx={{
                  height: 43,
                  borderRadius: "12px",
                  border: "1.5px solid rgba(0, 0, 0, 0.58)",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  width: isTablet ? "100%" : 190,
                }}
                renderValue={() => "Choose Month"}
              >
                <MenuItem value="">Choose Month</MenuItem>
                <MenuItem value="1">January</MenuItem>
                <MenuItem value="2">February</MenuItem>
                <MenuItem value="3">March</MenuItem>
              </Select>

              <Button
                variant="contained"
                sx={{
                  bgcolor: "#303f8a",
                  borderRadius: "11px",
                  height: 43,
                  width: isTablet ? "100%" : 225,
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
          <Box sx={{ mb: 3, width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: isTablet ? "column" : "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={500}
                color="#09498a"
                sx={{ mb: 1 }}
              >
                Current Payment
              </Typography>
              <TextField
                value="Current Month/Year: March/2025"
                InputProps={{
                  readOnly: true,
                  sx: {
                    height: 43,
                    borderRadius: "12px",
                    border: "1.5px solid rgba(0, 0, 0, 0.58)",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  },
                }}
                sx={{ width: isTablet ? "100%" : 374 }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#168d04d6",
                  borderRadius: "11px",
                  height: 43,
                  width: isTablet ? "100%" : 225,
                }}
              >
                Make Payment for all
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography
            variant="h6"
            fontWeight={500}
            color="#09498A"
            sx={{ mb: 1 }}
          >
            Workers List
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: isTablet ? "column" : "row",
              alignItems: isTablet ? "flex-start" : "center",
              gap: 2,
              mb: 2,
              width: "100%",
            }}
          >
            <Autocomplete
              freeSolo
              options={[]}
              sx={{ width: isTablet ? "100%" : 374 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search for Worker NID/Passport ID"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: "#d0d4d8",
                      borderRadius: "12px",
                      height: 39,
                      "& fieldset": { border: "none" },
                    },
                  }}
                />
              )}
            />

            <Button
              variant="contained"
              endIcon={<SortIcon />}
              sx={{
                bgcolor: "#e0b404",
                borderRadius: "12px",
                height: 39,
                width: isTablet ? "100%" : 149,
                color: "#4e4e4e",
                textTransform: "none",
              }}
            >
              Status
            </Button>

            <Button
              variant="outlined"
              endIcon={<GetAppIcon />}
              sx={{
                borderRadius: "12px",
                height: 39,
                width: isTablet ? "100%" : 199,
                borderColor: "rgba(0, 0, 0, 0.58)",
                color: "rgba(0, 0, 0, 0.62)",
                textTransform: "none",
              }}
            >
              Generate Report
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{ boxShadow: "none", overflowX: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "rgba(81, 82, 82, 0.79)",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    Fullnames
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    NID
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    Salary
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    Account
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workersData.map((worker) => {
                  const authButton = getAuthButtonProps(worker.status);
                  return (
                    <TableRow key={worker.id} hover>
                      <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                        {worker.id}
                      </TableCell>
                      <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                        {worker.fullname}
                      </TableCell>
                      <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                        {worker.nid}
                      </TableCell>
                      <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                        {worker.salary}
                      </TableCell>
                      <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                        {worker.account}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              bgcolor: getStatusColor(worker.status),
                              mr: 1,
                            }}
                          />
                          <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                            {worker.status}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            bgcolor: authButton.bgcolor,
                            borderRadius: "10px",
                            fontSize: 12,
                            textTransform: "none",
                            px: 2,
                            color: "white",
                          }}
                          className="w-full"
                        >
                          {authButton.text}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
