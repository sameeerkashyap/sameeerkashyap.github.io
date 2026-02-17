'use client';

import { motion } from 'framer-motion';

interface AboutSectionProps {
    about: string;
    education: Array<{ degree: string; institution: string; period: string }>;
}

export default function AboutSection({ about, education }: AboutSectionProps) {
    return (
        <section className="section-block" id="about">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
            >
                <p className="mono text-xs tracking-widest uppercase pt-2 pb-3 border-t mb-4"
                    style={{ color: 'var(--text-tertiary)', borderColor: 'var(--cream-300)' }}>
                    About
                </p>
            </motion.div>

            <motion.p
                className="serif text-lg md:text-xl leading-relaxed max-w-3xl mb-8"
                style={{ color: 'var(--text-secondary)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                {about}
            </motion.p>

            {/* Education */}
            {education.map((edu, i) => (
                <motion.div
                    key={edu.degree}
                    className="flex items-baseline gap-4 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                >
                    <span className="mono text-[10px] tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                        {edu.period}
                    </span>
                    <span className="font-medium">{edu.degree}</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{edu.institution}</span>
                </motion.div>
            ))}
        </section>
    );
}
