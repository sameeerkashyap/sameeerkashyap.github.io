'use client';

import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { WorkExperience, BlogPost, RecommendedReading, Project, ResearchExperience } from '@/lib/types';
import BrowserTab from './BrowserTab';

const CARD_COLORS = ['card-sage', 'card-sky', 'card-lavender', 'card-peach', 'card-rose', 'card-butter'];

/* ========== MODAL CARD GRID ========== */
interface ColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

function ColumnModal({ isOpen, onClose, title, children }: ColumnModalProps) {
    return (
        <BrowserTab isOpen={isOpen} onClose={onClose} title={title}>
            {children}
        </BrowserTab>
    );
}

/* ========== DETAIL VIEW COMPONENTS ========== */
function WorkDetailView({ item }: { item: WorkExperience }) {
    return (
        <div>
            <p className="mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
                {item.period}
            </p>
            <h2 className="serif text-2xl font-bold mb-1">{item.title}</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {item.company} — {item.location}
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
            </p>

            {item.highlights && item.highlights.length > 0 && (
                <div className="mb-6">
                    <h3 className="mono text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--text-tertiary)' }}>
                        Key Highlights
                    </h3>
                    <ul className="space-y-2">
                        {item.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                <span style={{ color: 'var(--pastel-sage-deep)' }}>▸</span>
                                {h}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: 'var(--cream-300)' }}>
                {item.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>
        </div>
    );
}

function BlogDetailView({ item }: { item: BlogPost }) {
    return (
        <div>
            <p className="mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
                {item.date}
            </p>
            <h2 className="serif text-2xl font-bold mb-4">{item.title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.excerpt}
            </p>
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--cream-300)' }}>
                <a
                    href={item.link}
                    className="link-hover mono text-xs tracking-widest uppercase"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    Read full post →
                </a>
            </div>
        </div>
    );
}

function ReadingDetailView({ item }: { item: RecommendedReading }) {
    return (
        <div>
            <p className="mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Recommended
            </p>
            <h2 className="serif text-2xl font-bold mb-1">{item.title}</h2>
            <p className="text-xs italic mb-4" style={{ color: 'var(--text-tertiary)' }}>
                by {item.author}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
            </p>
        </div>
    );
}

function ProjectDetailView({ item }: { item: Project }) {
    return (
        <div>
            <p className="mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Project
            </p>
            <h2 className="serif text-2xl font-bold mb-4">{item.title}</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>
            {item.link && (
                <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-hover mono text-xs tracking-widest uppercase"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    View on GitHub →
                </a>
            )}
        </div>
    );
}

function ResearchDetailView({ item }: { item: ResearchExperience }) {
    return (
        <div>
            <p className="mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
                {item.period}
            </p>
            <h2 className="serif text-2xl font-bold mb-1">{item.title}</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {item.institution} — {item.location}
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: 'var(--cream-300)' }}>
                {item.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>
        </div>
    );
}

/* ========== MAIN THREE COLUMNS ========== */
interface StackedColumnsProps {
    workExperience: WorkExperience[];
    researchExperience: ResearchExperience[];
    projects: Project[];
    blog: BlogPost[];
    recommendedReading: RecommendedReading[];
}

type DetailItem =
    | { type: 'work'; item: WorkExperience }
    | { type: 'blog'; item: BlogPost }
    | { type: 'reading'; item: RecommendedReading }
    | { type: 'project'; item: Project }
    | { type: 'research'; item: ResearchExperience };

export default function StackedColumns({
    workExperience,
    researchExperience,
    projects,
    blog,
    recommendedReading,
}: StackedColumnsProps) {
    const [activeDetail, setActiveDetail] = useState<DetailItem | null>(null);

    const renderDetail = () => {
        if (!activeDetail) return null;
        switch (activeDetail.type) {
            case 'work': return <WorkDetailView item={activeDetail.item} />;
            case 'blog': return <BlogDetailView item={activeDetail.item} />;
            case 'reading': return <ReadingDetailView item={activeDetail.item} />;
            case 'project': return <ProjectDetailView item={activeDetail.item} />;
            case 'research': return <ResearchDetailView item={activeDetail.item} />;
        }
    };

    const getDetailTitle = () => {
        if (!activeDetail) return '';
        switch (activeDetail.type) {
            case 'work': return `${activeDetail.item.company} — ${activeDetail.item.title}`;
            case 'blog': return activeDetail.item.title;
            case 'reading': return activeDetail.item.title;
            case 'project': return activeDetail.item.title;
            case 'research': return `${activeDetail.item.institution} — ${activeDetail.item.title}`;
        }
    };

    return (
        <>
            <section className="section-block" id="experience">
                <div className="three-columns">
                    {/* --- Column 1: Experience (Research + Work) --- */}
                    <div>
                        <p className="column-header">Experience</p>

                        {/* Research */}
                        {researchExperience.map((item, i) => (
                            <motion.div
                                key={`research-${item.title}`}
                                className={`sticky-card ${CARD_COLORS[i % CARD_COLORS.length]}`}
                                onClick={() => setActiveDetail({ type: 'research', item })}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                style={{ zIndex: researchExperience.length - i }}
                            >
                                <p className="mono text-[9px] tracking-widest uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>
                                    {item.period}
                                </p>
                                <h4 className="font-semibold text-sm mb-0.5">{item.title}</h4>
                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.institution}</p>
                            </motion.div>
                        ))}

                        {/* Work Experience */}
                        {workExperience.map((item, i) => (
                            <motion.div
                                key={`work-${item.title}`}
                                className={`sticky-card ${CARD_COLORS[(i + 2) % CARD_COLORS.length]}`}
                                onClick={() => setActiveDetail({ type: 'work', item })}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (i + researchExperience.length) * 0.1, duration: 0.4 }}
                                style={{ zIndex: workExperience.length - i }}
                            >
                                <p className="mono text-[9px] tracking-widest uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>
                                    {item.period}
                                </p>
                                <h4 className="font-semibold text-sm mb-0.5">{item.title}</h4>
                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.company}</p>
                            </motion.div>
                        ))}

                        {/* Projects */}
                        <p className="column-header mt-6">Projects</p>
                        {projects.map((item, i) => (
                            <motion.div
                                key={`project-${item.title}`}
                                className={`sticky-card ${CARD_COLORS[(i + 4) % CARD_COLORS.length]}`}
                                onClick={() => setActiveDetail({ type: 'project', item })}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                style={{ zIndex: projects.length - i }}
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
                        <p className="column-header">Blog</p>

                        {blog.map((item, i) => (
                            <motion.div
                                key={`blog-${item.title}`}
                                className={`sticky-card ${CARD_COLORS[(i + 1) % CARD_COLORS.length]}`}
                                onClick={() => setActiveDetail({ type: 'blog', item })}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 + 0.15, duration: 0.4 }}
                                style={{ zIndex: blog.length - i }}
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
                        <p className="column-header">Reading</p>

                        {recommendedReading.map((item, i) => (
                            <motion.div
                                key={`reading-${item.title}`}
                                className={`sticky-card ${CARD_COLORS[(i + 3) % CARD_COLORS.length]}`}
                                onClick={() => setActiveDetail({ type: 'reading', item })}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 + 0.3, duration: 0.4 }}
                                style={{ zIndex: recommendedReading.length - i }}
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

            {/* Browser Tab Detail View */}
            <ColumnModal
                isOpen={!!activeDetail}
                onClose={() => setActiveDetail(null)}
                title={getDetailTitle()}
            >
                {renderDetail()}
            </ColumnModal>
        </>
    );
}
