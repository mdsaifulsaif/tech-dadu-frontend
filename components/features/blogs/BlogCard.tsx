"use client";

import React from "react";
import Link from "next/link";
import { Clock, BookOpen, ArrowRight, Tag, Eye } from "lucide-react";
import { IBlog } from "@/types";
import { Badge } from "@/components/common/Badge";

interface BlogCardProps {
  blog: IBlog;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const categoryName =
    typeof blog.category === "object" && blog.category?.name
      ? blog.category.name
      : "Guide";

  const cover =
    blog.coverImage ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60";

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <article className="card-surface card-surface-hover flex flex-col justify-between overflow-hidden group h-full">
      <div className="flex-1 flex flex-col">
        {/* Cover Image */}
        <Link href={`/blogs/${blog.slug}`} className="block relative aspect-16/9 overflow-hidden bg-theme-bg">
          <img
            src={cover}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Category Pill */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge variant="primary" size="sm" icon={<BookOpen className="w-3 h-3" />}>
              {categoryName}
            </Badge>
          </div>

          {/* Reading Time Pill */}
          {blog.readingTime && (
            <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-semibold text-white">
              <Clock className="w-3 h-3 text-theme-muted" />
              <span>{blog.readingTime}m read</span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-[11px] text-theme-muted mb-2 font-medium">
              <span>{formattedDate}</span>
              {blog.views > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {blog.views} views
                  </span>
                </>
              )}
            </div>

            <Link href={`/blogs/${blog.slug}`}>
              <h3 className="font-bold text-base text-theme-fg line-clamp-2 hover:text-theme-primary transition-colors leading-snug">
                {blog.title}
              </h3>
            </Link>

            {blog.excerpt && (
              <p className="text-xs text-theme-muted mt-2 line-clamp-2 leading-relaxed">
                {blog.excerpt}
              </p>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
              {blog.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-theme-bg border border-theme-border text-theme-muted"
                >
                  <Tag className="w-2.5 h-2.5 opacity-60" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 pt-2 border-t border-theme-border/60">
        <Link
          href={`/blogs/${blog.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-primary hover:text-theme-primary-hover group/link"
        >
          <span>Read Full Guide</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};

