import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import { IDigitalProduct } from "@/types";
import { TemplateCard } from "@/components/features/templates/TemplateCard";

interface FeaturedTemplatesSectionProps {
  templates: IDigitalProduct[];
}

export function FeaturedTemplatesSection({ templates }: FeaturedTemplatesSectionProps) {
  if (!templates || templates.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-theme-border/60">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-theme-primary uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Ship Fast</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-theme-fg">Next.js & Fullstack Boilerplates</h2>
        </div>
        <Link href="/templates" className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5">
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {templates.slice(0, 3).map((tmpl) => (
          <TemplateCard key={tmpl._id} template={tmpl} />
        ))}
      </div>
    </section>
  );
}

