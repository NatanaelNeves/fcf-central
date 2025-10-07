import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'despesas',
        name: 'Despesas',
        component: () => import('@/views/Despesas.vue')
      },
      {
        path: 'receitas',
        name: 'Receitas',
        component: () => import('@/views/Receitas.vue')
      },
      {
        path: 'orcamentos',
        name: 'Orcamentos',
        component: () => import('@/views/Orcamentos.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'relatorios',
        name: 'Relatorios',
        component: () => import('@/views/Relatorios.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router