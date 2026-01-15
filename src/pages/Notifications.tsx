
import { PageLayout } from "@/components/layout/PageLayout";
import { Bell, AlertCircle, CheckCircle2, Clock, FileText, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/utils/translations";

const managerNotifications = [
  {
    id: "1",
    type: "submission",
    title: { en: "New Payment Proof Submitted", fr: "Nouvelle Preuve de Paiement Soumise" },
    message: { en: "Robert Wilson submitted a payment proof for Suite 1A. Review now.", fr: "Robert Wilson a soumis une preuve de paiement pour la Suite 1A. Examinez-la maintenant." },
    time: { en: "10 minutes ago", fr: "il y a 10 minutes" },
    unread: true,
  },
  {
    id: "2",
    type: "overdue",
    title: { en: "Overdue Alert", fr: "Alerte de Retard" },
    message: { en: "Emily Rodriguez overdue for 11 days. System generated reminder sent.", fr: "Emily Rodriguez a 11 jours de retard. Rappel généré par le système envoyé." },
    time: { en: "2 hours ago", fr: "il y a 2 heures" },
    unread: true,
  },
  {
    id: "3",
    type: "partial",
    title: { en: "Partial Payment Recorded", fr: "Paiement Partiel Enregistré" },
    message: { en: "Sarah Chen paid 80,000 FCFA (Partial). Balance: 70,000 FCFA.", fr: "Sarah Chen a payé 80 000 FCFA (Partiel). Solde : 70 000 FCFA." },
    time: { en: "1 day ago", fr: "il y a 1 jour" },
    unread: false,
  },
];

const tenantNotifications = [
  {
    id: "1",
    type: "payment_success",
    title: { en: "Payment Confirmed", fr: "Paiement Confirmé" },
    message: { en: "Your payment of 150,000 FCFA for January 2026 has been approved.", fr: "Votre paiement de 150 000 FCFA pour Janvier 2026 a été approuvé." },
    time: { en: "1 day ago", fr: "il y a 1 jour" },
    unread: true,
  },
  {
    id: "2",
    type: "reminder",
    title: { en: "Rent Due Soon", fr: "Loyer Bientôt Dû" },
    message: { en: "Reminder: Rent for February is due on Feb 5th.", fr: "Rappel : Le loyer de Février est dû le 5 Février." },
    time: { en: "3 days ago", fr: "il y a 3 jours" },
    unread: false,
  },
  {
    id: "3",
    type: "info",
    title: { en: "Maintenance Notice", fr: "Avis de Maintenance" },
    message: { en: "Building water maintenance scheduled for Saturday, 10 AM.", fr: "Maintenance de l'eau du bâtiment prévue pour Samedi, 10h." },
    time: { en: "5 days ago", fr: "il y a 5 jours" },
    unread: false,
  },
];

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
