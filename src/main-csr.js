import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Define your routes
const routes = [
  {
    path: '/',
    component: () => import('./pages/Home.vue')
  },
  {
    path: '/about',
    component: () => import('./pages/About.vue')
  },
  // Add more routes as needed
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Handle navigation errors - this helps with the index.html issue
router.onError((error) => {
  console.error('Router error:', error);
  // Redirect to home page if there's a navigation error
  if (error.type === 2) { // Navigation guard redirect
    router.push('/');
  }
});

// Create and mount the app
const app = createApp(App)
app.use(router)
app.mount('#app')

console.log('Running in CSR mode - client side rendering only') 