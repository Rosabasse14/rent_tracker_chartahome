
import { useAuth } from "@/context/AuthContext";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { TenantDashboard } from "@/components/dashboard/TenantDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "SUPER_ADMIN") {
    return <SuperAdminDashboard />;
  }

  if (user?.role === "TENANT") {
    return <TenantDashboard />;
  }

  // Default to Manager Dashboard
  return <ManagerDashboard />;
}
