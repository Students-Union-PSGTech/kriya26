"use client";
import React, { useState } from "react";
import { BentoTilt } from "../Features";
import { TiCalendar, TiTime, TiLocation, TiArrowRight, TiDownload } from "react-icons/ti";
import Link from "next/link";
import { eventService } from "@/services/eventservice";

const EventTicket = ({ event }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadCertificate = async (e) => {
        e.preventDefault(); // Prevent accidental navigation if nested in a Link occasionally
        try {
            setIsDownloading(true);
            let blob;
            if (event.itemType === 'paper') {
                blob = await eventService.downloadPaperCertificate(event.id);
            } else if (event.itemType === 'event') {
                blob = await eventService.downloadCertificate(event.id);
            } else {
                return;
            }

            // Create a temporary link to trigger the download
            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Certificate.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading certificate:", error);
            alert("Failed to download certificate. Please try again later.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <BentoTilt className="relative w-full shrink-0 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden mt-2">
            {/* Left Color Bar */}
            <div className={`absolute left-0 top-0 w-2 h-full ${event.color || "bg-blue-500"}`}></div>

            <div className="pl-5 pr-4 py-4 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-zentry text-xl md:text-2xl uppercase text-white leading-none mb-1">{event.title}</h3>
                        <span className="font-general text-[10px] uppercase tracking-wider text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                            {event.category || "Technical"}
                        </span>
                    </div>
                </div>

                {/* Details - Always Visible */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-gray-500 text-[10px] mb-0.5">
                            <TiCalendar /> <span className="uppercase font-general tracking-wide">Date</span>
                        </div>
                        <p className="text-white font-circular-web text-xs">{event.date}</p>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-gray-500 text-[10px] mb-0.5">
                            <TiLocation /> <span className="uppercase font-general tracking-wide">Venue</span>
                        </div>
                        <p className="text-white font-circular-web text-xs truncate">{event.venue}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-1">
                    <Link
                        href={event.link || `/events/${event.id}`}
                        className="inline-flex items-center gap-1 w-fit px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-general text-xs uppercase tracking-wider transition-colors"
                    >
                        Go <TiArrowRight className="text-sm" />
                    </Link>

                    {/* Download Certificate Button */}
                    {(event.itemType === 'event' || event.itemType === 'paper') && (
                        <button
                            onClick={handleDownloadCertificate}
                            disabled={isDownloading}
                            className={`inline-flex items-center justify-center gap-1 w-fit px-3 py-1.5 rounded-lg font-general text-xs uppercase tracking-wider transition-colors ${
                                isDownloading 
                                ? "bg-gray-500/20 border border-gray-500/30 text-gray-400 cursor-not-allowed"
                                : "bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400"
                            }`}
                        >
                            {isDownloading ? (
                                <span className="flex items-center gap-1">
                                    <svg className="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Downloading...
                                </span>
                            ) : (
                                <>Certificate <TiDownload className="text-sm" /></>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </BentoTilt>
    );
};

export default EventTicket;


