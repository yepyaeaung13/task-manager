module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}", // Adjust paths based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111927',
        secondary: '#F9FAFB',
        borderColor: "#E5E7EB",
        primaryText: "#0A56BB",
      },
      fontFamily: {
        pyidaungsu: ['Pyidaungsu', 'sans-serif'],
      },
    },
  },
  plugins: [],
};