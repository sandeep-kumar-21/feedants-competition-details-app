/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005B64',
          dark: '#00454D',
          light: '#E8F6F6',
          muted: '#B2DFDB',
        },
        cyanAccent: {
          DEFAULT: '#007A87',
          light: '#EBF7F7',
          border: '#CDEAEA',
        },
        mint: {
          DEFAULT: '#EAF8F4',
          border: '#C6EFE4',
          text: '#00626B',
        },
        gold: '#F59E0B',
        emerald: '#10B981',
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        'inter-extrabold': ['Inter_800ExtraBold'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '20px',
      },
    },
  },
  plugins: [],
};
