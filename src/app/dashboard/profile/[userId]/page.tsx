// File: app/dashboard/profile/[userId]/page.tsx
"use client";

import ProfilePageContainer from "@/components/ProfilePage";
import apiService from "@/lib/apiService";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

interface ProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default function UserProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap the params Promise
  const resolvedParams = use(params);

  // Validate userId parameter
  useEffect(() => {
    const validateUserId = async () => {
      try {
        // Check if userId is valid (not empty, not undefined)
        if (!resolvedParams.userId || resolvedParams.userId.trim() === "") {
          throw new Error("Invalid user ID");
        }

        // Optional: Add more validation logic here
        // For example, check if userId format is correct (UUID, number, etc.)

        setIsValidating(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid user ID");
        setIsValidating(false);
      }
    };

    validateUserId();
  }, [resolvedParams.userId]);

  // Loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Invalid Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
          >
            Go Back
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render the profile page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optional: Breadcrumb navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-3 text-sm text-gray-500">
            <button
              onClick={() => router.push("/dashboard")}
              className="hover:text-gray-700 transition-colors"
            >
              Dashboard
            </button>
            <span>/</span>
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="hover:text-gray-700 transition-colors"
            >
              Profiles
            </button>
            <span>/</span>
            <span className="text-gray-900">User Profile</span>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <ProfilePageContainer userId={resolvedParams.userId} apiService={apiService} />
    </div>
  );
}
