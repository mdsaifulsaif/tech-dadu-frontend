"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function TopDisclosureBar() {
  return (
    <aside
      aria-label="Affiliate disclosure"
      className="w-full bg-[#0b0818] border-b border-white/5 py-1.5 px-4 text-center text-[12px] sm:text-[13px] text-[#c9c2e6] transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-x-2 gap-y-0.5">
        <span>
          We may earn a commission when you buy through our links, at no extra cost to you.
        </span>
        <Link
          href="/blogs"
          className="font-semibold text-white underline hover:text-[#d6cbff] inline-flex items-center gap-0.5"
        >
          <span>How we make money</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
