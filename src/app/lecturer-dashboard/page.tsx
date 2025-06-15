"use client";

import {
  Box,
} from "@mui/material";
import React from "react";
import Dashboard2 from "@/components/dashboard/Dashboard2";

const AdminDashboard = () => {

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Dashboard2 />
    </Box>
  );
};

export default AdminDashboard;
