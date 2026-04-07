'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Project } from '@/lib/types';

/**
 * Extracts the owner/repo from a GitHub URL.
 * e.g. "https://github.com/sameeerkashyap/assembly-agents" → "sameeerkashyap/assembly-agents"
 */
function extractGitHubRepo(url: string): string | null {
    try {
        const parsed = new URL(url);
        if (!parsed.hostname.includes('github.com')) return null;
        // pathname: "/owner/repo" or "/owner/repo/"
        const parts = parsed.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
            return `${parts[0]}/${parts[1]}`;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Rewrites image/media URLs in raw markdown + HTML to absolute raw.githubusercontent.com URLs.
 * This handles:
 *  - HTML <img src="..."> and <img src='...'>
 *  - HTML <source src="..."> and <video src="..." poster="...">
 *  - Markdown ![alt](url) syntax
 *  - GitHub blob/raw URLs → raw.githubusercontent.com
 *  - Relative paths → prepend rawBaseUrl
 */
function preprocessMarkdown(markdown: string, rawBaseUrl: string): string {
    if (!rawBaseUrl) return markdown;

    function resolveUrl(url: string): string {
        // Already raw.githubusercontent — leave it
        if (url.includes('raw.githubusercontent.com')) return url;

        // Rewrite github.com/owner/repo/blob/... → raw.githubusercontent.com
        const blobMatch = url.match(
            /^https?:\/\/github\.com\/([^/]+\/[^/]+)\/blob\/(.+)$/
        );
        if (blobMatch) {
            return `https://raw.githubusercontent.com/${blobMatch[1]}/${blobMatch[2]}`;
        }

        // Rewrite github.com/owner/repo/raw/... → raw.githubusercontent.com
        const rawMatch = url.match(
            /^https?:\/\/github\.com\/([^/]+\/[^/]+)\/raw\/(.+)$/
        );
        if (rawMatch) {
            return `https://raw.githubusercontent.com/${rawMatch[1]}/${rawMatch[2]}`;
        }

        // Skip other absolute URLs (shields.io badges, external images, etc.)
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
            return url;
        }

        // Relative path — resolve against rawBaseUrl
        const cleaned = url.replace(/^\.\//, '').replace(/^\//, '');
        return `${rawBaseUrl}/${cleaned}`;
    }

    let result = markdown;

    // 1. Rewrite HTML attributes: src="..." and poster="..."
    //    Matches src="..." or src='...' or poster="..." etc.
    result = result.replace(
        /((?:src|poster)\s*=\s*["'])([^"']+)(["'])/gi,
        (match, prefix, url, suffix) => {
            return `${prefix}${resolveUrl(url.trim())}${suffix}`;
        }
    );

    // 2. Rewrite Markdown image syntax: ![alt](url) and ![alt](url "title")
    result = result.replace(
        /(!\[[^\]]*\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g,
        (match, prefix, url, suffix) => {
            return `${prefix}${resolveUrl(url.trim())}${suffix}`;
        }
    );

    return result;
}

/* ========== Loading Skeleton ========== */
function ReadmeSkeleton() {
    return (
        <div className="readme-skeleton">
            <div className="skeleton-line w-3/4 h-7 mb-6" />
            <div className="skeleton-line w-full h-4 mb-3" />
            <div className="skeleton-line w-5/6 h-4 mb-3" />
            <div className="skeleton-line w-4/6 h-4 mb-6" />
            <div className="skeleton-line w-2/3 h-6 mb-4" />
            <div className="skeleton-line w-full h-4 mb-3" />
            <div className="skeleton-line w-full h-4 mb-3" />
            <div className="skeleton-line w-3/4 h-4 mb-3" />
            <div className="skeleton-line w-5/6 h-4 mb-6" />
            <div className="skeleton-line w-1/2 h-6 mb-4" />
            <div className="skeleton-line w-full h-4 mb-3" />
            <div className="skeleton-line w-4/5 h-4 mb-3" />
        </div>
    );
}

/* ========== Main Component ========== */
interface ProjectDetailProps {
    project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
    const [readme, setReadme] = useState<string | null>(null);
    const [rawBaseUrl, setRawBaseUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const repo = extractGitHubRepo(project.link);
        if (!repo) {
            setError('Not a GitHub repository');
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function fetchReadme() {
            const repo = extractGitHubRepo(project.link)!;

            // Try multiple branches: main, master
            const branches = ['main', 'master'];
            let content: string | null = null;
            let resolvedBranch: string | null = null;

            for (const branch of branches) {
                try {
                    const url = `https://raw.githubusercontent.com/${repo}/${branch}/README.md`;
                    const res = await fetch(url);
                    if (res.ok) {
                        content = await res.text();
                        resolvedBranch = branch;
                        break;
                    }
                } catch {
                    // Try next branch
                }
            }

            if (cancelled) return;

            if (content && resolvedBranch) {
                // Set the base URL for resolving relative image paths
                const baseUrl = `https://raw.githubusercontent.com/${repo}/${resolvedBranch}`;
                setRawBaseUrl(baseUrl);
                // Pre-process markdown to rewrite all image/media URLs (HTML + markdown syntax)
                setReadme(preprocessMarkdown(content, baseUrl));
            } else {
                setError('README not found');
            }
            setLoading(false);
        }

        fetchReadme();

        return () => {
            cancelled = true;
        };
    }, [project.link]);

    /**
     * Resolves image src URLs from the README to absolute raw.githubusercontent.com URLs.
     * Handles:
     *  - Already-absolute URLs (https://...) → pass through
     *  - GitHub blob URLs (github.com/owner/repo/blob/...) → rewrite to raw
     *  - Relative paths (./images/foo.png, images/foo.png, /images/foo.png) → prepend rawBaseUrl
     */
    function resolveImageUrl(src: string | undefined): string {
        if (!src) return '';

        // Already an absolute non-GitHub URL — leave it alone
        if (src.startsWith('http://') || src.startsWith('https://')) {
            // Rewrite github.com blob URLs → raw.githubusercontent.com
            // e.g. https://github.com/owner/repo/blob/main/img.png → https://raw.githubusercontent.com/owner/repo/main/img.png
            const blobMatch = src.match(
                /^https?:\/\/github\.com\/([^/]+\/[^/]+)\/blob\/(.+)$/
            );
            if (blobMatch) {
                return `https://raw.githubusercontent.com/${blobMatch[1]}/${blobMatch[2]}`;
            }

            // Rewrite github.com raw URLs that use /raw/ path
            // e.g. https://github.com/owner/repo/raw/main/img.png
            const rawMatch = src.match(
                /^https?:\/\/github\.com\/([^/]+\/[^/]+)\/raw\/(.+)$/
            );
            if (rawMatch) {
                return `https://raw.githubusercontent.com/${rawMatch[1]}/${rawMatch[2]}`;
            }

            return src;
        }

        if (!rawBaseUrl) return src;

        // Strip leading "./" or "/"
        const cleaned = src.replace(/^\.\//, '').replace(/^\//, '');
        return `${rawBaseUrl}/${cleaned}`;
    }

    /** Custom components for ReactMarkdown to fix image URLs */
    const markdownComponents = {
        img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={resolveImageUrl(src as string | undefined)}
                alt={alt || ''}
                loading="lazy"
                {...props}
            />
        ),
        // Also handle <a> tags that wrap images — rewrite their href if pointing to a blob
        a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
            let resolvedHref = href || '';
            // Rewrite github blob links to raw so image-link combos load
            if (href) {
                const blobMatch = href.match(
                    /^https?:\/\/github\.com\/([^/]+\/[^/]+)\/blob\/(.+)$/
                );
                if (blobMatch && /\.(png|jpg|jpeg|gif|svg|webp|bmp|ico)(\?.*)?$/i.test(href)) {
                    resolvedHref = `https://raw.githubusercontent.com/${blobMatch[1]}/${blobMatch[2]}`;
                }
            }
            return (
                <a href={resolvedHref} target="_blank" rel="noopener noreferrer" {...props}>
                    {children}
                </a>
            );
        },
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            {/* Header */}
            <p className="mono text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-tertiary)' }}>
                Project
            </p>

            <h1 className="serif text-4xl font-bold mb-2 text-[var(--text-primary)]">{project.title}</h1>

            <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
                {project.description}
            </p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag: string) => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
            )}

            {/* GitHub Link */}
            {project.link && (
                <div className="mb-8">
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] hover:underline"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        View on GitHub →
                    </a>
                </div>
            )}

            <div className="h-px w-full bg-[var(--cream-300)] mb-8" />

            {/* README Section */}
            <div className="readme-container">
                <div className="readme-header">
                    <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ color: 'var(--text-tertiary)' }}>
                            <path d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75zm7.251 10.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574zM8.755 4.75l-.004 7.322a3.752 3.752 0 011.992-.572H14.5v-9h-3.495a2.25 2.25 0 00-2.25 2.25z" />
                        </svg>
                        <span className="mono text-xs tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>
                            README.md
                        </span>
                    </div>
                </div>

                <div className="readme-body">
                    {loading && <ReadmeSkeleton />}

                    {error && (
                        <div className="readme-error">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v4M12 16h.01" />
                            </svg>
                            <p>Could not load README from GitHub</p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                                {error}
                            </p>
                        </div>
                    )}

                    {readme && (
                        <div className="github-markdown">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={markdownComponents}
                            >
                                {readme}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
