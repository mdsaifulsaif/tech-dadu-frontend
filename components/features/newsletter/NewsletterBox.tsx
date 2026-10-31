"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { subscriberApi } from "@/lib/api";

interface NewsletterBoxProps {
  source?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const NewsletterBox: React.FC<NewsletterBoxProps> = ({
  source = "website_inline",
  title = "Level Up Your Setup & Code",
  subtitle = "Join 5,000+ tech geeks getting weekly free Next.js boilerplates, desk aesthetics, and exclusive developer deals.",
  compact = false,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await subscriberApi.subscribe(email, source);
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

  if (success) {
    return (
      <div className="card-surface p-6 sm:p-8 rounded-2xl text-center border border-theme-primary/40 bg-theme-primary/5">
        <div className="w-12 h-12 rounded-full bg-theme-primary-light text-theme-primary flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-theme-fg">You're Subscribed! 🎉</h3>
        <p className="text-xs text-theme-muted mt-1 max-w-md mx-auto">
          Thanks for joining Tech Dadu. Check your inbox for our latest starter kits and setup inspiration.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`card-surface rounded-2xl border border-theme-border p-6 sm:p-8 relative overflow-hidden ${
        compact ? "py-6" : ""
      }`}
    >
      <div className="relative z-10 max-w-xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-primary-light text-theme-primary text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Newsletter & Freebies</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-theme-fg">
          {title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-theme-muted leading-relaxed">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
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
            className="btn-primary text-xs sm:text-sm py-2.5 px-5 flex items-center justify-center gap-2 whitespace-nowrap"
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
        </form>

        {error && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-theme-danger">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-[11px] text-theme-muted mt-3">
          Zero spam. Unsubscribe at any time with one click.
        </p>
      </div>
    </div>
  );
};

