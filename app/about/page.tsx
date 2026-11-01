import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  CheckCircle2,
  Laptop,
  Layers,
  Heart,
  ShieldCheck,
  Award,
  ArrowRight,
  Mail,
  Sliders,
  Terminal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Tech Dadu - Desk Setup & Developer Tools",
  description:
    "Learn about Tech Dadu, our mission, our editorial review standards, and the team curating modern desk gear and developer templates.",
};

export default function AboutPage() {
  return (
    <main className="py-12 sm:py-16 bg-theme-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-primary/10 text-theme-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission & Story</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-theme-fg tracking-tight leading-tight">
            Curated Desk Setups & High-Performance Tools for Builders
          </h1>
          <p className="mt-4 text-base sm:text-lg text-theme-muted max-w-2xl mx-auto leading-relaxed">
            Tech Dadu was founded with one clear mission: to cut through product clutter and give developers, designers, and creators genuinely tested desk gear and production-ready code templates.
          </p>
        </div>

        {/* Founder & Brand Story */}
        <div className="card-surface p-6 sm:p-10 rounded-3xl border border-theme-border shadow-sm mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex flex-col items-center text-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-theme-primary/10 border-2 border-theme-primary/20 flex items-center justify-center p-2 mb-4 shadow-inner">
                <Image
                  src="/images/logo.png"
                  alt="Tech Dadu Brand"
                  width={140}
                  height={140}
                  className="w-full h-auto object-contain dark:drop-shadow-[0_0_1px_rgba(255,255,255,0.85)]"
                />
              </div>
              <h3 className="text-lg font-bold text-theme-fg">Saif</h3>
              <p className="text-xs text-theme-muted">Founder & Lead Curator</p>
              <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary text-[11px] font-medium">
                Full-Stack Dev & Tech Geek
              </div>
            </div>

            <div className="md:col-span-2 space-y-4 text-sm sm:text-base text-theme-muted leading-relaxed">
              <h2 className="text-xl font-bold text-theme-fg">
                Why We Built Tech Dadu
              </h2>
              <p>
                As developers spending 10+ hours a day at our desks, we realized how much an ergonomic keyboard, proper monitor height, tactile switches, and high-efficiency workflow tools impact physical health and daily creative output.
              </p>
              <p>
                Most tech review sites are bloated with generic affiliate spam, paid promotions, and AI-generated reviews of products the author never touched.
              </p>
              <p>
                <strong className="text-theme-fg">Tech Dadu</strong> was built to be different: an engineer-first guide where desk accessories, mechanical keyboards, and Next.js starter codebases are scrutinized for real-world ergonomics, long-term durability, and genuine value.
              </p>
            </div>
          </div>
        </div>

        {/* What We Focus On */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-theme-fg text-center mb-8">
            What You Find On Tech Dadu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-surface p-6 rounded-2xl border border-theme-border flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center mb-4">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-theme-fg mb-2">
                Ergonomic Desk Gear
              </h3>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed flex-1">
                Custom mechanical keyboards, high-refresh 4K monitors, desk pads, ergonomic mice, and cable management setups tested for day-long coding marathons.
              </p>
              <Link
                href="/products"
                className="mt-4 text-xs font-semibold text-theme-primary flex items-center gap-1 hover:underline"
              >
                Browse Desk Gear <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="card-surface p-6 rounded-2xl border border-theme-border flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-theme-fg mb-2">
                Next.js Code Templates
              </h3>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed flex-1">
                Battle-tested production boilerplates with Next.js 15+, Tailwind CSS, TypeScript, and clean architecture so you launch your next SaaS in hours, not weeks.
              </p>
              <Link
                href="/templates"
                className="mt-4 text-xs font-semibold text-theme-primary flex items-center gap-1 hover:underline"
              >
                Explore Templates <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="card-surface p-6 rounded-2xl border border-theme-border flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-theme-fg mb-2">
                In-Depth Tech Guides
              </h3>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed flex-1">
                Uncompromising teardowns, keyboard switch sound-profile comparisons, Linux & macOS developer workflow setups, and web architecture tutorials.
              </p>
              <Link
                href="/blogs"
                className="mt-4 text-xs font-semibold text-theme-primary flex items-center gap-1 hover:underline"
              >
                Read Tech Guides <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Our Editorial Standards */}
        <div className="card-surface p-6 sm:p-8 rounded-2xl border border-theme-border mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-theme-primary text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-theme-fg">
                Our Editorial Standards & Review Methodology
              </h2>
              <p className="text-xs text-theme-muted">
                How we test, verify, and compare items before recommending them
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-theme-muted">
            <div className="p-4 rounded-xl bg-theme-surface border border-theme-border">
              <span className="block font-bold text-theme-fg mb-1">
                1. Ergonomics & Comfort First
              </span>
              <span>
                Desk accessories must support neutral wrist angles, reduced strain, and high comfort for 8+ hour workloads.
              </span>
            </div>
            <div className="p-4 rounded-xl bg-theme-surface border border-theme-border">
              <span className="block font-bold text-theme-fg mb-1">
                2. Real-World Build Quality
              </span>
              <span>
                We favor durable materials: aluminum bodies, PBT keycaps, sturdy monitor arms, and reliable mechanical switches.
              </span>
            </div>
            <div className="p-4 rounded-xl bg-theme-surface border border-theme-border">
              <span className="block font-bold text-theme-fg mb-1">
                3. Honest Pros & Cons
              </span>
              <span>
                No product is perfect. Every single review highlights trade-offs, quirks, and software downsides so you know what you buy.
              </span>
            </div>
            <div className="p-4 rounded-xl bg-theme-surface border border-theme-border">
              <span className="block font-bold text-theme-fg mb-1">
                4. Cross-Platform Compatibility
              </span>
              <span>
                We verify Mac, Windows, and Linux support for all wireless peripherals, QMK/VIA key-mapping, and display connections.
              </span>
            </div>
          </div>
        </div>

        {/* Affiliate Disclosure Box */}
        <div className="card-surface p-6 sm:p-8 rounded-2xl border-2 border-theme-primary/20 bg-theme-primary/5 mb-12">
          <div className="flex items-start gap-4">
            <Award className="w-6 h-6 text-theme-primary shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="text-base font-bold text-theme-fg">
                Affiliate Partnership & Transparency
              </h3>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                Tech Dadu is supported by our readers. When you purchase through links on our site (such as Amazon and verified retailers), we may earn an affiliate commission at <strong className="text-theme-fg font-medium">no additional cost to you</strong>.
              </p>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                We are a participant in the <strong className="text-theme-fg font-medium">Amazon Services LLC Associates Program</strong>. We strictly refuse sponsored reviews that demand 5-star ratings; our opinions and comparison tables are 100% independent.
              </p>
              <div className="pt-2">
                <Link
                  href="/privacy"
                  className="text-xs font-semibold text-theme-primary hover:underline inline-flex items-center gap-1"
                >
                  Read our full Privacy Policy & Disclosure <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Contact / Get In Touch CTA */}
        <div className="text-center p-8 rounded-3xl bg-theme-surface border border-theme-border">
          <h3 className="text-xl font-bold text-theme-fg mb-2">Have a Question or Product Recommendation?</h3>
          <p className="text-xs sm:text-sm text-theme-muted max-w-md mx-auto mb-6">
            We love hearing from fellow developers, keyboard customizers, and setup enthusiasts. Reach out anytime!
          </p>
          <a
            href="mailto:support@techdadu.com"
            className="btn-primary text-xs sm:text-sm py-2.5 px-6 inline-flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Us: support@techdadu.com</span>
          </a>
        </div>
      </div>
    </main>
  );
}

