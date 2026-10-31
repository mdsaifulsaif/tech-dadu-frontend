"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  Share2,
  Check,
  BookOpen,
  Tag,
  Sparkles,
  ExternalLink,
  Laptop,
  AlertCircle,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { blogApi, productApi } from "@/lib/api";
import { IBlog, IProduct } from "@/types";
import { Badge } from "@/components/common/Badge";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";
import { NewsletterBox } from "@/components/features/newsletter/NewsletterBox";
import { BlogCard } from "@/components/features/blogs/BlogCard";

// Custom Brand SVG Icons
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

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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

export default function BlogDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  const [blog, setBlog] = useState<IBlog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [instaCopied, setInstaCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    blogApi
      .getBySlug(slug)
      .then(async (res) => {
        if (res.success && res.data) {
          const article = res.data;
          setBlog(article);

          // Fetch related articles
          if (article._id) {
            try {
              const relRes = await blogApi.getRelated(article._id);
              if (relRes.success && relRes.data && relRes.data.length > 0) {
                setRelatedBlogs(relRes.data);
              } else {
                // Fallback to recent articles if no direct category match
                const recentRes = await blogApi.getAll({ limit: 6 });
                if (recentRes.success && recentRes.data) {
                  const all = recentRes.data.blogs || recentRes.data || [];
                  const filtered = all.filter((b: IBlog) => b._id !== article._id);
                  setRelatedBlogs(filtered);
                }
              }
            } catch {
              // Ignore failure for related blogs
            }
          }
        } else {
          setError(res.message || "Article not found");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load article");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnFacebook = () => {
    if (!blog) return;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    if (!blog) return;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const shareOnTwitter = () => {
    if (!blog) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out "${blog.title}" on Tech Dadu:`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
  };

  const shareOnInstagram = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setInstaCopied(true);
      setTimeout(() => setInstaCopied(false), 2500);
    }
    window.open("https://www.instagram.com/", "_blank");
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-pulse">
        <div className="h-6 w-36 bg-theme-muted/20 rounded mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="h-10 w-3/4 bg-theme-muted/20 rounded mb-4" />
            <div className="h-4 w-1/3 bg-theme-muted/20 rounded mb-8" />
            <div className="aspect-16/9 bg-theme-muted/20 rounded-2xl mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-theme-muted/20 rounded" />
              <div className="h-4 bg-theme-muted/20 rounded" />
              <div className="h-4 w-5/6 bg-theme-muted/20 rounded" />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-64 bg-theme-muted/20 rounded-2xl" />
            <div className="h-48 bg-theme-muted/20 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex-1 max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="card-surface p-8 rounded-2xl border border-theme-border">
          <AlertCircle className="w-10 h-10 text-theme-danger mx-auto mb-3" />
          <h2 className="text-xl font-bold text-theme-fg">Guide Not Found</h2>
          <p className="text-xs sm:text-sm text-theme-muted mt-2">
            The guide or review you are looking for does not exist or may have been removed.
          </p>
          <Link href="/blogs" className="btn-primary inline-flex text-xs mt-5 py-2.5 px-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Guides
          </Link>
        </div>
      </div>
    );
  }

  const categoryName =
    typeof blog.category === "object" && blog.category?.name
      ? blog.category.name
      : "Tech Guide";

  const authorName =
    typeof blog.author === "object" && blog.author?.name
      ? blog.author.name
      : "Saif (Tech Dadu)";

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Top Breadcrumb & Share Nav */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-theme-border/60">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-muted hover:text-theme-fg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </Link>

        {/* Social Share Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Facebook */}
          <button
            onClick={shareOnFacebook}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/25 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Share on Facebook"
          >
            <FacebookIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Facebook</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={shareOnLinkedIn}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/25 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Share on LinkedIn"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LinkedIn</span>
          </button>

          {/* Twitter / X */}
          <button
            onClick={shareOnTwitter}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-theme-bg border border-theme-border text-theme-fg hover:border-theme-primary transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Share on X"
          >
            <XTwitterIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">X</span>
          </button>

          {/* Instagram */}
          <button
            onClick={shareOnInstagram}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-[#E4405F]/10 hover:bg-[#E4405F]/20 text-[#E4405F] border border-[#E4405F]/25 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Share on Instagram"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{instaCopied ? "Copied!" : "Instagram"}</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="btn-outline text-xs p-2 sm:py-1.5 sm:px-3 flex items-center gap-1.5 cursor-pointer"
            title="Copy Link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-theme-success" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid (Main Article + Sticky Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left / Main Editorial Column */}
        <div className="lg:col-span-8 min-w-0">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary" size="sm" icon={<BookOpen className="w-3 h-3" />}>
                {categoryName}
              </Badge>
              {blog.readingTime && (
                <span className="flex items-center gap-1 text-xs text-theme-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {blog.readingTime} min read
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-theme-fg tracking-tight leading-tight">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="mt-4 text-base sm:text-lg text-theme-muted leading-relaxed font-normal">
                {blog.excerpt}
              </p>
            )}

            {/* Author & Meta Row */}
            <div className="mt-6 pt-5 border-t border-theme-border flex items-center justify-between text-xs text-theme-muted">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-theme-primary flex items-center justify-center text-sm font-bold text-theme-primary-fg shadow-sm shrink-0">
                  {authorName[0]}
                </div>
                <div>
                  <div className="font-bold text-theme-fg">{authorName}</div>
                  <div className="text-[11px] text-theme-muted flex items-center gap-2">
                    <span>{formattedDate}</span>
                    {blog.views > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {blog.views} views
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="rounded-2xl overflow-hidden border border-theme-border mb-10 shadow-sm aspect-16/9 bg-theme-bg relative">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 800px"
                className="object-cover"
              />
            </div>
          )}

          {/* Article Rich Content Body */}
          <main className="max-w-none text-theme-fg leading-relaxed">
            {blog.content ? (
              <MarkdownRenderer content={blog.content} className="text-base" />
            ) : (
              <p className="text-theme-muted italic">No content available.</p>
            )}
          </main>

          {/* Featured / Linked Products Inside Article */}
          {blog.linkedProducts && blog.linkedProducts.length > 0 && (
            <section className="mt-12 pt-8 border-t border-theme-border">
              <div className="flex items-center gap-2 mb-6">
                <Laptop className="w-5 h-5 text-theme-primary" />
                <h3 className="text-lg font-bold text-theme-fg">
                  Featured Gear In This Guide
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blog.linkedProducts.map((p: any, i) => {
                  if (typeof p !== "object" || !p.title) return null;
                  const link = p.affiliateLinks?.[0]?.url || `/products/${p.slug}`;
                  return (
                    <div
                      key={i}
                      className="card-surface p-4 rounded-xl border border-theme-border flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {p.images?.[0] && (
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-theme-bg shrink-0 relative">
                            <Image
                              src={p.images[0]}
                              alt={p.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-theme-fg truncate">
                            {p.title}
                          </h4>
                          {p.price?.formatted && (
                            <span className="text-xs font-semibold text-theme-primary block mt-0.5">
                              {p.price.formatted}
                            </span>
                          )}
                        </div>
                      </div>

                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap flex items-center gap-1 font-semibold shrink-0"
                      >
                        <span>Check Price</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Tags Chips */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-theme-border flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-theme-muted uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" /> Tags:
              </span>
              {blog.tags.map((tag, i) => (
                <Link
                  key={i}
                  href={`/blogs?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-theme-bg border border-theme-border text-theme-muted hover:text-theme-fg hover:border-theme-primary transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Author Bio Card */}
          <div className="mt-12 p-6 rounded-2xl card-surface border border-theme-border flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-theme-primary flex items-center justify-center text-lg font-bold text-theme-primary-fg shrink-0 shadow-sm">
              {authorName[0]}
            </div>
            <div>
              <h4 className="font-bold text-sm text-theme-fg">Written by {authorName}</h4>
              <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                Full-stack software developer and tech gear curator at Tech Dadu. Passionate about
                ergonomic mechanical keyboards, clean minimal developer workstations, and scalable
                Next.js web applications.
              </p>
            </div>
          </div>

          {/* Lead Capture Newsletter Box */}
          <div className="mt-12">
            <NewsletterBox
              source={`blog_${blog.slug}`}
              title="Liked This Guide? Get More In Your Inbox"
              subtitle="Join developers and tech enthusiasts receiving our weekly handpicked gear setups, deep-dives, and free starter kits."
            />
          </div>
        </div>

        {/* Right Sticky Sidebar (Professional Editorial Desktop Companion) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Related Guides Card Widget */}
          {relatedBlogs.length > 0 && (
            <div className="card-surface p-5 rounded-2xl border border-theme-border shadow-sm">
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-theme-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-theme-primary" />
                  <h3 className="font-bold text-sm text-theme-fg">Related Guides</h3>
                </div>
                <Link
                  href="/blogs"
                  className="text-[11px] font-semibold text-theme-primary hover:underline flex items-center gap-0.5"
                >
                  View All
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3.5">
                {relatedBlogs.slice(0, 4).map((item) => {
                  const itemCat =
                    typeof item.category === "object" && item.category?.name
                      ? item.category.name
                      : "Guide";
                  const itemCover =
                    item.coverImage ||
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=60";

                  return (
                    <Link
                      key={item._id}
                      href={`/blogs/${item.slug}`}
                      className="group flex items-start gap-3 p-2 rounded-xl hover:bg-theme-bg transition-colors"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-theme-bg border border-theme-border shrink-0 relative">
                        <Image
                          src={itemCover}
                          alt={item.title}
                          fill
                          sizes="64px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-theme-primary block mb-0.5 truncate">
                          {itemCat}
                        </span>
                        <h4 className="font-bold text-xs text-theme-fg line-clamp-2 leading-snug group-hover:text-theme-primary transition-colors">
                          {item.title}
                        </h4>
                        {item.readingTime && (
                          <span className="text-[10px] text-theme-muted flex items-center gap-1 mt-1">
                            <Clock className="w-2.5 h-2.5" />
                            {item.readingTime}m read
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Share Widget */}
          <div className="card-surface p-5 rounded-2xl border border-theme-border shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <Share2 className="w-4 h-4 text-theme-primary" />
              <h4 className="font-bold text-sm text-theme-fg">Share This Guide</h4>
            </div>
            <p className="text-[11px] text-theme-muted mb-4">
              Help other modern builders find this resource
            </p>

            {/* 4 Social Channels Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Facebook */}
              <button
                onClick={shareOnFacebook}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/25 transition-all cursor-pointer group"
                title="Share on Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" />
                <span>Facebook</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={shareOnLinkedIn}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/25 transition-all cursor-pointer group"
                title="Share on LinkedIn"
              >
                <LinkedinIcon className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" />
                <span>LinkedIn</span>
              </button>

              {/* Twitter / X */}
              <button
                onClick={shareOnTwitter}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-theme-bg hover:bg-theme-surface border border-theme-border text-theme-fg hover:border-theme-primary transition-all cursor-pointer group"
                title="Share on X"
              >
                <XTwitterIcon className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" />
                <span>X (Twitter)</span>
              </button>

              {/* Instagram */}
              <button
                onClick={shareOnInstagram}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#E4405F]/10 hover:bg-[#E4405F]/20 text-[#E4405F] border border-[#E4405F]/25 transition-all cursor-pointer group"
                title="Share on Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate">{instaCopied ? "Link Copied!" : "Instagram"}</span>
              </button>
            </div>

            {/* Direct Copy URL */}
            <button
              onClick={handleCopyLink}
              className="w-full mt-3 btn-primary text-xs py-2.5 px-3 flex items-center justify-center gap-2 font-semibold cursor-pointer shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Article URL</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom More Guides Full Width Showcase */}
      {relatedBlogs.length > 0 && (
        <section className="mt-20 pt-12 border-t border-theme-border">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-theme-primary font-bold text-xs uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" /> Recommended Next Reads
              </div>
              <h3 className="text-2xl font-extrabold text-theme-fg">More Articles & Setup Guides</h3>
            </div>
            <Link
              href="/blogs"
              className="text-xs font-semibold text-theme-primary hover:underline flex items-center gap-1"
            >
              Browse All
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.slice(0, 3).map((item) => (
              <BlogCard key={item._id} blog={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
