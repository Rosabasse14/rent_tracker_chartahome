
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Property, Unit, Tenant, RentLedgerEntry, PaymentProof, OverduePayment, Manager } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
interface DataContextType {
    properties: Property[];
    units: Unit[];
    tenants: Tenant[];
    managers: Manager[];
    rentLedger: RentLedgerEntry[];
    paymentProofs: PaymentProof[];
    overduePayments: OverduePayment[];
    addProperty: (property: Property) => void;
    deleteProperty: (id: string) => void;
    addUnit: (unit: Unit) => void;
    deleteUnit: (id: string) => void;
    addTenant: (tenant: Tenant) => Promise<boolean>;
    deleteTenant: (id: string) => void;
    addManager: (manager: Manager) => Promise<boolean>;
    deleteManager: (id: string) => Promise<void>;
    updateManager: (id: string, updates: Partial<Manager>) => Promise<void>;
    updateTenant: (id: string, updates: Partial<Tenant>) => Promise<void>;
    vacateUnit: (tenantId: string) => void;
    addPaymentProof: (proof: PaymentProof) => void;
    verifyPayment: (paymentId: string, status: 'paid' | 'rejected') => void;
    updatePaymentStatus: (id: string, status: 'paid' | 'partial' | 'pending') => void;
    getUnpaidUnits: (currentMonth: string) => Unit[];
    refreshLedger: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [rentLedger, setRentLedger] = useState<RentLedgerEntry[]>([]);
    const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
    const [overduePayments, setOverduePayments] = useState<OverduePayment[]>([]);

    const fetchData = async () => {
        try {
            // Fetch Properties
            const { data: propData } = await supabase.from('properties').select('*');
            if (propData) {
                setProperties(propData.map(p => ({
                    id: p.id, name: p.name, address: p.address,
                    units: 0,
                    type: p.type || 'Residential', managerId: p.manager_id,
                    description: p.description,
                    city: p.city,
                    state: p.state,
                    zipCode: p.zip_code,
                    imageUrl: p.image_url,
                    amenities: p.amenities
                })));
            }

            // Fetch Units with Property Name
            const { data: unitData } = await supabase.from('units').select('*, properties(name)');
            if (unitData) {
                setUnits(unitData.map((u: any) => ({
                    id: u.id, name: u.name, monthlyRent: u.monthly_rent,
                    status: u.status, propertyId: u.property_id,
                    propertyName: u.properties?.name || 'Unknown',
                    type: u.type || 'Standard',
                    description: u.description,
                    bedrooms: u.bedrooms,
                    bathrooms: u.bathrooms,
                    sizeSqm: u.size_sqm,
                    floorNumber: u.floor_number,
                    depositAmount: u.deposit_amount,
                    maintenanceFee: u.maintenance_fee
                })));
            }

            // Fetch Tenants with Unit Name
            const { data: tenantData } = await supabase.from('tenants').select('*, units(name, properties(name))');
            if (tenantData) {
                setTenants(tenantData.map((t: any) => ({
                    id: t.id, name: t.name, email: t.email,
                    unitId: t.unit_id,
                    unitName: t.units?.name || 'Unassigned',
                    propertyName: t.units?.properties?.name || 'Unassigned',
                    status: t.is_active ? 'active' : 'inactive',
                    entryDate: t.lease_start || new Date().toISOString(),
                    rentDueDay: 5
                })));
            }

            // Fetch Managers
            const { data: managerData } = await supabase.from('managers').select('*');
            if (managerData) setManagers(managerData);

            // Fetch Payments
            const { data: payData } = await supabase.from('payments').select('*, tenants(name), units(name)');
            if (payData) {
                setPaymentProofs(payData.map((p: any) => ({
                    id: p.id,
                    proofNumber: p.id.substring(0, 8),
                    amount: p.amount,
                    period: p.period,
                    status: p.status,
                    paymentMethod: p.payment_method,
                    notes: p.notes,
                    fileUrl: p.proof_url,
                    tenantId: p.tenant_id,
                    unitId: p.unit_id,
                    tenantName: p.tenants?.name || 'Unknown',
                    unitName: p.units?.name || 'Unknown',
                    submittedAt: new Date(p.submitted_at).toLocaleString()
                })));
            }
        } catch (error) {
            console.error("Error fetching from Supabase:", error);
        }
    };

    useEffect(() => {
        fetchData();

        // Realtime Subscription
        const channel = supabase
            .channel('db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tenants' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'units' }, () => fetchData())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const addProperty = async (property: Property) => {
        const { error } = await supabase.from('properties').insert([property]);
        if (error) console.error("Error saving property:", error);
        fetchData();
    };

    const deleteProperty = async (id: string) => {
        const { error } = await supabase.from('properties').delete().eq('id', id);
        if (error) console.error("Error deleting property:", error);
        fetchData();
    };

    const addUnit = async (unit: Unit) => {
        const { error } = await supabase.from('units').insert([unit]);
        if (error) console.error("Error saving unit:", error);
        fetchData();
    };

    const deleteUnit = async (id: string) => {
        const { error } = await supabase.from('units').delete().eq('id', id);
        if (error) console.error("Error deleting unit:", error);
        fetchData();
    };

    const addTenant = async (tenant: Tenant) => {
        const { error } = await supabase.from('tenants').insert([tenant]);
        if (error) {
            console.error("Error saving tenant:", error);
            toast.error("Failed to add tenant: " + error.message);
            return false;
        }

        toast.success("Tenant added successfully");
        fetchData();
        return true;
    };

    const deleteTenant = async (id: string) => {
        const { error } = await supabase.from('tenants').delete().eq('id', id);
        if (error) console.error("Error deleting tenant:", error);
        fetchData();
    };

    const addManager = async (manager: Manager) => {
        const { error } = await supabase.from('managers').insert([manager]);
        if (error) {
            console.error("Error saving manager:", error.message, error);
            toast.error("Failed to add manager. " + error.message);
            return false;
        }

        toast.success("Manager added successfully");
        fetchData();
        return true;
    };

    const deleteManager = async (id: string) => {
        const { error } = await supabase.from('managers').delete().eq('id', id);
        if (error) {
            console.error("Error deleting manager:", error);
            toast.error("Failed to delete manager");
        } else {
            toast.success("Manager removed successfully");
            fetchData();
        }
    };

    const updateManager = async (id: string, updates: Partial<Manager>) => {
        const { error } = await supabase.from('managers').update(updates).eq('id', id);
        if (error) {
            console.error("Error updating manager:", error);
            toast.error("Failed to update manager");
        } else {
            toast.success("Manager details updated");
            fetchData();
        }
    };

    const updateTenant = async (id: string, updates: Partial<Tenant>) => {
        // Map updates to DB columns if necessary
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.email) dbUpdates.email = updates.email;
        if (updates.phone) dbUpdates.phone = updates.phone;
        if (updates.unitId !== undefined) dbUpdates.unit_id = updates.unitId;
        if (updates.status) dbUpdates.is_active = updates.status === 'active';

        const { error } = await supabase.from('tenants').update(dbUpdates).eq('id', id);
        if (error) {
            console.error("Error updating tenant:", error);
            toast.error("Failed to update tenant");
        } else {
            toast.success("Tenant details updated");
            fetchData();
        }
    };

    const vacateUnit = async (tenantId: string) => {
        const tenant = tenants.find(t => t.id === tenantId);
        if (!tenant) return;

        await supabase.from('tenants').update({ is_active: false, unit_id: null }).eq('id', tenantId);
        await supabase.from('units').update({ status: 'vacant' }).eq('id', tenant.unitId);
        fetchData();
    };

    const addPaymentProof = async (proof: PaymentProof) => {
        const tenant = tenants.find(t => t.name === proof.tenantName);
        if (!tenant) return;

        const dbPayload = {
            tenant_id: tenant.id,
            unit_id: tenant.unitId,
            amount: proof.amount,
            period: proof.period,
            status: 'pending',
            proof_url: proof.fileUrl,
            payment_method: proof.paymentMethod,
            notes: proof.notes
        };

        const { error } = await supabase.from('payments').insert([dbPayload]);
        if (error) console.error("Error saving payment:", error);
        fetchData();
    };

    const verifyPayment = async (paymentId: string, status: 'paid' | 'rejected') => {
        const { error } = await supabase.from('payments').update({ status }).eq('id', paymentId);
        if (error) console.error("Error verifying payment:", error);
        fetchData();
    };

    const updatePaymentStatus = (id: string, status: 'paid' | 'partial' | 'pending') => {
        setPaymentProofs(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    };

    const getUnpaidUnits = (currentMonth: string) => {
        return units.filter(unit => {
            if (unit.status !== 'occupied') return false;
            const proofs = paymentProofs.filter(p =>
                p.unitId === unit.id && p.period === currentMonth && p.status === 'paid'
            );
            const totalPaid = proofs.reduce((sum, p) => sum + p.amount, 0);
            return totalPaid < unit.monthlyRent;
        });
    };

    const refreshLedger = () => {
        fetchData();
    };

    return (
        <DataContext.Provider value={{
            properties,
            units,
            tenants,
            managers,
            rentLedger,
            paymentProofs,
            overduePayments,
            addProperty,
            deleteProperty,
            addUnit,
            deleteUnit,
            addTenant,
            deleteTenant,
            addManager,
            deleteManager,
            updateManager,
            updateTenant,
            vacateUnit,
            addPaymentProof,
            verifyPayment,
            updatePaymentStatus,
            getUnpaidUnits,
            refreshLedger
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};
