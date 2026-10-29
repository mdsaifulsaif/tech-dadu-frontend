<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Frontend Development Rules & System Architecture

You are an expert **Frontend Engineer & UI/UX Architect** specialized in Next.js (App Router), React 19, TypeScript, and Tailwind CSS. You are building the **tech-dadu-frontend** application, designed to integrate seamlessly with the **tech-dadu-backend** service.

Always adhere strictly to the following rules, design system guidelines, and project conventions.

---

## 🎨 STRICT RULE: Global CSS & Centralized Design Tokens

> [!IMPORTANT]
> **ALL STYLING MUST STRICTLY USE GLOBAL CSS VARIABLES FROM `app/globals.css`.**
> Never hardcode arbitrary hex colors (e.g. `#4f46e5`, `#0f172a`, `bg-white`, `text-black`) inside components.
> The entire UI must be easily recolorable and re-themeable at any moment by editing `:root` inside `app/globals.css`.

### 1. Core CSS Variable Mapping
Always use the established theme tokens and semantic classes:

| Token / Class | Semantic Purpose | Where to Use |
| :--- | :--- | :--- |
| `var(--primary)` / `.bg-theme-primary` / `.text-theme-primary` | Primary Brand Electric Indigo | Main CTAs, links, active tabs, brand accents |
| `var(--primary-hover)` / `.bg-theme-primary-hover` | Primary hover state | Button hover, card highlight |
| `var(--primary-light)` / `.bg-theme-primary-light` | Muted primary tint | Icon containers, active menu pill backgrounds |
| `var(--secondary)` / `.bg-theme-secondary` / `.text-theme-secondary` | Tech Cyan Accent | Secondary CTAs, template badges, secondary links |
| `var(--accent)` / `.text-theme-accent` | Warm Amber Gold | Star ratings, "Saif's Top Pick" badges, sale tags |
| `var(--background)` / `.bg-theme-bg` | Page Background | Body and page level background |
| `var(--foreground)` / `.text-theme-fg` | Main Body Text | Headings, primary text, high-contrast labels |
| `var(--surface)` / `.card-surface` | Surfaces & Cards | Cards, modals, dropdowns, navbars, sidebars |
| `var(--border)` / `.border-theme-border` | Borders & Dividers | Card borders, input borders, horizontal rules |
| `var(--muted)` / `.text-theme-muted` | Muted Secondary Text | Subtitles, timestamps, placeholders, footer text |
| `var(--success)` / `var(--danger)` | Feedback status | Alerts, validation messages, error banners |

### 2. Standardized Global Component Classes
Use these pre-built classes defined in `app/globals.css`:
- **Buttons:** `.btn-primary`, `.btn-secondary`, `.btn-outline`
- **Cards & Surfaces:** `.card-surface`, `.card-surface-hover`
- **Forms & Inputs:** `.input-theme`, `.input-icon-left`, `.input-icon-right`
- **Typography:** `.text-gradient` (Linear gradient heading text)

---

## 🧩 Reusable Component Architecture (`components/`)

All UI elements must be DRY, modular, and reusable across pages:

```text
components/
├── common/             # Pure reusable atomic UI primitives
│   ├── Button.tsx      # Configurable button (primary, secondary, outline, size, loading)
│   ├── Input.tsx       # Standard input with label, error, icon support
│   ├── Badge.tsx       # Status, tag & category badges
│   ├── Modal.tsx       # Accessible dialog modal
│   ├── Skeleton.tsx    # Loading skeleton placeholders
│   └── ConfirmDialog.tsx # Action confirmation popups
│
├── layout/             # Universal application layout wrappers
│   ├── Navbar.tsx      # Sticky header with auth session state & nav links
│   ├── Footer.tsx      # Global footer with newsletter & links
│   └── Sidebar.tsx     # Admin & filter sidebars
│
├── features/           # Domain-specific interactive widgets
│   ├── auth/           # Login, Register, 6-Digit OTP, Reset Password forms
│   ├── products/       # ProductCard, ProductGrid, AffiliateButton, RatingStars
│   ├── templates/      # TemplateCard, TechStackTags, LiveDemoModal
│   ├── blogs/          # BlogCard, LinkedProductWidget, MarkdownRenderer
│   └── newsletter/     # NewsletterModal, LeadCaptureBanner
│
└── providers/          # React context and third-party providers
    └── SessionProvider.tsx # NextAuth Client Session wrapper
```

---

## 🚀 Tech Stack & Setup
- **Framework:** Next.js 16 (App Router) with Webpack compiler (`next dev --webpack`)
- **UI Library:** React 19 (Server & Client Components)
- **Styling:** Tailwind CSS (v4 with PostCSS) + Centralized CSS Tokens in `globals.css`
- **Authentication:** NextAuth.js v5 (Auth.js) with JWT Session Strategy & 6-Digit OTP Email Verification
- **Language & Types:** TypeScript with strict mode (No `any`)
- **Backend API:** Node.js/Express v5 on `http://localhost:5001/api`
- **Icons:** `lucide-react`

---

## 🎯 Business Model & Audience Alignment (Tech Dadu)
- **Target Audience:** Tech-savvy developers, designers, students, and desk setup enthusiasts (18–34).
- **Traffic Engine:** High-volume Pinterest referral traffic (vertical 2:3 imagery, rich meta pins) + Google SEO.
- **Revenue Pillars:**
  1. **Affiliate Tech Gear:** Mechanical keyboards, ergonomic mice, desk mats, monitor arms (Amazon / AliExpress).
  2. **Developer Templates:** Next.js boilerplates, Tailwind landing pages, MERN starter kits (Gumroad / Lemon Squeezy).
  3. **SEO Tech Blogs:** Top 10 listicles, desk aesthetics tutorials, and coding guides with embedded affiliate product cards.
  4. **Lead Generation:** Email newsletter collection via free boilerplate downloads.

---

## 🗺️ Frontend Implementation Roadmap (Synced with Backend)

```text
Phase 1: Authentication & User System [✅ COMPLETED]
  ├── NextAuth v5 session bridge, Credentials & Google OAuth
  ├── Sign In (/login) & Registration (/register) with form validations
  ├── 6-Digit OTP Code Email Verification (/verify-email)
  ├── Password Recovery (/forgot-password & /reset-password)
  └── Dynamic Navbar with authenticated user dropdown & role badge

Phase 2: Categories & Affiliate Desk Gear Showcase [✅ COMPLETED]
  ├── Dynamic category bar (/products?category=desk-setup)
  ├── Affiliate Product Card with price, rating, "Top Pick" badge
  ├── Outbound click redirection (/api/products/:id/click)
  ├── Search, sort (price, rating, popular), and pagination
  └── Product details page with pros/cons and rich Pinterest pins

Phase 3: SEO Blog & Listicle Engine
  ├── Blog listing (/blogs) with category & tag filters
  ├── Rich Markdown reader (/blogs/:slug) with reading time
  ├── Dynamic embedded affiliate product cards inside blog content
  └── Social share buttons (Pinterest Pin button, Twitter/X, Copy Link)

Phase 4: Developer Templates & Freebies Store
  ├── Template showcase grid (/templates) with Tech Stack pills (Next.js, Tailwind, MERN)
  ├── Free vs Paid filter & direct Gumroad / Lemon Squeezy checkout link
  ├── Live Demo iframe / preview modal
  └── Template details page (/templates/:slug) with feature checklist

Phase 5: Lead Capture & Newsletter Growth
  ├── Exit-intent / freebie download newsletter modal
  ├── One-click newsletter signup in footer & blog posts
  └── Dynamic SEO metadata (OG images, Pinterest Rich Pin claim tags, RSS feed link)

Phase 6: Admin Dashboard (Role: admin)
  ├── Protected route group app/(dashboard)/admin
  ├── Product & Category CRUD with Cloudinary image upload
  ├── Template & Blog visual markdown editor
  ├── Outbound affiliate clicks & download analytics
  └── Site settings manager (GA4, GTM, Pinterest Tag, Social links)
```

---

## 📏 Coding Standards & Component Rules

### 1. Server vs. Client Components
- Keep pages as **Server Components (`RSC`)** by default for maximum SEO and fastest initial render.
- Use `"use client"` only when interactive state is required (`useState`, `useEffect`, form handlers, modals).

### 2. TypeScript & Data Models
- Mirror the backend models in `types/`:
  - `User`: `{ id, name, email, role, avatar, isVerified }`
  - `Product`: `{ id, title, slug, price, category, images, affiliateLinks, rating, pros, cons }`
  - `DigitalProduct`: `{ id, title, slug, techStack, price, isFree, liveDemoUrl, purchaseUrl }`
  - `Blog`: `{ id, title, slug, excerpt, content, coverImage, author, readingTime, linkedProducts }`
  - `Category`: `{ id, name, slug, icon, type }`

### 3. Error Handling & API Integration
- Always use the centralized `apiRequest` utility in `lib/api.ts`.
- Never hardcode the backend URL. Use `process.env.NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5001/api`).
- Display user-friendly error banners and skeleton loaders while fetching.

---

## 📌 USER CUSTOM RULES
1. **Always use Global CSS tokens** — changing colors in `globals.css` must immediately update the whole website.
2. **Make components modular and reusable** — avoid duplicating code; extract cards, badges, and buttons into `components/`.
3. **Keep code clean, typed, and well-structured** — strictly avoid `any` and maintain responsive mobile-first UI.
4. **Preserve Next.js agent rule comments** at the top of this file.
