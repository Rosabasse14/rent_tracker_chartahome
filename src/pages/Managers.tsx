
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Phone, Mail, Building, Plus, MoreHorizontal, CheckCircle2, XCircle, MapPin, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";
import { Manager } from "@/types";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Managers() {
    const { language } = useAuth();
    const t = translations[language];
    const { managers, properties, units, addManager } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newManager, setNewManager] = useState({ name: '', phone: '', email: '', city: language === 'fr' ? 'Douala' : 'Lagos' });
    const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

    const handleAddManager = async () => {
        if (!newManager.name || !newManager.phone || !newManager.email) {
            toast.error(t.fill_all_fields);
            return;
        }

        // Generate a UUID or fallback to a unique string that looks like a UUID if possible
        // but for standard Supabase UUID columns, it MUST be a valid UUID.
        // If crypto.randomUUID is not available, try to generate a pseudo-UUID.
        let managerId;
        try {
            managerId = crypto.randomUUID();
        } catch (e) {
            managerId = '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0');
        }

        const manager: Manager = {
            id: managerId,
            ...newManager,
            status: 'active'
        };

        const success = await addManager(manager);
        if (success) {
            setNewManager({ name: '', phone: '', email: '', city: language === 'fr' ? 'Douala' : 'Lagos' });
            setIsDialogOpen(false);
            toast.success(t.manager_onboarded_success); // Success message
        }
    };

    return (
        <PageLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">{t.platform_managers}</h1>
                    <p className="text-muted-foreground font-medium">{t.managers_desc}</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 px-6 rounded-2xl shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-0.5" aria-label={t.onboard_manager_btn}>
                            <Plus className="w-5 h-5" />
                            <span className="font-bold">{t.onboard_manager_btn}</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2.5rem]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight">{t.onboard_manager}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t.full_legal_name}</Label>
                                <Input
                                    value={newManager.name}
                                    onChange={e => setNewManager({ ...newManager, name: e.target.value })}
                                    placeholder={t.name_placeholder_manager}
                                    className="h-12 rounded-xl focus:ring-primary"
                                    aria-label={t.full_legal_name}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t.momo_phone}</Label>
                                    <Input
                                        value={newManager.phone}
                                        onChange={e => setNewManager({ ...newManager, phone: e.target.value })}
                                        placeholder="+237 6..."
                                        className="h-12 rounded-xl focus:ring-primary"
                                        aria-label={t.momo_phone}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t.city_hub}</Label>
                                    <Input
                                        value={newManager.city}
                                        onChange={e => setNewManager({ ...newManager, city: e.target.value })}
                                        placeholder={t.city_placeholder}
                                        className="h-12 rounded-xl focus:ring-primary"
                                        aria-label={t.city_hub}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t.official_email}</Label>
                                <Input
                                    value={newManager.email}
                                    onChange={e => setNewManager({ ...newManager, email: e.target.value })}
                                    placeholder={t.email_placeholder_manager}
                                    type="email"
                                    className="h-12 rounded-xl focus:ring-primary"
                                    aria-label={t.official_email}
                                />
                            </div>
                            <Button onClick={handleAddManager} className="w-full h-12 rounded-xl font-black uppercase tracking-widest mt-4" aria-label={t.generate_account_btn}>{t.generate_account_btn}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {managers.map(manager => {
                    const managerProperties = properties.filter(p => p.managerId === manager.id);
                    return (
                        <div key={manager.id} className="bg-card rounded-[2.5rem] border p-6 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden bg-gradient-to-br from-card to-white">
                            <div className="absolute top-0 right-0 p-4">
                                <div className={`p-1.5 rounded-full ${manager.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'} animate-pulse`} aria-label={manager.status === 'active' ? t.active : t.inactive}></div>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-2xl shadow-sm" aria-label={t.manager_initials}>
                                    {manager.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-slate-900 leading-tight">{manager.name}</h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3" aria-label={t.city} /> {manager.city}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground" aria-label={t.email}>
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    {manager.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground" aria-label={t.phone}>
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    {manager.phone}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary" aria-label={t.properties_controlled}>
                                        <Building className="w-4 h-4" />
                                    </div>
                                    {managerProperties.length} {t.properties_controlled}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                                    variant="outline"
                                    onClick={() => setSelectedManager(manager)}
                                    aria-label={t.system_profile}
                                >
                                    {t.system_profile}
                                </Button>
                                <Link to={`/super-admin/managers/${manager.id}`} className="flex-1">
                                    <Button className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2" aria-label={t.drill_down}>
                                        {t.drill_down}
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Manager Details Dialog */}
            <Dialog open={!!selectedManager} onOpenChange={(open) => !open && setSelectedManager(null)}>
                <DialogContent className="max-w-2xl rounded-[3rem] p-8">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tighter">{t.manager_dossier}</DialogTitle>
                    </DialogHeader>
                    {selectedManager && (
                        <div className="grid gap-8 py-4">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-indigo-100" aria-label={t.manager_initials}>
                                    {selectedManager.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">{selectedManager.name}</h2>
                                    <p className="text-muted-foreground font-bold flex items-center gap-2">
                                        <MapPin className="w-4 h-4" aria-label={t.city} /> {selectedManager.city} {t.hub}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-6 rounded-[2rem] bg-muted/50 border border-border/50">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t.authenticated_units}</p>
                                    <p className="text-3xl font-black mt-1 text-slate-900">
                                        {properties.filter(p => p.managerId === selectedManager.id).reduce((sum, p) => sum + p.units, 0)}
                                    </p>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">{t.operational_status}</p>
                                    <p className="text-3xl font-black mt-1 text-emerald-700 uppercase tracking-tighter">
                                        {selectedManager.status === 'active' ? t.active : t.inactive}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-2">
                                    <Building className="w-4 h-4" aria-label={t.asset_breakdown} /> {t.asset_breakdown}
                                </h3>
                                <div className="bg-card border rounded-[2rem] overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50 text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                                            <tr>
                                                <th className="py-4 px-6 text-left">{t.property}</th>
                                                <th className="py-4 px-6 text-center">{t.units}</th>
                                                <th className="py-4 px-6 text-right pr-8">{t.audit}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/50">
                                            {properties.filter(p => p.managerId === selectedManager.id).map(prop => (
                                                <tr key={prop.id}>
                                                    <td className="py-4 px-6 font-bold text-slate-800">{prop.name}</td>
                                                    <td className="py-4 px-6 text-center font-black text-slate-700">{prop.units}</td>
                                                    <td className="py-4 px-6 text-right pr-8">
                                                        <Link to={`/super-admin/properties/${prop.id}`} className="text-primary font-black uppercase text-[10px] tracking-widest hover:underline" aria-label={`${t.view_stack} ${prop.name}`}>{t.view_stack}</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}
