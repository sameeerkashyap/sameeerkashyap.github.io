'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, Publication, BlogPost } from '@/lib/types';
import { dispatchOpenTab } from '@/components/TabSystem';
import ProjectDetail from '@/components/ProjectDetail';

// ─── Item types ─────────────────────────────────────────────────────────────

type FeedCategory = 'project' | 'publication' | 'article';

interface FeedItem {
    id: string;
    category: FeedCategory;
    emoji: string;
    label: string;      // one-liner badge text
    title: string;
    summary: string;    // ≤ 80 chars
    href?: string;
    onClick?: () => void;
}

// ─── Category badge colours ──────────────────────────────────────────────────

const BADGE: Record<FeedCategory, { bg: string; text: string; dot: string }> = {
    project:     { bg: 'rgba(200,213,185,0.35)', text: '#5a7a50', dot: '#a3b899' },
    publication: { bg: 'rgba(184,212,227,0.35)', text: '#3a6a82', dot: '#8fb9d4' },
    article:     { bg: 'rgba(196,183,212,0.35)', text: '#6a5082', dot: '#a998bf' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function truncate(s: string, n = 80) {
    return s.length <= n ? s : s.slice(0, n - 1) + '…';
}


// ─── Build feed items from config data ───────────────────────────────────────

function buildFeed(
    projects: Project[] | null,
    publications: Publication[] | null,
    blog: BlogPost[] | null,
): FeedItem[] {
    const safeProjects = projects ?? [];
    const safePubs = publications ?? [];
    const safeBlog = blog ?? [];

    const projectItems: FeedItem[] = safeProjects.slice(0, 3).map((p) => ({
        id: `project-${p.title}`,
        category: 'project',
        emoji: '🚀',
        label: 'Project',
        title: p.title,
        summary: truncate(p.description),
        href: p.link,
        onClick: () =>
            dispatchOpenTab({
                id: `project-${p.title.toLowerCase().replace(/\s+/g, '-')}`,
                title: p.title,
                type: 'detail',
                icon: <span className="text-xs">🚀</span>,
                content: <ProjectDetail project={p} />,
            }),
    }));

    const pubItems: FeedItem[] = safePubs.slice(0, 3).map((p) => ({
        id: `pub-${p.title}`,
        category: 'publication',
        emoji: '📄',
        label: p.status,
        title: p.title,
        summary: truncate(p.venue),
        href: p.link,
        onClick: () =>
            dispatchOpenTab({
                id: `pub-${p.title.toLowerCase().replace(/\s+/g, '-')}`,
                title: p.title,
                type: 'detail',
                icon: <span className="text-xs">📄</span>,
                content: (
                    <div className="max-w-2xl mx-auto py-12 px-6">
                        <p className="mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-tertiary)' }}>{p.status} · {p.year}</p>
                        <h1 className="serif text-3xl font-bold mb-4 text-[var(--text-primary)]">{p.title}</h1>
                        <div className="h-px w-full bg-[var(--cream-300)] mb-8" />
                        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-8">{p.venue}</p>
                        {p.link && (
                            <a href={p.link} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium"
                                style={{ color: 'var(--pastel-sky-deep)' }}>
                                Read Paper →
                            </a>
                        )}
                    </div>
                ),
            }),
    }));

    const blogItems: FeedItem[] = safeBlog.slice(0, 3).map((b) => ({
        id: `blog-${b.title}`,
        category: 'article',
        emoji: '✍️',
        label: 'Article',
        title: b.title,
        summary: truncate(b.excerpt),
        href: b.link,
        onClick: () =>
            dispatchOpenTab({
                id: `blog-${b.title.toLowerCase().replace(/\s+/g, '-')}`,
                title: b.title,
                type: 'detail',
                icon: <span className="text-xs">✍️</span>,
                content: (
                    <div className="max-w-2xl mx-auto py-12 px-6">
                        <p className="mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-tertiary)' }}>Article · {b.date}</p>
                        <h1 className="serif text-3xl font-bold mb-4 text-[var(--text-primary)]">{b.title}</h1>
                        <div className="h-px w-full bg-[var(--cream-300)] mb-8" />
                        <p className="text-base leading-relaxed italic text-[var(--text-secondary)] border-l-4 border-[var(--cream-300)] pl-4 mb-8">{b.excerpt}</p>
                    </div>
                ),
            }),
    }));

    // Round-robin interleave: project → publication → article → repeat
    const rounds = Math.max(projectItems.length, pubItems.length, blogItems.length);
    const feed: FeedItem[] = [];
    for (let i = 0; i < rounds; i++) {
        if (projectItems[i]) feed.push(projectItems[i]);
        if (pubItems[i]) feed.push(pubItems[i]);
        if (blogItems[i]) feed.push(blogItems[i]);
    }
    return feed;
}

// ─── Arrow button ────────────────────────────────────────────────────────────

function ArrowBtn({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            aria-label={dir === 'prev' ? 'Previous' : 'Next'}
            style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '1px solid var(--cream-300)',
                background: 'var(--cream-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 0.2s, transform 0.15s',
                color: 'var(--text-tertiary)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--cream-300)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--cream-100)')}
        >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                {dir === 'prev'
                    ? <path d="M6.5 1.5L3 5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    : <path d="M3.5 1.5L7 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                }
            </svg>
        </button>
    );
}

// ─── Main component ──────────────────────────────────────────────────────────

interface LiveFeedProps {
    projects: Project[] | null;
    publications: Publication[] | null;
    blog: BlogPost[] | null;
}

const ROTATE_MS = 4000;

export default function LiveFeed({ projects, publications, blog }: LiveFeedProps) {
    const feed = buildFeed(projects ?? [], publications ?? [], blog ?? []);
    const [idx, setIdx] = useState(0);
    const [dir, setDir] = useState<1 | -1>(1);
    const [paused, setPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const advance = useCallback((step: 1 | -1) => {
        setDir(step);
        setIdx(prev => (prev + step + feed.length) % feed.length);
    }, [feed.length]);

    // Auto-rotate
    useEffect(() => {
        if (paused) return;
        timerRef.current = setTimeout(() => advance(1), ROTATE_MS);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [idx, paused, advance]);

    if (feed.length === 0) return null;

    const item = feed[idx];
    const badge = BADGE[item.category];

    return (
        <div
            className="livefeed-root"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* ── Desktop layout ── */}
            <div className="livefeed-inner">

                {/* Left: live pill + divider */}
                <div className="livefeed-left">
                    <span className="livefeed-dot" />
                    <span className="livefeed-latest mono">Latest</span>
                    <div className="livefeed-divider" />
                </div>

                {/* Centre: animated item */}
                <div className="livefeed-center">
                    <AnimatePresence mode="wait" custom={dir}>
                        <motion.button
                            key={item.id}
                            custom={dir}
                            initial={{ opacity: 0, y: dir * 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: dir * -14 }}
                            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                            onClick={item.onClick}
                            className="livefeed-item-btn"
                        >
                            {/* Emoji */}
                            <span className="livefeed-emoji">{item.emoji}</span>

                            {/* Badge */}
                            <span
                                className="livefeed-badge mono"
                                style={{ background: badge.bg, color: badge.text }}
                            >
                                {item.label}
                            </span>

                            {/* Title + summary stacked on mobile, inline on desktop */}
                            <span className="livefeed-text-group">
                                <span className="livefeed-title">{item.title}</span>
                                <span className="livefeed-sep">·</span>
                                <span className="livefeed-summary">{item.summary}</span>
                            </span>

                            <span className="livefeed-arrow">→</span>
                        </motion.button>
                    </AnimatePresence>
                </div>

                {/* Right: dots + arrows */}
                <div className="livefeed-right">
                    <div className="livefeed-dots">
                        {feed.map((_, i) => (
                            <button
                                key={i}
                                className="livefeed-dot-btn"
                                onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                                aria-label={`Go to item ${i + 1}`}
                                style={{
                                    width: i === idx ? 16 : 5,
                                    background: i === idx
                                        ? 'var(--pastel-sage-deep)'
                                        : 'var(--cream-300)',
                                }}
                            />
                        ))}
                    </div>
                    <ArrowBtn dir="prev" onClick={() => advance(-1)} />
                    <ArrowBtn dir="next" onClick={() => advance(1)} />
                </div>
            </div>

            <style>{`
                /* ── Root ── */
                .livefeed-root {
                    position: relative;
                    z-index: 50;
                    border-bottom: 1px solid var(--cream-300);
                    background: var(--cream-50);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }

                /* ── Wrapper ── */
                .livefeed-inner {
                    max-width: var(--max-width);
                    margin: 0 auto;
                    padding: 0 clamp(1.5rem, 5vw, 5rem);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-height: 52px;
                }

                /* ── Left cluster ── */
                .livefeed-left {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-shrink: 0;
                }

                .livefeed-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #a3b899;
                    box-shadow: 0 0 0 3px rgba(163,184,153,0.25);
                    animation: live-pulse 2s ease-in-out infinite;
                    display: inline-block;
                    flex-shrink: 0;
                }

                .livefeed-latest {
                    font-size: 0.62rem;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: var(--text-tertiary);
                    font-weight: 600;
                }

                .livefeed-divider {
                    width: 1px;
                    height: 18px;
                    background: var(--cream-300);
                    margin-left: 4px;
                }

                /* ── Centre: item ── */
                .livefeed-center {
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                }

                .livefeed-item-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 6px 0;
                    text-align: left;
                    width: 100%;
                    min-width: 0;
                }

                .livefeed-emoji {
                    font-size: 1rem;
                    flex-shrink: 0;
                    line-height: 1;
                }

                .livefeed-badge {
                    font-size: 0.58rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    padding: 2px 8px;
                    border-radius: 999px;
                    flex-shrink: 0;
                    font-weight: 700;
                }

                /* ── Text group: inline on desktop, stacked on mobile ── */
                .livefeed-text-group {
                    display: flex;
                    align-items: baseline;
                    gap: 6px;
                    min-width: 0;
                    flex: 1;
                }

                .livefeed-title {
                    font-size: 0.82rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex-shrink: 0;
                    max-width: 240px;
                }

                .livefeed-sep {
                    color: var(--cream-400);
                    font-size: 0.65rem;
                    flex-shrink: 0;
                }

                .livefeed-summary {
                    font-size: 0.76rem;
                    color: var(--text-tertiary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex: 1;
                    min-width: 0;
                }

                .livefeed-arrow {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                    flex-shrink: 0;
                    opacity: 0.55;
                    margin-left: 2px;
                }

                /* ── Right: dots + arrows ── */
                .livefeed-right {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    flex-shrink: 0;
                }

                .livefeed-dots {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }

                .livefeed-dot-btn {
                    height: 5px;
                    border-radius: 999px;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    transition: width 0.3s ease, background 0.3s ease;
                }

                /* ── Keyframes ── */
                @keyframes live-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.45; transform: scale(0.75); }
                }

                /* ── Mobile overrides (≤ 640px) ── */
                @media (max-width: 640px) {
                    .livefeed-inner {
                        flex-wrap: wrap;
                        min-height: unset;
                        padding-top: 10px;
                        padding-bottom: 10px;
                        gap: 8px;
                        align-items: flex-start;
                    }

                    /* Left + right share the top row */
                    .livefeed-left {
                        order: 0;
                        flex: 1;
                    }

                    .livefeed-right {
                        order: 1;
                    }

                    /* Item takes full width on its own row */
                    .livefeed-center {
                        order: 2;
                        width: 100%;
                        flex-basis: 100%;
                    }

                    .livefeed-item-btn {
                        flex-wrap: wrap;
                        gap: 6px;
                        padding: 4px 0 2px;
                    }

                    /* Stack title + summary vertically on mobile */
                    .livefeed-text-group {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 2px;
                        width: 100%;
                    }

                    .livefeed-title {
                        font-size: 0.84rem;
                        white-space: normal;
                        overflow: visible;
                        text-overflow: unset;
                        max-width: 100%;
                    }

                    .livefeed-sep {
                        display: none;
                    }

                    .livefeed-summary {
                        font-size: 0.74rem;
                        white-space: normal;
                        overflow: visible;
                        text-overflow: unset;
                        line-height: 1.4;
                    }

                    .livefeed-arrow {
                        display: none;
                    }

                    /* Hide dot-progress on mobile to save space */
                    .livefeed-dots {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}
