
import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { translations } from "@/utils/translations";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'reminder' | 'alert' | 'info' | 'payment';
    is_read: boolean;
    created_at: string;
}

export function NotificationCenter() {
    const { user, language } = useAuth();
    const t = translations[language];
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Allowed types per user request (payments, overdue/reminders)
    const allowedTypes = ['payment', 'reminder', 'alert'];

    useEffect(() => {
        if (!user) return;

        // 1. Initial Fetch
        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .in('type', allowedTypes) // Filter only relevant ones
                .order('created_at', { ascending: false })
                .limit(20);

            if (data) {
                setNotifications(data as Notification[]);
                setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
            }
        };

        fetchNotifications();

        // 2. Realtime Subscription
        const channel = supabase
            .channel('notifications-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    const newNotif = payload.new as Notification;

                    // Only process if type is allowed
                    if (allowedTypes.includes(newNotif.type)) {
                        setNotifications(prev => [newNotif, ...prev]);
                        setUnreadCount(prev => prev + 1);
                        toast.info(newNotif.title, { description: newNotif.message });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, language]);

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    };

    const deleteNotification = async (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        // If it was unread, decrease count
        const wasUnread = notifications.find(n => n.id === id)?.is_read === false;
        if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));

        await supabase.from('notifications').delete().eq('id', id);
    };

    const markAllRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;

        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);

        await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full w-10 h-10 hover:bg-muted/50 transition-colors">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-2xl shadow-xl border-border/50" align="end">
                <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/30">
                    <h4 className="font-black text-sm tracking-tight">{t.notifications_title}</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllRead}
                            className="text-[10px] font-bold uppercase tracking-widest text-primary h-6 px-2 hover:bg-primary/10 rounded-lg"
                        >
                            {t.mark_all_read}
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground px-6 text-center">
                            <Bell className="w-8 h-8 opacity-20 mb-3" />
                            <p className="text-xs font-medium">{t.no_new_notifications}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={cn(
                                        "p-4 hover:bg-muted/30 transition-colors relative group",
                                        !notif.is_read && "bg-primary/5"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full mt-2 shrink-0",
                                            notif.type === 'alert' ? 'bg-red-500' :
                                                notif.type === 'payment' ? 'bg-emerald-500' : 'bg-primary'
                                        )} />
                                        <div className="flex-1 space-y-1">
                                            <p className={cn("text-xs font-bold leading-none", !notif.is_read && "text-foreground")}>
                                                {notif.title}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground leading-snug">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/60 font-medium">
                                                {new Date(notif.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notif.is_read && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 rounded-full hover:bg-primary/10 text-primary"
                                                onClick={() => markAsRead(notif.id)}
                                            >
                                                <Check className="w-3 h-3" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 rounded-full hover:bg-red-50 text-red-500"
                                            onClick={() => deleteNotification(notif.id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
