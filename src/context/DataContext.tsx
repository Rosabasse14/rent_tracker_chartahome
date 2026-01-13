
import { createContext, useContext, useState, ReactNode } from 'react';
import { Property, Unit, Tenant, RentLedgerEntry, PaymentProof, OverduePayment, Manager } from '@/types';
import {
    properties as initialProperties,
    units as initialUnits,
    tenants as initialTenants,
    rentLedger as initialLedger,
    paymentProofs as initialProofs,
    overduePayments as initialOverdue,
    managers as initialManagers
} from '@/data/mockData';


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
    addTenant: (tenant: Tenant) => void;
    deleteTenant: (id: string) => void;
    addManager: (manager: Manager) => void;
    vacateUnit: (tenantId: string) => void;
    addPaymentProof: (proof: PaymentProof) => void;
    verifyPayment: (paymentId: string, status: 'paid' | 'rejected') => void;
    updatePaymentStatus: (id: string, status: 'paid' | 'partial' | 'pending') => void;
    getUnpaidUnits: (currentMonth: string) => Unit[];
    refreshLedger: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [properties, setProperties] = useState<Property[]>(initialProperties);
    const [units, setUnits] = useState<Unit[]>(initialUnits);
    const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
    const [managers, setManagers] = useState<Manager[]>(initialManagers);
    const [rentLedger, setRentLedger] = useState<RentLedgerEntry[]>(initialLedger);
    const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>(initialProofs);
    const [overduePayments, setOverduePayments] = useState<OverduePayment[]>(initialOverdue);

    const addProperty = (property: Property) => setProperties([...properties, property]);
    const deleteProperty = (id: string) => setProperties(properties.filter(p => p.id !== id));

    const addUnit = (unit: Unit) => setUnits([...units, unit]);
    const deleteUnit = (id: string) => setUnits(units.filter(u => u.id !== id));

    const addTenant = (tenant: Tenant) => {
        setTenants([...tenants, tenant]);
        if (tenant.unitId) {
            setUnits(prevUnits => prevUnits.map(u =>
                u.id === tenant.unitId
                    ? { ...u, status: 'occupied', tenantName: tenant.name }
                    : u
            ));
        }
    };

    const deleteTenant = (id: string) => {
        const tenant = tenants.find(t => t.id === id);
        if (tenant) {
            setUnits(prevUnits => prevUnits.map(u =>
                u.id === tenant.unitId
                    ? { ...u, status: 'vacant', tenantName: undefined }
                    : u
            ));
        }
        setTenants(tenants.filter(t => t.id !== id));
    };

    const addManager = (manager: Manager) => setManagers([...managers, manager]);

    const vacateUnit = (tenantId: string) => {
        const tenant = tenants.find(t => t.id === tenantId);
        if (!tenant) return;
        setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, status: 'inactive' } : t));
        if (tenant.unitId) {
            setUnits(prev => prev.map(u =>
                u.id === tenant.unitId ? { ...u, status: 'vacant', tenantName: undefined } : u
            ));
        }
    };

    const addPaymentProof = (proof: PaymentProof) => {
        setPaymentProofs([proof, ...paymentProofs]);
    };

    const verifyPayment = (paymentId: string, status: 'paid' | 'rejected') => {
        setPaymentProofs(prev => prev.map(p => p.id === paymentId ? { ...p, status } : p));
    };

    const updatePaymentStatus = (id: string, status: 'paid' | 'partial' | 'pending') => {
        setPaymentProofs(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    };

    const getUnpaidUnits = (currentMonth: string) => {
        return units.filter(unit => {
            if (unit.status !== 'occupied') return false;

            const proofs = paymentProofs.filter(p =>
                p.unitName === unit.name &&
                p.period === currentMonth &&
                p.status === 'paid'
            );
            const totalPaid = proofs.reduce((sum, p) => sum + p.amount, 0);
            return totalPaid < unit.monthlyRent;
        });
    };

    const refreshLedger = () => {
        console.log("Refreshed ledger data");
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
