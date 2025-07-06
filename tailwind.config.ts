
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
        'brand-accent': 'hsl(var(--brand-accent-h) var(--brand-accent-s) var(--brand-accent-l))',
        'brand-accent-light': 'hsl(var(--brand-accent-h) var(--brand-accent-s) 96%)',
        'brand-accent-light-hover': 'hsl(var(--brand-accent-h) var(--brand-accent-s) 92%)',
        'brand-accent-foreground': 'hsl(var(--brand-accent-foreground-h) var(--brand-accent-foreground-s) var(--brand-accent-foreground-l))',
        'brand-gradient-from': 'var(--brand-gradient-from-color)',
        'brand-gradient-to': 'var(--brand-gradient-to-color)',
        'brand-gradient-from-light': 'var(--brand-gradient-from-light)',
        'brand-gradient-to-light': 'var(--brand-gradient-to-light)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95) translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1) translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(50px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) scale(1)'
					},
					'50%': {
						transform: 'translateY(-10px) scale(1.02)'
					}
				},
				'pulse-soft': {
					'0%, 100%': {
						opacity: '1',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.7',
						transform: 'scale(1.05)'
					}
				},
				'bounce-subtle': {
					'0%, 100%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'translateY(-5px)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'gradient': {
					'0%, 100%': {
						backgroundSize: '200% 200%',
						backgroundPosition: 'left center'
					},
					'50%': {
						backgroundSize: '200% 200%',
						backgroundPosition: 'right center'
					}
				},
				'spin-slow': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'50%': {
						transform: 'translateY(-15px) rotate(2deg)'
					}
				},
				'float-delayed': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'50%': {
						transform: 'translateY(-12px) rotate(-1deg)'
					}
				},
				'float-slow': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'50%': {
						transform: 'translateY(-20px) rotate(1deg)'
					}
				},
				'float-delayed-slow': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'50%': {
						transform: 'translateY(-18px) rotate(-2deg)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.8s ease-out forwards',
				'scale-in': 'scale-in 0.6s ease-out forwards',
				'slide-up': 'slide-up 0.7s ease-out forwards',
				'float': 'float 6s ease-in-out infinite',
				'float-delayed': 'float-delayed 7s ease-in-out infinite 1s',
				'float-slow': 'float-slow 8s ease-in-out infinite',
				'float-delayed-slow': 'float-delayed-slow 9s ease-in-out infinite 2s',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'bounce-subtle': 'bounce-subtle 2s infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'gradient': 'gradient 3s ease infinite',
				'spin-slow': 'spin-slow 3s linear infinite'
			},
			backdropBlur: {
				xs: '2px'
			},
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'cairo': ['Cairo', 'sans-serif']
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem'
			},
			boxShadow: {
				'3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
				'4xl': '0 50px 100px -20px rgba(0, 0, 0, 0.25)',
				'glow': '0 0 20px rgba(236, 72, 153, 0.3)',
				'glow-lg': '0 0 40px rgba(236, 72, 153, 0.4)',
        'brand-glow': '0 0 15px hsl(var(--brand-accent-h) var(--brand-accent-s) var(--brand-accent-l) / 40%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
