import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { useData } from "@/context/DataContext";
import {
    Shield,
    Users,
    Building2,
    Home,
    Search,
    UserPlus,
    Activity,
    ArrowUpRight,
    TrendingUp,
    AlertCircle,
    LayoutGrid,
    CheckCircle2,
    DollarSign
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";

export function SuperAdminDashboard() {
    const { managers, properties, tenants, units, paymentProofs } = useData();
    const { language } = useAuth();
    const t = translations[language];

    // System-wide KPIs
    const totalManagers = managers.length;
    const totalProperties = properties.length;
    const totalUnits = units.length;
    const totalTenants = tenants.length;
    const vacantUnits = units.filter(u => u.status === 'vacant').length;

    // Financial KPIs
    const totalExpectedRent = units.reduce((sum, u) => sum + u.monthlyRent, 0);
    const totalCollectedThisMonth = paymentProofs
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <PageLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-foreground flex items-center gap-3">
                        <Shield className="w-10 h-10 text-primary" />
                        {t.system_governance}
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">{t.real_time_oversight}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/super-admin/audit" className="flex items-center gap-2 px-6 py-3 bg-white border border-border shadow-sm rounded-2xl font-bold hover:shadow-md transition-all text-sm">
                        <Search className="w-4 h-4 text-primary" />
                        {t.audit_hub}
                    </Link>
                    <Link to="/managers" className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground shadow-lg shadow-primary/20 rounded-2xl font-bold hover:bg-primary/90 transition-all text-sm">
                        <UserPlus className="w-4 h-4" />
                        {t.onboard_manager}
                    </Link>
                </div>
            </div>

            {/* Core KPI Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    label={t.verified_operators}
                    value={totalManagers.toString()}
                    icon={<Users className="w-6 h-6 text-indigo-600" />}
                    iconBgColor="bg-indigo-100"
                    sublabel={language === 'fr' ? "+2 ce mois-ci" : "+2 this month"}
                />
                <StatCard
                    label={t.asset_portfolio}
                    value={totalProperties.toString()}
                    icon={<Building2 className="w-6 h-6 text-blue-600" />}
                    iconBgColor="bg-blue-100"
                    sublabel={`${totalUnits} ${t.units}`}
                />
                <StatCard
                    label={t.vacant_units}
                    value={vacantUnits.toString()}
                    icon={<Home className="w-6 h-6 text-emerald-600" />}
                    iconBgColor="bg-emerald-100"
                    sublabel={language === 'fr' ? "-5% depuis le mois dernier" : "-5% from last month"}
                />
                <StatCard
                    label={t.verified_residents}
                    value={totalTenants.toString()}
                    icon={<Shield className="w-6 h-6 text-amber-600" />}
                    iconBgColor="bg-amber-100"
                    sublabel={language === 'fr' ? "+12 nouveaux" : "+12 new"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Overview */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card rounded-[2.5rem] border shadow-sm p-8 overflow-hidden relative group">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                <Activity className="w-6 h-6 text-primary" />
                                {t.asset_breakdown}
                            </h2>
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-100 font-bold text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {t.healthy}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col justify-between group-hover:bg-slate-100 transition-colors">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{t.total_expected_rent}</p>
                                    <h3 className="text-3xl font-black text-slate-900">{totalExpectedRent.toLocaleString()} <span className="text-sm font-normal text-slate-400">FCFA</span></h3>
                                </div>
                                <p className="text-xs text-slate-500 mt-4 font-medium italic opacity-70">
                                    {t.potential_revenue}
                                </p>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 flex flex-col justify-between group-hover:bg-primary/10 transition-colors">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t.total_collected_month}</p>
                                        <div className="text-xs font-bold text-primary flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4" />
                                            +8.4%
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-primary">{totalCollectedThisMonth.toLocaleString()} <span className="text-sm font-normal opacity-60">FCFA</span></h3>
                                </div>
                                <p className="text-xs text-primary/70 mt-4 font-medium">
                                    +12.5M {t.from_last_month}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-amber-50 rounded-[1.5rem] border border-amber-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest leading-none mb-1">{t.immediate_attention}</h4>
                                    <p className="text-xs text-amber-700 font-medium">12 {t.units} {t.remain_unpaid_msg}.</p>
                                </div>
                            </div>
                            <Link to="/super-admin/audit" className="px-5 py-2.5 bg-white border border-amber-200 text-amber-700 font-bold rounded-xl text-xs hover:bg-amber-100 transition-colors whitespace-nowrap">
                                {t.view_unpaid}
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-black tracking-tight">{t.platform_managers}</h2>
                        <Link to="/managers" className="text-sm font-bold text-primary hover:underline">{t.full_directory}</Link>
                    </div>

                    <div className="bg-card rounded-[2.5rem] border shadow-sm overflow-hidden p-2">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-black uppercase tracking-[0.1em] text-[10px]">
                                <tr>
                                    <th className="px-8 py-5">{t.manager_entity}</th>
                                    <th className="px-8 py-5 font-black uppercase">{t.location}</th>
                                    <th className="px-8 py-5 font-black uppercase">{t.properties}</th>
                                    <th className="px-8 py-5 font-black uppercase text-center">{t.occupancy}</th>
                                    <th className="px-8 py-5 text-right font-black uppercase">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {managers.slice(0, 5).map((manager) => (
                                    <tr key={manager.id} className="hover:bg-muted/30 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                                                    {manager.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="font-extrabold text-slate-900 block">{manager.name}</span>
                                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{manager.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="font-bold text-slate-600">{manager.city}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-slate-900 text-lg">04</span>
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-xs font-black text-emerald-600">92%</span>
                                                <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="w-[92%] h-full bg-emerald-500"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Link to={`/managers`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                                                {t.drill_down}
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column - System Health */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[60px] -mr-20 -mt-20"></div>

                        <h3 className="text-xl font-black mb-1 flex items-center gap-2 uppercase tracking-tight">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            {t.healthy}
                        </h3>
                        <p className="text-slate-400 text-xs font-medium mb-8">{t.all_nodes_stable}</p>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.occupancy_rate}</p>
                                    <span className="text-sm font-black text-emerald-400">94.2%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[94.2%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.system_economy}</p>
                                    <span className="text-sm font-black text-primary">88.5%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[88.5%] shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-800 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.active_tenants}</p>
                                <p className="text-2xl font-black text-white">{totalTenants}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.units}</p>
                                <p className="text-2xl font-black text-white">{totalUnits}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
