'use client';

import { motion } from 'framer-motion';
import { BlogPost, RecommendedReading, Project } from '@/lib/types';
import { dispatchOpenTab } from '@/components/TabSystem';
import ProjectDetail from '@/components/ProjectDetail';
import { TAP_CARD, sendGAEvent } from '@/analytics/events';

const CARD_COLORS = ['card-sage', 'card-sky', 'card-lavender', 'card-peach', 'card-rose', 'card-butter'];

/* ========== DETAIL VIEWS (Content that goes into the tab) ========== */

// Helper: Common layout for detail pages
function DetailLayout({ title, subtitle, meta, children, tags }: any) {
    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            {meta && (
                <p className="mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-tertiary)' }}>
                    {meta}
                </p>
            )}

            <h1 className="serif text-4xl font-bold mb-2 text-[var(--text-primary)]">{title}</h1>

            {subtitle && (
                <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                    {subtitle}
                </p>
            )}

            <div className="h-px w-full bg-[var(--cream-300)] mb-8" />

            <div className="text-base leading-relaxed text-[var(--text-secondary)] mb-12 space-y-6">
                {children}
            </div>

            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--cream-300)]">
                    {tags.map((tag: string) => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ========== MAIN THREE COLUMNS ========== */
interface StackedColumnsProps {
    projects: Project[];
    blog: BlogPost[];
    recommendedReading: RecommendedReading[];
}

export default function StackedColumns({
    projects,
    blog,
    recommendedReading,
}: StackedColumnsProps) {

    // --- Tab Opening Handlers ---

    const openProjectTab = (item: Project) => {
        sendGAEvent(TAP_CARD, { type: 'Projects', title: item.title });
        dispatchOpenTab({
            id: `project-${item.title.toLowerCase().replace(/\s+/g, '-')}`,
            title: item.title,
            type: 'detail',
            icon: <span className="text-xs">🚀</span>,
            content: <ProjectDetail project={item} />
        });
    };

    const openBlogTab = (item: BlogPost) => {
        sendGAEvent(TAP_CARD, { type: 'Blog', title: item.title });
        dispatchOpenTab({
            id: `blog-${item.title.toLowerCase().replace(/\s+/g, '-')}`,
            title: item.title,
            type: 'detail',
            icon: <span className="text-xs">✍️</span>,
            content: (
                <DetailLayout
                    title={item.title}
                    meta={item.date}
                >
                    <p className="text-lg italic text-[var(--text-secondary)] border-l-4 border-[var(--cream-300)] pl-4 mb-8">
                        {item.excerpt}
                    </p>
                    <p>
                        (Full blog post content would go here. For now, linking to external source...)
                    </p>
                    <div className="mt-8">
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{
                                padding: '10px 20px',
                                background: 'var(--text-primary)',
                                color: 'white',
                                borderRadius: '99px',
                                textDecoration: 'none',
                                fontSize: '0.9rem'
                            }}
                        >
                            Read on Substack
                        </a>
                    </div>
                </DetailLayout>
            )
        });
    };

    const openReadingTab = (item: RecommendedReading) => {
        sendGAEvent(TAP_CARD, { type: 'Reading', title: item.title });
        dispatchOpenTab({
            id: `reading-${item.title.toLowerCase().replace(/\s+/g, '-')}`,
            title: item.title,
            type: 'detail',
            icon: <span className="text-xs">📚</span>,
            content: (
                <DetailLayout
                    title={item.title}
                    subtitle={`by ${item.author}`}
                    meta="Recommended Reading"
                >
                    <p className="mb-6">{item.description}</p>
                    {item.link && (
                        <div className="mt-8">
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] hover:underline"
                            >
                                <span className="text-xs">📚</span>
                                Get it on Amazon →
                            </a>
                        </div>
                    )}
                </DetailLayout>
            )
        });
    };

    return (
        <section className="section-block" id="creative">
            <div className="three-columns">
                {/* --- Column 1: Projects & New Ideas --- */}
                <div>
                    <p className="column-header">New Ideas &amp; Projects</p>
                    {projects.map((item, i) => (
                        <motion.div
                            key={`project-${item.title}`}
                            className="sticky-card"
                            onClick={() => openProjectTab(item)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            style={{
                                zIndex: 30 - i,
                                border: '2px solid white',
                                backgroundColor: `color-mix(in srgb, var(--pastel-lavender), var(--cream-100) ${i * 15}%)`
                            }}
                        >
                            <h4 className="font-semibold text-sm mb-0.5">{item.title}</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {item.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="tag" style={{ fontSize: '0.55rem' }}>{tag}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* --- Column 2: Blog --- */}
                <div>
                    <p className="column-header">Some of my thoughts</p>

                    {(blog ?? []).map((item, i) => (
                        <motion.div
                            key={`blog-${item.title}`}
                            className="sticky-card"
                            onClick={() => openBlogTab(item)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 + 0.15, duration: 0.4 }}
                            style={{
                                zIndex: blog.length - i,
                                border: '2px solid white',
                                backgroundColor: `color-mix(in srgb, var(--pastel-butter), var(--cream-100) ${i * 15}%)`
                            }}
                        >
                            <p className="mono text-[9px] tracking-widest mb-1" style={{ color: 'var(--text-tertiary)' }}>
                                {item.date}
                            </p>
                            <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                {item.excerpt.length > 100 ? item.excerpt.substring(0, 100) + '…' : item.excerpt}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* --- Column 3: Recommended Reading --- */}
                <div>
                    <p className="column-header">Reading - Recommend these!</p>

                    {recommendedReading.map((item, i) => (
                        <motion.div
                            key={`reading-${item.title}`}
                            className="sticky-card"
                            onClick={() => openReadingTab(item)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 + 0.3, duration: 0.4 }}
                            style={{
                                zIndex: recommendedReading.length - i,
                                border: '2px solid white',
                                backgroundColor: `color-mix(in srgb, var(--pastel-peach), var(--cream-100) ${i * 15}%)`
                            }}
                        >
                            <h4 className="font-semibold text-sm mb-0.5">{item.title}</h4>
                            <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>
                                {item.author}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
