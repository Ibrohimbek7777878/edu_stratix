/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',     // Asosiy Ko'k rang (Yashil o'rniga)
        primaryDark: '#1E40AF', // To'qroq ko'k (hover uchun)
        secondary: '#FFFFFF',   // Oq rang
        surface: '#F8FAFC',     // Juda och kulrang fon
        textDark: '#1E293B',    // Qora matn
        textGray: '#64748B',    // Kulrang matn
      }
    },
  },
  plugins: [],
}