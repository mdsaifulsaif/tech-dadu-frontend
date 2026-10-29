"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, KeyRound, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.forgotPassword(email);
      if (res.success) {
        setSuccess(
          res.message || "If an account exists with this email, a password reset link has been sent."
        );
      } else {
        setError(res.message || "Failed to send reset link");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="card-surface w-full max-w-md p-8 sm:p-10 relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-theme-primary-light text-theme-primary items-center justify-center mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-theme-fg">Forgot Password?</h1>
          <p className="text-sm text-theme-muted mt-1">
            Enter your email and we&apos;ll send you instructions to reset your password
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-theme-danger text-theme-danger border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-4">
            <div className="inline-flex w-12 h-12 rounded-full bg-theme-success text-theme-success items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-sm text-theme-fg mb-6 leading-relaxed">{success}</p>
            <Link href="/login" className="btn-primary w-full py-2.5 inline-block">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-theme-fg mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-theme input-icon-left"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-theme-muted hover:text-theme-fg font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

