import Link from "next/link";
import {
  Sparkles,
  Laptop,
  Layers,
  BookOpen,
  Palette,
} from "lucide-react";
import type { Session } from "next-auth";

interface HeroSectionProps {
  session?: Session | null;
}

export function HeroSection({ session }: HeroSectionProps) {
  return (
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
  );
}

