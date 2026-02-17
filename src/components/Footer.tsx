'use client';

interface FooterProps {
    name: string;
}

export default function Footer({ name }: FooterProps) {
    return (
        <footer
            className="section-block border-t"
            style={{ borderColor: 'var(--cream-300)', paddingTop: '2rem', paddingBottom: '2rem' }}
        >
            <div className="flex items-center justify-center">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    © {name} {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
}
