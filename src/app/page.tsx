"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import apiService from "../lib/apiService"; // Import centralized API service

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUser, setSelectedUser] = useState("HR");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const toggleUserType = () => {
    setSelectedUser(selectedUser === "HR" ? "Worker" : "HR");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // Use centralized API service
      const data = await apiService.login(email, password);

      if (data.statusCode === 200) {
        const authData = data.data;

        // Store authentication data
        localStorage.setItem("jwt_token", authData.token);
        localStorage.setItem("user_email", authData.email);
        localStorage.setItem("user_role", authData.role);
        localStorage.setItem("user_name", authData.fullName);

        // Role-based routing
        const userRole = authData.role.toUpperCase();

        // if (
        //   selectedUser === "HR" &&
        //   (userRole === "HR" || userRole === "ADMIN")
        // ) {
        //   router.push("/dashboard");
        // } else if (
        //   selectedUser === "Worker" &&
        //   (userRole === "EMPLOYEE" || userRole === "LECTURER")
        // ) {
        //   router.push("/lecturer-dashboard");
        // } else {
        //   setError(
        //     `Access denied. Your role (${userRole}) doesn't match the selected user type (${selectedUser}).`
        //   );
        // }
        // Role-based routing - route based on actual role, not selection
        if (userRole === "HR" || userRole === "ADMIN") {
          router.push("/dashboard");
        } else if (userRole === "EMPLOYEE" || userRole === "LECTURER") {
          router.push("/lecturer-dashboard");
        } else {
          setError(`Unknown role: ${userRole}`);
        }
      } else {
        if (data.data && data.data.message) {
          setError(data.data.message);
        } else {
          setError(
            data.message || "Login failed. Please check your credentials."
          );
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Head>
        <title>HR Management System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Left panel - Login */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white p-6 md:p-12"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="bg-blue-100 rounded-full flex items-center justify-center">
              <Image
                src="/logo-auca.svg"
                alt="HR Logo"
                className="w-[12rem]"
                width={0}
                height={0}
              />
            </div>
          </div>
          <h2 className="text-center text-xl font-bold text-blue-800 mb-8">
            {selectedUser === "HR" ? "HR Sign in" : "Worker Sign in"}
          </h2>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
            >
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="#"
                className="font-medium text-blue-800 hover:text-blue-700"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right panel - Welcome image */}
      <motion.div
        className="w-full md:w-1/2 bg-[#09498A] flex flex-col items-center justify-center p-6 md:p-12 relative"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <img
          src={"/Ellipse.svg"}
          className="absolute top-0 right-0 w-[33rem] hidden md:block"
          width={0}
          height={0}
          alt="ellipse"
        />
        <h2 className="text-3xl text-white">Choose a User</h2>

        {/* User Selection Slider */}
        <div
          className="bg-white flex justify-center items-center p-3 gap-3 rounded-full my-4 cursor-pointer w-64"
          onClick={toggleUserType}
        >
          <motion.div
            className="text-blue-800 font-medium"
            initial={false}
            animate={{
              x: selectedUser === "HR" ? 0 : 16,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            {selectedUser === "HR" && (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: "rotate(180deg)" }}
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#09498A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <span>{selectedUser === "HR" ? "Human Resources" : "Worker"}</span>
            {selectedUser === "Worker" && (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#09498A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </motion.div>
        </div>

        <div className="relative w-full max-w-lg">
          <motion.div
            key={selectedUser}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src={
                selectedUser === "HR" ? "/Colleagues.svg" : "/Colleagues.svg"
              }
              alt={
                selectedUser === "HR"
                  ? "HR Illustration"
                  : "Worker Illustration"
              }
              width={400}
              height={300}
              className="mx-auto"
            />
          </motion.div>
        </div>

        <div className="text-white text-center mb-8">
          <h1 className="text-2xl font-bold mb-4">
            {selectedUser === "HR" ? "HR Management System" : "Worker Portal"}
          </h1>
          <p className="text-blue-200 max-w-md">
            {selectedUser === "HR"
              ? "Simplify how your organization takes care of employees, HR functions, financial records, and the complex corners of production made straightforward."
              : "Access your work schedule, submit time sheets, request leave, and connect with your team through our streamlined worker portal."}
          </p>
        </div>

        <div className="absolute bottom-8 flex space-x-2">
          <div className="h-2 w-2 rounded-full bg-white opacity-100"></div>
          <div className="h-2 w-2 rounded-full bg-white opacity-50"></div>
          <div className="h-2 w-2 rounded-full bg-white opacity-50"></div>
        </div>
      </motion.div>
    </div>
  );
}