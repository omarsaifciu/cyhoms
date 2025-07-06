
import { useState, useEffect, useCallback } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
import { firebaseConfig, VAPID_KEY } from "@/firebase/firebaseConfig";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export function useWebPushNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isProcessing, setIsProcessing] = useState(false);

  const checkSubscriptionStatus = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);
      if (currentPermission === 'granted') {
        try {
          const messaging = firebase.messaging();
          const token = await messaging.getToken({ vapidKey: VAPID_KEY });
          setIsSubscribed(!!token);
        } catch (e: any) {
          console.error("Error checking subscription status", e);
          // Handle InvalidAccessError gracefully
          if (e.code === 'messaging/invalid-vapid-key' || e.name === 'InvalidAccessError') {
            console.warn("Push notifications not available or invalid VAPID key");
          }
          setIsSubscribed(false);
        }
      } else {
        setIsSubscribed(false);
      }
    }
  }, []);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  const setupPushNotifications = useCallback(async () => {
    if (!user) {
      toast({ title: t('error'), description: "الرجاء تسجيل الدخول لتفعيل الإشعارات.", variant: "destructive" });
      return;
    }
    if (!("serviceWorker" in navigator) || !("Notification" in window) || !("PushManager" in window)) {
      toast({ title: t('error'), description: "متصفحك لا يدعم خاصية الإشعارات.", variant: "destructive" });
      return;
    }
    
    setIsProcessing(true);
    try {
      await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      await navigator.serviceWorker.ready;
      const messaging = firebase.messaging();
      const currentPermission = await Notification.requestPermission();
      setPermission(currentPermission);

      if (currentPermission === "granted") {
        toast({ title: t('success'), description: t('notificationsEnableSuccess') });
        const token = await messaging.getToken({ vapidKey: VAPID_KEY });
        if (token) {
          const { data } = await supabase.from("user_push_tokens").select("id").eq("user_id", user.id).eq("web_push_token", token).single();
          if (!data) {
            await supabase.from("user_push_tokens").insert({ user_id: user.id, web_push_token: token, device_info: window.navigator.userAgent });
          }
          setIsSubscribed(true);
        }
      } else {
        toast({ title: t('error'), description: "تم رفض إذن الإشعارات.", variant: "destructive" });
      }
    } catch (err: any) {
      console.error("An error occurred while setting up notifications: ", err);
      // Handle specific errors gracefully
      if (err.code === 'messaging/invalid-vapid-key' || err.name === 'InvalidAccessError') {
        console.warn("Push notifications not available or invalid VAPID key");
        toast({ title: t('error'), description: "الإشعارات غير متاحة في هذا المتصفح.", variant: "destructive" });
      } else {
        toast({ title: t('error'), description: "حدث خطأ أثناء تفعيل الإشعارات.", variant: "destructive" });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [user, toast, t]);

  const disablePushNotifications = useCallback(async () => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      const messaging = firebase.messaging();
      const token = await messaging.getToken({ vapidKey: VAPID_KEY });
      if (token) {
        await supabase.from('user_push_tokens').delete().eq('web_push_token', token);
      }
      const success = await messaging.deleteToken();
      if (success) {
        toast({ title: t('success'), description: t('notificationsDisabledSuccess') });
        setIsSubscribed(false);
      } else {
        toast({ title: t('error'), description: t('notificationsDisabledError'), variant: 'destructive' });
      }
    } catch (err) {
      console.error("An error occurred while disabling notifications: ", err);
      toast({ title: t('error'), description: t('notificationsDisabledError'), variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  }, [user, toast, t]);

  useEffect(() => {
    if (!user) return;
    const messaging = firebase.messaging();
    const unsubscribe = messaging.onMessage((payload) => {
      console.log("Message received in foreground. ", payload);
      toast({
        title: payload.notification?.title || t('newNotification'),
        description: payload.notification?.body || "",
      });
    });
    return () => unsubscribe();
  }, [user, toast, t]);

  return { setupPushNotifications, disablePushNotifications, isSubscribed, permission, isProcessing };
}
