import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

export function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  return (
    <div className="admin-card admin-stat-card p-5">
      <div className="relative z-10 flex items-center justify-between mb-5">
        <div className={`admin-icon-pill ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="rounded-full bg-[#e8ebe3] px-2 py-1 text-xs font-bold text-[#465143]">
            {trend}
          </span>
        )}
      </div>
      <p className="relative z-10 text-3xl font-bold tracking-[-0.04em] text-[#151512]">{value}</p>
      <p className="relative z-10 mt-1 text-sm font-semibold text-[#6f746a]">{title}</p>
    </div>
  );
}
