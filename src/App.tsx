
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Units from "./pages/Units";
import Tenants from "./pages/Tenants";
import RentLedger from "./pages/RentLedger";
import PaymentProofs from "./pages/PaymentProofs";
import Notifications from "./pages/Notifications";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/layout/SidebarContent";
import { Menu, Building2 } from "lucide-react";
import { NotificationCenter } from "@/components/common/NotificationCenter";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Managers from "./pages/Managers";
import ManagerDetail from "./pages/super-admin/ManagerDetail";
import PropertyDetail from "./pages/super-admin/PropertyDetail";
import UnitDetail from "./pages/super-admin/UnitDetail";
import GlobalAudit from "./pages/super-admin/GlobalAudit";

const queryClient = new QueryClient();

const ProtectedLayout = () => {
  const { isAuthenticated, user, language } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background font-sans antialiased text-foreground overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-end px-8 h-20 border-b bg-white/50 backdrop-blur-md z-30 shrink-0">
          <NotificationCenter />
        </header>

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-muted rounded-lg border shadow-sm">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SidebarContent onItemClick={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold tracking-tight">Chartahome</span>
            </div>
          </div>
          <NotificationCenter />
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/units" element={<Units />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/rent-ledger" element={<RentLedger />} />
        <Route path="/payment-proofs" element={<PaymentProofs />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/managers" element={<Managers />} />
        <Route path="/super-admin/managers/:managerId" element={<ManagerDetail />} />
        <Route path="/super-admin/properties/:propertyId" element={<PropertyDetail />} />
        <Route path="/super-admin/units/:unitId" element={<UnitDetail />} />
        <Route path="/super-admin/audit" element={<GlobalAudit />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
