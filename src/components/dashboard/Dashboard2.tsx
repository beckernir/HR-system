"use client";

import { useState } from "react";
import Header from "@/components/dashboard/Header";
import StatCards from "@/components/dashboard/StatCards2";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import EducationChart from "@/components/dashboard/EducationChart2";
import PerformanceTable from "@/components/dashboard/PerformanceTable";
import AttendanceTable from "@/components/dashboard/AttendanceTable";
import { YearSelector } from "@/components/dashboard/YearSelector";

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-medium">Dashboard</h1>
            <YearSelector 
              selectedYear={selectedYear} 
              onChange={setSelectedYear} 
            />
          </div>
          
          <button className="bg-[#09498A] text-white p-2 px-4 rounded-[.5rem]">
            Refresh
          </button>
        </div>
        
        <StatCards />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <AttendanceChart selectedYear={selectedYear} />
                  <EducationChart selectedYear={selectedYear} />
                </div>
                
      </main>
    </div>
  );
}