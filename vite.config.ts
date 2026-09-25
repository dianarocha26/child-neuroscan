import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Stamps a unique build id into dist/sw.js (replacing `__BUILD_ID__`) so each
 * deploy gets fresh cache names and the worker's `activate` purges old caches.
 */
function swBuildIdPlugin(): Plugin {
  let outDir = 'dist';
  const buildId =
    (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 12) + '-' + Date.now().toString(36);
  return {
    name: 'sw-build-id',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const swPath = resolve(outDir, 'sw.js');
      if (!existsSync(swPath)) return;
      const source = readFileSync(swPath, 'utf8');
      if (!source.includes('__BUILD_ID__')) {
        throw new Error('sw-build-id: __BUILD_ID__ placeholder not found in sw.js');
      }
      writeFileSync(swPath, source.replaceAll('__BUILD_ID__', buildId.replace(/^-/, '')));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), swBuildIdPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'icons-vendor': ['lucide-react']
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.');
          const ext = info?.[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      }
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false
  },
  server: {
    port: 5173,
    strictPort: false,
    open: false
  },
  preview: {
    port: 4173,
    strictPort: false,
    open: false
  }
});
