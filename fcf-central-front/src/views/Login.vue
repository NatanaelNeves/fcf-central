<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-fcf-blue to-fcf-blue-light px-4">
    <div class="max-w-md w-full">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-fcf-gold rounded-full mb-4">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-heading font-bold text-white">FCF Central</h1>
        <p class="text-fcf-gold-light mt-2">Sistema de Controle Financeiro</p>
      </div>

      <!-- Card de Login -->
      <div class="card">
        <h2 class="text-2xl font-heading font-semibold text-gray-900 mb-6">Entrar</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input"
              placeholder="seu@email.com"
            />
          </div>

          <!-- Senha -->
          <div>
            <label for="senha" class="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="senha"
              v-model="form.senha"
              type="password"
              required
              class="input"
              placeholder="••••••••"
            />
          </div>

          <!-- Erro -->
          <div v-if="authStore.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ authStore.error }}</p>
          </div>

          <!-- Botão -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn btn-primary w-full"
          >
            <span v-if="!authStore.loading">Entrar</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </span>
          </button>
        </form>

        <!-- Dica -->
        <div class="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-xs text-blue-700">
            <strong>💡 Credenciais de teste:</strong><br>
            Admin: admin@fcf.com.br / senha123<br>
            User: usuario@fcf.com.br / senha123
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-fcf-gold-light text-sm mt-6">
        © 2025 Federação Cearense de Futebol
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  senha: ''
})

async function handleLogin() {
  const success = await authStore.login(form.email, form.senha)
  if (success) {
    router.push('/')
  }
}
</script>