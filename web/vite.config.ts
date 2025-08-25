import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'
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
    
    // Compression plugins for better performance
    ...(process.env.NODE_ENV === 'production' ? [
      compression({
        algorithm: 'gzip',
        exclude: [/\.(br)$ /, /\.(gz)$/]
      }),
      compression({
        algorithm: 'brotliCompress',
        exclude: [/\.(br)$ /, /\.(gz)$/]
      })
    ] : []),
    
    // Bundle analyzer for optimization insights
    process.env.ANALYZE && visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Advanced caching strategies
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheKeyWillBeUsed: async ({ request }) => `${request.url}?version=1`
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-static-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false // Disable in development to avoid errors
      }
    })
  ].filter(Boolean),
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
    // Enable aggressive compression and optimization
    minify: 'esbuild',
    cssMinify: true,
    
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Dynamic vendor chunking for better tree shaking
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@headlessui') || id.includes('@heroicons')) {
              return 'ui-vendor';
            }
            if (id.includes('supabase')) {
              return 'supabase-vendor';
            }
            return 'vendor';
          }
          
          // Feature-based chunking with dynamic imports
          if (id.includes('/pages/auth/') || id.includes('/components/auth/') || id.includes('AppContext')) {
            return 'auth';
          }
          if (id.includes('/pages/cliente/')) {
            return 'client';
          }
          if (id.includes('/pages/admin/') || id.includes('/pages/staff/')) {
            return 'admin';
          }
          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }
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
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${extType}`;
          }
          return `assets/[name]-[hash].${extType}`;
        }
      },
      // Tree shaking optimization
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    
    // Target modern browsers for better optimization
    target: ['esnext', 'chrome90', 'firefox88', 'safari14'],
    
    // Aggressive asset optimization
    assetsInlineLimit: 2048, // Reduced for better caching
    
    // Disable source maps in production for performance
    sourcemap: false,
    
    // Advanced CSS code splitting
    cssCodeSplit: true,
    
    // Report bundle size
    reportCompressedSize: true,
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000
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