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
import { useAuth } from "./AuthContext";

/* ================= TYPES ================= */
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
    const { user } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [rentLedger] = useState<RentLedgerEntry[]>([]);
    const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
    const [overduePayments] = useState<OverduePayment[]>([]);

    /* ================= FETCH DATA ================= */
    const fetchData = async () => {
        try {
            /* ---------- PROPERTIES ---------- */
            const { data: propData, error: propError } = await supabase.from("properties").select("*");
            if (propError) console.error("Properties Fetch Error:", propError);
            if (propData) {
                setProperties(
                    propData.map((p) => ({
                        id: p.id,
                        name: p.name,
                        address: p.address,
                        managerId: p.manager_id,
                        city: p.city,
                        state: p.state,
                        zipCode: p.zip_code,
                        description: p.description,
                        imageUrl: p.image_url,
                        amenities: p.amenities,
                        type: p.type || "Apartment",
                        units: 0, // frontend-only
                    }))
                );
            }

            /* ---------- UNITS ---------- */
            const { data: unitData, error: unitError } = await supabase
                .from("units")
                .select("*, properties(name)");

            if (unitError) console.error("Units Fetch Error:", unitError);
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

            /* ---------- TENANTS ---------- */
            const { data: tenantData, error: tenantError } = await supabase
                .from("tenants")
                .select("*, units(name, properties(name))");

            if (tenantError) console.error("Tenants Fetch Error:", tenantError);
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

            /* ---------- MANAGERS ---------- */
            const { data: managerData, error: managerError } = await supabase.from("managers").select("*");
            if (managerError) console.error("Managers Fetch Error:", managerError);
            if (managerData) {
                setManagers(
                    managerData.map((m) => ({
                        id: m.id,
                        name: m.name,
                        email: m.email,
                        phone: m.phone || "",
                        city: m.city || "",
                        status: m.status,
                    }))
                );
            }

            /* ---------- PAYMENTS ---------- */
            const { data: payData, error: payError } = await supabase
                .from("payments")
                .select("*, tenants(name), units(name)");

            if (payError) console.error("Payments Fetch Error:", payError);
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
                        submittedAt: new Date(
                            p.submitted_at || p.created_at
                        ).toLocaleString(),
                    }))
                );
            }
        } catch (err) {
            console.error("Supabase fetch error:", err);
        }
    };

    /* ================= INIT ================= */
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

    /* ================= CRUD ================= */

    const addProperty = async (property: Property) => {
        const dbProperty = {
            name: property.name,
            address: property.address,
            manager_id: property.managerId,
            description: property.description,
            city: property.city,
            state: property.state,
            zip_code: property.zipCode,
            image_url: property.imageUrl,
            amenities: property.amenities,
            type: property.type,
        };

        const { error } = await supabase.from("properties").insert([dbProperty]);
        if (error) toast.error(error.message);
        else {
            toast.success("Property added");
            fetchData();
        }
    };

    const updateProperty = async (id: string, updates: Partial<Property>) => {
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.address) dbUpdates.address = updates.address;
        if (updates.managerId) dbUpdates.manager_id = updates.managerId;
        if (updates.city) dbUpdates.city = updates.city;
        if (updates.state) dbUpdates.state = updates.state;
        if (updates.zipCode) dbUpdates.zip_code = updates.zipCode;
        if (updates.description) dbUpdates.description = updates.description;
        if (updates.type) dbUpdates.type = updates.type;
        if (updates.imageUrl) dbUpdates.image_url = updates.imageUrl;
        if (updates.amenities) dbUpdates.amenities = updates.amenities;

        const { error } = await supabase
            .from("properties")
            .update(dbUpdates)
            .eq("id", id);

        if (error) toast.error(error.message);
        else fetchData();
    };

    const deleteProperty = async (id: string) => {
        await supabase.from("properties").delete().eq("id", id);
        fetchData();
    };

    /* ====== Units / Tenants / Managers / Payments unchanged logic ====== */

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
                addUnit: async (unit) => {
                    const { error } = await supabase.from("units").insert([{
                        name: unit.name,
                        property_id: unit.propertyId,
                        monthly_rent: unit.monthlyRent,
                        type: unit.type,
                        status: unit.status,
                        description: unit.description,
                        bedrooms: unit.bedrooms,
                        bathrooms: unit.bathrooms,
                        size_sqm: unit.sizeSqm,
                        floor_number: unit.floorNumber,
                        deposit_amount: unit.depositAmount,
                        maintenance_fee: unit.maintenanceFee,
                    }]);
                    if (error) toast.error(error.message);
                    else fetchData();
                },
                updateUnit: async (id, updates) => {
                    const dbUpdates: any = {};
                    if (updates.name) dbUpdates.name = updates.name;
                    if (updates.monthlyRent) dbUpdates.monthly_rent = updates.monthlyRent;
                    if (updates.type) dbUpdates.type = updates.type;
                    if (updates.status) dbUpdates.status = updates.status;
                    if (updates.description) dbUpdates.description = updates.description;
                    if (updates.bedrooms !== undefined) dbUpdates.bedrooms = updates.bedrooms;
                    if (updates.bathrooms !== undefined) dbUpdates.bathrooms = updates.bathrooms;
                    if (updates.sizeSqm !== undefined) dbUpdates.size_sqm = updates.sizeSqm;
                    if (updates.floorNumber !== undefined) dbUpdates.floor_number = updates.floorNumber;
                    if (updates.depositAmount !== undefined) dbUpdates.deposit_amount = updates.depositAmount;
                    if (updates.maintenanceFee !== undefined) dbUpdates.maintenance_fee = updates.maintenanceFee;

                    const { error } = await supabase.from("units").update(dbUpdates).eq("id", id);
                    if (error) toast.error(error.message);
                    else fetchData();
                },
                deleteUnit: async (id) => {
                    const { error } = await supabase.from("units").delete().eq("id", id);
                    if (error) toast.error(error.message);
                    else fetchData();
                },
                addTenant: async (tenant) => {
                    const { error } = await supabase.from("tenants").insert([{
                        id: tenant.id,
                        name: tenant.name,
                        email: tenant.email,
                        phone: tenant.phone,
                        national_id: tenant.nationalId,
                        unit_id: tenant.unitId || null,
                        lease_start: tenant.entryDate,
                        lease_end: tenant.leaseEnd,
                        rent_due_day: tenant.rentDueDay,
                        is_active: tenant.status === 'active'
                    }]);
                    if (error) {
                        toast.error(error.message);
                        return false;
                    }
                    fetchData();
                    return true;
                },
                updateTenant: async (id, updates) => {
                    const dbUpdates: any = {};
                    if (updates.name) dbUpdates.name = updates.name;
                    if (updates.email) dbUpdates.email = updates.email;
                    if (updates.phone) dbUpdates.phone = updates.phone;
                    if (updates.nationalId) dbUpdates.national_id = updates.nationalId;
                    if (updates.unitId !== undefined) dbUpdates.unit_id = updates.unitId || null;
                    if (updates.entryDate) dbUpdates.lease_start = updates.entryDate;
                    if (updates.leaseEnd !== undefined) dbUpdates.lease_end = updates.leaseEnd;
                    if (updates.rentDueDay) dbUpdates.rent_due_day = updates.rentDueDay;
                    if (updates.status) dbUpdates.is_active = updates.status === 'active';

                    const { error } = await supabase.from("tenants").update(dbUpdates).eq("id", id);
                    if (error) toast.error(error.message);
                    else fetchData();
                },
                deleteTenant: async (id) => {
                    const { error } = await supabase.from("tenants").delete().eq("id", id);
                    if (error) toast.error(error.message);
                    else fetchData();
                },
                addManager: async (manager) => {
                    const { error } = await supabase.from("managers").insert([{
                        id: manager.id,
                        name: manager.name,
                        email: manager.email,
                        phone: manager.phone,
                        city: manager.city,
                        status: manager.status
                    }]);
                    if (error) {
                        toast.error(error.message);
                        return false;
                    }
                    fetchData();
                    return true;
                },
                updateManager: async (id, updates) => {
                    const dbUpdates: any = {};
                    if (updates.name) dbUpdates.name = updates.name;
                    if (updates.email) dbUpdates.email = updates.email;
                    if (updates.phone) dbUpdates.phone = updates.phone;
                    if (updates.city) dbUpdates.city = updates.city;
                    if (updates.status) dbUpdates.status = updates.status;

                    const { error } = await supabase.from("managers").update(dbUpdates).eq("id", id);
                    if (error) toast.error(error.message);
                    else fetchData();
                },
                deleteManager: async (id) => {
                    const { error } = await supabase.from("managers").delete().eq("id", id);
                    if (error) toast.error(error.message);
                    else fetchData();
                },
                vacateUnit: async (tenantId) => {
                    const { error } = await supabase.from("tenants").update({ unit_id: null, is_active: false }).eq("id", tenantId);
                    if (error) toast.error(error.message);
                    else fetchData();
                },
                addPaymentProof: async (proof) => {
                    // Try to find the unit_id if not provided (for tenants)
                    let unitId = proof.unitId;
                    if (!unitId && user?.id) {
                        const tenant = tenants.find(t => t.id === user.id || t.email === user.email);
                        if (tenant) unitId = tenant.unitId;
                    }

                    const { error } = await supabase.from("payments").insert([{
                        amount: proof.amount,
                        period: proof.period,
                        status: proof.status,
                        payment_method: proof.paymentMethod,
                        notes: proof.notes,
                        proof_url: proof.fileUrl,
                        tenant_id: user?.id,
                        unit_id: unitId || null,
                        submitted_at: proof.submittedAt
                    }]);
                    if (error) toast.error(error.message);
                    else fetchData();
                },
                verifyPayment: async (id, status) => {
                    const { error } = await supabase.from("payments").update({
                        status,
                        verified_by: user?.id,
                        verified_at: new Date().toISOString()
                    }).eq("id", id);
                    if (error) toast.error(error.message);
                    else fetchData();
                },
                getUnpaidUnits: () => [],
                refreshLedger,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

/* ================= HOOK ================= */
export const useData = () => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used inside DataProvider");
    return ctx;
};
