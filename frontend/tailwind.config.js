// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A68B68", // Beige
        secondary: "#4F3A24", // Marrón oscuro
        accent: "#D4AF37", // Dorado
        background: "#F5F5DC", // Fondo beige claro
        textPrimary: "#000000", // Texto negro
        gold: {
          500: "#b29600",
          600: "#8a7300", // Ajustar el color dorado para que sea más suave
        },
        darkGold: {
          500: "#514600",
          600: "#3c3500",
        },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
