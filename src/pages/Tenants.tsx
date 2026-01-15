
import { useState } from "react";
import { toast } from "sonner";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tenant } from "@/types";
import { Plus, Users, Mail, Phone, Home, MoreVertical, Calendar, Clock } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Tenants() {
  const { language } = useAuth();
  const t = translations[language];
  const { tenants, units, addTenant, deleteTenant, vacateUnit } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: "",
    email: "",
    phone: "",
    unitId: "",
    nationalId: "",
    entryDate: "",
    rentDueDay: "5",
  });

  const handleAddTenant = async () => {
    if (!newTenant.name || !newTenant.phone || !newTenant.entryDate) {
      toast.error(t.fill_all_fields);
      return;
    }

    let tenantId;
    try {
      tenantId = crypto.randomUUID();
    } catch (e) {
      tenantId = '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0');
    }

    const unit = units.find((u) => u.id === newTenant.unitId);
    const tenant: Tenant = {
      id: tenantId,
      name: newTenant.name,
      email: newTenant.email,
      phone: newTenant.phone,
      nationalId: newTenant.nationalId,
      unitId: newTenant.unitId,
      unitName: unit?.name || "",
      propertyName: unit?.propertyName || "",
      status: "active",
      entryDate: newTenant.entryDate,
      rentDueDay: parseInt(newTenant.rentDueDay),
    };

    const success = await addTenant(tenant);
    if (success) {
      setNewTenant({ name: "", email: "", phone: "", unitId: "", nationalId: "", entryDate: "", rentDueDay: "5" });
      setIsDialogOpen(false);
      toast.success(t.tenant_onboarded_success);
    }
  };

  // Filter only vacant units
  const vacantUnits = units.filter(u => u.status === 'vacant');

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">{t.tenants_title}</h1>
          <p className="page-description">{tenants.length} {t.tenants_registered}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button aria-label={t.add_tenant}>
              <Plus className="w-4 h-4 mr-2" />
              {t.add_tenant}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.onboard_new_tenant}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name">{t.full_name} <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  placeholder={t.full_name_placeholder}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">{t.phone} <span className="text-red-500">*</span></Label>
                  <Input
                    id="phone"
                    value={newTenant.phone}
                    onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                    placeholder="+237..."
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t.email_optional}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newTenant.email}
                    onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nationalId">{t.national_id_optional}</Label>
                <Input
                  id="nationalId"
                  value={newTenant.nationalId}
                  onChange={(e) => setNewTenant({ ...newTenant, nationalId: e.target.value })}
                  placeholder={t.id_card_number}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entryDate">{t.entry_date} <span className="text-red-500">*</span></Label>
                  <Input
                    id="entryDate"
                    type="date"
                    value={newTenant.entryDate}
                    onChange={(e) => setNewTenant({ ...newTenant, entryDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="rentDay">{t.rent_due_day}</Label>
                  <Input
                    id="rentDay"
                    type="number"
                    min="1"
                    max="31"
                    value={newTenant.rentDueDay}
                    onChange={(e) => setNewTenant({ ...newTenant, rentDueDay: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="unit">{t.assign_unit}</Label>
                <Select
                  value={newTenant.unitId}
                  onValueChange={(value) => setNewTenant({ ...newTenant, unitId: value })}
                >
                  <SelectTrigger aria-label={t.select_vacant_unit}>
                    <SelectValue placeholder={t.select_vacant_unit} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t.no_unit_assigned}</SelectItem>
                    {vacantUnits.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center italic">{t.no_vacant_units}</div>
                    ) : (
                      vacantUnits.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name} - {unit.propertyName} ({unit.monthlyRent.toLocaleString()} FCFA)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground mt-1 px-1">
                  {t.tenancy_blocked_hint}
                </p>
              </div>

              <Button
                onClick={handleAddTenant}
                className="w-full h-12 text-base font-bold"
                disabled={!newTenant.name || !newTenant.phone || !newTenant.entryDate}
                aria-label={t.onboard_tenant_btn}
              >
                {t.onboard_tenant_btn}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="tenant-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center" aria-label={t.tenant_icon}>
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{tenant.name}</h3>
                  <StatusBadge status={tenant.status} />
                  {!tenant.unitId && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter border border-amber-200">
                      {t.unassigned}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" aria-label={t.unit_icon} />
                    {tenant.unitId ? (
                      <>
                        <span className="text-primary font-medium">{tenant.unitName}</span>
                        <span className="text-xs">• {tenant.propertyName}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground/60 italic">{t.no_unit_assigned}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                  {tenant.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" aria-label={t.email_icon} />
                      <span>{tenant.email}</span>
                    </div>
                  )}
                  {tenant.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" aria-label={t.phone_icon} />
                      <span>{tenant.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm pl-16 md:pl-0">
              <div className="flex flex-col items-start md:items-end">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" aria-label={t.entry_date_icon} /> {t.entry}
                </span>
                <span className="font-medium">{tenant.entryDate}</span>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-label={t.rent_due_day_icon} /> {t.due_day}
                </span>
                <span className="font-medium text-emerald-600">{tenant.rentDueDay}{language === 'fr' ? (tenant.rentDueDay === 1 ? 'er' : 'e') : (tenant.rentDueDay === 1 ? 'st' : tenant.rentDueDay === 2 ? 'nd' : tenant.rentDueDay === 3 ? 'rd' : 'th')}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label={t.more_options}>
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem aria-label={t.view_profile}>{t.view_profile}</DropdownMenuItem>
                  <DropdownMenuItem aria-label={t.rent_ledger_item}>{t.rent_ledger_item}</DropdownMenuItem>
                  {tenant.status === 'active' && tenant.unitId && (
                    <DropdownMenuItem
                      className="text-amber-600 font-bold"
                      onClick={() => vacateUnit(tenant.id)}
                      aria-label={t.vacate_unit}
                    >
                      {t.vacate_unit}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => deleteTenant(tenant.id)}
                    aria-label={t.delete}
                  >
                    {t.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
