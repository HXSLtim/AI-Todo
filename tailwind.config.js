/**
 * Tailwind CSS 配置文件
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        // 保留brutalist风格的颜色主题
        primary: '#000000',
        secondary: '#ffffff',
      },
    },
  },
  plugins: [],
}
