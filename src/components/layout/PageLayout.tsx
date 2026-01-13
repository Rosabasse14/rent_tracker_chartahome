
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string; // Add className prop for flexibility
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`container mx-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${className}`}>
      {children}
    </div>
  );
}
