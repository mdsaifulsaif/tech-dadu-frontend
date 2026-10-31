"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Eye, Download, Sparkles, Layers } from "lucide-react";
import { IDigitalProduct } from "@/types";
import { Badge } from "@/components/common/Badge";
import { templateApi } from "@/lib/api";

interface TemplateCardProps {
  template: IDigitalProduct;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const categoryName =
    typeof template.category === "object" && template.category?.name
      ? template.category.name
      : "Template";

  const thumbnail =
    template.previewImages?.[0] ||
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60";

  const handleAction = async (type: "live_demo" | "download", url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await templateApi.trackAction(template._id, type);
    } catch {
      // non-blocking
    }
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="card-surface card-surface-hover flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Thumbnail Preview */}
        <Link href={`/templates/${template.slug}`} className="block relative aspect-16/10 overflow-hidden bg-theme-bg">
          <img
            src={thumbnail}
            alt={template.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Pricing Pill */}
          <div className="absolute top-2.5 right-2.5 z-10">
            {template.isFree || template.price === 0 ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-theme-success/90 text-white shadow-sm">
                FREE
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-theme-primary text-theme-primary-fg shadow-sm">
                ${template.price}
              </span>
            )}
          </div>

          {/* Category Pill */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge variant="primary" size="sm" icon={<Layers className="w-3 h-3" />}>
              {categoryName}
            </Badge>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5">
          <Link href={`/templates/${template.slug}`}>
            <h3 className="font-bold text-base text-theme-fg line-clamp-1 hover:text-theme-primary transition-colors leading-snug">
              {template.title}
            </h3>
          </Link>

          <p className="text-xs text-theme-muted mt-2 line-clamp-2 leading-relaxed">
            {template.description}
          </p>

          {/* Tech Stack Chips */}
          {template.techStack && template.techStack.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {template.techStack.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-theme-bg border border-theme-border text-theme-fg"
                >
                  {tech}
                </span>
              ))}
              {template.techStack.length > 4 && (
                <span className="px-1.5 py-0.5 text-[10px] text-theme-muted font-medium">
                  +{template.techStack.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer / Action Buttons */}
      <div className="px-5 pb-5 pt-2 border-t border-theme-border/60 flex items-center justify-between gap-2">
        {template.liveDemoUrl ? (
          <button
            onClick={(e) => handleAction("live_demo", template.liveDemoUrl, e)}
            className="btn-outline text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Demo</span>
          </button>
        ) : (
          <Link
            href={`/templates/${template.slug}`}
            className="btn-outline text-xs py-2 px-3 flex-1 text-center"
          >
            Details
          </Link>
        )}

        <button
          onClick={(e) =>
            handleAction(
              "download",
              template.purchaseUrl || template.liveDemoUrl,
              e
            )
          }
          className="btn-primary text-xs py-2 px-3.5 flex-1 flex items-center justify-center gap-1.5 font-semibold"
        >
          {template.isFree ? (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Get Free</span>
            </>
          ) : (
            <>
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buy ${template.price}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

