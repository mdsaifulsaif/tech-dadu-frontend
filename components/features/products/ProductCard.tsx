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
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
            {product.isFeatured && (
              <Badge variant="accent" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                Top Pick
              </Badge>
            )}
            {product.badges?.slice(0, 1).map((b, i) => (
              <Badge key={i} variant="primary" size="sm">
                {b}
              </Badge>
            ))}
          </div>

          {/* Rating Pill */}
          {product.rating > 0 && (
            <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-bold text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}
        </Link>

        {/* Card Content */}
        <div className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-theme-muted mb-1">
            {categoryName}
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-base text-theme-fg line-clamp-2 hover:text-theme-primary transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>

          {product.shortSummary && (
            <p className="text-xs text-theme-muted mt-2 line-clamp-2 leading-relaxed">
              {product.shortSummary}
            </p>
          )}

          {/* Key Pros List Preview */}
          {product.pros && product.pros.length > 0 && (
            <div className="mt-3 pt-3 border-t border-theme-border/60 space-y-1">
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
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-theme-border">
          <div>
            <span className="text-xs text-theme-muted block">Price</span>
            <span className="text-lg font-extrabold text-theme-fg tracking-tight">
              {product.price?.formatted || `$${product.price?.amount || 0}`}
            </span>
          </div>

          {primaryAffiliate ? (
            <button
              onClick={handleAffiliateClick}
              className="btn-primary text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
            >
              <span>Buy on {primaryAffiliate.platform === "amazon" ? "Amazon" : "Store"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="btn-outline text-xs py-2 px-3 inline-flex items-center gap-1"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

