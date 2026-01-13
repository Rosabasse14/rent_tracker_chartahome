
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Property } from "@/types";
import { Plus, Building2, MapPin, Trash2 } from "lucide-react";
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

export default function Properties() {
  const { properties, addProperty, deleteProperty } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({ name: "", address: "", type: "Apartment Block" });

  const handleAddProperty = () => {
    if (newProperty.name && newProperty.address && newProperty.type) {
      const property: Property = {
        id: Date.now().toString(),
        name: newProperty.name,
        address: newProperty.address,
        units: 0,
        type: newProperty.type,
        managerId: "1", // Mock manager ID
      };
      addProperty(property);
      setNewProperty({ name: "", address: "", type: "Apartment Block" });
      setIsDialogOpen(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">Properties</h1>
          <p className="page-description">Manage your rental properties</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  placeholder="e.g., Sunset Villa"
                />
              </div>
              <div>
                <Label htmlFor="address">Location (City / Quarter)</Label>
                <Input
                  id="address"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                  placeholder="e.g., Makepe, Douala"
                />
              </div>
              <div>
                <Label htmlFor="type">Property Type</Label>
                <Select
                  value={newProperty.type}
                  onValueChange={(value) => setNewProperty({ ...newProperty, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment Block">Apartment Block</SelectItem>
                    <SelectItem value="Compound">Compound</SelectItem>
                    <SelectItem value="Studio Complex">Studio Complex</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddProperty} className="w-full">
                Add Property
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div key={property.id} className="property-card">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-muted-foreground border border-border">
                  {property.type}
                </span>
                <button
                  onClick={() => deleteProperty(property.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Delete property"
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
              <p className="text-sm text-muted-foreground">Units</p>
              <p className="text-2xl font-bold">{property.units}</p>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
