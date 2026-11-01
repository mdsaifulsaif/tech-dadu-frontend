"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ExternalLink, ArrowRight, Sparkles, Check } from "lucide-react";
import { IProduct } from "@/types/product";
import { Badge } from "@/components/common/Badge";
import { productApi } from "@/lib/api";

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [clicked, setClicked] = useState(false);

  const primaryAffiliate =
    product.affiliateLinks?.find((link) => link.isPrimary) ||
    product.affiliateLinks?.[0];

  const categoryName =
    typeof product.category === "object" && product.category?.name
      ? product.category.name
      : "Desk Gear";

  const handleAffiliateClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await productApi.trackClick(product._id, primaryAffiliate?.platform);
    } catch (err) {
      // Non-blocking track error
    }

    if (primaryAffiliate?.url) {
      window.open(primaryAffiliate.url, "_blank", "noopener,noreferrer");
    }
  };

  const mainImage = product.images?.[0] || "/next.svg";

  return (
    <div className="card-surface card-surface-hover flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Card Image Container */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-4/3 overflow-hidden bg-theme-bg">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-wrap gap-1 z-10">
            {product.isFeatured && (
              <Badge variant="accent" size="sm" icon={<Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}>
                <span className="text-[10px] sm:text-xs">Top Pick</span>
              </Badge>
            )}
            {product.badges?.slice(0, 1).map((b, i) => (
              <Badge key={i} variant="primary" size="sm">
                <span className="text-[10px] sm:text-xs">{b}</span>
              </Badge>
            ))}
          </div>

          {/* Rating Pill */}
          {product.rating > 0 && (
            <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 bg-black/75 backdrop-blur-md px-1.5 py-0.5 sm:px-2 rounded-full flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-400">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}
        </Link>

        {/* Card Content */}
        <div className="p-3 sm:p-5">
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-theme-muted mb-0.5 sm:mb-1">
            {categoryName}
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-xs sm:text-base text-theme-fg line-clamp-2 hover:text-theme-primary transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>

          {product.shortSummary && (
            <p className="hidden sm:block text-xs text-theme-muted mt-2 line-clamp-2 leading-relaxed">
              {product.shortSummary}
            </p>
          )}

          {/* Key Pros List Preview */}
          {product.pros && product.pros.length > 0 && (
            <div className="hidden sm:block mt-3 pt-3 border-t border-theme-border/60 space-y-1">
              {product.pros.slice(0, 2).map((pro, index) => (
                <div key={index} className="flex items-center gap-1.5 text-[11px] text-theme-muted">
                  <Check className="w-3 h-3 text-theme-success shrink-0" />
                  <span className="truncate">{pro}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Price & Affiliate CTA */}
      <div className="p-3 sm:p-5 pt-0">
        <div className="pt-2.5 sm:pt-3 border-t border-theme-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-baseline justify-between sm:block">
            <span className="text-[10px] sm:text-xs text-theme-muted">Price</span>
            <span className="text-sm sm:text-lg font-extrabold text-theme-fg tracking-tight">
              {product.price?.formatted || `$${product.price?.amount || 0}`}
            </span>
          </div>

          {primaryAffiliate ? (
            <button
              onClick={handleAffiliateClick}
              className="w-full sm:w-auto btn-primary text-xs py-2 px-2 sm:px-3 inline-flex items-center justify-center gap-1 sm:gap-1.5 font-semibold cursor-pointer whitespace-nowrap overflow-hidden min-w-0"
              title={`Buy on ${primaryAffiliate.platform === "amazon" ? "Amazon" : "Store"}`}
            >
              <span className="truncate">Buy on {primaryAffiliate.platform === "amazon" ? "Amazon" : "Store"}</span>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            </button>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="w-full sm:w-auto btn-outline text-xs py-2 px-2 sm:px-3 inline-flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap overflow-hidden min-w-0"
            >
              <span className="truncate">Details</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

