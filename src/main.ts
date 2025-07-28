import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/tailwindcss.css'
import '@/components/icon-font/iconfont'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
