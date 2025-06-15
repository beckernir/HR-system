"use client";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";

import {
  Autocomplete,
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

const Attendance = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Employee data for the table
  const employeeData = [
    {
      id: "0001",
      name: "Muhongayire Claudia",
      phone: "0788112233",
      attendance: "Yes",
      time: "07:46:51",
      issue: "Yes",
    },
    {
      id: "0002",
      name: "Abayo Laurent",
      phone: "0788112233",
      attendance: "Yes",
      time: "08:12:51",
      issue: "No",
    },
    {
      id: "0003",
      name: "Rugwiza Bernard",
      phone: "0788112233",
      attendance: "Yes",
      time: "08:28:07",
      issue: "No",
    },
    {
      id: "0004",
      name: "Twizere Phanuel",
      phone: "0788112233",
      attendance: "No",
      time: "-",
      issue: "Yes",
    },
    {
      id: "0005",
      name: "Humure Jean Pierre",
      phone: "0788112233",
      attendance: "Yes",
      time: "09:02:11",
      issue: "No",
    },
    {
      id: "0006",
      name: "Murinzi Ayman",
      phone: "0788112233",
      attendance: "Yes",
      time: "08:33:27",
      issue: "No",
    },
    {
      id: "0007",
      name: "Kamali Patrick",
      phone: "0788112233",
      attendance: "No",
      time: "-",
      issue: "No",
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
      {/* Main content title */}
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontFamily: "Outfit-SemiBold, Helvetica",
          fontWeight: 600,
          color: "#09498a",
          mb: 4,
        }}
      >
        Daily Attendance Records
      </Typography>

      {/* Filter controls */}
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        alignItems="center"
        sx={{ mb: 3, gap: 2 }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Outfit-Light, Helvetica",
            fontWeight: 300,
            color: "#09498a",
            fontSize: "22px",
          }}
        >
          All Employees
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Autocomplete
          options={[]}
          freeSolo
          sx={{ width: "100%", maxWidth: 311 }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search month"
              variant="outlined"
              sx={{
                bgcolor: "#d0d4d8ab",
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  height: 40,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: <SearchIcon />,
              }}
            />
          )}
        />
        <Button
          variant="contained"
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            bgcolor: "#e0c24a",
            borderRadius: "13px",
            color: "rgba(0, 0, 0, 0.3)",
            textTransform: "none",
            px: 3,
            height: 40,
            fontFamily: "Poppins-Medium, Helvetica",
            fontWeight: 500,
          }}
        >
          Today
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#09498a",
            borderRadius: "11px",
            textTransform: "none",
            px: 3,
            height: 41,
            fontFamily: "Poppins-Regular, Helvetica",
            fontWeight: 400,
          }}
        >
          Generate Report
        </Button>
      </Stack>

      {/* Attendance table */}
      <TableContainer
        //   component={Paper}
        sx={{ boxShadow: "none", bgcolor: "transparent", overflowX: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.69)" }}>
              <TableCell
                sx={{
                  color: "white",
                  fontFamily: "Outfit-Medium, Helvetica",
                  fontWeight: 500,
                  fontSize: "1.25rem",
                }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontFamily: "Outfit-Medium, Helvetica",
                  fontWeight: 500,
                  fontSize: "1.25rem",
                }}
              >
                Fullnames
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontFamily: "Outfit-Medium, Helvetica",
                  fontWeight: 500,
                  fontSize: "1.25rem",
                }}
              >
                Phone
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontFamily: "Outfit-Medium, Helvetica",
                  fontWeight: 500,
                  fontSize: "1.25rem",
                }}
              >
                Attendance
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontFamily: "Outfit-Medium, Helvetica",
                  fontWeight: 500,
                  fontSize: "1.25rem",
                }}
              >
                Time
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontFamily: "Outfit-Medium, Helvetica",
                  fontWeight: 500,
                  fontSize: "1.25rem",
                }}
              >
                Issue
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeData.map((employee) => (
              <TableRow key={employee.id} hover onClick={() => {}}>
                <TableCell
                  sx={{
                    fontFamily: "Outfit-Light, Helvetica",
                    fontWeight: 300,
                    fontSize: "1.125rem",
                  }}
                >
                  {employee.id}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Outfit-Light, Helvetica",
                    fontWeight: 300,
                    fontSize: "1.125rem",
                  }}
                >
                  {employee.name}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Outfit-Light, Helvetica",
                    fontWeight: 300,
                    fontSize: "1.125rem",
                  }}
                >
                  {employee.phone}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Outfit-Light, Helvetica",
                    fontWeight: 300,
                    fontSize: "1.125rem",
                  }}
                >
                  {employee.attendance}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Outfit-Light, Helvetica",
                    fontWeight: 300,
                    fontSize: "1.125rem",
                  }}
                >
                  {employee.time}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Outfit-Light, Helvetica",
                    fontWeight: 300,
                    fontSize: "1.125rem",
                  }}
                >
                  {employee.issue}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Attendance;
