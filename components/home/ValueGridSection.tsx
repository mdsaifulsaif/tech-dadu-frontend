import Link from "next/link";
import {
  Laptop,
  Palette,
  Layers,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function ValueGridSection() {
  return (
    <section className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-3xl font-extrabold text-theme-fg">Everything For Modern Builders</h2>
        <p className="text-xs sm:text-sm text-theme-muted mt-1.5 sm:mt-2">
          Explore our curated hardware, Figma design tokens, battle-tested codebases, and technical guides.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Card 1: Affiliate Tech Gear */}
        <div className="card-surface card-surface-hover p-3.5 sm:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-theme-primary-light text-theme-primary flex items-center justify-center mb-3 sm:mb-4">
              <Laptop className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-theme-fg mb-1 sm:mb-1.5 leading-snug">
              Curated Desk Gear
            </h3>
            <p className="hidden sm:block text-xs text-theme-muted leading-relaxed mb-4">
              Honest pros & cons reviews for mechanical keyboards, minimalist mousepads, and 4K displays.
            </p>
            <ul className="hidden sm:block space-y-1.5 text-xs text-theme-muted mb-5">
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
            className="mt-2 sm:mt-0 text-[11px] sm:text-xs font-semibold text-theme-primary flex items-center gap-1 hover:gap-2 transition-all"
          >
            <span>Explore Gear</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>

        {/* Card 2: UI/UX Design Kits */}
        <div className="card-surface card-surface-hover p-3.5 sm:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-theme-primary-light text-theme-primary flex items-center justify-center mb-3 sm:mb-4">
              <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-theme-fg mb-1 sm:mb-1.5 leading-snug">
              UI/UX Design Kits
            </h3>
            <p className="hidden sm:block text-xs text-theme-muted leading-relaxed mb-4">
              Figma components, mobile app wireframes, and design systems with auto-layout and dark tokens.
            </p>
            <ul className="hidden sm:block space-y-1.5 text-xs text-theme-muted mb-5">
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
            className="mt-2 sm:mt-0 text-[11px] sm:text-xs font-semibold text-theme-primary flex items-center gap-1 hover:gap-2 transition-all"
          >
            <span>View Figma Kits</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>

        {/* Card 3: Developer Templates */}
        <div className="card-surface card-surface-hover p-3.5 sm:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-theme-secondary-light text-theme-secondary flex items-center justify-center mb-3 sm:mb-4">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-theme-fg mb-1 sm:mb-1.5 leading-snug">
              Next.js & MERN Kits
            </h3>
            <p className="hidden sm:block text-xs text-theme-muted leading-relaxed mb-4">
              Production-ready boilerplates with TypeScript, Auth, Tailwind CSS, and Stripe/Gumroad ready.
            </p>
            <ul className="hidden sm:block space-y-1.5 text-xs text-theme-muted mb-5">
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
            className="mt-2 sm:mt-0 text-[11px] sm:text-xs font-semibold text-theme-secondary flex items-center gap-1 hover:gap-2 transition-all"
          >
            <span>View Boilerplates</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>

        {/* Card 4: SEO Blogs & Listicles */}
        <div className="card-surface card-surface-hover p-3.5 sm:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-theme-primary-light text-theme-accent flex items-center justify-center mb-3 sm:mb-4">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-theme-fg mb-1 sm:mb-1.5 leading-snug">
              Deep-Dive Tech Blogs
            </h3>
            <p className="hidden sm:block text-xs text-theme-muted leading-relaxed mb-4">
              Rich articles exploring desk aesthetics, productivity hacks, and modern full-stack workflows.
            </p>
            <ul className="hidden sm:block space-y-1.5 text-xs text-theme-muted mb-5">
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
            className="mt-2 sm:mt-0 text-[11px] sm:text-xs font-semibold text-theme-primary flex items-center gap-1 hover:gap-2 transition-all"
          >
            <span>Read Articles</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

