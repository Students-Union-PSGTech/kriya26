"use client";

import React from "react";
import { motion } from "framer-motion";

const DateSlider = () => {
  const dates = [
    { date: 11, day: "TUE" },
    { date: 12, day: "WED" },
    { date: 13, day: "THU" },
    { date: 14, day: "FRI" },
    { date: 15, day: "SAT" },
    { date: 16, day: "SUN" },
    { date: 17, day: "MON" },
    { date: 18, day: "TUE" },
    { date: 19, day: "WED" },
  ];

  const highlightedDates = dates.filter((item) =>
    [14, 15, 16].includes(item.date)
  );

  const dateVariant = {
    hidden: {
      x: "-100vw",
    },
    visible: {
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={dateVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="top-0 w-full text-white"
    >
      {/* Mobile View - Only Highlighted Dates */}
      <div className="w-full md:hidden">
        <div className={`flex items-center justify-evenly w-full`}>
          {highlightedDates.map((item) => (
            <div
              key={`${item.date}-${item.day}`}
              className="flex items-center justify-center p-1"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <span className="text-5xl font-bold text-transparent bg-pink-600 bg-clip-text">
                    {item.date}
                  </span>
                  <span className="absolute font-bold text-transparent bg-pink-600 -top-0 left-full bg-clip-text">
                    {item.day}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View - All Dates */}
      <div className="hidden w-full md:flex">
        <div className={`flex justify-evenly w-full items-center`}>
          {dates.map((item) => (
            <div
              key={`${item.date}-${item.day}`}
              className="flex items-center justify-center"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <span
                    className={`${[14, 15, 16].includes(item.date)
                      ? "text-5xl lg:text-6xl xl:text-7xl bg-pink-600 text-transparent bg-clip-text"
                      : "text-4xl lg:text-5xl xl:text-6xl text-gray-400 hover:text-white"
                      } font-bold`}
                  >
                    {item.date}
                  </span>
                  <span
                    className={`absolute -top-0 left-full ${[14, 15, 16].includes(item.date)
                      ? "text-xl bg-pink-600 text-transparent bg-clip-text"
                      : "text-sm text-gray-400 hover:text-white"
                      } font-bold`}
                  >
                    {item.day}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DateSlider;
