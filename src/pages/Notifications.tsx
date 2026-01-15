import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  Bell,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Info
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  unread: boolean;
  created_at: string;
};

export default function Notifications() {
  const { user, language } = useAuth();
  const t = translations[language];

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH NOTIFICATIONS ---------------- */
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id) // ✅ FIXES 400 ERROR
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
        return;
      }

      setNotifications(data || []);
      setLoading(false);
    };

    fetchNotifications();
  }, [user?.id]);

  /* ---------------- MARK ALL AS READ ---------------- */
  const markAllAsRead = async () => {
    if (!user?.id) return;

    const { error } = await supabase
      .from("notifications")
      .update({ unread: false })
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to mark notifications as read:", error);
      return;
    }

    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
  };

  /* ---------------- UI HELPERS ---------------- */
  const getIcon = (type: string) => {
    switch (type) {
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "payment":
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
      case "overdue":
        return "bg-red-100";
      case "payment":
        return "bg-emerald-100";
      case "partial":
        return "bg-amber-100";
      case "submission":
        return "bg-blue-100";
      case "reminder":
        return "bg-primary/10";
      default:
        return "bg-muted";
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="page-header mb-0">
          <h1 className="page-title">{t.notifications_title}</h1>
          <p className="page-description">
            {t.notifications_desc_tenant}
          </p>
        </div>

        {notifications.some(n => n.unread) && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary hover:underline"
          >
            {t.mark_all_read}
          </button>
        )}
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">
          Loading notifications…
        </p>
      )}

      {!loading && notifications.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No notifications yet.
        </p>
      )}

      <div className="space-y-3">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`bg-card rounded-xl border p-4 flex items-start gap-4 transition-all hover:bg-muted/40 ${
              notification.unread
                ? "border-l-4 border-l-primary shadow-sm"
                : ""
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(
                notification.type
              )}`}
            >
              {getIcon(notification.type)}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3
                  className={`font-medium text-sm md:text-base ${
                    notification.unread
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {notification.title}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {notification.message}
              </p>
            </div>

            {notification.unread && (
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
