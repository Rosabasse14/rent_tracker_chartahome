
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";

interface StatusBadgeProps {
  status: "paid" | "partial" | "overdue" | "pending" | "active" | "inactive" | "vacant" | "occupied" | "rejected" | "unpaid";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { language } = useAuth();
  const t = translations[language];
  const styles = {
    paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    partial: "bg-amber-100 text-amber-700 border-amber-200",
    overdue: "bg-red-100 text-red-700 border-red-200",
    pending: "bg-blue-100 text-blue-700 border-blue-200",
    inactive: "bg-slate-100 text-slate-600 border-slate-200",
    vacant: "bg-indigo-50 text-indigo-600 border-indigo-100",
    occupied: "bg-rose-50 text-rose-600 border-rose-100",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
    unpaid: "bg-red-100 text-red-700 border-red-200",
  };

  const label = t[status as keyof typeof t] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest shadow-sm",
        styles[status]
      )}
    >
      {label}
    </span>
  );
}
