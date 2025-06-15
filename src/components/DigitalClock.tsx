'use client'

import { formatTime } from '@/lib/utils';

interface DigitalClockProps {
  currentTime: Date;
}

export default function DigitalClock({ currentTime }: DigitalClockProps) {
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  
  return (
    <div className="text-center md:text-left">
      <h1 className="text-5xl md:text-6xl font-bold text-[#4257b2]">
        <span className="inline-block w-[2ch] tabular-nums">{hours}</span>:
        <span className="inline-block w-[2ch] tabular-nums">{minutes}</span>:
        <span className="inline-block w-[2ch] tabular-nums">{seconds}</span>
      </h1>
    </div>
  );
}