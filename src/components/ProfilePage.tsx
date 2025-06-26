// ProfilePageContainer.tsx
import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaSpinner,
} from "react-icons/fa";
import apiService from "@/lib/apiService";
import { useRouter } from "next/navigation";

// Types
interface UserProfile {
  id?: string;
  fullNames: string;
  age: number;
  gender: string;
  jobTitle: string;
  jobType: string;
  location: string;
  nationality: string;
  phoneNumber: string;
  contactEmail: string;
  visaStatus: string;
  visaMonths: number;
  yearsToRetire: number;
  rating: number;
  profileImage: File;
  maritalStatus?: string;
  workExperience?: Array<{
    company: string;
    position: string;
    year: string;
    experience: string;
    logo: string;
  }>;
  education?: Array<{
    institution: string;
    department: string;
    program: string;
    period: string;
    logo: string;
  }>;
}

interface ProfilePageProps {
  userId?: string | null;
  apiService: {
    getCurrentUser: () => Promise<any>;
    getUserProfile: (userId: string) => Promise<any>;
  };
  userData?: any; // Add this to accept pre-fetched data
}

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
      <p className="text-gray-600">Loading profile...</p>
    </div>
  </div>
);

// Error Component
const ErrorMessage = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center max-w-md">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Error Loading Profile
      </h2>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Profile Page Component
const ProfilePage: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const {
    fullNames,
    age,
    gender,
    jobTitle,
    jobType,
    location,
    nationality,
    phoneNumber,
    contactEmail,
    visaMonths,
    yearsToRetire,
    rating,
    profileImage,
    maritalStatus = "Single",
    workExperience = [],
    education = [],
  } = profile;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-blue-800">Profile</h1>
      </div>

      {/* Banner */}
      <div className="w-full h-[10rem] bg-gradient-to-r from-blue-900 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('/hex-pattern.png')] bg-repeat"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative -mt-16">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Profile image and sidebar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              <img
                src={profileImage || "/default-avatar.png"}
                alt={fullNames}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contact info section */}
            <div className="mt-8 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Contacts</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FaPhone className="mr-2 text-gray-400" />
                  <span>{phoneNumber}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2 text-gray-400" />
                  <span>{contactEmail}</span>
                </div>
              </div>
            </div>

            {/* Marital Status */}
            <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Marital Status</h3>
              <div className="flex items-center text-gray-600">
                <span>{maritalStatus}</span>
              </div>
            </div>

            {/* Performance section */}
            <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Performance</h3>
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-800">
                  {rating}
                  <span className="text-lg font-normal opacity-80">/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile details */}
          <div className="flex-1 pt-4 md:pt-0 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mt-[6rem]">
                <h2 className="text-2xl font-bold flex items-center">
                  {fullNames}{" "}
                  <span className="text-gray-500 text-base font-normal ml-2">
                    ({age} Years)
                  </span>
                </h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <span className="mr-2">Gender:</span>
                  <span className="font-medium">{gender}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center flex-wrap gap-2">
                <h3 className="font-medium text-lg">{jobTitle}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {jobType}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center text-gray-600 text-sm">
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {location}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="mr-1">|</span>
                  <span>Nationality: {nationality}</span>
                </div>
              </div>

              {/* Social links */}
              <div className="flex gap-2 mt-4">
                <a
                  href="#"
                  className="p-2 bg-gray-100 text-blue-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <FaLinkedin size={16} />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-100 text-blue-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <FaInstagram size={16} />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-100 text-blue-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <FaTwitter size={16} />
                </a>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm">
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Working Visa is still valid ({visaMonths} months)
              </div>
              <div className="flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm">
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {yearsToRetire} years left to retire
              </div>
            </div>

            {/* Working Background */}
            {workExperience.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Working Background
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workExperience.map((work, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow-sm flex items-start space-x-4"
                    >
                      <img
                        src={work.logo || "/default-company-logo.png"}
                        alt={`${work.company} Logo`}
                        className="w-12 h-12 object-contain"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">
                          {work.company} ({work.year})
                        </p>
                        <p className="text-sm text-gray-600">
                          Position: {work.position}
                        </p>
                        <p className="text-sm text-gray-500">
                          Experience: {work.experience}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Background */}
            {education.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Education Background
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {education.map((edu, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow-sm flex items-start space-x-4"
                    >
                      <img
                        src={edu.logo || "/default-school-logo.png"}
                        alt={`${edu.institution} Logo`}
                        className="w-12 h-12 object-contain"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{edu.institution}</p>
                        <p className="text-sm text-gray-600">{edu.program}</p>
                        <p className="text-sm text-gray-500">{edu.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Container Component
const ProfilePageContainer: React.FC<ProfilePageProps> = ({
  userId,
  apiService,
  userData: preloadedUserData, // Accept pre-fetched data
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(!preloadedUserData);
  const [error, setError] = useState<string | null>(null);

  // Function to map API response to ProfileProps format
  const mapApiResponseToProfile = (apiResponse: any): UserProfile => {
    // FIXED: Handle nested response structure
    console.log("=== MAPPING API RESPONSE ===");
    console.log("Raw API Response:", apiResponse);
    
    // Extract the actual user data from the response
    // Handle different response structures: response.data, response.user, or direct response
    const apiData = apiResponse?.data || apiResponse?.user || apiResponse;
    
    console.log("Extracted API Data:", apiData);
    console.log("API Data Keys:", Object.keys(apiData || {}));
    
    if (!apiData) {
      throw new Error("No user data found in API response");
    }

    const mappedProfile = {
      id: apiData.id || apiData.userId || userId,
      fullNames:
        apiData.fullNames ||
        apiData.fullNames ||
        `${apiData.fullNames || ""} ${apiData.fullNames || ""}`.trim() ||
        "Unknown User",
      age: apiData.age || calculateAge(apiData.dateOfBirth) || 25,
      gender: apiData.gender || "Not specified",
      jobTitle: apiData.jobTitle || apiData.position || "Not specified",
      jobType: apiData.jobType || apiData.employmentType || "Full-time",
      location: apiData.location || apiData.address || "Not specified",
      nationality: apiData.nationality || "Not specified",
      phoneNumber: apiData.phone || apiData.phoneNumber || "Not provided",
      contactEmail: apiData.email || apiData.contactEmail || "Not provided",
      visaStatus: apiData.visaStatus || apiData.workingVisaStatus || "Valid",
      visaMonths: apiData.visaMonths || apiData.visaValidityMonths || 12,
      yearsToRetire:
        apiData.yearsToRetire ||
        calculateYearsToRetire(apiData.dateOfBirth) ||
        30,
      rating: apiData.rating || apiData.performanceRating || 4,
      profileImage:
        apiData.profileImage || apiData.avatar || "/default-avatar.png",
      maritalStatus: apiData.maritalStatus || "Single",
      workExperience: apiData.workExperience || [],
      education: apiData.education || [],
    };

    console.log("Mapped Profile:", mappedProfile);
    console.log("=============================");
    
    return mappedProfile;
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 25;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Helper function to calculate years to retirement
  const calculateYearsToRetire = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 30;
    const retirementAge = 65;
    const currentAge = calculateAge(dateOfBirth);
    return Math.max(0, retirementAge - currentAge);
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      // Check if userId is provided AND not empty/null
      if (userId && userId.trim() !== "") {
        console.log("Fetching specific user profile for userId:", userId);
        response = await apiService.getUserProfile(userId);
      } else {
        console.log("Fetching current user profile");
        response = await apiService.getCurrentUser();
      }

      console.log("API Response received:", response);
      const mappedProfile = mapApiResponseToProfile(response);
      setProfile(mappedProfile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load profile";
      setError(errorMessage);
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle preloaded data or fetch profile
  useEffect(() => {
    if (preloadedUserData) {
      console.log("Using preloaded user data:", preloadedUserData);
      try {
        const mappedProfile = mapApiResponseToProfile(preloadedUserData);
        setProfile(mappedProfile);
        setLoading(false);
      } catch (err) {
        console.error("Error mapping preloaded data:", err);
        setError("Failed to process user data");
        setLoading(false);
      }
    } else {
      fetchProfile();
    }
  }, [userId, preloadedUserData]);

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render error state
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProfile} />;
  }

  // Render profile if data is available
  if (profile) {
    return <ProfilePage profile={profile} />;
  }

  // Fallback render
  return (
    <ErrorMessage message="No profile data available" onRetry={fetchProfile} />
  );
};

export default ProfilePageContainer;
