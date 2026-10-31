"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Tag,
  Code2,
  Keyboard,
  Monitor,
  Layers,
  Laptop,
  Sparkles,
} from "lucide-react";
import type { Session } from "next-auth";
import { IProduct, IDigitalProduct, ICategory } from "@/types";
import { productApi } from "@/lib/api";

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
  purple: "bg-[#efeaff] text-[#3d28b0]",
  green: "bg-[#e3f6ea] text-[#14683a]",
  orange: "bg-[#fff0dc] text-[#8a4a05]",
  blue: "bg-[#e0ecff] text-[#1d4ed8]",
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
  // 1. Available Categories from database (products & templates)
  const availableCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    // Filter candidate categories (product and template types only)
    const candidateCats = categories.filter(
      (c) => c.type === "product" || c.type === "template"
    );

    // Prioritize categories that actually contain products or templates
    const catsWithItems = candidateCats.filter((cat) => {
      const catId = String(cat._id);
      const catSlug = cat.slug?.toLowerCase();

      const hasProducts = products.some((p) => {
        const pCatId =
          typeof p.category === "object"
            ? String(p.category?._id)
            : String(p.category || "");
        const pCatSlug =
          typeof p.category === "object"
            ? p.category?.slug?.toLowerCase()
            : "";
        return pCatId === catId || pCatSlug === catSlug;
      });

      const hasTemplates = templates.some((t) => {
        const tCatId =
          typeof t.category === "object"
            ? String(t.category?._id)
            : String(t.category || "");
        const tCatSlug =
          typeof t.category === "object"
            ? t.category?.slug?.toLowerCase()
            : "";
        return tCatId === catId || tCatSlug === catSlug;
      });

      return hasProducts || hasTemplates;
    });

    return catsWithItems.length > 0 ? catsWithItems : candidateCats;
  }, [categories, products, templates]);

  // 2. Active Tab State
  const [activeTab, setActiveTab] = useState<string>("");

  const currentCategory = useMemo(() => {
    if (availableCategories.length === 0) return null;
    return (
      availableCategories.find((c) => c.slug === activeTab) ||
      availableCategories[0]
    );
  }, [availableCategories, activeTab]);

  // 3. Dynamic Comparison Rows from the Database for the selected category
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
      // Find user's templates matching current category
      const matched = templates.filter((t) => {
        const tCatId =
          typeof t.category === "object"
            ? String(t.category?._id)
            : String(t.category || "");
        const tCatSlug =
          typeof t.category === "object"
            ? t.category?.slug?.toLowerCase()
            : "";
        return tCatId === catId || tCatSlug === catSlug;
      });

      // Prioritize items marked as featured in comparison
      const sorted = [...matched].sort((a, b) => {
        const aFeat = a.comparison?.isFeatured ? 1 : 0;
        const bFeat = b.comparison?.isFeatured ? 1 : 0;
        return bFeat - aFeat;
      });

      const fallbackBadges = [
        "Best Overall",
        "Best Value",
        "Top Pick",
        "Recommended",
      ];

      rowItems = sorted.slice(0, 4).map((item, idx) => {
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
      // Find user's products matching current category
      const matched = products.filter((p) => {
        const pCatId =
          typeof p.category === "object"
            ? String(p.category?._id)
            : String(p.category || "");
        const pCatSlug =
          typeof p.category === "object"
            ? p.category?.slug?.toLowerCase()
            : "";
        return pCatId === catId || pCatSlug === catSlug;
      });

      // Prioritize items marked as featured in comparison
      const sorted = [...matched].sort((a, b) => {
        const aFeat = a.comparison?.isFeatured ? 1 : 0;
        const bFeat = b.comparison?.isFeatured ? 1 : 0;
        return bFeat - aFeat;
      });

      const fallbackBadges = [
        "Best Overall",
        "Best Value",
        "Top Pick",
        "Recommended",
      ];

      rowItems = sorted.slice(0, 4).map((item, idx) => {
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
      productApi.trackClick(row.id).catch(() => {});
    }
    if (row.affiliateUrl && row.affiliateUrl.startsWith("http")) {
      window.open(row.affiliateUrl, "_blank", "noopener,noreferrer");
    } else {
      window.location.href =
        row.affiliateUrl ||
        (row.slug ? `/products/${row.slug}` : "/products");
    }
  };

  // Thumbnail fallback icon based on category type
  const isTemplateType = currentCategory?.type === "template";
  const RowIcon = isTemplateType ? Layers : Laptop;

  return (
    <div className="flex w-full flex-col bg-white">
      {/* Top Affiliate Disclosure Strip */}
      <div className="flex min-h-11 w-full flex-wrap items-center justify-center gap-x-3 bg-[#0b0818] px-6 text-center text-[13px] text-[#c9c2e6]">
        <span>
          We may earn a commission when you buy through our links, at no extra
          cost to you.
        </span>
        <Link
          href="/blogs"
          className="inline-flex min-h-11 items-center font-semibold text-white underline hover:text-[#d6cbff]"
        >
          How we make money
        </Link>
      </div>

      {/* Dark hero band */}
      <section className="bg-[#14102b] pt-24 pb-28 text-white md:pt-32 md:pb-32">
        <div className="mx-auto max-w-[880px] px-6 text-center">
          {/* Badge: Independent reviews */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#3b3078] bg-[#1f1946] px-3.5 py-1.5 text-[13px] font-semibold text-[#d6cbff]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>Independent reviews. Updated October 2026</span>
          </div>

          {/* Big Headline */}
          <h1 className="mt-6 text-[clamp(40px,6.4vw,76px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-white">
            Don&apos;t buy before you{" "}
            <span className="font-serif font-normal italic tracking-normal text-[#b8a6ff]">
              compare.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-[620px] text-base leading-relaxed text-[#c9c2e6] sm:text-lg">
            Side-by-side comparisons of desk gear, Next.js templates and Figma
            kits, with verified prices and honest pros &amp; cons.
          </p>

          {/* Dynamic Category Switcher Pills from your actual database */}
          {availableCategories.length > 0 && (
            <div
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
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
                    className={`min-h-11 cursor-pointer rounded-full px-5 text-sm transition-all ${
                      isActive
                        ? "bg-white font-bold text-[#14102b] shadow-md scale-102"
                        : "border border-[#3b3078] font-semibold text-[#e4dcff] hover:bg-white/10"
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

      {/* Comparison card: overlaps the dark band */}
      <section className="relative z-10 mx-auto -mt-20 w-full max-w-[1100px] px-6">
        <div className="overflow-hidden rounded-3xl border border-[#e4defa] bg-white text-[#14102b] shadow-[0_40px_80px_-40px_rgba(20,16,43,0.55)]">
          {/* Card Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-5">
            <div>
              <h2 className="text-xl font-extrabold tracking-[-0.01em] text-[#14102b]">
                {comparisonTitle}
              </h2>
              <p className="mt-0.5 text-[13px] text-[#4b4763]">
                Our top picks at a glance
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3a3552]">
              <span className="h-2 w-2 rounded-full bg-[#1f9d55]" />
              <span>Prices verified</span>
            </div>
          </div>

          {/* Comparison Rows Table */}
          {rows.length === 0 ? (
            <div className="py-12 px-6 text-center border-t border-[#efebfc]">
              <p className="text-sm font-semibold text-gray-500">
                No items added in &ldquo;{currentCategory?.name || "this category"}&rdquo; yet.
              </p>
              <Link
                href={fullComparisonHref}
                className="mt-3 inline-flex items-center text-xs font-bold text-[#5b3fe0] hover:underline"
              >
                Browse all {currentCategory?.name || "products"} &rarr;
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#faf9ff] text-xs font-bold uppercase tracking-[0.06em] text-[#5a5575]">
                    <th scope="col" className="border-t border-[#efebfc] px-6 py-3">
                      Our pick
                    </th>
                    <th scope="col" className="border-t border-[#efebfc] px-6 py-3">
                      Product
                    </th>
                    <th scope="col" className="border-t border-[#efebfc] px-6 py-3">
                      Best for
                    </th>
                    <th scope="col" className="border-t border-[#efebfc] px-6 py-3">
                      Price
                    </th>
                    <th scope="col" className="border-t border-[#efebfc] px-6 py-3">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="transition-colors hover:bg-[#faf9ff]"
                    >
                      {/* OUR PICK Badge */}
                      <td className="border-t border-[#efebfc] px-6 py-4 align-middle">
                        <span
                          className={`inline-block whitespace-nowrap rounded-full px-2.5 py-[3px] text-xs font-bold ${
                            BADGE_CLASSES[row.badgeStyle]
                          }`}
                        >
                          {row.pickBadge}
                        </span>
                      </td>

                      {/* PRODUCT Thumbnail & Name */}
                      <td className="border-t border-[#efebfc] px-6 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          {row.image ? (
                            <Image
                              src={row.image}
                              alt={row.title}
                              width={44}
                              height={44}
                              className="h-11 w-11 shrink-0 rounded-xl border border-[#e4defa] bg-[#faf9ff] object-cover"
                            />
                          ) : (
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#efeaff] text-[#5b3fe0]">
                              <RowIcon
                                className="h-[22px] w-[22px]"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                          <span
                            title={row.title}
                            className="max-w-[260px] truncate text-[15px] font-bold text-[#14102b]"
                          >
                            {row.title}
                          </span>
                        </div>
                      </td>

                      {/* BEST FOR Tagline + Standout Highlight */}
                      <td className="border-t border-[#efebfc] px-6 py-4 align-middle text-sm text-[#3a3552]">
                        <div className="font-medium text-[#14102b] line-clamp-1">
                          {row.bestFor}
                        </div>
                        {row.keyHighlight && (
                          <div className="text-[11px] font-normal text-[#6b6589] mt-0.5 line-clamp-1">
                            {row.keyHighlight}
                          </div>
                        )}
                      </td>

                      {/* PRICE */}
                      <td className="whitespace-nowrap border-t border-[#efebfc] px-6 py-4 align-middle text-[15px] font-bold text-[#14102b]">
                        {row.priceFormatted}
                      </td>

                      {/* ACTION Button */}
                      <td className="border-t border-[#efebfc] px-6 py-4 text-right align-middle">
                        <button
                          type="button"
                          onClick={() => handleCheckPrice(row)}
                          className="inline-flex min-h-11 cursor-pointer items-center whitespace-nowrap rounded-[10px] bg-[#5b3fe0] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#4a31c9]"
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
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#efebfc] bg-[#faf9ff] px-6 py-3.5">
            <span className="text-xs text-[#4b4763]">
              Prices change often. Confirm on the store before you buy.
            </span>
            <Link
              href={fullComparisonHref}
              className="inline-flex min-h-11 items-center text-[13px] font-bold text-[#3d28b0] hover:text-[#2b1a8a]"
            >
              View full comparison
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Trust Row */}
      <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center justify-center gap-x-9 gap-y-3 px-6 pt-10 pb-14 text-sm font-medium text-[#3a3552]">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className="h-[18px] w-[18px] text-[#5b3fe0]"
            aria-hidden="true"
          />
          <span>Tested for long coding sessions</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-[18px] w-[18px] text-[#5b3fe0]" aria-hidden="true" />
          <span>Verified affiliate prices</span>
        </div>
        <div className="flex items-center gap-2">
          <Code2
            className="h-[18px] w-[18px] text-[#5b3fe0]"
            aria-hidden="true"
          />
          <span>Free starter codebases</span>
        </div>
      </div>
    </div>
  );
}
