
import { PageLayout } from "@/components/layout/PageLayout";
import { CreditCard, Calendar, Clock, CheckCircle2, Upload, Home, MapPin, Lock, Info, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { translations } from "@/utils/translations";

export function TenantDashboard() {
    const { user, language } = useAuth();
    const t = translations[language];
    const { tenants, units, paymentProofs } = useData();

    // Find the tenant entry for the current user
    const tenantInfo = tenants.find(t => t.email === user?.email);

    // Case 2: Tenant account inactive
    if (tenantInfo && tenantInfo.status === 'inactive') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full bg-card p-10 rounded-[2.5rem] border border-border shadow-2xl text-center">
                    <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-8">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-4">{t.tenancy_inactive_title}</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        {t.tenancy_inactive_desc}
                    </p>
                    <div className="p-4 bg-muted/50 rounded-2xl border border-border/50 text-sm text-muted-foreground italic">
                        "{t.tenancy_inactive_desc.split('.')[0]}."
                    </div>
                </div>
            </div>
        );
    }

    // Case 1: Tenant exists but no unit assigned
    if (!tenantInfo || !tenantInfo.unitId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full bg-card p-10 rounded-[2.5rem] border border-border shadow-2xl text-center">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-4">{t.account_linked_title}</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        {t.account_linked_desc}
                    </p>
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-sm text-primary font-medium flex items-center justify-center gap-2">
                        <Info className="w-4 h-4" />
                        <span>{t.manager_pending}</span>
                    </div>
                </div>
            </div>
        );
    }

    const unitInfo = units.find(u => u.id === tenantInfo.unitId);

    // Find my payments
    const myPayments = paymentProofs.filter(p => p.tenantName === tenantInfo.name);

    return (
        <PageLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{t.welcome_home}, {user?.name?.split(' ')[0]}!</h1>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-muted border text-sm">
                            <Home className="w-4 h-4" />
                            <span className="font-semibold">{tenantInfo.unitName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{tenantInfo.propertyName}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/payment-proofs" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-1 active:scale-95">
                        <Upload className="w-6 h-6" />
                        {t.submit_payment}
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="md:col-span-2 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <p className="text-slate-400 font-medium text-sm mb-1 uppercase tracking-widest">{t.current_balance}</p>
                                    <h2 className="text-5xl font-extrabold tracking-tighter">0 <span className="text-2xl font-normal text-slate-500 ml-1">FCFA</span></h2>
                                </div>
                                <div className="bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-xs font-bold border border-emerald-500/30 uppercase tracking-wider backdrop-blur-md">
                                    {t.good_standing}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-12">
                                <div>
                                    <p className="text-slate-400 text-xs mb-2 uppercase tracking-widest">{t.monthly_rent}</p>
                                    <p className="font-bold text-2xl">{(unitInfo?.monthlyRent || 0).toLocaleString()} <span className="text-sm font-normal text-slate-500">FCFA</span></p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs mb-2 uppercase tracking-widest">{t.next_due_date}</p>
                                    <p className="font-bold text-2xl flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        <span>{new Date(2026, 1, tenantInfo.rentDueDay).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-[2rem] p-8 border border-border/50 shadow-sm flex flex-col justify-center items-center text-center bg-gradient-to-b from-card to-muted/20">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 animate-in zoom-in duration-700">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{t.status}: {tenantInfo.status === 'active' ? t.active : t.inactive}</h3>
                    <p className="text-muted-foreground text-sm mt-2 max-w-[200px]">{t.all_caught_up}</p>

                    <div className="w-full mt-8 pt-8 border-t border-border/50">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t.member_since}</p>
                        <p className="text-sm font-semibold">{new Date(tenantInfo.entryDate || '').toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">{t.recent_submissions}</h2>
                    <Link to="/payment-proofs" className="text-sm font-bold text-primary hover:underline">{t.view_history}</Link>
                </div>

                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                    {myPayments.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <Clock className="w-12 h-12 mx-auto mb-4 opacity-10" />
                            <p>{t.no_records}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-8 py-5">{t.reference}</th>
                                        <th className="px-8 py-5">{t.period}</th>
                                        <th className="px-8 py-5 text-right">{t.amount}</th>
                                        <th className="px-8 py-5 text-center">{t.status}</th>
                                        <th className="px-8 py-5 text-right">{t.submitted}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {myPayments.slice(0, 5).map((payment) => (
                                        <tr key={payment.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-8 py-5 font-bold text-foreground">{payment.proofNumber}</td>
                                            <td className="px-8 py-5 text-muted-foreground font-medium">{payment.period}</td>
                                            <td className="px-8 py-5 text-right font-bold text-primary">{payment.amount.toLocaleString()} FCFA</td>
                                            <td className="px-8 py-5 text-center">
                                                <StatusBadge status={payment.status} />
                                            </td>
                                            <td className="px-8 py-5 text-right text-xs text-muted-foreground">{new Date(payment.submittedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
