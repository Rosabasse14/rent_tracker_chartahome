
import { useParams, Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Home, User, DollarSign, Calendar, ArrowLeft, Building, UserCog, ShieldAlert, FileText, CheckCircle2, LayoutGrid, Phone, Mail, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function UnitDetail() {
    const { unitId } = useParams();
    const { units, properties, managers, tenants, paymentProofs } = useData();

    const unit = units.find(u => u.id === unitId);

    if (!unit) {
        return (
            <PageLayout>
                <div className="p-12 text-center bg-card rounded-[2rem] border">
                    <p className="text-muted-foreground font-bold">Unit not found</p>
                    <Link to="/" className="text-primary mt-4 inline-block font-bold">Back to Dashboard</Link>
                </div>
            </PageLayout>
        );
    }

    const prop = properties.find(p => p.id === unit.propertyId);
    const manager = managers.find(m => m.id === prop?.managerId);
    const tenant = tenants.find(t => t.unitId === unit.id && t.status === 'active');

    // Rent Status Logic (Current Month)
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const proofsForMonth = paymentProofs.filter(p => p.unitName === unit.name && p.period === currentMonth && p.status === 'paid');
    const amountPaid = proofsForMonth.reduce((sum, p) => sum + p.amount, 0);

    let rentStatus: 'paid' | 'partial' | 'unpaid' = 'unpaid';
    if (amountPaid >= unit.monthlyRent) rentStatus = 'paid';
    else if (amountPaid > 0) rentStatus = 'partial';

    return (
        <PageLayout>
            <div className="mb-8">
                <Link to={prop ? `/super-admin/properties/${prop.id}` : "/"} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to {prop?.name || "Property"}
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                            <Home className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-slate-900">{unit.name}</h1>
                            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                                <Building className="w-4 h-4" /> {prop?.name} • Room {unit.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-3 rounded-2xl border shadow-sm">
                            <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Rent Amount</p>
                            <p className="text-xl font-black text-primary">{unit.monthlyRent.toLocaleString()} <span className="text-[10px] font-bold opacity-60">FCFA</span></p>
                        </div>
                        <div className="bg-white px-6 py-3 rounded-2xl border shadow-sm flex flex-col justify-center">
                            <StatusBadge status={unit.status} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Information Audit Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Unit & Property Architecture */}
                    <div className="bg-white rounded-[2.5rem] border p-8 shadow-sm">
                        <h3 className="text-lg font-black tracking-tight text-slate-900 mb-6 flex items-center gap-2">
                            <LayoutGrid className="w-5 h-5 text-indigo-600" />
                            Hierarchical Verification
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Property Entity</p>
                                <p className="font-bold text-slate-800">{prop?.name}</p>
                                <p className="text-xs text-muted-foreground">{prop?.address}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Legal Manager</p>
                                <p className="font-bold text-slate-800">{manager?.name}</p>
                                <p className="text-xs text-muted-foreground">{manager?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tenant Dossier (Level 4) */}
                    <div className="bg-white rounded-[2.5rem] border p-8 shadow-sm relative overflow-hidden">
                        {unit.status === 'vacant' && (
                            <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-8">
                                <ShieldAlert className="w-12 h-12 text-slate-300 mb-4" />
                                <p className="text-xl font-black text-slate-400">UNIT CURRENTLY VACANT</p>
                                <p className="text-sm font-medium text-slate-400 mt-2">No active tenant dossier available for audit</p>
                            </div>
                        )}

                        <h3 className="text-lg font-black tracking-tight text-slate-900 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-600" />
                            Tenant Profile
                        </h3>

                        {tenant && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-black">
                                            {tenant.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-xl text-slate-900">{tenant.name}</p>
                                            <p className="text-sm font-medium text-emerald-600">Active Lease</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                            <Phone className="w-4 h-4 opacity-40" /> {tenant.phone}
                                        </p>
                                        <p className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                            <Mail className="w-4 h-4 opacity-40" /> {tenant.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Entry Date</p>
                                        <p className="text-sm font-bold text-slate-800">{tenant.entryDate}</p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Due Day</p>
                                        <p className="text-sm font-bold text-slate-800">{tenant.rentDueDay}th of month</p>
                                    </div>
                                    <div className="col-span-2 bg-muted/30 p-4 rounded-2xl border border-border/50">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">National ID</p>
                                        <p className="text-sm font-bold text-slate-800">{tenant.nationalId || 'Not Provided'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Financial Audit Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Current Month Audit
                        </h4>

                        <div className="space-y-8">
                            <div>
                                <p className="text-xs font-bold text-slate-500 mb-1">Billing Period</p>
                                <p className="text-xl font-black">{currentMonth}</p>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 mb-1">Amount Paid</p>
                                    <p className="text-3xl font-black">{amountPaid.toLocaleString()} <span className="text-xs font-medium opacity-40">FCFA</span></p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${rentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    rentStatus === 'partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                    }`}>
                                    {rentStatus}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800">
                                {rentStatus === 'unpaid' ? (
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
                                        <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-rose-200">Alert: No Payment Found</p>
                                            <p className="text-[10px] text-rose-300 font-medium mt-1 leading-relaxed">No verified transactions recorded for this unit in the audit period.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-emerald-200">Verified Payment</p>
                                            <p className="text-[10px] text-emerald-300 font-medium mt-1 leading-relaxed">Manager has verified receipt of funds. Documentation available.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-border shadow-sm">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Payment Proof Documentation</h4>
                        <div className="space-y-3">
                            {proofsForMonth.length > 0 ? proofsForMonth.map(proof => (
                                <div key={proof.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 group">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-indigo-500" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{proof.proofNumber}</p>
                                            <p className="text-[10px] text-muted-foreground">{proof.submittedAt}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 bg-white rounded-lg border border-border opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                        <ArrowRight className="w-3 h-3 text-primary" />
                                    </button>
                                </div>
                            )) : (
                                <p className="text-xs text-muted-foreground italic text-center py-4">No documents found for this period</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

