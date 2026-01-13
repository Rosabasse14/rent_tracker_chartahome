
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: ReactNode;
  iconBgColor?: string;
  className?: string;
}

export function StatCard({ label, value, sublabel, icon, iconBgColor, className }: StatCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-card p-6 rounded-2xl border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5",
      className
    )}>
      {/* Subtle background glow */}
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10",
        iconBgColor || "bg-primary"
      )} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-extrabold text-foreground tracking-tight">{value}</p>
          {sublabel && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-medium">
              {sublabel}
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-[1rem] flex items-center justify-center shadow-inner",
          iconBgColor || "bg-primary/10"
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
