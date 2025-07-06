
import { Loader2 } from "lucide-react";

const FavoritesLoading = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-24 relative overflow-hidden transition-all duration-500"
      style={{
        background: `
          linear-gradient(135deg,
            color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 3%, transparent),
            color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 2%, transparent)
          ),
          linear-gradient(to bottom right,
            #fafbff 0%,
            #f1f5f9 50%,
            #e2e8f0 100%
          )
        `,
        // Dark mode background
        ...(typeof window !== 'undefined' && document.documentElement.classList.contains('dark') && {
          background: `
            linear-gradient(135deg,
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent),
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 5%, transparent)
            ),
            linear-gradient(to bottom right,
              #0f172a 0%,
              #1e293b 50%,
              #334155 100%
            )
          `
        })
      }}
    >
      <div className="flex flex-col items-center space-y-4">
        <Loader2
          className="w-16 h-16 animate-spin"
          strokeWidth={3}
          style={{ color: 'var(--brand-gradient-from-color)' }}
        />
        <p className="text-slate-600 dark:text-slate-300 font-medium text-lg tracking-wide">...Loading</p>
      </div>
    </div>
  );
};

export default FavoritesLoading;
