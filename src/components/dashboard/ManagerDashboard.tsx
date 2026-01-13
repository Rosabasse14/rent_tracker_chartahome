
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useData } from "@/context/DataContext";
import {
    DollarSign,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    ExternalLink,
    Users,
    Building2,
    Home,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";

export function ManagerDashboard() {
    const { tenants, paymentProofs, units, properties, overduePayments } = useData();
    const { language } = useAuth();
    const t = translations[language];

    // Derive stats
    const totalProperties = properties.length;
    const totalUnitsCount = units.length;
    const occupiedUnitsCount = units.filter(u => u.status === 'occupied').length;
    const vacantUnitsCount = totalUnitsCount - occupiedUnitsCount;

    // Rent Collected (Current Month)
    const currentMonth = new Date().toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const periodString = `${currentMonth} ${currentYear}`;

    const totalCollected = paymentProofs
        .filter(p => p.status === 'paid' && p.period === periodString)
        .reduce((sum, p) => sum + p.amount, 0);

    const pendingProofs = paymentProofs.filter(p => p.status === 'pending');

    // Outstanding - simple mock for UI
    const totalExpected = units.reduce((sum, u) => sum + u.monthlyRent, 0);
    const outstandingRent = Math.max(0, totalExpected - totalCollected);

    return (
        <PageLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
                        {t.operations_overview.split(' ')[0]} <span className="text-primary">{t.operations_overview.split(' ')[1]}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">{t.operational_backbone}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{t.current_period}</span>
                        <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20">{periodString}</span>
                    </div>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
                <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{t.properties}</p>
                    <h3 className="text-2xl font-black">{totalProperties}</h3>
                </div>

                <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Home className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{t.total_units}</p>
                    <h3 className="text-2xl font-black">{totalUnitsCount}</h3>
                </div>

                <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{t.occupied}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-emerald-600">{occupiedUnitsCount}</h3>
                        <span className="text-xs text-muted-foreground font-medium">/ {totalUnitsCount}</span>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{t.vacant}</p>
                    <h3 className="text-2xl font-black text-amber-600">{vacantUnitsCount}</h3>
                </div>

                <div className="xl:col-span-2 bg-gradient-to-br from-primary to-primary-foreground p-6 rounded-[2rem] text-white shadow-xl shadow-primary/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{t.total_collected}</p>
                            <div className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />
                                +12%
                            </div>
                        </div>
                        <h3 className="text-3xl font-black leading-none">{totalCollected.toLocaleString()} <span className="text-sm font-normal text-white/80 ml-1">FCFA</span></h3>
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-medium text-white/60">
                            <span>Target: {(totalExpected * 0.9).toLocaleString()} FCFA</span>
                            <span className="text-white/90">{t.view} Stats →</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-black tracking-tight">{t.recent_payments}</h2>
                        <Link to="/payment-proofs" className="text-sm font-bold text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-all">{t.review_all}</Link>
                    </div>

                    <div className="bg-card rounded-[2.5rem] border shadow-sm overflow-hidden p-2">
                        {paymentProofs.length === 0 ? (
                            <div className="p-16 text-center text-muted-foreground bg-muted/20 rounded-[2rem]">
                                <Clock className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                <p className="font-medium italic">{t.no_submissions}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                                        <tr>
                                            <th className="px-6 py-5">{t.tenant}</th>
                                            <th className="px-6 py-5">{t.amount}</th>
                                            <th className="px-6 py-5">{t.method}</th>
                                            <th className="px-6 py-5 text-center">{t.status}</th>
                                            <th className="px-6 py-5 text-right pr-8">{t.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {paymentProofs.slice(0, 6).map((payment) => (
                                            <tr key={payment.id} className="hover:bg-muted/30 transition-all group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-[10px]">
                                                            {payment.tenantName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-foreground block">{payment.tenantName}</span>
                                                            <p className="text-[10px] text-muted-foreground">{payment.unitName}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="font-black text-primary">{payment.amount.toLocaleString()}</span>
                                                    <span className="text-[10px] text-muted-foreground ml-1">FCFA</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{payment.paymentMethod || 'Cash'}</span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <StatusBadge status={payment.status} />
                                                </td>
                                                <td className="px-6 py-5 text-right pr-8">
                                                    <Link to="/payment-proofs" className="inline-flex items-center gap-1.5 text-primary text-xs font-bold hover:bg-primary/10 px-4 py-2 rounded-xl transition-all border border-primary/20 bg-white shadow-sm">
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        {t.verify}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-2 pt-4">
                        <h2 className="text-2xl font-black tracking-tight text-red-600">{t.unpaid_rent}</h2>
                        <Link to="/rent-ledger" className="text-sm font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-all">{t.full_ledger}</Link>
                    </div>

                    <div className="bg-card rounded-[2.5rem] border border-red-100 shadow-sm overflow-hidden p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {overduePayments.slice(0, 4).map((overdue) => (
                                <div key={overdue.id} className="flex items-center justify-between p-4 rounded-2xl bg-red-50/50 border border-red-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                                            {overdue.tenantName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{overdue.tenantName}</p>
                                            <p className="text-[10px] text-muted-foreground">{overdue.unitName} • {overdue.daysOverdue} {t.days_late}</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-red-600 text-sm whitespace-nowrap">{overdue.amount.toLocaleString()} FCFA</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* KPI Sidebar */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-black tracking-tight">{t.insights}</h2>
                    </div>

                    <div className="bg-card rounded-[2.5rem] border shadow-sm p-8 bg-gradient-to-b from-card to-muted/10 relative overflow-hidden group">
                        {/* Progress Ring or Graphic */}
                        <div className="mb-10 text-center relative">
                            <div className="w-40 h-40 rounded-full border-[12px] border-muted/50 mx-auto flex items-center justify-center">
                                <div>
                                    <p className="text-4xl font-black tracking-tighter">85%</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{t.efficiency}</p>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute top-0 right-10 w-4 h-4 bg-emerald-500 rounded-full blur-sm animate-pulse"></div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-5 rounded-[1.5rem] bg-indigo-50/50 border border-indigo-100 flex items-start gap-4 hover:bg-indigo-50 transition-colors">
                                <div className="p-2.5 rounded-xl bg-indigo-100/50 text-indigo-700">
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest leading-none mb-1">{t.unpaid_alert}</h4>
                                    <p className="text-[11px] text-indigo-700 font-medium">3 {t.unpaid_tenants_msg} {currentMonth}.</p>
                                    <Link to="/rent-ledger" className="inline-block mt-2 text-[10px] font-black text-indigo-600 hover:underline">{t.run_ledger} →</Link>
                                </div>
                            </div>

                            <div className="p-5 rounded-[1.5rem] bg-emerald-50/50 border border-emerald-100 flex items-start gap-4 hover:bg-emerald-50 transition-colors">
                                <div className="p-2.5 rounded-xl bg-emerald-100/50 text-emerald-700">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-emerald-900 uppercase tracking-widest leading-none mb-1">{t.growth_high}</h4>
                                    <p className="text-[11px] text-emerald-700 font-medium">{t.occupancy_increased}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-border/50">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 opacity-60">{t.super_actions}</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <Link to="/properties" className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border/50 bg-background hover:bg-primary/5 hover:border-primary/20 transition-all group/action">
                                    <Building2 className="w-5 h-5 mb-2 text-primary group-hover/action:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{t.properties}</span>
                                </Link>
                                <Link to="/tenants" className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border/50 bg-background hover:bg-emerald-50 hover:border-emerald-200 transition-all group/action">
                                    <Users className="w-5 h-5 mb-2 text-emerald-600 group-hover/action:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{t.onboard}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
