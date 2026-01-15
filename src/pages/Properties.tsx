
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Property } from "@/types";
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
  const { properties, addProperty, deleteProperty } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      const property: Property = {
        id: Date.now().toString(),
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
        amenities: newProperty.amenities.split(',').map(s => s.trim()).filter(Boolean),
      };
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
          <div key={property.id} className="property-card">
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
                  onClick={() => deleteProperty(property.id)}
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
    </PageLayout >
  );
}
