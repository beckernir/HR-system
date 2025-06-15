'use client'

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeeklyAttendanceProps {
  attendance: Record<string, string>;
}

export default function WeeklyAttendance({ attendance }: WeeklyAttendanceProps) {
  const [month, setMonth] = useState('March');
  const [week, setWeek] = useState('Week 1');
  const [year, setYear] = useState('2024');
  
  // Get days of the week
  const days = ['Today', 'Yesterday', 'Wednesday', 'Tuesday', 'Monday'];
  
  return (
    <div className="w-full pt-4">
      <h2 className="text-center font-medium text-[#4257b2] mb-3">Weekly Attendance</h2>
      
      {/* Filter controls */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="relative bg-gray-200 rounded-md px-3 py-1.5 text-sm flex items-center gap-1">
          <span className="text-gray-600">{month}</span>
          <button className="text-gray-500">⇓</button>
        </div>
        
        <div className="relative bg-gray-200 rounded-md px-3 py-1.5 text-sm flex items-center gap-1">
          <span className="text-gray-600">{week}</span>
          <button className="text-gray-500">⇓</button>
        </div>
        
        <div className="relative bg-gray-200 rounded-md px-3 py-1.5 text-sm flex items-center gap-1">
          <span className="text-gray-600">{year}</span>
          <button className="text-gray-500">⇓</button>
        </div>
      </div>
      
      {/* Week navigation and attendance records */}
      <div className="relative">
        <div className="space-y-2">
          {days.map((day, index) => (
            <div key={day} className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">{day} :</span>
              <span className="text-gray-800 font-medium tabular-nums">
                {attendance[day] || '-'}
              </span>
            </div>
          ))}
        </div>
        
        {/* Week navigation arrows */}
        <button className="absolute top-1/2 -left-6 transform -translate-y-1/2 text-gray-600 hover:text-gray-900">
          <ChevronLeft size={18} />
        </button>
        <button className="absolute top-1/2 -right-6 transform -translate-y-1/2 text-gray-600 hover:text-gray-900">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}