
import { useEffect, useRef } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useTheme } from "next-themes";

/**
 * هوك عام لتطبيق تفضيل المستخدم للثيم فور تبدل المستخدم أو تغير الاعدادات أو على الفور بعد تسجيل الدخول مباشرةً.
 * يضمن أن تطبيق الثيم من البروفايل يتم مباشرة، إلا إذا كان المستخدم غيّر الثيم أثناء نفس الجلسة (إلا إذا تغيّر الحساب).
 */
const useApplyUserTheme = () => {
  const { profile } = useUserProfile();
  const { theme, setTheme } = useTheme();

  // حفظ بيانات آخر مستخدم قمنا بتطبيق ثيمه بالفعل (user id + theme_preference)
  const lastAppliedIdRef = useRef<string | null>(null);
  // مؤشر: هل استخدم المستخدم السويتش لتغيير الثيم (داخل الجلسة فقط - ليس بعد تبديل الحساب)
  const userInteractedRef = useRef(false);
  // مؤشر: ID المستخدم الأخير
  const lastUserIdRef = useRef<string | null>(null);

  // إذا قام المستخدم بتغيير الثيم يدويًا في أي مكان في الجلسة
  useEffect(() => {
    const handler = () => {
      userInteractedRef.current = true;
      // Log for debugging
      console.log("تم تغيير الثيم يدويًا عبر السويتش");
    };
    window.addEventListener("user-themed-changed-manually", handler);
    return () => window.removeEventListener("user-themed-changed-manually", handler);
  }, []);

  useEffect(() => {
    // فى كل مرة يتغير فيها الـ profile أو التفضيل، نطبق المنطق التالي:
    if (profile && profile.id) {
      // إذا دخل مستخدم جديد، أعد السماح بالتطبيق التلقائي!
      if (lastUserIdRef.current !== profile.id) {
        lastUserIdRef.current = profile.id;
        userInteractedRef.current = false;
        lastAppliedIdRef.current = null; // يجب إعادة التطبيق لو الحساب تغيّر
        console.log("مستخدم جديد أو تسجيل دخول جديد: " + profile.id);
      }

      // تطبيق الثيم إذا لم يكن هناك تفاعل يدوي حاليًا
      const identifier = `${profile.id}:${profile.theme_preference}`;
      if (!userInteractedRef.current) {
        // نطبق الثيم إذا لم نطبقه سابقًا *أو* هناك تغيير
        if (lastAppliedIdRef.current !== identifier || theme !== profile.theme_preference) {
          const userThemeMode =
            profile.theme_preference === "dark"
              ? "dark"
              : profile.theme_preference === "light"
              ? "light"
              : "system";
          setTheme(userThemeMode);
          lastAppliedIdRef.current = identifier;
          console.log(`[useApplyUserTheme] تم تطبيق الثيم "${userThemeMode}" بعد تسجيل الدخول`);
        }
      } else {
        console.log("[useApplyUserTheme] تجاهل تطبيق الثيم: المستخدم غيّر الثيم يدويًا في هذه الجلسة.");
      }
    }
  }, [profile?.id, profile?.theme_preference, setTheme, theme]);
};

export default useApplyUserTheme;

