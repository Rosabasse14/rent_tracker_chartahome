
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Property, Unit, Tenant } from "@/types";
import { Plus, Building2, MapPin, Trash2 } from "lucide-react";
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

export default function Properties() {
  const { language, user } = useAuth();
  const t = translations[language];
  const { properties, units, tenants, addProperty, deleteProperty } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    type: "Apartment Block",
    city: "",
    state: "",
    zipCode: "",
    description: "",
    imageUrl: "",
    amenities: ""
  });

  const handleAddProperty = () => {
    if (newProperty.name && newProperty.address && newProperty.type) {
      const amenitiesArray = newProperty.amenities.split(',').map(s => s.trim()).filter(Boolean);

      const property: Property = {
        id: "", // Let database generate this
        name: newProperty.name,
        address: newProperty.address,
        units: 0,
        type: newProperty.type,
        managerId: user?.id || "",
        city: newProperty.city,
        state: newProperty.state,
        zipCode: newProperty.zipCode,
        description: newProperty.description,
        imageUrl: newProperty.imageUrl,
        amenities: amenitiesArray.length > 0 ? amenitiesArray : undefined,
      };

      console.log("Property being sent from Properties.tsx:", property);
      addProperty(property);
      setNewProperty({
        name: "",
        address: "",
        type: "Apartment Block",
        city: "",
        state: "",
        zipCode: "",
        description: "",
        imageUrl: "",
        amenities: ""
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">{t.properties_title}</h1>
          <p className="page-description">{t.properties_desc}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t.add_property}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.new_property}</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new property.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name">{t.property_name}</Label>
                <Input
                  id="name"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  placeholder={t.property_name_placeholder}
                />
              </div>
              <div>
                <Label htmlFor="address">{t.property_location}</Label>
                <Input
                  id="address"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                  placeholder={t.property_location_placeholder}
                />
              </div>
              <div>
                <Label htmlFor="type">{t.property_type}</Label>
                <Select
                  value={newProperty.type}
                  onValueChange={(value) => setNewProperty({ ...newProperty, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.select_type} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment Block">{t.type_apartment}</SelectItem>
                    <SelectItem value="Compound">{t.type_compound}</SelectItem>
                    <SelectItem value="Studio Complex">{t.type_studio}</SelectItem>
                    <SelectItem value="Townhouse">{t.type_townhouse}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">{t.property_city}</Label>
                  <Input
                    id="city"
                    value={newProperty.city}
                    onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
                    placeholder="e.g. Douala"
                  />
                </div>
                <div>
                  <Label htmlFor="state">{t.property_state}</Label>
                  <Input
                    id="state"
                    value={newProperty.state}
                    onChange={(e) => setNewProperty({ ...newProperty, state: e.target.value })}
                    placeholder="e.g. Littoral"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">{t.property_zip}</Label>
                  <Input
                    id="zipCode"
                    value={newProperty.zipCode}
                    onChange={(e) => setNewProperty({ ...newProperty, zipCode: e.target.value })}
                    placeholder="e.g. 0000"
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">{t.property_image_url}</Label>
                  <Input
                    id="imageUrl"
                    value={newProperty.imageUrl}
                    onChange={(e) => setNewProperty({ ...newProperty, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">{t.property_description}</Label>
                <Input
                  id="description"
                  value={newProperty.description}
                  onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                  placeholder="e.g. Luxury villa with pool"
                />
              </div>
              <div>
                <Label htmlFor="amenities">{t.property_amenities}</Label>
                <Input
                  id="amenities"
                  value={newProperty.amenities}
                  onChange={(e) => setNewProperty({ ...newProperty, amenities: e.target.value })}
                  placeholder="Pool, Gym, Security"
                />
              </div>
              <Button onClick={handleAddProperty} className="w-full">
                {t.add_property}
              </Button>
            </div>
          </DialogContent >
        </Dialog >
      </div >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="property-card cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setSelectedProperty(property)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-muted-foreground border border-border">
                  {property.type === 'Apartment Block' ? t.type_apartment :
                    property.type === 'Compound' ? t.type_compound :
                      property.type === 'Studio Complex' ? t.type_studio :
                        property.type === 'Townhouse' ? t.type_townhouse :
                          property.type}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProperty(property.id);
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={t.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{property.address}</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.units}</p>
              <p className="text-2xl font-bold">{property.units}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Property Details Dialog */}
      <Dialog open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)}>
        <DialogContent className="max-w-2xl rounded-[2rem] max-h-[90vh] overflow-y-auto">
          {selectedProperty && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">{selectedProperty.name}</DialogTitle>
                <DialogDescription className="text-base">{selectedProperty.address}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {selectedProperty.imageUrl && (
                  <div className="rounded-xl overflow-hidden h-48 w-full">
                    <img src={selectedProperty.imageUrl} alt={selectedProperty.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.property_type}</p>
                    <p className="font-medium">{selectedProperty.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.property_city}</p>
                    <p className="font-medium">{selectedProperty.city}</p>
                  </div>
                  {selectedProperty.description && (
                    <div className="col-span-2 pt-2">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.property_description}</p>
                      <p className="text-muted-foreground">{selectedProperty.description}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    {t.units} <span className="text-muted-foreground text-sm font-normal">({selectedProperty.units})</span>
                  </h4>
                  <div className="grid gap-2">
                    {units.filter(u => u.propertyId === selectedProperty.id).map(unit => (
                      <div key={unit.id}
                        onClick={() => setSelectedUnit(unit)}
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-all border border-transparent hover:border-primary/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center font-bold text-xs text-muted-foreground shadow-sm">
                            {unit.name.substring(0, 3)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{unit.name}</p>
                            <p className="text-xs text-muted-foreground">{unit.type} • {unit.monthlyRent?.toLocaleString()} FCFA</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${unit.status === 'occupied' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                            {unit.status === 'occupied' ? t.occupied : t.vacant}
                          </span>
                          {unit.status === 'occupied' && <p className="text-[10px] text-muted-foreground mt-0.5">{unit.tenantName}</p>}
                        </div>
                      </div>
                    ))}
                    {units.filter(u => u.propertyId === selectedProperty.id).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                        <p>{t.no_units || "No units listed"}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
                        <MapPin className="w-3 h-3 text-emerald-700" />
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

    </PageLayout >
  );
}
