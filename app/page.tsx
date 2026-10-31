import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Laptop,
  Layers,
  BookOpen,
  Star,
  ExternalLink,
  CheckCircle2,
  Code2,
  Palette,
} from "lucide-react";
import { auth } from "@/auth";
import { productApi, templateApi, blogApi } from "@/lib/api";
import { IProduct, IDigitalProduct, IBlog } from "@/types";
import { ProductCard } from "@/components/features/products/ProductCard";
import { TemplateCard } from "@/components/features/templates/TemplateCard";
import { BlogCard } from "@/components/features/blogs/BlogCard";
import { NewsletterBox } from "@/components/features/newsletter/NewsletterBox";

export default async function Home() {
  const session = await auth();

  // Fetch live showcase items with graceful fallbacks
  let products: IProduct[] = [];
  let templates: IDigitalProduct[] = [];
  let uiDesigns: IDigitalProduct[] = [];
  let blogs: IBlog[] = [];

  try {
    const [pRes, tRes, uRes, bRes] = await Promise.allSettled([
      productApi.getAll({ limit: 4 }),
      templateApi.getAll({ limit: 6 }),
      templateApi.getAll({ category: "ui-ux-design", limit: 3 }),
      blogApi.getAll({ limit: 3 }),
    ]);

    if (pRes.status === "fulfilled" && pRes.value.success && pRes.value.data) {
      products = pRes.value.data.products || pRes.value.data || [];
    }
    if (tRes.status === "fulfilled" && tRes.value.success && tRes.value.data) {
      const allTemplates = tRes.value.data.templates || tRes.value.data || [];
      // Separate code templates from UI/UX design kits
      templates = allTemplates
        .filter((t: IDigitalProduct) => {
          const catSlug = typeof t.category === "object" ? t.category?.slug : "";
          return catSlug !== "ui-ux-design";
        })
        .slice(0, 3);
    }
    if (uRes.status === "fulfilled" && uRes.value.success && uRes.value.data) {
      uiDesigns = uRes.value.data.templates || uRes.value.data || [];
    }
    if (bRes.status === "fulfilled" && bRes.value.success && bRes.value.data) {
      blogs = bRes.value.data.blogs || bRes.value.data || [];
    }
  } catch { }

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-theme-border bg-theme-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-primary-light text-theme-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tech Dadu Dev & Setup Hub 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-theme-fg max-w-4xl mx-auto leading-tight sm:leading-tight">
            Curate Your Dream <span className="text-gradient">Desk Setup</span>, Level Up With Templates & Figma Kits
          </h1>

          <p className="mt-6 text-base sm:text-lg text-theme-muted max-w-2xl mx-auto leading-relaxed">
            Handpicked mechanical keyboards, ergonomic monitors, Next.js boilerplates, and
            expert Figma UI kits — all styled with pure global CSS tokens for effortless theming.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/products" className="btn-primary text-sm px-5 py-3">
              <Laptop className="w-4 h-4" />
              <span>Explore Desk Gear</span>
            </Link>
            <Link href="/templates" className="btn-secondary text-sm px-5 py-3">
              <Layers className="w-4 h-4" />
              <span>Web Templates</span>
            </Link>
            <Link href="/templates?category=ui-ux-design" className="btn-outline text-sm px-5 py-3">
              <Palette className="w-4 h-4" />
              <span>UI/UX Figma Kits</span>
            </Link>
            <Link href="/blogs" className="btn-outline text-sm px-5 py-3">
              <BookOpen className="w-4 h-4" />
              <span>Tech Guides</span>
            </Link>
          </div>

          {/* Quick Session Status Pill */}
          <div className="mt-10 inline-flex items-center gap-3 p-2 px-4 rounded-xl card-surface text-xs text-theme-muted shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-primary"></span>
            </span>
            {session?.user ? (
              <span>
                Logged in as <strong className="text-theme-fg">{session.user.name || session.user.email}</strong> (
                <span className="text-theme-primary font-semibold capitalize">{(session.user as any).role || "user"}</span>)
              </span>
            ) : (
              <span>
                Not logged in —{" "}
                <Link href="/login" className="text-theme-primary font-semibold hover:underline">
                  Sign in here
                </Link>{" "}
                or{" "}
                <Link href="/register" className="text-theme-primary font-semibold hover:underline">
                  Create an account
                </Link>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 4 Pillars Category Value Grid */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-theme-fg">Everything For Modern Builders</h2>
          <p className="text-sm text-theme-muted mt-2">
            Explore our curated hardware, Figma design tokens, battle-tested codebases, and technical guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Affiliate Tech Gear */}
          <div className="card-surface card-surface-hover p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-theme-primary-light text-theme-primary flex items-center justify-center mb-4">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-theme-fg mb-1.5">Curated Desk Gear</h3>
              <p className="text-xs text-theme-muted leading-relaxed mb-4">
                Honest pros & cons reviews for mechanical keyboards, minimalist mousepads, and 4K displays.
              </p>
              <ul className="space-y-1.5 text-xs text-theme-muted mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success shrink-0" />
                  <span>Tested for long coding sessions</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success shrink-0" />
                  <span>Verified affiliate prices</span>
                </li>
              </ul>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-theme-primary flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>Explore Gear</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: UI/UX Design Kits */}
          <div className="card-surface card-surface-hover p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-theme-primary-light text-theme-primary flex items-center justify-center mb-4">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-theme-fg mb-1.5">UI/UX Design Kits</h3>
              <p className="text-xs text-theme-muted leading-relaxed mb-4">
                Figma components, mobile app wireframes, and design systems with auto-layout and dark tokens.
              </p>
              <ul className="space-y-1.5 text-xs text-theme-muted mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success shrink-0" />
                  <span>Figma Auto-Layout & Variables</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success shrink-0" />
                  <span>Free community kits & premium UI</span>
                </li>
              </ul>
            </div>
            <Link
              href="/templates?category=ui-ux-design"
              className="text-xs font-semibold text-theme-primary flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>View Figma Kits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Developer Templates */}
          <div className="card-surface card-surface-hover p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-theme-secondary-light text-theme-secondary flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-theme-fg mb-1.5">Next.js & MERN Kits</h3>
              <p className="text-xs text-theme-muted leading-relaxed mb-4">
                Production-ready boilerplates with TypeScript, Auth, Tailwind CSS, and Stripe/Gumroad ready.
              </p>
              <ul className="space-y-1.5 text-xs text-theme-muted mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success shrink-0" />
                  <span>Strict TypeScript typing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success shrink-0" />
                  <span>Free starter codebases</span>
                </li>
              </ul>
            </div>
            <Link
              href="/templates"
              className="text-xs font-semibold text-theme-secondary flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>View Boilerplates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: SEO Blogs & Listicles */}
          <div className="card-surface card-surface-hover p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-theme-primary-light text-theme-accent flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-theme-fg mb-1.5">Deep-Dive Tech Blogs</h3>
              <p className="text-xs text-theme-muted leading-relaxed mb-4">
                Rich articles exploring desk aesthetics, productivity hacks, and modern full-stack workflows.
              </p>
              <ul className="space-y-1.5 text-xs text-theme-muted mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success shrink-0" />
                  <span>SEO & Pinterest optimized</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success shrink-0" />
                  <span>Interactive product reviews</span>
                </li>
              </ul>
            </div>
            <Link
              href="/blogs"
              className="text-xs font-semibold text-theme-primary flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>Read Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Desk Gear Section */}
      {products.length > 0 && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-theme-border/60">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-theme-primary uppercase tracking-wider mb-1">
                <Laptop className="w-3.5 h-3.5" />
                <span>Featured Hardware</span>
              </div>
              <h2 className="text-2xl font-bold text-theme-fg">Curated Desk Setup Gear</h2>
            </div>
            <Link href="/products" className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Curated UI/UX Design & Figma Kits Section */}
      {uiDesigns.length > 0 && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-theme-border/60">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-theme-primary uppercase tracking-wider mb-1">
                <Palette className="w-3.5 h-3.5" />
                <span>Figma & Design Systems</span>
              </div>
              <h2 className="text-2xl font-bold text-theme-fg">Curated UI/UX Design Kits</h2>
            </div>
            <Link href="/templates?category=ui-ux-design" className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uiDesigns.slice(0, 3).map((kit) => (
              <TemplateCard key={kit._id} template={kit} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Boilerplates Section */}
      {templates.length > 0 && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-theme-border/60">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-theme-primary uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Ship Fast</span>
              </div>
              <h2 className="text-2xl font-bold text-theme-fg">Next.js & Fullstack Boilerplates</h2>
            </div>
            <Link href="/templates" className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.slice(0, 3).map((tmpl) => (
              <TemplateCard key={tmpl._id} template={tmpl} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Technical Articles Section */}
      {blogs.length > 0 && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-theme-border/60">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-theme-primary uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Editorial Content</span>
              </div>
              <h2 className="text-2xl font-bold text-theme-fg">Latest Tech Guides & Listicles</h2>
            </div>
            <Link href="/blogs" className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {/* Global Newsletter Box */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-theme-border/60">
        <NewsletterBox
          source="homepage_bottom"
          title="Join The Tech Dadu Community"
          subtitle="Get weekly curated desk setups, exclusive developer discounts, and free boilerplate releases delivered straight to your inbox."
        />
      </section>
    </div>
  );
}
