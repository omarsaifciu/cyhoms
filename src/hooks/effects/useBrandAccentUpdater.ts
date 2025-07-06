
import { useEffect } from "react";
import { hexToHsl, hexToRgb } from "@/utils/colorUtils";

export const useBrandAccentUpdater = (brandAccentColor?: string) => {
  useEffect(() => {
    if (brandAccentColor) {
      const hsl = hexToHsl(brandAccentColor);
      const rgb = hexToRgb(brandAccentColor);

      if (hsl) {
        document.documentElement.style.setProperty('--brand-accent-h', `${hsl.h}`);
        document.documentElement.style.setProperty('--brand-accent-s', `${hsl.s}%`);
        document.documentElement.style.setProperty('--brand-accent-l', `${hsl.l}%`);
      }
      if (rgb) {
        document.documentElement.style.setProperty('--brand-accent-r', `${rgb.r}`);
        document.documentElement.style.setProperty('--brand-accent-g', `${rgb.g}`);
        document.documentElement.style.setProperty('--brand-accent-b', `${rgb.b}`);
      }
      // Assuming foreground color is always white for simplicity, can be made dynamic if needed
      document.documentElement.style.setProperty('--brand-accent-foreground-h', '0');
      document.documentElement.style.setProperty('--brand-accent-foreground-s', '0%');
      document.documentElement.style.setProperty('--brand-accent-foreground-l', '100%');
    }
  }, [brandAccentColor]);
};
