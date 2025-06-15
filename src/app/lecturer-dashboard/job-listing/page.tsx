"use client"
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Clock, CalendarDays, MapPin, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const jobList = [
  {
    title: "Senior Project Analyst",
    department: "Management",
    experience: "3 years Min",
    location: "Kigali",
    expiry: "April 30, 2025",
    image: "/logo-auca.svg"
  },
  {
    title: "Archive Data Entry",
    department: "IT",
    experience: "1 years Min",
    location: "Kigali",
    expiry: "April 30, 2025",
    image: "/logo-auca.svg"
  },
  {
    title: "Campus Health Director",
    department: "Social Life",
    experience: "3 years Min",
    location: "Kigali",
    expiry: "April 30, 2025",
    image: "/logo-auca.svg"
  }
];

export default function FindJobs() {
  const route = useRouter();
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-center text-[#09498A] text-2xl font-semibold mb-6">Find Jobs</h1>

      <div className="bg-[#D9D9D9] flex justify-between items-center flex-col md:flex-row gap-4 py-2 mb-6 rounded-full relative">
        <img src="/iconoir_search.svg" className="absolute left-2 mt-1 w-[2rem]" width={0} height={0} alt="search" />
        <Input
          placeholder="Search Keywords"
          className="border-none outline-none ring-0 focus:ring-0 focus:outline-none pl-[3rem] flex-1"
        />

        <div className="bg-gray-400 w-[.1rem] h-6"></div>
        <Select>
          <SelectTrigger className="border-none w-full md:w-48">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="it">IT</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
          </SelectContent>
        </Select>
        <div className="bg-gray-400 w-[.1rem] h-6"></div>
        <Select>
          <SelectTrigger className="border-none w-full md:w-48">
            <SelectValue placeholder="Sort by: Latest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="bg-gray-100 p-4 rounded-xl w-full md:w-64">
          <h2 className="text-[#09498A] text-lg font-semibold mb-2">Filter Jobs</h2>
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Type of Employment</p>
            <ul className="space-y-1 text-sm">
              <li>Job <span className="float-right text-white bg-[#114B87] px-2 rounded">3</span></li>
              <li>Internship <span className="float-right text-white bg-[#114B87] px-2 rounded">0</span></li>
              <li>Apprenticeship <span className="float-right text-white bg-[#114B87] px-2 rounded">0</span></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Type of Contract</p>
            <ul className="space-y-1 text-sm">
              <li>Contractual <span className="float-right text-white bg-[#114B87] px-2 rounded">0</span></li>
              <li>Full time <span className="float-right text-white bg-[#114B87] px-2 rounded">1</span></li>
              <li>Part time <span className="float-right text-white bg-[#114B87] px-2 rounded">0</span></li>
              <li>Temporary <span className="float-right text-white bg-[#114B87] px-2 rounded">2</span></li>
            </ul>
          </div>
        </div>

        {/* Job List */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Jobs List ({jobList.length})</h2>
          <div className="space-y-4">
            {jobList.map((job, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center gap-4">
                <Image
                  src={job.image}
                  alt={job.title}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                  <div className="mr-auto">
                    <h3 className="font-semibold text-md">{job.title}</h3>
                    <p className="text-sm text-gray-500">Department: {job.department}</p>
                    <p className="text-sm text-gray-500">2 days age</p>
                  </div>
                  <div className="mr-auto text-sm mt-1 space-y-1">
                    <p className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> Experience: {job.experience}</p>
                    <p className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Location: {job.location}</p>
                    <p className="flex items-center gap-1 text-green-600 font-medium">
                      <CalendarDays className="w-4 h-4" /> Expiry Date: {job.expiry}
                    </p>
                  </div>
                <img className="border border-[#E83131] rounded-full w-8 h-8 p-2 mt-1" width={0} height={0} src="/Vector.svg" alt="pdf" />
                <Button className="bg-black text-white hover:bg-gray-800 flex gap-1 rounded-full" onClick={()=>{route.push("/lecturer-dashboard/application")}}>
                  <ArrowUpRight className="w-4 h-4" /> Apply Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
