
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    Property,
    Unit,
    Tenant,
    RentLedgerEntry,
    PaymentProof,
    OverduePayment,
    Manager,
} from "@/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/* ---------------- TYPES ---------------- */
interface DataContextType {
    properties: Property[];
    units: Unit[];
    tenants: Tenant[];
    managers: Manager[];
    rentLedger: RentLedgerEntry[];
    paymentProofs: PaymentProof[];
    overduePayments: OverduePayment[];

    addProperty: (property: Property) => Promise<void>;
    updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
    deleteProperty: (id: string) => Promise<void>;

    addUnit: (unit: Unit) => Promise<void>;
    updateUnit: (id: string, updates: Partial<Unit>) => Promise<void>;
    deleteUnit: (id: string) => Promise<void>;

    addTenant: (tenant: Tenant) => Promise<boolean>;
    updateTenant: (id: string, updates: Partial<Tenant>) => Promise<void>;
    deleteTenant: (id: string) => Promise<void>;

    addManager: (manager: Manager) => Promise<boolean>;
    updateManager: (id: string, updates: Partial<Manager>) => Promise<void>;
    deleteManager: (id: string) => Promise<void>;

    vacateUnit: (tenantId: string) => Promise<void>;

    addPaymentProof: (proof: PaymentProof) => Promise<void>;
    verifyPayment: (paymentId: string, status: "paid" | "rejected") => Promise<void>;

    getUnpaidUnits: (currentMonth: string) => Unit[];
    refreshLedger: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/* ================= PROVIDER ================= */
export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [rentLedger] = useState<RentLedgerEntry[]>([]);
    const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
    const [overduePayments] = useState<OverduePayment[]>([]);

    /* ---------------- FETCH ALL DATA ---------------- */
    const fetchData = async () => {
        try {
            /* PROPERTIES */
            const { data: propData } = await supabase.from("properties").select("*");
            if (propData) {
                setProperties(
                    propData.map((p) => ({
                        id: p.id,
                        name: p.name,
                        address: p.address,
                        type: p.type || "Residential",
                        managerId: p.manager_id,
                        city: p.city,
                        state: p.state,
                        zipCode: p.zip_code,
                        description: p.description,
                        imageUrl: p.image_url,
                        amenities: p.amenities,
                        units: 0, // Calculated or stored
                    }))
                );
            }

            /* UNITS */
            const { data: unitData } = await supabase
                .from("units")
                .select("*, properties(name)");

            if (unitData) {
                setUnits(
                    unitData.map((u: any) => ({
                        id: u.id,
                        name: u.name,
                        monthlyRent: u.monthly_rent,
                        status: u.status,
                        propertyId: u.property_id,
                        propertyName: u.properties?.name || "Unknown",
                        type: u.type || "Standard",
                        bedrooms: u.bedrooms,
                        bathrooms: u.bathrooms,
                        sizeSqm: u.size_sqm,
                        floorNumber: u.floor_number,
                        depositAmount: u.deposit_amount,
                        maintenanceFee: u.maintenance_fee,
                        description: u.description,
                    }))
                );
            }

            /* TENANTS */
            const { data: tenantData } = await supabase
                .from("tenants")
                .select("*, units(name, properties(name))");

            if (tenantData) {
                setTenants(
                    tenantData.map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        email: t.email,
                        phone: t.phone,
                        unitId: t.unit_id,
                        unitName: t.units?.name || "Unassigned",
                        propertyName: t.units?.properties?.name || "Unassigned",
                        status: t.is_active ? "active" : "inactive",
                        entryDate: t.lease_start,
                        rentDueDay: t.rent_due_day || 5,
                    }))
                );
            }

            /* MANAGERS */
            const { data: managerData } = await supabase.from("managers").select("*");
            if (managerData) {
                setManagers(managerData.map(m => ({
                    id: m.id,
                    name: m.name,
                    email: m.email,
                    phone: m.phone || "",
                    city: m.city || "",
                    status: m.status as 'active' | 'inactive'
                })));
            }

            /* PAYMENTS */
            const { data: payData } = await supabase
                .from("payments")
                .select("*, tenants(name), units(name)");

            if (payData) {
                setPaymentProofs(
                    payData.map((p: any) => ({
                        id: p.id,
                        proofNumber: p.id.slice(0, 8),
                        amount: p.amount,
                        period: p.period,
                        status: p.status,
                        paymentMethod: p.payment_method,
                        notes: p.notes,
                        fileUrl: p.proof_url,
                        tenantId: p.tenant_id,
                        unitId: p.unit_id,
                        tenantName: p.tenants?.name || "Unknown",
                        unitName: p.units?.name || "Unknown",
                        submittedAt: new Date(p.submitted_at || p.created_at).toLocaleString(),
                    }))
                );
            }
        } catch (err) {
            console.error("Supabase fetch error:", err);
        }
    };

    /* ---------------- INIT ---------------- */
    useEffect(() => {
        fetchData();

        const channel = supabase
            .channel("db-realtime")
            .on("postgres_changes", { event: "*", schema: "public" }, fetchData)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    /* ---------------- CRUD ACTIONS ---------------- */
    const addProperty = async (property: Property) => {
        const payload: any = {
            name: property.name,
            address: property.address,
            type: property.type,
            manager_id: property.managerId,
            city: property.city,
            state: property.state,
            zip_code: property.zipCode,
            description: property.description,
            image_url: property.imageUrl,
            amenities: property.amenities,
        };
        if (property.id && !property.id.startsWith('temp-')) payload.id = property.id;

        const { error } = await supabase.from("properties").insert(payload);

        if (error) {
            console.error("Error adding property:", error);
            toast.error("Failed to add property: " + error.message);
        } else {
            toast.success("Property added");
            fetchData();
        }
    };

    const updateProperty = async (id: string, updates: Partial<Property>) => {
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.address) dbUpdates.address = updates.address;
        if (updates.type) dbUpdates.type = updates.type;
        if (updates.managerId) dbUpdates.manager_id = updates.managerId;
        if (updates.city) dbUpdates.city = updates.city;

        const { error } = await supabase.from("properties").update(dbUpdates).eq('id', id);
        if (error) toast.error("Update failed: " + error.message);
        else fetchData();
    };

    const deleteProperty = async (id: string) => {
        const { error } = await supabase.from("properties").delete().eq("id", id);
        if (error) toast.error("Delete failed");
        else fetchData();
    };

    const addUnit = async (unit: Unit) => {
        const { error } = await supabase.from("units").insert({
            id: unit.id && !unit.id.startsWith('temp-') ? unit.id : undefined,
            name: unit.name,
            property_id: unit.propertyId,
            monthly_rent: unit.monthlyRent,
            status: unit.status,
            type: unit.type,
            bedrooms: unit.bedrooms,
            bathrooms: unit.bathrooms,
            size_sqm: unit.sizeSqm,
            description: unit.description
        });
        if (error) toast.error("Failed to add unit");
        else fetchData();
    };

    const updateUnit = async (id: string, updates: Partial<Unit>) => {
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.monthlyRent) dbUpdates.monthly_rent = updates.monthlyRent;
        if (updates.status) dbUpdates.status = updates.status;

        const { error } = await supabase.from("units").update(dbUpdates).eq('id', id);
        if (error) toast.error("Update failed");
        else fetchData();
    };

    const deleteUnit = async (id: string) => {
        await supabase.from("units").delete().eq("id", id);
        fetchData();
    };

    const addTenant = async (tenant: Tenant) => {
        const { error } = await supabase.from("tenants").insert({
            id: tenant.id && !tenant.id.startsWith('temp-') ? tenant.id : undefined,
            name: tenant.name,
            email: tenant.email,
            phone: tenant.phone,
            unit_id: tenant.unitId || null,
            lease_start: tenant.entryDate,
            is_active: true,
            rent_due_day: tenant.rentDueDay,
        });

        if (error) {
            console.error("Error adding tenant:", error);
            toast.error(error.message);
            return false;
        }

        toast.success("Tenant added");
        fetchData();
        return true;
    };

    const updateTenant = async (id: string, updates: Partial<Tenant>) => {
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.email) dbUpdates.email = updates.email;
        if (updates.phone) dbUpdates.phone = updates.phone;
        if (updates.unitId !== undefined) dbUpdates.unit_id = updates.unitId;
        if (updates.status) dbUpdates.is_active = updates.status === "active";
        if (updates.rentDueDay) dbUpdates.rent_due_day = updates.rentDueDay;

        const { error } = await supabase.from("tenants").update(dbUpdates).eq("id", id);
        if (error) toast.error("Update failed");
        else fetchData();
    };

    const deleteTenant = async (id: string) => {
        await supabase.from("tenants").delete().eq("id", id);
        fetchData();
    };

    const addManager = async (manager: Manager) => {
        const { error } = await supabase.from("managers").insert({
            id: manager.id && !manager.id.startsWith('temp-') ? manager.id : undefined,
            name: manager.name,
            email: manager.email,
            phone: manager.phone,
            city: manager.city,
            status: "active",
        });

        if (error) {
            console.error("Error adding manager:", error);
            toast.error(error.message);
            return false;
        }

        toast.success("Manager added");
        fetchData();
        return true;
    };

    const updateManager = async (id: string, updates: Partial<Manager>) => {
        const dbUpdates: any = { ...updates };
        const { error } = await supabase.from("managers").update(dbUpdates).eq("id", id);
        if (error) toast.error("Update failed");
        else fetchData();
    };

    const deleteManager = async (id: string) => {
        await supabase.from("managers").delete().eq("id", id);
        fetchData();
    };

    const vacateUnit = async (tenantId: string) => {
        const tenant = tenants.find((t) => t.id === tenantId);
        if (!tenant) return;

        await supabase.from("tenants").update({
            is_active: false,
            unit_id: null,
        }).eq("id", tenantId);

        await supabase.from("units").update({
            status: "vacant",
        }).eq("id", tenant.unitId);

        fetchData();
    };

    const addPaymentProof = async (proof: PaymentProof) => {
        const { error } = await supabase.from("payments").insert({
            tenant_id: proof.tenantId,
            unit_id: proof.unitId,
            amount: proof.amount,
            period: proof.period,
            proof_url: proof.fileUrl,
            payment_method: proof.paymentMethod,
            notes: proof.notes,
            status: "pending",
        });
        if (error) toast.error("Failed to submit payment");
        else {
            toast.success("Payment submitted");
            fetchData();
        }
    };

    const verifyPayment = async (paymentId: string, status: "paid" | "rejected") => {
        const { error } = await supabase.from("payments").update({ status }).eq("id", paymentId);
        if (error) toast.error("Verification failed");
        else fetchData();
    };

    const getUnpaidUnits = (currentMonth: string) => {
        return units.filter((u) => {
            const paid = paymentProofs
                .filter((p) => p.unitId === u.id && p.period === currentMonth && p.status === 'paid')
                .reduce((s, p) => s + p.amount, 0);
            return paid < u.monthlyRent;
        });
    };

    const refreshLedger = fetchData;

    return (
        <DataContext.Provider
            value={{
                properties,
                units,
                tenants,
                managers,
                rentLedger,
                paymentProofs,
                overduePayments,
                addProperty,
                updateProperty,
                deleteProperty,
                addUnit,
                updateUnit,
                deleteUnit,
                addTenant,
                updateTenant,
                deleteTenant,
                addManager,
                updateManager,
                deleteManager,
                vacateUnit,
                addPaymentProof,
                verifyPayment,
                getUnpaidUnits,
                refreshLedger,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

/* ---------------- HOOK ---------------- */
export const useData = () => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used inside DataProvider");
    return ctx;
};
