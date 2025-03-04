import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  // Get route from environment variable if specified
  const routeToRender = process.env.ROUTE_TO_RENDER;
  const buildType = process.env.BUILD_TYPE || 'csr'; // Default to CSR if not specified
  
  // Use an environment variable or generate a fixed timestamp
  const BUILD_TIME = process.env.BUILD_TIME || new Date().toLocaleString();
  process.env.VITE_BUILD_TIME = BUILD_TIME; // Make it available to the app
  
  return {
    plugins: [
      vue(),
      {
        name: 'build-time',
        transform(code) {
          return code.replace(/__BUILD_TIME__/g, BUILD_TIME);
        }
      }
    ],
    build: {
      outDir: buildType === 'ssg' ? 'dist-ssg' : 'dist-csr',
      rollupOptions: {
        input: {
          main: buildType === 'ssg' 
            ? resolve(__dirname, 'index.html') // For SSG, use the default entry
            : resolve(__dirname, 'index.html')  // For CSR, use the same entry but different main.js will be loaded
        }
      }
    },
    // Add server configuration for development and preview
    server: {
      historyApiFallback: true, // Important for SPA routing
    },
    preview: {
      port: 4173,
      historyApiFallback: true, // Important for SPA routing
    },
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      crittersOptions: {
        reduceInlineStyles: false,
      },
      // Only include the specified route if provided, otherwise use default
      includedRoutes: () => routeToRender ? [routeToRender] : ['/'],
      dirStyle: 'nested',
      format: 'esm',
      mode: 'production',
      mock: true,
      rootContainerId: 'app',
      concurrency: 10,
      onPageRendered: (route, html) => {
        console.log(`Pre-rendered: ${route}`);
        return html;
      }
    }
  }
})
