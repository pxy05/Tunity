import { createApp } from 'vue'
import App from './App.vue'
import './global.css'
import '@fontsource/michroma'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes, // Use the generated routes
})

app.use(router)
app.mount('#app')
