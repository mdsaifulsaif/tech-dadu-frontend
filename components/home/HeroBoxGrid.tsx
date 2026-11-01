


// import { Users, BarChart3, Keyboard, Star, Tag, Zap } from "lucide-react";
// import type { LucideIcon } from "lucide-react";

// type Cell = { icon: LucideIcon; delay: number } | null;

// // 3 col x 3 row = 9 box
// const leftCells: Cell[] = [
//     null, null, { icon: Users, delay: 0 },
//     null, { icon: BarChart3, delay: 1.2 }, null,
//     { icon: Tag, delay: 2.4 }, null, null,
// ];

// const rightCells: Cell[] = [
//     { icon: Zap, delay: 0.6 }, null, null,
//     null, { icon: Star, delay: 1.8 }, null,
//     null, null, { icon: Keyboard, delay: 3 },
// ];

// function Grid({ cells, side }: { cells: Cell[]; side: "left" | "right" }) {
//     const dir = side === "left" ? "right" : "left";

//     return (
//         <div
//             className={`absolute inset-y-0 w-[45%] opacity-40 sm:w-[40%] sm:opacity-60 lg:w-[260px] lg:opacity-100 xl:w-[320px] ${side === "left" ? "left-0" : "right-0"
//                 }`}
//             style={{
//                 WebkitMaskImage: `linear-gradient(to ${dir}, black 20%, transparent 100%)`,
//                 maskImage: `linear-gradient(to ${dir}, black 20%, transparent 100%)`,
//             }}
//         >
//             <div
//                 className={`grid h-full grid-cols-3 grid-rows-3 gap-2 py-4 sm:gap-3 sm:py-6 ${side === "left" ? "-translate-x-4" : "translate-x-4"
//                     }`}
//             >
//                 {cells.map((cell, i) => {
//                     const Icon = cell?.icon;
//                     return (
//                         <div
//                             key={i}
//                             className={`relative flex items-center justify-center rounded-xl border ${Icon
//                                 ? "animate-pulse border-[#b8a6ff]/45 bg-gradient-to-br from-[#b8a6ff]/20 to-transparent shadow-[0_0_30px_-6px_rgba(184,166,255,0.5)]"
//                                 : "border-[#b8a6ff]/15 bg-gradient-to-br from-[#b8a6ff]/[0.07] to-transparent"
//                                 }`}
//                             style={
//                                 Icon
//                                     ? { animationDelay: `${cell!.delay}s`, animationDuration: "4s" }
//                                     : undefined
//                             }
//                         >
//                             {/* choto corner dot */}
//                             <span
//                                 className={`absolute left-1.5 top-1.5 h-1 w-1 rounded-full sm:left-2 sm:top-2 ${Icon ? "bg-[#b8a6ff]/80" : "bg-[#b8a6ff]/25"
//                                     }`}
//                             />
//                             {Icon && (
//                                 <Icon
//                                     className="h-4 w-4 text-[#d6ccff] sm:h-6 sm:w-6"
//                                     strokeWidth={1.6}
//                                 />
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

// export default function HeroBoxGrid() {
//     return (
//         <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
//         >
//             <Grid cells={leftCells} side="left" />
//             <Grid cells={rightCells} side="right" />
//         </div>
//     );
// }








"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

/* ---------- Custom SVG icons ---------- */
type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: ReactNode }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

const CartIcon = ({ className }: IconProps) => (
    <Svg className={className}>
        <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.2a1 1 0 0 0 1-.76L19.5 8H6" />
        <circle cx="9" cy="19.5" r="1.5" />
        <circle cx="17" cy="19.5" r="1.5" />
    </Svg>
);

const StoreIcon = ({ className }: IconProps) => (
    <Svg className={className}>
        <path d="M4 9l1.5-5h13L20 9" />
        <path d="M4 9a2.67 2.67 0 0 0 5.33 0 2.67 2.67 0 0 0 5.34 0A2.67 2.67 0 0 0 20 9" />
        <path d="M5 12v8h14v-8" />
        <path d="M10 20v-4h4v4" />
    </Svg>
);

const PackageIcon = ({ className }: IconProps) => (
    <Svg className={className}>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M4 7.5l8 4.5 8-4.5" />
        <path d="M12 12v9" />
    </Svg>
);

const GlobeIcon = ({ className }: IconProps) => (
    <Svg className={className}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </Svg>
);

const TagIcon = ({ className }: IconProps) => (
    <Svg className={className}>
        <path d="M3 12V4h8l9.2 9.2a1.5 1.5 0 0 1 0 2.1l-5.9 5.9a1.5 1.5 0 0 1-2.1 0L3 12z" />
        <circle cx="7.5" cy="8.5" r="1.2" />
    </Svg>
);

const BoltIcon = ({ className }: IconProps) => (
    <Svg className={className}>
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </Svg>
);

const ChartIcon = ({ className }: IconProps) => (
    <Svg className={className}>
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M22 20H2" />
    </Svg>
);

const UsersIcon = ({ className }: IconProps) => (
    <Svg className={className}>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M17 14c2.5 0 4.5 2 4.5 4.5" />
    </Svg>
);

const StarIcon = ({ className }: IconProps) => (
    <Svg className={className}>
        <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3z" />
    </Svg>
);

const ICONS: ((p: IconProps) => ReactNode)[] = [
    CartIcon, StoreIcon, PackageIcon, GlobeIcon,
    TagIcon, BoltIcon, ChartIcon, UsersIcon, StarIcon,
];

/* ---------- Random helpers ---------- */
type Cell = { Icon: (p: IconProps) => ReactNode; delay: number } | null;

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// 9 ta box er moddhe `count` ta random jaygay random icon boshabe
function buildCells(count: number): Cell[] {
    const positions = shuffle(Array.from({ length: 9 }, (_, i) => i)).slice(0, count);
    const icons = shuffle(ICONS);
    const cells: Cell[] = Array(9).fill(null);
    positions.forEach((pos, k) => {
        cells[pos] = { Icon: icons[k % icons.length], delay: Math.random() * 4 };
    });
    return cells;
}

/* ---------- Grid ---------- */
function Grid({ cells, side }: { cells: Cell[]; side: "left" | "right" }) {
    const dir = side === "left" ? "right" : "left";

    return (
        <div
            className={`absolute inset-y-0 w-[34%] max-w-[130px] opacity-60 sm:w-[30%] sm:max-w-none sm:opacity-80 lg:w-[260px] lg:opacity-100 xl:w-[320px] ${side === "left" ? "left-0" : "right-0"
                }`}
            style={{
                WebkitMaskImage: `linear-gradient(to ${dir}, black 25%, transparent 100%)`,
                maskImage: `linear-gradient(to ${dir}, black 25%, transparent 100%)`,
            }}
        >
            <div
                className={`grid h-full grid-cols-3 content-center gap-1.5 sm:gap-3 ${side === "left"
                        ? "-translate-x-3 sm:-translate-x-4"
                        : "translate-x-3 sm:translate-x-4"
                    }`}
            >
                {cells.map((cell, i) => (
                    <div
                        key={i}
                        className={`relative flex aspect-square items-center justify-center rounded-lg border sm:rounded-2xl ${cell
                                ? "animate-pulse border-[#b8a6ff]/35 bg-gradient-to-br from-[#b8a6ff]/[0.14] to-[#b8a6ff]/[0.03] shadow-[0_0_28px_-8px_rgba(184,166,255,0.55)]"
                                : "border-[#b8a6ff]/[0.12] bg-gradient-to-br from-[#b8a6ff]/[0.06] to-transparent"
                            }`}
                        style={
                            cell
                                ? { animationDelay: `${cell.delay}s`, animationDuration: "5s" }
                                : undefined
                        }
                    >
                        {/* corner dot */}
                        <span
                            className={`absolute left-1.5 top-1.5 h-[3px] w-[3px] rounded-full sm:left-2.5 sm:top-2.5 sm:h-1 sm:w-1 ${cell ? "bg-[#b8a6ff]/70" : "bg-[#b8a6ff]/25"
                                }`}
                        />

                        {cell && (
                            <cell.Icon className="h-[45%] w-[45%] text-[#cdbfff]" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ---------- Main ---------- */
export default function HeroBoxGrid() {
    const [left, setLeft] = useState<Cell[]>(Array(9).fill(null));
    const [right, setRight] = useState<Cell[]>(Array(9).fill(null));

    useEffect(() => {
        // client e load howar por random position set hobe (hydration error hobe na)
        setLeft(buildCells(3));
        setRight(buildCells(3));
    }, []);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
            <Grid cells={left} side="left" />
            <Grid cells={right} side="right" />
        </div>
    );
}