import Link from "next/link";
import { Palette, ArrowRight } from "lucide-react";
import { IDigitalProduct } from "@/types";
import { TemplateCard } from "@/components/features/templates/TemplateCard";

interface FeaturedUIDesignsSectionProps {
  uiDesigns: IDigitalProduct[];
}

export function FeaturedUIDesignsSection({ uiDesigns }: FeaturedUIDesignsSectionProps) {
  if (!uiDesigns || uiDesigns.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-theme-border/60">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-theme-primary uppercase tracking-wider mb-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Figma & Design Systems</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-theme-fg">Curated UI/UX Design Kits</h2>
        </div>
        <Link href="/templates?category=ui-ux-design" className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5">
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {uiDesigns.slice(0, 3).map((kit) => (
          <TemplateCard key={kit._id} template={kit} />
        ))}
      </div>
    </section>
  );
}

