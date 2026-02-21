"use client";

import { sendGAEvent } from "@/analytics/events";
import { STICKY_BANNER } from "@/analytics/events";

export default function BannerLink({ href, className, children }: { href: string, className: string, children: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            onClick={() => sendGAEvent(STICKY_BANNER)}
        >
            {children}
        </a>
    );
}
