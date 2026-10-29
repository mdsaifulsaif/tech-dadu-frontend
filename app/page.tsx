import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Laptop,
  Layers,
  BookOpen,
  ShieldCheck,
  Zap,
  TrendingUp,
  Star,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

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
            Curate Your Dream <span className="text-gradient">Desk Setup</span> & Level Up With Modern Templates
          </h1>

          <p className="mt-6 text-base sm:text-lg text-theme-muted max-w-2xl mx-auto leading-relaxed">
            Handpicked mechanical keyboards, ergonomic monitors, Next.js boilerplates, and
            expert tech reviews — all styled with pure global CSS tokens for effortless theming.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/products" className="btn-primary w-full sm:w-auto text-sm px-6 py-3">
              <Laptop className="w-4 h-4" />
              <span>Explore Desk Gear</span>
            </Link>
            <Link href="/templates" className="btn-secondary w-full sm:w-auto text-sm px-6 py-3">
              <Layers className="w-4 h-4" />
              <span>Browse Web Templates</span>
            </Link>
            <Link href="/blogs" className="btn-outline w-full sm:w-auto text-sm px-6 py-3">
              <BookOpen className="w-4 h-4" />
              <span>Read Tech Guides</span>
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

      {/* Feature Pillars */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-theme-fg">
            Everything Built For <span className="text-gradient">Developers & Creators</span>
          </h2>
          <p className="mt-2 text-sm text-theme-muted max-w-xl mx-auto">
            All styled dynamically through our centralized global CSS design system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Affiliate Tech Gear */}
          <div className="card-surface card-surface-hover p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-theme-primary-light text-theme-primary flex items-center justify-center mb-5">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-theme-fg mb-2">Curated Desk Gear</h3>
              <p className="text-sm text-theme-muted leading-relaxed mb-4">
                Honest pros & cons reviews for mechanical keyboards, minimalist mousepads, and 4K displays
                with outbound tracking.
              </p>
              <ul className="space-y-2 text-xs text-theme-muted mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success" />
                  <span>Tested by developers for long coding sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success" />
                  <span>Direct Amazon & manufacturer affiliate links</span>
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

          {/* Card 2: Developer Templates */}
          <div className="card-surface card-surface-hover p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-theme-secondary-light text-theme-secondary flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-theme-fg mb-2">Next.js & MERN Kits</h3>
              <p className="text-sm text-theme-muted leading-relaxed mb-4">
                Production-ready boilerplates with TypeScript, Auth, Tailwind CSS, and Stripe/Gumroad
                integration to launch SaaS in days.
              </p>
              <ul className="space-y-2 text-xs text-theme-muted mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success" />
                  <span>Clean architecture & strict typing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success" />
                  <span>Free starter templates & premium kits</span>
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

          {/* Card 3: SEO Blogs & Listicles */}
          <div className="card-surface card-surface-hover p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-theme-primary-light text-theme-accent flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-theme-fg mb-2">Deep-Dive Tech Blogs</h3>
              <p className="text-sm text-theme-muted leading-relaxed mb-4">
                Rich articles and listicles exploring desk aesthetics, productivity hacks, and modern full-stack
                development best practices.
              </p>
              <ul className="space-y-2 text-xs text-theme-muted mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success" />
                  <span>Optimized for Pinterest & Google SEO</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-theme-success" />
                  <span>Interactive product cards inside posts</span>
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

      {/* Dynamic Global CSS Theme Preview Box */}
      <section className="py-12 bg-theme-surface border-y border-theme-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-bg border border-theme-border text-xs text-theme-muted mb-4">
            <Zap className="w-3.5 h-3.5 text-theme-accent" />
            <span>Theme Control Center</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-theme-fg mb-2">
            Centralized Global CSS Architecture
          </h3>
          <p className="text-sm text-theme-muted max-w-lg mx-auto mb-6">
            You can customize every color at any time by editing <code>app/globals.css</code>. All buttons,
            inputs, badges, cards, and text use CSS variables:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-theme-primary text-theme-primary-fg font-semibold">
              --primary
            </div>
            <div className="p-3 rounded-lg bg-theme-secondary text-theme-secondary-fg font-semibold">
              --secondary
            </div>
            <div className="p-3 rounded-lg bg-theme-accent text-theme-accent-foreground font-semibold">
              --accent
            </div>
            <div className="p-3 rounded-lg bg-theme-bg border border-theme-border text-theme-fg font-semibold">
              --surface
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
