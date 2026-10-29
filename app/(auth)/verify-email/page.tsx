"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { CheckCircle, AlertCircle, Loader2, Mail, ArrowRight, RotateCw, KeyRound } from "lucide-react";
import { authApi } from "@/lib/api";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || searchParams.get("token") || "";
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [digits, setDigits] = useState<string[]>(() => {
    if (initialCode && initialCode.length === 6) {
      return initialCode.split("");
    }
    return ["", "", "", "", "", ""];
  });
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-verify if 6-digit code exists in URL params
  useEffect(() => {
    if (initialCode && initialCode.length === 6) {
      handleVerify(initialCode, initialEmail);
    }
  }, [initialCode, initialEmail]);

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (codeToVerify?: string, emailToVerify?: string) => {
    const code = codeToVerify || digits.join("");
    const targetEmail = emailToVerify !== undefined ? emailToVerify : email;

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit verification code");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await authApi.verifyEmail(code, targetEmail || undefined);
      if (res.success) {
        setStatusMessage("Code verified! Logging you in...");

        // Automatically log the user in if credentials were saved during registration
        const savedPass = typeof window !== "undefined" ? sessionStorage.getItem("td_auth_pass") : null;
        const savedEmail = (typeof window !== "undefined" ? sessionStorage.getItem("td_auth_email") : null) || targetEmail;

        if (savedPass && savedEmail) {
          try {
            const loginRes = await signIn("credentials", {
              email: savedEmail,
              password: savedPass,
              redirect: false,
            });

            if (typeof window !== "undefined") {
              sessionStorage.removeItem("td_auth_pass");
              sessionStorage.removeItem("td_auth_email");
            }

            if (!loginRes?.error) {
              router.push("/");
              router.refresh();
              return;
            }
          } catch (loginErr) {
            console.error("Auto login failed:", loginErr);
          }
        }

        setSuccess(true);
        setStatusMessage(res.message || "Your email has been verified successfully!");
      } else {
        setError(res.message || "Invalid or expired verification code");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid or expired 6-digit code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    // Handle pasted 6-digit string
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, "").slice(0, 6).split("");
      if (pastedDigits.length > 0) {
        const newDigits = [...digits];
        pastedDigits.forEach((digit, i) => {
          if (index + i < 6) {
            newDigits[index + i] = digit;
          }
        });
        setDigits(newDigits);
        const nextFocusIndex = Math.min(index + pastedDigits.length, 5);
        inputRefs.current[nextFocusIndex]?.focus();

        if (newDigits.every((d) => d !== "")) {
          handleVerify(newDigits.join(""));
        }
      }
      return;
    }

    // Single digit input
    const char = value.replace(/\D/g, "");
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== "")) {
      handleVerify(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please provide your email address to resend the code");
      return;
    }

    setError(null);
    setResending(true);

    try {
      const res = await authApi.resendVerification(email);
      if (res.success) {
        setResendCooldown(60);
        setStatusMessage("A fresh 6-digit verification code has been sent to your inbox.");
      } else {
        setError(res.message || "Failed to resend code");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to resend verification code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="card-surface w-full max-w-md p-8 sm:p-10 relative overflow-hidden text-center">
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-theme-primary-light blur-2xl pointer-events-none" />

      {success ? (
        <div className="py-4">
          <div className="inline-flex w-16 h-16 rounded-full bg-theme-success text-theme-success items-center justify-center mb-4">
            <CheckCircle className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-theme-fg mb-2">Email Verified!</h1>
          <p className="text-sm text-theme-muted mb-8 leading-relaxed">
            {statusMessage || "Your account has been successfully verified. You can now access all features."}
          </p>
          <Link href="/login" className="btn-primary w-full py-2.5 inline-flex items-center justify-center gap-2">
            <span>Continue to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          <div className="inline-flex w-12 h-12 rounded-xl bg-theme-primary-light text-theme-primary items-center justify-center mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-theme-fg">Enter 6-Digit Code</h1>
          <p className="text-sm text-theme-muted mt-1 mb-6">
            We sent a verification code to {email ? <strong className="text-theme-fg">{email}</strong> : "your email"}.
          </p>

          {error && (
            <div className="mb-6 p-3.5 rounded-lg bg-theme-danger text-theme-danger border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-sm text-left">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {statusMessage && !error && (
            <div className="mb-6 p-3.5 rounded-lg bg-theme-success text-theme-success border border-emerald-200 dark:border-emerald-900/50 text-sm">
              <span>{statusMessage}</span>
            </div>
          )}

          {/* 6 Digit OTP Input Boxes */}
          <div className="flex justify-center items-center gap-2 sm:gap-3 mb-6">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-extrabold rounded-lg border border-theme-border bg-theme-bg text-theme-fg focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 outline-none transition-all"
              />
            ))}
          </div>

          {!email && (
            <div className="mb-5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-theme-fg mb-1.5">
                Confirm Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-theme input-icon-left text-sm"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleVerify()}
            disabled={loading || digits.some((d) => !d)}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 mb-4"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-theme-muted pt-2">
            <span>Didn&apos;t receive the code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || resending}
              className="font-semibold text-theme-primary hover:underline disabled:opacity-50 disabled:no-underline inline-flex items-center gap-1"
            >
              {resending ? (
                <RotateCw className="w-3 h-3 animate-spin" />
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                "Resend Code"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="card-surface w-full max-w-md p-8 text-center text-sm text-theme-muted">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-theme-primary" />
            Loading verification...
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
