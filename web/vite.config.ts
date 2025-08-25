import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      // Remove console.log in production
      babel: {
        plugins: process.env.NODE_ENV === 'production' ? [
          ['transform-remove-console', { exclude: ['error', 'warn'] }]
        ] : []
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'ChefORG - Sistema de Restaurante',
        short_name: 'ChefORG',
        description: 'Sistema completo de gestão para restaurantes',
        theme_color: '#f97316',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      },
      devOptions: {
        enabled: false // Disable in development to avoid errors
      }
    })
  ],
  server: {
    port: 8110,
    host: true,
    cors: true
  },
  resolve: {
    alias: {
      '@cheforg/shared': path.resolve(__dirname, '../shared'),
    },
  },
  build: {
    outDir: 'dist',
    // Enable compression and optimization
    minify: 'esbuild',
    cssMinify: true,
    
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          
          // Feature-based chunks
          auth: [
            './src/pages/auth/Login.tsx',
            './src/components/auth/ProtectedRoute.tsx',
            './src/contexts/AppContext.tsx'
          ],
          client: [
            './src/pages/cliente/CheckinQR.tsx',
            './src/pages/cliente/PinMesa.tsx',
            './src/pages/cliente/CardapioMesa.tsx',
            './src/pages/cliente/ChegadaSemReserva.tsx',
            './src/pages/cliente/AcompanharPedido.tsx',
            './src/pages/cliente/Pagamento.tsx',
            './src/pages/cliente/Feedback.tsx'
          ],
          admin: [
            './src/pages/admin/Dashboard.tsx',
            './src/pages/staff/PainelCozinha.tsx',
            './src/pages/staff/PainelGarcom.tsx'
          ]
        },
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${extType}`;
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].${extType}`;
          }
          return `assets/[name]-[hash].${extType}`;
        }
      }
    },
    
    // Target modern browsers for better optimization
    target: 'esnext',
    
    // Compress assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    
    // Source maps for debugging (disable in production)
    sourcemap: false
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@cheforg/shared']
  },
  
  // CSS optimization
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  
  // Performance optimizations
  esbuild: {
    // Remove console.log and debugger in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  }
}) 