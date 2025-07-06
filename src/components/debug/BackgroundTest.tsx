import { House } from "lucide-react";

const BackgroundTest = () => {
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
      }}
    >
      {/* Animated background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient overlays */}
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-10"
          style={{
            background: `linear-gradient(135deg, 
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent) 0%, 
              transparent 50%, 
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 5%, transparent) 100%
            )`
          }}
        />
        
        {/* Floating orbs */}
        <div 
          className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl animate-pulse opacity-10 dark:opacity-15"
          style={{
            background: `linear-gradient(135deg, 
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent), 
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 6%, transparent)
            )`
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 opacity-8 dark:opacity-12"
          style={{
            background: `linear-gradient(135deg, 
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 6%, transparent), 
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 5%, transparent)
            )`
          }}
        />
        
        {/* Floating house icons with hero animations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-16 animate-float opacity-15 dark:opacity-25">
            <House className="w-8 h-8" style={{ color: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 40%, transparent)' }} />
          </div>
          <div className="absolute top-32 right-24 animate-float-delayed opacity-12 dark:opacity-20">
            <House className="w-6 h-6" style={{ color: 'color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 35%, transparent)' }} />
          </div>
          <div className="absolute bottom-24 left-32 animate-float-slow opacity-10 dark:opacity-18">
            <House className="w-10 h-10" style={{ color: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 30%, transparent)' }} />
          </div>
          <div className="absolute bottom-40 right-16 animate-float-delayed-slow opacity-8 dark:opacity-15">
            <House className="w-7 h-7" style={{ color: 'color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 25%, transparent)' }} />
          </div>
          <div className="absolute top-1/2 right-1/4 animate-float opacity-6 dark:opacity-12">
            <House className="w-5 h-5" style={{ color: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 20%, transparent)' }} />
          </div>
        </div>
        
        {/* Subtle floating particles */}
        <div 
          className="absolute top-32 right-1/4 w-3 h-3 rounded-full animate-bounce opacity-20 dark:opacity-30"
          style={{ background: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 25%, transparent)' }}
        />
        <div 
          className="absolute bottom-40 left-1/3 w-2 h-2 rounded-full animate-bounce delay-300 opacity-15 dark:opacity-25"
          style={{ background: 'color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 20%, transparent)' }}
        />
        <div 
          className="absolute top-2/3 right-1/3 w-1 h-1 rounded-full animate-ping delay-700 opacity-25 dark:opacity-35"
          style={{ background: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 30%, transparent)' }}
        />
      </div>
      
      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Background Test
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Testing the animated background with floating houses
        </p>
      </div>
    </div>
  );
};

export default BackgroundTest;
