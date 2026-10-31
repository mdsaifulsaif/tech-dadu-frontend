export * from "./product";

export interface IDigitalProductComparison {
  isFeatured?: boolean;
  badge?: string;
  bestFor?: string;
  keyHighlight?: string;
}

export interface IDigitalProduct {
  _id: string;
  title: string;
  slug: string;
  category: { _id: string; name: string; slug: string } | string;
  shortSummary?: string;
  description: string;
  features: string[];
  techStack: string[];
  price: number;
  isFree: boolean;
  liveDemoUrl: string;
  purchaseUrl: string;
  previewImages: string[];
  downloadCount: number;
  comparison?: IDigitalProductComparison;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: { _id: string; name: string; avatar?: string } | string;
  category: { _id: string; name: string; slug: string } | string;
  tags: string[];
  linkedProducts?: any[];
  readingTime?: number;
  views: number;
  status: "draft" | "published";
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISubscriber {
  _id: string;
  email: string;
  source: string;
  status: "subscribed" | "unsubscribed";
  createdAt: string;
}

export interface ISiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl?: string;
  faviconUrl?: string;
  defaultOgImage?: string;
  socialLinks?: {
    pinterest?: string;
    github?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
    linkedin?: string;
  };
  analytics?: {
    gtmId?: string;
    gaId?: string;
    metaPixelId?: string;
    pinterestTagId?: string;
    pinterestVerification?: string;
    googleVerification?: string;
  };
  announcement?: {
    enabled?: boolean;
    text?: string;
    link?: string;
  };
}

