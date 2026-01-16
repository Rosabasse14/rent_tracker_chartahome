
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Unit, Tenant } from "@/types";
import { Plus, Home, Building2, DollarSign, User, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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

export default function Units() {
  const { language } = useAuth();
  const t = translations[language];
  const { units, properties, tenants, addUnit, deleteUnit } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [newUnit, setNewUnit] = useState({
    name: "",
    propertyId: "",
    monthlyRent: "",
    type: "Studio",
    bedrooms: "",
    bathrooms: "",
    sizeSqm: "",
    floorNumber: "",
    depositAmount: "",
    maintenanceFee: "",
    description: "",
  });

  const handleAddUnit = () => {
    if (newUnit.name && newUnit.propertyId && newUnit.monthlyRent) {
      const property = properties.find((p) => p.id === newUnit.propertyId);
      const unit: Unit = {
        id: Date.now().toString(),
        name: newUnit.name,
        propertyId: newUnit.propertyId,
        propertyName: property?.name || "",
        monthlyRent: parseFloat(newUnit.monthlyRent),
        type: newUnit.type,
        status: "vacant",
        bedrooms: parseInt(newUnit.bedrooms) || 0,
        bathrooms: parseFloat(newUnit.bathrooms) || 0,
        sizeSqm: parseFloat(newUnit.sizeSqm) || 0,
        floorNumber: parseInt(newUnit.floorNumber) || 0,
        depositAmount: parseFloat(newUnit.depositAmount) || 0,
        maintenanceFee: parseFloat(newUnit.maintenanceFee) || 0,
        description: newUnit.description,
      };
      addUnit(unit);
      setNewUnit({
        name: "",
        propertyId: "",
        monthlyRent: "",
        type: "Studio",
        bedrooms: "",
        bathrooms: "",
        sizeSqm: "",
        floorNumber: "",
        depositAmount: "",
        maintenanceFee: "",
        description: "",
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">{t.units_title}</h1>
          <p className="page-description">{t.units_desc}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t.add_unit}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.new_unit}</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new unit.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="unitName">{t.unit_name}</Label>
                <Input
                  id="unitName"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                  placeholder={t.unit_name_placeholder}
                />
              </div>
              <div>
                <Label htmlFor="property">{t.property}</Label>
                <Select
                  value={newUnit.propertyId}
                  onValueChange={(value) => setNewUnit({ ...newUnit, propertyId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select_property} />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rent">{t.monthly_rent_label}</Label>
                <Input
                  id="rent"
                  type="number"
                  value={newUnit.monthlyRent}
                  onChange={(e) => setNewUnit({ ...newUnit, monthlyRent: e.target.value })}
                  placeholder={t.monthly_rent_placeholder}
                />
              </div>
              <div>
                <Label htmlFor="unitType">{t.unit_type}</Label>
                <Select
                  value={newUnit.type}
                  onValueChange={(value) => setNewUnit({ ...newUnit, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select_unit_type} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Room">{t.type_room}</SelectItem>
                    <SelectItem value="Studio">{t.type_studio_room}</SelectItem>
                    <SelectItem value="Apartment">{t.type_apartment_room}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">{t.unit_bedrooms}</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={newUnit.bedrooms}
                    onChange={(e) => setNewUnit({ ...newUnit, bedrooms: e.target.value })}
                    placeholder="e.g. 2"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">{t.unit_bathrooms}</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    value={newUnit.bathrooms}
                    onChange={(e) => setNewUnit({ ...newUnit, bathrooms: e.target.value })}
                    placeholder="e.g. 1.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">{t.unit_size}</Label>
                  <Input
                    id="size"
                    type="number"
                    value={newUnit.sizeSqm}
                    onChange={(e) => setNewUnit({ ...newUnit, sizeSqm: e.target.value })}
                    placeholder="e.g. 85"
                  />
                </div>
                <div>
                  <Label htmlFor="floor">{t.unit_floor}</Label>
                  <Input
                    id="floor"
                    type="number"
                    value={newUnit.floorNumber}
                    onChange={(e) => setNewUnit({ ...newUnit, floorNumber: e.target.value })}
                    placeholder="e.g. 2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deposit">{t.unit_deposit}</Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={newUnit.depositAmount}
                    onChange={(e) => setNewUnit({ ...newUnit, depositAmount: e.target.value })}
                    placeholder="e.g. 300000"
                  />
                </div>
                <div>
                  <Label htmlFor="maintenance">{t.unit_maintenance}</Label>
                  <Input
                    id="maintenance"
                    type="number"
                    value={newUnit.maintenanceFee}
                    onChange={(e) => setNewUnit({ ...newUnit, maintenanceFee: e.target.value })}
                    placeholder="e.g. 10000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="unit_description">{t.unit_description}</Label>
                <Input
                  id="unit_description"
                  value={newUnit.description}
                  onChange={(e) => setNewUnit({ ...newUnit, description: e.target.value })}
                  placeholder="e.g. Master bedroom with balcony"
                />
              </div>
              <Button onClick={handleAddUnit} className="w-full">
                {t.add_unit}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="property-card cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setSelectedUnit(unit)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteUnit(unit.id);
                }}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label={t.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-semibold text-lg mb-2">{unit.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Building2 className="w-4 h-4" />
              <span>{unit.propertyName}</span>
            </div>
            <div className="flex items-center gap-2 text-primary mb-3">
              <DollarSign className="w-4 h-4" />
              <span>{t.monthly_rent_label} • <span className="font-bold uppercase tracking-tighter text-[10px]">
                {unit.type === 'Room' ? t.type_room :
                  unit.type === 'Studio' ? t.type_studio_room :
                    unit.type === 'Apartment' ? t.type_apartment_room : unit.type}
              </span></span>
            </div>
            <p className="text-2xl font-bold mb-3">{unit.monthlyRent.toLocaleString()} <span className="text-xs font-medium text-muted-foreground">FCFA</span></p>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              {unit.status === "occupied" ? (
                <div>
                  <span className="text-primary font-medium">{t.occupied}</span>
                  <p className="text-muted-foreground">{unit.tenantName}</p>
                </div>
              ) : (
                <span className="text-muted-foreground">{t.vacant}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Unit Details Dialog */}
      <Dialog open={!!selectedUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
        <DialogContent className="max-w-md rounded-[2.5rem]">
          {selectedUnit && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-black">{selectedUnit.name}</DialogTitle>
                <DialogDescription>{selectedUnit.propertyName}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/30 p-4 border">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{t.monthly_rent_label}</p>
                    <p className="text-lg font-bold text-primary">{selectedUnit.monthlyRent ? selectedUnit.monthlyRent.toLocaleString() : 0} <span className="text-xs">FCFA</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{t.unit_type}</p>
                    <p className="font-medium">{selectedUnit.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{t.unit_bedrooms}</p>
                    <p className="font-medium">{selectedUnit.bedrooms || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{t.unit_bathrooms}</p>
                    <p className="font-medium">{selectedUnit.bathrooms || '-'}</p>
                  </div>
                </div>

                {selectedUnit.status === 'occupied' ? (
                  <div
                    onClick={() => {
                      const tenant = tenants.find(t => t.unitId === selectedUnit.id);
                      if (tenant) setSelectedTenant(tenant);
                    }}
                    className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl cursor-pointer hover:bg-emerald-100 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-emerald-600 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                        {t.occupied_by}
                      </p>
                      <span className="w-6 h-6 rounded-full bg-emerald-200/50 flex items-center justify-center">
                        <User className="w-3 h-3 text-emerald-700" />
                      </span>
                    </div>
                    <p className="text-lg font-bold text-emerald-900">{selectedUnit.tenantName}</p>
                    <p className="text-xs text-emerald-600/80">Click to view tenant details</p>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
                    <p className="text-slate-500 font-medium">{t.vacant}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Tenant Details Dialog */}
      <Dialog open={!!selectedTenant} onOpenChange={(open) => !open && setSelectedTenant(null)}>
        <DialogContent className="max-w-md rounded-[2.5rem]">
          {selectedTenant && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-black">{t.tenant_details || "Tenant Details"}</DialogTitle>
                <DialogDescription>{t.personal_info || "Tenant Information"}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-black text-primary border-4 border-white shadow-lg">
                    {selectedTenant.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedTenant.name}</h3>
                    <a href={`mailto:${selectedTenant.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors block">{selectedTenant.email}</a>
                    <a href={`tid:${selectedTenant.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors block">{selectedTenant.phone}</a>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="p-3 rounded-xl bg-muted/30 border flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">{t.onboarding_status}</span>
                    <span className="text-xs font-bold uppercase bg-white border px-2 py-1 rounded-md shadow-sm">{selectedTenant.status}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">{t.rent_due_day}</span>
                    <span className="text-sm font-bold">{selectedTenant.rentDueDay}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">{t.lease_start}</span>
                    <span className="text-sm font-bold">{selectedTenant.entryDate}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </PageLayout>
  );
}
