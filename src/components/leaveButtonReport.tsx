
import React, { useState } from 'react';
import { Button, Menu, MenuItem, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import { ApiService } from './lib/apiService'; // Update path as needed
import apiService from "@/lib/apiService"; // adjust import as needed


const LeaveReportButton = ({ 
  search = '', 
  orderColumn = null, 
  orderDirection = 'asc',
  variant = 'dropdown' // 'dropdown' or 'simple'
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (variant === 'dropdown') {
      setAnchorEl(event.currentTarget);
    } else {
      // For simple variant, directly download PDF
      handleDownload('pdf');
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format) => {
    setLoading(true);
    handleClose();
    
    try {
      let result;
      
      switch (format) {
        case 'pdf':
          result = await apiService.generatePdfReport(search, orderColumn, orderDirection);
          break;
        case 'csv':
          result = await apiService.generateCsvReport(search, orderColumn, orderDirection);
          break;
        case 'excel':
          result = await apiService.generateExcelReport(search, orderColumn, orderDirection);
          break;
        default:
          throw new Error('Invalid format');
      }
      
      if (result.success) {
        console.log('Report generated successfully:', result.message);
        // You could show a success notification here
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert(`Failed to generate report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'simple') {
    return (
      <Button
        variant="outlined"
        endIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon />}
        onClick={handleClick}
        disabled={loading}
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
        {loading ? 'Generating...' : 'Generate Report'}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        endIcon={loading ? <CircularProgress size={16} /> : <KeyboardArrowDownIcon />}
        onClick={handleClick}
        disabled={loading}
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
        {loading ? 'Generating...' : 'Generate Report'}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'report-button',
        }}
      >
        <MenuItem onClick={() => handleDownload('pdf')}>
          <DownloadIcon sx={{ mr: 1 }} />
          Download PDF
        </MenuItem>
        <MenuItem onClick={() => handleDownload('csv')}>
          <DownloadIcon sx={{ mr: 1 }} />
          Download CSV
        </MenuItem>
        <MenuItem onClick={() => handleDownload('excel')}>
          <DownloadIcon sx={{ mr: 1 }} />
          Download Excel
        </MenuItem>
      </Menu>
    </>
  );
};

export default LeaveReportButton;