import { Property, Unit, Tenant, RentLedgerEntry, PaymentSubmission, PaymentProof, OverduePayment, Manager } from '@/types';

export const managers: Manager[] = [
  { id: '1', name: 'Bonamoussadi Rentals', email: 'bonamoussadi@rentals.cm', phone: '+237 600 000 001', city: 'Douala', status: 'active' },
  { id: '2', name: 'Yaoundé Property Group', email: 'younde@prop.cm', phone: '+237 600 000 002', city: 'Yaoundé', status: 'active' },
  { id: '3', name: 'Coastal Management Inc.', email: 'coastal@mgmt.cm', phone: '+237 600 000 003', city: 'Kribi', status: 'active' },
];

export const properties: Property[] = [
  { id: '1', name: 'Sunset Apartments', address: '123 Sunset Boulevard, Los Angeles, CA 90028', units: 2, type: 'Apartment Block', managerId: '1' },
  { id: '2', name: 'Riverside Manor', address: '456 River Road, Portland, OR 97201', units: 2, type: 'Townhouse', managerId: '1' },
  { id: '3', name: 'Palm Grove Residences', address: '456 Oak Avenue, Westside', units: 2, type: 'Studio Complex', managerId: '1' },
  { id: '4', name: 'Harbor View Complex', address: '789 Beach Road, Marina District', units: 1, type: 'Apartment Block', managerId: '1' },
  { id: '5', name: 'Sunrise Apartments', address: '123 Main Street, Downtown', units: 3, type: 'Compound', managerId: '1' },
  { id: '6', name: 'Green Valley Complex', address: '456 Valley Road, San Francisco, CA 94102', units: 2, type: 'Apartment Block', managerId: '1' },
];

export const units: Unit[] = [
  { id: '1', name: 'Apt B', propertyId: '2', propertyName: 'Riverside Manor', monthlyRent: 2000, status: 'vacant', type: 'Apartment' },
  { id: '2', name: 'Unit 102', propertyId: '1', propertyName: 'Sunset Apartments', monthlyRent: 1650, status: 'occupied', tenantName: 'wertyuiuytgfrd', type: 'Studio' },
  { id: '3', name: 'Unit 201', propertyId: '1', propertyName: 'Sunset Apartments', monthlyRent: 1800, status: 'vacant', type: 'Studio' },
  { id: '4', name: 'Apt A', propertyId: '2', propertyName: 'Riverside Manor', monthlyRent: 2200, status: 'occupied', tenantName: 'Emily Rodriguez', type: 'Apartment' },
  { id: '5', name: 'Apt A', propertyId: '3', propertyName: 'Palm Grove Residences', monthlyRent: 2000, status: 'occupied', tenantName: 'Jordan Mouanjo', type: 'Studio' },
];

export const tenants: Tenant[] = [
  { id: '1', name: 'Ngon Simo Nathan', email: 'nathanngon71@gmail.com', phone: '+237689458569', unitId: '2', unitName: 'Unit 102', propertyName: 'Sunrise Apartments', status: 'active', entryDate: '2025-06-01', rentDueDay: 5 },
  { id: '2', name: 'Jordan Mouanjo', email: 'jordm1892@gmail.com', phone: '+237 67088697', unitId: '5', unitName: 'Apt A', propertyName: 'Palm Grove Residences', status: 'active', entryDate: '2026-01-01', rentDueDay: 1 },
  { id: '3', name: 'wertyuiuytgfrd', email: 'qwertyui@gmail.com', unitId: '2', unitName: 'Unit 102', propertyName: 'Sunset Apartments', status: 'active', entryDate: '2025-12-15', rentDueDay: 5 },
  { id: '4', name: 'cherry vyuyun', email: 'cherryyuyun06@gmail.com', phone: '+237 678697854', unitId: '6', unitName: 'Tower 1 - 5th Floor', propertyName: 'Downtown Towers', status: 'active', entryDate: '2025-11-20', rentDueDay: 10 },
  { id: '5', name: 'Rosa Daniella', email: 'basserosa0@gmail.com', phone: '+237659249412', unitId: '2', unitName: 'Unit 102', propertyName: 'Sunset Apartments', status: 'active', entryDate: '2026-01-10', rentDueDay: 5 },
];

export const rentLedger: RentLedgerEntry[] = [
  { id: '1', tenantName: 'Sarah Johnson', unitName: 'Unit 101', period: 'January 2026', expected: 1500, paid: 1500, balance: 0, dueDate: 'Jan 1, 2026', status: 'paid' },
  { id: '2', tenantName: 'Michael Chen', unitName: 'Unit 102', period: 'January 2026', expected: 1650, paid: 1000, balance: 650, dueDate: 'Jan 5, 2026', status: 'partial' },
  { id: '3', tenantName: 'Sarah Johnson', unitName: 'Unit 101', period: 'December 2025', expected: 1500, paid: 1500, balance: 0, dueDate: 'Dec 1, 2025', status: 'paid' },
  { id: '4', tenantName: 'Emily Rodriguez', unitName: 'Apt A', period: 'January 2026', expected: 2200, paid: 0, balance: 2200, dueDate: 'Jan 1, 2026', status: 'overdue' },
  { id: '5', tenantName: 'Sarah Johnson', unitName: 'Unit 102', period: 'January 2026', expected: 1600, paid: 800, balance: 800, dueDate: 'Jan 1, 2026', status: 'partial' },
  { id: '6', tenantName: 'Michael Chen', unitName: 'Apt A', period: 'January 2026', expected: 2000, paid: 0, balance: 2000, dueDate: 'Jan 1, 2026', status: 'overdue' },
  { id: '7', tenantName: 'Robert Wilson', unitName: 'Suite 1A', period: 'January 2026', expected: 2500, paid: 2500, balance: 0, dueDate: 'Jan 1, 2026', status: 'paid' },
  { id: '8', tenantName: 'John Smith', unitName: 'Unit 101', period: 'January 2026', expected: 1500, paid: 1500, balance: 0, dueDate: 'Jan 1, 2026', status: 'paid' },
];

export const recentPayments: PaymentSubmission[] = [
  { id: '1', tenantName: 'Robert Wilson', amount: 2500, submittedAt: 'Jan 14, 2026 10:00 AM', status: 'paid' },
  { id: '2', tenantName: 'Sarah Chen', amount: 800, submittedAt: 'Jan 6, 2026 10:15 AM', status: 'partial' },
  { id: '3', tenantName: 'Sarah Johnson', amount: 800, submittedAt: 'Jan 5, 2026 3:00 PM', status: 'partial' },
  { id: '4', tenantName: 'John Smith', amount: 1500, submittedAt: 'Jan 2, 2026 11:30 AM', status: 'paid' },
  { id: '5', tenantName: 'John Martinez', amount: 1500, submittedAt: 'Jan 2, 2026 11:30 AM', status: 'paid' },
];

export const overduePayments: OverduePayment[] = [
  { id: '1', tenantName: 'Emily Rodriguez', unitName: 'Apt A', amount: 2200, daysOverdue: 11 },
  { id: '2', tenantName: 'Emily Davis', unitName: 'Apt B', amount: 2200, daysOverdue: 11 },
  { id: '3', tenantName: 'Michael Johnson', unitName: 'Unit 201', amount: 1750, daysOverdue: 11 },
];

export const paymentProofs: PaymentProof[] = [
  { id: '1', proofNumber: '#69650494', submittedAt: 'Jan 14, 2026 10:00 AM', tenantName: 'Robert Wilson', unitName: 'Suite 1A', amount: 2500, period: 'January 2026', notes: 'Early payment', status: 'paid', fileUrl: 'https://images.unsplash.com/photo-1554224155-1696413575b3?auto=format&fit=crop&w=800&q=80' },
  { id: '2', proofNumber: '#69650403', submittedAt: 'Jan 6, 2026 10:15 AM', tenantName: 'Sarah Chen', unitName: 'Unit 102', amount: 800, period: 'January 2026', status: 'partial', fileUrl: 'https://images.unsplash.com/photo-1554224154-15f1873b22cf?auto=format&fit=crop&w=800&q=80' },
  { id: '3', proofNumber: '#69650402', submittedAt: 'Jan 5, 2026 3:00 PM', tenantName: 'Sarah Johnson', unitName: 'Unit 101', amount: 800, period: 'January 2026', status: 'partial', fileUrl: 'https://images.unsplash.com/photo-1554224154-2c6c2243e835?auto=format&fit=crop&w=800&q=80' },
  { id: '4', proofNumber: '#69650401', submittedAt: 'Jan 2, 2026 11:30 AM', tenantName: 'John Smith', unitName: 'Unit 101', amount: 1500, period: 'January 2026', status: 'paid', fileUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80' },
  { id: '5', proofNumber: '#69650400', submittedAt: 'Jan 2, 2026 11:30 AM', tenantName: 'John Martinez', unitName: 'Unit 102', amount: 1500, period: 'January 2026', status: 'paid', fileUrl: 'https://images.unsplash.com/photo-1586281380349-631531a73a4e?auto=format&fit=crop&w=800&q=80' },
  { id: '6', proofNumber: '#77889900', submittedAt: 'Jan 15, 2026 09:00 AM', tenantName: 'Ngon Simo Nathan', unitName: 'Apartment 4B', amount: 120000, period: 'January 2026', status: 'pending', fileUrl: 'https://images.unsplash.com/photo-1554224155-1696413575b3?auto=format&fit=crop&w=800&q=80' },
];

export const dashboardStats = {
  totalExpected: 22200,
  totalCollected: 9600,
  collectionRate: 43.2,
  overdueCount: 3,
  partialCount: 3,
};
