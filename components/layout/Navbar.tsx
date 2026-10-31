"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Sparkles, LogIn, UserPlus, LogOut, Shield, Laptop, BookOpen, Layers, Palette } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="sticky top-0 z-50 bg-theme-surface border-b border-theme-border backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-theme-primary flex items-center justify-center text-theme-primary-fg shadow-sm transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-theme-fg">
              Tech<span className="text-theme-primary">Dadu</span>
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-theme-muted">
              Desk Gear & Boilerplates
            </span>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-theme-muted">
          <Link
            href="/products"
            className="flex items-center gap-1.5 hover:text-theme-primary transition-colors py-1"
          >
            <Laptop className="w-4 h-4" />
            <span>Desk Setup</span>
          </Link>
          <Link
            href="/templates"
            className="flex items-center gap-1.5 hover:text-theme-primary transition-colors py-1"
          >
            <Layers className="w-4 h-4" />
            <span>Templates</span>
          </Link>
          <Link
            href="/templates?category=ui-ux-design"
            className="flex items-center gap-1.5 hover:text-theme-primary transition-colors py-1"
          >
            <Palette className="w-4 h-4" />
            <span>UI/UX Kits</span>
          </Link>
          <Link
            href="/blogs"
            className="flex items-center gap-1.5 hover:text-theme-primary transition-colors py-1"
          >
            <BookOpen className="w-4 h-4" />
            <span>Guides & Blog</span>
          </Link>
        </nav>

        {/* Right Section: Theme Toggle & Auth */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {isLoading ? (
            <div className="h-9 w-24 rounded-md bg-theme-muted animate-pulse opacity-50" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              {/* User badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-sm">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-theme-primary flex items-center justify-center text-[11px] font-bold text-theme-primary-fg">
                    {(session.user.name || session.user.email || "U")[0].toUpperCase()}
                  </div>
                )}
                <span className="font-medium text-theme-fg max-w-[120px] truncate">
                  {session.user.name || session.user.email}
                </span>

                {(session.user as any).role === "admin" && (
                  <a
                    href="http://localhost:3002"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-theme-primary text-theme-primary-fg hover:opacity-90 transition-opacity"
                    title="Open Admin Dashboard"
                  >
                    <Shield className="w-2.5 h-2.5" />
                    <span>Dashboard</span>
                  </a>
                )}
              </div>

              {/* Logout button */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-outline text-xs py-1.5 px-3 hover:text-theme-danger"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-outline text-xs sm:text-sm py-2 px-3.5">
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              <Link href="/register" className="btn-primary text-xs sm:text-sm py-2 px-3.5">
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

