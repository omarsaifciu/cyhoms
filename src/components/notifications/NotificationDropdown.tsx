
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, BellDot } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useLanguage } from "@/contexts/LanguageContext";

interface Notification {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type: string;
  related_property_id?: string;
  related_comment_id?: string;
}

const NotificationDropdown = () => {
  const { user } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getLocale = useCallback(() => {
    switch (currentLanguage) {
      case "ar":
        return "ar-EG";
      case "en":
        return "en-US";
      case "tr":
        return "tr-TR";
      default:
        return "en-US";
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`realtime-notifications:${user.id}`)
      .on<Notification>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new;
          setNotifications((prev) => [newNotification, ...prev]);

          toast(t('newNotification'), {
            description: newNotification.message.replace(/:?\{\{content\}\}/g, ''),
            action: newNotification.related_property_id ? {
              label: t('view'),
              onClick: () => navigate(`/property/${newNotification.related_property_id}`)
            } : undefined
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, t, navigate, getLocale]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    setNotifications(data || []);
    setLoading(false);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleOpenChange = async (newOpenState: boolean) => {
    setOpen(newOpenState);
    if (newOpenState && unreadCount > 0) {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      if (unreadIds.length) {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .in("id", unreadIds);
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      }
    }
  };

  // 👇 Move the early return after all hooks are defined
  if (!user) return null;

  const NotificationIcon = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<"button">
  >((props, ref) => (
    <button
      ref={ref}
      aria-label="Notifications"
      className={`
        relative
        flex items-center justify-center
        rounded-full
        border-0
        bg-transparent
        p-0
        w-10 h-10
        hover:bg-gray-100 dark:hover:bg-[#23293d]
        transition-colors
        outline-none
        focus-visible:ring-2
        focus-visible:ring-brand-accent
      `}
      style={{
        boxShadow: 'none',
      }}
      {...props}
      type="button"
    >
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center border-2 border-white dark:border-[#0b1421] z-10">
          {unreadCount}
        </span>
      )}
      {unreadCount > 0 ? (
        <BellDot className="w-5 h-5 text-gray-800 dark:text-white transition-colors" />
      ) : (
        <Bell className="w-5 h-5 text-gray-800 dark:text-white transition-colors" />
      )}
    </button>
  ));
  NotificationIcon.displayName = "NotificationIcon";

  const NotificationList = () => (
    <>
      <div className="divide-y">
        {loading ? (
          <div className="px-4 py-3 text-gray-400">{t("loadingNotifications")}</div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-3 text-gray-400">{t("noNotificationsCurrently")}</div>
        ) : (
          notifications.map(n => (
            <Link
              to={n.related_property_id ? `/property/${n.related_property_id}` : "#"}
              className={`flex px-4 py-3 items-start gap-2 hover:bg-emerald-50 dark:hover:bg-[#23293d] transition rounded ${n.is_read ? "opacity-70" : "font-bold"}`}
              key={n.id}
              onClick={() => setOpen(false)}
            >
              <div className="flex-shrink-0 pt-1">
                {n.is_read ? <Bell className="w-5 h-5 text-emerald-400" /> : <BellDot className="w-5 h-5 text-rose-600" />}
              </div>
              <div className="flex-1">
                <div>{n.message.replace(/:?\{\{content\}\}/g, '')}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString(getLocale())}</div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );

  if (isMobile === undefined) {
    return (
      <button
        aria-label="Notifications"
        className={`
          relative flex items-center justify-center rounded-full
          border-0 bg-transparent p-0 w-10 h-10
        `}
        style={{ boxShadow: "none" }}
        type="button"
        tabIndex={-1}
        disabled
      >
        <Bell className="w-6 h-6 text-gray-800 dark:text-white transition-colors" />
      </button>
    );
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <NotificationIcon />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t("notifications")}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 max-h-[80vh] overflow-y-auto">
            <NotificationList />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <NotificationIcon onClick={() => handleOpenChange(!open)} />
      {open && (
        <div className="absolute z-50 right-0 mt-2 w-80 shadow-lg border bg-white dark:bg-[#181c23] rounded-xl py-3 max-h-96 overflow-y-auto">
          <div className="px-4 pt-2 pb-1 font-bold text-gray-800 dark:text-white">{t("notifications")}</div>
          <NotificationList />
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
