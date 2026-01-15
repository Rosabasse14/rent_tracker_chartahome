
import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Home,
    Users,
    FileText,
    Upload,
    Bell,
    LogOut,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { translations } from "@/utils/translations";

interface SidebarContentProps {
    onItemClick?: () => void;
    isCollapsed?: boolean;
}

export function SidebarContent({ onItemClick, isCollapsed }: SidebarContentProps) {
    const location = useLocation();
    const { user, logout, language, setLanguage } = useAuth();
    const t = translations[language];
    const { tenants } = useData();

    const superAdminNav = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Managers", href: "/managers", icon: Users },
        { name: "Audit Hub", href: "/super-admin/audit", icon: ShieldCheck },
    ];

    const managerNav = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Properties", href: "/properties", icon: Building2 },
        { name: "Units", href: "/units", icon: Home },
        { name: "Tenants", href: "/tenants", icon: Users },
        { name: "Rent Ledger", href: "/rent-ledger", icon: FileText },
        { name: "Notifications", href: "/notifications", icon: Bell },
    ];

    const tenantInfo = tenants.find(t => t.email === user?.email);
    const isTenantActive = tenantInfo && tenantInfo.unitId && tenantInfo.status === 'active';

    const tenantNav = [
        { name: "Overview", href: "/", icon: LayoutDashboard },
        { name: "Pay Rent", href: "/payment-proofs", icon: Upload },
        { name: "Notifications", href: "/notifications", icon: Bell },
    ];

    const navigation =
        user?.role === "SUPER_ADMIN" ? superAdminNav :
            user?.role === "TENANT"
                ? (isTenantActive ? tenantNav : [{ name: "Overview", href: "/", icon: LayoutDashboard }])
                : managerNav;

    return (
        <div className="flex flex-col h-full bg-sidebar select-none overflow-hidden h-screen">
            {/* Logo */}
            <div className={cn("p-6 border-b border-sidebar-border/50", isCollapsed && "px-4")}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    {!isCollapsed && (
                        <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                            <h1 className="font-bold text-foreground tracking-tight text-lg">Chartahome</h1>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                {t[user?.role as keyof typeof t] || user?.role?.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    const keyMap: Record<string, any> = {
                        "Dashboard": "dashboard",
                        "Managers": "managers",
                        "Audit Hub": "audit_hub",
                        "Properties": "properties",
                        "Units": "units",
                        "Tenants": "tenants",
                        "Rent Ledger": "rent_ledger",
                        "Notifications": "notifications",
                        "Overview": "overview",
                        "Pay Rent": "payment_proofs"
                    };
                    const translatedName = t[keyMap[item.name] as keyof typeof t] || item.name;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            onClick={onItemClick}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                isCollapsed && "px-0 justify-center w-10 mx-auto"
                            )}
                            title={isCollapsed ? translatedName : ""}
                        >
                            <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                            {!isCollapsed && (
                                <span className="animate-in fade-in slide-in-from-left-2 duration-300 truncate">
                                    {translatedName}
                                </span>
                            )}

                            {/* Collapsed Indicator */}
                            {isCollapsed && isActive && (
                                <div className="absolute right-0 w-1 h-6 bg-primary rounded-l-full" />
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Language Switcher */}
            <div className={cn("px-6 py-4 flex flex-col gap-3 border-t border-sidebar-border/30", isCollapsed && "px-2 items-center")}>
                {!isCollapsed && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.locale}</span>
                )}
                <div className={cn("flex bg-muted/50 rounded-lg p-0.5 border border-border/50", isCollapsed && "flex-col w-full")}>
                    <button
                        onClick={() => setLanguage('en')}
                        className={cn(
                            "px-3 py-1 rounded-md text-[10px] font-black transition-all flex-1",
                            language === 'en' ? "bg-white shadow-sm text-primary" : "text-muted-foreground opacity-50 hover:opacity-100",
                            isCollapsed && "px-1 text-[8px]"
                        )}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => setLanguage('fr')}
                        className={cn(
                            "px-3 py-1 rounded-md text-[10px] font-black transition-all flex-1",
                            language === 'fr' ? "bg-white shadow-sm text-primary" : "text-muted-foreground opacity-50 hover:opacity-100",
                            isCollapsed && "px-1 text-[8px]"
                        )}
                    >
                        FR
                    </button>
                </div>
            </div>

            {/* User Profile */}
            <div className={cn("p-4 border-t border-sidebar-border/50", isCollapsed && "p-2")}>
                <div className={cn("flex items-center gap-3 px-3 py-3 rounded-xl bg-muted/30 mb-2 border border-border/50", isCollapsed && "px-1 justify-center")}>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0 shadow-inner">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                            <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate font-medium">{user?.email}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => {
                        logout();
                        onItemClick?.();
                    }}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-black text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors uppercase tracking-wider group",
                        isCollapsed && "px-0"
                    )}
                    title={isCollapsed ? t.sign_out : ""}
                >
                    <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    {!isCollapsed && <span>{t.sign_out}</span>}
                </button>
            </div>
        </div>
    );
}
