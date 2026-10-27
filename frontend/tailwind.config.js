/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        whatsapp: {
          dark: '#111b21',
          panel: '#202c33',
          chat: '#0b141a',
          bubbleOut: '#005c4b',
          bubbleIn: '#202c33',
          green: '#25D366',
          teal: '#128C7E',
          accent: '#00a884',
          subtext: '#8696a0'
        },
        rcs: {
          dark: '#1e1f22',
          panel: '#2b2d31',
          bubbleOut: '#1a73e8',
          bubbleIn: '#383a40',
          accent: '#4285F4'
        },
        aws: {
          squid: '#232f3e',
          orange: '#ff9900',
          dark: '#0f172a',
          card: '#1e293b'
        }
      }
    },
  },
  plugins: [],
}
