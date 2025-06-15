"use client";
import React, { useState, useEffect } from "react";
import apiService from "@/lib/apiService"; // Update this path to your actual apiService location

// Define leave types enum (should match your backend enum)
const LEAVE_TYPES = {
  ANNUAL: "ANNUAL",
  SICK_LEAVE: "SICK_LEAVE",
  MATERNITY_LEAVE: "MATERNITY_LEAVE",
  PATERNITY_LEAVE: "PATERNITY_LEAVE",
  PERSONAL_LEAVE: "PERSONAL_LEAVE",
  EMERGENCY_LEAVE: "EMERGENCY_LEAVE",
  BEREAVEMENT_LEAVE: "BEREAVEMENT_LEAVE",
  STUDY_LEAVE: "STUDY_LEAVE",
  SABBATICAL_LEAVE: "SABBATICAL_LEAVE",
  UNPAID_LEAVE: "UNPAID_LEAVE",
};

interface LeaveRecord {
  id: string;
  daysTaken: number;
  startDate: string;
  endDate: string;
  description: string;
  leaveType: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
}

interface LeaveBalance {
  totalAllowance: number;
  usedDays: number;
  remainingDays: number;
}

const LeaveRequest: React.FC = () => {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [leaveType, setLeaveType] = useState<string>("");
  const [leaveStart, setLeaveStart] = useState<string>("");
  const [leaveEnd, setLeaveEnd] = useState<string>("");
  const [description, setdescription] = useState<string>("");
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance>({
    totalAllowance: 30,
    usedDays: 0,
    remainingDays: 30,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const currentYear = new Date().getFullYear();

  // Calculate requested days
  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const requestedDays = calculateDays(leaveStart, leaveEnd);
  const wouldExceedLimit = requestedDays > leaveBalance.remainingDays;

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  // Load leave data on component mount
  useEffect(() => {
    loadLeaveData();
  }, []);

  // Auto-update end date when start date changes
  useEffect(() => {
    if (leaveStart && !leaveEnd) {
      const startDate = new Date(leaveStart);
      const nextDay = new Date(startDate);
      nextDay.setDate(startDate.getDate() + 1);
      setLeaveEnd(nextDay.toISOString().split("T")[0]);
    }
  }, [leaveStart]);

  const loadLeaveData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load leave requests and balance
      const [leaveRequestsResponse, leaveBalanceResponse] = await Promise.all([
        apiService.getLeaveRequests({ year: currentYear }),
        apiService.getLeaveBalance(currentYear),
      ]);

      if (leaveRequestsResponse) {
        setLeaveRecords(
          leaveRequestsResponse.data || leaveRequestsResponse || []
        );
      }

      if (leaveBalanceResponse) {
        setLeaveBalance({
          totalAllowance: leaveBalanceResponse.totalAllowance || 30,
          usedDays: leaveBalanceResponse.usedDays || 0,
          remainingDays: leaveBalanceResponse.remainingDays || 30,
        });
      }
    } catch (error) {
      console.error("Failed to load leave data:", error);
      setError("Failed to load leave data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation

    if (!leaveType) {
      setError("Please select a leave type.");
      return;
    }

    if (requestedDays > leaveBalance.remainingDays) {
      setError(
        `Cannot request ${requestedDays} days. You only have ${leaveBalance.remainingDays} days remaining.`
      );
      return;
    }

    if (requestedDays <= 0) {
      setError("Please select valid dates.");
      return;
    }

    if (!description.trim()) {
      setError("Please provide a description for your leave request.");
      return;
    }

    try {
      setLoading(true);

      // Create leave request payload
      const leaveRequestData = {
        leaveType: leaveType,
        startDate: leaveStart,
        endDate: leaveEnd,
        description: description.trim(),
      };

      // Submit to API
      const response = await apiService.createLeaveRequest(leaveRequestData);

      if (response.success !== false) {
        // Reset form
        setJobTitle("");
        setLeaveType("");
        setLeaveStart("");
        setLeaveEnd("");
        setdescription("");

        // Reload data to reflect changes
        await loadLeaveData();

        alert("Leave request submitted successfully!");
      } else {
        throw new Error(response.message || "Failed to submit leave request");
      }
    } catch (error) {
      console.error("Failed to submit leave request:", error);
      setError(
        error.message || "Failed to submit leave request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 bg-green-100";
      case "REJECTED":
        return "text-red-600 bg-red-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "CANCELLED":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatLeaveType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  if (loading && leaveRecords.length === 0) {
    return (
      <div className="w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Leave Management System
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
          {error}
        </div>
      )}

      {/* Annual Leave Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">
          Annual Leave Summary ({currentYear})
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white p-3 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {leaveBalance.totalAllowance}
            </div>
            <div className="text-sm text-gray-600">Total Allowance</div>
          </div>
          <div className="bg-white p-3 rounded">
            <div className="text-2xl font-bold text-orange-600">
              {leaveBalance.usedDays}
            </div>
            <div className="text-sm text-gray-600">Days Used</div>
          </div>
          <div className="bg-white p-3 rounded">
            <div
              className={`text-2xl font-bold ${
                leaveBalance.remainingDays > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {leaveBalance.remainingDays}
            </div>
            <div className="text-sm text-gray-600">Days Remaining</div>
          </div>
        </div>
      </div>
      {/* Replace the div with className="space-y-4" with this form element */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="jobTitle"
            >
              Choose job title *
            </label>
            <select
              id="jobTitle"
              className="bg-[#D0D4D8] shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            >
              <option value="">Select job title</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Assistant Lecturer">Assistant Lecturer</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Teaching Assistant">Teaching Assistant</option>
            </select>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="leaveType"
            >
              Leave Type *
            </label>
            <select
              id="leaveType"
              className="bg-[#D0D4D8] shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              <option value="">Select leave type</option>
              {Object.entries(LEAVE_TYPES).map(([key, value]) => (
                <option key={key} value={value}>
                  {formatLeaveType(value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="leaveStart"
            >
              Pick Leave start date *
            </label>
            <input
              type="date"
              id="leaveStart"
              className="bg-[#D0D4D8] shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={leaveStart}
              onChange={(e) => setLeaveStart(e.target.value)}
              min={today}
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="leaveEnd"
            >
              Pick Leave end date *
            </label>
            <input
              type="date"
              id="leaveEnd"
              className="bg-[#D0D4D8] shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={leaveEnd}
              onChange={(e) => setLeaveEnd(e.target.value)}
              min={leaveStart || today}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Requested Days:{" "}
            <span
              className={`font-bold ${
                wouldExceedLimit ? "text-red-600" : "text-green-600"
              }`}
            >
              {requestedDays}
            </span>
          </label>
          <div
            className={`p-2 rounded text-sm ${
              wouldExceedLimit
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {wouldExceedLimit
              ? `⚠️ Exceeds limit by ${
                  requestedDays - leaveBalance.remainingDays
                } days`
              : `✓ Within limit (${
                  leaveBalance.remainingDays - requestedDays
                } days left after)`}
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Leave description *
          </label>
          <textarea
            id="description"
            className="bg-[#D0D4D8] shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            placeholder="Please provide description for leave..."
            required
          />
        </div>

        <div className="flex items-center justify-center w-full">
          <button
            type="submit"
            className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading || wouldExceedLimit || leaveBalance.remainingDays <= 0
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            }`}
            disabled={
              loading || wouldExceedLimit || leaveBalance.remainingDays <= 0
            }
          >
            {loading
              ? "Submitting..."
              : leaveBalance.remainingDays <= 0
              ? "No Leave Days Available"
              : "Send Leave Request"}
          </button>
        </div>
      </form>
  
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Leave History ({currentYear})
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Leave Type</th>
                <th className="py-3 px-4 text-left">Days Taken</th>
                <th className="py-3 px-4 text-left">Leave Start</th>
                <th className="py-3 px-4 text-left">Leave End</th>
                <th className="py-3 px-4 text-left">description</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRecords.map((record, index) => (
                <tr
                  key={record.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4">{record.id}</td>
                  <td className="py-3 px-4">
                    {formatLeaveType(record.leaveType)}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    {record.daysTaken}
                  </td>
                  <td className="py-3 px-4">{formatDate(record.startDate)}</td>
                  <td className="py-3 px-4">{formatDate(record.endDate)}</td>
                  <td className="py-3 px-4">{record.description}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
              {leaveRecords.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 px-4 text-center text-gray-500"
                  >
                    No leave records found for {currentYear}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {leaveBalance.remainingDays <= 5 && leaveBalance.remainingDays > 0 && (
        <div className="mt-4 p-3 bg-orange-100 border border-orange-300 rounded">
          <p className="text-orange-800 text-sm">
            ⚠️ <strong>Warning:</strong> You only have{" "}
            {leaveBalance.remainingDays} leave days remaining for {currentYear}.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;





   {
     /* <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="jobTitle"
            >
              Choose job title *
            </label>
            <select
              id="jobTitle"
              className="bg-[#D0D4D8] shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            >
              <option value="">Select job title</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Assistant Lecturer">Assistant Lecturer</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Teaching Assistant">Teaching Assistant</option>
            </select>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="leaveType"
            >
              Leave Type *
            </label>
            <select
              id="leaveType"
              className="bg-[#D0D4D8] shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              <option value="">Select leave type</option>
              {Object.entries(LEAVE_TYPES).map(([key, value]) => (
                <option key={key} value={value}>
                  {formatLeaveType(value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="leaveStart"
            >
              Pick Leave start date *
            </label>
            <input
              type="date"
              id="leaveStart"
              className="bg-[#D0D4D8] shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={leaveStart}
              onChange={(e) => setLeaveStart(e.target.value)}
              min={today}
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="leaveEnd"
            >
              Pick Leave end date *
            </label>
            <input
              type="date"
              id="leaveEnd"
              className="bg-[#D0D4D8] shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={leaveEnd}
              onChange={(e) => setLeaveEnd(e.target.value)}
              min={leaveStart || today}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Requested Days:{" "}
            <span
              className={`font-bold ${
                wouldExceedLimit ? "text-red-600" : "text-green-600"
              }`}
            >
              {requestedDays}
            </span>
          </label>
          <div
            className={`p-2 rounded text-sm ${
              wouldExceedLimit
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {wouldExceedLimit
              ? `⚠️ Exceeds limit by ${
                  requestedDays - leaveBalance.remainingDays
                } days`
              : `✓ Within limit (${
                  leaveBalance.remainingDays - requestedDays
                } days left after)`}
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Leave description *
          </label>
          <textarea
            id="description"
            className="bg-[#D0D4D8] shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            placeholder="Please provide description for leave..."
            required
          />
        </div>

        <div className="flex items-center justify-center w-full">
          <button
            type="submit"
            className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading || wouldExceedLimit || leaveBalance.remainingDays <= 0
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            }`}
            disabled={
              loading || wouldExceedLimit || leaveBalance.remainingDays <= 0
            }
          >
            {loading
              ? "Submitting..."
              : leaveBalance.remainingDays <= 0
              ? "No Leave Days Available"
              : "Send Leave Request"}
          </button>
        </div>
      </div> */
   }