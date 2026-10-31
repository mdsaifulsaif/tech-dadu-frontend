import { auth } from "@/auth";
import { productApi, templateApi, blogApi } from "@/lib/api";
import { IProduct, IDigitalProduct, IBlog } from "@/types";
import {
  HeroSection,
  ValueGridSection,
  FeaturedProductsSection,
  FeaturedUIDesignsSection,
  FeaturedTemplatesSection,
  LatestBlogsSection,
} from "@/components/home";

export default async function Home() {
  const session = await auth();

  // Fetch live showcase items with graceful fallbacks
  let products: IProduct[] = [];
  let templates: IDigitalProduct[] = [];
  let uiDesigns: IDigitalProduct[] = [];
  let blogs: IBlog[] = [];

  try {
    const [pRes, tRes, uRes, bRes] = await Promise.allSettled([
      productApi.getAll({ limit: 4 }),
      templateApi.getAll({ limit: 6 }),
      templateApi.getAll({ category: "ui-ux-design", limit: 3 }),
      blogApi.getAll({ limit: 3 }),
    ]);

    if (pRes.status === "fulfilled" && pRes.value.success && pRes.value.data) {
      products = pRes.value.data.products || pRes.value.data || [];
    }
    if (tRes.status === "fulfilled" && tRes.value.success && tRes.value.data) {
      const allTemplates = tRes.value.data.templates || tRes.value.data || [];
      // Separate code templates from UI/UX design kits
      templates = allTemplates
        .filter((t: IDigitalProduct) => {
          const catSlug = typeof t.category === "object" ? t.category?.slug : "";
          return catSlug !== "ui-ux-design";
        })
        .slice(0, 3);
    }
    if (uRes.status === "fulfilled" && uRes.value.success && uRes.value.data) {
      uiDesigns = uRes.value.data.templates || uRes.value.data || [];
    }
    if (bRes.status === "fulfilled" && bRes.value.success && bRes.value.data) {
      blogs = bRes.value.data.blogs || bRes.value.data || [];
    }
  } catch { }

  return (
    <div className="flex flex-col flex-1">
      <HeroSection session={session} />
      <ValueGridSection />
      <FeaturedProductsSection products={products} />
      <FeaturedUIDesignsSection uiDesigns={uiDesigns} />
      <FeaturedTemplatesSection templates={templates} />
      <LatestBlogsSection blogs={blogs} />
    </div>
  );
}
