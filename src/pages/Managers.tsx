
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Phone, Mail, Building, Plus, MoreHorizontal, CheckCircle2, XCircle, MapPin, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";
import { Manager } from "@/types";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Managers() {
    const { managers, properties, units, addManager } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newManager, setNewManager] = useState({ name: '', phone: '', email: '', city: 'Douala' });
    const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

    const handleAddManager = () => {
        if (newManager.name && newManager.phone && newManager.email) {
            const manager: Manager = {
                id: Date.now().toString(),
                ...newManager,
                status: 'active'
            };
            addManager(manager);
            setNewManager({ name: '', phone: '', email: '', city: 'Douala' });
            setIsDialogOpen(false);
            toast.success("Manager onboarded successfully!");
        } else {
            toast.error("Please fill in all required fields");
        }
    };

    return (
        <PageLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Platform Managers</h1>
                    <p className="text-muted-foreground font-medium">Verified administrators managing property portfolios</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 px-6 rounded-2xl shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-0.5">
                            <Plus className="w-5 h-5" />
                            <span className="font-bold">Onboard New Manager</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2.5rem]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight">Onboard Manager</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Legal Name</Label>
                                <Input
                                    value={newManager.name}
                                    onChange={e => setNewManager({ ...newManager, name: e.target.value })}
                                    placeholder="e.g. Jean-Pierre Makon"
                                    className="h-12 rounded-xl focus:ring-primary"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile Money Phone</Label>
                                    <Input
                                        value={newManager.phone}
                                        onChange={e => setNewManager({ ...newManager, phone: e.target.value })}
                                        placeholder="+237 6..."
                                        className="h-12 rounded-xl focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">City Hub</Label>
                                    <Input
                                        value={newManager.city}
                                        onChange={e => setNewManager({ ...newManager, city: e.target.value })}
                                        placeholder="Douala / Yaounde"
                                        className="h-12 rounded-xl focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Official Email</Label>
                                <Input
                                    value={newManager.email}
                                    onChange={e => setNewManager({ ...newManager, email: e.target.value })}
                                    placeholder="manager@chartahome.cm"
                                    type="email"
                                    className="h-12 rounded-xl focus:ring-primary"
                                />
                            </div>
                            <Button onClick={handleAddManager} className="w-full h-12 rounded-xl font-black uppercase tracking-widest mt-4">Generate Account</Button>
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
                                <div className={`p-1.5 rounded-full ${manager.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'} animate-pulse`}></div>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-2xl shadow-sm">
                                    {manager.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-slate-900 leading-tight">{manager.name}</h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3" /> {manager.city}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    {manager.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    {manager.phone}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                        <Building className="w-4 h-4" />
                                    </div>
                                    {managerProperties.length} Properties Controlled
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                                    variant="outline"
                                    onClick={() => setSelectedManager(manager)}
                                >
                                    System Profile
                                </Button>
                                <Link to={`/super-admin/managers/${manager.id}`} className="flex-1">
                                    <Button className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2">
                                        Drill Down
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
                        <DialogTitle className="text-3xl font-black tracking-tighter">Manager Dossier</DialogTitle>
                    </DialogHeader>
                    {selectedManager && (
                        <div className="grid gap-8 py-4">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-indigo-100">
                                    {selectedManager.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">{selectedManager.name}</h2>
                                    <p className="text-muted-foreground font-bold flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> {selectedManager.city} Hub
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-6 rounded-[2rem] bg-muted/50 border border-border/50">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Authenticated Units</p>
                                    <p className="text-3xl font-black mt-1 text-slate-900">
                                        {properties.filter(p => p.managerId === selectedManager.id).reduce((sum, p) => sum + p.units, 0)}
                                    </p>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Operational Status</p>
                                    <p className="text-3xl font-black mt-1 text-emerald-700 uppercase tracking-tighter">{selectedManager.status}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-2">
                                    <Building className="w-4 h-4" /> Asset Breakdown
                                </h3>
                                <div className="bg-card border rounded-[2rem] overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50 text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                                            <tr>
                                                <th className="py-4 px-6 text-left">Property</th>
                                                <th className="py-4 px-6 text-center">Units</th>
                                                <th className="py-4 px-6 text-right pr-8">Audit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/50">
                                            {properties.filter(p => p.managerId === selectedManager.id).map(prop => (
                                                <tr key={prop.id}>
                                                    <td className="py-4 px-6 font-bold text-slate-800">{prop.name}</td>
                                                    <td className="py-4 px-6 text-center font-black text-slate-700">{prop.units}</td>
                                                    <td className="py-4 px-6 text-right pr-8">
                                                        <Link to={`/super-admin/properties/${prop.id}`} className="text-primary font-black uppercase text-[10px] tracking-widest hover:underline">View Stack</Link>
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
