export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        paper: '#f8fafc',
        accent: '#ea580c'
      },
      boxShadow: {
        glow: '0 20px 60px rgba(15, 23, 42, 0.15)'
      }
    }
  },
  plugins: []
};