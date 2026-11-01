"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Heart, Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { subscriberApi } from "@/lib/api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await subscriberApi.subscribe(email, "website_footer");
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Failed to subscribe. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-auto bg-theme-surface border-t border-theme-border py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section Integrated in Footer */}
        <div className="pb-12 mb-12 border-b border-theme-border flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-primary-light text-theme-primary text-xs font-semibold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Newsletter & Freebies</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-theme-fg">
              Stay Ahead With Tech Dadu
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-theme-muted leading-relaxed">
              Get our latest desk gear roundups, mechanical keyboard teardowns, and Next.js guides delivered straight to your inbox.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            {success ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-theme-primary-light text-theme-primary border border-theme-primary/30">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div className="text-xs">
                  <strong className="block font-bold">You&apos;re Subscribed! 🎉</strong>
                  <span className="text-theme-muted">Check your inbox for our latest starter kits and setup inspiration.</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      required
                      className="input-theme input-icon-left text-xs sm:text-sm w-full py-2.5"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary text-xs sm:text-sm py-2.5 px-5 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
                {error && (
                  <div className="flex items-center gap-1.5 text-xs text-theme-danger mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <p className="text-[11px] text-theme-muted">
                  Zero spam. Unsubscribe at any time with one click.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-3 group">
              <Image
                src="/images/logo.png"
                alt="Tech Dadu Logo"
                width={160}
                height={38}
                className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105 dark:drop-shadow-[0_0_1px_rgba(255,255,255,0.85)]"
              />
            </Link>
            <p className="text-sm text-theme-muted max-w-sm leading-relaxed">
              Curated desk setups, mechanical keyboards, ergonomic accessories, and high-performance
              Next.js templates designed for modern builders.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-fg mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-theme-muted">
              <li>
                <Link href="/products" className="hover:text-theme-primary transition-colors">
                  Desk Setup Gear
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-theme-primary transition-colors">
                  Web Templates
                </Link>
              </li>
              <li>
                <Link href="/templates?category=ui-ux-design" className="hover:text-theme-primary transition-colors">
                  UI/UX Design Kits
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-theme-primary transition-colors">
                  Guides & Tech Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-fg mb-3">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-sm text-theme-muted">
              <li>
                <Link href="/about" className="hover:text-theme-primary transition-colors">
                  About Tech Dadu
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-theme-primary transition-colors">
                  Privacy Policy & Disclosure
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-theme-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-theme-primary transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Amazon Associates Legal Disclaimer Bar */}
        <div className="py-4 border-t border-theme-border/60 text-[11px] text-theme-muted leading-relaxed">
          <p>
            <strong className="text-theme-fg font-medium">Affiliate Disclaimer:</strong> Tech Dadu is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases at no extra cost to you.
          </p>
        </div>

        <div className="pt-4 border-t border-theme-border flex flex-col sm:flex-row items-center justify-between text-xs text-theme-muted gap-4">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} Tech Dadu. All rights reserved.</p>
            <span className="hidden sm:inline text-theme-border">•</span>
            <Link href="/privacy" className="hover:text-theme-primary transition-colors">
              Privacy
            </Link>
            <span className="text-theme-border">•</span>
            <Link href="/about" className="hover:text-theme-primary transition-colors">
              About Us
            </Link>
          </div>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-theme-danger fill-current" /> by Saif
          </p>
        </div>
      </div>
    </footer>
  );
}
