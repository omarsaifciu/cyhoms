
/**
 * تطبيق الثيم واطلاق حدث تغيير يدوي ليستمع له useApplyUserTheme
 */
export function applyThemeAndDispatchEvent(setTheme: (theme: "dark" | "light" | "system") => void, value: "dark" | "light" | "system") {
  setTheme(value);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("user-themed-changed-manually"));
  }
}
