
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useData } from "@/context/DataContext";
import { FileText, User, DollarSign, Calendar, ExternalLink, Upload, Check, X, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

export default function PaymentProofs() {
  const { user, language } = useAuth();
  const t = translations[language];
  const { paymentProofs: allProofs, addPaymentProof, verifyPayment } = useData();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ amount: "", method: "Cash", notes: "", file: null as File | null });

  const isTenant = user?.role === "TENANT";
  const isManager = user?.role === "MANAGER" || user?.role === "SUPER_ADMIN";

  // Filter proofs if user is a tenant
  const proofs = isTenant
    ? allProofs.filter(p => p.tenantName === user?.name)
    : allProofs;

  // Calculate totals
  const totalAmount = proofs.reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = proofs.filter(p => p.status === 'pending').length;

  const handleUpload = () => {
    if (!newPayment.amount || !newPayment.file) {
      toast.error("Please fill in amount and attach a file");
      return;
    }

    // Simulate upload
    const newProof = {
      id: Date.now().toString(),
      proofNumber: `#${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
      submittedAt: new Date().toLocaleString(),
      tenantName: user?.name || "Unknown",
      unitName: "My Unit", // Mock
      amount: parseFloat(newPayment.amount),
      period: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      paymentMethod: newPayment.method as any,
      notes: newPayment.notes,
      status: 'pending' as const
    };

    addPaymentProof(newProof);
    setIsUploadOpen(false);
    setNewPayment({ amount: "", method: "Cash", notes: "", file: null });
    toast.success("Payment proof submitted successfully!");
  };

  const handleStatusChange = (id: string, newStatus: 'paid' | 'rejected') => {
    verifyPayment(id, newStatus);
    toast.success(`Payment status updated to ${newStatus}`);
  };


  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-8">
        <div className="page-header mb-0">
          <h1 className="page-title">{t.payment_proofs_title}</h1>
          <p className="page-description">
            {isTenant ? t.payment_proofs_tenant_desc : t.payment_proofs_manager_desc}
          </p>
        </div>

        {isTenant && (
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Upload className="w-4 h-4" />
                {t.submit_payment}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Payment Proof</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t.amount_paid} (FCFA)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 150000"
                      value={newPayment.amount}
                      onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{t.method}</Label>
                    <Select
                      value={newPayment.method}
                      onValueChange={v => setNewPayment({ ...newPayment, method: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MTN MoMo">MTN MoMo</SelectItem>
                        <SelectItem value="Orange Money">Orange Money</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>{t.notes_optional}</Label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. Paid for January and February"
                    value={newPayment.notes}
                    onChange={e => setNewPayment({ ...newPayment, notes: e.target.value })}
                  />
                </div>
                <div className="border-2 border-dashed border-input rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors relative">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">{t.upload_screenshot}</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  <input
                    type="file"
                    className="opacity-0 absolute inset-0 cursor-pointer h-full w-full"
                    onChange={e => setNewPayment({ ...newPayment, file: e.target.files?.[0] || null })}
                  />
                  {newPayment.file && <p className="text-sm text-emerald-600 font-medium mt-2">{newPayment.file.name}</p>}
                </div>
                <Button className="w-full" onClick={handleUpload}>{t.submit_payment}</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats - Context Aware */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div>
            <p className="text-sm text-muted-foreground">{t.total_submissions}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{proofs.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-muted-foreground">{t.pending_review}</p>
            <p className="text-3xl font-bold text-amber-500 mt-1">{pendingCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-muted-foreground">{t.amount_paid}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{totalAmount.toLocaleString()} FCFA</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-muted-foreground">{t.verified_this_month}</p>
            <p className="text-3xl font-bold text-emerald-500 mt-1">
              {proofs.filter(p => p.status === 'paid').length}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Proofs List */}
      <div className="space-y-4">
        {proofs.length === 0 ? (
          <div className="bg-card rounded-xl border p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">{t.no_proofs}</p>
          </div>
        ) : proofs.map((proof) => (
          <div key={proof.id} className="proof-card transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0 border overflow-hidden group/img relative">
                  {proof.fileUrl ? (
                    <img src={proof.fileUrl} alt="Proof" className="w-full h-full object-cover transition-transform group-hover/img:scale-110" />
                  ) : (
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    Payment {proof.proofNumber}
                    {isManager && proof.status === 'pending' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 animate-pulse">{t.new}</span>}
                  </h3>
                  <p className="text-sm text-muted-foreground">Submitted {proof.submittedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={proof.status} />
                {isManager && proof.status === 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(proof.id, 'rejected')} className="h-8 shadow-sm text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                      <X className="w-4 h-4 mr-1" />
                      {t.flag_issue}
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 shadow-sm" onClick={() => handleStatusChange(proof.id, 'paid')}>
                      <Check className="w-4 h-4 mr-1" />
                      {t.approve}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.tenant}</p>
                  <p className="font-medium text-foreground">{proof.tenantName}</p>
                  <p className="text-sm text-muted-foreground">{proof.unitName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.amount}</p>
                  <p className="font-bold text-primary text-xl">{proof.amount.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">FCFA</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.period} & {t.method}</p>
                  <p className="font-medium text-foreground">{proof.period}</p>
                  <p className="text-[10px] font-bold text-primary uppercase">{proof.paymentMethod || 'Cash'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {proof.fileUrl ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      {t.view_full_receipt}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl rounded-[2.5rem] p-4">
                    <DialogHeader>
                      <DialogTitle>{t.mmoney_proof}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 rounded-2xl overflow-hidden border">
                      <img src={proof.fileUrl} alt="Full Proof" className="w-full h-auto max-h-[70vh] object-contain mx-auto" />
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <span className="text-sm text-muted-foreground italic">{t.no_proofs}</span>
              )}
              {proof.notes && (
                <div className="max-w-md text-right">
                  <p className="text-xs text-muted-foreground font-medium uppercase">{t.notes_optional}</p>
                  <p className="text-sm italic text-muted-foreground">{proof.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
