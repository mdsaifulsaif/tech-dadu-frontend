import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Truck,
  Heart,
} from "lucide-react";
import { productApi } from "@/lib/api";
import { IProduct } from "@/types/product";
import { Badge } from "@/components/common/Badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await productApi.getBySlug(slug);
    if (!res.success || !res.data) {
      return { title: "Product Not Found | Tech Dadu" };
    }
    const product: IProduct = res.data;
    return {
      title: `${product.title} — Review & Deals | Tech Dadu`,
      description:
        product.seo?.metaDescription ||
        product.shortSummary ||
        `In-depth review and best affiliate deals for ${product.title}.`,
      openGraph: {
        title: product.title,
        description: product.shortSummary,
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch {
    return { title: "Product Review | Tech Dadu" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  let product: IProduct | null = null;
  try {
    const res = await productApi.getBySlug(slug);
    if (res.success && res.data) {
      product = res.data;
    }
  } catch (err) {
    product = null;
  }

  if (!product) {
    notFound();
  }

  const primaryAffiliate =
    product.affiliateLinks?.find((link) => link.isPrimary) ||
    product.affiliateLinks?.[0];

  const categoryName =
    typeof product.category === "object" && product.category?.name
      ? product.category.name
      : "Desk Setup";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Back button and breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-xs text-theme-muted">
        <Link
          href="/products"
          className="hover:text-theme-primary transition-colors flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Products</span>
        </Link>
        <span>/</span>
        <span className="text-theme-fg font-medium truncate max-w-xs">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-surface overflow-hidden aspect-4/3 rounded-2xl relative bg-theme-bg">
            <img
              src={product.images?.[0] || "/next.svg"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.isFeatured && (
              <div className="absolute top-3 left-3">
                <Badge variant="accent" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                  Saif&apos;s Top Pick
                </Badge>
              </div>
            )}
          </div>

          {/* Additional thumbnails if available */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <div key={i} className="card-surface aspect-square overflow-hidden rounded-lg">
                  <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Details (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-theme-primary">
                {categoryName}
              </span>
              {product.rating > 0 && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating.toFixed(1)} / 5.0 Rating</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-fg tracking-tight leading-snug mb-3">
              {product.title}
            </h1>

            {product.shortSummary && (
              <p className="text-sm text-theme-muted leading-relaxed mb-6">
                {product.shortSummary}
              </p>
            )}

            {/* Price Box */}
            <div className="card-surface p-5 rounded-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-theme-muted block font-medium">Verified Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-theme-fg tracking-tight">
                    {product.price?.formatted || `$${product.price?.amount || 0}`}
                  </span>
                  <span className="text-xs text-theme-muted">USD (Includes discounts)</span>
                </div>
              </div>

              {primaryAffiliate && (
                <a
                  href={`/api/products/${product._id}/click`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary py-3 px-6 text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Buy on {primaryAffiliate.platform.toUpperCase()}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Pros and Cons Box */}
            {(product.pros?.length > 0 || product.cons?.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Pros */}
                {product.pros?.length > 0 && (
                  <div className="p-4 rounded-xl bg-theme-success/10 border border-emerald-500/20">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-theme-success mb-2.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>The Pros</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-theme-fg">
                      {product.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-theme-success mt-0.5">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cons */}
                {product.cons?.length > 0 && (
                  <div className="p-4 rounded-xl bg-theme-danger/10 border border-red-500/20">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-theme-danger mb-2.5 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      <span>Honest Cons</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-theme-fg">
                      {product.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-theme-danger mt-0.5">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* In-depth Review Content */}
            {product.description && (
              <div className="pt-6 border-t border-theme-border">
                <h2 className="text-lg font-bold text-theme-fg mb-3">In-Depth Verdict & Review</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-theme-muted leading-relaxed whitespace-pre-line text-sm">
                  {product.description}
                </div>
              </div>
            )}
          </div>

          {/* Affiliate Trust Notice */}
          <div className="mt-8 pt-4 border-t border-theme-border/60 text-[11px] text-theme-muted">
            <p>
              <strong>Affiliate Disclosure:</strong> Tech Dadu tests and curates products independently.
              When you purchase through our links, we may earn an affiliate commission at no extra cost
              to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

