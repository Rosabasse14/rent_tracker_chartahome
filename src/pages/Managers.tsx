
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Users, Phone, Mail, Building, Plus, MoreHorizontal, CheckCircle2, XCircle, MapPin, ArrowRight, Trash2, Edit } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";
import { Manager } from "@/types";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Managers() {
    const { language } = useAuth();
    const t = translations[language];
    const { managers, properties, units, addManager, deleteManager, updateManager } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newManager, setNewManager] = useState({ name: '', phone: '', email: '', city: language === 'fr' ? 'Douala' : 'Lagos' });
    const [editingManager, setEditingManager] = useState<Manager | null>(null);
    const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

    const handleUpdateManager = async () => {
        if (!editingManager) return;
        if (!editingManager.name || !editingManager.phone || !editingManager.email) {
            toast.error(t.fill_all_fields);
            return;
        }
        await updateManager(editingManager.id, {
            name: editingManager.name,
            phone: editingManager.phone,
            email: editingManager.email,
            city: editingManager.city
        });
        setIsEditDialogOpen(false);
        setEditingManager(null);
    };

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
                            <DialogDescription>
                                Enter the manager's details below to create an account.
                            </DialogDescription>
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
                            <div className="absolute top-0 right-0 p-4 flex gap-2">
                                <div className={`p-1.5 rounded-full ${manager.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'} animate-pulse`} aria-label={manager.status === 'active' ? t.active : t.inactive}></div>
                            </div>

                            <div className="flex items-center gap-4 mb-6 pr-8">
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
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600 truncate">
                                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0" aria-label={t.email}>
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="truncate">{manager.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0" aria-label={t.phone}>
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    {manager.phone}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0" aria-label={t.properties_controlled}>
                                        <Building className="w-4 h-4" />
                                    </div>
                                    {managerProperties.length} {t.properties_controlled}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                <Button
                                    className="flex-1 min-w-[120px] h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                                    variant="outline"
                                    onClick={() => setSelectedManager(manager)}
                                    aria-label={t.system_profile}
                                >
                                    {t.system_profile}
                                </Button>
                                <Button
                                    className="h-12 w-12 rounded-2xl border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                                    variant="outline"
                                    onClick={() => {
                                        setEditingManager(manager);
                                        setIsEditDialogOpen(true);
                                    }}
                                    aria-label={t.edit}
                                >
                                    <Edit className="w-5 h-5" />
                                </Button>
                                <Button
                                    className="h-12 w-12 rounded-2xl border-red-100 text-red-600 hover:bg-red-50"
                                    variant="outline"
                                    onClick={() => {
                                        if (confirm(t.confirm_delete_manager)) {
                                            deleteManager(manager.id);
                                        }
                                    }}
                                    aria-label={t.delete}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                                <Link to={`/super-admin/managers/${manager.id}`} className="w-full sm:w-auto flex-1">
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

            {/* Simple Edit Manager Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="rounded-[2.5rem]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">{t.edit_manager}</DialogTitle>
                        <DialogDescription>
                            Update the manager's account details.
                        </DialogDescription>
                    </DialogHeader>
                    {editingManager && (
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t.full_legal_name}</Label>
                                <Input
                                    value={editingManager.name}
                                    onChange={e => setEditingManager({ ...editingManager, name: e.target.value })}
                                    className="h-12 rounded-xl focus:ring-primary"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t.momo_phone}</Label>
                                    <Input
                                        value={editingManager.phone}
                                        onChange={e => setEditingManager({ ...editingManager, phone: e.target.value })}
                                        className="h-12 rounded-xl focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t.city_hub}</Label>
                                    <Input
                                        value={editingManager.city}
                                        onChange={e => setEditingManager({ ...editingManager, city: e.target.value })}
                                        className="h-12 rounded-xl focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t.official_email}</Label>
                                <Input
                                    value={editingManager.email}
                                    onChange={e => setEditingManager({ ...editingManager, email: e.target.value })}
                                    type="email"
                                    className="h-12 rounded-xl focus:ring-primary"
                                />
                            </div>
                            <Button onClick={handleUpdateManager} className="w-full h-12 rounded-xl font-black uppercase tracking-widest mt-4">{t.save}</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Manager Details Dialog */}
            <Dialog open={!!selectedManager} onOpenChange={(open) => !open && setSelectedManager(null)}>
                <DialogContent className="max-w-2xl rounded-[3rem] p-8 w-[95vw] md:w-full max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tighter">{t.manager_dossier}</DialogTitle>
                        <DialogDescription>
                            Detailed view of the manager's profile and performance.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedManager && (
                        <div className="grid gap-8 py-4">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-indigo-100 shrink-0" aria-label={t.manager_initials}>
                                    {selectedManager.name.charAt(0)}
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-black text-slate-900">{selectedManager.name}</h2>
                                    <p className="text-muted-foreground font-bold flex items-center justify-center sm:justify-start gap-2">
                                        <MapPin className="w-4 h-4" aria-label={t.city} /> {selectedManager.city} {t.hub}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="p-6 rounded-[2rem] bg-muted/50 border border-border/50 text-center sm:text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t.authenticated_units}</p>
                                    <p className="text-3xl font-black mt-1 text-slate-900">
                                        {properties.filter(p => p.managerId === selectedManager.id).reduce((sum, p) => sum + p.units, 0)}
                                    </p>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 text-center sm:text-left">
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
                                    <div className="overflow-x-auto">
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
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}
