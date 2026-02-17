'use client';

import { motion } from 'framer-motion';
import { PersonalImage } from '@/lib/types';
import Image from 'next/image';

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
                        <div
                            className="relative w-full"
                            style={{ paddingBottom: i % 3 === 0 ? '130%' : i % 3 === 1 ? '100%' : '80%' }}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <p className="text-white text-sm font-medium">{img.alt}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
