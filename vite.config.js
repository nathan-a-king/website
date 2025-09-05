import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import markdownPostsPlugin from './scripts/vite-plugin-markdown-posts.js'
import prerenderPlugin from './scripts/vite-plugin-prerender.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), markdownPostsPlugin(), prerenderPlugin()],
  server: {
    port: 3000,
    open: false
  },
  preview: {
    port: 3000,
    open: false
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          markdown: ['react-markdown'],
          syntax: ['react-syntax-highlighter'], // Separate chunk for syntax highlighter
          icons: ['lucide-react']
        },
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          return `assets/${chunkInfo.name}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    }
  },
  base: '/'
})
