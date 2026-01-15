
import { PageLayout } from "@/components/layout/PageLayout";
import { Bell, AlertCircle, CheckCircle2, Clock, FileText, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";

const managerNotifications = [];
const tenantNotifications = [];

export default function Notifications() {
  const { user, language } = useAuth();
  const t = translations[language];
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
          <h1 className="page-title">{t.notifications_title}</h1>
          <p className="page-description">
            {isTenant ? t.notifications_desc_tenant : t.notifications_desc_manager}
          </p>
        </div>
        <button className="text-sm text-primary hover:underline">{t.mark_all_read}</button>
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
                  {notification.title[language]}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{notification.time[language]}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{notification.message[language]}</p>
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
