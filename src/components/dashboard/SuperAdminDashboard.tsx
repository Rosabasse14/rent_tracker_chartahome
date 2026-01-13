
import { PageLayout } from "@/components/layout/PageLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, Building, ShieldCheck, Activity, Plus, MoreHorizontal, UserCog, Home, LayoutGrid, DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { useData } from "@/context/DataContext";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";

export function SuperAdminDashboard() {
    const { properties, units, tenants, managers, paymentProofs } = useData();
    const { language } = useAuth();
    const t = translations[language];

    // Derived Stats
    const totalManagers = managers.length;
    const totalProperties = properties.length;
    const totalUnits = units.length;
    const occupiedUnits = units.filter(u => u.status === 'occupied').length;
    const vacantUnits = totalUnits - occupiedUnits;

    // Rent Calculations (Mocking for demonstration)
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const totalRentExpected = units.reduce((sum, u) => sum + u.monthlyRent, 0);
    const totalRentCollected = paymentProofs
        .filter(p => p.status === 'paid' && p.period === currentMonth)
        .reduce((sum, p) => sum + p.amount, 0);
    const totalOutstanding = totalRentExpected - totalRentCollected;

    return (
        <PageLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="page-header mb-0">
                    <h1 className="text-4xl font-black tracking-tighter mb-2 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">{t.system_governance}</h1>
                    <p className="text-muted-foreground font-medium">{t.real_time_oversight}</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/super-admin/audit" className="inline-flex items-center gap-2 bg-white border border-border px-5 py-2.5 rounded-xl font-bold hover:bg-muted transition-all shadow-sm">
                        <Activity className="w-4 h-4" />
                        {t.audit_hub}
                    </Link>
                    <Link to="/managers" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5">
                        <Plus className="w-4 h-4" />
                        {t.onboard_manager}
                    </Link>
                </div>
            </div>

            {/* Global KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    label={t.managers}
                    value={totalManagers.toString()}
                    sublabel={t.verified_operators}
                    icon={<UserCog className="w-5 h-5 text-indigo-600" />}
                    iconBgColor="bg-indigo-100"
                />
                <StatCard
                    label={t.asset_portfolio}
                    value={totalProperties.toString()}
                    sublabel={`${totalUnits} ${t.total_units}`}
                    icon={<Building className="w-5 h-5 text-blue-600" />}
                    iconBgColor="bg-blue-100"
                />
                <StatCard
                    label={t.occupancy_rate}
                    value={`${Math.round((occupiedUnits / (totalUnits || 1)) * 100)}%`}
                    sublabel={`${vacantUnits} ${t.vacant_units}`}
                    icon={<Home className="w-5 h-5 text-emerald-600" />}
                    iconBgColor="bg-emerald-100"
                />
                <StatCard
                    label={t.active_tenants}
                    value={tenants.filter(t => t.status === 'active').length.toString()}
                    sublabel={t.verified_residents}
                    icon={<Users className="w-5 h-5 text-amber-600" />}
                    iconBgColor="bg-amber-100"
                />
            </div>

            {/* Financial Oversight */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-200/50 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-emerald-100/80 font-bold text-xs uppercase tracking-[0.2em] mb-4">Total Collected ({new Date().toLocaleString('default', { month: 'short' })})</p>
                        <h3 className="text-5xl font-black tracking-tighter mb-2">{totalRentCollected.toLocaleString()} <span className="text-xl font-medium opacity-60">FCFA</span></h3>
                        <div className="flex items-center gap-2 text-emerald-100/90 text-sm font-bold">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>+12% from last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-border shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] mb-4">Total Expected Rent</p>
                        <h3 className="text-4xl font-black tracking-tighter mb-1 text-slate-900">{totalRentExpected.toLocaleString()} <span className="text-sm font-medium opacity-40 uppercase">FCFA</span></h3>
                        <p className="text-xs text-muted-foreground font-medium">Platform-wide potential revenue</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-dashed flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-slate-700">All Nodes Stable</span>
                        </div>
                        <span className="p-1 px-3 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase">Healthy</span>
                    </div>
                </div>

                <div className="bg-rose-50 rounded-[2.5rem] p-8 border border-rose-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-rose-600/80 font-bold text-xs uppercase tracking-[0.2em] mb-4 text-rose-800">{t.outstanding}</p>
                        <h3 className="text-4xl font-black tracking-tighter mb-1 text-rose-600">{totalOutstanding.toLocaleString()} <span className="text-sm font-medium opacity-60 uppercase">FCFA</span></h3>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                            <p className="text-xs text-rose-700 font-bold uppercase tracking-wider">{t.immediate_attention}</p>
                        </div>
                    </div>
                    <Link to="/super-admin/audit?status=unpaid" className="mt-6 bg-rose-600 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl text-center hover:bg-rose-700 transition-all shadow-lg shadow-rose-200">
                        {t.view_unpaid}
                    </Link>
                </div>
            </div>

            {/* Manager List Section (Level 1) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">{t.managers}</h2>
                    <Link to="/managers" className="text-sm font-bold text-primary px-4 py-2 hover:bg-primary/5 rounded-xl transition-all uppercase tracking-widest">{t.full_directory}</Link>
                </div>

                <div className="bg-card rounded-[2.5rem] border shadow-sm overflow-hidden p-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                                <tr>
                                    <th className="px-6 py-5">{t.manager_entity}</th>
                                    <th className="px-6 py-5">{t.location}</th>
                                    <th className="px-6 py-5 text-center">{t.properties}</th>
                                    <th className="px-6 py-5 text-center">{t.units}</th>
                                    <th className="px-6 py-5 text-center">{t.occupancy}</th>
                                    <th className="px-6 py-5 text-right pr-8">{t.status}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {managers.map((manager) => {
                                    const managerProps = properties.filter(p => p.managerId === manager.id);
                                    const managerPropIds = managerProps.map(p => p.id);
                                    const managerUnits = units.filter(u => managerPropIds.includes(u.propertyId));
                                    const occ = managerUnits.length > 0
                                        ? Math.round((managerUnits.filter(u => u.status === 'occupied').length / managerUnits.length) * 100)
                                        : 0;

                                    return (
                                        <tr key={manager.id} className="hover:bg-muted/30 transition-all group cursor-pointer">
                                            <td className="px-6 py-5">
                                                <Link to={`/super-admin/managers/${manager.id}`} className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-xs">
                                                        {manager.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-foreground block group-hover:text-primary transition-colors">{manager.name}</span>
                                                        <p className="text-[10px] text-muted-foreground font-medium">{manager.email}</p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{manager.city}</span>
                                            </td>
                                            <td className="px-6 py-5 text-center font-black text-slate-700">{managerProps.length}</td>
                                            <td className="px-6 py-5 text-center font-bold text-slate-600">{managerUnits.length}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div className={`h-full bg-emerald-500 rounded-full`} style={{ width: `${occ}%` }}></div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-emerald-600">{occ}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right pr-8">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${manager.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                                                    }`}>
                                                    {t[manager.status as keyof typeof t] || manager.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
