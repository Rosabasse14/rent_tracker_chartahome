
import { useState, useEffect } from "react";
import { SidebarContent } from "./SidebarContent";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", String(isCollapsed));
    // Dispatch a custom event to notify other components (like App.tsx layout)
    window.dispatchEvent(new Event("sidebar-toggle"));
  }, [isCollapsed]);

  return (
    <aside
      className={cn(
        "hidden md:flex border-r border-sidebar-border flex-col transition-all duration-300 ease-in-out relative bg-sidebar z-20",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <SidebarContent isCollapsed={isCollapsed} />

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-primary border-2 border-sidebar-background rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all z-30"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-primary-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-primary-foreground" />
        )}
      </button>
    </aside>
  );
}
