"use client";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import DownloadIcon from "@mui/icons-material/Download";

import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/lib/apiService"; // adjust import as needed


const AdminDashboard = () => {
  const router = useRouter();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(""); // 'approve' or 'reject'
  const [comments, setComments] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch all leave requests on component mount
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Filter requests based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = leaveRequests.filter(
        (request) =>
          request.lecturerName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.lecturerEmail
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.id?.toString().includes(searchTerm)
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(leaveRequests);
    }
  }, [searchTerm, leaveRequests]);


  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const data = await apiService.getLeaveRequests(); // Call the ApiService method
      setLeaveRequests(data);
      setError(null);
    } catch (err) {
      setError("Failed to load leave requests. Please try again.");
      console.error("Error fetching leave requests:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAction = async (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setComments("");
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest) return;

    try {
      setActionLoading(true);

      let updatedRequest;

      if (actionType === "approve") {
        updatedRequest = await apiService.approveLeaveRequest(
          selectedRequest.id
        );
      } else {
        // For rejection, send comments (or empty string if blank)
        updatedRequest = await apiService.rejectLeaveRequest(
          selectedRequest.id,
          comments.trim()
        );
      }

      // Update local state
      setLeaveRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === updatedRequest.id ? updatedRequest : req
        )
      );

      setDialogOpen(false);
      setError(null);

      console.log(`Leave request ${actionType}d successfully`);
    } catch (err) {
      setError(`Failed to ${actionType} leave request. Please try again.`);
      console.error(`Error ${actionType}ing leave request:`, err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoute = () => {
    router.push("/dashboard/leave-status");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tab navigation */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          borderRadius: "18px",
          overflow: "hidden",
          mb: 4,
        }}
      >
        <Button
          variant="contained"
          disableElevation
          sx={{
            bgcolor: "#303f8a",
            borderRadius: "18px 0 0 18px",
            py: 1.5,
            px: 4,
            flex: 1,
            textTransform: "none",
            fontSize: "22px",
            fontFamily: "Outfit-Regular, Helvetica",
          }}
        >
          Leave Application Dash
        </Button>
        <Button
          variant="contained"
          disableElevation
          sx={{
            bgcolor: "rgba(48, 63, 138, 0.59)",
            borderRadius: "0 18px 18px 0",
            py: 1.5,
            px: 4,
            flex: 1,
            textTransform: "none",
            fontSize: "22px",
            fontFamily: "Outfit-Regular, Helvetica",
          }}
          onClick={handleRoute}
        >
          Leave Status Management
        </Button>
      </Paper>

      {/* Page title */}
      <Typography
        variant="h4"
        sx={{
          color: "#09498a",
          fontFamily: "Outfit-Medium, Helvetica",
          fontWeight: 500,
          fontSize: "31px",
          mb: 4,
          textAlign: "center",
        }}
      >
        Leave Application Dash
      </Typography>

      {/* Table section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#09498a",
              fontFamily: "Outfit-Medium, Helvetica",
              fontWeight: 500,
              fontSize: "24px",
            }}
          >
            Leave Requests ({filteredRequests.length})
          </Typography>

          <Stack direction="row" spacing={2}>
            <Autocomplete
              freeSolo
              options={[]}
              value={searchTerm}
              onInputChange={(event, newValue) => setSearchTerm(newValue)}
              sx={{ width: 292 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search by name, email, or ID"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#d0d4d8",
                      borderRadius: "12px",
                      height: 39,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: <SearchIcon fontSize="small" />,
                  }}
                />
              )}
            />

            <Button
              variant="contained"
              startIcon={<SortIcon />}
              sx={{
                bgcolor: "#e0b404",
                color: "#555657",
                borderRadius: "12px",
                textTransform: "none",
                width: 225,
                height: 39,
                fontFamily: "Outfit-Light, Helvetica",
                fontWeight: 300,
                fontSize: "18px",
              }}
              onClick={() => {
                const sorted = [...filteredRequests].sort(
                  (a, b) => new Date(a.startDate) - new Date(b.startDate)
                );
                setFilteredRequests(sorted);
              }}
            >
              Sort by earliest
            </Button>

            <Button
              variant="outlined"
              endIcon={<DownloadIcon />}
              sx={{
                borderRadius: "12px",
                borderColor: "rgba(0, 0, 0, 0.58)",
                color: "rgba(0, 0, 0, 0.62)",
                textTransform: "none",
                fontFamily: "Outfit-Light, Helvetica",
                fontWeight: 300,
                fontSize: "16px",
              }}
            >
              Generate Report
            </Button>
          </Stack>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#515252c9" }}>
                <TableCell
                  sx={{
                    color: "white",
                    fontFamily: "Outfit-Medium, Helvetica",
                    fontWeight: 500,
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontFamily: "Outfit-Medium, Helvetica",
                    fontWeight: 500,
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  Lecturer Name
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontFamily: "Outfit-Medium, Helvetica",
                    fontWeight: 500,
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  Leave Type
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontFamily: "Outfit-Medium, Helvetica",
                    fontWeight: 500,
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  Start Date
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontFamily: "Outfit-Medium, Helvetica",
                    fontWeight: 500,
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  End Date
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontFamily: "Outfit-Medium, Helvetica",
                    fontWeight: 500,
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontFamily: "Outfit-Medium, Helvetica",
                    fontWeight: 500,
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell
                    sx={{
                      fontFamily: "Outfit-Light, Helvetica",
                      fontWeight: 300,
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    {request.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Outfit-Light, Helvetica",
                      fontWeight: 300,
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    {request.lecturerName || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Outfit-Light, Helvetica",
                      fontWeight: 300,
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    {request.leaveType || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Outfit-Light, Helvetica",
                      fontWeight: 300,
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    {formatDate(request.startDate)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Outfit-Light, Helvetica",
                      fontWeight: 300,
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    {formatDate(request.endDate)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Chip
                      label={request.status || "PENDING"}
                      color={getStatusColor(request.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        color="success"
                        onClick={() => handleAction(request, "approve")}
                        disabled={request.status !== "PENDING"}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleAction(request, "reject")}
                        disabled={request.status !== "PENDING"}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No leave requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionType === "approve" ? "Approve" : "Reject"} Leave Request
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to {actionType} the leave request for{" "}
            {selectedRequest?.lecturerName}?
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Comments (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={`Add comments for ${actionType}ing this request...`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            variant="contained"
            color={actionType === "approve" ? "success" : "error"}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <CircularProgress size={20} />
            ) : (
              `${actionType === "approve" ? "Approve" : "Reject"}`
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;