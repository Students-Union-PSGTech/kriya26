'use client';

import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [isClient, setIsClient] = useState(false);

  const calculateTimeLeft = () => {
    const targetDate = new Date('2025-03-14T00:00:00');
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== 'undefined') {
      return calculateTimeLeft();
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  });

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex items-center justify-center w-full text-white md:pr-10">
      <div className="w-full px-4">
        <div className="grid grid-cols-2 text-center gap-y-2 md:gap-6 lg:gap-8">
          {/* Days */}
          <div>
            <div className="text-6xl md:text-8xl xl:text-[200px] font-bold text-gray-500 leading-none">
              {timeLeft.days}
            </div>
            <div className="ml-8 text-base font-medium md:text-lg lg:text-xl lg:ml-36 md:ml-24 sm:ml-16">
              DAYS
            </div>
          </div>

          {/* Hours */}
          <div>
            <div className="text-6xl  md:text-8xl xl:text-[200px] font-bold text-gray-500 leading-none">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="ml-8 text-base font-medium md:text-lg lg:text-xl lg:ml-36 md:ml-24 sm:ml-16">
              HOURS
            </div>
          </div>

          {/* Minutes */}
          <div>
            <div className="text-6xl sm:text-8xl xl:text-[200px] font-bold text-gray-500 leading-none">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="ml-8 text-base font-medium md:text-lg lg:text-xl lg:ml-36 md:ml-24 sm:ml-16">
              MINUTES
            </div>
          </div>

          {/* Seconds */}
          <div>
            <div className="text-6xl md:text-8xl xl:text-[200px] font-bold text-gray-500 leading-none">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="ml-8 text-base font-medium md:text-lg lg:text-xl lg:ml-36 md:ml-24 sm:ml-16">
              SECONDS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;