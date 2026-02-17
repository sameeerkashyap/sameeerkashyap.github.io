'use client';

interface FooterProps {
    name: string;
    email: string;
}

export default function Footer({ name, email }: FooterProps) {
    return (
        <footer
            className="section-block border-t"
            style={{ borderColor: 'var(--cream-300)', paddingTop: '2rem', paddingBottom: '2rem' }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        Built with Next.js, Three.js & curiosity.
                    </p>
                </div>
                <a
                    href={`mailto:${email}`}
                    className="link-hover text-xs"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    {email}
                </a>
            </div>
        </footer>
    );
}
