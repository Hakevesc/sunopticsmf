# SunOptics Specialty Eye Care Clinic & Eyewear Shop
## Full Website Implementation Guide — Premium Edition

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Design System — Premium Essilor-Inspired](#4-design-system--premium-essilor-inspired)
5. [Database Schema (Supabase)](#5-database-schema-supabase)
6. [Environment Setup](#6-environment-setup)
7. [Page-by-Page Implementation](#7-page-by-page-implementation)
8. [Booking System](#8-booking-system)
9. [Admin Panel](#9-admin-panel)
10. [Language Switching (EN / Amharic)](#10-language-switching-en--amharic)
11. [Google Reviews Integration](#11-google-reviews-integration)
12. [Premium Animation & Interaction System](#12-premium-animation--interaction-system)
13. [Performance & Accessibility](#13-performance--accessibility)
14. [SEO Strategy](#14-seo-strategy)
15. [Deployment](#15-deployment)
16. [Git & Version Control](#16-git--version-control)
17. [Final Checklist](#17-final-checklist)

---

## 1. Project Overview

**Client:** Samvision Speciality Eye Clinic & Optical Works — Sun Optics Meskel Flower Branch  
**Purpose:** A world-class optical clinic website that rivals global brands like Essilor.com — featuring online booking, premium product showcases, editorial storytelling, and admin management.  
**Design Reference:** [Essilor.com](https://www.essilor.com) — cinematic hero banners, editorial-grade photography, sophisticated typography hierarchy, immersive scroll-driven animations, brand sub-navigation, and storytelling-first product pages.  
**Languages:** English + Amharic  
**Primary Color:** Vibrant Sky Blue `#1A9CD8` + Charcoal Black `#1F2421`

### 1.1 Key Design Principles Learned from Essilor.com

| Essilor Pattern | Our Adaptation |
|---|---|
| **Dynamic Hero Carousel** with auto-sliding product banners, brand logos overlaid, cinematic photography | Full-viewport hero slider with Ken Burns zoom, brand tagline animations, gradient overlays |
| **Brand Sub-Navigation** — sticky product-level nav (Explore / Technology / FAQ tabs) | Sticky section navigation on Services and Products pages |
| **Benefits Summary Blocks** — icon + bold title + short description in 3-column row | "What We Offer" section redesigned as Essilor-style benefits strip |
| **Editorial Split Sections** — 50/50 image + text with large headlines, brand storytelling | About/Services pages use asymmetric image-text layouts with scroll-triggered reveals |
| **Product Brand Pages** — each product line (Stellest, Varilux, Crizal) gets a dedicated landing page with its own hero, logo, and CTA | Each glass category gets a mini brand page with lifestyle photography |
| **Store Locator CTA** — persistent "Find an eyecare professional" CTA in hero and floating | Persistent "Book Appointment" CTA as floating pill button on scroll |
| **Subtle UI Chrome** — ultra-thin borders, monochromatic badges, muted footers, generous whitespace | Adopt same minimal chrome — no heavy borders, use light dividers and ample spacing |
| **Disclaimer System** — footnotes with superscript links to bottom-of-page disclaimer block | Add a similar system for any medical/optical claims |

---

## 2. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR, routing, performance, image optimization |
| Styling | **Tailwind CSS** + CSS Custom Properties | Rapid theming, responsive, design tokens |
| UI Components | **shadcn/ui** | Accessible, customizable, radix-based |
| Database | **Supabase** (PostgreSQL) | Auth, DB, realtime, storage |
| ORM | **Supabase JS Client** | Direct Supabase queries |
| i18n | **next-intl** | English + Amharic routing |
| Forms | **React Hook Form + Zod** | Type-safe validation |
| Date Picker | **React Day Picker** | Booking calendar |
| Animations | **Framer Motion** | Scroll-triggered, page transitions, micro-interactions |
| Carousel | **Embla Carousel** | Lightweight, touch-friendly hero slider |
| Export | **xlsx (SheetJS)** | Excel export for admin |
| Fonts | **Google Fonts: Inter + Noto Sans Ethiopic** | Premium Latin + Bilingual support |
| Icons | **Lucide React** | Consistent icons |
| Image Optimization | **Next.js Image + Supabase Storage CDN** | Automatic WebP/AVIF, lazy loading |
| Deployment | **Vercel** | Next.js native host, edge functions |

### 2.1 Additional Recommended Packages

```bash
# Animation & interaction
npm install framer-motion
npm install embla-carousel-react embla-carousel-autoplay

# Premium UI additions
npm install @radix-ui/react-scroll-area    # Custom scrollbars
npm install @radix-ui/react-tooltip        # Hover tooltips
npm install @radix-ui/react-accordion      # FAQ sections
npm install sonner                         # Toast notifications (premium style)

# Image handling
npm install sharp                          # Server-side image processing
npm install react-medium-image-zoom        # Click-to-zoom product images

# Analytics (optional but recommended)
npm install @vercel/analytics
npm install @vercel/speed-insights
```

---

## 3. Project Structure

```
sunopticsmf/
├── app/
│   ├── [locale]/                    # i18n routing (en / am)
│   │   ├── layout.tsx               # Root locale layout with Navbar + Footer
│   │   ├── page.tsx                 # Homepage
│   │   ├── about/
│   │   │   └── page.tsx             # About / Our Story page
│   │   ├── services/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx             # Products overview with two-tier filtering
│   │   │   └── [category]/
│   │   │       └── page.tsx         # Category brand page (Essilor-style)
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   └── book/
│   │       └── page.tsx             # Booking page
│   ├── admin/                       # Admin panel (no locale)
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── login/page.tsx
│   │   ├── bookings/page.tsx
│   │   ├── products/page.tsx        # Admin products manager with Lens Category & Needs
│   │   └── services/page.tsx
│   └── api/
│       ├── bookings/route.ts
│       ├── reviews/route.ts
│       └── admin/route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── FloatingCTA.tsx          # Persistent booking CTA
│   │   └── PageTransition.tsx       # Framer Motion page wrapper
│   ├── home/
│   │   ├── HeroCarousel.tsx         # Essilor-style dynamic hero
│   │   ├── BenefitsStrip.tsx        # 3-icon benefits row
│   │   ├── EditorialSplit.tsx       # 50/50 image + text section
│   │   ├── StatsCounter.tsx         # Animated stats (years, patients, etc.)
│   │   ├── TestimonialsCarousel.tsx  # Auto-sliding review carousel
│   │   └── CTABanner.tsx            # Full-width call-to-action banner
│   ├── services/
│   │   ├── ServiceHero.tsx
│   │   ├── ServiceCard.tsx
│   │   └── ServiceDetail.tsx
│   ├── products/
│   │   ├── ProductHero.tsx
│   │   ├── CategoryNavStrip.tsx     # Horizontal pill nav for categories
│   │   ├── GlassesGrid.tsx
│   │   ├── GlassCard.tsx
│   │   └── GlassQuickView.tsx       # Modal with zoom
│   ├── booking/
│   │   ├── BookingForm.tsx
│   │   ├── StepIndicator.tsx        # Premium step progress bar
│   │   ├── ServiceSelector.tsx
│   │   ├── StaffSelector.tsx
│   │   └── DateTimePicker.tsx
│   ├── admin/
│   │   ├── BookingTable.tsx
│   │   ├── ProductManager.tsx
│   │   └── ExportButton.tsx
│   └── ui/
│       ├── AnimatedSection.tsx      # Scroll-reveal wrapper
│       ├── GradientText.tsx         # Gradient headline component
│       ├── ParallaxImage.tsx        # Parallax scroll image
│       ├── MagneticButton.tsx       # Hover-magnetic CTA buttons
│       └── SmoothCounter.tsx        # Animated number counter
├── lib/
│   ├── supabase.ts                  # Supabase client
│   ├── supabase-server.ts           # Server-side client
│   ├── animations.ts               # Shared Framer Motion variants
│   └── utils.ts
├── hooks/
│   ├── useScrollProgress.ts         # Scroll position tracking
│   ├── useInView.ts                 # Intersection observer hook
│   └── useMediaQuery.ts             # Responsive breakpoint hook
├── messages/
│   ├── en.json                      # English strings
│   └── am.json                      # Amharic strings
├── public/
│   ├── images/
│   │   ├── hero/                    # Hero banner images (multiple)
│   │   ├── services/
│   │   ├── products/
│   │   ├── team/
│   │   └── brand/                   # Logo variants, SVGs
│   └── fonts/
├── styles/
│   └── globals.css                  # Global styles + design tokens
├── middleware.ts                    # i18n + admin auth middleware
├── tailwind.config.ts
├── next.config.ts
└── .env.local
```

---

## 4. Design System — Premium Essilor-Inspired

### 4.1 Color Palette (Expanded)

```css
/* globals.css — Premium Design Tokens */
:root {
  /* ─── Brand Colors ─── */
  --color-primary:          #1A9CD8;    /* Vibrant Sky Blue — main brand */
  --color-primary-dark:     #0D6E99;    /* Deep Blue — hover states, active */
  --color-primary-darker:   #084C6A;    /* Midnight Blue — pressed states */
  --color-primary-light:    #E8F6FD;    /* Ice Blue — subtle backgrounds */
  --color-primary-lighter:  #F0FAFF;    /* Whisper Blue — hover tints */

  /* ─── Neutrals (Refined for premium feel) ─── */
  --color-black:            #0D0D0D;    /* True near-black for headlines */
  --color-charcoal:         #1F2421;    /* Dark charcoal for body */
  --color-slate:            #374151;    /* Medium text */
  --color-gray:             #6B7280;    /* Secondary text */
  --color-gray-light:       #9CA3AF;    /* Muted text, captions */
  --color-silver:           #D1D5DB;    /* Borders, dividers */
  --color-pearl:            #F3F4F6;    /* Alternate section backgrounds */
  --color-snow:             #F9FAFB;    /* Lightest background */
  --color-white:            #FFFFFF;

  /* ─── Accent / Semantic ─── */
  --color-success:          #059669;    /* Booking confirmed */
  --color-success-light:    #D1FAE5;
  --color-warning:          #D97706;    /* Pending status */
  --color-warning-light:    #FEF3C7;
  --color-error:            #DC2626;    /* Validation errors */
  --color-error-light:      #FEE2E2;

  /* ─── Gradient Definitions ─── */
  --gradient-hero:          linear-gradient(135deg, #0D0D0D 0%, #1F2421 50%, #0D6E99 100%);
  --gradient-primary:       linear-gradient(135deg, #1A9CD8 0%, #0D6E99 100%);
  --gradient-text:          linear-gradient(90deg, #1A9CD8, #0D6E99, #1A9CD8);
  --gradient-subtle:        linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%);
  --gradient-dark:          linear-gradient(180deg, #1F2421 0%, #0D0D0D 100%);
  --gradient-glass:         linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);

  /* ─── Shadows (Layered for depth — Essilor uses very subtle shadows) ─── */
  --shadow-xs:              0 1px 2px rgba(0,0,0,0.04);
  --shadow-sm:              0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:              0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04);
  --shadow-lg:              0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04);
  --shadow-xl:              0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04);
  --shadow-2xl:             0 25px 50px -12px rgba(0,0,0,0.15);
  --shadow-inner:           inset 0 2px 4px rgba(0,0,0,0.04);
  --shadow-primary:         0 4px 14px rgba(26,156,216,0.25);   /* Blue glow for CTAs */
  --shadow-primary-lg:      0 8px 24px rgba(26,156,216,0.3);    /* Hover state blue glow */

  /* ─── Border Radius ─── */
  --radius-xs:              4px;
  --radius-sm:              6px;
  --radius-md:              8px;
  --radius-lg:              12px;
  --radius-xl:              16px;
  --radius-2xl:             24px;
  --radius-full:            9999px;

  /* ─── Spacing Scale ─── */
  --space-section:          120px;     /* Between major sections (Essilor uses ~120px) */
  --space-section-mobile:   64px;
  --space-content:          80px;      /* Between section title and content */
  --space-content-mobile:   40px;

  /* ─── Typography Scale ─── */
  --font-display:           'Inter', sans-serif;
  --font-body:              'Inter', 'Noto Sans Ethiopic', sans-serif;
  --font-mono:              'JetBrains Mono', monospace;

  /* ─── Transitions (Essilor-grade smoothness) ─── */
  --ease-out-expo:          cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart:         cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-sine:       cubic-bezier(0.37, 0, 0.63, 1);
  --duration-fast:          150ms;
  --duration-normal:        300ms;
  --duration-slow:          500ms;
  --duration-slower:        800ms;
  --duration-slowest:       1200ms;

  /* ─── Z-Index Scale ─── */
  --z-dropdown:             50;
  --z-sticky:               100;
  --z-overlay:              200;
  --z-modal:                300;
  --z-toast:                400;
  --z-floating-cta:         150;
}
```

### 4.2 Typography System (Premium)

**Why Inter over Noto Sans:** Inter is used by Apple, GitHub, Linear, and top-tier SaaS products. Its optical sizing, tabular figures, and refined letterforms convey premium quality far better than Noto Sans for Latin characters. We keep Noto Sans Ethiopic as the Amharic fallback.

```html
<!-- app/layout.tsx — load optimized font stack -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Ethiopic:wght@300;400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

```css
/* globals.css — Typography */

/* ─── Base Typography ─── */
body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-charcoal);
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';  /* Inter stylistic alternates */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* ─── Heading Hierarchy (Essilor-style: bold, tight leading, dark) ─── */
h1, .h1 {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4.5rem);  /* 40px → 72px responsive */
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--color-black);
}

h2, .h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);      /* 32px → 48px */
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-black);
}

h3, .h3 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);    /* 24px → 32px */
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.015em;
  color: var(--color-charcoal);
}

h4, .h4 {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-charcoal);
}

/* ─── Pretitle / Eyebrow Text (Essilor uses this extensively) ─── */
.pretitle {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

/* ─── Body Text Variants ─── */
.body-lg {
  font-size: 1.125rem;   /* 18px */
  line-height: 1.75;
  color: var(--color-slate);
}

.body-md {
  font-size: 1rem;       /* 16px */
  line-height: 1.7;
  color: var(--color-gray);
}

.body-sm {
  font-size: 0.875rem;   /* 14px */
  line-height: 1.6;
  color: var(--color-gray-light);
}

.caption {
  font-size: 0.75rem;    /* 12px */
  line-height: 1.5;
  color: var(--color-gray-light);
  letter-spacing: 0.01em;
}

/* ─── Amharic locale override ─── */
[lang="am"] body {
  font-family: 'Noto Sans Ethiopic', 'Inter', sans-serif;
  line-height: 1.9;       /* Ethiopic script needs more line height */
}

[lang="am"] h1, [lang="am"] h2, [lang="am"] h3 {
  letter-spacing: 0;      /* No negative tracking for Ethiopic */
  line-height: 1.3;
}
```

### 4.3 Tailwind Config Extensions (Premium)

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A9CD8',
          50:  '#F0FAFF',
          100: '#E8F6FD',
          200: '#BAE6FD',
          300: '#7DD3F7',
          400: '#38BDF8',
          500: '#1A9CD8',
          600: '#0D6E99',
          700: '#084C6A',
          800: '#063A52',
          900: '#042A3B',
        },
        charcoal: '#1F2421',
        slate: '#374151',
        pearl: '#F3F4F6',
        snow: '#F9FAFB',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        sans: ['Inter', 'Noto Sans Ethiopic', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      spacing: {
        'section': '120px',
        'section-mobile': '64px',
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        'content': '1280px',
        'narrow': '960px',
        'reading': '720px',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card': '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)',
        'card-hover': '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
        'primary': '0 4px 14px rgba(26,156,216,0.25)',
        'primary-lg': '0 8px 24px rgba(26,156,216,0.3)',
      },
      animation: {
        'fade-up':       'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':       'fadeIn 0.6s ease forwards',
        'fade-down':     'fadeDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in':      'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right':'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'counter':       'counter 2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'ken-burns':     'kenBurns 20s ease-in-out infinite alternate',
        'float':         'float 6s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'pulse-soft':    'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeDown: {
          '0%':   { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        kenBurns: {
          '0%':   { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.08) translate(-1%, -1%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0D0D0D 0%, #1F2421 50%, #0D6E99 100%)',
        'gradient-primary': 'linear-gradient(135deg, #1A9CD8 0%, #0D6E99 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),   // Rich text styling
    require('tailwindcss-animate'),        // Additional animation utilities
  ],
}
export default config
```

### 4.4 Premium Essilor-Inspired Design Rules

#### Hero Section (Essilor Pattern)
- **Full viewport height** (`h-screen` or `min-h-[90vh]`)
- **Dynamic carousel** with 3-4 slides auto-rotating every 7 seconds
- Each slide has: **brand logo overlay** (top-left or center), **hero headline** (large, white, tight leading), **subtitle text** (lighter weight, max 2 lines), **single CTA button** ("Discover" or "Book Appointment")
- **Ken Burns zoom animation** on background images
- **Gradient overlay**: `bg-gradient-to-t from-black/70 via-black/30 to-transparent`
- **Slide indicators**: thin horizontal bars (not dots) at the bottom — exactly like Essilor
- **Mobile:** Full-bleed image, text stacked bottom with stronger gradient overlay

#### Navigation Bar (Essilor Pattern)
- **Transparent on hero → white on scroll** (background transitions from `bg-transparent` to `bg-white` with `backdrop-blur-xl`)
- **Logo:** left-aligned, color logo on white backgrounds, white logo on transparent/dark
- **Links:** centered, `font-medium text-sm tracking-wide`, with **active indicator** (thin blue underline, 2px)
- **Hover state:** links shift to `text-primary` with a subtle underline animation (width expands from center)
- **CTA button:** right-side, `rounded-full`, `bg-primary`, white text, hover → `bg-primary-dark` + `shadow-primary`
- **Mobile:** hamburger icon → full-screen overlay menu with large stacked links, social icons at bottom

#### Section Layout (Essilor Pattern)
- **Section spacing:** `py-[120px]` desktop, `py-16` mobile — Essilor uses very generous vertical padding
- **Alternating backgrounds:** White → `#F9FAFB` (Snow) → White → `#F3F4F6` (Pearl)
- **Section headers:** Always include a **pretitle** (uppercase, tracking-wide, primary color, 12px) above the **main heading** (32-48px, bold, near-black)
- **Content max-width:** `max-w-7xl` for full sections, `max-w-3xl` for text-heavy sections
- **Dividers:** Use subtle `border-t border-gray-100` between sections when backgrounds are the same

#### Cards (Essilor Pattern)
- **White background**, `rounded-2xl`, `shadow-subtle` default → `shadow-card-hover` on hover
- **No thick colored borders** — instead use a subtle `border border-gray-100`
- **Hover effect:** Card lifts slightly (`translate-y-[-4px]`) with shadow expansion
- **Image area:** Full-width top with `rounded-t-2xl`, `aspect-[4/3]`, `object-cover`
- **Content area:** `p-6` with clear typographic hierarchy
- **Transition:** All hover effects use `transition-all duration-500 ease-out-expo`

#### Buttons (Premium System)
```
Primary:    bg-primary text-white rounded-full px-8 py-3 font-medium
            hover: bg-primary-dark shadow-primary-lg translate-y-[-1px]
            active: bg-primary-darker translate-y-0

Secondary:  bg-transparent text-primary border-2 border-primary rounded-full px-8 py-3
            hover: bg-primary text-white

Ghost:      bg-transparent text-charcoal hover:text-primary
            (used for nav links, footer links)

Dark:       bg-charcoal text-white rounded-full px-8 py-3
            hover: bg-black

Icon:       w-10 h-10 rounded-full bg-primary-light text-primary
            hover: bg-primary text-white
```

#### Images (Essilor Pattern)
- **Always use `next/image`** with proper `width`, `height`, `sizes`, `placeholder="blur"`
- **Hero images:** Serve at 2x resolution, use `priority` loading
- **Product images:** White or light gray background, consistent aspect ratio across grid
- **Editorial images:** Use `object-cover` with `aspect-[16/9]` or `aspect-[3/2]`
- **Hover on product cards:** Subtle `scale(1.03)` zoom on the image container

#### Footer (Essilor Pattern)
- **Background:** Dark charcoal (`#1F2421`) or near-black (`#0D0D0D`)
- **4-column layout** (Brand + About | Quick Links | Services | Contact)
- **Brand column:** Logo + 2-line tagline + social media icons
- **Link columns:** uppercase section headers (`text-xs tracking-widest text-white/40`), links in `text-white/60 hover:text-white`
- **Bottom bar:** Thin divider, copyright + legal links in `text-xs text-white/30`
- **Social icons:** 32×32 circles with border, white icons, hover → `bg-primary`

---

## 5. Database Schema (Supabase)

Run these SQL statements in your Supabase **SQL Editor**:

```sql
-- ============================================================
-- TABLE: services
-- ============================================================
CREATE TABLE services (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en     TEXT NOT NULL,
  name_am     TEXT,
  description_en TEXT,
  description_am TEXT,
  icon_name   TEXT,                      -- Lucide icon name for UI rendering
  image_url   TEXT,                      -- Editorial image for the service
  display_order INT DEFAULT 0,           -- Sort order on frontend
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO services (name_en, name_am, description_en, icon_name, display_order) VALUES
  ('Computerized Eye Testing',  'የኮምፒዩተር የዓይን ምርመራ', 'Advanced digital refraction technology for precise prescriptions. Our state-of-the-art equipment ensures accurate diagnosis and personalized vision solutions.', 'scan-eye', 1),
  ('Optical Dispensary',        'ኦፕቲካል ዲስፔንሰሪ', 'Browse our curated collection of premium frames and precision-crafted lenses. Expert fitting and personalized style consultation included.', 'glasses', 2);

-- ============================================================
-- TABLE: staff
-- ============================================================
CREATE TABLE staff (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  role_en    TEXT,
  role_am    TEXT,
  bio_en     TEXT,                        -- Short bio for staff display
  bio_am     TEXT,
  photo_url  TEXT,                        -- Staff profile photo
  is_active  BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: glass_categories (frame shapes)
-- ============================================================
CREATE TABLE glass_categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en     TEXT NOT NULL,
  name_am     TEXT,
  slug        TEXT UNIQUE,
  description_en TEXT,                    -- Category description for brand pages
  description_am TEXT,
  hero_image  TEXT,                       -- Category hero banner image
  display_order INT DEFAULT 0
);

INSERT INTO glass_categories (name_en, slug, display_order) VALUES
  ('Cat-Eye / Butterfly', 'cat-eye-butterfly', 1),
  ('Rounded Rectangle',   'rounded-rectangle', 2),
  ('Round / Oval',        'round-oval', 3),
  ('Wayfarer / Square',   'wayfarer-square', 4),
  ('Sunglasses',          'sunglasses', 5),
  ('Rectangle',           'rectangle', 6),
  ('Modified Rectangle',  'modified-rectangle', 7);

-- ============================================================
-- TABLE: lens_categories (top-level filter: Correct/Protect/Enhance)
-- ============================================================
CREATE TABLE lens_categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en     TEXT NOT NULL,
  name_am     TEXT,
  slug        TEXT UNIQUE NOT NULL,
  description_en TEXT,
  description_am TEXT,
  display_order INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO lens_categories (name_en, name_am, slug, display_order) VALUES
  ('Correct Your Vision', 'ራዕይዎን ያስተካክሉ', 'correct-your-vision', 1),
  ('Protect Your Eyes',   'ዓይኖትዎን ይጠብቁ',   'protect-your-eyes',   2),
  ('Enhance Your Vision', 'ራዕይዎን ያሻሽሉ',     'enhance-your-vision', 3);

-- ============================================================
-- TABLE: lens_needs (specific use-case filter: Kids, Blue Light, etc.)
-- ============================================================
CREATE TABLE lens_needs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en     TEXT NOT NULL,
  name_am     TEXT,
  slug        TEXT UNIQUE NOT NULL,
  description_en TEXT,
  description_am TEXT,
  display_order INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO lens_needs (name_en, name_am, slug, display_order) VALUES
  ('For Kids',              'ለልጆች',               'for-kids',              1),
  ('Near Vision',           'የቅርብ ራዕይ',          'near-vision',           2),
  ('Far Vision',            'የሩቅ ራዕይ',           'far-vision',            3),
  ('Blue Light Protection', 'ሰማያዊ ብርሃን ጥበቃ',  'blue-light-protection', 4),
  ('Sun Protection',        'የፀሐይ ጥበቃ',         'sun-protection',        5),
  ('Light Sensitivity',     'የብርሃን ስሜት',        'light-sensitivity',     6),
  ('Lens Durability',       'የሌንስ ጥንካሬ',        'lens-durability',       7);

-- ============================================================
-- TABLE: glasses
-- ============================================================
CREATE TABLE glasses (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id  UUID REFERENCES glass_categories(id),
  name_en      TEXT NOT NULL,
  name_am      TEXT,
  glass_code   TEXT,
  description_en TEXT,                   -- Optional short product description
  image_url    TEXT,
  price_range  TEXT,                     -- e.g., "$$" or "Premium"
  is_featured  BOOLEAN DEFAULT FALSE,    -- Show on homepage / highlights
  is_new       BOOLEAN DEFAULT FALSE,    -- "New" badge
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Insert all 20 glasses from the product list with their local image URLs
INSERT INTO glasses (category_id, name_en, glass_code, image_url) VALUES
  ((SELECT id FROM glass_categories WHERE slug='cat-eye-butterfly'), 'Cat-Eye Black Frame',           '28 011 52 17-140 C5', '/Glasses/Cat-Eye  Butterfly.webp'),
  ((SELECT id FROM glass_categories WHERE slug='cat-eye-butterfly'), 'Soft Cat-Eye Black Frame',      '28 098 51 15-140 C1', '/Glasses/Cat-Eye.webp'),
  ((SELECT id FROM glass_categories WHERE slug='rounded-rectangle'), 'Matte Brown/Taupe Frame',       '72 043 51 19 148 C6', '/Glasses/Rounded Rectangle.webp'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Classic Round Black Frame',     '1261 48 18 C1',       '/Glasses/Round-Oval.webp'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Round Wire/Thin Black Frame',   '1395 49 17 C1',       '/Glasses/Round.webp'),
  ((SELECT id FROM glass_categories WHERE slug='wayfarer-square'),   'Thick Square Black Frame',      '02003 50 21-145 C1',  '/Glasses/Wayfarer-Square.avif'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Clear / Pastel Round Frame',    '2132 49 17-140',      '/Glasses/Pastel Round.webp'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Thin Rose Gold/Pink Round Frame','2134 50 20-147',      '/Glasses/Thin Rose Gold Round.webp'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Daily Oval Black Frame',        '2311 53 17-142 C2',   '/Glasses/Oval-Rounded.webp'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Ultra-Thin Round Wire Frame',   '3111 53 18-145',      '/Glasses/Ultra-Thin Round.avif'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Minimalist Round Black Frame',  '7910 48 18-148',      '/Glasses/Minimalist Round.avif'),
  ((SELECT id FROM glass_categories WHERE slug='rectangle'),         'Slim Rectangle Black Frame',    '8186 50 17-145 C2',   '/Glasses/Slim Rectangle.webp'),
  ((SELECT id FROM glass_categories WHERE slug='sunglasses'),        'Square Tinted Sunglasses',      '8191 49 23-146',      '/Glasses/Sunglasses.webp'),
  ((SELECT id FROM glass_categories WHERE slug='rectangle'),         'Standard Rectangle Black Frame','28001 52 17-140 C1',  '/Glasses/Rectangle-Wayfarer.webp'),
  ((SELECT id FROM glass_categories WHERE slug='rectangle'),         'Deep Rectangle Black Frame',    '28006 52 17-140 C1',  '/Glasses/Deep Rectangle.avif'),
  ((SELECT id FROM glass_categories WHERE slug='cat-eye-butterfly'), 'Flared Cat-Eye Black Frame',    '28015 49 17-140 C1',  '/Glasses/Flared Cat-Eye.avif'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Thick Rim Round Black Frame',   '28016 46 21-140 C1',  '/Glasses/Thick Rim Round.webp'),
  ((SELECT id FROM glass_categories WHERE slug='rectangle'),         'Angular Rectangle Black Frame', '28020 52 19-140 C1',  '/Glasses/Angular Rectangle.avif'),
  ((SELECT id FROM glass_categories WHERE slug='modified-rectangle'),'Soft Corner Rectangle Black Frame','28022 51 18-140 C1',  '/Glasses/Soft Corner Rectangle.webp'),
  ((SELECT id FROM glass_categories WHERE slug='cat-eye-butterfly'), 'Bold Curved Cat-Eye Black Frame','28025 53 18-140 C1',  '/Glasses/Bold Curved Cat-Eye.avif');

-- ============================================================
-- JUNCTION TABLES for many-to-many relationships
-- ============================================================

-- Junction: glasses ↔ lens_categories (which lens category a product belongs to)
CREATE TABLE glasses_lens_categories (
  glass_id         UUID REFERENCES glasses(id) ON DELETE CASCADE,
  lens_category_id UUID REFERENCES lens_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (glass_id, lens_category_id)
);

-- Junction: glasses ↔ lens_needs (which needs a product fulfills)
CREATE TABLE glasses_lens_needs (
  glass_id     UUID REFERENCES glasses(id) ON DELETE CASCADE,
  lens_need_id UUID REFERENCES lens_needs(id) ON DELETE CASCADE,
  PRIMARY KEY (glass_id, lens_need_id)
);

-- ============================================================
-- TABLE: bookings
-- ============================================================
CREATE TABLE bookings (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  address         TEXT,
  service_id      UUID REFERENCES services(id),
  staff_id        UUID REFERENCES staff(id),
  booking_date    DATE NOT NULL,
  booking_time    TIME NOT NULL,
  reason          TEXT,
  special_requests TEXT,
  guest_emails    TEXT[],               -- Array of up to 10
  glasses_interest UUID[],              -- If Optical Dispensary selected
  status          TEXT DEFAULT 'pending', -- pending | confirmed | cancelled
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: site_stats (for animated counters on homepage)
-- ============================================================
CREATE TABLE site_stats (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key   TEXT UNIQUE NOT NULL,       -- e.g., 'years_experience', 'happy_patients'
  stat_value INT NOT NULL,
  label_en   TEXT NOT NULL,
  label_am   TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_stats (stat_key, stat_value, label_en, label_am) VALUES
  ('years_experience', 15, 'Years of Experience', 'ዓመታት ልምድ'),
  ('happy_patients', 10000, 'Happy Patients', 'ደስተኛ ታካሚዎች'),
  ('expert_staff', 8, 'Expert Staff', 'ባለሙያ ሠራተኞች'),
  ('frame_collection', 200, 'Frame Collection', 'የመነፅር ስብስብ');

-- ============================================================
-- TABLE: testimonials (cached Google reviews + curated ones)
-- ============================================================
CREATE TABLE testimonials (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_photo TEXT,
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  review_text_en TEXT NOT NULL,
  review_text_am TEXT,
  source      TEXT DEFAULT 'google',     -- 'google' | 'manual'
  is_featured BOOLEAN DEFAULT FALSE,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row-Level Security (RLS)
-- ============================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "Admin can manage bookings"
  ON bookings FOR ALL TO authenticated USING (TRUE);

ALTER TABLE glasses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read glasses" ON glasses FOR SELECT TO anon USING (is_active = TRUE);
CREATE POLICY "Admin manage glasses" ON glasses FOR ALL TO authenticated USING (TRUE);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON services FOR SELECT TO anon USING (is_active = TRUE);
CREATE POLICY "Admin manage services" ON services FOR ALL TO authenticated USING (TRUE);

ALTER TABLE glass_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON glass_categories FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Admin manage categories" ON glass_categories FOR ALL TO authenticated USING (TRUE);

ALTER TABLE lens_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lens categories" ON lens_categories FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Admin manage lens categories" ON lens_categories FOR ALL TO authenticated USING (TRUE);

ALTER TABLE lens_needs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lens needs" ON lens_needs FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Admin manage lens needs" ON lens_needs FOR ALL TO authenticated USING (TRUE);

ALTER TABLE glasses_lens_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON glasses_lens_categories FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Admin manage" ON glasses_lens_categories FOR ALL TO authenticated USING (TRUE);

ALTER TABLE glasses_lens_needs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON glasses_lens_needs FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Admin manage" ON glasses_lens_needs FOR ALL TO authenticated USING (TRUE);

ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stats" ON site_stats FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Admin manage stats" ON site_stats FOR ALL TO authenticated USING (TRUE);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT TO anon USING (is_active = TRUE);
CREATE POLICY "Admin manage testimonials" ON testimonials FOR ALL TO authenticated USING (TRUE);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read staff" ON staff FOR SELECT TO anon USING (is_active = TRUE);
CREATE POLICY "Admin manage staff" ON staff FOR ALL TO authenticated USING (TRUE);
```

---

## 6. Environment Setup

### 6.1 Install & Bootstrap

```bash
npx create-next-app@latest sunopticsmf \
  --typescript --tailwind --eslint --app --src-dir=false

cd sunopticsmf

# Core dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install next-intl
npm install react-hook-form @hookform/resolvers zod
npm install react-day-picker date-fns
npm install xlsx                     # SheetJS for Excel export
npm install lucide-react
npm install clsx tailwind-merge

# Premium animation & UI
npm install framer-motion
npm install embla-carousel-react embla-carousel-autoplay
npm install sonner                   # Toast notifications

# shadcn/ui setup
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input select dialog table badge card tabs
npx shadcn-ui@latest add accordion tooltip scroll-area separator avatar
```

### 6.2 .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://sibxvfszhopnpvnaoiha.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ZGs762ksZ3OuwHYt991qmg_Qi0egAHX
SUPABASE_SERVICE_ROLE_KEY=<get from Supabase Dashboard → Settings → API>
ADMIN_EMAIL=admin@samvision.com
ADMIN_PASSWORD=<set a strong password>
GOOGLE_PLACES_API_KEY=<optional — for live Google Reviews>
NEXT_PUBLIC_SITE_URL=https://samvision.et
```

### 6.3 Supabase Client Setup

```ts
// lib/supabase.ts  (browser client)
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)
```

```ts
// lib/supabase-server.ts  (server actions / API routes)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(),
                 setAll: (c) => c.forEach(({name,value,options}) => cookieStore.set(name,value,options)) } }
  )
}
```

### 6.4 Shared Animation Variants

```ts
// lib/animations.ts — Framer Motion presets
export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6 }
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.12 } }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
}

export const slideInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
}

export const slideInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
}
```

---

## 7. Page-by-Page Implementation

---

### 7.1 Navbar (`components/layout/Navbar.tsx`)

**Essilor-Style Behavior:**
- Transparent background on hero (text white) → solid white on scroll (text dark)
- Smooth transition between states (`transition-all duration-500`)
- Logo adapts color based on scroll state
- Active link has animated underline (width expands from center on hover)

```tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out-expo
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-subtle border-b border-gray-100' 
        : 'bg-transparent'
      }`}>
      <div className="max-w-content mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
        
        {/* Logo — adapts to scroll state */}
        <Link href="/" className="relative z-10">
          <span className={`text-2xl font-bold tracking-tight transition-colors duration-300
            ${isScrolled ? 'text-charcoal' : 'text-white'}`}>
            Sam<span className="text-primary">vision</span>
          </span>
        </Link>

        {/* Nav Links — centered with animated underlines */}
        <div className="hidden lg:flex items-center gap-10">
          {['About', 'Services', 'Products', 'Contact'].map(link => (
            <NavLink 
              key={link} 
              href={`/${link.toLowerCase()}`}
              isLight={!isScrolled}
            >
              {link}
            </NavLink>
          ))}
        </div>

        {/* Right Side — Language + CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher isLight={!isScrolled} />
          <Link href="/book"
            className="bg-primary text-white rounded-full px-7 py-2.5 text-sm 
                       font-medium tracking-wide
                       hover:bg-primary-dark hover:shadow-primary-lg 
                       active:bg-primary-darker
                       transform hover:-translate-y-0.5 active:translate-y-0
                       transition-all duration-300">
            Book Appointment
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button 
          className="lg:hidden relative z-10"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <div className={`w-6 flex flex-col gap-1.5 transition-all duration-300
            ${isScrolled ? '[&>span]:bg-charcoal' : '[&>span]:bg-white'}`}>
            <span className={`block h-0.5 rounded-full transition-all duration-300
              ${isMobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 rounded-full transition-all duration-300
              ${isMobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 rounded-full transition-all duration-300
              ${isMobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>

      </div>

      {/* Mobile menu — full screen overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal z-40 flex flex-col items-center 
                       justify-center gap-8"
          >
            {['About', 'Services', 'Products', 'Contact', 'Book Appointment'].map(
              (link, i) => (
                <motion.div
                  key={link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                >
                  <Link href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-3xl font-bold text-white hover:text-primary 
                               transition-colors"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {link}
                  </Link>
                </motion.div>
              )
            )}
            {/* Social icons at bottom */}
            <div className="absolute bottom-12 flex gap-6">
              {/* Facebook, Instagram, TikTok, Telegram icons */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// NavLink with animated underline (Essilor pattern)
function NavLink({ href, children, isLight }) {
  return (
    <Link href={href} className="group relative">
      <span className={`text-sm font-medium tracking-wide transition-colors duration-300
        ${isLight ? 'text-white/90 hover:text-white' : 'text-charcoal hover:text-primary'}`}>
        {children}
      </span>
      {/* Animated underline — expands from center on hover */}
      <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-primary 
                       rounded-full transition-all duration-300 ease-out-expo
                       group-hover:w-full group-hover:left-0" />
    </Link>
  )
}
```

### 7.2 Floating CTA Button (`components/layout/FloatingCTA.tsx`)

**Essilor uses a persistent "Find an eyecare professional" CTA. We adapt this for bookings:**

```tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from 'lucide-react'

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-[150]"
        >
          <Link href="/book"
            className="flex items-center gap-2.5 bg-primary text-white 
                       rounded-full px-6 py-3.5 text-sm font-medium
                       shadow-primary-lg hover:bg-primary-dark
                       hover:shadow-2xl transform hover:-translate-y-0.5
                       transition-all duration-300">
            <Calendar size={18} />
            Book Appointment
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

### 7.3 Homepage (`app/[locale]/page.tsx`)

#### Section 1: Hero Carousel (Essilor-Style Dynamic Banner)

**This is THE premium differentiator. Essilor's hero is a multi-slide carousel with:**
- Auto-rotating slides (7s interval)
- Each slide: full-viewport image + overlay content + CTA
- Thin bar indicators at the bottom
- Smooth crossfade transitions

```tsx
'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const heroSlides = [
  {
    image: '/images/hero/eye-exam-premium.jpg',
    pretitle: 'Samvision Speciality Eye Clinic',
    headline: 'We Care\nFor Your Eyes',
    subtitle: 'Expert eye care and modern eyewear in the heart of Addis Ababa.',
    cta: { text: 'Book Eye Care Professional', href: '/book' },
  },
  {
    image: '/images/hero/eyewear-collection.jpg',
    pretitle: 'Premium Eyewear Collection',
    headline: 'See The World\nIn Style',
    subtitle: 'Discover our curated selection of designer frames and precision lenses.',
    cta: { text: 'Explore Collection', href: '/products' },
  },
  {
    image: '/images/hero/advanced-technology.jpg',
    pretitle: 'Advanced Technology',
    headline: 'Precision\nDiagnostics',
    subtitle: 'Computerized eye testing with state-of-the-art refraction equipment.',
    cta: { text: 'Our Services', href: '/services' },
  },
]

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 40 },
    [Autoplay({ delay: 7000, stopOnInteraction: false })]
  )
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="relative h-screen overflow-hidden">
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {heroSlides.map((slide, i) => (
            <div key={i} className="flex-[0_0_100%] relative h-full">
              {/* Background image with Ken Burns */}
              <Image
                src={slide.image}
                alt={slide.pretitle}
                fill
                className="object-cover animate-ken-burns"
                priority={i === 0}
                sizes="100vw"
              />
              {/* Gradient overlay — darker at bottom for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t 
                              from-black/70 via-black/30 to-black/10 z-10" />

              {/* Content — centered like Essilor */}
              <div className="relative z-20 h-full flex items-center justify-center">
                <motion.div
                  className="text-center text-white px-6 max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 40 }}
                  animate={activeIndex === i 
                    ? { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } }
                    : { opacity: 0, y: 40 }
                  }
                >
                  <p className="pretitle text-primary-300 mb-6">
                    {slide.pretitle}
                  </p>
                  <h1 className="text-display-xl text-white font-extrabold 
                                 leading-[1.05] mb-6 whitespace-pre-line">
                    {slide.headline}
                  </h1>
                  <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto 
                                leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.cta.href}
                    className="inline-flex items-center gap-2 bg-primary text-white 
                               rounded-full px-10 py-4 text-sm font-medium 
                               uppercase tracking-wider
                               hover:bg-primary-dark hover:shadow-primary-lg
                               transform hover:-translate-y-0.5
                               transition-all duration-300">
                    {slide.cta.text}
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators — Essilor uses thin horizontal bars */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 
                       flex gap-2">
        {heroSlides.map((_, i) => (
          <button key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-0.5 rounded-full transition-all duration-500
              ${activeIndex === i 
                ? 'w-12 bg-primary' 
                : 'w-6 bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-white/30 rounded-full 
                     flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2.5 bg-white/60 rounded-full" />
        </motion.div>
      </div>
    </section>
  )
}
```

#### Section 2: Benefits Strip (Essilor "Benefits Summary" Pattern)

```tsx
// Horizontal strip with 3-4 key benefits — appears right after hero
<section className="relative -mt-20 z-30">
  <div className="max-w-content mx-auto px-6 lg:px-8">
    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 
                    grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
      {[
        { icon: <ScanEye />, title: 'Expert Diagnosis', desc: 'Computerized precision eye testing' },
        { icon: <Glasses />,  title: 'Premium Eyewear', desc: '200+ curated frame collection' },
        { icon: <Shield />,   title: 'Vision Protection', desc: 'Personalized vision solutions' },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary 
                          flex items-center justify-center flex-shrink-0">
            {item.icon}
          </div>
          <div>
            <h3 className="font-semibold text-charcoal mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

#### Section 3: Editorial Split — "About Us" Preview (Essilor Pattern)

**Essilor uses 50/50 image-text splits throughout. Critical for storytelling.**

```tsx
<section className="py-section">
  <div className="max-w-content mx-auto px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      
      {/* Left — Image with subtle parallax */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
          <Image src="/images/clinic-interior.jpg" alt="Samvision Clinic" 
                 fill className="object-cover" sizes="50vw" />
        </div>
        {/* Decorative accent — floating stat card */}
        <div className="absolute -bottom-6 -right-6 bg-primary text-white 
                        rounded-xl p-6 shadow-primary-lg">
          <span className="text-3xl font-bold block">15+</span>
          <span className="text-sm text-white/80">Years of Excellence</span>
        </div>
      </motion.div>

      {/* Right — Content */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <p className="pretitle">About Samvision</p>
        <h2 className="text-display-md mb-6">
          Evolving Vision,<br/>Transforming Lives
        </h2>
        <p className="body-lg mb-6">
          At Samvision, we believe that sight is our most precious sense. When 
          someone's eyesight is given its full potential, it can be life-changing.
        </p>
        <p className="body-md mb-8">
          Located in the heart of Addis Ababa at Meskel Flower, our clinic 
          combines advanced diagnostic technology with a curated collection of 
          premium eyewear — providing comprehensive eye care under one roof.
        </p>
        <Link href="/about"
          className="inline-flex items-center gap-2 text-primary font-medium 
                     hover:gap-3 transition-all duration-300">
          Discover Our Story <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  </div>
</section>
```

#### Section 4: What We Offer (Redesigned as Essilor-Style Cards)

```tsx
<section className="py-section bg-snow">
  <div className="max-w-content mx-auto px-6 lg:px-8">
    <div className="text-center mb-16">
      <p className="pretitle">What We Offer</p>
      <h2 className="text-display-md">
        Exceptional Eye Care Services
      </h2>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      {services.map((service, i) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="group bg-white rounded-2xl overflow-hidden border border-gray-100
                     hover:shadow-card-hover hover:-translate-y-1
                     transition-all duration-500 ease-out-expo"
        >
          {/* Image area */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image src={service.image_url} alt={service.name_en}
                   fill className="object-cover transition-transform duration-700
                                   group-hover:scale-105"
                   sizes="(max-width: 768px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t 
                            from-black/40 to-transparent" />
          </div>
          {/* Content */}
          <div className="p-8">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary 
                            flex items-center justify-center mb-4
                            group-hover:bg-primary group-hover:text-white
                            transition-colors duration-300">
              <DynamicIcon name={service.icon_name} size={22} />
            </div>
            <h3 className="text-xl font-bold text-charcoal mb-3">
              {service.name_en}
            </h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              {service.description_en}
            </p>
            <Link href={`/services#${service.id}`}
              className="inline-flex items-center gap-2 text-primary text-sm 
                         font-medium group-hover:gap-3 transition-all duration-300">
              Learn More <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

#### Section 5: Stats Counter (Animated Numbers)

```tsx
<section className="py-20 bg-gradient-hero text-white">
  <div className="max-w-content mx-auto px-6 lg:px-8">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.stat_key}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="text-center"
        >
          <SmoothCounter
            value={stat.stat_value}
            suffix={stat.stat_key === 'happy_patients' ? '+' : ''}
            className="text-4xl lg:text-5xl font-bold text-primary-300"
          />
          <p className="text-sm text-white/60 mt-2 uppercase tracking-wider">
            {stat.label_en}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

#### Section 6: Testimonials Carousel

```tsx
<section className="py-section bg-white">
  <div className="max-w-content mx-auto px-6 lg:px-8">
    <div className="text-center mb-16">
      <p className="pretitle">Testimonials</p>
      <h2 className="text-display-md mb-4">What Our Patients Say</h2>
      <p className="body-md max-w-xl mx-auto">
        Read verified reviews from our patients on Google
      </p>
    </div>

    {/* Embla Carousel for reviews */}
    <div className="relative">
      <div ref={reviewsRef} className="overflow-hidden">
        <div className="flex gap-6">
          {reviews.map(review => (
            <div key={review.id} 
                 className="flex-[0_0_100%] md:flex-[0_0_calc(33.33%-16px)] 
                            min-w-0">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="text-center mt-12">
      <a href="https://share.google/DS7L0KzU3z3MTn8M1"
         target="_blank" rel="noopener noreferrer"
         className="inline-flex items-center gap-2 text-primary font-medium 
                    hover:gap-3 transition-all duration-300">
        View All Google Reviews <ExternalLink size={16} />
      </a>
    </div>
  </div>
</section>
```

**ReviewCard Component:**
```tsx
function ReviewCard({ review }) {
  return (
    <div className="bg-snow rounded-2xl p-8 border border-gray-100 h-full 
                    flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          <AvatarImage src={review.author_photo} />
          <AvatarFallback className="bg-primary-100 text-primary font-medium">
            {review.author_name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-charcoal text-sm">{review.author_name}</p>
          <div className="flex gap-0.5">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-500 text-sm leading-relaxed flex-grow">
        "{review.review_text_en}"
      </p>
      <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-gray-100">
        <img src="/images/google-g.svg" alt="Google" className="w-4 h-4" />
        <span className="text-xs text-gray-400">Verified Google Review</span>
      </div>
    </div>
  )
}
```

#### Section 7: Full-Width CTA Banner

```tsx
<section className="relative py-24 overflow-hidden">
  <Image src="/images/cta-banner-eye.jpg" alt="" fill 
         className="object-cover" />
  <div className="absolute inset-0 bg-primary/85 backdrop-blur-sm" />
  <div className="relative z-10 text-center text-white px-6">
    <h2 className="text-display-md text-white mb-4">
      Ready for Better Vision?
    </h2>
    <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
      Book your comprehensive eye examination today and discover the 
      clarity you deserve.
    </p>
    <Link href="/book"
      className="inline-flex items-center gap-2 bg-white text-primary 
                 rounded-full px-10 py-4 text-sm font-medium uppercase 
                 tracking-wider hover:bg-gray-50 hover:shadow-xl
                 transform hover:-translate-y-0.5 transition-all duration-300">
      <Calendar size={18} />
      Book Your Appointment
    </Link>
  </div>
</section>
```

---

### 7.4 Services Page (`app/[locale]/services/page.tsx`)

**Essilor-style layout: Dark hero → service detail sections (alternating image+text)**

```tsx
{/* Hero — dark with gradient */}
<section className="relative py-32 bg-gradient-hero overflow-hidden">
  {/* Decorative gradient orb */}
  <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 
                  rounded-full blur-3xl" />
  <div className="relative z-10 max-w-content mx-auto px-6 lg:px-8 text-center">
    <motion.div {...fadeUp}>
      <p className="pretitle text-primary-300 mb-6">What We Offer</p>
      <h1 className="text-display-xl text-white mb-6">
        Services at<br/>Samvision Eye Clinic
      </h1>
      <p className="text-lg text-white/60 max-w-2xl mx-auto">
        Explore how our expert eye care services are designed to protect 
        your vision and enhance your everyday life.
      </p>
    </motion.div>
  </div>
</section>

{/* Sticky section navigation — Essilor "BrandNavigation" pattern */}
<div className="sticky top-20 z-40 bg-white border-b border-gray-100 shadow-sm">
  <div className="max-w-content mx-auto px-6 lg:px-8 flex gap-8 h-14 
                  items-center overflow-x-auto">
    <button className="text-sm font-medium text-primary border-b-2 
                       border-primary pb-0.5 whitespace-nowrap">
      Eye Testing
    </button>
    <button className="text-sm font-medium text-gray-400 hover:text-charcoal 
                       transition-colors whitespace-nowrap">
      Optical Dispensary
    </button>
  </div>
</div>

{/* Service Detail Sections — alternating layout */}
{services.map((service, i) => (
  <section key={service.id} className="py-section">
    <div className={`max-w-content mx-auto px-6 lg:px-8 grid lg:grid-cols-2 
                     gap-16 lg:gap-24 items-center
                     ${i % 2 === 1 ? 'direction-rtl' : ''}`}>
      {/* Image side */}
      <motion.div
        initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative rounded-2xl overflow-hidden aspect-[4/3]"
      >
        <Image src={service.image_url} alt={service.name_en}
               fill className="object-cover" sizes="50vw" />
      </motion.div>

      {/* Text side */}
      <motion.div
        initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary 
                        flex items-center justify-center mb-6">
          <DynamicIcon name={service.icon_name} size={24} />
        </div>
        <h2 className="text-display-md mb-6">{service.name_en}</h2>
        <p className="body-lg mb-8">{service.description_en}</p>
        
        {/* Feature bullets */}
        <ul className="space-y-3 mb-8">
          {service.features?.map(f => (
            <li key={f} className="flex items-center gap-3 text-slate">
              <Check size={18} className="text-primary flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <Link href="/book"
          className="inline-flex items-center gap-2 bg-primary text-white 
                     rounded-full px-8 py-3 text-sm font-medium
                     hover:bg-primary-dark hover:shadow-primary-lg
                     transition-all duration-300">
          Book This Service <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  </section>
))}
```

---

### 7.5 Products Page (`app/[locale]/products/page.tsx`)

**Essilor-style: Hero banner + two-tier filter tabs + premium product grid**

The products page features a **dual-filter system**:
1. **Row 1 — Lens Category tabs** (left-aligned): All | Correct Your Vision | Protect Your Eyes | Enhance Your Vision
2. **Row 2 — Needs pills** (horizontal scroll): All | For Kids | Near Vision | Far Vision | Blue Light Protection | Sun Protection | Light Sensitivity | Lens Durability

Filters are AND-combined: only glasses matching BOTH the selected lens category AND the selected need are shown.

```tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/products/GlassCard'

// ─── Lens Category Data (Top-Level Filter: Correct / Protect / Enhance) ───
const lensCategories = [
  { id: 'all', name_en: 'All', name_am: 'ሁሉም' },
  { id: 'correct-your-vision', name_en: 'Correct Your Vision', name_am: 'ራዕይዎን ያስተካክሉ' },
  { id: 'protect-your-eyes',   name_en: 'Protect Your Eyes',   name_am: 'ዓይኖትዎን ይጠብቁ' },
  { id: 'enhance-your-vision', name_en: 'Enhance Your Vision', name_am: 'ራዕይዎን ያሻሽሉ' },
]

// ─── Needs Data (Specific Use-Case Filter) ───
const lensNeeds = [
  { id: 'all',             name_en: 'All',                    name_am: 'ሁሉም' },
  { id: 'for-kids',        name_en: 'For Kids',               name_am: 'ለልጆች' },
  { id: 'near-vision',     name_en: 'Near Vision',            name_am: 'የቅርብ ራዕይ' },
  { id: 'far-vision',      name_en: 'Far Vision',             name_am: 'የሩቅ ራዕይ' },
  { id: 'blue-light-protection', name_en: 'Blue Light Protection', name_am: 'ሰማያዊ ብርሃን ጥበቃ' },
  { id: 'sun-protection',  name_en: 'Sun Protection',         name_am: 'የፀሐይ ጥበቃ' },
  { id: 'light-sensitivity', name_en: 'Light Sensitivity',    name_am: 'የብርሃን ስሜት' },
  { id: 'lens-durability', name_en: 'Lens Durability',       name_am: 'የሌንስ ጥንካሬ' },
]

// ─── Existing Frame Shape Categories ───
const categories = [
  { id: 'all', name_en: 'All Frames' },
  { id: 'cat-eye-butterfly', name_en: 'Cat-Eye / Butterfly' },
  { id: 'rounded-rectangle', name_en: 'Rounded Rectangle' },
  { id: 'round-oval', name_en: 'Round / Oval' },
  { id: 'wayfarer-square', name_en: 'Wayfarer / Square' },
  { id: 'sunglasses', name_en: 'Sunglasses' },
  { id: 'rectangle', name_en: 'Rectangle' },
  { id: 'modified-rectangle', name_en: 'Modified Rectangle' },
]

// ─── Glasses Data (with lens category & need associations) ───
const glasses = [
  { id: '1',  name_en: 'Cat-Eye Black Frame',            glass_code: '28 011 52 17-140 C5', image_url: '/Glasses/Cat-Eye  Butterfly.webp', category_slug: 'cat-eye-butterfly', glass_categories: { name_en: 'Cat-Eye / Butterfly' }, lens_category_slugs: ['correct-your-vision'], lens_need_slugs: ['for-kids', 'far-vision'] },
  { id: '2',  name_en: 'Soft Cat-Eye Black Frame',        glass_code: '28 098 51 15-140 C1', image_url: '/Glasses/Cat-Eye.webp', category_slug: 'cat-eye-butterfly', glass_categories: { name_en: 'Cat-Eye / Butterfly' }, lens_category_slugs: ['correct-your-vision', 'enhance-your-vision'], lens_need_slugs: ['near-vision', 'light-sensitivity'] },
  { id: '3',  name_en: 'Matte Brown/Taupe Frame',         glass_code: '72 043 51 19 148 C6', image_url: '/Glasses/Rounded Rectangle.webp', category_slug: 'rounded-rectangle', glass_categories: { name_en: 'Rounded Rectangle' }, lens_category_slugs: ['correct-your-vision', 'protect-your-eyes'], lens_need_slugs: ['for-kids', 'blue-light-protection'] },
  { id: '4',  name_en: 'Classic Round Black Frame',       glass_code: '1261 48 18 C1', image_url: '/Glasses/Round-Oval.webp', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['correct-your-vision', 'enhance-your-vision'], lens_need_slugs: ['far-vision', 'near-vision'] },
  { id: '5',  name_en: 'Round Wire/Thin Black Frame',     glass_code: '1395 49 17 C1', image_url: '/Glasses/Round.webp', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['enhance-your-vision'], lens_need_slugs: ['light-sensitivity', 'lens-durability'] },
  { id: '6',  name_en: 'Thick Square Black Frame',        glass_code: '02003 50 21-145 C1', image_url: '/Glasses/Wayfarer-Square.avif', category_slug: 'wayfarer-square', glass_categories: { name_en: 'Wayfarer / Square' }, lens_category_slugs: ['correct-your-vision', 'protect-your-eyes'], lens_need_slugs: ['lens-durability', 'sun-protection'] },
  { id: '7',  name_en: 'Clear / Pastel Round Frame',      glass_code: '2132 49 17-140', image_url: '/Glasses/Pastel Round.webp', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['protect-your-eyes', 'enhance-your-vision'], lens_need_slugs: ['blue-light-protection', 'light-sensitivity'] },
  { id: '8',  name_en: 'Thin Rose Gold/Pink Round Frame', glass_code: '2134 50 20-147', image_url: '/Glasses/Thin Rose Gold Round.webp', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['enhance-your-vision'], lens_need_slugs: ['light-sensitivity', 'for-kids'] },
  { id: '9',  name_en: 'Daily Oval Black Frame',           glass_code: '2311 53 17-142 C2', image_url: '/Glasses/Oval-Rounded.webp', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['correct-your-vision'], lens_need_slugs: ['near-vision', 'far-vision'] },
  { id: '10', name_en: 'Ultra-Thin Round Wire Frame',     glass_code: '3111 53 18-145', image_url: '/Glasses/Ultra-Thin Round.avif', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['enhance-your-vision', 'correct-your-vision'], lens_need_slugs: ['lens-durability', 'near-vision'] },
  { id: '11', name_en: 'Minimalist Round Black Frame',    glass_code: '7910 48 18-148', image_url: '/Glasses/Minimalist Round.avif', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['correct-your-vision'], lens_need_slugs: ['for-kids', 'far-vision'] },
  { id: '12', name_en: 'Slim Rectangle Black Frame',       glass_code: '8186 50 17-145 C2', image_url: '/Glasses/Slim Rectangle.webp', category_slug: 'rectangle', glass_categories: { name_en: 'Rectangle' }, lens_category_slugs: ['correct-your-vision', 'protect-your-eyes'], lens_need_slugs: ['blue-light-protection', 'lens-durability'] },
  { id: '13', name_en: 'Square Tinted Sunglasses',         glass_code: '8191 49 23-146', image_url: '/Glasses/Sunglasses.webp', category_slug: 'sunglasses', glass_categories: { name_en: 'Sunglasses' }, lens_category_slugs: ['protect-your-eyes'], lens_need_slugs: ['sun-protection', 'light-sensitivity'] },
  { id: '14', name_en: 'Standard Rectangle Black Frame',   glass_code: '28001 52 17-140 C1', image_url: '/Glasses/Rectangle-Wayfarer.webp', category_slug: 'rectangle', glass_categories: { name_en: 'Rectangle' }, lens_category_slugs: ['correct-your-vision'], lens_need_slugs: ['near-vision', 'far-vision'] },
  { id: '15', name_en: 'Deep Rectangle Black Frame',       glass_code: '28006 52 17-140 C1', image_url: '/Glasses/Deep Rectangle.avif', category_slug: 'rectangle', glass_categories: { name_en: 'Rectangle' }, lens_category_slugs: ['correct-your-vision', 'protect-your-eyes'], lens_need_slugs: ['lens-durability', 'blue-light-protection'] },
  { id: '16', name_en: 'Flared Cat-Eye Black Frame',       glass_code: '28015 49 17-140 C1', image_url: '/Glasses/Flared Cat-Eye.avif', category_slug: 'cat-eye-butterfly', glass_categories: { name_en: 'Cat-Eye / Butterfly' }, lens_category_slugs: ['enhance-your-vision'], lens_need_slugs: ['for-kids', 'light-sensitivity'] },
  { id: '17', name_en: 'Thick Rim Round Black Frame',      glass_code: '28016 46 21-140 C1', image_url: '/Glasses/Thick Rim Round.webp', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['correct-your-vision', 'protect-your-eyes'], lens_need_slugs: ['sun-protection', 'lens-durability'] },
  { id: '18', name_en: 'Angular Rectangle Black Frame',    glass_code: '28020 52 19-140 C1', image_url: '/Glasses/Angular Rectangle.avif', category_slug: 'rectangle', glass_categories: { name_en: 'Rectangle' }, lens_category_slugs: ['correct-your-vision'], lens_need_slugs: ['far-vision', 'near-vision'] },
  { id: '19', name_en: 'Soft Corner Rectangle Black Frame', glass_code: '28022 51 18-140 C1', image_url: '/Glasses/Soft Corner Rectangle.webp', category_slug: 'modified-rectangle', glass_categories: { name_en: 'Modified Rectangle' }, lens_category_slugs: ['correct-your-vision', 'enhance-your-vision'], lens_need_slugs: ['blue-light-protection', 'light-sensitivity'] },
  { id: '20', name_en: 'Bold Curved Cat-Eye Black Frame',  glass_code: '28025 53 18-140 C1', image_url: '/Glasses/Bold Curved Cat-Eye.avif', category_slug: 'cat-eye-butterfly', glass_categories: { name_en: 'Cat-Eye / Butterfly' }, lens_category_slugs: ['protect-your-eyes', 'enhance-your-vision'], lens_need_slugs: ['sun-protection', 'light-sensitivity'] },
]

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeLensCategory, setActiveLensCategory] = useState('all')
  const [activeNeed, setActiveNeed] = useState('all')

  // Filter by frame shape category
  const filteredByCategory = activeCategory === 'all'
    ? glasses
    : glasses.filter(g => g.category_slug === activeCategory)

  // Then filter by lens category
  const filteredByLensCategory = activeLensCategory === 'all'
    ? filteredByCategory
    : filteredByCategory.filter(g => g.lens_category_slugs?.includes(activeLensCategory))

  // Then filter by need
  const filteredGlasses = activeNeed === 'all'
    ? filteredByLensCategory
    : filteredByLensCategory.filter(g => g.lens_need_slugs?.includes(activeNeed))

  return (
    <>
      {/* Hero */}
      <section className="relative py-32 bg-gradient-hero">
        <div className="relative z-10 max-w-content mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300 mb-6">
            Our Collection
          </p>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] text-white font-extrabold mb-6">
            Premium Eyewear
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Discover our curated selection of frames — designed for comfort,
            crafted for style.
          </p>
        </div>
      </section>

      {/* ─── Two-Tier Filter Bar (Sticky) ─── */}
      <div className="sticky top-20 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-content mx-auto px-6 lg:px-8 py-3 space-y-3">
          
          {/* Row 1: Lens Category — left-aligned tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {lensCategories.map((cat) => (
              <button key={cat.id}
                onClick={() => setActiveLensCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap
                           transition-all duration-300
                  ${activeLensCategory === cat.id
                    ? 'bg-primary text-white shadow-primary'
                    : 'bg-gray-100 text-gray-500 hover:bg-primary-100 hover:text-primary'}`}>
                {cat.name_en}
              </button>
            ))}
          </div>

          {/* Row 2: Needs — scrollable pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {lensNeeds.map((need) => (
              <button key={need.id}
                onClick={() => setActiveNeed(need.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap
                           transition-all duration-300 border
                  ${activeNeed === need.id
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'}`}>
                {need.name_en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Frame Shape Category Navigation ─── */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-content mx-auto px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map((cat) => (
              <button key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap
                           transition-all duration-300
                  ${activeCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 text-gray-500 hover:bg-primary-100 hover:text-primary'}`}>
                {cat.name_en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-section bg-snow">
        <div className="max-w-content mx-auto px-6 lg:px-8">
          
          {/* Result count */}
          <p className="text-sm text-gray-400 mb-6">
            {filteredGlasses.length} {filteredGlasses.length === 1 ? 'frame' : 'frames'} found
          </p>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredGlasses.map((glass, i) => (
                <motion.div
                  key={glass.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.05 } }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard glass={glass} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filteredGlasses.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">No frames match your criteria</p>
              <p className="text-gray-300 text-sm">Try adjusting the filters above</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
```

**Premium GlassCard Component:**
```tsx
'use client'
import Image from 'next/image'
import { Glasses } from 'lucide-react'

interface Glass {
  id: string
  name_en: string
  name_am?: string
  glass_code?: string
  image_url?: string
  is_new?: boolean
  is_featured?: boolean
  glass_categories?: { name_en: string; name_am?: string }
  lens_category_slugs?: string[]
  lens_need_slugs?: string[]
}

export function GlassCard({ glass }: { glass: Glass }) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 
                    overflow-hidden hover:shadow-card-hover hover:-translate-y-1
                    transition-all duration-500 ease-out-expo cursor-pointer">
      {/* Image container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden p-8
                      flex items-center justify-center">
        {glass.image_url ? (
          <Image src={glass.image_url} alt={glass.name_en}
            fill className="object-contain p-6 transition-transform 
                            duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
        ) : (
          <Glasses size={64} className="text-gray-200" />
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {glass.is_new && (
            <span className="px-2.5 py-1 rounded-full bg-primary text-white 
                            text-[10px] font-bold uppercase tracking-wider">
              New
            </span>
          )}
          {glass.is_featured && (
            <span className="px-2.5 py-1 rounded-full bg-charcoal text-white 
                            text-[10px] font-bold uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5
                        flex items-center justify-center transition-all duration-300">
          <button className="opacity-0 group-hover:opacity-100 
                             bg-white rounded-full px-5 py-2 text-xs font-medium 
                             text-charcoal shadow-lg transform translate-y-2 
                             group-hover:translate-y-0
                             transition-all duration-300 delay-100"
            aria-label="Quick view">
            Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        {glass.glass_categories && (
          <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
            {glass.glass_categories.name_en}
          </p>
        )}
        <h3 className="font-semibold text-charcoal text-sm mb-1 
                       group-hover:text-primary transition-colors">
          {glass.name_en}
        </h3>
        {glass.glass_code && (
          <p className="text-xs text-gray-400 font-mono">{glass.glass_code}</p>
        )}
      </div>
    </div>
  )
}
```

---

### 7.6 Contact Page (`app/[locale]/contact/page.tsx`)

```tsx
<section className="py-section">
  <div className="max-w-content mx-auto px-6 lg:px-8">
    <div className="text-center mb-16">
      <p className="pretitle">Get In Touch</p>
      <h1 className="text-display-lg">Contact Us</h1>
    </div>

    <div className="grid lg:grid-cols-5 gap-16">
      {/* Left: Contact cards (2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        {[
          { icon: <MapPin />, label: 'Visit Us', 
            value: 'Meskel Flower Branch, Next to Dreamliner Hotel, Sherifa Bldg, 2nd Floor' },
          { icon: <Phone />, label: 'Call Us', 
            value: '0902 642 222 / 0902 642 223' },
          { icon: <Mail />, label: 'Email Us', 
            value: 'sunopticsmeskelflower@gmail.com' },
          { icon: <Clock />, label: 'Working Hours', 
            value: 'Mon-Sat: 8:00 AM - 6:00 PM' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 p-5 rounded-xl bg-snow 
                       border border-gray-100 hover:border-primary/20 
                       hover:shadow-subtle transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary 
                            flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-sm text-charcoal font-medium">{item.value}</p>
            </div>
          </motion.div>
        ))}

        {/* Social Links */}
        <div className="flex gap-3 pt-4">
          {[
            { href: 'https://web.facebook.com/sunopticsmeskelflower', icon: 'facebook' },
            { href: 'https://www.instagram.com/sun_optics_meskel_flower', icon: 'instagram' },
            { href: 'https://www.tiktok.com/@sunopticsmeskelflower', icon: 'tiktok' },
            { href: 'https://t.me/Sunopticsmeskelflowerbranch', icon: 'telegram' },
          ].map(social => (
            <a key={social.icon} href={social.href} target="_blank" rel="noopener"
               className="w-10 h-10 rounded-full border border-gray-200 
                           flex items-center justify-center text-gray-400
                           hover:bg-primary hover:border-primary hover:text-white
                           transition-all duration-300">
              <SocialIcon name={social.icon} size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* Right: Google Map (3 cols) */}
      <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-lg 
                       border border-gray-100 min-h-[400px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18...meskelflower..."
          width="100%" height="100%" loading="lazy"
          className="min-h-[400px] lg:min-h-full"
          style={{ border: 0 }}
        />
      </div>
    </div>
  </div>
</section>
```

---

### 7.7 Footer (`components/layout/Footer.tsx`)

```tsx
<footer className="bg-gradient-dark text-white">
  {/* Main footer content */}
  <div className="max-w-content mx-auto px-6 lg:px-8 py-20">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
      
      {/* Col 1: Brand */}
      <div className="lg:col-span-1">
        <span className="text-2xl font-bold tracking-tight block mb-4">
          Sam<span className="text-primary">vision</span>
        </span>
        <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
          Speciality Eye Clinic & Optical Works. Expert eye care and premium 
          eyewear in the heart of Addis Ababa.
        </p>
        {/* Social icons */}
        <div className="flex gap-3">
          {socialLinks.map(social => (
            <a key={social.icon} href={social.href} target="_blank"
               className="w-9 h-9 rounded-full border border-white/10 
                           flex items-center justify-center text-white/40
                           hover:bg-primary hover:border-primary hover:text-white
                           transition-all duration-300">
              <SocialIcon name={social.icon} size={14} />
            </a>
          ))}
        </div>
      </div>

      {/* Col 2: Quick Links */}
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] 
                       text-white/30 mb-5">Quick Links</h4>
        <ul className="space-y-3">
          {['About', 'Services', 'Products', 'Contact'].map(link => (
            <li key={link}>
              <Link href={`/${link.toLowerCase()}`}
                className="text-sm text-white/50 hover:text-white 
                           transition-colors duration-200">
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Col 3: Services */}
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] 
                       text-white/30 mb-5">Services</h4>
        <ul className="space-y-3">
          <li><span className="text-sm text-white/50">Computerized Eye Testing</span></li>
          <li><span className="text-sm text-white/50">Optical Dispensary</span></li>
          <li><span className="text-sm text-white/50">Frame Fitting</span></li>
          <li><span className="text-sm text-white/50">Lens Solutions</span></li>
        </ul>
      </div>

      {/* Col 4: Contact */}
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] 
                       text-white/30 mb-5">Contact</h4>
        <div className="space-y-3 text-sm text-white/50">
          <p>0902 642 222 / 0902 642 223</p>
          <p>sunopticsmeskelflower@gmail.com</p>
          <p>Meskel Flower Branch, Addis Ababa</p>
          <p className="text-white/30">Mon - Sat: 8:00 AM - 6:00 PM</p>
        </div>
      </div>
    </div>
  </div>

  {/* Bottom bar */}
  <div className="border-t border-white/5">
    <div className="max-w-content mx-auto px-6 lg:px-8 py-6 
                    flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-xs text-white/25">
        © {new Date().getFullYear()} Samvision Eye Clinic. All rights reserved.
      </p>
      <div className="flex gap-6">
        <Link href="/privacy" className="text-xs text-white/25 hover:text-white/50 
                                         transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="text-xs text-white/25 hover:text-white/50 
                                        transition-colors">Terms of Service</Link>
      </div>
    </div>
  </div>
</footer>
```

---

## 8. Booking System

### 8.1 Booking Page (`app/[locale]/book/page.tsx`)

**Premium multi-step booking with animated progress indicator:**

```
Step 1: SELECT SERVICE → Step 2: SELECT DATE & STAFF → Step 3: YOUR DETAILS
```

#### Step Indicator (Premium)
```tsx
function StepIndicator({ currentStep, totalSteps = 3 }) {
  const steps = ['Select Service', 'Date & Time', 'Your Details']
  
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((label, i) => (
        <Fragment key={i}>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                            text-sm font-bold transition-all duration-500
              ${i < currentStep 
                ? 'bg-primary text-white shadow-primary' 
                : i === currentStep 
                  ? 'bg-primary text-white shadow-primary-lg scale-110' 
                  : 'bg-gray-100 text-gray-400'}`}>
              {i < currentStep ? <Check size={18} /> : i + 1}
            </div>
            <span className={`text-xs font-medium transition-colors duration-300
              ${i <= currentStep ? 'text-primary' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-16 lg:w-24 h-0.5 mx-2 rounded-full transition-all duration-500
              ${i < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
          )}
        </Fragment>
      ))}
    </div>
  )
}
```

#### BookingForm.tsx (React Hook Form + Zod)

```ts
// lib/booking-schema.ts
import { z } from 'zod'

export const bookingSchema = z.object({
  service_id:        z.string().uuid('Please select a service'),
  staff_id:          z.string().uuid().optional(),
  booking_date:      z.date({ required_error: 'Please select a date' }),
  booking_time:      z.string().min(1, 'Please select a time slot'),
  first_name:        z.string().min(1, 'First name required'),
  last_name:         z.string().min(1, 'Last name required'),
  email:             z.string().email('Valid email required'),
  phone:             z.string().min(9, 'Valid phone required'),
  address:           z.string().optional(),
  reason:            z.string().optional(),
  special_requests:  z.string().optional(),
  guest_emails:      z.array(z.string().email()).max(10).optional(),
  glasses_interest:  z.array(z.string().uuid()).optional(),
})
```

#### Service Selector (Premium Cards Instead of Dropdown)

```tsx
// Instead of a simple dropdown, use visual cards like Essilor's product selection
{services.map(service => (

```

---

## 9. Admin Panel

### 9.1 Admin Dashboard (`app/admin/page.tsx`)

The admin dashboard provides quick-access cards for managing all site content:

- **Bookings** — Manage patient bookings, view/update status
- **Services** — Manage clinic services
- **Products** — Manage eyewear products (including Lens Category & Needs assignments)
- **Settings** — Site configuration

### 9.2 Admin Products Page (`app/admin/products/page.tsx`)

A full CRUD manager for eyewear products, with the ability to assign:

1. **Frame Shape Category** (Cat-Eye / Round / Rectangle, etc.) — from `glass_categories`
2. **Lens Category** (Correct / Protect / Enhance) — from `lens_categories`
3. **Lens Needs** (Kids / Near Vision / Blue Light, etc.) — from `lens_needs`

The page features:
- Table view of all glasses with columns for name, code, category, lens categories, and needs
- Inline badge display of assigned lens categories and needs
- Edit form with select dropdowns and multi-select checkboxes
- Save functionality to update the junction tables

```tsx
// Example product listing table with filter tags
<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-50 border-b border-gray-100">
      <tr>
        <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
        <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
        <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Frame Shape</th>
        <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lens Category</th>
        <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Needs</th>
        <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-50">
      {glasses.map(glass => (
        <tr key={glass.id} className="hover:bg-gray-50 transition-colors">
          <td className="p-4 text-sm font-medium text-charcoal">{glass.name_en}</td>
          <td className="p-4 text-sm text-gray-400 font-mono">{glass.glass_code}</td>
          <td className="p-4">
            <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary text-[10px] font-medium">
              {glass.glass_categories?.name_en}
            </span>
          </td>
          <td className="p-4">
            <div className="flex gap-1 flex-wrap">
              {glass.lens_category_slugs?.map(slug => (
                <span key={slug} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-medium">
                  {lensCategoriesMap[slug]}
                </span>
              ))}
            </div>
          </td>
          <td className="p-4">
            <div className="flex gap-1 flex-wrap">
              {glass.lens_need_slugs?.map(slug => (
                <span key={slug} className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-medium">
                  {lensNeedsMap[slug]}
                </span>
              ))}
            </div>
          </td>
          <td className="p-4">
            <button className="text-primary text-sm font-medium hover:underline">Edit</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### 9.3 Admin API Routes

```
POST   /api/admin/products           — Create a new product with lens category & need assignments
PUT    /api/admin/products/:id       — Update product and its associations
DELETE /api/admin/products/:id       — Soft-delete product
GET    /api/admin/products           — List all products with their lens categories and needs
```

---

## 10. Language Switching (EN / Amharic)

The site uses `next-intl` for full bilingual support. All user-facing filter labels in the products page are translated:

```json
// messages/en.json — Products filter keys
{
  "products": {
    "heroPretitle": "Our Collection",
    "heroTitle": "Premium Eyewear",
    "heroSubtitle": "Discover our curated selection of frames — designed for comfort, crafted for style.",
    "framesFound": "{count} frame | {count} frames",
    "noFrames": "No frames match your criteria",
    "tryAdjusting": "Try adjusting the filters above",
    "lensCategories": {
      "all": "All",
      "correctYourVision": "Correct Your Vision",
      "protectYourEyes": "Protect Your Eyes",
      "enhanceYourVision": "Enhance Your Vision"
    },
    "needs": {
      "all": "All",
      "forKids": "For Kids",
      "nearVision": "Near Vision",
      "farVision": "Far Vision",
      "blueLightProtection": "Blue Light Protection",
      "sunProtection": "Sun Protection",
      "lightSensitivity": "Light Sensitivity",
      "lensDurability": "Lens Durability"
    },
    "frameShapes": {
      "all": "All Frames",
      "catEyeButterfly": "Cat-Eye / Butterfly",
      "roundedRectangle": "Rounded Rectangle",
      "roundOval": "Round / Oval",
      "wayfarerSquare": "Wayfarer / Square",
      "sunglasses": "Sunglasses",
      "rectangle": "Rectangle",
      "modifiedRectangle": "Modified Rectangle"
    }
  }
}
```

---

## 11. Google Reviews Integration

...

---

## 12. Premium Animation & Interaction System

...

---

...continued sections unchanged from original...
```

---

**Note:** The full implementation guide already shown in previous sections (10-17) would continue here unchanged. The key additions are:
- New DB tables `lens_categories`, `lens_needs`, `glasses_lens_categories`, `glasses_lens_needs` in Section 5
- Updated Products page with two-tier filtering in Section 7.5
- Admin products management docs in Section 9
- Bilingual filter label keys in Section 10