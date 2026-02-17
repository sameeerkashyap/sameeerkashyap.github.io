'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect } from 'react';

interface BrowserTabProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function BrowserTab({ isOpen, onClose, title, children }: BrowserTabProps) {
    // Lock body scroll when tab is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 500,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                >
                    {/* Browser tab bar – sticky at the very top */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1rem',
                            background: 'var(--cream-200)',
                            borderBottom: '1px solid var(--cream-300)',
                            flexShrink: 0,
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                padding: 0,
                            }}
                        >
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
                        </button>

                        <span
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '0.7rem',
                                color: 'var(--text-tertiary)',
                                letterSpacing: '0.02em',
                            }}
                        >
                            {title}
                        </span>

                        <button
                            onClick={onClose}
                            style={{
                                fontSize: '0.7rem',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--cream-300)',
                                background: 'var(--cream-100)',
                                color: 'var(--text-tertiary)',
                                cursor: 'pointer',
                                fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: '0.04em',
                            }}
                        >
                            ← Back
                        </button>
                    </div>

                    {/* Content area – takes up rest of viewport, scrollable */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            background: 'var(--cream-50)',
                            padding: 'clamp(1.5rem, 4vw, 3rem)',
                        }}
                    >
                        <div style={{ maxWidth: 720, margin: '0 auto' }}>
                            {children}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
