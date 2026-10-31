"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Download,
  ExternalLink,
  CheckCircle2,
  Code2,
  Layers,
  Sparkles,
  Share2,
  Check,
  AlertCircle,
  Maximize2,
  Minimize2,
  Lock,
  ShieldCheck,
  Palette,
  X,
  FileCode,
} from "lucide-react";
import { templateApi } from "@/lib/api";
import { IDigitalProduct } from "@/types";
import { Badge } from "@/components/common/Badge";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";

// Brand SVG Icons
const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0-.02-3.28 1.64 1.64 0 0 0 .02 3.28M5.07 18.5h2.79v-8.37H5.07v8.37Z" />
  </svg>
);

const XTwitterIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function TemplateDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const [template, setTemplate] = useState<IDigitalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Full-Page View Mode: 'scroll_frame' (scrollable window) vs 'full_length' (unrolled full height)
  const [viewMode, setViewMode] = useState<"scroll_frame" | "full_length">("full_length");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    templateApi
      .getBySlug(slug)
      .then((res) => {
        if (res.success && res.data) {
          setTemplate(res.data);
        } else {
          setError(res.message || "Template not found");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load template");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // Close lightbox on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    if (isLightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  const handleAction = async (type: "live_demo" | "download", url: string) => {
    if (!template) return;
    try {
      await templateApi.trackAction(template._id, type);
    } catch {}
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnFacebook = () => {
    if (!template) return;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    if (!template) return;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const shareOnTwitter = () => {
    if (!template) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out "${template.title}" on Tech Dadu:`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-pulse">
        <div className="h-6 w-36 bg-theme-muted/20 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-[700px] bg-theme-muted/20 rounded-2xl" />
          <div className="lg:col-span-4 space-y-4">
            <div className="h-8 w-3/4 bg-theme-muted/20 rounded" />
            <div className="h-4 w-1/2 bg-theme-muted/20 rounded" />
            <div className="h-28 bg-theme-muted/20 rounded-2xl" />
            <div className="h-12 bg-theme-muted/20 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="card-surface p-8 rounded-2xl border border-theme-border">
          <AlertCircle className="w-10 h-10 text-theme-danger mx-auto mb-3" />
          <h2 className="text-xl font-bold text-theme-fg">Template Not Found</h2>
          <p className="text-xs sm:text-sm text-theme-muted mt-2">
            The template you're looking for does not exist or may have been unpublished.
          </p>
          <Link href="/templates" className="btn-primary inline-flex text-xs mt-5 py-2.5 px-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  const isUiUx =
    (typeof template.category === "object" &&
      (template.category?.slug === "ui-ux-design" ||
        template.category?.name.toLowerCase().includes("ui"))) ||
    template.techStack?.some((t) => /figma|design/i.test(t));

  const categoryName =
    typeof template.category === "object" && template.category?.name
      ? template.category.name
      : isUiUx
      ? "UI/UX Design"
      : "Web Template";

  const images =
    template.previewImages && template.previewImages.length > 0
      ? template.previewImages
      : ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"];

  const currentActiveImage = images[activeImageIndex] || images[0];

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Navigation Breadcrumb Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-theme-border/60">
        <Link
          href="/templates"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-muted hover:text-theme-fg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Templates & Kits</span>
        </Link>

        {/* Quick Social Share Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={shareOnFacebook}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Share on Facebook"
          >
            <FacebookIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Facebook</span>
          </button>

          <button
            onClick={shareOnLinkedIn}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Share on LinkedIn"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LinkedIn</span>
          </button>

          <button
            onClick={shareOnTwitter}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-theme-bg border border-theme-border text-theme-fg hover:border-theme-primary transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Share on X"
          >
            <XTwitterIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="btn-outline text-xs p-1.5 sm:py-1.5 sm:px-3 flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-theme-success" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Two-Column Showcase (Full Landing Page Left + Sticky Action Sidebar Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (8 cols): Full Landing Page Canvas & Browser Shell */}
        <div className="lg:col-span-8 space-y-8 min-w-0">
          {/* Pinterest / Behance Browser Mockup Shell */}
          <div className="card-surface rounded-2xl overflow-hidden border border-theme-border shadow-lg">
            {/* Desktop Browser Window Header Chrome */}
            <div className="bg-theme-bg px-4 py-3 border-b border-theme-border flex items-center justify-between gap-3 select-none">
              {/* 3 macOS Window Dots */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
              </div>

              {/* Simulated Browser URL Bar */}
              <div className="flex-1 max-w-sm sm:max-w-md mx-auto hidden sm:flex items-center justify-center gap-1.5 bg-theme-surface px-3 py-1 rounded-lg border border-theme-border text-[11px] font-mono text-theme-muted truncate">
                <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">
                  {template.liveDemoUrl || `https://techdadu.dev/preview/${template.slug}`}
                </span>
              </div>

              {/* View Control Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Full Height vs Scroll Frame Toggle */}
                <button
                  type="button"
                  onClick={() =>
                    setViewMode(viewMode === "full_length" ? "scroll_frame" : "full_length")
                  }
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-theme-surface border border-theme-border text-theme-fg hover:border-theme-primary transition-colors flex items-center gap-1 cursor-pointer"
                  title={
                    viewMode === "full_length"
                      ? "Switch to scrollable window frame"
                      : "Expand to full unconstrained height"
                  }
                >
                  {viewMode === "full_length" ? (
                    <>
                      <Minimize2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Compact Window</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Full Landing Page</span>
                    </>
                  )}
                </button>

                {/* Lightbox Zoom Button */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="p-1 sm:px-2 sm:py-1 rounded-md text-[11px] font-semibold bg-theme-primary text-theme-primary-fg hover:bg-theme-primary-hover transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                  title="Open High-Resolution Lightbox Zoom"
                >
                  <Eye className="w-3 h-3" />
                  <span className="hidden sm:inline">Inspect Zoom</span>
                </button>
              </div>
            </div>

            {/* The Full Landing Page Image Canvas */}
            <div
              className={`relative bg-theme-bg/60 cursor-zoom-in transition-all ${
                viewMode === "scroll_frame"
                  ? "max-h-[750px] overflow-y-auto scrollbar-thin scrollbar-thumb-theme-border"
                  : "h-auto overflow-visible"
              }`}
              onClick={() => setIsLightboxOpen(true)}
              title="Click to view full-resolution zoom"
            >
              <Image
                src={currentActiveImage}
                alt={template.title}
                width={1200}
                height={2400}
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="w-full h-auto block select-none"
              />

              {/* Bottom Click-To-Zoom Prompt Pill */}
              <div className="sticky bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 pointer-events-none w-max mx-auto z-10 border border-white/10">
                <Maximize2 className="w-3.5 h-3.5 text-theme-primary" />
                <span>Click image to view in Fullscreen Lightbox</span>
              </div>
            </div>
          </div>

          {/* Multiple Screenshots Gallery Strip (if template has multiple screens) */}
          {images.length > 1 && (
            <div className="space-y-2 card-surface p-4 rounded-2xl border border-theme-border">
              <div className="flex items-center justify-between text-xs font-bold text-theme-fg px-1">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-theme-primary" />
                  Included Design Screens & Pages ({images.length})
                </span>
                <span className="text-[11px] text-theme-muted font-normal">
                  Screen #{activeImageIndex + 1} of {images.length}
                </span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto p-1 scrollbar-none">
                {images.map((img, idx) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-28 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-theme-bg ${
                        isActive
                          ? "border-theme-primary shadow-md ring-2 ring-theme-primary/30"
                          : "border-theme-border opacity-70 hover:opacity-100 hover:border-theme-primary/40"
                      }`}
                      title={`View screen ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`Screen ${idx + 1}`}
                        fill
                        sizes="128px"
                        className="object-cover object-top"
                      />
                      <span className="absolute bottom-1 left-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {idx === 0 ? "Hero Page" : `Screen ${idx + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* In-Depth Description & Documentation Body */}
          <div className="card-surface p-6 sm:p-8 rounded-2xl border border-theme-border space-y-4">
            <h3 className="text-xl font-bold text-theme-fg flex items-center gap-2 border-b border-theme-border pb-3">
              <FileCode className="w-5 h-5 text-theme-primary" />
              Design Architecture & Features
            </h3>
            <div className="rich-content text-sm sm:text-base leading-relaxed text-theme-fg/90">
              <MarkdownRenderer content={template.description} />
            </div>
          </div>

          {/* Features Grid Checklist */}
          {template.features && template.features.length > 0 && (
            <div className="card-surface p-6 sm:p-8 rounded-2xl border border-theme-border">
              <h3 className="text-lg font-bold text-theme-fg mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-theme-success" />
                What's Included In This Kit
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {template.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-theme-bg border border-theme-border/60 text-xs sm:text-sm text-theme-fg font-medium"
                  >
                    <Check className="w-4 h-4 text-theme-success shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Sticky Action, Purchase & Licensing Panel */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Main Action Card */}
          <div className="card-surface p-6 rounded-2xl border border-theme-border shadow-md space-y-5">
            {/* Category Pill & Downloads */}
            <div className="flex items-center justify-between">
              <Badge variant="primary" size="sm" icon={isUiUx ? <Palette className="w-3 h-3" /> : <Layers className="w-3 h-3" />}>
                {categoryName}
              </Badge>
              {template.downloadCount > 0 && (
                <span className="text-[11px] font-semibold text-theme-muted">
                  {template.downloadCount}+ downloads
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-theme-fg tracking-tight leading-snug">
                {template.title}
              </h1>
              {template.shortSummary && (
                <p className="text-xs text-theme-muted mt-2 leading-relaxed">
                  {template.shortSummary}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                  License & Pricing
                </span>
                <div className="text-2xl font-extrabold text-theme-fg mt-0.5">
                  {template.isFree || template.price === 0 ? (
                    <span className="text-theme-success">100% Free</span>
                  ) : (
                    <span>${template.price} USD</span>
                  )}
                </div>
              </div>

              {template.isFree ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-theme-success/15 text-theme-success border border-theme-success/30">
                  Open Source
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-theme-primary/15 text-theme-primary border border-theme-primary/30">
                  Commercial License
                </span>
              )}
            </div>

            {/* Big Action CTA Buttons */}
            <div className="space-y-2.5 pt-1">
              {/* Primary Download / Purchase CTA */}
              <button
                onClick={() =>
                  handleAction(
                    "download",
                    template.purchaseUrl || template.liveDemoUrl || ""
                  )
                }
                className="w-full btn-primary text-sm py-3 px-4 flex items-center justify-center gap-2 font-bold shadow-md cursor-pointer"
              >
                {template.isFree ? (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Free Kit</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Get Instant Access (${template.price})</span>
                  </>
                )}
              </button>

              {/* Secondary Live Preview CTA */}
              {template.liveDemoUrl && (
                <button
                  onClick={() => handleAction("live_demo", template.liveDemoUrl || "")}
                  className="w-full btn-outline text-xs sm:text-sm py-2.5 px-4 font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isUiUx ? "View Figma Prototype" : "View Live Demo"}</span>
                </button>
              )}
            </div>

            {/* Tech Stack & Design Tools Chips */}
            {template.techStack && template.techStack.length > 0 && (
              <div className="pt-4 border-t border-theme-border/60">
                <span className="text-xs font-bold text-theme-fg block mb-2">
                  {isUiUx ? "Design Tools & Tokens:" : "Built With:"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {template.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-theme-bg border border-theme-border text-theme-fg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Badges Guarantee */}
            <div className="pt-3 border-t border-theme-border/60 space-y-2 text-xs text-theme-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-theme-success shrink-0" />
                <span>Instant access & lifetime updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-theme-primary shrink-0" />
                <span>100% verified source files & clean components</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Interactive Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          {/* Lightbox Header Bar */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 text-white select-none shrink-0">
            <div>
              <h4 className="font-bold text-sm truncate max-w-md">{template.title}</h4>
              <span className="text-[11px] text-zinc-400">
                Full Landing Page Inspection (Screen #{activeImageIndex + 1})
              </span>
            </div>

            <div className="flex items-center gap-3">
              {template.liveDemoUrl && (
                <button
                  onClick={() => handleAction("live_demo", template.liveDemoUrl || "")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </button>
              )}

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Scrollable Image Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
            <div className="max-w-5xl w-full bg-theme-bg rounded-xl overflow-hidden shadow-2xl border border-white/10 self-start">
              <Image
                src={currentActiveImage}
                alt={template.title}
                width={1400}
                height={3000}
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
