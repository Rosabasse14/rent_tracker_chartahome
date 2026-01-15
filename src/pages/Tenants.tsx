
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
  const { tenants, units, addTenant, deleteTenant, updateTenant, vacateUnit } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [newTenant, setNewTenant] = useState({
    name: "",
    email: "",
    phone: "",
    unitId: "",
    nationalId: "",
    entryDate: "",
    leaseEnd: "",
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
      unitId: newTenant.unitId === "none" ? "" : newTenant.unitId,
      unitName: unit?.name || "",
      propertyName: unit?.propertyName || "",
      status: "active",
      entryDate: newTenant.entryDate,
      leaseEnd: newTenant.leaseEnd || undefined,
      rentDueDay: parseInt(newTenant.rentDueDay),
    };

    const success = await addTenant(tenant);
    if (success) {
      setNewTenant({ name: "", email: "", phone: "", unitId: "", nationalId: "", entryDate: "", leaseEnd: "", rentDueDay: "5" });
      setIsDialogOpen(false);
      toast.success(t.tenant_onboarded_success);
    }
  };

  const handleUpdateTenant = async () => {
    if (!editingTenant) return;
    if (!editingTenant.name || !editingTenant.phone || !editingTenant.entryDate) {
      toast.error(t.fill_all_fields);
      return;
    }

    const unit = units.find(u => u.id === editingTenant.unitId);
    const updates: Partial<Tenant> = {
      name: editingTenant.name,
      email: editingTenant.email,
      phone: editingTenant.phone,
      nationalId: editingTenant.nationalId,
      unitId: editingTenant.unitId === "none" ? "" : editingTenant.unitId,
      unitName: unit?.name || "",
      propertyName: unit?.propertyName || "",
      entryDate: editingTenant.entryDate,
      leaseEnd: editingTenant.leaseEnd,
      status: editingTenant.status,
      rentDueDay: editingTenant.rentDueDay,
    };

    await updateTenant(editingTenant.id, updates);
    setIsEditDialogOpen(false);
    setEditingTenant(null);
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
            <Button aria-label={t.add_tenant} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              {t.add_tenant}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] md:max-w-lg rounded-[2rem] max-h-[90vh] overflow-y-auto">
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
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">{t.phone} <span className="text-red-500">*</span></Label>
                  <Input
                    id="phone"
                    value={newTenant.phone}
                    onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                    placeholder="+237..."
                    className="rounded-xl"
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
                    className="rounded-xl"
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
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entryDate">{t.entry_date} <span className="text-red-500">*</span></Label>
                  <Input
                    id="entryDate"
                    type="date"
                    value={newTenant.entryDate}
                    onChange={(e) => setNewTenant({ ...newTenant, entryDate: e.target.value })}
                    className="rounded-xl"
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
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="leaseEnd">{t.lease_end}</Label>
                <Input
                  id="leaseEnd"
                  type="date"
                  value={newTenant.leaseEnd}
                  onChange={(e) => setNewTenant({ ...newTenant, leaseEnd: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="unit">{t.assign_unit}</Label>
                <Select
                  value={newTenant.unitId}
                  onValueChange={(value) => setNewTenant({ ...newTenant, unitId: value })}
                >
                  <SelectTrigger aria-label={t.select_vacant_unit} className="rounded-xl">
                    <SelectValue placeholder={t.select_vacant_unit} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="none">{t.no_unit_assigned}</SelectItem>
                    {vacantUnits.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center italic">{t.no_vacant_units}</div>
                    ) : (
                      vacantUnits.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name} - {unit.propertyName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground mt-1 px-1 leading-tight">
                  {t.tenancy_blocked_hint}
                </p>
              </div>

              <Button
                onClick={handleAddTenant}
                className="w-full h-12 text-base font-bold rounded-xl"
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
          <div key={tenant.id} className="tenant-card flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0" aria-label={t.tenant_icon}>
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate max-w-[150px]">{tenant.name}</h3>
                  <StatusBadge status={tenant.status} />
                  {!tenant.unitId && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter border border-amber-200">
                      {t.unassigned}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 shrink-0" aria-label={t.unit_icon} />
                    {tenant.unitId ? (
                      <span className="truncate">
                        <span className="text-primary font-medium">{tenant.unitName}</span>
                        <span className="text-[10px] sm:text-xs ml-1">• {tenant.propertyName}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60 italic">{t.no_unit_assigned}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {tenant.email && (
                      <div className="flex items-center gap-1 truncate max-w-[150px] sm:max-w-none">
                        <Mail className="w-3 h-3 shrink-0" aria-label={t.email_icon} />
                        <span className="truncate">{tenant.email}</span>
                      </div>
                    )}
                    {tenant.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 shrink-0" aria-label={t.phone_icon} />
                        <span>{tenant.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-x-8 gap-y-2 text-sm pl-[60px] md:pl-0 w-full md:w-auto mt-2 md:mt-0">
              <div className="flex gap-8">
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 uppercase font-bold tracking-tight">
                    <Calendar className="w-3 h-3" aria-label={t.entry_date_icon} /> {t.entry}
                  </span>
                  <span className="font-medium whitespace-nowrap">{tenant.entryDate}</span>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 uppercase font-bold tracking-tight">
                    <Clock className="w-3 h-3" aria-label={t.rent_due_day_icon} /> {t.due_day}
                  </span>
                  <span className="font-medium text-emerald-600 whitespace-nowrap">
                    {tenant.rentDueDay}{language === 'fr' ? (tenant.rentDueDay === 1 ? 'er' : 'e') : (tenant.rentDueDay === 1 ? 'st' : tenant.rentDueDay === 2 ? 'nd' : tenant.rentDueDay === 3 ? 'rd' : 'th')}
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors ml-auto" aria-label={t.more_options}>
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={() => {
                    setEditingTenant(tenant);
                    setIsEditDialogOpen(true);
                  }} className="font-medium">
                    {t.edit}
                  </DropdownMenuItem>
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
                    className="text-destructive font-bold"
                    onClick={() => {
                      if (confirm(t.confirm_delete_tenant)) {
                        deleteTenant(tenant.id);
                      }
                    }}
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

      {/* Edit Tenant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] md:max-w-lg rounded-[2rem] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.edit_tenant}</DialogTitle>
          </DialogHeader>
          {editingTenant && (
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="edit-name">{t.full_name} <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-name"
                  value={editingTenant.name}
                  onChange={(e) => setEditingTenant({ ...editingTenant, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-phone">{t.phone} <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-phone"
                    value={editingTenant.phone}
                    onChange={(e) => setEditingTenant({ ...editingTenant, phone: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">{t.email_optional}</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingTenant.email || ""}
                    onChange={(e) => setEditingTenant({ ...editingTenant, email: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-nationalId">{t.national_id_optional}</Label>
                <Input
                  id="edit-nationalId"
                  value={editingTenant.nationalId || ""}
                  onChange={(e) => setEditingTenant({ ...editingTenant, nationalId: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-entryDate">{t.entry_date} <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-entryDate"
                    type="date"
                    value={editingTenant.entryDate}
                    onChange={(e) => setEditingTenant({ ...editingTenant, entryDate: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-rentDay">{t.rent_due_day}</Label>
                  <Input
                    id="edit-rentDay"
                    type="number"
                    min="1"
                    max="31"
                    value={editingTenant.rentDueDay}
                    onChange={(e) => setEditingTenant({ ...editingTenant, rentDueDay: parseInt(e.target.value) || 1 })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-leaseEnd">{t.lease_end}</Label>
                  <Input
                    id="edit-leaseEnd"
                    type="date"
                    value={editingTenant.leaseEnd || ""}
                    onChange={(e) => setEditingTenant({ ...editingTenant, leaseEnd: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">{t.status}</Label>
                  <Select
                    value={editingTenant.status}
                    onValueChange={(value: 'active' | 'inactive') => setEditingTenant({ ...editingTenant, status: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder={t.status} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="active">{t.active}</SelectItem>
                      <SelectItem value="inactive">{t.inactive}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-unit">{t.assign_unit}</Label>
                <Select
                  value={editingTenant.unitId || "none"}
                  onValueChange={(value) => setEditingTenant({ ...editingTenant, unitId: value })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={t.select_vacant_unit} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="none">{t.no_unit_assigned}</SelectItem>
                    {/* Include current unit plus other vacant units */}
                    {units.filter(u => u.status === 'vacant' || u.id === editingTenant.unitId).map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name} - {unit.propertyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleUpdateTenant}
                className="w-full h-12 text-base font-bold rounded-xl"
                aria-label={t.save}
              >
                {t.save}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog >
    </PageLayout >
  );
}
