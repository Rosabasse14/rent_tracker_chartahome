
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Unit } from "@/types";
import { Plus, Home, Building2, DollarSign, User, Trash2 } from "lucide-react";
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

export default function Units() {
  const { units, properties, addUnit, deleteUnit } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({
    name: "",
    propertyId: "",
    monthlyRent: "",
    type: "Studio",
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
      };
      addUnit(unit);
      setNewUnit({ name: "", propertyId: "", monthlyRent: "", type: "Studio" });
      setIsDialogOpen(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">Units</h1>
          <p className="page-description">Manage rental units across your properties</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Unit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="unitName">Unit Name</Label>
                <Input
                  id="unitName"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                  placeholder="e.g., Apt A, Unit 101"
                />
              </div>
              <div>
                <Label htmlFor="property">Property</Label>
                <Select
                  value={newUnit.propertyId}
                  onValueChange={(value) => setNewUnit({ ...newUnit, propertyId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
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
                <Label htmlFor="rent">Monthly Rent (FCFA)</Label>
                <Input
                  id="rent"
                  type="number"
                  value={newUnit.monthlyRent}
                  onChange={(e) => setNewUnit({ ...newUnit, monthlyRent: e.target.value })}
                  placeholder="e.g., 150000"
                />
              </div>
              <div>
                <Label htmlFor="unitType">Unit Type</Label>
                <Select
                  value={newUnit.type}
                  onValueChange={(value) => setNewUnit({ ...newUnit, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Room">Room</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUnit} className="w-full">
                Add Unit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map((unit) => (
          <div key={unit.id} className="property-card">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <button
                onClick={() => deleteUnit(unit.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Delete unit"
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
              <span>Monthly Rent (FCFA) • <span className="font-bold uppercase tracking-tighter text-[10px]">{unit.type}</span></span>
            </div>
            <p className="text-2xl font-bold mb-3">{unit.monthlyRent.toLocaleString()}</p>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              {unit.status === "occupied" ? (
                <div>
                  <span className="text-primary font-medium">Occupied</span>
                  <p className="text-muted-foreground">{unit.tenantName}</p>
                </div>
              ) : (
                <span className="text-muted-foreground">Vacant</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
