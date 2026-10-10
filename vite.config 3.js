import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        builder: resolve(root, 'circuit-builder.html'),
        teleportation: resolve(root, 'teleportation.html'),
        grover: resolve(root, 'grover.html'),
      },
    },
  },
});
