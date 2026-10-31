"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Search } from "lucide-react";

export function HeroSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const q = query.trim();
        router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-10 mx-auto w-full max-w-xl flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-4 shadow-[0_0_60px_-15px_rgba(99,70,255,0.6)]"
        >
            <Search className="w-4 h-4 text-white/40 shrink-0" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search keyboards, monitors, templates, Figma kits..."
                className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-white/40 outline-none"
                aria-label="Search products and templates"
            />
            <button
                type="submit"
                aria-label="Search"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-500 hover:scale-105"
            >
                <ArrowUp className="w-5 h-5" />
            </button>
        </form>
    );
}