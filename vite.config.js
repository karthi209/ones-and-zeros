import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: mode === 'production' ? '/ones-and-zeros/' : '/', // Replace with your repo name
    server: {
      host: '0.0.0.0', // Allow access from external devices
      port: 5173,      // Your desired port
      strictPort: true, // Prevents automatic port switching
    },
  };
});
