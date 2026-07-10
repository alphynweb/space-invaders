import { defineConfig } from 'vite';

export default defineConfig({
  root: './',          // Project root - where to find index.html

  base: '/space-invaders/',

  build: {
    outDir: 'dist',    // Output path
  }
});