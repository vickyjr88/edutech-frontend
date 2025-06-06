
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
				kidato: {
					// Indigo #5c64d4 - Primary brand color
					indigo: {
						50: '#f1f2ff',
						100: '#e6e8ff',
						200: '#d1d5ff',
						300: '#acb4e4', // Spindle color
						400: '#8891e0',
						500: '#5c64d4', // Primary Indigo
						600: '#4c54c4',
						700: '#3d45b4',
						800: '#2e3693',
						900: '#1f2772',
						DEFAULT: '#5c64d4'
					},
					// Tree Poppy #fc9323 - Secondary brand color
					orange: {
						50: '#fff7ed',
						100: '#ffedd5',
						200: '#fed7aa',
						300: '#fdba74',
						400: '#fc9323', // Tree Poppy
						500: '#fc9323', // Primary Orange
						600: '#ea790b',
						700: '#c2610c',
						800: '#9a4e12',
						900: '#7c3f14',
						DEFAULT: '#fc9323'
					},
					// Athens Gray #efebf0 - Neutral color
					gray: {
						50: '#f9f7fa',
						100: '#efebf0', // Athens Gray
						200: '#e5dfe6',
						300: '#dbd3dc',
						400: '#d1c7d2',
						500: '#c7bbc8',
						600: '#a8969a',
						700: '#89717c',
						800: '#6a4c5e',
						900: '#4b2740',
						DEFAULT: '#efebf0'
					},
					// Spindle #acb4e4 - Light accent color
					spindle: {
						50: '#f7f8ff',
						100: '#eef0ff',
						200: '#dde1ff',
						300: '#acb4e4', // Spindle
						400: '#9ba3e0',
						500: '#8a92dc',
						600: '#7981d8',
						700: '#6870d4',
						800: '#575fd0',
						900: '#464ecc',
						DEFAULT: '#acb4e4'
					},
					// Legacy aliases for backward compatibility
					blue: '#5c64d4',
					purple: '#5c64d4',
					'light-blue': '#acb4e4',
					'dark-blue': '#3d45b4'
				}
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
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out'
			},
			fontFamily: {
				'nunito': ['Nunito', 'sans-serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
