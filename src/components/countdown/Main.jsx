'use client';

import React, { useEffect, useState } from 'react';

const Home = () => {
  const [isClient, setIsClient] = useState(false);

  const eventDetails = {
    title: 'Kriya 2025 - Technical Symposium',
    startTime: '2025-03-14T09:00:00',
    endTime: '2025-03-16T17:00:00',
    location: 'PSG College of Technology, Coimbatore',
    description: 'Join us at the forefront of technological advancements and gain valuable insights at our upcoming technical symposium Kriya 2025.',
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddToCalendar = () => {
    if (typeof window !== 'undefined') {
      const eventUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        eventDetails.title
      )}&dates=${eventDetails.startTime.replace(/[-:]/g, '')}/${eventDetails.endTime.replace(
        /[-:]/g,
        ''
      )}&location=${encodeURIComponent(eventDetails.location)}&details=${encodeURIComponent(eventDetails.description)}`;

      window.open(eventUrl, '_blank');
    }
  };

  if (!isClient) return null;

  return (
    <div className='flex items-center '>
      <div className="flex flex-col items-center lg:items-start md:py-14 px-14">
        <div>
        <h1 className="flex flex-col justify-center mb-1 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
          Mark Your <span className="text-pink-600 bg-clip-text">Calendar !</span>
        </h1>
        </div>
       

        <p className="my-5 text-white md:text-lg lg:text-xl text-center lg:text-left">{eventDetails.description}</p>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleAddToCalendar}
            className="px-8 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out transform bg-pink-600 rounded-full shadow-lg lg:text-lg hover:scale-105 hover:shadow-xl lg:mt-1"
          >
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;