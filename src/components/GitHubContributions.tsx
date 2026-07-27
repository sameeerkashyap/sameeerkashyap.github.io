'use client';

import { useEffect, useMemo, useState } from 'react';

/* ================================================================
   The green commit grid from the GitHub profile, last ~5 weeks.

   GitHub's REST API does not expose contribution counts (only the
   authenticated GraphQL API does, which would mean shipping a token
   to the browser), so this reads the public, CORS-enabled mirror at
   github-contributions-api.jogruber.de — the same numbers rendered
   on the profile page. If it is unreachable the widget hides itself.
   ================================================================ */

interface ContributionDay {
    date: string;  // YYYY-MM-DD
    count: number;
    level: number; // 0–4, same scale GitHub uses
}

const CACHE_TTL_MS = 60 * 60 * 1000;
const WEEKS = 5;
const DAY_MS = 86_400_000;

// Empty cell picks up the page cream; the rest is GitHub's green ramp
const LEVEL_COLORS = [
    'var(--cream-300)',
    '#9be9a8',
    '#40c463',
    '#30a14e',
    '#216e39',
];

function handleFromUrl(githubUrl: string): string | null {
    const match = githubUrl.match(/github\.com\/([^/?#]+)/);
    return match ? match[1] : null;
}

function isoDate(d: Date): string {
    return d.toISOString().slice(0, 10);
}

function formatDay(iso: string): string {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * The trailing `WEEKS` weeks as columns of 7 days (Sunday first),
 * padded with nulls before the first day and after today.
 */
function buildWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
    const byDate = new Map(days.map(d => [d.date, d]));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Walk back to the Sunday that starts the earliest visible week
    const start = new Date(today.getTime() - (WEEKS * 7 - 1) * DAY_MS);
    start.setDate(start.getDate() - start.getDay());

    const weeks: (ContributionDay | null)[][] = [];
    for (let w = 0; w < WEEKS + 1; w++) {
        const week: (ContributionDay | null)[] = [];
        for (let d = 0; d < 7; d++) {
            const day = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
            if (day.getTime() > today.getTime()) {
                week.push(null);
                continue;
            }
            const iso = isoDate(day);
            week.push(byDate.get(iso) ?? { date: iso, count: 0, level: 0 });
        }
        if (week.some(Boolean)) weeks.push(week);
    }
    return weeks;
}

interface GitHubContributionsProps {
    githubUrl: string;
}

export default function GitHubContributions({ githubUrl }: GitHubContributionsProps) {
    const handle = handleFromUrl(githubUrl);
    const [days, setDays] = useState<ContributionDay[] | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!handle) {
            setFailed(true);
            return;
        }

        const cacheKey = `gh-contrib:${handle}`;
        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const { at, data } = JSON.parse(cached) as { at: number; data: ContributionDay[] };
                if (Date.now() - at < CACHE_TTL_MS) {
                    setDays(data);
                    return;
                }
            }
        } catch {
            // Unusable cache entry — fetch fresh
        }

        const controller = new AbortController();

        (async () => {
            try {
                const res = await fetch(
                    `https://github-contributions-api.jogruber.de/v4/${handle}?y=last`,
                    { signal: controller.signal },
                );
                if (!res.ok) throw new Error(`Contributions API responded ${res.status}`);

                const json = (await res.json()) as { contributions?: ContributionDay[] };
                const all = json.contributions ?? [];
                if (all.length === 0) throw new Error('No contribution data');

                // Only the tail is ever rendered — keep the cache small
                const cutoff = Date.now() - (WEEKS + 2) * 7 * DAY_MS;
                const recent = all.filter(d => new Date(`${d.date}T00:00:00`).getTime() >= cutoff);

                setDays(recent);
                try {
                    sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data: recent }));
                } catch {
                    // Storage blocked — the grid still renders
                }
            } catch (err) {
                if ((err as Error).name !== 'AbortError') setFailed(true);
            }
        })();

        return () => controller.abort();
    }, [handle]);

    const weeks = useMemo(() => (days ? buildWeeks(days) : []), [days]);
    const total = useMemo(
        () => weeks.flat().reduce((sum, d) => sum + (d?.count ?? 0), 0),
        [weeks],
    );

    if (failed) return null;

    const first = weeks[0]?.find(Boolean);
    const last = [...weeks].reverse().flat().find(Boolean);

    return (
        <div className="gh-grid-block">
            <div className="gh-grid-header">
                <span className="mono">Commits</span>
                <span className="mono gh-grid-total">
                    {days === null
                        ? 'loading…'
                        : `${total} in the last ${WEEKS} weeks`}
                </span>
            </div>

            <a
                className="gh-grid"
                href={`${githubUrl}?tab=overview`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub contribution grid for the last ${WEEKS} weeks`}
            >
                {(days === null ? Array.from({ length: WEEKS + 1 }, () => Array(7).fill(null)) : weeks).map(
                    (week, wi) => (
                        <div key={wi} className="gh-grid-week">
                            {week.map((day, di) => (
                                <span
                                    key={di}
                                    className={`gh-grid-cell${day ? '' : ' gh-grid-cell-empty'}`}
                                    style={day ? { background: LEVEL_COLORS[Math.min(4, day.level)] } : undefined}
                                    title={day ? `${day.count} contribution${day.count === 1 ? '' : 's'} on ${formatDay(day.date)}` : undefined}
                                />
                            ))}
                        </div>
                    ),
                )}
            </a>

            <div className="gh-grid-footer mono">
                <span>{first && last ? `${formatDay(first.date)} – ${formatDay(last.date)}` : ''}</span>
                <span className="gh-grid-legend">
                    Less
                    {LEVEL_COLORS.map(color => (
                        <span key={color} className="gh-grid-cell" style={{ background: color }} />
                    ))}
                    More
                </span>
            </div>
        </div>
    );
}
