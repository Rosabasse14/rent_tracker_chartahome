export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  type: string; // e.g. Compound, Block, Studio
  managerId: string;
}

export interface Unit {
  id: string;
  name: string;
  propertyId: string;
  propertyName: string;
  monthlyRent: number;
  type: string; // e.g. Room, Studio, Apartment
  status: 'vacant' | 'occupied';
  tenantName?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  nationalId?: string;
  unitId: string;
  unitName: string;
  propertyName: string;
  status: 'active' | 'inactive';
  entryDate: string; // ISO Date required
  rentDueDay: number; // e.g. 5
}

export interface RentLedgerEntry {
  id: string;
  tenantName: string;
  unitName: string;
  period: string;
  expected: number;
  paid: number;
  balance: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'overdue' | 'pending' | 'rejected';
}

export interface PaymentSubmission {
  id: string;
  tenantName: string;
  amount: number;
  submittedAt: string;
  status: 'paid' | 'partial' | 'pending';
}

export interface PaymentProof {
  id: string;
  proofNumber: string;
  submittedAt: string;
  tenantName: string;
  unitName: string;
  amount: number;
  period: string;
  paymentMethod?: 'MTN MoMo' | 'Orange Money' | 'Bank Transfer' | 'Cash';
  notes?: string;
  fileUrl?: string; // URL for screenshot
  status: 'paid' | 'partial' | 'pending' | 'rejected';
}

export interface OverduePayment {
  id: string;
  tenantName: string;
  unitName: string;
  amount: number;
  daysOverdue: number;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: 'active' | 'inactive';
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: 'active' | 'inactive';
}
