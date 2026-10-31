"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Eye, Download, Sparkles, Layers, ArrowUpRight } from "lucide-react";
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
    <div className="card-surface card-surface-hover flex flex-col justify-between overflow-hidden group/card h-full">
      <div>
        {/* Pinterest / Dribbble Vertical Auto-Scroll Preview */}
        <Link
          href={`/templates/${template.slug}`}
          className="block relative h-48 sm:h-72 sm:h-80 overflow-hidden bg-theme-bg/80 border-b border-theme-border/60 group/scroll"
          title={`Click to view full landing page for ${template.title}`}
        >
          {/* Landing Page Image - Glides smoothly down on hover to reveal full page */}
          <Image
            src={thumbnail}
            alt={template.title}
            width={600}
            height={1600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-auto min-h-full object-cover object-top transition-transform duration-[4500ms] ease-in-out group-hover/scroll:-translate-y-[calc(100%-12rem)] sm:group-hover/scroll:-translate-y-[calc(100%-20rem)]"
          />

          {/* Pricing Pill */}
          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 pointer-events-none">
            {template.isFree || template.price === 0 ? (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-theme-success/95 text-white shadow-md backdrop-blur-xs">
                FREE
              </span>
            ) : (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-theme-primary/95 text-theme-primary-fg shadow-md backdrop-blur-xs">
                ${template.price}
              </span>
            )}
          </div>

          {/* Category Pill */}
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 pointer-events-none">
            <Badge variant="primary" size="sm" icon={<Layers className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}>
              <span className="text-[10px] sm:text-xs">{categoryName}</span>
            </Badge>
          </div>

          {/* Hover Auto-Scroll Helper Pill */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full opacity-0 group-hover/scroll:opacity-100 transition-opacity pointer-events-none shadow-sm flex items-center gap-1 whitespace-nowrap z-10">
            <span>Scrolls on hover</span>
          </div>

          {/* Gradient Overlay at Bottom to indicate more below */}
          <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </Link>

        {/* Content Section */}
        <div className="p-3 sm:p-5">
          <Link href={`/templates/${template.slug}`} className="group/title block">
            <h3 className="font-bold text-xs sm:text-base text-theme-fg line-clamp-1 group-hover/title:text-theme-primary transition-colors leading-snug">
              {template.title}
            </h3>
          </Link>

          {template.shortSummary ? (
            <p className="hidden sm:block text-xs text-theme-muted mt-2 line-clamp-2 leading-relaxed">
              {template.shortSummary}
            </p>
          ) : template.description ? (
            <p className="hidden sm:block text-xs text-theme-muted mt-2 line-clamp-2 leading-relaxed">
              {template.description}
            </p>
          ) : null}

          {/* Tech Stack Chips */}
          {template.techStack && template.techStack.length > 0 && (
            <div className="hidden sm:flex mt-3.5 flex-wrap gap-1.5">
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
      <div className="px-3 pb-3 sm:px-5 sm:pb-5 pt-2.5 border-t border-theme-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {template.liveDemoUrl ? (
          <button
            onClick={(e) => handleAction("live_demo", template.liveDemoUrl, e)}
            className="w-full sm:flex-1 btn-outline text-xs py-2 px-3 flex items-center justify-center gap-1.5 cursor-pointer font-medium"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Demo</span>
          </button>
        ) : (
          <Link
            href={`/templates/${template.slug}`}
            className="w-full sm:flex-1 btn-outline text-xs py-2 px-3 text-center font-medium"
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
          className="w-full sm:flex-1 btn-primary text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow-xs"
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
