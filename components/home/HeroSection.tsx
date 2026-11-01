"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Tag,
  Code2,
  Layers,
  Laptop,
} from "lucide-react";
import type { Session } from "next-auth";
import { IProduct, IDigitalProduct, ICategory } from "@/types";
import { productApi } from "@/lib/api";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import HeroBoxGrid from "./HeroBoxGrid";

interface HeroSectionProps {
  session?: Session | null;
  categories?: ICategory[];
  products?: IProduct[];
  templates?: IDigitalProduct[];
}

interface IComparisonRow {
  id?: string;
  pickBadge: string;
  badgeStyle: "purple" | "green" | "orange" | "blue";
  title: string;
  slug?: string;
  image?: string;
  bestFor: string;
  keyHighlight?: string;
  priceFormatted: string;
  affiliateUrl?: string;
}

const BADGE_CLASSES: Record<IComparisonRow["badgeStyle"], string> = {
  purple: "bg-[#efeaff] dark:bg-purple-950/60 text-[#3d28b0] dark:text-purple-300 border border-purple-200 dark:border-purple-800/40",
  green: "bg-[#e3f6ea] dark:bg-emerald-950/60 text-[#14683a] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40",
  orange: "bg-[#fff0dc] dark:bg-amber-950/60 text-[#8a4a05] dark:text-amber-300 border border-amber-200 dark:border-amber-800/40",
  blue: "bg-[#e0ecff] dark:bg-blue-950/60 text-[#1d4ed8] dark:text-blue-300 border border-blue-200 dark:border-blue-800/40",
};

const getBadgeStyle = (
  badge: string,
  idx: number
): "purple" | "green" | "orange" | "blue" => {
  const b = badge.toLowerCase();
  if (b.includes("overall") || b.includes("editor")) return "purple";
  if (b.includes("value") || b.includes("budget") || b.includes("free")) return "green";
  if (
    b.includes("wireless") ||
    b.includes("premium") ||
    b.includes("pro") ||
    b.includes("fullstack")
  )
    return "orange";
  if (idx === 0) return "purple";
  if (idx === 1) return "green";
  if (idx === 2) return "orange";
  return "blue";
};

export function HeroSection({
  session,
  categories = [],
  products = [],
  templates = [],
}: HeroSectionProps) {
  // 1. Available Categories: ONLY categories explicitly marked showInHero === true
  const availableCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    const candidateCats = categories.filter(
      (c) => c.type === "product" || c.type === "template" || c.type === "all"
    );

    // Strictly ONLY categories with showInHero === true
    const heroCategories = candidateCats.filter((c) => Boolean(c.showInHero));

    // Sort strictly by display order (order ascending: 1, 2, 3...)
    return [...heroCategories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [categories]);

  // 2. Active Tab State with Default Hero Tab detection
  const defaultCategory = useMemo(() => {
    if (availableCategories.length === 0) return null;
    return (
      availableCategories.find((c) => Boolean(c.isDefaultHero)) ||
      availableCategories[0]
    );
  }, [availableCategories]);

  const [activeTab, setActiveTab] = useState<string>("");

  const currentCategory = useMemo(() => {
    if (availableCategories.length === 0) return null;
    if (activeTab) {
      const found = availableCategories.find((c) => c.slug === activeTab);
      if (found) return found;
    }
    return defaultCategory || availableCategories[0];
  }, [availableCategories, activeTab, defaultCategory]);

  // 3. Dynamic Comparison Rows: Max 3 items per category in Hero Table
  const {
    title: comparisonTitle,
    fullComparisonHref,
    rows,
  } = useMemo(() => {
    if (!currentCategory) {
      return {
        title: "Top Picks, compared",
        fullComparisonHref: "/products",
        rows: [] as IComparisonRow[],
      };
    }

    const catId = String(currentCategory._id);
    const catSlug = currentCategory.slug?.toLowerCase();
    const isTemplateCat = currentCategory.type === "template";

    let rowItems: IComparisonRow[] = [];

    if (isTemplateCat) {
      // Find templates matching current category that are explicitly featured for comparison
      let matched = templates.filter((t) => {
        const tCatId =
          typeof t.category === "object"
            ? String(t.category?._id)
            : String(t.category || "");
        const tCatSlug =
          typeof t.category === "object"
            ? t.category?.slug?.toLowerCase()
            : "";
        const isCatMatch = tCatId === catId || tCatSlug === catSlug;
        return isCatMatch && Boolean(t.comparison?.isFeatured);
      });

      // Fallback: if no direct category match, show any featured templates
      if (matched.length === 0) {
        matched = templates.filter((t) => Boolean(t.comparison?.isFeatured));
      }

      const fallbackBadges = ["Best Overall", "Best Value", "Top Pick"];

      // MAX 3 ITEMS strictly
      rowItems = matched.slice(0, 3).map((item, idx) => {
        const badge =
          item.comparison?.badge || fallbackBadges[idx] || "Our Pick";
        const priceText = item.isFree ? "Free" : `$${item.price ?? 0}`;

        return {
          id: item._id,
          pickBadge: badge,
          badgeStyle: getBadgeStyle(badge, idx),
          title: item.title,
          slug: item.slug,
          image: item.previewImages?.[0],
          bestFor:
            item.comparison?.bestFor ||
            item.shortSummary ||
            (item.techStack?.length
              ? item.techStack.join(" • ")
              : "Modern code template"),
          keyHighlight:
            item.comparison?.keyHighlight || item.features?.[0] || "",
          priceFormatted: priceText,
          affiliateUrl:
            item.purchaseUrl || item.liveDemoUrl || `/templates/${item.slug}`,
        };
      });
    } else {
      // Find products matching current category that are explicitly featured for comparison
      let matched = products.filter((p) => {
        const pCatId =
          typeof p.category === "object"
            ? String(p.category?._id)
            : String(p.category || "");
        const pCatSlug =
          typeof p.category === "object"
            ? p.category?.slug?.toLowerCase()
            : "";
        const isCatMatch = pCatId === catId || pCatSlug === catSlug;
        return isCatMatch && Boolean(p.comparison?.isFeatured);
      });

      // Fallback: if no direct category match, show any featured products
      if (matched.length === 0) {
        matched = products.filter((p) => Boolean(p.comparison?.isFeatured));
      }

      const fallbackBadges = ["Best Overall", "Best Value", "Top Pick"];

      // MAX 3 ITEMS strictly
      rowItems = matched.slice(0, 3).map((item, idx) => {
        const badge =
          item.comparison?.badge || fallbackBadges[idx] || "Our Pick";
        const priceText = item.price?.formatted
          ? item.price.formatted.startsWith("$")
            ? item.price.formatted
            : `$${item.price.formatted}`
          : `$${item.price?.amount ?? 0}`;

        return {
          id: item._id,
          pickBadge: badge,
          badgeStyle: getBadgeStyle(badge, idx),
          title: item.title,
          slug: item.slug,
          image: item.images?.[0],
          bestFor:
            item.comparison?.bestFor ||
            item.shortSummary ||
            (item.pros?.length
              ? item.pros.join(" • ")
              : "Curated desk gear & gadget"),
          keyHighlight: item.comparison?.keyHighlight || item.pros?.[0] || "",
          priceFormatted: priceText,
          affiliateUrl:
            item.affiliateLinks?.[0]?.url || `/products/${item.slug}`,
        };
      });
    }

    const fullHref = isTemplateCat
      ? `/templates?category=${currentCategory.slug}`
      : `/products?category=${currentCategory.slug}`;

    return {
      title: `Best ${currentCategory.name}, compared`,
      fullComparisonHref: fullHref,
      rows: rowItems,
    };
  }, [currentCategory, products, templates]);

  const handleCheckPrice = (row: IComparisonRow) => {
    if (row.id) {
      productApi.trackClick(row.id).catch(() => { });
    }
    if (row.affiliateUrl && row.affiliateUrl.startsWith("http")) {
      window.open(row.affiliateUrl, "_blank", "noopener,noreferrer");
    } else {
      window.location.href =
        row.affiliateUrl ||
        (row.slug ? `/products/${row.slug}` : "/products");
    }
  };

  const isTemplateType = currentCategory?.type === "template";
  const RowIcon = isTemplateType ? Layers : Laptop;

  return (
    <div className="flex w-full flex-col bg-theme-bg transition-colors duration-200">
      {/* Compact Dark Hero Band - Optimized for Laptop Full-screen without Scrolling */}



      {/* <section className="bg-[#14102b] dark:bg-[#0c091d] pt-6 pb-12 sm:pt-8 sm:pb-16 text-white transition-colors duration-200">
          <div className="mx-auto max-w-[840px] px-4 sm:px-6 text-center">
  
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.08] tracking-tight text-white">
              <span className="block">Don&apos;t buy before you</span>
              <span className="font-serif font-normal italic tracking-normal text-[#b8a6ff]">
                compare.
              </span>
            </h1>

     
            <div className="mt-4 mb-3 max-w-xl mx-auto">
              <GlobalSearch
                variant="hero"
                placeholder="Search keyboards, desk gear, templates, guides..."
              />
            </div>

      
            {availableCategories.length > 0 && (
              <div
                className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
                role="tablist"
                aria-label="Comparison categories"
              >
                {availableCategories.map((cat) => {
                  const isActive = currentCategory?.slug === cat.slug;
                  return (
                    <button
                      key={cat._id || cat.slug}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(cat.slug)}
                      className={`min-h-9 cursor-pointer rounded-full px-3.5 sm:px-4 text-xs sm:text-sm transition-all duration-150 ${isActive
                        ? "bg-white font-bold text-[#14102b] shadow-md scale-102"
                        : "border border-[#3b3078] font-medium text-[#e4dcff] hover:bg-white/10"
                        }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section> */}


      <section className="relative overflow-hidden bg-[#14102b] dark:bg-[#0c091d] pt-6 pb-12 sm:pt-12 sm:pb-16 text-white transition-colors duration-200">
        <HeroBoxGrid />

        <div className="relative z-10 mx-auto max-w-[840px] px-4 sm:px-6 text-center">
          {/* Big Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.08] tracking-tight text-white">
            <span className="block">Don&apos;t buy before you</span>
            <span className="font-serif font-normal italic tracking-normal text-[#b8a6ff]">
              compare.
            </span>
          </h1>

          {/* Global Search Bar */}
          <div className="mt-4 mb-3 max-w-xl mx-auto">
            <GlobalSearch
              variant="hero"
              placeholder="Search keyboards, desk gear, templates, guides..."
            />
          </div>

          {/* Dynamic Category Switcher Pills */}
          {availableCategories.length > 0 && (
            <div
              className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
              role="tablist"
              aria-label="Comparison categories"
            >
              {availableCategories.map((cat) => {
                const isActive = currentCategory?.slug === cat.slug;
                return (
                  <button
                    key={cat._id || cat.slug}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(cat.slug)}
                    className={`min-h-9 cursor-pointer rounded-full px-3.5 sm:px-4 text-xs sm:text-sm transition-all duration-150 ${isActive
                      ? "bg-white font-bold text-[#14102b] shadow-md scale-102"
                      : "border border-[#3b3078] font-medium text-[#e4dcff] hover:bg-white/10"
                      }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>


      {/* Comparison card: compact overlap for laptop view */}
      <section className="relative z-10 mx-auto -mt-8 sm:-mt-10 w-full max-w-[1100px] px-4 sm:px-6">
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl card-surface border border-theme-border shadow-[0_20px_45px_-20px_rgba(20,16,43,0.3)] dark:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.7)] transition-colors duration-200">
          {/* Card Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-theme-border">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-theme-fg">
                {comparisonTitle}
              </h2>
              <p className="text-xs text-theme-muted">
                Our top picks at a glance (Max 3)
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-muted">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Prices verified</span>
            </div>
          </div>

          {/* Comparison Rows Table (Max 3 Items, No separate Price column) */}
          {availableCategories.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <p className="text-xs sm:text-sm font-semibold text-theme-muted">
                No categories selected for Hero comparison yet.
              </p>
              <p className="text-[11px] text-theme-muted/70 mt-1">
                Go to Admin Dashboard &rarr; Categories and turn on &ldquo;In Hero&rdquo; on the categories you want to compare.
              </p>
            </div>
          ) : rows.length === 0 ? (
            <div className="py-10 px-6 text-center">
              <p className="text-xs sm:text-sm font-semibold text-theme-muted">
                No items featured for comparison in &ldquo;{currentCategory?.name || "this category"}&rdquo; yet.
              </p>
              <Link
                href={fullComparisonHref}
                className="mt-2.5 inline-flex items-center text-xs font-bold text-theme-primary hover:underline"
              >
                Browse all {currentCategory?.name || "products"} &rarr;
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="bg-theme-bg/40 text-[11px] font-bold uppercase tracking-wider text-theme-muted border-b border-theme-border">
                    <th scope="col" className="px-4 sm:px-6 py-2.5">
                      Our pick
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-2.5">
                      Product
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-2.5">
                      Best for
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-2.5 text-right">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border">
                  {rows.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="transition-colors hover:bg-theme-surface-hover/60 border-b border-theme-border last:border-b-0"
                    >
                      {/* OUR PICK Badge */}
                      <td className="px-4 sm:px-6 py-3 align-middle w-[140px]">
                        <span
                          className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${BADGE_CLASSES[row.badgeStyle]
                            }`}
                        >
                          {row.pickBadge}
                        </span>
                      </td>

                      {/* PRODUCT Thumbnail & Name */}
                      <td className="px-4 sm:px-6 py-3 align-middle">
                        <div className="flex items-center gap-3">
                          {row.image ? (
                            <Image
                              src={row.image}
                              alt={row.title}
                              width={40}
                              height={40}
                              className="h-10 w-10 shrink-0 rounded-xl border border-theme-border bg-theme-bg object-cover"
                            />
                          ) : (
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-primary-light text-theme-primary">
                              <RowIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                          <span
                            title={row.title}
                            className="max-w-[240px] truncate text-sm font-bold text-theme-fg"
                          >
                            {row.title}
                          </span>
                        </div>
                      </td>

                      {/* BEST FOR Tagline + Standout Highlight */}
                      <td className="px-4 sm:px-6 py-3 align-middle text-xs text-theme-muted">
                        <div className="font-medium text-theme-fg line-clamp-1 max-w-[320px]">
                          {row.bestFor}
                        </div>
                        {row.keyHighlight && (
                          <div className="text-[11px] text-theme-muted mt-0.5 line-clamp-1 max-w-[320px]">
                            {row.keyHighlight}
                          </div>
                        )}
                      </td>

                      {/* ACTION Button */}
                      <td className="px-4 sm:px-6 py-3 text-right align-middle w-[150px]">
                        <button
                          type="button"
                          onClick={() => handleCheckPrice(row)}
                          className="btn-primary text-xs py-2 px-3.5 inline-flex items-center whitespace-nowrap shadow-xs"
                        >
                          Check price
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Card Footer Note & Link */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-theme-border bg-theme-bg/30 px-4 sm:px-6 py-2.5">
            <span className="text-[11px] sm:text-xs text-theme-muted">
              Prices change often. Confirm on the store before you buy.
            </span>
            <Link
              href={fullComparisonHref}
              className="text-xs font-bold text-theme-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View full comparison</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Trust Row (Compact) */}
      <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 sm:px-6 pt-5 pb-8 text-xs sm:text-sm font-medium text-theme-muted transition-colors">
        <div className="flex items-center gap-1.5">
          <ShieldCheck
            className="h-4 w-4 text-theme-primary"
            aria-hidden="true"
          />
          <span>Tested for long coding sessions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Tag className="h-4 w-4 text-theme-primary" aria-hidden="true" />
          <span>Verified affiliate prices</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Code2
            className="h-4 w-4 text-theme-primary"
            aria-hidden="true"
          />
          <span>Free starter codebases</span>
        </div>
      </div>
    </div>
  );
}
export default HeroSection;
