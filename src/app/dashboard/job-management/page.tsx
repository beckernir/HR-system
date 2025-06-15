"use client";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Delete from "@mui/icons-material/Delete";
import Download from "@mui/icons-material/Download";
import Refresh from "@mui/icons-material/Refresh";
import Search from "@mui/icons-material/Search";
import Sort from "@mui/icons-material/Sort";
import FileText from "@mui/icons-material/Star"; // Placeholder for FileText

import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Sample data for jobs
  const jobsData = [
    {
      id: "0001",
      jobTitle: "Head of Department (BA)",
      applicationDue: "April 9, 2025",
      position: "Head of Finance",
      requirementFile: true,
    },
    {
      id: "0002",
      jobTitle: "Bible Teacher",
      applicationDue: "April 9, 2025",
      position: "Teacher",
      requirementFile: true,
    },
    {
      id: "0003",
      jobTitle: "Head of Department (IT)",
      applicationDue: "April 9, 2025",
      position: "Head of IT",
      requirementFile: true,
    },
    {
      id: "0004",
      jobTitle: "PL/SQL Teacher",
      applicationDue: "April 9, 2025",
      position: "Teacher",
      requirementFile: true,
    },
    {
      id: "0005",
      jobTitle: "Applied Maths Teacher",
      applicationDue: "April 9, 2025",
      position: "HOD-Networking",
      requirementFile: true,
    },
  ];

  // State for active tab
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  const route = useRouter();

  return (
      <Box sx={{ flexGrow: 1, p: 2, width: "100%", ml: isMobile ? 0 : "5px" }}>

        {/* Tabs */}
        <Box sx={{ mb: 4 }}>
          <Paper
            sx={{
              display: "flex",
              borderRadius: "18px",
              overflow: "hidden",
              bgcolor: "rgba(48, 63, 138, 0.59)",
            }}
          >
            <Box sx={{ flex: 1, p: 2, textAlign: "center", bgcolor: "rgba(48, 63, 138, 0.59)", }}>
              <Typography variant="h6" color="white">
                Create Jobs
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                p: 2,
                textAlign: "center",
              }}
              onClick={()=>{route.push("/dashboard/application")}}
            >
              <Typography variant="h6" color="white">
                Application Management
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Main Content Title */}
        <Typography
          variant="h4"
          fontWeight={500}
          color="#09498a"
          align="center"
          sx={{ mb: 3 }}
        >
          Jobs Management
        </Typography>

        {/* Job Creation Form */}
        <Box sx={{ mb: 4 }}>
          <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ mb: 2 }}>
            <TextField
              placeholder="Enter Job Title"
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: "#d0d4d8",
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                },
              }}
            />
            <TextField
              select
              placeholder="Choose position type"
              fullWidth
              variant="outlined"
              sx={{
                bgcolor: "#d0d4d8",
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                },
              }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Choose position type</option>
            </TextField>
          </Stack>

          <TextField
            placeholder="Pick Application due date"
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarToday />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              bgcolor: "#d0d4d8",
              borderRadius: "12px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
              },
            }}
          />

          <TextField
            placeholder="Add a job requirement file (pdf format limit size 10Mbs)"
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FileText />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <FileText />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              bgcolor: "#d0d4d8",
              borderRadius: "12px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{
                width: "100%",
                maxWidth: 383,
                py: 1,
                bgcolor: "#3b9f2b",
                borderRadius: "11px",
                textTransform: "none",
                fontSize: 19,
                fontWeight: 200,
              }}
            >
              Add job
            </Button>
          </Box>
        </Box>

        {/* Jobs List */}
        <Box>
          <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", mb: 2, gap: 2 }}>
            <Typography
              variant="h5"
              fontWeight={500}
              color="#09498a"
              sx={{ mr: 2 }}
            >
              Jobs List
            </Typography>

            <Autocomplete
              freeSolo
              options={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search worker name"
                  variant="outlined"
                  sx={{
                    width: "100%",
                    maxWidth: 292,
                    bgcolor: "#d0d4d8",
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { border: "none" },
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: <Search />,
                  }}
                />
              )}
            />

            <Button
              variant="contained"
              startIcon={<Sort />}
              sx={{
                bgcolor: "#e0b404",
                color: "#4e4e4e",
                borderRadius: "12px",
                textTransform: "none",
              }}
            >
              Sort by latest
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="outlined"
              endIcon={<Download />}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                color: "rgba(0,0,0,0.62)",
                borderColor: "rgba(0,0,0,0.58)",
              }}
            >
              Generate Report
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{ borderRadius: "10px 10px 0 0", overflowX: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(81, 82, 82, 0.79)" }}>
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    JobTitle
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    Application_Due
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    Position
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    Requirement_file
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobsData.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                      {job.id}
                    </TableCell>
                    <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                      {job.jobTitle}
                    </TableCell>
                    <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                      {job.applicationDue}
                    </TableCell>
                    <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                      {job.position}
                    </TableCell>
                    <TableCell>
                      <IconButton color="error">
                        <FileText />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton color="error">
                          <Delete />
                        </IconButton>
                        <IconButton color="primary">
                          <Refresh />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
  );
};

export default AdminDashboard;
