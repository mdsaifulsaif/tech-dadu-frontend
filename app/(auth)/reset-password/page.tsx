"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { authApi } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="card-surface w-full max-w-md p-8 text-center">
        <div className="inline-flex w-12 h-12 rounded-xl bg-theme-danger text-theme-danger items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-theme-fg mb-2">Invalid or Missing Token</h1>
        <p className="text-sm text-theme-muted mb-6">
          The password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/forgot-password" className="btn-primary w-full py-2.5 inline-block">
          Request New Link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.resetPassword(token, password);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Failed to reset password");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-surface w-full max-w-md p-8 sm:p-10 relative overflow-hidden">
      <div className="text-center mb-8">
        <div className="inline-flex w-12 h-12 rounded-xl bg-theme-primary-light text-theme-primary items-center justify-center mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-theme-fg">Reset Your Password</h1>
        <p className="text-sm text-theme-muted mt-1">
          Choose a strong, secure new password for your account
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
          <h2 className="text-lg font-bold text-theme-fg mb-2">Password Reset Successful!</h2>
          <p className="text-sm text-theme-muted mb-6">
            Your password has been changed. You can now sign in with your new credentials.
          </p>
          <Link href="/login" className="btn-primary w-full py-2.5 inline-block">
            Sign In Now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-theme-fg mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-theme input-icon-left input-icon-right"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-fg p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-theme-fg mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
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
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="card-surface w-full max-w-md p-8 text-center text-sm text-theme-muted">
            Loading...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

