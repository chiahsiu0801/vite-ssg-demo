import { ViteSSG } from 'vite-ssg'
import './style.css'
import App from './App.vue'

// Define your routes
const routes = [
  {
    path: '/',
    component: () => import('./pages/Home.vue'),
    // This route will be prerendered with SSG
    meta: {
      prerender: true
    }
  },
  // Add more routes as needed
]

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, routes, isClient, initialState }) => {
    // During SSG build, import.meta.env.SSR will be true
    // During client-side rendering, it will be false
    const isSsgBuild = import.meta.env.SSR;
    
    // Custom initialization logic here
    if (!isSsgBuild) {
      console.log('Running in hydration mode after SSG');
    } else {
      console.log('Running in SSG build process');
      // Log which routes are being prerendered
      routes.forEach(route => {
        if (route.meta?.prerender) {
          console.log(`Route ${route.path} will be prerendered`);
        } else {
          console.log(`Route ${route.path} will NOT be prerendered`);
        }
      });
    }
  }
) 