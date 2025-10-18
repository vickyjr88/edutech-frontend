/**
 * CMS Section Types
 * TypeScript interfaces for all CMS section types
 */

export interface HeroSection {
  type: 'hero';
  title: string;
  subtitle?: string;
  primaryCTA?: {
    text: string;
    href: string;
    variant?: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
    variant?: string;
  };
  variant?: string;
  backgroundImage?: string;
}

export interface ContentSection {
  type: 'content';
  title: string;
  content?: string;
  layout?: string;
}

export interface StatsSection {
  type: 'stats';
  title: string;
  subtitle?: string;
  stats?: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
}

export interface ValuesSection {
  type: 'values';
  title: string;
  subtitle?: string;
  values?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  layout?: string;
}

export interface TeamSection {
  type: 'team';
  title: string;
  subtitle?: string;
  teamMembers?: Array<{
    name: string;
    role: string;
    bio: string;
    image: string;
    linkedin?: string;
  }>;
}

export interface BenefitsSection {
  type: 'benefits';
  title: string;
  subtitle?: string;
  benefits?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  layout?: string;
}

export interface PositionsSection {
  type: 'positions';
  title: string;
  subtitle?: string;
  positions?: Array<{
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    requirements?: string[];
    link: string;
  }>;
}

export interface HiringSection {
  type: 'hiring';
  title: string;
  subtitle?: string;
  steps?: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  layout?: string;
}

export interface TestimonialsSection {
  type: 'testimonials';
  title: string;
  subtitle?: string;
  testimonials?: Array<{
    id: string;
    name: string;
    role: string;
    avatar: {
      src: string;
      alt: string;
    };
    content: string;
    rating?: number;
  }>;
}

export interface CTASection {
  type: 'cta';
  title: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
    variant?: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
    variant?: string;
  };
  variant?: string;
}

export type CMSSection =
  | HeroSection
  | ContentSection
  | StatsSection
  | ValuesSection
  | TeamSection
  | BenefitsSection
  | PositionsSection
  | HiringSection
  | TestimonialsSection
  | CTASection;
