import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/proxy': {
            target: env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/proxy/, ''),
          },
        },
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'icon.svg'],
          devOptions: {
            enabled: true
          },
          manifest: {
            name: 'Structura AI Todo',
            short_name: 'Structura',
            description: 'AI-powered brutalist todo list',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            icons: [
              {
                src: 'icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.API_KEY || env.OPENAI_API_KEY || env.GEMINI_API_KEY),
        'process.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY),
        'process.env.OPENAI_BASE_URL': JSON.stringify(env.OPENAI_BASE_URL),
        'process.env.OPENAI_MODEL_NAME': JSON.stringify(env.OPENAI_MODEL_NAME),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        // Also expose to import.meta.env for client-side usage
        'import.meta.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY),
        'import.meta.env.OPENAI_BASE_URL': JSON.stringify(env.OPENAI_BASE_URL),
        'import.meta.env.OPENAI_MODEL_NAME': JSON.stringify(env.OPENAI_MODEL_NAME),
        'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.API_KEY': JSON.stringify(env.API_KEY || env.OPENAI_API_KEY || env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
