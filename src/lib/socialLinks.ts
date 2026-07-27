import { Github, Linkedin, Twitter, GraduationCap, Mail, type LucideIcon } from 'lucide-react';

/* Single source of truth for the contact links — shared by the fixed
   social sidebar and the contact modal so the two can morph into
   each other via matching layoutIds. */

export interface SocialLinkSource {
    github?: string;
    linkedin?: string;
    twitter?: string;
    scholar?: string;
    email?: string;
}

export interface SocialLink {
    key: string;
    label: string;
    icon: LucideIcon;
    href: string;
    external: boolean;
}

const DEFINITIONS = [
    { key: 'github', label: 'GitHub', icon: Github },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { key: 'twitter', label: 'Twitter', icon: Twitter },
    { key: 'scholar', label: 'Scholar', icon: GraduationCap },
    { key: 'email', label: 'Email', icon: Mail },
] as const;

/** Shared layout id so an icon can animate between sidebar and modal. */
export function socialLayoutId(key: string): string {
    return `social-icon-${key}`;
}

export function buildSocialLinks({ github, linkedin, twitter, scholar, email }: SocialLinkSource): SocialLink[] {
    const hrefs: Record<string, string | undefined> = {
        github,
        linkedin,
        twitter,
        scholar,
        email: email ? `mailto:${email}` : undefined,
    };

    return DEFINITIONS.flatMap(def => {
        const href = hrefs[def.key];
        if (!href) return [];
        return [{ ...def, href, external: def.key !== 'email' }];
    });
}
