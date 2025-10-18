# Marketing CMS Implementation Plan
## Learniverse-Kidato Platform

**Version:** 1.0
**Date:** 2025-10-16
**Status:** Planning Phase

---

## Executive Summary

This document outlines a comprehensive plan to implement a Content Management System (CMS) for all marketing content on the Learniverse-Kidato platform. Currently, 100% of marketing content is hardcoded across 8 pages and 18+ components. This plan breaks down the implementation into manageable phases and content modules.

### Current State
- **8 Marketing Pages** with hardcoded content
- **18+ Reusable Components** with embedded data
- **Zero Content Management** - all updates require code changes
- **Duplicate Content** across multiple pages

### Target State
- **Centralized Content Management** for all marketing material
- **No-Code Updates** for marketing team
- **Version Control** and content preview
- **Multi-language Support** (future-ready)
- **SEO Management** built-in

---

## Table of Contents

1. [Content Inventory](#1-content-inventory)
2. [CMS Architecture](#2-cms-architecture)
3. [Content Schema Design](#3-content-schema-design)
4. [Implementation Phases](#4-implementation-phases)
5. [Technical Stack](#5-technical-stack)
6. [File Structure](#6-file-structure)
7. [API Design](#7-api-design)
8. [Migration Strategy](#8-migration-strategy)
9. [Timeline & Resources](#9-timeline--resources)

---

## 1. Content Inventory

### 1.1 Marketing Pages (8 Total)

| Page | Priority | Complexity | Content Sections |
|------|----------|------------|------------------|
| Index (Homepage) | P0 - Critical | High | Hero, Features, How It Works, Roles, Testimonials, CTA |
| For Parents | P0 - Critical | High | Hero, Benefits, Steps, Packages, Testimonials, Pricing, FAQ, CTA |
| For Teachers | P0 - Critical | High | Hero, Benefits, Earnings, Steps, Requirements, Testimonials, CTA |
| For Students | P1 - High | Medium | Hero, Benefits, Classes, Steps, Needs, Testimonials, FAQ, CTA |
| How It Works | P1 - High | Medium | Hero, Overview, Process Flows, Features, Tech, FAQ, CTA |
| Teachers Pricing | P1 - High | Medium | Hero, Pricing Tiers, Calculator, FAQ, CTA |
| Privacy Policy | P2 - Medium | Low | Legal Sections (12) |
| Terms & Conditions | P2 - Medium | Low | Legal Sections (12) |

### 1.2 Content Modules (Reusable Components)

#### Core Content Types
1. **Hero Sections** (6 variations)
2. **Feature/Benefits Cards** (15+ unique sets)
3. **Testimonials** (9 unique testimonials across roles)
4. **How It Works Steps** (4 variations by role)
5. **Pricing Tables** (2 types: parents, teachers)
6. **FAQ Sections** (5 unique sets)
7. **Call-to-Action Blocks** (8+ variations)
8. **Class/Teacher Cards** (4 featured classes, 4 teachers)
9. **Statistics/Metrics** (embedded in multiple sections)
10. **Legal Content** (24 sections total)

### 1.3 Navigation & Footer
- **Navbar Links** (8 links + CTAs)
- **Footer** (4 sections: Platform, Company, Legal, Social)

---

## 2. CMS Architecture

### 2.1 Recommended Approach: Hybrid CMS

**Phase 1: Frontend CMS (Quick Win)**
- JSON/TypeScript-based content files
- Git-based versioning
- Deploy via CI/CD
- No backend changes needed

**Phase 2: Headless CMS (Scale)**
- Backend API for content
- Admin dashboard for non-technical users
- Real-time updates without deployment
- Multi-user editing with permissions

### 2.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CONTENT LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  Phase 1: Static JSON Files                                 │
│  └── /src/content/                                          │
│      ├── pages/                                             │
│      ├── modules/                                           │
│      └── global/                                            │
│                                                              │
│  Phase 2: Headless CMS Backend                             │
│  └── MongoDB Collections                                    │
│      ├── marketing_pages                                    │
│      ├── content_modules                                    │
│      └── global_settings                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   CONTENT API LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Phase 1: Content Service (Frontend)                        │
│  └── useContent() hook → loads JSON                         │
│                                                              │
│  Phase 2: REST/GraphQL API (Backend)                        │
│  └── GET /api/content/:pageId                              │
│  └── GET /api/content/modules/:moduleId                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  React Components (Already Built)                           │
│  └── Consume content via props instead of hardcoded data    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Content Schema Design

### 3.1 Global Settings Schema

```typescript
interface GlobalSettings {
  id: string;
  siteTitle: string;
  tagline: string;
  logo: {
    light: string; // URL
    dark: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo: {
    defaultMetaDescription: string;
    defaultKeywords: string[];
    ogImage: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  updatedAt: Date;
  updatedBy: string;
}
```

### 3.2 Page Schema

```typescript
interface MarketingPage {
  id: string;
  slug: string; // 'home', 'for-parents', 'for-teachers', etc.
  title: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  sections: PageSection[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

interface PageSection {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  content: HeroSection | FeatureSection | TestimonialSection | /* ... */;
}

type SectionType =
  | 'hero'
  | 'features'
  | 'benefits'
  | 'how-it-works'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'classes'
  | 'teachers'
  | 'legal-content';
```

### 3.3 Hero Section Schema

```typescript
interface HeroSection {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage?: string;
  backgroundGradient?: {
    from: string;
    to: string;
  };
  primaryCTA: {
    text: string;
    link: string;
    variant: 'primary' | 'secondary' | 'outline';
  };
  secondaryCTA?: {
    text: string;
    link: string;
    variant: 'primary' | 'secondary' | 'outline';
  };
  mediaType: 'image' | 'video' | 'dashboard-mockup' | 'none';
  mediaUrl?: string;
  statistics?: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
}
```

### 3.4 Features/Benefits Section Schema

```typescript
interface FeatureSection {
  sectionTitle?: string;
  sectionSubtitle?: string;
  layout: 'grid' | 'list' | 'carousel';
  columns: 2 | 3 | 4;
  features: Feature[];
}

interface Feature {
  id: string;
  icon: string; // Lucide icon name or custom SVG
  title: string;
  description: string;
  image?: string;
  link?: {
    text: string;
    url: string;
  };
}
```

### 3.5 Testimonials Section Schema

```typescript
interface TestimonialSection {
  sectionTitle?: string;
  layout: 'grid' | 'carousel' | 'masonry';
  testimonials: Testimonial[];
}

interface Testimonial {
  id: string;
  quote: string;
  author: {
    name: string;
    role: 'parent' | 'teacher' | 'student';
    location?: string;
    avatar?: string;
    age?: number; // For students
  };
  rating?: number; // 1-5
  featured: boolean;
  displayOrder: number;
}
```

### 3.6 How It Works Section Schema

```typescript
interface HowItWorksSection {
  sectionTitle?: string;
  sectionSubtitle?: string;
  roleSpecific: boolean; // If true, show tabs for different roles
  steps: Step[];
}

interface Step {
  stepNumber: number;
  role?: 'parent' | 'teacher' | 'student' | 'all';
  title: string;
  description: string;
  icon?: string;
  image?: string;
}
```

### 3.7 Pricing Section Schema

```typescript
interface PricingSection {
  sectionTitle?: string;
  sectionSubtitle?: string;
  targetAudience: 'parents' | 'teachers';
  plans: PricingPlan[];
  comparisonTable?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    period: 'month' | 'year' | 'class' | 'one-time';
    displayText?: string; // e.g., "$23-29/month"
  };
  features: string[];
  cta: {
    text: string;
    link: string;
    variant: 'primary' | 'secondary' | 'outline';
  };
  featured: boolean;
  badge?: string; // "Most Popular", "Best Value", etc.
}
```

### 3.8 FAQ Section Schema

```typescript
interface FAQSection {
  sectionTitle?: string;
  category?: string; // 'parents', 'teachers', 'students', 'general'
  faqs: FAQ[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string; // Supports markdown
  category: string;
  order: number;
}
```

### 3.9 CTA Section Schema

```typescript
interface CTASection {
  title: string;
  description?: string;
  backgroundType: 'gradient' | 'image' | 'solid';
  backgroundValue: string;
  primaryCTA: {
    text: string;
    link: string;
    variant: 'primary' | 'secondary' | 'outline';
  };
  secondaryCTA?: {
    text: string;
    link: string;
    variant: 'primary' | 'secondary' | 'outline';
  };
}
```

### 3.10 Class/Teacher Card Schema

```typescript
interface ClassCard {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel?: string;
  image: string;
  teacher: {
    name: string;
    avatar: string;
  };
  rating: number;
  studentsEnrolled: number;
  price?: {
    amount: number;
    currency: string;
    period: string;
  };
  featured: boolean;
}

interface TeacherCard {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  subjects: string[];
  rating: number;
  totalStudents: number;
  yearsExperience: number;
  location: string;
  featured: boolean;
}
```

### 3.11 Legal Content Schema

```typescript
interface LegalContent {
  id: string;
  type: 'privacy-policy' | 'terms-and-conditions';
  title: string;
  effectiveDate: Date;
  lastUpdated: Date;
  sections: LegalSection[];
}

interface LegalSection {
  id: string;
  sectionNumber: string; // "1", "1.1", "1.1.1"
  title: string;
  content: string; // Supports markdown
  subsections?: LegalSection[];
}
```

---

## 4. Implementation Phases

### Phase 1: Foundation & Quick Wins (Weeks 1-2)
**Goal:** Move from hardcoded to file-based content management

#### 1.1 Setup Content Infrastructure
- [ ] Create `/src/content/` directory structure
- [ ] Define TypeScript interfaces/types for all schemas
- [ ] Create content service utility (`useContent` hook)
- [ ] Setup content validation with Zod

#### 1.2 Migrate High-Priority Content
- [ ] Homepage (Index.tsx)
  - [ ] Hero section → JSON
  - [ ] Features → JSON
  - [ ] Testimonials → JSON
  - [ ] CTA → JSON
- [ ] For Parents page
  - [ ] All sections → JSON
- [ ] For Teachers page
  - [ ] All sections → JSON

#### 1.3 Create Content Components (Refactor)
- [ ] Refactor `Hero.tsx` to consume props instead of hardcoded data
- [ ] Refactor `Features.tsx` to accept content via props
- [ ] Refactor `Testimonials.tsx` to accept content via props
- [ ] Create generic section renderer component

**Deliverables:**
- Working content management for 3 critical pages
- Reusable content service
- Documentation for content editing

---

### Phase 2: Complete Frontend Migration (Weeks 3-4)
**Goal:** All marketing content managed via JSON files

#### 2.1 Migrate Remaining Pages
- [ ] For Students page
- [ ] How It Works page
- [ ] Teachers Pricing page
- [ ] Privacy Policy
- [ ] Terms & Conditions

#### 2.2 Global Content
- [ ] Navigation/Navbar links
- [ ] Footer content
- [ ] Global settings (site title, social links, contact)
- [ ] SEO defaults

#### 2.3 Content Preview System
- [ ] Build content preview component
- [ ] Add content version control (git-based)
- [ ] Create content validation CLI tool

**Deliverables:**
- 100% of marketing content in JSON files
- No hardcoded strings in components
- Content preview capability

---

### Phase 3: Backend CMS (Weeks 5-8)
**Goal:** Database-backed CMS with admin interface

#### 3.1 Backend API Development
- [ ] Create MongoDB schemas/models
- [ ] Build REST API endpoints
  - [ ] `GET /api/content/pages/:slug`
  - [ ] `GET /api/content/modules/:type`
  - [ ] `POST /api/content/pages` (auth required)
  - [ ] `PUT /api/content/pages/:id` (auth required)
  - [ ] `DELETE /api/content/pages/:id` (auth required)
- [ ] Implement caching layer (Redis)
- [ ] Add version history tracking

#### 3.2 Admin Dashboard
- [ ] Build admin routes `/admin/content`
- [ ] Page list view with search/filter
- [ ] Page editor with live preview
- [ ] Section builder (drag-and-drop)
- [ ] Media library for images
- [ ] User permissions (admin, editor, viewer)

#### 3.3 Content Migration Tool
- [ ] Build script to migrate JSON → Database
- [ ] Bulk import/export functionality
- [ ] Content validation on save

**Deliverables:**
- Full-featured CMS backend
- Admin dashboard for content management
- Content API with caching

---

### Phase 4: Advanced Features (Weeks 9-12)
**Goal:** Production-ready CMS with advanced capabilities

#### 4.1 Multi-language Support (i18n)
- [ ] Add language field to all content schemas
- [ ] Build language switcher UI
- [ ] Content translation workflow
- [ ] Fallback content strategy

#### 4.2 SEO Enhancements
- [ ] Per-page meta tags management
- [ ] Open Graph tags
- [ ] Structured data (Schema.org)
- [ ] Sitemap generation
- [ ] Robots.txt management

#### 4.3 Analytics & Optimization
- [ ] Content performance tracking
- [ ] A/B testing framework
- [ ] Content scheduling (publish/unpublish dates)
- [ ] Draft/review/publish workflow

#### 4.4 Media Management
- [ ] Cloud storage integration (S3/CloudFlare)
- [ ] Image optimization pipeline
- [ ] CDN integration
- [ ] Alt text and accessibility

**Deliverables:**
- Production-ready CMS
- Multi-language support
- Advanced SEO features
- Analytics dashboard

---

## 5. Technical Stack

### 5.1 Phase 1 (Frontend CMS)
```typescript
{
  "content-storage": "JSON files in /src/content/",
  "validation": "Zod schemas",
  "versioning": "Git",
  "deployment": "Vercel/Netlify (existing)",
  "content-service": "Custom React hooks"
}
```

### 5.2 Phase 2 (Backend CMS)
```typescript
{
  "backend": {
    "framework": "Express.js (existing API)",
    "database": "MongoDB (existing)",
    "orm": "Mongoose",
    "cache": "Redis (optional)",
    "storage": "AWS S3 / Cloudflare R2"
  },
  "admin-ui": {
    "framework": "React (same codebase)",
    "editor": "Lexical / Tiptap (rich text)",
    "form-builder": "React Hook Form",
    "drag-drop": "dnd-kit",
    "ui-library": "Shadcn/ui (existing)"
  },
  "api": {
    "style": "REST",
    "docs": "OpenAPI/Swagger",
    "auth": "Ory (existing)"
  }
}
```

### 5.3 Optional: Headless CMS Solutions
**Alternative to building custom backend:**

| Solution | Pros | Cons | Cost |
|----------|------|------|------|
| **Strapi** | Self-hosted, Open source, Full control | Setup overhead | Free |
| **Sanity.io** | Great DX, Real-time, Studio UI | Learning curve | $0-199/mo |
| **Contentful** | Mature, Enterprise-ready | Expensive at scale | $0-489/mo |
| **Payload CMS** | Code-first, TypeScript, Self-hosted | Newer, smaller community | Free |

**Recommendation:** Build custom Phase 1, evaluate Strapi/Payload for Phase 2

---

## 6. File Structure

```
learniverse-kidato/
├── src/
│   ├── content/                          # Phase 1: Static content files
│   │   ├── pages/
│   │   │   ├── home.json
│   │   │   ├── for-parents.json
│   │   │   ├── for-teachers.json
│   │   │   ├── for-students.json
│   │   │   ├── how-it-works.json
│   │   │   ├── teacher-pricing.json
│   │   │   ├── privacy-policy.json
│   │   │   └── terms-conditions.json
│   │   ├── modules/
│   │   │   ├── testimonials.json        # Shared testimonials
│   │   │   ├── teachers.json            # Featured teachers
│   │   │   ├── classes.json             # Popular classes
│   │   │   └── faqs.json                # FAQ collections
│   │   ├── global/
│   │   │   ├── settings.json            # Site settings
│   │   │   ├── navigation.json          # Navbar/Footer
│   │   │   └── seo.json                 # Default SEO settings
│   │   └── schemas/
│   │       ├── page.schema.ts
│   │       ├── hero.schema.ts
│   │       ├── feature.schema.ts
│   │       └── ...
│   ├── services/
│   │   └── content/
│   │       ├── contentService.ts        # Load content from JSON/API
│   │       ├── useContent.ts            # React hook
│   │       └── validateContent.ts       # Zod validation
│   ├── components/
│   │   ├── cms/                         # Phase 2: CMS Admin UI
│   │   │   ├── admin/
│   │   │   │   ├── ContentDashboard.tsx
│   │   │   │   ├── PageEditor.tsx
│   │   │   │   ├── SectionBuilder.tsx
│   │   │   │   └── MediaLibrary.tsx
│   │   │   └── renderers/
│   │   │       ├── HeroRenderer.tsx
│   │   │       ├── FeatureRenderer.tsx
│   │   │       └── ...
│   │   └── landing/                     # Existing components (refactored)
│   │       ├── Hero.tsx                 # Now accepts content props
│   │       ├── Features.tsx             # Now accepts content props
│   │       └── ...
│   └── pages/
│       ├── admin/
│       │   └── content/
│       │       ├── index.tsx            # Content list
│       │       └── [slug].tsx           # Page editor
│       └── ...
├── kidato-api/                          # Backend API
│   └── src/
│       ├── content/
│       │   ├── models/
│       │   │   ├── page.model.ts
│       │   │   ├── module.model.ts
│       │   │   └── settings.model.ts
│       │   ├── controllers/
│       │   │   └── content.controller.ts
│       │   ├── routes/
│       │   │   └── content.routes.ts
│       │   └── services/
│       │       └── content.service.ts
│       └── ...
└── scripts/
    ├── migrate-content.ts               # Migrate hardcoded → JSON
    ├── validate-content.ts              # Validate all content files
    └── import-content.ts                # Import JSON → Database
```

---

## 7. API Design

### 7.1 Content API Endpoints (Phase 2)

#### Get Page Content
```http
GET /api/v1/content/pages/:slug
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "home",
    "slug": "home",
    "title": "Home - Learniverse Kidato",
    "metaDescription": "...",
    "sections": [
      {
        "id": "hero-1",
        "type": "hero",
        "order": 1,
        "visible": true,
        "content": {
          "title": "Learn, Connect, and Grow...",
          // ... full hero content
        }
      }
    ]
  }
}
```

#### List All Pages
```http
GET /api/v1/content/pages?status=published&limit=20&offset=0
```

#### Create/Update Page (Admin)
```http
POST   /api/v1/content/pages
PUT    /api/v1/content/pages/:id
DELETE /api/v1/content/pages/:id
```

#### Get Shared Modules
```http
GET /api/v1/content/modules/testimonials
GET /api/v1/content/modules/teachers
GET /api/v1/content/modules/classes
```

#### Global Settings
```http
GET /api/v1/content/settings
PUT /api/v1/content/settings (Admin only)
```

### 7.2 Caching Strategy
- **Cache Duration:** 5 minutes for published content
- **Invalidation:** On content update via admin
- **Strategy:** Redis cache → Database fallback

---

## 8. Migration Strategy

### 8.1 Content Extraction Script

```typescript
// scripts/extract-content.ts
/**
 * Extracts hardcoded content from React components
 * and generates JSON content files
 */
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import fs from 'fs';

async function extractContentFromComponent(filePath: string) {
  // Parse React component
  // Extract arrays, objects, strings
  // Generate JSON file
  // Create TypeScript types
}

// Run for all marketing components
const components = [
  'src/pages/Index.tsx',
  'src/pages/ForParents.tsx',
  // ...
];

components.forEach(extractContentFromComponent);
```

### 8.2 Migration Checklist

#### Pre-Migration
- [ ] Audit all existing content
- [ ] Define schemas for all content types
- [ ] Create content validation rules
- [ ] Setup content backup strategy

#### Migration Steps
1. **Extract** → Run extraction script on components
2. **Validate** → Run content validation
3. **Review** → Manual review of generated JSON
4. **Refactor** → Update components to consume JSON
5. **Test** → Verify all pages render correctly
6. **Deploy** → Gradual rollout (page by page)

#### Post-Migration
- [ ] Delete hardcoded content from components
- [ ] Update documentation
- [ ] Train team on content editing
- [ ] Setup CI/CD for content validation

---

## 9. Timeline & Resources

### 9.1 Estimated Timeline

| Phase | Duration | Team Size | Key Milestones |
|-------|----------|-----------|----------------|
| **Phase 1: Foundation** | 2 weeks | 1-2 devs | 3 pages migrated, content service working |
| **Phase 2: Frontend CMS** | 2 weeks | 1-2 devs | All pages migrated, JSON-based |
| **Phase 3: Backend CMS** | 4 weeks | 2 devs | API + Admin dashboard |
| **Phase 4: Advanced** | 4 weeks | 2 devs | i18n, SEO, Analytics |
| **Total** | **12 weeks** | **1-2 devs** | Full production CMS |

### 9.2 Resource Requirements

**Development Team:**
- 1 Senior Full-Stack Developer (Lead)
- 1 Frontend Developer (Phase 1-2)
- 1 Backend Developer (Phase 3-4, optional)

**Tools & Services:**
- MongoDB (existing)
- Redis (optional, ~$10/mo)
- AWS S3 or Cloudflare R2 (~$5-20/mo)
- Staging environment

**Budget Estimate:**
- **Phase 1-2 (Free):** No additional costs
- **Phase 3-4:** $15-50/month for infrastructure

---

## 10. Success Metrics

### 10.1 Technical Metrics
- [ ] **Zero hardcoded content** in components
- [ ] **100% content coverage** - all marketing pages managed via CMS
- [ ] **API response time** < 200ms (cached)
- [ ] **Content validation** - 100% of content passes schema validation

### 10.2 Business Metrics
- [ ] **Content update speed** - Marketing team can update content in < 5 minutes
- [ ] **No-code updates** - 0 developer hours needed for content changes
- [ ] **SEO improvement** - Easier to manage meta tags, improve rankings
- [ ] **Deployment frequency** - Reduce deployments by 50% (content-only changes)

### 10.3 User Experience Metrics
- [ ] **Page load time** - No regression in performance
- [ ] **Content consistency** - Shared modules ensure brand consistency
- [ ] **Multi-language readiness** - Structure supports i18n

---

## 11. Next Steps

### Immediate Actions (Week 1)
1. **Review & Approve Plan** - Stakeholder sign-off
2. **Setup Content Repository** - Create `/src/content/` structure
3. **Define Schemas** - Finalize TypeScript interfaces
4. **Start Phase 1** - Begin with Homepage migration

### Quick Win Target
**Goal:** Migrate Homepage to JSON in 3-5 days to demonstrate value

**Steps:**
1. Create `home.json` with hero, features, testimonials
2. Refactor `Index.tsx` to load from JSON
3. Demo to team - show how easy it is to edit
4. Get feedback, iterate

---

## Appendix A: Content Type Reference

### All Section Types
1. `hero` - Hero sections with CTA
2. `features` - Feature/benefit cards
3. `how-it-works` - Step-by-step processes
4. `testimonials` - User testimonials
5. `pricing` - Pricing tables/plans
6. `faq` - Frequently asked questions
7. `cta` - Call-to-action blocks
8. `classes` - Featured class cards
9. `teachers` - Featured teacher profiles
10. `statistics` - Metrics/numbers
11. `legal-content` - Terms/Privacy sections
12. `benefits` - Benefit cards
13. `requirements` - Requirement lists
14. `process-flow` - Multi-step processes

### Content Count Summary
- **8 Pages** to manage
- **14 Section Types** to support
- **~50 Unique Content Pieces** across all pages
- **9 Testimonials** (parents, teachers, students)
- **4 Featured Teachers**
- **4 Featured Classes**
- **20+ FAQ Items**

---

## Appendix B: Content Governance

### Roles & Permissions (Phase 3+)
- **Admin** - Full access, can publish
- **Editor** - Can create/edit drafts
- **Viewer** - Read-only access

### Content Workflow
1. **Draft** - Content being created/edited
2. **Review** - Ready for review
3. **Approved** - Approved for publishing
4. **Published** - Live on website
5. **Archived** - Historical content

### Version Control
- **Git-based** (Phase 1-2) - All changes tracked in Git
- **Database History** (Phase 3+) - Version table with diffs
- **Rollback** - Ability to restore previous versions

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-16 | CMS Planning Team | Initial plan created |

---

**END OF DOCUMENT**
