"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const TITLE =
  "The Future of Employability: Mitigating Job Displacement Risks in the Age of AI";
const THEME = "AI Workforce Unplugged: Skills, Shifts, Survival & Employability";
const DATE = "13 March 2026";
const TIME = "3:30 PM – 4:30 PM";

const speakers = [
  {
    id: 1,
    name: "Mohammed Y Safirulla",
    role: "Director, IndiaAI Mission",
    company: "Ministry of Electronics and Information Technology, Government of India",
    works: null,
    avatar: "/img/speakers/MohammedYSafirulla.jpeg",
  },
  {
    id: 2,
    name: "Arun Kumar",
    role: "Co-founder & Director",
    company: "Shamla Tech Solutions",
    works: "Pioneering Web3 Evolution in Blockchain, AI and Metaverse.",
    avatar: "/img/speakers/ArunKumar.jpeg",
  },
  {
    id: 3,
    name: "TBA",
    role: "To Be Announced",
    company: "To Be Announced",
    works: null,
    avatar: null,
  },
];

function AvatarPlaceholder({ name }) {
  const initials = name
  const uid = name.replace(/\s/g, "");
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 400"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Avatar placeholder for ${name}`}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0f" />
          <stop offset="100%" stopColor="#03060f" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill={`url(#bg-${uid})`} />
      {/* Subtle grid */}
      <pattern id={`g-${uid}`} width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M24 0H0V24" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
      </pattern>
      <rect width="300" height="400" fill={`url(#g-${uid})`} />
      {/* Silhouette shapes */}
      <circle cx="150" cy="138" r="62" fill="rgba(255,255,255,0.04)" />
      <ellipse cx="150" cy="330" rx="105" ry="75" fill="rgba(255,255,255,0.03)" />
      {/* Top blue accent */}
      <rect x="0" y="0" width="300" height="2" fill="#2563EB" opacity="0.7" />
      {/* Initials */}
      <text
        x="150"
        y="148"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="sans-serif"
        fontSize="58"
        fontWeight="200"
        fill="rgba(255,255,255,0.4)"
        letterSpacing="4"
      >
        {initials}
      </text>
    </svg>
  );
}

/* ── Single speaker card ── */
function SpeakerCard({ speaker, index, isInView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.25 + index * 0.12 }}
      className="flex flex-col"
    >
      {/* Panelist label — above image, outside frame */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="h-px w-4 bg-black flex-shrink-0" />
        <span className="font-general text-[9px] uppercase tracking-[0.28em] text-blue-400">
          Panelist 0{index + 1}
        </span>
      </div>

      {/* Photo / placeholder */}
      <div
        className="relative mx-auto w-[82%] sm:w-full lg:w-[88%] overflow-hidden border border-black/15 hover:border-black/40 transition-colors duration-300"
        style={{ aspectRatio: "3/4" }}
      >
        {speaker.avatar ? (
          <img
            src={speaker.avatar}
            alt={speaker.name}
            className="size-full object-cover object-top"
          />
        ) : (
          <AvatarPlaceholder name={speaker.name} />
        )}
        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent" />
        {/* blue bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />
      </div>

      {/* Info */}
      <div className="pt-4 space-y-1">
        <h3 className="special-font text-lg tracking-wider text-blue-400 md:text-2xl text-black leading-tight tracking-tight">
          <b>{speaker.name}</b>
        </h3>
        <p className="font-general text-[10px] text-black uppercase tracking-widest">
          {speaker.role}
        </p>
        <p className="font-general text-[10px] text-black uppercase tracking-wider leading-relaxed">
          {speaker.company}
        </p>
        {speaker.works && (
          <p className="font-general text-[10px] text-black italic pt-1 leading-relaxed">
            {speaker.works}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main section ── */
const PanelDiscussion = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      id="panel-discussion"
      className="relative w-full bg-white border-t border-black/10"
    >
      {/* Animated top-edge blue line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-px bg-blue-600/60 origin-left"
      />

      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 py-16 md:py-24 space-y-14 md:space-y-20">

        {/* ── HEADER ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="h-px w-8 bg-black flex-shrink-0" />
            <span className="font-general text-[10px] uppercase tracking-[0.3em] text-black">
              Keynote Event
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "105%" }}
              animate={isInView ? { y: "0%" } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="special-font text-5xl md:text-6xl lg:text-7xl font-thin leading-none text-black uppercase"
            >
              <b>Panel Discussion</b>
            </motion.h2>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            className="mt-6 h-px bg-black/10 origin-left"
          />
        </div>

        {/* ── SPEAKERS ROW — 3 cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10"
        >
          {speakers.map((speaker, i) => (
            <SpeakerCard key={speaker.id} speaker={speaker} index={i} isInView={isInView} />
          ))}
        </motion.div>

        {/* ── INFO PANEL ── */}
        <div className="border-t border-black/10 pt-12 md:pt-14">

          {/* Title + Theme + Date */}
          <div className="flex flex-col gap-7">

            {/* Title + Theme */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"
            >
              <div className="space-y-2">
                <span className="font-general text-[12px] font-bold uppercase tracking-[0.2em] text-blue-400">
                  Title
                </span>
                <p className="font-circular-web text-sm md:text-base text-black leading-snug font-light">
                  {TITLE}
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-general text-[12px] font-bold uppercase tracking-[0.2em] text-blue-400">
                  Theme
                </span>
                <p className="font-general text-xs md:text-sm text-black leading-relaxed">
                  {THEME}
                </p>
              </div>
            </motion.div>

            <div className="h-px bg-black/10" />

            {/* Date & Time */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.48 }}
              className="flex flex-wrap gap-2"
            >
              {[DATE, TIME].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center border border-black/20 px-3 py-1.5 font-general text-[10px] uppercase tracking-widest text-black"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.54 }}
              className="flex items-center gap-5 pt-1"
            >
              <motion.a
                href="/portal/event/EVNT35"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="relative inline-flex items-center gap-2.5 overflow-hidden bg-blue-600 px-7 py-3 font-general text-xs font-semibold uppercase tracking-widest text-white hover:bg-blue-500 transition-colors duration-200"
              >
                <motion.span
                  className="pointer-events-none absolute inset-0 -skew-x-12 bg-white/10"
                  initial={{ x: "-110%" }}
                  animate={{ x: "210%" }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
                />
                <span className="relative z-10">Register Now</span>
                <motion.span
                  className="relative z-10 flex items-center leading-none text-sm"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.a>
              <span className="font-general text-[10px] uppercase tracking-widest text-black">
                Open to all
              </span>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom edge line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10" />
    </section>
  );
};

export default PanelDiscussion;
