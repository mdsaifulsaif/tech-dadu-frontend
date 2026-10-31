export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  type: "product" | "blog" | "template" | "all";
  order: number;
  showInHero?: boolean;
  isDefaultHero?: boolean;
}

export interface IAffiliateLink {
  platform: "amazon" | "aliexpress" | "official" | "other";
  url: string;
  isPrimary: boolean;
}

export interface IProductPrice {
  amount: number;
  currency: string;
  formatted: string;
}

export interface IProductComparison {
  isFeatured?: boolean;
  badge?: string;
  bestFor?: string;
  keyHighlight?: string;
}

export interface IProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  category: ICategory | string;
  images: string[];
  shortSummary: string;
  description: string;
  price: IProductPrice;
  affiliateLinks: IAffiliateLink[];
  rating: number;
  pros: string[];
  cons: string[];
  badges: string[];
  isFeatured: boolean;
  comparison?: IProductComparison;
  status: "draft" | "published";
  clickCount: number;
  seo?: IProductSEO;
  createdAt: string;
  updatedAt: string;
}

export interface IProductQueryParams {
  category?: string;
  search?: string;
  isFeatured?: boolean;
  badge?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "popular" | "rating";
  page?: number;
  limit?: number;
}

export interface IPaginatedProducts {
  products: IProduct[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
    hasMore: boolean;
  };
}

