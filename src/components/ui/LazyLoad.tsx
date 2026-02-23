import React, { useRef, useState, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
const queueScrollTriggerRefresh = () => {
    if (refreshTimer) {
        return;
    }

    refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        refreshTimer = null;
    }, 120);
};

interface LazyLoadProps {
    children: React.ReactNode;
    height?: string;
    threshold?: number;
}

const LazyLoad: React.FC<LazyLoadProps> = ({
    children,
    height = "min-h-[50vh]",
    threshold = 0.1,
}) => {
    const intersectionRef = useRef<HTMLDivElement>(null);
    const [hasRendered, setHasRendered] = useState(false);

    useEffect(() => {
        if (hasRendered) {
            return;
        }

        const node = intersectionRef.current;
        if (!node) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setHasRendered(true);
                    observer.disconnect();
                }
            },
            {
                root: null,
                rootMargin: "200px",
                threshold,
            }
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [hasRendered, threshold]);

    useEffect(() => {
        if (!hasRendered) {
            return;
        }

        // Let layout settle, then trigger a single shared GSAP refresh.
        queueScrollTriggerRefresh();
    }, [hasRendered]);

    return (
        <div
            ref={intersectionRef}
            className={`w-full ${hasRendered ? "" : height}`}
        >
            {hasRendered ? children : null}
        </div>
    );
};

export default LazyLoad;
