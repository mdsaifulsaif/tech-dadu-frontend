"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LogIn,
  UserPlus,
  LogOut,
  Shield,
  Laptop,
  BookOpen,
  Layers,
  Palette,
  Search,
  X,
  Menu,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { GlobalSearch } from "@/components/common/GlobalSearch";

const NAV_ITEMS = [
  { href: "/products", label: "Desk Setup", icon: Laptop },
  { href: "/templates", label: "Templates", icon: Layers },
  { href: "/templates?category=ui-ux-design", label: "UI/UX Kits", icon: Palette },
  { href: "/blogs", label: "Guides & Blog", icon: BookOpen },
];

function checkIsActive(href: string, pathname: string, currentCategory: string | null): boolean {
  if (href === "/products") {
    return pathname.startsWith("/products");
  }
  if (href === "/blogs") {
    return pathname.startsWith("/blogs");
  }
  if (href.startsWith("/templates?category=ui-ux-design")) {
    return pathname.startsWith("/templates") && currentCategory === "ui-ux-design";
  }
  if (href === "/templates") {
    return pathname.startsWith("/templates") && currentCategory !== "ui-ux-design";
  }
  return pathname === href;
}

function DesktopNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams ? searchParams.get("category") : null;

  return (
    <nav className="hidden md:flex items-center gap-6 h-full text-sm font-medium">
      {NAV_ITEMS.map((item) => {
        const isActive = checkIsActive(item.href, pathname, currentCategory);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative h-full flex items-center gap-1.5 px-1 transition-colors ${
              isActive
                ? "text-theme-primary font-semibold"
                : "text-theme-muted hover:text-theme-fg"
            }`}
          >
            <item.icon
              className={`w-4 h-4 transition-colors ${
                isActive ? "text-theme-primary" : "text-theme-muted"
              }`}
            />
            <span>{item.label}</span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-full bg-theme-primary transition-all duration-200" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNavLinks({ closeMobileMenu }: { closeMobileMenu: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams ? searchParams.get("category") : null;

  return (
    <nav className="flex flex-col space-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive = checkIsActive(item.href, pathname, currentCategory);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeMobileMenu}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-theme-primary/10 text-theme-primary font-semibold border-l-4 border-theme-primary"
                : "text-theme-fg hover:bg-theme-surface-hover hover:text-theme-primary"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <item.icon
                className={`w-4 h-4 ${
                  isActive ? "text-theme-primary" : "text-theme-muted"
                }`}
              />
              <span>{item.label}</span>
            </div>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-theme-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoading = status === "loading";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-theme-surface/95 border-b border-theme-border backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2 group shrink-0">
          <Image
            src="/images/logo.png"
            alt="Tech Dadu Logo"
            width={160}
            height={40}
            priority
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-102 dark:drop-shadow-[0_0_1px_rgba(255,255,255,0.85)]"
          />
        </Link>

        {/* Center Desktop Navigation */}
        <Suspense
          fallback={
            <nav className="hidden md:flex items-center gap-6 h-full text-sm font-medium text-theme-muted">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative h-full flex items-center gap-1.5 px-1 hover:text-theme-primary transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          }
        >
          <DesktopNavLinks />
        </Suspense>

        {/* Right Section: Global Search, Theme Toggle, Auth & Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Global Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-theme-border bg-theme-bg/60 hover:bg-theme-surface-hover text-theme-muted hover:text-theme-fg text-xs transition-colors"
            title="Global Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-theme-primary" />
            <span className="hidden xl:inline text-xs">Search...</span>
            <kbd className="hidden xl:inline-block text-[10px] font-mono px-1 py-0.5 rounded bg-theme-surface border border-theme-border">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <div className="h-9 w-20 rounded-md bg-theme-muted animate-pulse opacity-50" />
            ) : session?.user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-xs sm:text-sm">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={22}
                      height={22}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-theme-primary flex items-center justify-center text-[10px] font-bold text-theme-primary-fg">
                      {(session.user.name || session.user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-theme-fg max-w-[100px] truncate">
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

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn-outline text-xs py-1.5 px-2.5 hover:text-theme-danger"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-outline text-xs py-1.5 px-3">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link href="/register" className="btn-primary text-xs py-1.5 px-3">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-theme-border bg-theme-bg/60 text-theme-fg hover:bg-theme-surface-hover transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-theme-fg" />
            ) : (
              <Menu className="w-4 h-4 text-theme-fg" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-theme-border bg-theme-surface/98 px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <Suspense
            fallback={
              <nav className="flex flex-col space-y-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-theme-fg hover:bg-theme-surface-hover hover:text-theme-primary transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-theme-primary" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            }
          >
            <MobileNavLinks closeMobileMenu={closeMobileMenu} />
          </Suspense>

          <div className="pt-3 border-t border-theme-border/60">
            {session?.user ? (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-theme-bg border border-theme-border">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-theme-primary flex items-center justify-center text-xs font-bold text-theme-primary-fg">
                      {(session.user.name || session.user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-theme-fg truncate">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-[11px] text-theme-muted truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                {(session.user as any).role === "admin" && (
                  <a
                    href="http://localhost:3002"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-outline text-xs py-2 px-3 flex items-center justify-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-theme-primary" />
                    <span>Open Admin Dashboard</span>
                  </a>
                )}

                <button
                  onClick={() => {
                    closeMobileMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full btn-outline text-xs py-2 px-3 flex items-center justify-center gap-1.5 hover:text-theme-danger"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="btn-outline text-xs py-2 px-3 flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="btn-primary text-xs py-2 px-3 flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Search Popover Modal (Starts below Navbar so Navbar NEVER darkens) */}
      {isSearchOpen && (
        <>
          {/* Backdrop below navbar */}
          <div
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-x-0 top-16 bottom-0 z-40 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
            aria-hidden="true"
          />

          {/* Floating Search Popover right below navbar */}
          <div className="fixed inset-x-0 top-16 z-50 flex justify-center px-4 pt-3 sm:pt-4 pointer-events-none">
            <div className="card-surface w-full max-w-2xl rounded-2xl p-4 sm:p-5 shadow-2xl border border-theme-border animate-in zoom-in-95 duration-150 pointer-events-auto">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-theme-border">
                <span className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                  Search Tech Dadu Catalog
                </span>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-lg text-theme-muted hover:text-theme-fg hover:bg-theme-surface-hover transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <GlobalSearch
                variant="header"
                placeholder="Type to search desk gear, templates, UI kits, blogs..."
                onSelect={() => setIsSearchOpen(false)}
              />
            </div>
          </div>
        </>
      )}
    </header>
  );
}
