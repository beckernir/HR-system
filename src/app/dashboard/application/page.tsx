"use client"

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
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
} from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  // Sample data for the table
  const applicationsData = [
    {
      id: "0001",
      fullname: "Muhongayire Claudia",
      phone: "0788112233",
      nid: "1199080012304567",
      position: "Head of Finance",
    },
    {
      id: "0002",
      fullname: "Abayo Laurent",
      phone: "0788112233",
      nid: "1199080012304567",
      position: "Teacher",
    },
    {
      id: "0003",
      fullname: "Rugwiza Bernard",
      phone: "0788112233",
      nid: "1199080012304567",
      position: "Head of IT",
    },
    {
      id: "0004",
      fullname: "Twizere Phanuel",
      phone: "0788112233",
      nid: "1199080012304567",
      position: "HOD-Accounting",
    },
    {
      id: "0005",
      fullname: "Humure Jean Pierre",
      phone: "0788112233",
      nid: "1199080012304567",
      position: "HOD-Networking",
    },
    {
      id: "0006",
      fullname: "Murinzi Ayman",
      phone: "0788112233",
      nid: "1199080012304567",
      position: "Teacher",
    },
    {
      id: "0007",
      fullname: "Kamali Patrick",
      phone: "0788112233",
      nid: "1199080012304567",
      position: "Teacher",
    },
  ];

  const handleRowClick = (id: any) => {
    console.log(`Row clicked: ${id}`);
  };

  const route = useRouter();

  return (
  <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

        {/* Tab navigation */}
        <Box sx={{ mb: 4 }}>
          <Paper
            sx={{
              display: "flex",
              borderRadius: "18px",
              overflow: "hidden",
              bgcolor: "rgba(48, 63, 138, 0.59)",
            }}
          >
            <Box sx={{ flex: 1, p: 2, textAlign: "center" }} onClick={()=>{route.push("/dashboard/job-management")}}>
              <Typography variant="h6" color="white">
                Create Jobs
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                p: 2,
                textAlign: "center",
                bgcolor: "rgba(48, 63, 138, 1)",
              }}
            >
              <Typography variant="h6" color="white">
                Application Management
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Typography
          variant="h4"
          fontWeight={500}
          color="#09498a"
          align="center"
          sx={{ mb: 4 }}
        >
          Applications Management
        </Typography>

        {/* Applications header with search and filters */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" fontWeight={500} color="#09498a">
            Applications
          </Typography>

          <Autocomplete
            freeSolo
            options={[]}
            sx={{ width: 292, ml: 3 }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search worker name"
                variant="outlined"
                sx={{
                  bgcolor: "#d0d4d8",
                  borderRadius: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    height: 39,
                    "& fieldset": { border: "none" },
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <SearchIcon fontSize="small" sx={{ color: "#9c9fa2" }} />
                  ),
                }}
              />
            )}
          />

          <Button
            variant="contained"
            startIcon={<SortIcon />}
            sx={{
              ml: 2,
              bgcolor: "#e0b404",
              color: "#555657",
              borderRadius: 4,
              textTransform: "none",
              height: 39,
              "&:hover": {
                bgcolor: "#c9a304",
              },
            }}
          >
            Sort by position
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{
              borderRadius: 4,
              border: "1.5px solid rgba(0, 0, 0, 0.58)",
              color: "rgba(0, 0, 0, 0.62)",
              textTransform: "none",
            }}
          >
            Generate Report
          </Button>
        </Box>

        {/* Applications table */}
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
            borderRadius: "10px 10px 0 0",
            overflow: "hidden",
          }}
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
                  Fullnames
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                >
                  Phone
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                >
                  NID
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                >
                  Position
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                >
                  Cert_files
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 500, fontSize: 20 }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applicationsData.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => handleRowClick(row.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                    {row.id}
                  </TableCell>
                  <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                    {row.fullname}
                  </TableCell>
                  <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                    {row.phone}
                  </TableCell>
                  <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                    {row.nid}
                  </TableCell>
                  <TableCell sx={{ fontSize: 18, fontWeight: 300 }}>
                    {row.position}
                  </TableCell>
                  <TableCell>
                    <IconButton color="error">
                      <PictureAsPdfIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton color="success">
                        <RefreshIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  );
};

export default AdminDashboard;