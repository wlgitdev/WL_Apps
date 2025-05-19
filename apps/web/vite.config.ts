import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env files based on mode
  const env = loadEnv(mode, process.cwd(), '');

  // Load the server's .env file in development
  if (mode === 'development') {
    const serverEnv = loadEnv(mode, resolve(__dirname, '../server'), '');
    // Merge server env with current env
    Object.assign(env, serverEnv);
  }

  const backendPort = env.PORT || '8080';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@wl-apps/types': fileURLToPath(
          new URL('../../packages/types/src', import.meta.url)
        ),
        '@wl-apps/utils': fileURLToPath(
          new URL('../../packages/utils/src', import.meta.url)
        ),
        '@wl-apps/schema-to-ui': fileURLToPath(
          new URL('../../packages/schema-to-ui/src', import.meta.url)
        ),
        '@wl-apps/server': fileURLToPath(new URL('../server', import.meta.url)),
        '@components': fileURLToPath(
          new URL('./src/components', import.meta.url)
        ),
        '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
        '@config': fileURLToPath(new URL('./src/config', import.meta.url)),
        '@context': fileURLToPath(new URL('./src/context', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url))
      }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true
        }
      }
    },
    // Define build-time env variable defaults
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL || '/api')
    }
  };
});
