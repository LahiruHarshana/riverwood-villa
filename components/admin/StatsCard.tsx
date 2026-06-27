"use client";

import { useEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";
import gsap from "gsap";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "sage" | "amber" | "teal" | "blue" | "slate";
  trend?: string;
  caption?: string;
  delay?: number;
}

const colorMap = {
  sage:  { bg: "bg-emerald-50",      text: "text-emerald-600",   accent: "from-emerald-500/10 to-emerald-500/0", ring: "ring-emerald-500/20", gradient: "from-emerald-500 to-emerald-400" },
  amber: { bg: "bg-amber-50",        text: "text-amber-600",     accent: "from-amber-500/10 to-amber-500/0",    ring: "ring-amber-500/20", gradient: "from-amber-500 to-amber-400" },
  teal:  { bg: "bg-teal-50",         text: "text-teal-600",      accent: "from-teal-500/10 to-teal-500/0",     ring: "ring-teal-500/20", gradient: "from-teal-500 to-teal-400" },
  blue:  { bg: "bg-blue-50",         text: "text-blue-600",      accent: "from-blue-500/10 to-blue-500/0",     ring: "ring-blue-500/20", gradient: "from-blue-500 to-blue-400" },
  slate: { bg: "bg-gray-50",         text: "text-gray-600",      accent: "from-gray-500/10 to-gray-500/0",     ring: "ring-gray-500/20", gradient: "from-gray-500 to-gray-400" },
};

export function StatsCard({ title, value, icon: Icon, color, trend, caption, delay = 0 }: StatsCardProps) {
  const c = colorMap[color];
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        delay: delay / 1000,
        ease: "power3.out",
      }
    );

    const valEl = valueRef.current;
    if (valEl && typeof value === "number") {
      const originalText = valEl.textContent || "";
      const prefix = originalText.startsWith("$") ? "$" : "";
      const num = value;
      if (num > 0) {
        valEl.textContent = prefix + "0";
        gsap.to(valEl, {
          duration: 1.2,
          delay: delay / 1000 + 0.2,
          ease: "power2.out",
          onUpdate: () => {
            const progress = gsap.getProperty(valEl, "--num") as number || 0;
            if (progress > 0) {
              valEl.textContent = prefix + Math.round(progress).toLocaleString();
            }
          },
        });
        gsap.set(valEl, { "--num": 0 });
        gsap.to(valEl, {
          "--num": num,
          duration: 1.2,
          delay: delay / 1000 + 0.2,
          ease: "power2.out",
        });
      }
    }
  }, [value, delay]);

  const isNumeric = typeof value === "number";

  return (
    <div ref={cardRef} className="admin-card admin-stat-card group relative p-5">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.accent}`} />
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-70 ${c.gradient}`} />
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/70 blur-2xl transition-transform duration-300 group-hover:scale-125" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className={`admin-icon-pill ${c.bg} ${c.text} ring-1 ${c.ring}`}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <span className={`inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${c.bg} ${c.text}`}>
              {trend}
            </span>
          )}
        </div>

        <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-gray-500">
          {title}
        </p>

        <p
          ref={isNumeric ? valueRef : undefined}
          className="mt-2 text-3xl font-black tracking-tight text-gray-950 leading-none"
          style={isNumeric ? { "--num": 0 } as React.CSSProperties : undefined}
        >
          {value}
        </p>

        {caption && <p className="mt-3 text-xs font-medium leading-5 text-gray-500">{caption}</p>}
      </div>
    </div>
  );
}
