# CMS Dynamic Page Rendering System

A comprehensive, reusable system for dynamically rendering CMS pages with various section types.

## Overview

This module provides a complete solution for creating and rendering dynamic pages from CMS content without writing custom page components. It includes:

- **Type-safe section definitions**
- **Reusable section components**
- **Dynamic page renderer**
- **Icon mapping system**
- **Automatic routing**

## Architecture

```
cms/
├── types.ts                    # TypeScript interfaces for all section types
├── iconMapper.ts               # Maps icon names to Lucide React icons
├── SectionRenderer.tsx         # Routes sections to appropriate components
├── DynamicPage.tsx            # Main dynamic page component
├── index.ts                    # Module exports
└── sections/                   # Individual section components
    ├── HeroSection.tsx
    ├── ContentSection.tsx
    ├── StatsSection.tsx
    ├── ValuesSection.tsx
    ├── TeamSection.tsx
    ├── BenefitsSection.tsx
    ├── PositionsSection.tsx
    ├── HiringSection.tsx
    ├── TestimonialsSection.tsx
    ├── CTASection.tsx
    └── index.ts
```

## Supported Section Types

### 1. Hero Section
Gradient background hero with title, subtitle, and CTAs.

```typescript
{
  type: 'hero',
  title: string,
  subtitle?: string,
  primaryCTA?: { text: string, href: string, variant?: string },
  secondaryCTA?: { text: string, href: string, variant?: string },
  variant?: string
}
```

### 2. Content Section
Rich text content with customizable layout.

```typescript
{
  type: 'content',
  title: string,
  content?: string,
  layout?: string
}
```

### 3. Stats Section
Display metrics and statistics in a grid.

```typescript
{
  type: 'stats',
  title: string,
  subtitle?: string,
  stats?: Array<{
    label: string,
    value: string,
    icon: string
  }>
}
```

### 4. Values Section
Company values or principles with icons.

```typescript
{
  type: 'values',
  title: string,
  subtitle?: string,
  values?: Array<{
    icon: string,
    title: string,
    description: string
  }>,
  layout?: string
}
```

### 5. Team Section
Team member profiles with photos and bios.

```typescript
{
  type: 'team',
  title: string,
  subtitle?: string,
  teamMembers?: Array<{
    name: string,
    role: string,
    bio: string,
    image: string,
    linkedin?: string
  }>
}
```

### 6. Benefits Section
List of benefits or features.

```typescript
{
  type: 'benefits',
  title: string,
  subtitle?: string,
  benefits?: Array<{
    icon: string,
    title: string,
    description: string
  }>,
  layout?: string
}
```

### 7. Positions Section
Job listings with requirements.

```typescript
{
  type: 'positions',
  title: string,
  subtitle?: string,
  positions?: Array<{
    title: string,
    department: string,
    location: string,
    type: string,
    description: string,
    requirements?: string[],
    link: string
  }>
}
```

### 8. Hiring Section
Multi-step hiring process.

```typescript
{
  type: 'hiring',
  title: string,
  subtitle?: string,
  steps?: Array<{
    number: number,
    title: string,
    description: string
  }>,
  layout?: string
}
```

### 9. Testimonials Section
Customer or employee testimonials with ratings.

```typescript
{
  type: 'testimonials',
  title: string,
  subtitle?: string,
  testimonials?: Array<{
    id: string,
    name: string,
    role: string,
    avatar: { src: string, alt: string },
    content: string,
    rating?: number
  }>
}
```

### 10. CTA Section
Call-to-action with gradient background.

```typescript
{
  type: 'cta',
  title: string,
  subtitle?: string,
  description?: string,
  primaryCTA?: { text: string, href: string, variant?: string },
  secondaryCTA?: { text: string, href: string, variant?: string },
  variant?: string
}
```

## Usage

### Option 1: Create a Static Page Component

```typescript
import { DynamicPage } from "@/components/cms";

const AboutUs = () => {
  return <DynamicPage slug="about-us" />;
};

export default AboutUs;
```

### Option 2: Use Dynamic Route

Any page created in the CMS is automatically accessible at `/page/:slug`:

- `/page/terms-of-service`
- `/page/contact-us`
- `/page/blog-post-title`

### Option 3: Use in Admin Routes

Add a route in `AppRoutes.tsx`:

```typescript
<Route path="/my-custom-page" element={<DynamicPage slug="my-custom-page" />} />
```

## Creating New Section Types

1. **Define Type** in `types.ts`:
```typescript
export interface MySectionType {
  type: 'mySection';
  title: string;
  // ... other fields
}

// Add to union type
export type CMSSection =
  | HeroSection
  | ContentSection
  | MySectionType;  // Add here
```

2. **Create Component** in `sections/MySection.tsx`:
```typescript
import type { MySectionType } from "../types";

interface MySectionProps {
  section: MySectionType;
}

export const MySection = ({ section }: MySectionProps) => {
  return (
    <section className="py-16 bg-white">
      <h2>{section.title}</h2>
      {/* Your custom rendering */}
    </section>
  );
};
```

3. **Register in Renderer** in `SectionRenderer.tsx`:
```typescript
case 'mySection':
  return <MySection section={section} />;
```

4. **Export from Index** in `sections/index.ts`:
```typescript
export { MySection } from './MySection';
```

## Icon System

Icons are mapped from string names to Lucide React components:

```typescript
import { getIcon } from "@/components/cms/iconMapper";

const Icon = getIcon("Users"); // Returns Users component from lucide-react
```

### Available Icons

See `iconMapper.ts` for the complete list. Common icons include:
- Users, GraduationCap, Globe, Clock
- Target, Heart, Shield, Lightbulb, Award
- Briefcase, TrendingUp, Coins, MapPin
- And 40+ more...

## Design System

All sections follow the Kidato design system:

- **Primary Color**: `kidato-purple`
- **Secondary Color**: `kidato-orange`
- **Background**: `kidato-light-blue`
- **Gradients**: `from-kidato-purple to-blue-700`

## Best Practices

1. **Type Safety**: Always use TypeScript interfaces for section data
2. **Responsive Design**: All sections are mobile-responsive by default
3. **Loading States**: DynamicPage handles loading and error states
4. **SEO**: Set proper metadata in CMS page settings
5. **Performance**: Sections lazy-load and are optimized for speed

## Example: Complete Page Creation

1. Create page in CMS admin:
```json
{
  "slug": "our-story",
  "metadata": {
    "title": "Our Story - Company Name",
    "description": "Learn about our journey"
  },
  "sections": [
    {
      "type": "hero",
      "title": "Our Story",
      "subtitle": "How we started"
    },
    {
      "type": "content",
      "title": "The Beginning",
      "content": "We started in 2020..."
    },
    {
      "type": "cta",
      "title": "Join Us",
      "primaryCTA": {
        "text": "Get Started",
        "href": "/signup"
      }
    }
  ]
}
```

2. Access automatically at `/page/our-story` or create dedicated route:
```typescript
<Route path="/our-story" element={<DynamicPage slug="our-story" />} />
```

## Troubleshooting

### Page not loading?
- Check if page exists in CMS
- Verify page is published
- Check browser console for errors
- Ensure slug matches exactly

### Section not rendering?
- Verify section type is registered in SectionRenderer
- Check section data structure matches TypeScript interface
- Look for console warnings about unknown section types

### Icons not showing?
- Check icon name spelling in CMS data
- Verify icon exists in iconMapper.ts
- Fallback icon (Users) will show if icon not found
