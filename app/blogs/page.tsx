"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  BookOpen,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  AlertCircle,
  Tag,
  Eye,
} from "lucide-react";
import { blogApi, categoryApi } from "@/lib/api";
import { IBlog, ICategory } from "@/types";
import { BlogCard } from "@/components/features/blogs/BlogCard";
import { CardSkeleton } from "@/components/common/Skeleton";
import { Badge } from "@/components/common/Badge";

function BlogsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("search") || "";
  const currentTag = searchParams.get("tag") || "";

  const [rawBlogs, setRawBlogs] = useState<IBlog[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState(currentSearch);

  // Sync with URL when external navigation occurs
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Debounced live search URL sync
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchInput.trim()) {
          params.set("search", searchInput.trim());
        } else {
          params.delete("search");
        }
        router.replace(`${pathname}?${params.toString()}`);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, currentSearch, pathname, router, searchParams]);

  // Fetch Categories
  useEffect(() => {
    categoryApi
      .getAll("blog")
      .then((res) => {
        if (res.success && res.data) {
          setCategories(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Blogs
  useEffect(() => {
    setLoading(true);
    setError(null);

    const query: Record<string, any> = {
      limit: 30,
    };

    if (currentCategory && currentCategory !== "all") {
      query.category = currentCategory;
    }
    if (currentSearch) {
      query.search = currentSearch;
    }

    blogApi
      .getAll(query)
      .then((res) => {
        if (res.success && res.data) {
          let list: IBlog[] = res.data.blogs || res.data || [];
          if (currentTag) {
            list = list.filter((b) =>
              b.tags?.some((t) => t.toLowerCase() === currentTag.toLowerCase())
            );
          }
          setRawBlogs(list);
        } else {
          setRawBlogs([]);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load guides.");
        setRawBlogs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentCategory, currentSearch, currentTag]);

  // Instant client-side filtering while typing / debounced query runs
  const displayedBlogs = useMemo(() => {
    const term = searchInput.trim().toLowerCase();
    if (!term) return rawBlogs;

    return rawBlogs.filter((b) => {
      const titleMatch = b.title?.toLowerCase().includes(term);
      const excerptMatch = b.excerpt?.toLowerCase().includes(term);
      const tagMatch = b.tags?.some((t) => t.toLowerCase().includes(term));
      const authorName = typeof b.author === "string" ? b.author : b.author?.name || "";
      const authorMatch = authorName.toLowerCase().includes(term);
      return titleMatch || excerptMatch || tagMatch || authorMatch;
    });
  }, [rawBlogs, searchInput]);

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === "all") {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() });
  };

  const clearSearch = () => {
    setSearchInput("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSearchInput("");
    router.replace("/blogs");
  };

  const isSearching = Boolean(searchInput.trim()) || Boolean(currentSearch);
  const hasActiveFilters =
    isSearching || currentCategory !== "all" || Boolean(currentTag);

  // When searching, hide the big featured hero so matching results show directly below search input
  const featuredBlog =
    displayedBlogs.length > 0 && !hasActiveFilters && !isSearching
      ? displayedBlogs[0]
      : null;
  const regularBlogs = featuredBlog ? displayedBlogs.slice(1) : displayedBlogs;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-primary-light text-theme-primary text-xs font-semibold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guides, Reviews & Aesthetics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-theme-fg">
          Tech Dadu <span className="text-gradient">Guides & Tech Blog</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-theme-muted leading-relaxed">
          Deep-dive reviews into mechanical switches, 4K developer monitors, desk cable
          management, and building production apps with Next.js & React 19.
        </p>
      </div>

      {/* Search & Categories Bar */}
      <div className="card-surface p-4 sm:p-5 rounded-2xl mb-8 border border-theme-border flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search guides (e.g. Keychron, Desk setup, Next.js)..."
            className="input-theme input-icon-left text-xs sm:text-sm w-full py-2.5"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-fg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => updateFilters({ category: "all" })}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              currentCategory === "all"
                ? "bg-theme-primary text-theme-primary-fg"
                : "bg-theme-bg border border-theme-border text-theme-muted hover:text-theme-fg"
            }`}
          >
            All Articles
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilters({ category: cat.slug })}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                currentCategory === cat.slug
                  ? "bg-theme-primary text-theme-primary-fg font-semibold"
                  : "bg-theme-bg border border-theme-border text-theme-muted hover:text-theme-fg"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Blog Hero (Only on unfiltered main view) */}
      {featuredBlog && !loading && (
        <div className="card-surface rounded-2xl border border-theme-border overflow-hidden mb-12 group hover:border-theme-primary/40 transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <Link
              href={`/blogs/${featuredBlog.slug}`}
              className="lg:col-span-7 relative aspect-16/10 overflow-hidden bg-theme-bg block"
            >
              <Image
                src={featuredBlog.coverImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200"}
                alt={featuredBlog.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="accent" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                  Featured Guide
                </Badge>
              </div>
            </Link>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-theme-muted mb-3">
                  {featuredBlog.readingTime && (
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredBlog.readingTime} min read
                    </span>
                  )}
                  {featuredBlog.views > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {featuredBlog.views} views
                    </span>
                  )}
                </div>

                <Link href={`/blogs/${featuredBlog.slug}`}>
                  <h2 className="text-xl sm:text-2xl font-black text-theme-fg hover:text-theme-primary transition-colors leading-snug">
                    {featuredBlog.title}
                  </h2>
                </Link>

                <p className="mt-3 text-xs sm:text-sm text-theme-muted line-clamp-3 leading-relaxed">
                  {featuredBlog.excerpt}
                </p>

                {featuredBlog.tags && featuredBlog.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {featuredBlog.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-theme-bg border border-theme-border text-theme-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-theme-border/60">
                <Link
                  href={`/blogs/${featuredBlog.slug}`}
                  className="btn-primary inline-flex items-center gap-2 text-xs py-2.5 px-4 font-semibold"
                >
                  <span>Read Featured Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs sm:text-sm text-theme-muted">
          {isSearching ? (
            <>
              Showing <strong className="text-theme-fg">{displayedBlogs.length}</strong> {displayedBlogs.length === 1 ? "result" : "results"} for <span className="text-theme-primary font-semibold">&quot;{searchInput || currentSearch}&quot;</span>
            </>
          ) : (
            <>
              Showing <strong className="text-theme-fg">{displayedBlogs.length}</strong> guides
            </>
          )}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="ml-3 text-xs text-theme-primary hover:underline font-semibold cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="card-surface p-8 rounded-2xl text-center border border-theme-danger/30">
          <AlertCircle className="w-8 h-8 text-theme-danger mx-auto mb-2" />
          <h3 className="text-base font-bold text-theme-fg">Unable to load guides</h3>
          <p className="text-xs text-theme-muted mt-1">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-outline text-xs mt-4 py-2 px-4 cursor-pointer">
            Try Again
          </button>
        </div>
      ) : displayedBlogs.length === 0 ? (
        <div className="card-surface p-12 rounded-2xl text-center border border-theme-border">
          <div className="w-12 h-12 rounded-full bg-theme-primary-light text-theme-primary flex items-center justify-center mx-auto mb-3">
            {isSearching ? <Search className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
          </div>
          <h3 className="text-base font-bold text-theme-fg">
            {isSearching
              ? `No guides found matching "${searchInput || currentSearch}"`
              : "No guides found"}
          </h3>
          <p className="text-xs text-theme-muted mt-1 max-w-sm mx-auto">
            {isSearching
              ? "We couldn't find any guides matching your search terms. Try different keywords or clear the search."
              : "Try searching with different terms or check back soon for newly published tech guides."}
          </p>
          {isSearching ? (
            <button onClick={clearSearch} className="btn-primary text-xs mt-4 py-2 px-4 cursor-pointer">
              Clear Search
            </button>
          ) : hasActiveFilters ? (
            <button onClick={clearAllFilters} className="btn-primary text-xs mt-4 py-2 px-4 cursor-pointer">
              Clear All Filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {regularBlogs.map((b) => (
            <BlogCard key={b._id} blog={b} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BlogsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <BlogsContent />
    </Suspense>
  );
}

