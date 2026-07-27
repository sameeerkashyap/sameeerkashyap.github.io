'use client';

import { useEffect, useState } from 'react';

/* ================================================================
   Live view of the most recent pull requests the user opened,
   straight from the public GitHub search API. Configured from
   data/config.md (githubActivity): how many to show, and whether
   each repository may appear only once.
   Cached in sessionStorage so a tab switch doesn't re-spend the
   unauthenticated rate limit (10 search requests/min per IP).
   ================================================================ */

interface PullRequest {
    id: number;
    repo: string;
    number: number;
    title: string;
    url: string;
    state: 'merged' | 'open' | 'closed';
    updatedAt: string;
}

interface GitHubSearchItem {
    id: number;
    number: number;
    title: string;
    html_url: string;
    state: string;
    updated_at: string;
    repository_url: string;
    pull_request?: { merged_at: string | null };
}

const CACHE_TTL_MS = 30 * 60 * 1000;
const SEARCH_PAGE_SIZE = 60;

function handleFromUrl(githubUrl: string): string | null {
    const match = githubUrl.match(/github\.com\/([^/?#]+)/);
    return match ? match[1] : null;
}

function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const day = 86_400_000;
    if (diff < day) return 'today';
    if (diff < 2 * day) return 'yesterday';
    if (diff < 30 * day) return `${Math.floor(diff / day)}d ago`;
    if (diff < 365 * day) return `${Math.floor(diff / (30 * day))}mo ago`;
    return `${Math.floor(diff / (365 * day))}y ago`;
}

/**
 * Newest pull requests first. With `uniqueRepos` each repository may
 * contribute at most one PR; otherwise consecutive PRs from the same
 * repository are kept as they come.
 */
function pickPullRequests(items: GitHubSearchItem[], limit: number, uniqueRepos: boolean): PullRequest[] {
    const out: PullRequest[] = [];
    const seen = new Set<string>();

    for (const item of items) {
        const repo = item.repository_url.split('/repos/')[1];
        if (!repo) continue;
        if (uniqueRepos && seen.has(repo)) continue;
        seen.add(repo);
        out.push({
            id: item.id,
            repo,
            number: item.number,
            title: item.title,
            url: item.html_url,
            state: item.pull_request?.merged_at
                ? 'merged'
                : item.state === 'open' ? 'open' : 'closed',
            updatedAt: item.updated_at,
        });
        if (out.length === limit) break;
    }

    return out;
}

function StatePill({ state }: { state: PullRequest['state'] }) {
    const colors: Record<PullRequest['state'], string> = {
        merged: 'var(--pastel-lavender)',
        open: 'var(--pastel-sage)',
        closed: 'var(--pastel-rose)',
    };
    return (
        <span className="gh-pr-state" style={{ background: colors[state] }}>
            {state}
        </span>
    );
}

interface GitHubPullRequestsProps {
    githubUrl: string;
    /** How many pull requests to show — clamped to 1–3. */
    count?: number;
    /** true: at most one PR per repository. false: latest PRs, same repo allowed. */
    uniqueRepos?: boolean;
}

export default function GitHubPullRequests({
    githubUrl,
    count = 3,
    uniqueRepos = true,
}: GitHubPullRequestsProps) {
    const handle = handleFromUrl(githubUrl);
    const limit = Math.min(3, Math.max(1, Math.round(count)));
    const [prs, setPrs] = useState<PullRequest[] | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!handle) {
            setFailed(true);
            return;
        }

        const cacheKey = `gh-prs:${handle}:${limit}:${uniqueRepos ? 'multi' : 'any'}`;
        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const { at, data } = JSON.parse(cached) as { at: number; data: PullRequest[] };
                if (Date.now() - at < CACHE_TTL_MS) {
                    setPrs(data);
                    return;
                }
            }
        } catch {
            // Ignore unusable cache entries and fetch fresh
        }

        const controller = new AbortController();

        (async () => {
            try {
                const query = encodeURIComponent(`type:pr author:${handle}`);
                // Only need a deep page when repos must be distinct — the newest
                // PRs often cluster in a single repository.
                const perPage = uniqueRepos ? SEARCH_PAGE_SIZE : limit;
                const res = await fetch(
                    `https://api.github.com/search/issues?q=${query}&sort=updated&order=desc&per_page=${perPage}`,
                    { headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal },
                );
                if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

                const json = (await res.json()) as { items?: GitHubSearchItem[] };
                const data = pickPullRequests(json.items ?? [], limit, uniqueRepos);
                if (data.length === 0) throw new Error('No pull requests found');

                setPrs(data);
                try {
                    sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data }));
                } catch {
                    // Storage full or blocked — the list still renders
                }
            } catch (err) {
                if ((err as Error).name !== 'AbortError') setFailed(true);
            }
        })();

        return () => controller.abort();
    }, [handle, limit, uniqueRepos]);

    if (failed) {
        return (
            <a className="mono gh-pr-fallback" href={githubUrl} target="_blank" rel="noopener noreferrer">
                View activity on GitHub →
            </a>
        );
    }

    return (
        <div className="gh-pr-block">
            <div className="gh-pr-header">
                <span className="mono">
                    <span className="gh-pr-dot" /> Github Contributions
                </span>
                <a className="mono gh-pr-link" href={githubUrl} target="_blank" rel="noopener noreferrer">
                    @{handle}
                </a>
            </div>

            {prs === null ? (
                <div className="gh-pr-list">
                    {Array.from({ length: limit }).map((_, i) => (
                        <div key={i} className="gh-pr-item">
                            <div className="skeleton-line" style={{ height: 9, width: '45%' }} />
                            <div className="skeleton-line" style={{ height: 11, width: '85%', marginTop: 6 }} />
                        </div>
                    ))}
                </div>
            ) : (
                <ul className="gh-pr-list">
                    {prs.map(pr => (
                        <li key={pr.id}>
                            <a className="gh-pr-item" href={pr.url} target="_blank" rel="noopener noreferrer">
                                <span className="mono gh-pr-repo">
                                    {pr.repo}
                                    <span className="gh-pr-number">#{pr.number}</span>
                                    <StatePill state={pr.state} />
                                </span>
                                <span className="gh-pr-title">{pr.title}</span>
                                <span className="mono gh-pr-time">{relativeTime(pr.updatedAt)}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
