"use client";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CountDown from "@/components/Countdown";
import Preloader from "@/components/ui/Preloader";

import LazyLoad from "@/components/ui/LazyLoad";

const loadStatsSection = () => import("@/components/StatsSection");
const loadPrizePool = () => import("@/components/About");
const loadFlagship = () => import("@/components/Story");
const loadPanelDiscussion = () => import("@/components/PanelDiscussion")
const loadEvents = () => import("@/components/Features");
const loadWorkshops = () => import("@/components/Workshop");
const loadPaperPresentation = () => import("@/components/PaperPresentation");
const loadSponsors = () => import("@/components/Sponsors");
const loadTeam = () => import("@/components/Team");
const loadFaq = () => import("@/components/Faq");
const loadLocation = () => import("@/components/Location");
const loadContact = () => import("@/components/Contact");

// Load top sections normally (some dynamic some static depending on usage)
const StatsSection = dynamic(loadStatsSection);
const PrizePool = dynamic(loadPrizePool);
const Flagship = dynamic(loadFlagship);
const PanelDiscussion = dynamic(loadPanelDiscussion);
// Defer heavier, off-screen components
const Events = dynamic(loadEvents);
const Workshops = dynamic(loadWorkshops);
const PaperPresentation = dynamic(loadPaperPresentation);
const Sponsors = dynamic(loadSponsors);
const Team = dynamic(loadTeam);
const Faq = dynamic(loadFaq);
const Location = dynamic(loadLocation);
const Contact = dynamic(loadContact);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const preloaderComplete = !isLoading;
  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleLoad = () => {
      timeoutId = setTimeout(() => setIsFinished(true), 2000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    const preloadSections = () => {
      loadPanelDiscussion();
      loadStatsSection();
      loadPrizePool();
      loadFlagship();
      loadEvents();
      loadWorkshops();
      loadPaperPresentation();
      loadSponsors();
      loadTeam();
      loadFaq();
      loadLocation();
      loadContact();
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(preloadSections);
      return () => {
        if (idleWindow.cancelIdleCallback) {
          idleWindow.cancelIdleCallback(idleId);
        }
      };
    }

    const fallbackTimeoutId = window.setTimeout(preloadSections, 1200);
    return () => window.clearTimeout(fallbackTimeoutId);
  }, []);

  return (
    <main className="relative min-h-screen w-full">
      {isLoading && (
        <Preloader
          finished={isFinished}
          onComplete={handlePreloaderComplete}
        />
      )}
      <Navbar />
      <Hero preloaderComplete={preloaderComplete} />

      <LazyLoad height="min-h-[50vh]">
        <StatsSection />
      </LazyLoad>

      <LazyLoad height="min-h-[100vh]">
        <PanelDiscussion />
      </LazyLoad>

      <CountDown />

      <LazyLoad height="min-h-[100vh]">
        <PrizePool preloaderComplete={preloaderComplete} />
      </LazyLoad>

      <LazyLoad height="min-h-[100vh]">
        <Flagship />
      </LazyLoad>

      <LazyLoad height="min-h-[100vh]">
        <Events />
      </LazyLoad>

      <LazyLoad height="min-h-[100vh]">
        <Workshops />
      </LazyLoad>

      <LazyLoad height="min-h-[100vh]">
        <PaperPresentation />
      </LazyLoad>

      <LazyLoad height="min-h-[50vh]">
        <Sponsors />
      </LazyLoad>

      <LazyLoad height="min-h-[100vh]">
        <Team />
      </LazyLoad>

      <LazyLoad height="min-h-[100vh]">
        <Faq />
      </LazyLoad>

      <LazyLoad height="min-h-[50vh]">
        <Location />
      </LazyLoad>

      <div id="contact">
        <LazyLoad height="min-h-[50vh]">
          <Contact />
        </LazyLoad>
      </div>
    </main>
  );
}
