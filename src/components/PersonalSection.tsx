'use client';

import { motion } from 'framer-motion';
import { PersonalImage } from '@/lib/types';

interface PersonalSectionProps {
    personalInterests: string[];
    personalImages: PersonalImage[];
}

export default function PersonalSection({ personalInterests, personalImages }: PersonalSectionProps) {
    return (
        <section className="section-block" id="personal">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
            >
                <p className="mono text-xs tracking-widest uppercase pt-2 pb-3 border-t mb-2"
                    style={{ color: 'var(--text-tertiary)', borderColor: 'var(--cream-300)' }}>
                    Beyond Research
                </p>
                <h2 className="serif text-2xl md:text-3xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Life outside the lab
                </h2>
                <p className="text-md mb-6">
                    I am an ocean lover at heart, hoping to conquer every wave and dive into every depth. When I&apos;m not in the water, you can find me enjoying soccer, beaches, running or swimming or just enjoying a sunny day.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                    {personalInterests.map((interest) => (
                        <span key={interest} className="tag">
                            {interest}
                        </span>
                    ))}
                </div>
            </motion.div>

            {/* Photo Grid */}
            <div className="photo-grid" style={{ paddingRight: 0 }}>
                {personalImages.map((img, i) => (
                    <motion.div
                        key={img.src}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="relative rounded-2xl overflow-hidden group"
                    >
                        <div className="relative w-full">
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 block"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 flex items-end p-4">
                            <p className="text-white text-sm font-medium">{img.alt}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
