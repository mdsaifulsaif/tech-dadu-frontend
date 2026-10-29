import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-theme-surface border-t border-theme-border py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-theme-primary flex items-center justify-center text-theme-primary-fg">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-theme-fg">
                Tech<span className="text-theme-primary">Dadu</span>
              </span>
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
                <Link href="/blogs" className="hover:text-theme-primary transition-colors">
                  Top 10 Tech Listicles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-fg mb-3">
              Account & Legal
            </h4>
            <ul className="space-y-2 text-sm text-theme-muted">
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
              <li>
                <Link href="/privacy" className="hover:text-theme-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-theme-border flex flex-col sm:flex-row items-center justify-between text-xs text-theme-muted gap-4">
          <p>© {new Date().getFullYear()} Tech Dadu. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-theme-danger fill-current" /> by Saif
          </p>
        </div>
      </div>
    </footer>
  );
}

