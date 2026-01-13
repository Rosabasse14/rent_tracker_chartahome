
import { PageLayout } from "@/components/layout/PageLayout";
import { Bell, AlertCircle, CheckCircle2, Clock, FileText, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const managerNotifications = [
  {
    id: "1",
    type: "submission",
    title: "New Payment Proof Submitted",
    message: "Robert Wilson submitted a payment proof for Suite 1A. Review now.",
    time: "10 minutes ago",
    unread: true,
  },
  {
    id: "2",
    type: "overdue",
    title: "Overdue Alert",
    message: "Emily Rodriguez overdue for 11 days. System generated reminder sent.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "3",
    type: "partial",
    title: "Partial Payment Recorded",
    message: "Sarah Chen paid 800 FCFA (Partial). Balance: 800 FCFA.",
    time: "1 day ago",
    unread: false,
  },
];

const tenantNotifications = [
  {
    id: "1",
    type: "payment_success",
    title: "Payment Confirmed",
    message: "Your payment of 150,000 FCFA for January 2026 has been approved.",
    time: "1 day ago",
    unread: true,
  },
  {
    id: "2",
    type: "reminder",
    title: "Rent Due Soon",
    message: "Reminder: Rent for February is due on Feb 5th.",
    time: "3 days ago",
    unread: false,
  },
  {
    id: "3",
    type: "info",
    title: "Maintenance Notice",
    message: "Building water maintenance scheduled for Saturday, 10 AM.",
    time: "5 days ago",
    unread: false,
  },
];

export default function Notifications() {
  const { user } = useAuth();
  const isTenant = user?.role === "TENANT";
  const notifications = isTenant ? tenantNotifications : managerNotifications;

  const getIcon = (type: string) => {
    switch (type) {
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "payment_success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "partial":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "submission":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "reminder":
        return <Bell className="w-5 h-5 text-primary" />;
      default:
        return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'overdue': return 'bg-red-100';
      case 'payment_success': return 'bg-emerald-100';
      case 'partial': return 'bg-amber-100';
      case 'submission': return 'bg-blue-100';
      default: return 'bg-muted';
    }
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">Notifications</h1>
          <p className="page-description">Stay updated on {isTenant ? 'your home' : 'payments and tenant activity'}</p>
        </div>
        <button className="text-sm text-primary hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-card rounded-xl border p-4 flex items-start gap-4 transition-all hover:bg-muted/40 ${notification.unread ? 'border-l-4 border-l-primary shadow-sm' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(notification.type)}`}>
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className={`font-medium text-sm md:text-base ${notification.unread ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                  {notification.title}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{notification.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{notification.message}</p>
            </div>
            {notification.unread && (
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
