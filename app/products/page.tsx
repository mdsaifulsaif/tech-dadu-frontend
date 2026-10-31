"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Search,
  Filter,
  Sparkles,
  Laptop,
  ArrowUpDown,
  X,
  AlertCircle,
} from "lucide-react";
import { productApi, categoryApi } from "@/lib/api";
import { IProduct, ICategory } from "@/types/product";
import { ProductCard } from "@/components/features/products/ProductCard";
import { CardSkeleton } from "@/components/common/Skeleton";

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [selectedSort, setSelectedSort] = useState(currentSort);

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
      .getAll("product")
      .then((res) => {
        if (res.success && res.data) {
          setCategories(res.data);
        }
      })
      .catch(() => {
        // Fallback default categories
      });
  }, []);

  // Fetch Products based on search, category, sort
  useEffect(() => {
    setLoading(true);
    setError(null);

    const query: Record<string, any> = {
      sort: selectedSort,
      limit: 30,
    };

    if (currentCategory && currentCategory !== "all") {
      query.category = currentCategory;
    }

    if (currentSearch) {
      query.search = currentSearch;
    }

    productApi
      .getAll(query)
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data.products || []);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        setError(err?.message || "Failed to load desk setup products");
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentCategory, currentSearch, selectedSort]);

  // Instant client-side filtering while typing / debounced query runs
  const filteredProducts = useMemo(() => {
    const term = (searchInput || currentSearch).trim().toLowerCase();
    if (!term) return products;

    return products.filter((p) => {
      const titleMatch = p.title?.toLowerCase().includes(term);
      const descMatch =
        p.description?.toLowerCase().includes(term) ||
        p.shortSummary?.toLowerCase().includes(term);
      const badgeMatch = p.badges?.some((b) => b.toLowerCase().includes(term));
      const prosMatch = p.pros?.some((pro) => pro.toLowerCase().includes(term));
      return titleMatch || descMatch || badgeMatch || prosMatch;
    });
  }, [products, searchInput, currentSearch]);

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchInput("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchInput("");
    router.replace("/products");
  };

  const isSearching = Boolean(searchInput.trim()) || Boolean(currentSearch);
  const hasActiveFilters = isSearching || currentCategory !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-primary-light text-theme-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Tech Catalog 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-theme-fg">
          Curated Desk Setup <span className="text-gradient">Gear & Gadgets</span>
        </h1>
        <p className="mt-2 text-sm text-theme-muted max-w-2xl leading-relaxed">
          Explore top-rated mechanical keyboards, ergonomic accessories, desk mats, and workspace
          essentials reviewed for clean aesthetics and productivity.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 pb-6 border-b border-theme-border">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search keyboards, mice, lighting..."
            className="input-theme input-icon-left text-sm"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-fg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-theme-muted" />
            <span className="text-xs font-semibold uppercase text-theme-muted hidden sm:inline">
              Sort By:
            </span>
          </div>
          <select
            value={selectedSort}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSort(val);
              const params = new URLSearchParams(searchParams.toString());
              params.set("sort", val);
              router.replace(`${pathname}?${params.toString()}`);
            }}
            className="input-theme py-2 px-3 text-xs font-medium cursor-pointer"
          >
            <option value="newest">Latest Added</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          onClick={() => handleCategorySelect("all")}
          className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer ${
            currentCategory === "all"
              ? "bg-theme-primary text-theme-primary-fg shadow-sm"
              : "card-surface hover:border-theme-primary text-theme-muted"
          }`}
        >
          All Gear
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategorySelect(cat.slug)}
            className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              currentCategory === cat.slug
                ? "bg-theme-primary text-theme-primary-fg shadow-sm"
                : "card-surface hover:border-theme-primary text-theme-muted"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs sm:text-sm text-theme-muted">
          {isSearching ? (
            <>
              Showing <strong className="text-theme-fg">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "gear" : "gears"} for <span className="text-theme-primary font-semibold">&quot;{searchInput || currentSearch}&quot;</span>
            </>
          ) : (
            <>
              Showing <strong className="text-theme-fg">{filteredProducts.length}</strong> items
            </>
          )}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-3 text-xs text-theme-primary hover:underline font-semibold cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-theme-danger text-theme-danger border border-red-200 dark:border-red-900/50 mb-8 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card-surface p-12 text-center max-w-lg mx-auto rounded-2xl border border-theme-border">
          <div className="w-14 h-14 rounded-2xl bg-theme-primary-light text-theme-primary flex items-center justify-center mx-auto mb-4">
            {isSearching ? <Search className="w-7 h-7" /> : <Laptop className="w-7 h-7" />}
          </div>
          <h3 className="text-lg font-bold text-theme-fg mb-1">
            {isSearching
              ? `No gear found matching "${searchInput || currentSearch}"`
              : "No Products Found"}
          </h3>
          <p className="text-sm text-theme-muted mb-6 leading-relaxed">
            {isSearching
              ? `No desk setup gear matched your search "${searchInput || currentSearch}". Try different keywords or reset search.`
              : "No products available in this category right now."}
          </p>
          {isSearching ? (
            <button onClick={clearSearch} className="btn-primary text-xs py-2 px-4 cursor-pointer">
              Clear Search
            </button>
          ) : (
            <button onClick={clearFilters} className="btn-primary text-xs py-2 px-4 cursor-pointer">
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-theme-muted">
          Loading desk setup gear...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

