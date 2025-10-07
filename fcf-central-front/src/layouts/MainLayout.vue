<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-fcf-blue text-white flex flex-col">
      <!-- Logo -->
      <div class="p-6 border-b border-fcf-blue-light">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-fcf-gold rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h1 class="font-heading font-bold text-lg">FCF Central</h1>
            <p class="text-xs text-fcf-gold-light">Controle Financeiro</p>
          </div>
        </div>
      </div>

      <!-- Navegação -->
      <nav class="flex-1 p-4 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
          :class="isActive(item.path) ? 'bg-fcf-blue-light text-white' : 'text-gray-300 hover:bg-fcf-blue-light/50 hover:text-white'"
        >
          <component :is="item.icon" :size="20" />
          <span class="font-medium">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- User Info -->
      <div class="p-4 border-t border-fcf-blue-light">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-fcf-gold rounded-full flex items-center justify-center">
              <span class="text-white font-semibold">{{ userInitials }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ authStore.usuario?.nome }}</p>
              <p class="text-xs text-fcf-gold-light">{{ authStore.usuario?.role === 'admin' ? 'Administrador' : 'Usuário' }}</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="p-2 hover:bg-fcf-blue-light rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut :size="18" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  LayoutDashboard, 
  TrendingDown, 
  TrendingUp, 
  Target,
  FileText,
  LogOut
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const menuItems = computed(() => {
  const items = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/despesas', label: 'Despesas', icon: TrendingDown },
    { path: '/receitas', label: 'Receitas', icon: TrendingUp },
    { path: '/relatorios', label: 'Relatórios', icon: FileText }
  ]

  if (authStore.isAdmin) {
    items.splice(3, 0, { path: '/orcamentos', label: 'Orçamentos', icon: Target })
  }

  return items
})

const userInitials = computed(() => {
  const nome = authStore.usuario?.nome || ''
  return nome
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

function isActive(path) {
  return route.path === path
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>