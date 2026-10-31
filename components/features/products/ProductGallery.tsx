"use client";

import React, { useState } from "react";
import { Sparkles, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/common/Badge";

interface ProductGalleryProps {
  images?: string[];
  title: string;
  isFeatured?: boolean;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images = [],
  title,
  isFeatured = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const imageList =
    images && images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80"];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3.5">
      {/* Main Image Container */}
      <div className="card-surface overflow-hidden aspect-4/3 rounded-2xl relative bg-theme-bg border border-theme-border shadow-sm group">
        <img
          src={imageList[activeIndex] || imageList[0]}
          alt={`${title} - Preview ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="accent" size="sm" icon={<Sparkles className="w-3 h-3" />}>
              Saif&apos;s Top Pick
            </Badge>
          </div>
        )}

        {/* Counter Badge */}
        {imageList.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow">
            {activeIndex + 1} / {imageList.length}
          </div>
        )}

        {/* Left / Right Arrow Controls */}
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Gallery Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-theme-muted font-semibold uppercase tracking-wider px-1">
          <span className="flex items-center gap-1">
            <ImageIcon className="w-3 h-3 text-theme-primary" /> Image Gallery
          </span>
          <span>{imageList.length} {imageList.length === 1 ? "Image" : "Images"}</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto p-1.5 scrollbar-none">
          {imageList.map((img, i) => {
            const isActive = activeIndex === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all bg-theme-bg cursor-pointer ${
                  isActive
                    ? "border-theme-primary ring-2 ring-theme-primary/40 ring-offset-1 ring-offset-theme-bg shadow-md"
                    : "border-theme-border opacity-65 hover:opacity-100 hover:border-theme-primary/60"
                }`}
                title={`View image ${i + 1}`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                    Main
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
