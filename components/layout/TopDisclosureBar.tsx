"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function TopDisclosureBar() {
  return (
    <aside
      aria-label="Affiliate disclosure"
      className="w-full bg-[#0b0818] border-b border-white/5 py-1 px-3 sm:py-1.5 sm:px-4 text-center text-[11px] sm:text-[13px] text-[#c9c2e6] transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center flex-nowrap sm:flex-wrap gap-x-1.5 sm:gap-x-2 gap-y-0.5 whitespace-nowrap overflow-hidden">
        {/* Long text on desktop */}
        <span className="hidden sm:inline">
          We may earn a commission when you buy through our links, at no extra cost to you.
        </span>
        {/* Short text on mobile strictly in 1 line */}
        <span className="sm:hidden">
          We may earn a commission.
        </span>
        <Link
          href="/privacy"
          className="font-semibold text-white underline hover:text-[#d6cbff] inline-flex items-center gap-0.5 shrink-0"
        >
          <span className="hidden sm:inline">How we make money</span>
          <span className="sm:hidden">Learn how</span>
          <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </Link>
      </div>
    </aside>
  );
}
