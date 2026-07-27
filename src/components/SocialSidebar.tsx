'use client';

import { motion } from 'framer-motion';
import { buildSocialLinks, type SocialLinkSource } from '@/lib/socialLinks';

export default function SocialSidebar(source: SocialLinkSource) {
    const links = buildSocialLinks(source);

    return (
        <nav className="social-sidebar" aria-label="Social links">
            {/* Vertical line above */}
            <div
                style={{
                    width: 1,
                    flex: '1 1 0',
                    maxHeight: 96,
                    background: 'linear-gradient(to bottom, transparent, var(--cream-400))',
                }}
            />

            {links.map((link, i) => (
                <motion.a
                    key={link.key}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    title={link.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + i * 0.1, duration: 0.4 }}
                >
                    <link.icon size={18} strokeWidth={2} />
                </motion.a>
            ))}

            {/* Vertical line below */}
            <div
                style={{
                    width: 1,
                    flex: '1 1 0',
                    maxHeight: 96,
                    background: 'linear-gradient(to top, transparent, var(--cream-400))',
                }}
            />
        </nav>
    );
}
