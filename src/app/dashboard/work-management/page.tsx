"use client";
import StepForm from "@/components/stepForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
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
import CheckSquareIcon from "@mui/icons-material/Star"; // Placeholder for CheckSquareIcon
import SupportIcon from "@mui/icons-material/Support";

import {
  AppBar,
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Pagination,
  PaginationItem,
  Paper,
  Select,
  Snackbar,
  Alert,
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
} from "@mui/material";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import apiService from "@/lib/apiService"; // adjust import as needed
import WorkerReportButton from "@/components/workerReportButton"; // adjust import as needed

// Define the Worker interface
interface Worker {
  id: number | string;
  fullNames: string;
  phoneNumber: string;
  nationality: string;
  workingPosition: string;
  academicRank: string;
}

export default function AdminDashboard() {
  const [sortColumn, setSortColumn] = useState(0); // 0 = first column, 1 = second column, etc.
  const [sortDirection, setSortDirection] = useState("asc");
  const route = useRouter();
  // Type the workers state with the Worker interface
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Worker | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // New state for search, filter, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [nidFilter, setNidFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can make this configurable

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9005/api/users?size=1000"
        );
        console.log("API Response:", response.data); // Debug log

        // Handle ApiResponse structure
        if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          console.log("First user object:", response.data.data[0]); // Debug: log first user
          console.log("All users:", response.data.data); // Debug: log all users
          setWorkers(response.data.data);
        } else {
          console.error("API response structure unexpected:", response.data);
          setWorkers([]); // Set empty array as fallback
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setWorkers([]); // Set empty array on error
      }
    };

    fetchUsers();
  }, []);

  // Filter and search logic
  const filteredWorkers = useMemo(() => {
    let filtered = workers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (worker) =>
          worker.fullNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
          worker.phoneNumber.includes(searchTerm) ||
          worker.workingPosition
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          worker.academicRank.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply NID filter
    if (nidFilter) {
      filtered = filtered.filter((worker) =>
        worker.nationality.toLowerCase().includes(nidFilter.toLowerCase())
      );
    }

    return filtered;
  }, [workers, searchTerm, nidFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredWorkers.length / itemsPerPage);
  const currentWorkers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredWorkers.slice(startIndex, endIndex);
  }, [filteredWorkers, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, nidFilter]);

  // Delete user function
  const handleDeleteClick = (worker: Worker) => {
    setUserToDelete(worker);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:9005/api/users/${userToDelete.id}`);

      // Remove user from local state
      setWorkers(workers.filter((worker) => worker.id !== userToDelete.id));

      setSnackbar({
        open: true,
        message: "User deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete user. Please try again.",
        severity: "error",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle search input change
  const handleSearchChange = (event: React.SyntheticEvent, value: string) => {
    setSearchTerm(value);
  };

  // Handle NID filter change
  const handleNidFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNidFilter(event.target.value);
  };

  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  // Navigation items
  const navItems = [
    { text: "Dashboard", icon: <LayersIcon />, path: "/dashboard" },
    {
      text: "Attendance",
      icon: <CheckSquareIcon />,
      path: "/dashboard/attendance",
    },
    { text: "Payments", icon: <CreditCardIcon />, path: "/dashboard/payment" },
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
      active: true,
    },
  ];

  // Bottom nav items
  const bottomNavItems = [
    { text: "Settings", icon: <SettingsIcon /> },
    { text: "Help Center", icon: <HelpIcon /> },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
      {/* Main content area */}
      <Box sx={{ px: 4, py: 2 }}>
        <StepForm />

        {/* Workers list section */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                color: "#09498a",
                fontFamily: "Outfit",
                fontWeight: "medium",
              }}
            >
              Workers List ({filteredWorkers.length})
            </Typography>
            <Box sx={{ flexGrow: 1, mx: 2 }}>
              <Autocomplete
                freeSolo
                options={[]}
                inputValue={searchTerm}
                onInputChange={handleSearchChange}
                sx={{ width: 292 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search worker name, phone, position..."
                    variant="outlined"
                    sx={{
                      bgcolor: "#d0d4d8",
                      borderRadius: "0.75rem",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0.75rem",
                      },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <SearchIcon fontSize="small" />,
                    }}
                  />
                )}
              />
            </Box>
            {/* NID Filter */}
            <Box sx={{ mx: 1 }}>
              <TextField
                placeholder="Filter by NID"
                variant="outlined"
                size="small"
                value={nidFilter}
                onChange={handleNidFilterChange}
                sx={{
                  bgcolor: "#f5f5f5",
                  borderRadius: "0.75rem",
                  width: 150,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.75rem",
                  },
                }}
              />
            </Box>
            <Button
              variant="contained"
              endIcon={<SortIcon />}
              sx={{
                bgcolor: "#e0b404",
                color: "#555657",
                borderRadius: "0.75rem",
                textTransform: "none",
                px: 3,
              }}
            >
              Fulltime
            </Button>
            <Box sx={{ ml: 2 }}>
              <WorkerReportButton
                            variant="dropdown"
                            search={searchTerm} 
                            orderDirection={sortDirection} 
                          />
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{ bgcolor: "#515252c9", borderRadius: "10px 10px 0 0" }}
                >
                  <TableCell sx={{ color: "white", fontWeight: "medium" }}>
                    #
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "medium" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "medium" }}>
                    Fullnames
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "medium" }}>
                    Phone
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "medium" }}>
                    NID
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "medium" }}>
                    Position
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "medium" }}>
                    Degree
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "medium" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(currentWorkers) &&
                  currentWorkers.map((worker, index) => (
                    <TableRow key={worker.id}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{worker.id}</TableCell>
                      <TableCell>{worker.fullNames}</TableCell>
                      <TableCell>{worker.phoneNumber}</TableCell>
                      <TableCell>{worker.nationality}</TableCell>
                      <TableCell>{worker.workingPosition}</TableCell>
                      <TableCell>{worker.academicRank}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(worker)}
                        >
                          <DeleteIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => {
                            route.push(`/dashboard/profile/${worker.id}`);
                          }}
                          color="primary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {(!Array.isArray(currentWorkers) ||
                  currentWorkers.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                      {searchTerm || nidFilter
                        ? "No workers found matching your search criteria"
                        : "No workers found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                    sx={{ color: "#005cbb" }}
                  />
                )}
              />
            </Box>
          )}

          {/* Pagination info */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Showing{" "}
              {currentWorkers.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}{" "}
              to {Math.min(currentPage * itemsPerPage, filteredWorkers.length)}{" "}
              of {filteredWorkers.length} workers
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete {userToDelete?.fullNames}? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
