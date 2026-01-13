
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tenant } from "@/types";
import { Plus, Users, Mail, Phone, Home, MoreVertical, Calendar, Clock } from "lucide-react";
import { useData } from "@/context/DataContext";
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

  const handleAddTenant = () => {
    if (newTenant.name && newTenant.phone && newTenant.entryDate) {
      const unit = units.find((u) => u.id === newTenant.unitId);
      const tenant: Tenant = {
        id: Date.now().toString(),
        name: newTenant.name,
        email: newTenant.email || "",
        phone: newTenant.phone,
        nationalId: newTenant.nationalId,
        unitId: newTenant.unitId,
        unitName: unit?.name || "",
        propertyName: unit?.propertyName || "",
        status: "active",
        entryDate: newTenant.entryDate,
        rentDueDay: parseInt(newTenant.rentDueDay),
      };
      addTenant(tenant);
      setNewTenant({ name: "", email: "", phone: "", unitId: "", nationalId: "", entryDate: "", rentDueDay: "5" });
      setIsDialogOpen(false);
    }
  };

  // Filter only vacant units
  const vacantUnits = units.filter(u => u.status === 'vacant');

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">Tenants</h1>
          <p className="page-description">{tenants.length} tenants registered</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Onboard New Tenant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  placeholder="e.g., John Smith"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
                  <Input
                    id="phone"
                    value={newTenant.phone}
                    onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                    placeholder="+237..."
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
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
                <Label htmlFor="nationalId">National ID (Optional)</Label>
                <Input
                  id="nationalId"
                  value={newTenant.nationalId}
                  onChange={(e) => setNewTenant({ ...newTenant, nationalId: e.target.value })}
                  placeholder="ID Card Number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entryDate">Entry Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="entryDate"
                    type="date"
                    value={newTenant.entryDate}
                    onChange={(e) => setNewTenant({ ...newTenant, entryDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="rentDay">Rent Due Day</Label>
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
                <Label htmlFor="unit">Assign Unit (Vacant Only)</Label>
                <Select
                  value={newTenant.unitId}
                  onValueChange={(value) => setNewTenant({ ...newTenant, unitId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vacant unit (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Unit Assigned</SelectItem>
                    {vacantUnits.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center italic">No vacant units available</div>
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
                  If no unit is assigned, the tenant will see a blocking screen on login.
                </p>
              </div>

              <Button
                onClick={handleAddTenant}
                className="w-full h-12 text-base font-bold"
                disabled={!newTenant.name || !newTenant.phone || !newTenant.entryDate}
              >
                Onboard Tenant
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="tenant-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{tenant.name}</h3>
                  <StatusBadge status={tenant.status} />
                  {!tenant.unitId && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter border border-amber-200">
                      Unassigned
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    {tenant.unitId ? (
                      <>
                        <span className="text-primary font-medium">{tenant.unitName}</span>
                        <span className="text-xs">• {tenant.propertyName}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground/60 italic">No Unit Assigned</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                  {tenant.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{tenant.email}</span>
                    </div>
                  )}
                  {tenant.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{tenant.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm pl-16 md:pl-0">
              <div className="flex flex-col items-start md:items-end">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Entry
                </span>
                <span className="font-medium">{tenant.entryDate}</span>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Due Day
                </span>
                <span className="font-medium text-emerald-600">{tenant.rentDueDay}th</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Rent Ledger</DropdownMenuItem>
                  {tenant.status === 'active' && tenant.unitId && (
                    <DropdownMenuItem
                      className="text-amber-600 font-bold"
                      onClick={() => vacateUnit(tenant.id)}
                    >
                      Vacate Unit
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => deleteTenant(tenant.id)}
                  >
                    Delete
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
