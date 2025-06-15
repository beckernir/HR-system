"use client";

import {
  Box
} from "@mui/material";
import React from "react";
import Dashboard from "@/components/dashboard/Dashboard";


const AdminDashboard = () => {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Dashboard />
    </Box>
  );
};

export default AdminDashboard;
