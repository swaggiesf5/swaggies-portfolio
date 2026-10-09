import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    // three is ~550 kB minified (~137 kB gzip), about the same as the r128 CDN build it replaces.
    // It lives in its own chunk so content edits don't bust its cache.
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'three', test: /node_modules[\\/]three[\\/]/ }],
        },
      },
    },
  },
});
