"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl border border-theme-border bg-theme-surface/60 opacity-50 ${className}`} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative w-9 h-9 rounded-xl border border-theme-border bg-theme-surface hover:border-theme-primary text-theme-fg flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-500 hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
};

