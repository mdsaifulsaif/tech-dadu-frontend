"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { siteSettingApi } from "@/lib/api";
import { ISiteSettings } from "@/types";

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<{
    enabled?: boolean;
    text?: string;
    link?: string;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    siteSettingApi
      .get()
      .then((res) => {
        if (res.success && res.data?.announcement?.enabled) {
          setAnnouncement(res.data.announcement);
        }
      })
      .catch(() => {});
  }, []);

  if (!announcement?.enabled || !announcement.text || dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-theme-primary/90 via-theme-primary to-theme-secondary/90 text-theme-primary-fg text-xs py-2 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center pr-6">
        <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
        <span className="font-semibold">{announcement.text}</span>
        {announcement.link && (
          <a
            href={announcement.link}
            target={announcement.link.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="underline font-bold inline-flex items-center gap-1 hover:opacity-90 ml-1"
          >
            <span>Learn more</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-80 transition-opacity"
        title="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

