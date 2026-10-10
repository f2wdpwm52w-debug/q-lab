import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        builder: resolve(import.meta.dirname, 'circuit-builder.html'),
        teleportation: resolve(import.meta.dirname, 'teleportation.html'),
        grover: resolve(import.meta.dirname, 'grover.html'),
      },
    },
  },
});
