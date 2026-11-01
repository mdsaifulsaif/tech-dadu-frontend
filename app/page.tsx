import { auth } from "@/auth";
import { productApi, templateApi, blogApi, categoryApi } from "@/lib/api";
import { IProduct, IDigitalProduct, IBlog, ICategory } from "@/types";
import {
  HeroSection,
  ValueGridSection,
  FeaturedProductsSection,
  FeaturedUIDesignsSection,
  FeaturedTemplatesSection,
  LatestBlogsSection,
} from "@/components/home";

// Smart ISR: Cache page for 60 seconds so thousands of visitors get instant cached HTML
// without hitting the database repeatedly. Revalidates automatically in the background.
export const revalidate = 60;

export default async function Home() {
  const session = await auth();

  // Fetch live showcase items with graceful fallbacks
  let categories: ICategory[] = [];
  let allProducts: IProduct[] = [];
  let allTemplates: IDigitalProduct[] = [];
  let blogs: IBlog[] = [];

  try {
    const [catRes, pRes, tRes, bRes] = await Promise.allSettled([
      categoryApi.getAll(),
      productApi.getAll({ limit: 50 }),
      templateApi.getAll({ limit: 50 }),
      blogApi.getAll({ limit: 6 }),
    ]);

    if (catRes.status === "fulfilled" && catRes.value?.success && catRes.value?.data) {
      categories = catRes.value.data || [];
    }
    if (pRes.status === "fulfilled" && pRes.value?.success && pRes.value?.data) {
      allProducts = pRes.value.data.products || pRes.value.data || [];
    }
    if (tRes.status === "fulfilled" && tRes.value?.success && tRes.value?.data) {
      allTemplates = tRes.value.data.templates || tRes.value.data || [];
    }
    if (bRes.status === "fulfilled" && bRes.value?.success && bRes.value?.data) {
      blogs = bRes.value.data.blogs || bRes.value.data || [];
    }
  } catch { }

  // Filter items for downstream featured sections
  const showcaseProducts = allProducts.slice(0, 4);
  const showcaseTemplates = allTemplates
    .filter((t: IDigitalProduct) => {
      const catSlug = typeof t.category === "object" ? t.category?.slug : "";
      return catSlug !== "ui-ux-design";
    })
    .slice(0, 3);
  const showcaseUIDesigns = allTemplates
    .filter((t: IDigitalProduct) => {
      const catSlug = typeof t.category === "object" ? t.category?.slug : "";
      return catSlug === "ui-ux-design";
    })
    .slice(0, 3);

  return (
    <div className="flex flex-col flex-1">
      <HeroSection
        session={session}
        categories={categories}
        products={allProducts}
        templates={allTemplates}
      />
      <ValueGridSection />
      <FeaturedProductsSection products={showcaseProducts} />
      <FeaturedUIDesignsSection uiDesigns={showcaseUIDesigns} />
      <FeaturedTemplatesSection templates={showcaseTemplates} />
      <LatestBlogsSection blogs={blogs} />
    </div>
  );
}
