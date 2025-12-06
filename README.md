# Personal Website Fernando Torres

A personal portfolio and blog website serving as my professional landing page on the internet.

## Author

**Fernando Torres** — MSx '26, Stanford GSB

- GitHub: [github.com/FernandoTN](https://github.com/FernandoTN)
- LinkedIn: [linkedin.com/in/fernandotn](https://www.linkedin.com/in/fernandotn/)
- Resume: `/content/Profile.pdf`

## Purpose

This website serves multiple goals:

- **Professional Portfolio** — Showcase my background, skills, and experience for potential employment opportunities
- **Project Documentation** — Document coding projects, technical work, and contributions from my career in pharma
- **Blog Platform** — Host written content organized into thematic series

## Blog Series

### AI Agentic Capabilities (25 posts)

A comprehensive research series from Stanford GSB GSBGEN 390 (Autumn 2024) exploring what's really blocking AI agents from production deployment.

**Research Scope:**
- 36 expert interviews
- 5 industry conferences
- 3 functional prototypes

**Key Findings:**
| Insight | Statistic |
|---------|-----------|
| System integration is the #1 blocker | 92% of sources |
| Enterprise pilot failure rate | 90% |
| Framework abandonment in production | 80-90% |
| Model contribution to success | Only 30-40% |

**Publication Categories:**
- 1 Anchor post (research overview)
- 6 Theme deep dives
- 6 Emergent insights
- 5 Practitioner interviews
- 3 Prototype learnings
- 3 Conference insights
- 1 Methodology post

All 25 posts are pre-written in `/content/deliverables/blog-posts/` as MDX files ready for integration.

## Design Principles

### Animations & Interactions
- Smooth scroll-based animations and parallax effects
- Micro-interactions on hover and click states
- Page transitions and element reveal animations
- Performance-optimized animations (GPU-accelerated, reduced motion support)

### Responsive Design
- **Desktop-first** approach with full visual experience
- **Tablet-optimized** layouts for medium viewports
- **Mobile-adaptive** design ensuring usability on smartphones
- Fluid typography and spacing scales

## Color Palette

### Light Mode (Crisp, Icy)

#### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| White Base | `#FFFFFF` | Main background |
| Icy Blue Tint | `#F4F9FF` | Subtle panels |
| Soft Neutral Grey | `#E9EFF5` | Dividers, cards |

#### Text
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Text | `#0F1A2A` | Headings, body |
| Secondary Text | `#4B637D` | Subtitles, labels |
| Muted Text | `#8DA1B5` | Captions, hints |

#### Accents
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Accent | `#3B82F6` | Links, CTAs, focus |
| Secondary Accent | `#06B6D4` | Highlights, icons |
| Success | `#10B981` | Positive states |
| Warning | `#F59E0B` | Caution states |
| Error | `#EF4444` | Error states |

#### Borders & Shadows
| Token | Value |
|-------|-------|
| Border Light | `#DCE3EC` |
| Shadow Light | `rgba(15, 26, 42, 0.08)` |

---

### Dark Mode (Deep Midnight)

#### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| Dark Base | `#0A0F16` | Main background |
| Deep Blue Layer | `#0F1724` | Elevated surfaces |
| Panel/Surface | `#1B2433` | Cards, modals |

#### Text
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Text | `#F2F6FF` | Headings, body |
| Secondary Text | `#C1CCDD` | Subtitles, labels |
| Muted Text | `#8A96AA` | Captions, hints |

#### Accents
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Accent | `#3B82F6` | Links, CTAs, focus |
| Secondary Accent | `#38BDF8` | Aqua glow highlights |
| Success | `#34D399` | Positive states |
| Warning | `#FBBF24` | Caution states |
| Error | `#F87171` | Error states |

#### Borders & Shadows
| Token | Value |
|-------|-------|
| Border Dark | `#233044` |
| Glow Shadow | `rgba(59, 130, 246, 0.25)` |

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 14+ (App Router) | SSR/SSG for SEO, API routes, Vercel-native |
| **Language** | TypeScript | Type safety end-to-end |
| **Database** | PostgreSQL + Prisma | Content storage, scheduling, type-safe ORM |
| **Styling** | Tailwind CSS | Utility-first, responsive design, design tokens |
| **Animations** | Framer Motion + GSAP | Component animations + scroll-triggered effects |
| **Auth** | NextAuth.js | Single admin user authentication |
| **Content** | MDX | Markdown with React component support |
| **SEO** | next-sitemap + next-seo | Auto sitemaps, meta tags, structured data |
| **Analytics** | Vercel Analytics + Google Search Console API | Traffic metrics + SEO dashboard |
| **Scheduling** | Vercel Cron | Automated post publishing |
| **Hosting** | Vercel | Deployment, edge functions, Postgres hosting |

### Key Packages

```
# Core
next
react
typescript
prisma
@prisma/client

# Styling & Animation
tailwindcss
framer-motion
gsap

# Auth & Content
next-auth
next-mdx-remote
gray-matter

# SEO
next-seo
next-sitemap

# Admin Dashboard
@tanstack/react-query
recharts
```

## Project Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Public-facing pages
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── blog/           # Blog listing & posts
│   │   │   ├── projects/       # Project showcase
│   │   │   └── about/          # About page
│   │   ├── admin/              # Admin dashboard (protected)
│   │   │   ├── posts/          # Post management
│   │   │   ├── analytics/      # Traffic & SEO dashboard
│   │   │   └── settings/       # Site settings
│   │   ├── api/                # API routes
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── animations/         # Animation wrappers
│   │   └── sections/           # Page sections
│   ├── lib/
│   │   ├── prisma.ts           # Database client
│   │   ├── auth.ts             # Auth configuration
│   │   └── utils.ts            # Utility functions
│   └── styles/
│       └── globals.css         # Global styles & Tailwind
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                     # Static assets
├── content/                    # Stanford Research Content
│   ├── deliverables/
│   │   ├── blog-posts/         # 25 MDX posts ready for integration
│   │   ├── linkedin-posts/     # 25 LinkedIn promotional posts
│   │   └── images/             # Cover images and diagrams
│   ├── source-materials/       # Research source documents
│   ├── Final_Report.md         # Full Stanford research report (centerpiece)
│   ├── profile-photo.jpg       # Author headshot
│   ├── Profile.pdf             # Resume/CV for download
│   ├── BLOG_POST_TEMPLATE.mdx  # Post template
│   ├── key_quotes_database.md  # Quotes reference
│   └── data_points_reference.md # Statistics reference
└── README.md
```

## Development

See [`app_spec.txt`](./app_spec.txt) for the complete project specification including:
- Detailed feature requirements
- Database schema
- API endpoints
- MDX components library
- Implementation phases

### Implementation Phases

| Phase | Focus | Key Deliverables |
|-------|-------|------------------|
| **Phase 1** | Foundation & Public Site | Homepage, About, Projects, Contact — all animated and responsive |
| **Phase 2** | Blog & Content System | MDX blog, comments, newsletter, Research page, full SEO |
| **Phase 3** | Admin Dashboard & Analytics | Content management, scheduling, analytics integration |

### Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Initialize database
pnpm prisma migrate dev

# Run development server
pnpm dev
```

## License

*To be determined*
