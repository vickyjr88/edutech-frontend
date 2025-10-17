/**
 * Section Renderer Component
 * Dynamically renders CMS sections based on their type
 */

import type { CMSSection } from './types';
import {
  HeroSection,
  ContentSection,
  StatsSection,
  ValuesSection,
  TeamSection,
  BenefitsSection,
  PositionsSection,
  HiringSection,
  TestimonialsSection,
  CTASection,
} from './sections';

interface SectionRendererProps {
  section: CMSSection;
  index: number;
}

export const SectionRenderer = ({ section, index }: SectionRendererProps) => {
  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} />;

    case 'content':
      return <ContentSection section={section} index={index} />;

    case 'stats':
      return <StatsSection section={section} />;

    case 'values':
      return <ValuesSection section={section} />;

    case 'team':
      return <TeamSection section={section} />;

    case 'benefits':
      return <BenefitsSection section={section} />;

    case 'positions':
      return <PositionsSection section={section} />;

    case 'hiring':
      return <HiringSection section={section} />;

    case 'testimonials':
      return <TestimonialsSection section={section} />;

    case 'cta':
      return <CTASection section={section} />;

    default:
      console.warn(`Unknown section type: ${(section as any).type}`);
      return null;
  }
};
