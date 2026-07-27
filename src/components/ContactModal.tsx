'use client';

import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { type SocialLink } from '@/lib/socialLinks';

/* ================================================================
   Full-screen frosted contact sheet: the social links, enlarged and
   labelled, laid out horizontally.

   The blur sits on its own static layer. Nothing animates it and it
   never carries an opacity below 1 — an element that animates its
   own opacity becomes a backdrop root, and then `backdrop-filter`
   has nothing behind it left to blur. The portal keeps it out of
   the scroll container's stacking context for the same reason.
   Only the panel contents fade.
   ================================================================ */

const FADE_MS = 160;

interface ContactModalProps {
    open: boolean;
    links: SocialLink[];
    onClose: () => void;
}

export default function ContactModal({ open, links, onClose }: ContactModalProps) {
    const nodeRef = useRef<HTMLDivElement | null>(null);

    // Flip the class one frame after mount so the fade actually runs
    const attachBackdrop = useCallback((node: HTMLDivElement | null) => {
        nodeRef.current = node;
        if (!node) return;
        requestAnimationFrame(() => node.classList.add('is-open'));
    }, []);

    const close = useCallback(() => {
        const node = nodeRef.current;
        if (!node) {
            onClose();
            return;
        }
        node.classList.remove('is-open');
        window.setTimeout(onClose, FADE_MS);
    }, [onClose]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, close]);

    // `open` only ever flips from a click, so document is available by then
    if (!open) return null;

    return createPortal(
        <div
            ref={attachBackdrop}
            className="contact-backdrop"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Contact"
        >
            <div className="contact-blur" aria-hidden="true" />

            <div className="contact-panel" onClick={e => e.stopPropagation()}>
                <button className="contact-close" onClick={close} aria-label="Close contact">
                    ✕
                </button>

                <p className="mono contact-panel-title">Get in touch</p>

                <div className="contact-row">
                    {links.map(link => (
                        <a
                            key={link.key}
                            className="contact-item"
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                        >
                            <link.icon size={26} strokeWidth={1.75} />
                            <span className="mono contact-label">{link.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>,
        document.body,
    );
}
