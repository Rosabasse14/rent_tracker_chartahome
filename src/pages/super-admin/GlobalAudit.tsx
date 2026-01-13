
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useData } from "@/context/DataContext";
import { Search, Filter, Home, User, Building, MapPin, DollarSign, ArrowRight, ShieldAlert, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useSearchParams } from "react-router-dom";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";

export default function GlobalAudit() {
    const { units, properties, tenants, managers, paymentProofs } = useData();
    const { language } = useAuth();
    const t = translations[language];
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [cityFilter, setCityFilter] = useState("all");
    const [managerFilter, setManagerFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || "all");

    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    // Helper to get rent status for a unit
    const getRentStatus = (unitId: string, monthlyRent: number, unitName: string) => {
        const proofs = paymentProofs.filter(p => p.unitName === unitName && p.period === currentMonth && p.status === 'paid');
        const paid = proofs.reduce((sum, p) => sum + p.amount, 0);
        if (paid >= monthlyRent) return 'paid';
        if (paid > 0) return 'partial';
        return 'unpaid';
    };

    const filteredData = units.map(unit => {
        const prop = properties.find(p => p.id === unit.propertyId);
        const manager = managers.find(m => m.id === prop?.managerId);
        const tenant = tenants.find(t => t.unitId === unit.id && t.status === 'active');
        const rentStatus = getRentStatus(unit.id, unit.monthlyRent, unit.name);

        return { ...unit, prop, manager, tenant, rentStatus };
    }).filter(item => {
        const matchesSearch =
            (item.tenant?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.tenant?.phone || "").includes(searchTerm) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.prop?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCity = cityFilter === "all" || item.manager?.city === cityFilter;
        const matchesManager = managerFilter === "all" || item.manager?.id === managerFilter;
        const matchesStatus = statusFilter === "all" || item.rentStatus === statusFilter;

        return matchesSearch && matchesCity && matchesManager && matchesStatus;
    });

    const uniqueCities = Array.from(new Set(managers.map(m => m.city)));

    return (
        <PageLayout>
            <div className="page-header">
                <h1 className="text-3xl font-black tracking-tighter mb-2">{t.audit_hub_title}</h1>
                <p className="text-muted-foreground">{t.audit_hub_desc}</p>
            </div>

            {/* Filters Row */}
            <div className="bg-white p-6 rounded-[2.5rem] border shadow-sm mb-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1 md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            className="pl-10 h-12 rounded-2xl bg-muted/30 border-none font-bold"
                            placeholder={t.search_placeholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={managerFilter} onValueChange={setManagerFilter}>
                        <SelectTrigger className="h-12 rounded-2xl border-none bg-muted/30 font-bold">
                            <SelectValue placeholder={t.all_managers} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t.all_managers}</SelectItem>
                            {managers.map(m => (
                                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                        <SelectTrigger className="h-12 rounded-2xl border-none bg-muted/30 font-bold">
                            <SelectValue placeholder={t.all_cities} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t.all_cities}</SelectItem>
                            {uniqueCities.map(city => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                    {['all', 'paid', 'partial', 'unpaid'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${statusFilter === status
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                : 'bg-white text-muted-foreground border-border hover:border-primary/30'
                                }`}
                        >
                            {status === 'all' ? t.show_all : `${t[status as keyof typeof t]} ${t.only}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Audit Results */}
            <div className="grid grid-cols-1 gap-4">
                {filteredData.length === 0 ? (
                    <div className="p-20 text-center bg-card rounded-[2.5rem] border border-dashed text-muted-foreground">
                        <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold uppercase tracking-widest text-xs">{t.no_matching_units}</p>
                    </div>
                ) : (
                    filteredData.map((item) => (
                        <div key={item.id} className="bg-card rounded-[2.5rem] border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-primary/5 transition-all group border-l-4 border-l-transparent hover:border-l-primary">
                            <div className="flex items-center gap-6 flex-1 min-w-0">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${item.rentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    item.rentStatus === 'partial' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        'bg-rose-50 text-rose-600 border-rose-100'
                                    }`}>
                                    <Home className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-black tracking-tight text-slate-900 truncate">{item.name}</h3>
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${item.rentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                            item.rentStatus === 'partial' ? 'bg-amber-100 text-amber-700' :
                                                'bg-rose-100 text-rose-700'
                                            }`}>
                                            {t[item.rentStatus as keyof typeof t] || item.rentStatus}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2 truncate">
                                        <Building className="w-3 h-3" /> {item.prop?.name} • <MapPin className="w-3 h-3" /> {item.manager?.city}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 flex-1">
                                <div className="min-w-[140px]">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1 tracking-widest">{t.occupant}</p>
                                    {item.tenant ? (
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-primary" /> {item.tenant.name}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                                                <Phone className="w-2.5 h-2.5" /> {item.tenant.phone}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-medium text-muted-foreground italic">{t.unit_vacant}</p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1 tracking-widest">{t.monthly_rent}</p>
                                    <p className="text-lg font-black text-slate-900">{item.monthlyRent.toLocaleString()} <span className="text-[10px] font-medium opacity-40">FCFA</span></p>
                                </div>

                                <div className="hidden lg:block ml-auto text-right">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1 tracking-widest">{t.manager}</p>
                                    <p className="text-xs font-bold text-indigo-600">{item.manager?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link to={`/super-admin/units/${item.id}`} className="p-4 rounded-2xl bg-white border border-border/50 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </PageLayout>
    );
}
