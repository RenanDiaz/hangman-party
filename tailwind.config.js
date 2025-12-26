/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
					950: '#172554'
				},
				game: {
					correct: '#22c55e',
					incorrect: '#ef4444',
					pending: '#f59e0b',
					neutral: '#6b7280'
				}
			},
			animation: {
				'bounce-in': 'bounceIn 0.5s ease-out',
				'shake': 'shake 0.5s ease-in-out',
				'reveal': 'reveal 0.3s ease-out',
				'draw': 'draw 0.5s ease-out forwards'
			},
			keyframes: {
				bounceIn: {
					'0%': { transform: 'scale(0)', opacity: '0' },
					'50%': { transform: 'scale(1.1)' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				shake: {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-5px)' },
					'75%': { transform: 'translateX(5px)' }
				},
				reveal: {
					'0%': { transform: 'rotateX(90deg)', opacity: '0' },
					'100%': { transform: 'rotateX(0)', opacity: '1' }
				},
				draw: {
					'0%': { strokeDashoffset: '1000' },
					'100%': { strokeDashoffset: '0' }
				}
			}
		}
	},
	plugins: []
};
