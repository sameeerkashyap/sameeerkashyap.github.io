import { getPortfolioConfig } from "@/lib/config";
import { Megaphone } from "lucide-react";
import BannerLink from "./BannerLink";

export default function StickyBanner() {
    const config = getPortfolioConfig();
    if (!config.stickyBanner) return null;

    const content = (
        <>
            <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs md:text-base">{config.stickyBanner}</span>
        </>
    );

    const commonClasses = "sticky top-0 z-[100] w-full bg-amber-400 text-black px-4 py-2.5 font-medium flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base border-b border-amber-500/20 backdrop-blur-sm bg-opacity-95 transition-colors hover:bg-amber-500";

    if (config.stickyBannerLink) {
        return (
            <BannerLink
                href={config.stickyBannerLink}
                className={commonClasses}
            >
                {content}
            </BannerLink>
        );
    }

    return (
        <div className={commonClasses}>
            {content}
        </div>
    );
}
