import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
      meta: {
        title: '登录',
        hidden: true,
      },
    },
    {
      path: '/doubao',
      name: 'Doubao',
      component: () => import('@/views/doubao/index.vue'),
      meta: {
        title: '豆包',
        hidden: true,
      },
    },

  ],
})

export default router
