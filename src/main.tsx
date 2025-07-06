
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { fetchSiteSettingsFromDB } from './services/siteSettingsApiService.ts';
import { hexToHsl, hexToRgb } from './utils/colorUtils.ts';
import { ThemeProvider } from "next-themes"; // أضف هذا السطر

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const applyTheme = (settings: { brandAccentColor?: string, gradientFromColor?: string, gradientToColor?: string }) => {
  const root = document.documentElement;

  const brandAccentColor = settings.brandAccentColor || '#ec489a';
  const gradientFromColor = settings.gradientFromColor || '#ec489a';
  const gradientToColor = settings.gradientToColor || '#f43f5e';
  
  // Apply brand accent color
  if (brandAccentColor) {
    const hsl = hexToHsl(brandAccentColor);
    const rgb = hexToRgb(brandAccentColor);
    if (hsl) {
      root.style.setProperty('--brand-accent-h', `${hsl.h}`);
      root.style.setProperty('--brand-accent-s', `${hsl.s}%`);
      root.style.setProperty('--brand-accent-l', `${hsl.l}%`);
      // Also set shadcn primary color to match brand accent
      root.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    }
    if (rgb) {
      root.style.setProperty('--brand-accent-r', `${rgb.r}`);
      root.style.setProperty('--brand-accent-g', `${rgb.g}`);
      root.style.setProperty('--brand-accent-b', `${rgb.b}`);
    }
  }
  root.style.setProperty('--brand-accent-foreground-h', '0');
  root.style.setProperty('--brand-accent-foreground-s', '0%');
  root.style.setProperty('--brand-accent-foreground-l', '100%');
  // Also set shadcn primary foreground to be legible on brand accent
  root.style.setProperty('--primary-foreground', '0 0% 100%');

  // Apply gradient colors
  if (gradientFromColor) {
    root.style.setProperty('--brand-gradient-from-color', gradientFromColor);
    const fromHsl = hexToHsl(gradientFromColor);
    if (fromHsl) {
      root.style.setProperty('--brand-gradient-from-light', `hsl(${fromHsl.h} ${fromHsl.s}% 96%)`);
    }
  }
  
  if (gradientToColor) {
    root.style.setProperty('--brand-gradient-to-color', gradientToColor);
    const toHsl = hexToHsl(gradientToColor);
    if (toHsl) {
      root.style.setProperty('--brand-gradient-to-light', `hsl(${toHsl.h} ${toHsl.s}% 96%)`);
    }
  }
};

const initializeApp = async () => {
  // Add shimmer animation for verified badge
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }
  `;
  document.head.append(style);

  try {
    const dbSettings = await fetchSiteSettingsFromDB();
    applyTheme(dbSettings);

    // Set Favicon from settings
    if (dbSettings.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = dbSettings.faviconUrl;
    }

  } catch (error) {
    console.error("Failed to fetch site settings, applying default theme.", error);
    applyTheme({}); // Apply hardcoded defaults
  } finally {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <App />
        </ThemeProvider>
      </StrictMode>
    );
  }
};

initializeApp();

