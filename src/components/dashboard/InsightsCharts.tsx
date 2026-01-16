
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { AlertCircle, TrendingUp, Wallet, Target } from "lucide-react";
import { Unit, PaymentProof, Tenant } from "@/types";

interface InsightsChartsProps {
    units?: Unit[];
    paymentProofs?: PaymentProof[];
    tenants?: Tenant[];
}

export function InsightsCharts({
    units: propUnits,
    paymentProofs: propPaymentProofs,
    tenants: propTenants
}: InsightsChartsProps) {
    const contextData = useData();
    const { language } = useAuth();
    const t = translations[language] as any;

    // Use props if provided, otherwise fallback to context
    const units = propUnits || contextData.units;
    const paymentProofs = propPaymentProofs || contextData.paymentProofs;
    // const tenants = propTenants || contextData.tenants; // Unused for now but kept for consistency

    // --- 1. Occupancy Rate ---
    const occupiedCount = units.filter((u) => u.status === "occupied").length;
    const vacantCount = units.length - occupiedCount;
    const occupancyData = [
        { name: t.occupied || "Occupied", value: occupiedCount },
        { name: t.vacant || "Vacant", value: vacantCount },
    ];
    const COLORS = ["#10b981", "#ef4444"]; // Emerald-500, Red-500

    // --- 2. Revenue Trends (Last 6 Months) ---
    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return d.toLocaleString(language === "fr" ? "fr-FR" : "en-US", { month: "short", year: "numeric" });
    }).reverse();

    const revenueData = last6Months.map((month) => {
        const total = paymentProofs
            .filter((p) => p.status === "paid" && (p.period.includes(month.split(" ")[0]) || p.submittedAt.includes(month.split(" ")[0])))
            .reduce((sum, p) => sum + p.amount, 0);
        return { name: month, revenue: total };
    });

    // --- 3. Potential vs Actual (This Month) ---
    // Calculate total potential monthly rent for ALL units (assuming all were occupied and paid)
    const totalPotentialRent = units.reduce((sum, u) => sum + (u.monthlyRent || 0), 0);

    // Calculate actual collected for CURRENT month
    const currentMonthStr = new Date().toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long' });
    const currentYear = new Date().getFullYear();
    // Match "January 2026" format roughly
    const currentPeriodMatch = `${currentMonthStr} ${currentYear}`;

    const actualCollected = paymentProofs
        .filter(p => p.status === 'paid' && p.period.includes(currentMonthStr)) // Loose match for robustness
        .reduce((sum, p) => sum + p.amount, 0);

    const potentialVsActualData = [
        { name: t.potential || "Potential", amount: totalPotentialRent, fill: "#cbd5e1" }, // Slate-300
        { name: t.collected || "Collected", amount: actualCollected, fill: "#10b981" }  // Emerald-500
    ];

    // --- 4. Vacancy Listing ---
    const vacantUnits = units.filter((u) => u.status === "vacant").slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Top Row: Occupancy & Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Occupancy Chart */}
                <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            {t.occupancy_rate || "Occupancy Rate"}
                        </h3>
                        <span className="text-2xl font-black text-foreground">
                            {units.length > 0 ? Math.round((occupiedCount / units.length) * 100) : 0}%
                        </span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={occupancyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {occupancyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-primary" />
                            {t.revenue_trends || "Revenue Trends"}
                        </h3>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Potential vs Actual & Vacant Units */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Potential vs Actual Chart */}
                <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <Target className="w-5 h-5 text-indigo-600" />
                            {t.financial_performance || "Performance"}
                        </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                        {t.potential_vs_actual_desc || "Potential revenue based on 100% occupancy vs Actual collected amount."}
                    </p>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={potentialVsActualData} margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--muted))" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 700, fill: "hsl(var(--foreground))" }}
                                    width={80}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Amount']}
                                />
                                <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
                                    {potentialVsActualData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-between text-xs font-medium">
                        <div className="text-slate-500">{t.gap || "Gap"}: <span className="text-red-500 font-bold">{(totalPotentialRent - actualCollected).toLocaleString()} FCFA</span></div>
                        <div className="text-emerald-600 font-bold">{totalPotentialRent > 0 ? Math.round((actualCollected / totalPotentialRent) * 100) : 0}% {t.realized || "Realized"}</div>
                    </div>
                </div>

                {/* Vacant Units */}
                <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm">
                    <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        {t.vacant_units || "Vacant Units"}
                    </h3>
                    <div className="space-y-4">
                        {vacantUnits.length === 0 ? (
                            <p className="text-muted-foreground text-sm italic py-4 text-center">No vacant units.</p>
                        ) : (
                            vacantUnits.map((unit) => (
                                <div key={unit.id} className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100/50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-sm">{unit.name}</p>
                                        <p className="text-xs text-muted-foreground">{unit.propertyName}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-red-600 border border-red-100">
                                        {t.vacant || "Vacant"}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

