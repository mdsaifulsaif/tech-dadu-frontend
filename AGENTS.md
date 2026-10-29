<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Frontend Development Rules & Guidelines

You are an expert **Frontend Engineer** specialized in Next.js (App Router), React 19, TypeScript, and Tailwind CSS (v4). You are working on the **tech-dadu-frontend** application.

Always adhere strictly to the following rules and project conventions.

---

## 🚀 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS (v4 with Turbopack)
- **Language:** TypeScript
- **Linting:** ESLint 9

---

## 🏗️ Architecture & Directory Structure
Follow modern Next.js App Router conventions:
```text
app/
├── (auth)/         # Route group for auth pages (login, register)
├── (dashboard)/    # Route group for dashboard/protected pages
├── api/            # API Route handlers (if needed)
├── layout.tsx      # Root layout
├── page.tsx        # Homepage
└── globals.css     # Global CSS and Tailwind directives

components/         # Reusable UI components
├── common/         # Buttons, Inputs, Modals, Loaders
├── layout/         # Header, Navbar, Footer, Sidebar
└── features/       # Feature-specific components

lib/                # Utility functions, API clients, constants
hooks/              # Custom React hooks
types/              # Global TypeScript interfaces & type declarations
public/             # Static assets (images, icons, fonts)
```

---

## 📏 Coding Standards & Best Practices

### 1. Server vs. Client Components
- Default to **Server Components** (`RSC`) for data fetching, SEO, and static rendering.
- Use `"use client"` only when necessary (e.g., hooks like `useState`, `useEffect`, browser event listeners, interactive UI).
- Keep Client Components lean by pushing logic down to the leaves of the component tree.

### 2. TypeScript & Props
- Define explicit TypeScript interfaces for all component props.
- Avoid using `any`; define concrete types in `types/` or co-locate with components.
- Ensure strict null-checks and safe optional chaining.

### 3. Styling with Tailwind CSS v4
- Use Tailwind utility classes directly for styling.
- Ensure modern, responsive design (mobile-first approach: `sm:`, `md:`, `lg:`).
- Maintain consistent color palettes, typography, and spacing across all components.
- Keep UI accessible (use appropriate ARIA labels, semantic HTML tags like `<button>`, `<nav>`, `<main>`, `<article>`).

### 4. API Integration & State Management
- Handle API calls cleanly with error boundaries and loading states (skeleton loaders or spinners).
- Use `NEXT_PUBLIC_` prefix for client-accessible environment variables (e.g. `NEXT_PUBLIC_API_URL`).
- Keep backend API URL configurable via environment variables (never hardcode `http://localhost:5000`).

---

## 📌 USER CUSTOM RULES (Add your own rules here)
<!-- You can add any specific rules you want the agent to remember every time. -->
1. Keep UI modern, responsive, and clean.
2. Provide concise explanations and avoid unnecessary breaking changes.
3. Write accessible, semantic HTML and reusable React components.
