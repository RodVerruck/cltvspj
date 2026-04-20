/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f5f1e8',
          dark: '#ebe5d6',
          darker: '#ddd4c0',
        },
        ink: {
          DEFAULT: '#1a1614',
          muted: '#6b6357',
          fade: '#a8a192',
        },
        rule: {
          DEFAULT: '#d4cdbe',
          strong: '#b8afa0',
          'stronger': '#a8a192',
        },
        surface: {
          DEFAULT: '#ffffff',
        },
        money: {
          DEFAULT: '#0c4a3e',
          hover: '#0a3d33',
          light: '#e6efe9',
        },
        hot: {
          DEFAULT: '#c2410c',
          light: '#fce8dc',
        },
        // Mantém brand e accent existentes como legado por enquanto (sem usar nas páginas novas)
        brand: {
          50: '#eff6ff',
          400: '#60a5fa',
          500: '#1e40af',
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Escala editorial para grandes números/títulos
        'display-xl': ['clamp(80px, 14vw, 200px)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(48px, 7vw, 104px)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(36px, 5vw, 64px)', { lineHeight: '1.0', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(28px, 3.5vw, 44px)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        'editorial': '-0.02em',
        'mono-wide': '0.02em',
        'label': '0.12em',
      },
    },
  },
  plugins: [],
}