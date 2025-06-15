"use client";

import ProfilePageContainer from "@/components/ProfilePage";
import apiService from "@/lib/apiService";
import { useRouter } from "next/navigation";

export default function CurrentUserProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optional: Breadcrumb navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-3 text-sm text-gray-500">
            <button
              onClick={() => router.push("/lecturer-dashboard")}
              className="hover:text-gray-700 transition-colors"
            >
              Dashboard
            </button>
            <span>/</span>
            <span className="text-gray-900">My Profile</span>
          </div>
        </div>
      </div>

      {/* Profile Content - No userId passed, so it will fetch current user */}
      <ProfilePageContainer userId={null} apiService={apiService} />
    </div>
  );
}
