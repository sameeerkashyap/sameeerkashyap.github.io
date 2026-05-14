export interface Education {
    degree: string;
    institution: string;
    location: string;
    period: string;
}

export interface Skills {
    languages: string[];
    ai: string[];
    frontend: string[];
    backend: string[];
    databases: string[];
    infrastructure: string[];
}

export interface ResearchExperience {
    title: string;
    institution: string;
    location: string;
    period: string;
    startDate?: string;
    endDate?: string;
    description: string;
    detailedDescription?: string;
    highlights?: string[];
    tags: string[];
}

export interface WorkExperience {
    title: string;
    company: string;
    location: string;
    period: string;
    startDate?: string;
    endDate?: string;
    description: string;
    detailedDescription?: string;
    highlights: string[];
    tags: string[];
}

export interface Publication {
    title: string;
    venue: string;
    status: string;
    year: number;
    link?: string;
}

export interface Project {
    title: string;
    description: string;
    tags: string[];
    link: string;
}

export interface CurrentWork {
    title: string;
    description: string;
    concept: string;
    progress: string;
    reading: string[];
    tags: string[];
}

export interface BlogPost {
    title: string;
    date: string;
    excerpt: string;
    link: string;
}

export interface RecommendedReading {
    title: string;
    author: string;
    description: string;
    link?: string;
}

export interface PersonalImage {
    src: string;
    alt: string;
}

export interface PortfolioConfig {
    name: string;
    tagline: string;
    location: string;
    email: string;
    github: string;
    linkedin: string;
    twitter: string;
    scholar: string;
    education: Education[];
    skills: Skills;
    researchInterests: string[];
    about: string;
    currentWork: CurrentWork;
    researchExperience: ResearchExperience[];
    workExperience: WorkExperience[];
    publications: Publication[];
    projects: Project[];
    blog: BlogPost[];
    recommendedReading: RecommendedReading[];
    personalInterests: string[];
    personalImages: PersonalImage[];
    stickyBanner?: string;
    stickyBannerLink?: string;
}
