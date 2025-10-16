// Content Management System Type Definitions
// These types define the structure of all content used in the marketing pages

// ============================================================================
// Common/Shared Types
// ============================================================================

export interface Image {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Link {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'link';
  external?: boolean;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

// ============================================================================
// Hero Section Types
// ============================================================================

export interface HeroSection {
  type: 'hero';
  title: string;
  subtitle: string;
  description?: string;
  primaryCTA: Link;
  secondaryCTA?: Link;
  image?: Image;
  backgroundImage?: Image;
  badge?: {
    text: string;
    variant?: 'default' | 'success' | 'warning' | 'info';
  };
}

// ============================================================================
// Feature Section Types
// ============================================================================

export interface Feature {
  icon: string; // Icon name or URL
  title: string;
  description: string;
  link?: Link;
}

export interface FeatureSection {
  type: 'features';
  title: string;
  subtitle?: string;
  description?: string;
  features: Feature[];
  layout?: 'grid' | 'list' | 'cards';
  columns?: 2 | 3 | 4;
}

// ============================================================================
// Testimonial Section Types
// ============================================================================

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: Image;
  content: string;
  rating?: number;
  location?: string;
  date?: string;
}

export interface TestimonialSection {
  type: 'testimonials';
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  layout?: 'carousel' | 'grid' | 'masonry';
}

// ============================================================================
// Stats/Metrics Section Types
// ============================================================================

export interface Stat {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  prefix?: string;
  suffix?: string;
}

export interface StatsSection {
  type: 'stats';
  title?: string;
  subtitle?: string;
  stats: Stat[];
  variant?: 'default' | 'highlighted' | 'minimal';
}

// ============================================================================
// Call-to-Action Section Types
// ============================================================================

export interface CTASection {
  type: 'cta';
  title: string;
  description: string;
  primaryCTA: Link;
  secondaryCTA?: Link;
  image?: Image;
  variant?: 'default' | 'gradient' | 'outlined';
  backgroundImage?: Image;
}

// ============================================================================
// FAQ Section Types
// ============================================================================

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface FAQSection {
  type: 'faq';
  title: string;
  subtitle?: string;
  faqs: FAQItem[];
  categories?: string[];
}

// ============================================================================
// Pricing Section Types
// ============================================================================

export interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    period: string;
    prefix?: string;
  };
  features: PricingFeature[];
  cta: Link;
  popular?: boolean;
  badge?: string;
}

export interface PricingSection {
  type: 'pricing';
  title: string;
  subtitle?: string;
  description?: string;
  tiers: PricingTier[];
  billingToggle?: {
    monthly: string;
    annual: string;
    discount?: string;
  };
  note?: string;
}

// ============================================================================
// Benefit Section Types
// ============================================================================

export interface Benefit {
  icon: string;
  title: string;
  description: string;
  image?: Image;
}

export interface BenefitSection {
  type: 'benefits';
  title: string;
  subtitle?: string;
  description?: string;
  benefits: Benefit[];
  layout?: 'alternating' | 'grid' | 'list';
}

// ============================================================================
// How It Works Section Types
// ============================================================================

export interface Step {
  number: number;
  title: string;
  description: string;
  icon?: string;
  image?: Image;
}

export interface HowItWorksSection {
  type: 'howItWorks';
  title: string;
  subtitle?: string;
  description?: string;
  steps: Step[];
  layout?: 'vertical' | 'horizontal' | 'grid';
}

// ============================================================================
// Content Card Section Types
// ============================================================================

export interface ContentCard {
  id: string;
  title: string;
  description: string;
  image?: Image;
  icon?: string;
  link?: Link;
  tags?: string[];
}

export interface ContentCardSection {
  type: 'contentCards';
  title: string;
  subtitle?: string;
  cards: ContentCard[];
  columns?: 2 | 3 | 4;
}

// ============================================================================
// Logo Cloud Section Types
// ============================================================================

export interface Logo {
  name: string;
  image: Image;
  link?: string;
}

export interface LogoCloudSection {
  type: 'logoCloud';
  title?: string;
  subtitle?: string;
  logos: Logo[];
}

// ============================================================================
// Team Section Types
// ============================================================================

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatar: Image;
  social?: {
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface TeamSection {
  type: 'team';
  title: string;
  subtitle?: string;
  members: TeamMember[];
}

// ============================================================================
// Text Content Section Types (for legal pages)
// ============================================================================

export interface TextSection {
  type: 'text';
  title?: string;
  content: string;
  variant?: 'default' | 'legal' | 'article';
}

export interface TextBlock {
  heading?: string;
  subheading?: string;
  content: string;
  list?: string[];
  orderedList?: string[];
}

export interface LegalSection {
  type: 'legal';
  title: string;
  lastUpdated: string;
  sections: TextBlock[];
}

// ============================================================================
// Union Types for All Sections
// ============================================================================

export type ContentSection =
  | HeroSection
  | FeatureSection
  | TestimonialSection
  | StatsSection
  | CTASection
  | FAQSection
  | PricingSection
  | BenefitSection
  | HowItWorksSection
  | ContentCardSection
  | LogoCloudSection
  | TeamSection
  | TextSection
  | LegalSection;

// ============================================================================
// Page Content Types
// ============================================================================

export interface PageContent {
  metadata: SEOMetadata;
  sections: ContentSection[];
}

export interface PageConfig {
  id: string;
  path: string;
  title: string;
  description: string;
  content: PageContent;
}

// ============================================================================
// Shared/Global Content Types
// ============================================================================

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface Navigation {
  main: NavigationItem[];
  footer: {
    sections: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
    social: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
    copyright: string;
  };
}

export interface GlobalContent {
  siteName: string;
  tagline: string;
  logo: Image;
  navigation: Navigation;
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
  };
  socialMedia: Array<{
    platform: string;
    url: string;
  }>;
}
