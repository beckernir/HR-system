"use client"
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";

import {
  Autocomplete,
  Box,
  Button,
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
} from "@mui/material";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock data for workers
const workersData = [
  {
    id: "0001",
    fullname: "Muhongayire Claudia",
    phone: "0788112233",
    position: "Head of Finance",
    startDate: "April 4, 2025",
    endDate: "April 4, 2025",
    status: "rejected",
  },
  {
    id: "0002",
    fullname: "Abayo Laurent",
    phone: "0788112233",
    position: "Teacher",
    startDate: "April 4, 2025",
    endDate: "April 4, 2025",
    status: "approved",
  },
  {
    id: "0003",
    fullname: "Rugwiza Bernard",
    phone: "0788112233",
    position: "Head of IT",
    startDate: "May 4, 2025",
    endDate: "April 4, 2025",
    status: "approved",
  },
  {
    id: "0004",
    fullname: "Twizere Phanuel",
    phone: "0788112233",
    position: "HOD-Accounting",
    startDate: "June 4, 2025",
    endDate: "April 4, 2025",
    status: "approved",
  },
  {
    id: "0005",
    fullname: "Humure Jean Pierre",
    phone: "0788112233",
    position: "HOD-Networking",
    startDate: "April 4, 2025",
    endDate: "April 4, 2025",
    status: "rejected",
  },
  {
    id: "0006",
    fullname: "Murinzi Ayman",
    phone: "0788112233",
    position: "Teacher",
    startDate: "March 12, 2025",
    endDate: "April 4, 2025",
    status: "rejected",
  },
  {
    id: "0007",
    fullname: "Kamali Patrick",
    phone: "0788112233",
    position: "Teacher",
    startDate: "April 4, 2025",
    endDate: "April 4, 2025",
    status: "approved",
  },
];

const AdminDashboard = () => {
  const route = useRouter();
  return (
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

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
              bgcolor: "rgba(48, 63, 138, 0.59)",
              borderRadius: "18px 0 0 18px",
              py: 1.5,
              px: 4,
              flex: 1,
              textTransform: "none",
              fontSize: "22px",
              fontFamily: "Outfit-Regular, Helvetica",
            }}
            onClick={()=>{route.push("/dashboard/leave-application")}}
          >
            Leave Application Dash
          </Button>
          <Button
            variant="contained"
            disableElevation
            sx={{
              bgcolor: "#303f8a",
              borderRadius: "0 18px 18px 0",
              py: 1.5,
              px: 4,
              flex: 1,
              textTransform: "none",
              fontSize: "22px",
              fontFamily: "Outfit-Regular, Helvetica",
            }}
          >
            Leave Status Management
          </Button>
        </Paper>

        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            color: "#09498a",
            fontFamily: "Outfit-Medium, Helvetica",
            fontSize: 31,
            textAlign: "center",
            mb: 4,
          }}
        >
          Leave Status Management
        </Typography>

        {/* Table Section */}
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#09498a",
                fontFamily: "Outfit-Medium, Helvetica",
                fontSize: 24,
              }}
            >
              Workers List
            </Typography>

            <Stack direction="row" spacing={2}>
              <Autocomplete
                freeSolo
                options={[]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search worker name"
                    variant="outlined"
                    sx={{
                      width: 292,
                      bgcolor: "#d0d4d8",
                      borderRadius: "12px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "& fieldset": {
                          border: "none",
                        },
                      },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <SearchIcon fontSize="small" />,
                      sx: { height: 39 },
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
                  fontSize: 18,
                  fontFamily: "Outfit-Light, Helvetica",
                  height: 39,
                  "&:hover": {
                    bgcolor: "#c9a304",
                  },
                }}
              >
                Sort by Approved
              </Button>

              <Button
                variant="outlined"
                endIcon={<DownloadIcon />}
                sx={{
                  borderRadius: "12px",
                  borderColor: "rgba(0, 0, 0, 0.58)",
                  color: "rgba(0, 0, 0, 0.62)",
                  textTransform: "none",
                  fontSize: 16,
                  fontFamily: "Outfit-Light, Helvetica",
                }}
              >
                Generate Report
              </Button>
            </Stack>
          </Stack>

          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "rgba(81, 82, 82, 0.79)",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: 20,
                      fontFamily: "Outfit-Medium, Helvetica",
                      textAlign: "center",
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: 20,
                      fontFamily: "Outfit-Medium, Helvetica",
                      textAlign: "center",
                    }}
                  >
                    Fullnames
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: 20,
                      fontFamily: "Outfit-Medium, Helvetica",
                      textAlign: "center",
                    }}
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: 20,
                      fontFamily: "Outfit-Medium, Helvetica",
                      textAlign: "center",
                    }}
                  >
                    NID
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: 20,
                      fontFamily: "Outfit-Medium, Helvetica",
                      textAlign: "center",
                    }}
                  >
                    Start_Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: 20,
                      fontFamily: "Outfit-Medium, Helvetica",
                      textAlign: "center",
                    }}
                  >
                    End_Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: 20,
                      fontFamily: "Outfit-Medium, Helvetica",
                      textAlign: "center",
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workersData.map((worker) => (
                  <TableRow key={worker.id} hover>
                    <TableCell
                      sx={{
                        fontSize: 18,
                        fontFamily: "Outfit-Light, Helvetica",
                        textAlign: "center",
                      }}
                    >
                      {worker.id}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 18,
                        fontFamily: "Outfit-Light, Helvetica",
                        textAlign: "center",
                      }}
                    >
                      {worker.fullname}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 18,
                        fontFamily: "Outfit-Light, Helvetica",
                        textAlign: "center",
                      }}
                    >
                      {worker.phone}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 18,
                        fontFamily: "Outfit-Light, Helvetica",
                        textAlign: "center",
                      }}
                    >
                      {worker.position}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 18,
                        fontFamily: "Outfit-Light, Helvetica",
                        textAlign: "center",
                      }}
                    >
                      {worker.startDate}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 18,
                        fontFamily: "Outfit-Light, Helvetica",
                        textAlign: "center",
                      }}
                    >
                      {worker.endDate}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 18,
                        fontFamily: "Outfit-Light, Helvetica",
                        textAlign: "center",
                      }}
                    >
                      {worker.status === "approved" ? (
                        <CheckCircleIcon sx={{ color: "green" }} />
                      ) : (
                        <CancelIcon sx={{ color: "red" }} />
                      )}
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