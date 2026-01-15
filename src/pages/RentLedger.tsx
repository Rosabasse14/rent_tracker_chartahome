import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";
import { RentLedgerEntry } from "@/types";
import { Filter, ChevronDown, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RentLedger() {
  // Use data from context instead of mock imports
  const { language } = useAuth();
  const t = translations[language];
  const { tenants, units } = useData();

  const [ledger, setLedger] = useState<RentLedgerEntry[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTenantId, setSelectedTenantId] = useState<string>("all");

  // Generate Ledger based on Tenants' Entry Date
  useEffect(() => {
    generateLedger();
  }, [selectedTenantId, tenants, units, language]); // Added language to dependencies

  const generateLedger = () => {
    let allEntries: RentLedgerEntry[] = [];

    // Filter tenants if specific one selected
    const tenantsToProcess = selectedTenantId === "all" ? tenants : tenants.filter(t => t.id === selectedTenantId);

    tenantsToProcess.forEach(tenant => {
      if (!tenant.entryDate || tenant.status !== 'active') return;

      const entryDate = new Date(tenant.entryDate);
      const today = new Date();
      const unit = units.find(u => u.id === tenant.unitId);

      // If unit not found or rent not defined, skip (shouldn't happen in normal flow)
      if (!unit) return;

      // Loop from entry month to current month + 1 (future)
      const currentIterDate = new Date(entryDate.getFullYear(), entryDate.getMonth(), 1);
      // Safety cap: don't generate more than 5 years of history in one go
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 5);

      while (currentIterDate <= today && currentIterDate < maxDate) {
        const year = currentIterDate.getFullYear();
        const month = currentIterDate.getMonth();
        const monthName = currentIterDate.toLocaleString(language === 'en' ? 'en-US' : 'fr-FR', { month: 'long' });
        const period = `${monthName} ${year}`;

        // Calculate Due Date
        const dueDate = new Date(year, month, tenant.rentDueDay || 5);

        // Calculate Expected Rent
        let expected = unit.monthlyRent;

        // Logic: If entry date is > 1st of month AND this is the first month
        if (currentIterDate.getTime() === new Date(entryDate.getFullYear(), entryDate.getMonth(), 1).getTime()) {
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          // If moved in after 1st
          if (entryDate.getDate() > 1) {
            const daysOccupied = daysInMonth - entryDate.getDate() + 1;
            expected = Math.round((unit.monthlyRent / daysInMonth) * daysOccupied);
          }
        }

        // Mock Payment Status for demo
        // In real app, we would query payments table here
        let status: RentLedgerEntry['status'] = 'paid';
        let paid = expected;

        // Randomize statuses for visuals if using mocks
        // Ideally we should use the actual transactions if we have them

        // Simple mock logic:
        // If due date is in future -> pending, paid 0
        if (dueDate > today) {
          status = 'pending';
          paid = 0;
        }
        // If tenant name contains "Emily" and it's current month -> overdue (DEMO)
        else if (tenant.name.includes('Emily') && month === today.getMonth() && year === today.getFullYear()) {
          status = 'overdue';
          paid = 0;
        }
        // If tenant name contains "Sarah" -> partial (DEMO)
        else if (tenant.name.includes('Sarah')) {
          // Randomly partial
          if (Math.random() > 0.5) {
            status = 'partial';
            paid = Math.floor(expected * 0.6);
          }
        }

        allEntries.push({
          id: `${tenant.id}-${year}-${month}`,
          tenantName: tenant.name,
          unitName: tenant.unitName,
          period,
          expected,
          paid,
          balance: expected - paid,
          dueDate: dueDate.toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR'),
          status
        });

        // Move to next month
        currentIterDate.setMonth(currentIterDate.getMonth() + 1);
      }
    });

    // Sort by date descending (period approximation)
    allEntries.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateB - dateA;
    });

    setLedger(allEntries);
  };

  const filteredLedger = statusFilter === "all"
    ? ledger
    : ledger.filter((entry) => entry.status === statusFilter);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return t.paid;
      case 'partial': return t.partial;
      case 'overdue': return t.overdue;
      case 'pending': return t.pending;
      default: return status;
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">{t.rent_ledger_title}</h1>
          <p className="page-description">{t.rent_ledger_desc}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">

          <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.all_tenants} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all_tenants}</SelectItem>
              {tenants.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                {statusFilter === "all" ? t.all_status : getStatusLabel(statusFilter)}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>{t.all_status}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("paid")}>{t.paid}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("partial")}>{t.partial}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("overdue")}>{t.overdue}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>{t.pending}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={generateLedger}>
            <CheckCircle className="w-4 h-4 mr-2" />
            {t.refresh_ledger}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase font-medium">
              <tr className="border-b">
                <th className="px-4 py-3">{t.tenant}</th>
                <th className="px-4 py-3">{t.period_col}</th>
                <th className="px-4 py-3">{t.expected_col}</th>
                <th className="px-4 py-3">{t.paid_col}</th>
                <th className="px-4 py-3">{t.balance_col}</th>
                <th className="px-4 py-3">{t.due_date_col}</th>
                <th className="px-4 py-3">{t.status_col}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    {t.no_ledger_entries}
                  </td>
                </tr>
              ) : filteredLedger.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{entry.tenantName}</p>
                      <p className="text-xs text-muted-foreground">{entry.unitName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.period}</td>
                  <td className="px-4 py-3 font-medium">{entry.expected.toLocaleString()} FCFA</td>
                  <td className="px-4 py-3 font-medium text-emerald-600">{entry.paid.toLocaleString()} FCFA</td>
                  <td className={`px-4 py-3 font-medium ${entry.balance > 0 ? "text-red-500" : "text-muted-foreground"}`}>
                    {entry.balance.toLocaleString()} FCFA
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{entry.dueDate}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={entry.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
