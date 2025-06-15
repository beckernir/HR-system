'use client'
import { useEffect, useState } from 'react';

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const timer = setInterval(() => {
      if (isMounted) {
        setTime(new Date());
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  if (!hasMounted) return null;
  
  // Calculate rotation angles for hands
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;
  
  const secondsDegrees = (seconds / 60) * 360;
  const minutesDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hoursDegrees = ((hours + minutes / 60) / 12) * 360;
  
  return (
    <div className="relative w-[200px] h-[200px] rounded-full border-4 border-black">
      <div className="absolute inset-0 bg-white rounded-full flex justify-center items-center">
        {/* Clock numbers */}
        {[...Array(12)].map((_, i) => {
          const angle = ((i + 1) / 12) * 2 * Math.PI;
          const x = 80 * Math.sin(angle);
          const y = -80 * Math.cos(angle);
          
          return (
            <div 
              key={i} 
              className="absolute font-semibold text-lg"
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
            >
              {i + 1}
            </div>
          );
        })}
        
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * 2 * Math.PI;
          const x = 90 * Math.sin(angle);
          const y = -90 * Math.cos(angle);
          
          return (
            <div 
              key={i} 
              className="absolute w-1 h-3 bg-black"
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${angle + Math.PI/2}rad)`
              }}
            />
          );
        })}
        
        {/* Center point */}
        <div className="absolute w-3 h-3 bg-red-500 rounded-full z-10" />
        
        {/* Hour hand */}
        <div 
          className="absolute h-[50px] w-1.5 bg-black rounded-full origin-bottom transition-transform duration-500"
          style={{ transform: `translateY(-25px) rotate(${hoursDegrees}deg)` }}
        />
        
        {/* Minute hand */}
        <div 
          className="absolute h-[70px] w-1 bg-black rounded-full origin-bottom transition-transform duration-500"
          style={{ transform: `translateY(-35px) rotate(${minutesDegrees}deg)` }}
        />
        
        {/* Second hand */}
        <div 
          className="absolute h-[80px] w-0.5 bg-red-500 rounded-full origin-bottom transition-transform duration-100"
          style={{ transform: `translateY(-40px) rotate(${secondsDegrees}deg)` }}
        />
      </div>
    </div>
  );
}