"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Search,
  Layers,
  Sparkles,
  Filter,
  X,
  AlertCircle,
  Code2,
  Palette,
  Check,
} from "lucide-react";
import { templateApi, categoryApi } from "@/lib/api";
import { IDigitalProduct, ICategory } from "@/types";
import { TemplateCard } from "@/components/features/templates/TemplateCard";
import { CardSkeleton } from "@/components/common/Skeleton";

function TemplatesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("search") || "";
  const currentPricing = searchParams.get("pricing") || "all"; // 'all' | 'free' | 'paid'
  const currentStack = searchParams.get("stack") || "All";

  const [rawTemplates, setRawTemplates] = useState<IDigitalProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState(currentSearch);

  // Sync search input if currentSearch from URL changes
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Debounced URL sync
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
      .getAll("template")
      .then((res) => {
        if (res.success && res.data) {
          setCategories(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Templates from Backend
  useEffect(() => {
    setLoading(true);
    setError(null);

    const query: Record<string, any> = {
      limit: 50,
    };

    if (currentCategory && currentCategory !== "all") {
      query.category = currentCategory;
    }
    if (currentSearch) {
      query.search = currentSearch;
    }

    templateApi
      .getAll(query)
      .then((res) => {
        if (res.success && res.data) {
          const list: IDigitalProduct[] = res.data.templates || res.data || [];
          setRawTemplates(list);
        } else {
          setRawTemplates([]);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load templates.");
        setRawTemplates([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentCategory, currentSearch]);

  // Dynamically extract actual stacks / tools present in the current items
  const availableStacks = useMemo(() => {
    const stackCounts = new Map<string, number>();
    rawTemplates.forEach((t) => {
      t.techStack?.forEach((s) => {
        const clean = s?.trim();
        if (clean) {
          stackCounts.set(clean, (stackCounts.get(clean) || 0) + 1);
        }
      });
    });

    const sorted = Array.from(stackCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([stack]) => stack);

    return ["All", ...sorted];
  }, [rawTemplates]);

  // Real-time instant filtering for search, pricing & tech stacks
  const filteredTemplates = useMemo(() => {
    let list = rawTemplates;

    // Instant search filter on title, description, shortSummary, techStack, features
    const term = (searchInput || currentSearch).trim().toLowerCase();
    if (term) {
      list = list.filter((t) => {
        const titleMatch = t.title?.toLowerCase().includes(term);
        const descMatch =
          t.description?.toLowerCase().includes(term) ||
          t.shortSummary?.toLowerCase().includes(term);
        const stackMatch = t.techStack?.some((s) =>
          s.toLowerCase().includes(term)
        );
        const featuresMatch = t.features?.some((f) =>
          f.toLowerCase().includes(term)
        );
        return titleMatch || descMatch || stackMatch || featuresMatch;
      });
    }

    // Pricing filter
    if (currentPricing === "free") {
      list = list.filter((t) => t.isFree || t.price === 0);
    } else if (currentPricing === "paid") {
      list = list.filter((t) => !t.isFree && t.price > 0);
    }

    // Dynamic Tech Stack filter
    if (currentStack && currentStack !== "All") {
      list = list.filter((t) =>
        t.techStack?.some(
          (tech) => tech.toLowerCase().trim() === currentStack.toLowerCase().trim()
        )
      );
    }

    return list;
  }, [rawTemplates, searchInput, currentSearch, currentPricing, currentStack]);

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === "all" || v === "All") {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });

    // Reset stack filter when changing categories if the stack is no longer valid
    if (newParams.category && newParams.category !== currentCategory) {
      params.delete("stack");
    }

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
    router.replace("/templates");
  };

  const isSearching = Boolean(searchInput.trim()) || Boolean(currentSearch);
  const hasActiveFilters =
    isSearching ||
    currentCategory !== "all" ||
    currentPricing !== "all" ||
    currentStack !== "All";

  const isUiUxCategory = currentCategory === "ui-ux-design" || currentCategory.includes("ui");

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Dynamic Header Banner Based on Category */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-primary-light text-theme-primary text-xs font-semibold uppercase tracking-wider mb-3">
          {isUiUxCategory ? (
            <>
              <Palette className="w-3.5 h-3.5" />
              <span>Figma & Mobile Design Systems</span>
            </>
          ) : (
            <>
              <Layers className="w-3.5 h-3.5" />
              <span>Modern Web Boilerplates & Starters</span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-theme-fg">
          {isUiUxCategory ? (
            <>
              Curated <span className="text-gradient">UI/UX Design & Figma Kits</span>
            </>
          ) : (
            <>
              Developer <span className="text-gradient">Templates & UI Kits</span>
            </>
          )}
        </h1>

        <p className="mt-3 text-sm sm:text-base text-theme-muted leading-relaxed">
          {isUiUxCategory
            ? "Production-ready Figma files, auto-layout components, and mobile wireframes. Build high-converting user interfaces faster."
            : "Production-ready Next.js 16 boilerplates, Tailwind landing pages, and fullstack starter kits. Ship your ideas in hours, not weeks."}
        </p>
      </div>

      {/* Production-Grade Category Tabs (Primary Navigation) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs sm:text-sm">
        <button
          onClick={() => updateFilters({ category: "all" })}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            currentCategory === "all"
              ? "bg-theme-primary text-theme-primary-fg shadow-sm scale-102"
              : "card-surface text-theme-muted hover:text-theme-fg border border-theme-border"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Digital Assets</span>
        </button>

        {categories.map((cat) => {
          const isSelected = currentCategory === cat.slug;
          const isUi = cat.slug.includes("ui") || cat.name.toLowerCase().includes("design");
          return (
            <button
              key={cat._id}
              onClick={() => updateFilters({ category: cat.slug })}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-theme-primary text-theme-primary-fg shadow-sm scale-102"
                  : "card-surface text-theme-muted hover:text-theme-fg border border-theme-border"
              }`}
            >
              {isUi ? <Palette className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card-surface p-4 sm:p-5 rounded-2xl mb-8 border border-theme-border flex flex-col gap-4">
        {/* Search input + Pricing Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                isUiUxCategory
                  ? "Search Figma kits, mobile screens, design tokens..."
                  : "Search templates (e.g. Next.js, SaaS, Portfolio)..."
              }
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

          {/* Pricing Tabs: All / Free / Paid */}
          <div className="flex items-center gap-1.5 bg-theme-bg p-1 rounded-xl border border-theme-border self-start sm:self-auto">
            <button
              onClick={() => updateFilters({ pricing: "all" })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                currentPricing === "all"
                  ? "bg-theme-primary text-theme-primary-fg shadow-xs"
                  : "text-theme-muted hover:text-theme-fg"
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => updateFilters({ pricing: "free" })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                currentPricing === "free"
                  ? "bg-theme-success text-white shadow-xs"
                  : "text-theme-muted hover:text-theme-fg"
              }`}
            >
              Free
            </button>
            <button
              onClick={() => updateFilters({ pricing: "paid" })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                currentPricing === "paid"
                  ? "bg-theme-primary text-theme-primary-fg shadow-xs"
                  : "text-theme-muted hover:text-theme-fg"
              }`}
            >
              Premium
            </button>
          </div>
        </div>

        {/* Dynamic Tools & Tech Stack Pills (Only shows stacks actually present in this category) */}
        {availableStacks.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs border-t border-theme-border/60">
            <span className="text-[11px] font-semibold text-theme-muted uppercase tracking-wider flex items-center gap-1 shrink-0">
              {isUiUxCategory ? <Palette className="w-3.5 h-3.5 text-theme-primary" /> : <Code2 className="w-3.5 h-3.5 text-theme-primary" />}
              <span>{isUiUxCategory ? "Design Tools:" : "Stack / Tools:"}</span>
            </span>
            {availableStacks.map((stack) => (
              <button
                key={stack}
                onClick={() => updateFilters({ stack })}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  currentStack === stack
                    ? "bg-theme-fg text-theme-bg font-bold shadow-sm"
                    : "bg-theme-bg border border-theme-border text-theme-muted hover:text-theme-fg hover:border-theme-primary/40"
                }`}
              >
                {stack}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs sm:text-sm text-theme-muted">
          {isSearching ? (
            <>
              Showing <strong className="text-theme-fg">{filteredTemplates.length}</strong> {filteredTemplates.length === 1 ? "item" : "items"} for <span className="text-theme-primary font-semibold">&quot;{searchInput || currentSearch}&quot;</span>
            </>
          ) : (
            <>
              Showing <strong className="text-theme-fg">{filteredTemplates.length}</strong> items
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

      {/* Templates Grid / Skeleton / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="card-surface p-8 rounded-2xl text-center border border-theme-danger/30">
          <AlertCircle className="w-8 h-8 text-theme-danger mx-auto mb-2" />
          <h3 className="text-base font-bold text-theme-fg">Unable to load items</h3>
          <p className="text-xs text-theme-muted mt-1">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-outline text-xs mt-4 py-2 px-4 cursor-pointer">
            Try Again
          </button>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="card-surface p-12 rounded-2xl text-center border border-theme-border">
          <div className="w-12 h-12 rounded-full bg-theme-primary-light text-theme-primary flex items-center justify-center mx-auto mb-3">
            {isSearching ? <Search className="w-6 h-6" /> : isUiUxCategory ? <Palette className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
          </div>
          <h3 className="text-base font-bold text-theme-fg">
            {isSearching
              ? `No items found matching "${searchInput || currentSearch}"`
              : isUiUxCategory
              ? "No UI/UX design kits found"
              : "No templates found"}
          </h3>
          <p className="text-xs text-theme-muted mt-1 max-w-sm mx-auto">
            {isSearching
              ? "We couldn't find any templates or design kits matching your search query. Try different keywords or clear your search."
              : hasActiveFilters
              ? "Try adjusting your search keywords, clearing filters, or check back soon."
              : isUiUxCategory
              ? "Add your first Figma UI kit from the admin dashboard to showcase it here."
              : "Showcase your first developer boilerplate or freebie kit from the dashboard."}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => (
            <TemplateCard key={tpl._id} template={tpl} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <TemplatesContent />
    </Suspense>
  );
}
