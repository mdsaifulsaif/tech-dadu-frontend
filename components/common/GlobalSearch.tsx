"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  X,
  Loader2,
  Laptop,
  Layers,
  BookOpen,
  FolderTree,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { searchApi } from "@/lib/api";

interface GlobalSearchProps {
  placeholder?: string;
  variant?: "hero" | "header" | "compact";
  className?: string;
  onSelect?: () => void;
}

export function GlobalSearch({
  placeholder = "Search desk gear, templates, guides, categories...",
  variant = "hero",
  className = "",
  onSelect,
}: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    products: any[];
    templates: any[];
    blogs: any[];
    categories: any[];
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchApi.globalSearch(query.trim());
        if (res.success && res.data) {
          setResults({
            products: res.data.products || [],
            templates: res.data.templates || [],
            blogs: res.data.blogs || [],
            categories: res.data.categories || [],
          });
        }
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectLink = () => {
    setIsOpen(false);
    onSelect?.();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const hasResults =
    results &&
    (results.products.length > 0 ||
      results.templates.length > 0 ||
      results.blogs.length > 0 ||
      results.categories.length > 0);

  const isEmptyQuery = !query.trim();

  // Quick suggestions for empty state
  const quickSearches = [
    { label: "Keyboards", query: "keyboard" },
    { label: "Desk Setup", query: "desk" },
    { label: "Next.js", query: "next" },
    { label: "Figma UI", query: "design" },
    { label: "Monitor Arm", query: "monitor" },
  ];

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div
          className={`relative flex items-center w-full transition-all duration-200 rounded-2xl ${
            isHero
              ? "bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/15 backdrop-blur-md shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] focus-within:border-theme-primary focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-theme-primary/40"
              : "bg-theme-bg border border-theme-border focus-within:border-theme-primary focus-within:ring-1 focus-within:ring-theme-primary/30"
          }`}
        >
          <Search
            className={`shrink-0 ml-4 pointer-events-none transition-colors ${
              isHero
                ? "w-4 h-4 text-white/60"
                : "w-4 h-4 text-theme-muted"
            }`}
          />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder={placeholder}
            className={`w-full py-2.5 pl-3 pr-10 text-sm bg-transparent outline-none transition-colors ${
              isHero
                ? "text-white placeholder:text-white/50"
                : "text-theme-fg placeholder:text-theme-muted"
            }`}
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {loading ? (
              <Loader2
                className={`w-4 h-4 animate-spin ${
                  isHero ? "text-white/70" : "text-theme-primary"
                }`}
              />
            ) : query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults(null);
                  inputRef.current?.focus();
                }}
                className={`p-1 rounded-full transition-colors ${
                  isHero
                    ? "text-white/60 hover:text-white hover:bg-white/10"
                    : "text-theme-muted hover:text-theme-fg hover:bg-theme-surface-hover"
                }`}
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span
                className={`hidden sm:inline-flex items-center text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                  isHero
                    ? "text-white/60 border-white/20 bg-white/5"
                    : "text-theme-muted border-theme-border bg-theme-bg"
                }`}
              >
                ⌘K
              </span>
            )}
          </div>
        </div>
      </form>

      {/* Floating Results Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2.5 z-50 card-surface border border-theme-border rounded-2xl shadow-2xl overflow-hidden max-h-[460px] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          {isEmptyQuery ? (
            /* Empty State: Trending quick picks */
            <div className="p-4 text-xs">
              <div className="flex items-center gap-1.5 text-theme-muted font-bold uppercase tracking-wider mb-2.5 text-[11px]">
                <TrendingUp className="w-3.5 h-3.5 text-theme-primary" />
                <span>Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickSearches.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setQuery(item.query);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-fg text-xs font-medium transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : loading && !results ? (
            /* Loading state */
            <div className="p-8 text-center text-theme-muted text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-theme-primary" />
              <span>Searching across catalog...</span>
            </div>
          ) : hasResults ? (
            /* Results Categorized List */
            <div className="divide-y divide-theme-border">
              {/* 1. Categories Matches */}
              {results.categories.length > 0 && (
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-theme-muted mb-2 px-1">
                    <FolderTree className="w-3.5 h-3.5 text-theme-primary" />
                    <span>Categories ({results.categories.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {results.categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={
                          cat.type === "template"
                            ? `/templates?category=${cat.slug}`
                            : cat.type === "blog"
                            ? `/blogs?category=${cat.slug}`
                            : `/products?category=${cat.slug}`
                        }
                        onClick={handleSelectLink}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-theme-surface-hover transition-colors group"
                      >
                        <span className="w-7 h-7 rounded-lg bg-theme-bg border border-theme-border flex items-center justify-center text-xs shrink-0">
                          {cat.icon || "🏷️"}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-theme-fg group-hover:text-theme-primary truncate">
                            {cat.name}
                          </p>
                          <span className="text-[10px] text-theme-muted capitalize">
                            {cat.type}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Desk Gear / Products Matches */}
              {results.products.length > 0 && (
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-theme-muted mb-2 px-1">
                    <Laptop className="w-3.5 h-3.5 text-theme-primary" />
                    <span>Desk Gear ({results.products.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.products.map((item) => (
                      <Link
                        key={item._id}
                        href={`/products/${item.slug}`}
                        onClick={handleSelectLink}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-theme-surface-hover transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.images?.[0] ? (
                            <Image
                              src={item.images[0]}
                              alt={item.title}
                              width={36}
                              height={36}
                              className="w-9 h-9 rounded-lg object-cover bg-theme-bg border border-theme-border shrink-0"
                            />
                          ) : (
                            <span className="w-9 h-9 rounded-lg bg-theme-primary-light text-theme-primary flex items-center justify-center shrink-0">
                              <Laptop className="w-4 h-4" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-theme-fg group-hover:text-theme-primary truncate">
                              {item.title}
                            </p>
                            <span className="text-[11px] text-theme-muted truncate block">
                              {item.category?.name || "Tech Gear"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-xs text-theme-fg">
                            {item.price?.formatted || `$${item.price?.amount ?? 0}`}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Developer Templates Matches */}
              {results.templates.length > 0 && (
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-theme-muted mb-2 px-1">
                    <Layers className="w-3.5 h-3.5 text-theme-secondary" />
                    <span>Templates &amp; UI Kits ({results.templates.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.templates.map((item) => (
                      <Link
                        key={item._id}
                        href={`/templates/${item.slug}`}
                        onClick={handleSelectLink}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-theme-surface-hover transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.previewImages?.[0] ? (
                            <Image
                              src={item.previewImages[0]}
                              alt={item.title}
                              width={36}
                              height={36}
                              className="w-9 h-9 rounded-lg object-cover bg-theme-bg border border-theme-border shrink-0"
                            />
                          ) : (
                            <span className="w-9 h-9 rounded-lg bg-theme-secondary-light text-theme-secondary flex items-center justify-center shrink-0">
                              <Layers className="w-4 h-4" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-theme-fg group-hover:text-theme-secondary truncate">
                              {item.title}
                            </p>
                            <span className="text-[11px] text-theme-muted truncate block">
                              {item.techStack?.slice(0, 2).join(" • ") || item.category?.name || "Code Starter"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-xs font-bold ${item.isFree ? "text-emerald-500 font-extrabold" : "text-theme-fg"}`}>
                            {item.isFree ? "Free" : `$${item.price ?? 0}`}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Tech Guides / Blogs Matches */}
              {results.blogs.length > 0 && (
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-theme-muted mb-2 px-1">
                    <BookOpen className="w-3.5 h-3.5 text-theme-accent" />
                    <span>Guides &amp; Articles ({results.blogs.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.blogs.map((item) => (
                      <Link
                        key={item._id}
                        href={`/blogs/${item.slug}`}
                        onClick={handleSelectLink}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-theme-surface-hover transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.coverImage ? (
                            <Image
                              src={item.coverImage}
                              alt={item.title}
                              width={36}
                              height={36}
                              className="w-9 h-9 rounded-lg object-cover bg-theme-bg border border-theme-border shrink-0"
                            />
                          ) : (
                            <span className="w-9 h-9 rounded-lg bg-amber-500/10 text-theme-accent flex items-center justify-center shrink-0">
                              <BookOpen className="w-4 h-4" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-theme-fg group-hover:text-theme-primary truncate">
                              {item.title}
                            </p>
                            <span className="text-[11px] text-theme-muted truncate block">
                              {item.readingTime ? `${item.readingTime} min read` : "Tech Article"}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-theme-muted group-hover:text-theme-fg shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* View all search matches */}
              <div className="p-2.5 bg-theme-bg/60 flex items-center justify-between text-xs font-semibold px-4">
                <Link
                  href={`/products?search=${encodeURIComponent(query)}`}
                  onClick={handleSelectLink}
                  className="text-theme-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Search all desk gear for &ldquo;{query}&rdquo;</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  href={`/templates?search=${encodeURIComponent(query)}`}
                  onClick={handleSelectLink}
                  className="text-theme-secondary hover:underline inline-flex items-center gap-1"
                >
                  <span>Search templates</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : (
            /* No Results Found */
            <div className="p-8 text-center text-xs">
              <p className="font-semibold text-theme-fg mb-1">
                No matches found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-theme-muted text-[11px]">
                Try searching for mechanical keyboards, monitors, Next.js templates, or UI kits.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default GlobalSearch;
