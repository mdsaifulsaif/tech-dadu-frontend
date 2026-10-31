import Link from "next/link";
import { Laptop, ArrowRight } from "lucide-react";
import { IProduct } from "@/types";
import { ProductCard } from "@/components/features/products/ProductCard";

interface FeaturedProductsSectionProps {
  products: IProduct[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-theme-border/60">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-theme-primary uppercase tracking-wider mb-1">
            <Laptop className="w-3.5 h-3.5" />
            <span>Featured Hardware</span>
          </div>
          <h2 className="text-2xl font-bold text-theme-fg">Curated Desk Setup Gear</h2>
        </div>
        <Link href="/products" className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5">
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}

