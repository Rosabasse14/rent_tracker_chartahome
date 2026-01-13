
import { useParams, Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Building, MapPin, ArrowLeft, ArrowRight, Home, Users, Search, Filter } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/input";

export default function PropertyDetail() {
    const { propertyId } = useParams();
    const { properties, units, managers } = useData();

    const prop = properties.find(p => p.id === propertyId);

    if (!prop) {
        return (
            <PageLayout>
                <div className="p-12 text-center bg-card rounded-[2rem] border">
                    <p className="text-muted-foreground font-bold">Property not found</p>
                    <Link to="/" className="text-primary mt-4 inline-block font-bold">Back to Dashboard</Link>
                </div>
            </PageLayout>
        );
    }

    const manager = managers.find(m => m.id === prop.managerId);
    const propertyUnits = units.filter(u => u.propertyId === prop.id);

    return (
        <PageLayout>
            <div className="mb-8">
                <Link to={manager ? `/super-admin/managers/${manager.id}` : "/"} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to {manager?.name || "Governance"}
                </Link>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-primary flex items-center justify-center text-white shadow-lg">
                            <Building className="w-10 h-10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-black tracking-tighter text-slate-900">{prop.name}</h1>
                                <span className="p-1 px-3 bg-muted text-muted-foreground text-[10px] font-black rounded-full uppercase border">
                                    {prop.type}
                                </span>
                            </div>
                            <p className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                <MapPin className="w-4 h-4" /> {prop.address}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2rem] border p-6 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Management</h3>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">
                                {manager?.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Manager</p>
                                <p className="text-sm font-bold text-slate-900">{manager?.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border p-6 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Unit Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-600">Total Units</span>
                                <span className="font-black text-slate-900">{propertyUnits.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-600">Occupied</span>
                                <span className="font-black text-emerald-600">{propertyUnits.filter(u => u.status === 'occupied').length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-600">Vacant</span>
                                <span className="font-black text-amber-600">{propertyUnits.filter(u => u.status === 'vacant').length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Units List */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black tracking-tight text-slate-900">Inside {prop.name}</h2>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input className="pl-10 h-10 w-48 rounded-xl bg-white border-border/50 text-xs font-bold" placeholder="Search Units..." />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-[2.5rem] border shadow-sm overflow-hidden p-2">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                                <tr>
                                    <th className="px-6 py-5">Unit Info</th>
                                    <th className="px-6 py-5">Monthly Rent</th>
                                    <th className="px-6 py-5">Current Status</th>
                                    <th className="px-6 py-5">Primary Tenant</th>
                                    <th className="px-6 py-5 text-right pr-8">Audit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {propertyUnits.map((unit) => (
                                    <tr key={unit.id} className="hover:bg-muted/30 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <Home className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-900 block">{unit.name}</span>
                                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{unit.type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-black text-primary">{unit.monthlyRent.toLocaleString()}</span>
                                            <span className="text-[10px] text-muted-foreground ml-1">FCFA</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={unit.status} />
                                        </td>
                                        <td className="px-6 py-5">
                                            {unit.status === 'occupied' ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-700">
                                                        {unit.tenantName?.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">{unit.tenantName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-medium text-muted-foreground italic">None (Vacant)</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right pr-8">
                                            <Link to={`/super-admin/units/${unit.id}`} className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/5 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-primary/10">
                                                Inspect
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
