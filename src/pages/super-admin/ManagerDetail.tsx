
import { useParams, Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Building, MapPin, Mail, Phone, ArrowLeft, ArrowRight, UserCog, Home } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function ManagerDetail() {
    const { managerId } = useParams();
    const { managers, properties, units } = useData();

    const manager = managers.find(m => m.id === managerId);

    if (!manager) {
        return (
            <PageLayout>
                <div className="p-12 text-center bg-card rounded-[2rem] border">
                    <p className="text-muted-foreground font-bold">Manager not found</p>
                    <Link to="/" className="text-primary mt-4 inline-block font-bold">Back to Dashboard</Link>
                </div>
            </PageLayout>
        );
    }

    const managerProperties = properties.filter(p => p.managerId === manager.id);

    return (
        <PageLayout>
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Governance
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-200">
                            {manager.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-black tracking-tighter text-slate-900">{manager.name}</h1>
                                <StatusBadge status={manager.status} />
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
                                <span className="flex items-center gap-2 font-bold text-slate-600">
                                    <MapPin className="w-4 h-4" /> {manager.city}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> {manager.email}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> {manager.phone}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 px-10 rounded-[2rem] border shadow-sm text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Portfolio Value</p>
                        <p className="text-2xl font-black text-slate-900">
                            {managerProperties.length} <span className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">Properties</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Managed Properties</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {managerProperties.map((prop) => {
                        const propUnits = units.filter(u => u.propertyId === prop.id);
                        const occupied = propUnits.filter(u => u.status === 'occupied').length;

                        return (
                            <Link
                                key={prop.id}
                                to={`/super-admin/properties/${prop.id}`}
                                className="group bg-card rounded-[2.5rem] border border-border/50 p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all hover:-translate-y-1 bg-gradient-to-br from-card to-white"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <Building className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{prop.name}</h3>
                                <p className="text-sm text-muted-foreground font-medium mb-6 flex items-center gap-2 truncate">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {prop.address}
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/50 p-4 rounded-2xl">
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground mb-1">Units</p>
                                        <p className="text-lg font-black text-slate-800">{propUnits.length}</p>
                                    </div>
                                    <div className="bg-emerald-50/50 p-4 rounded-2xl">
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-emerald-600 mb-1">Occupied</p>
                                        <p className="text-lg font-black text-emerald-700">{occupied}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </PageLayout>
    );
}
