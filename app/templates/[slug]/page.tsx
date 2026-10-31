"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { templateApi } from "@/lib/api";
import { IDigitalProduct } from "@/types";
import { Badge } from "@/components/common/Badge";
import { NewsletterBox } from "@/components/features/newsletter/NewsletterBox";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";

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

  const handleAction = async (type: "live_demo" | "download", url: string) => {
    if (!template) return;
    try {
      await templateApi.trackAction(template._id, type);
    } catch {}
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-pulse">
        <div className="h-6 w-32 bg-theme-muted/20 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 aspect-16/10 bg-theme-muted/20 rounded-2xl" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-8 w-3/4 bg-theme-muted/20 rounded" />
            <div className="h-4 w-1/2 bg-theme-muted/20 rounded" />
            <div className="h-24 bg-theme-muted/20 rounded" />
            <div className="h-12 bg-theme-muted/20 rounded" />
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

  const categoryName =
    typeof template.category === "object" && template.category?.name
      ? template.category.name
      : "Web Template";

  const images =
    template.previewImages && template.previewImages.length > 0
      ? template.previewImages
      : ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"];

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/templates"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-muted hover:text-theme-fg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Templates</span>
        </Link>

        <button
          onClick={handleShare}
          className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-theme-success" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Template</span>
            </>
          )}
        </button>
      </div>

      {/* Main Two-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Previews */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Large Image */}
          <div className="card-surface rounded-2xl overflow-hidden border border-theme-border relative aspect-16/10 bg-theme-bg shadow-sm">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={template.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails Gallery Strip */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-theme-muted uppercase tracking-wider px-1">
              <span>Preview Screenshots ({images.length})</span>
              <span>{activeImageIndex === 0 ? "Main Preview" : `Preview #${activeImageIndex + 1}`}</span>
            </div>
            <div className="flex items-center gap-2.5 overflow-x-auto p-1.5 scrollbar-none">
              {images.map((img, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? "border-theme-primary shadow-md ring-2 ring-theme-primary/40 ring-offset-1 ring-offset-theme-bg"
                        : "border-theme-border opacity-70 hover:opacity-100 hover:border-theme-primary/50"
                    }`}
                    title={`View screenshot ${idx + 1}`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                        Main
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Details, CTAs, Features */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Category and Status Badge */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary" size="sm" icon={<Layers className="w-3 h-3" />}>
                {categoryName}
              </Badge>
              {template.downloadCount > 0 && (
                <span className="text-[11px] font-medium text-theme-muted">
                  {template.downloadCount}+ downloads
                </span>
              )}
            </div>

            {/* Template Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-fg tracking-tight leading-tight">
              {template.title}
            </h1>

            {/* Price Tag Banner */}
            <div className="mt-4 p-4 rounded-xl card-surface border border-theme-border flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-theme-muted">License / Price</span>
                <div className="text-2xl font-black text-theme-fg mt-0.5">
                  {template.isFree || template.price === 0 ? (
                    <span className="text-theme-success">100% Free</span>
                  ) : (
                    <span>${template.price} USD</span>
                  )}
                </div>
              </div>

              {template.isFree ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-theme-success/15 text-theme-success border border-theme-success/30">
                  Open Source
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-theme-primary/15 text-theme-primary border border-theme-primary/30">
                  Commercial Ready
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-5 card-surface p-4 sm:p-5 rounded-2xl border border-theme-border">
              <MarkdownRenderer content={template.description} />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {template.liveDemoUrl && (
                <button
                  onClick={() => handleAction("live_demo", template.liveDemoUrl)}
                  className="btn-outline flex-1 py-3 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Live Demo</span>
                </button>
              )}

              <button
                onClick={() =>
                  handleAction(
                    "download",
                    template.purchaseUrl || template.liveDemoUrl
                  )
                }
                className="btn-primary flex-1 py-3 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                {template.isFree ? (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Boilerplate Free</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Get Template (${template.price})</span>
                  </>
                )}
              </button>
            </div>

            {/* Features Checklist */}
            {template.features && template.features.length > 0 && (
              <div className="mt-8 pt-6 border-t border-theme-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted mb-3">
                  What's Included:
                </h3>
                <div className="space-y-2">
                  {template.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-theme-fg">
                      <CheckCircle2 className="w-4 h-4 text-theme-success shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack Chips */}
            {template.techStack && template.techStack.length > 0 && (
              <div className="mt-6 pt-6 border-t border-theme-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted mb-3 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" /> Built With:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {template.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-theme-bg border border-theme-border text-theme-fg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Lead Capture Newsletter */}
      <div className="mt-16">
        <NewsletterBox
          source={`template_${template.slug}`}
          title="Want More Production Starter Kits?"
          subtitle="Subscribe to get notified whenever we release new open-source templates and boilerplates."
        />
      </div>
    </div>
  );
}

