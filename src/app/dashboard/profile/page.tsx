// // app/page.tsx
// "use client";
// import ProfilePage from "@/components/ProfilePage";

// export default function Home() {
//   return (
//     <main>
//       <ProfilePage
//         name="Victor Obiadon"
//         age={27}
//         gender="Male"
//         jobTitle="IT Technical Support Engineer"
//         jobType="Full time worker"
//         location="Guddu, Kigali"
//         nationality="Nigeria"
//         contactPhone="+250788612344"
//         contactEmail="VictorVictor@gmail.com"
//         visaStatus="valid"
//         visaMonths={7}
//         yearsToRetire={38}
//         rating={4}
//         profileImage="https://i.pravatar.cc/150?img=12"
//       />
//     </main>
//   );
// }

// "use client";
// import ProfilePageContainer from "@/components/ProfilePage";
// import apiService from "@/lib/apiService";

// export default function Home() {
//   return (
//     <main>
//       {/* This will fetch and display the current user's profile */}
//       <ProfilePageContainer apiService={apiService} />
//     </main>
//   );
// }

// File: app/dashboard/profile/[userId]/page.tsx
"use client";

import ProfilePageContainer from "@/components/ProfilePage";
import apiService from "@/lib/apiService";
import { use } from "react";

interface ProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default function Home({ params }: ProfilePageProps) {
  // Unwrap the params Promise
  const resolvedParams = use(params);
  
  return (
    <main>
      {/* This will fetch and display the SPECIFIC user's profile */}
      <ProfilePageContainer 
        userId={resolvedParams.userId} 
        apiService={apiService} 
      />
    </main>
  );
}