'use client'

import { useState } from 'react';
import { formatTime } from '@/lib/utils';
import AnalogClock from './analogClock';
import DigitalClock from './DigitalClock';
import WeeklyAttendance from './WeeklyAttandance';

export default function AttendanceTracker() {
  const [attendance, setAttendance] = useState<Record<string, string>>({
    'Yesterday': '08:32:07',
    'Wednesday': '08:05:22',
    'Tuesday': '09:02:11',
    'Monday': '08:24:47',
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every second
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  });
  
  const handleMarkAttendance = () => {
    const now = new Date();
    const timeString = formatTime(now);
    
    setAttendance({
      ...attendance,
      'Today': timeString,
    });
  };
  
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg p-8 w-full gap-8 mt-4">
      <div className="flex items-center justify-center md:w-1/3">
        <AnalogClock />
      </div>
      
      <div className="flex flex-col items-center md:items-start md:w-2/3 space-y-6">
        <DigitalClock currentTime={currentTime} />
        
        <button 
          onClick={handleMarkAttendance}
          className="bg-[#4257b2] text-white font-medium py-3 px-6 rounded-full w-full max-w-xs
                    transition-transform hover:scale-105 active:scale-95 focus:outline-none"
        >
          Mark Attendance
        </button>
        
        <WeeklyAttendance attendance={attendance} />
      </div>
    </div>
  );
}