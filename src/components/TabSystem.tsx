'use client';

import { useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* To use lucide-react, I'll need to install it or use SVG icons. 
   I'll use raw SVGs to avoid dependency issues if lucide isn't installed. 
*/

function ChromeCloseIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function ChromePlusIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function GlobeIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    );
}

export interface Tab {
    id: string;
    title: string;
    icon?: ReactNode;
    content: ReactNode;
    type: 'home' | 'detail';
}

interface TabSystemProps {
    initialTab: Tab;
}

export default function TabSystem({ initialTab }: TabSystemProps) {
    const [tabs, setTabs] = useState<Tab[]>([initialTab]);
    const [activeTabId, setActiveTabId] = useState<string>(initialTab.id);

    // Provide this function to children via Context if needed, 
    // but for now we can pass it down or attach to window for simplicity in this specific "ClientPage" scope
    // A simplified event bus approach for "opening tabs" from deep within components works well here.

    useEffect(() => {
        const handleOpenTab = (e: CustomEvent<Tab>) => {
            const newTab = e.detail;
            setTabs(prev => {
                // If tab with same ID exists, just switch to it
                if (prev.find(t => t.id === newTab.id)) return prev;
                return [...prev, newTab];
            });
            setActiveTabId(newTab.id);
        };

        window.addEventListener('open-tab' as any, handleOpenTab);
        return () => window.removeEventListener('open-tab' as any, handleOpenTab);
    }, []);

    const closeTab = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (id === initialTab.id) return; // Cannot close home tab

        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);

        if (activeTabId === id) {
            // Switch to the last opened tab
            setActiveTabId(newTabs[newTabs.length - 1].id);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[var(--cream-200)] font-sans text-[var(--text-primary)]">
            {/* Tab Bar - Only show if > 1 tab */}
            {tabs.length > 1 && (
                <div className="flex items-end pt-2 px-2 bg-[#dfe1e5] gap-1 select-none" style={{ height: '40px' }}>
                    <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar items-end">
                        <AnimatePresence initial={false}>
                            {tabs.map((tab) => {
                                const isActive = tab.id === activeTabId;
                                return (
                                    <motion.div
                                        key={tab.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, x: -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, width: 0 }}
                                        onClick={() => setActiveTabId(tab.id)}
                                        className={`
                                            group relative flex items-center gap-2 pl-3 pr-2 py-2 min-w-[140px] max-w-[200px] h-[34px] 
                                            rounded-t-lg transition-all cursor-default text-xs
                                            ${isActive ? 'bg-[var(--cream-50)] shadow-sm z-10' : 'bg-transparent hover:bg-white/40 text-[var(--text-secondary)]'}
                                        `}
                                    >
                                        {/* Favicon */}
                                        <span className={`opacity-80 ${isActive ? 'text-blue-600' : ''}`}>
                                            {tab.icon || <GlobeIcon />}
                                        </span>

                                        {/* Title */}
                                        <span className="flex-1 truncate font-medium">
                                            {tab.title}
                                        </span>

                                        {/* Close Button */}
                                        {tab.id !== initialTab.id && (
                                            <button
                                                onClick={(e) => closeTab(e, tab.id)}
                                                className={`
                                                    p-1 rounded-full hover:bg-[var(--cream-300)] opacity-0 group-hover:opacity-100 transition-opacity
                                                    ${isActive ? 'opacity-100' : ''}
                                                `}
                                            >
                                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden bg-[var(--cream-50)]">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        id={`tab-content-${tab.id}`}
                        className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth"
                        style={{
                            display: activeTabId === tab.id ? 'block' : 'none',
                            zIndex: activeTabId === tab.id ? 1 : 0
                        }}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Global helper to open tags
export function dispatchOpenTab(tab: Tab) {
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('open-tab', { detail: tab });
        window.dispatchEvent(event);
    }
}
