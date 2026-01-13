
import { Toaster as Sonner } from "@/components/ui/sonner";
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
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Managers from "./pages/Managers";
import ManagerDetail from "./pages/super-admin/ManagerDetail";
import PropertyDetail from "./pages/super-admin/PropertyDetail";
import UnitDetail from "./pages/super-admin/UnitDetail";
import GlobalAudit from "./pages/super-admin/GlobalAudit";

const queryClient = new QueryClient();

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background font-sans antialiased text-foreground">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <Outlet />
      </main>
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
