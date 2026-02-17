'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, GraduationCap, Mail } from 'lucide-react';

interface SocialSidebarProps {
    github?: string;
    linkedin?: string;
    twitter?: string;
    scholar?: string;
    email?: string;
}

const links = [
    { key: 'github', label: 'GitHub', icon: Github },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { key: 'twitter', label: 'Twitter', icon: Twitter },
    { key: 'scholar', label: 'Google Scholar', icon: GraduationCap },
    { key: 'email', label: 'Email', icon: Mail },
] as const;

export default function SocialSidebar({ github, linkedin, twitter, scholar, email }: SocialSidebarProps) {
    const hrefs: Record<string, string | undefined> = {
        github,
        linkedin,
        twitter,
        scholar,
        email: email ? `mailto:${email}` : undefined,
    };

    const visible = links.filter((l) => hrefs[l.key]);

    return (
        <nav
            className="social-sidebar"
            aria-label="Social links"
        >
            {/* Vertical line above */}
            <div
                style={{
                    width: 1,
                    flex: '1 1 0',
                    maxHeight: 96,
                    background: 'linear-gradient(to bottom, transparent, var(--cream-400))',
                }}
            />

            {visible.map((link, i) => (
                <motion.a
                    key={link.key}
                    href={hrefs[link.key]}
                    target={link.key === 'email' ? undefined : '_blank'}
                    rel={link.key === 'email' ? undefined : 'noopener noreferrer'}
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
