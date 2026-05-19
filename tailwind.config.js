/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        atomic: '#0F0F10',
        void: '#050507',
        surface: {
          1: '#16161A',
          2: '#1F1F23',
          3: '#2A2A2F'
        },
        brand: {
          DEFAULT: '#7D9772',
          bright: '#A8C49A',
          dim: '#5C7559'
        },
        signal: {
          info: '#74A9D8',
          warn: '#E0B85A',
          crit: '#E0775A',
          route: '#B592D8'
        }
      },
      fontFamily: {
        sans: [
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace'
        ]
      },
      letterSpacing: {
        eyebrow: '0.16em',
        wide2: '0.08em'
      },
      boxShadow: {
        glow: '0 0 24px rgba(125,151,114,0.45)',
        glowSoft: '0 0 14px rgba(125,151,114,0.25)',
        card: '0 10px 24px rgba(0,0,0,0.45)',
        hero: '0 20px 60px rgba(0,0,0,0.6)'
      },
      backgroundImage: {
        'edge-grad': 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02))',
        'brand-grad': 'linear-gradient(135deg, rgba(168,196,154,0.55), rgba(125,151,114,0.15))'
      },
      borderRadius: {
        pill: '999px',
        card: '16px',
        hero: '28px'
      },
      animation: {
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
        floatUp: 'floatUp 0.35s ease-out'
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' }
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};
