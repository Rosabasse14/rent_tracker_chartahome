
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
    LineChart,
    Line,
} from "recharts";
import { AlertCircle, Clock, TrendingUp, Wallet, Wrench } from "lucide-react";

export function InsightsCharts() {
    const { units, tenants, paymentProofs } = useData();
    const { language } = useAuth();
    const t = translations[language];

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
        // This is a naive match on the "period" string or submittedAt date
        // paymentProofs.period is "Month Year" (e.g., "January 2026")
        // Let's try to match loosely to the payment.period
        const total = paymentProofs
            .filter((p) => p.status === "paid" && (p.period.includes(month.split(" ")[0]) || p.submittedAt.includes(month.split(" ")[0]))) // Crude match
            .reduce((sum, p) => sum + p.amount, 0);
        return { name: month, revenue: total };
    });


    // --- 3. Lease Expirations (Next 60 Days) ---
    const today = new Date();
    const next60Days = new Date();
    next60Days.setDate(today.getDate() + 60);

    const expiringLeases = tenants
        .filter((tenant) => {
            if (!tenant.leaseEnd) return false;
            const leaseDate = new Date(tenant.leaseEnd);
            return leaseDate >= today && leaseDate <= next60Days;
        })
        .sort((a, b) => new Date(a.leaseEnd!).getTime() - new Date(b.leaseEnd!).getTime())
        .slice(0, 5);

    // --- 4. Vacancy Listing ---
    const vacantUnits = units.filter((u) => u.status === "vacant").slice(0, 5);

    // --- 5. Maintenance Requests (Mocked) ---
    // Since we don't have a real table, we'll mock this for visualization
    const maintenanceRequests = [
        { id: 1, unit: "Unit 101", issue: "Plumbing Leak", status: "urgent" },
        { id: 2, unit: "Unit 204", issue: "AC Repair", status: "pending" },
        { id: 3, unit: "Unit 305", issue: "Broken Window", status: "completed" },
    ];

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

            {/* Bottom Grid: Alerts & Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
