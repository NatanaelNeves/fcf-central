import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const usuario = ref(JSON.parse(localStorage.getItem('usuario') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => usuario.value?.role === 'admin')

  async function login(email, senha) {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/auth/login', { email, senha })
      
      if (response.data.success) {
        token.value = response.data.data.token
        usuario.value = response.data.data.usuario
        
        localStorage.setItem('token', token.value)
        localStorage.setItem('usuario', JSON.stringify(usuario.value))
        
        return true
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao fazer login'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(dados) {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/auth/register', dados)
      
      if (response.data.success) {
        token.value = response.data.data.token
        usuario.value = response.data.data.usuario
        
        localStorage.setItem('token', token.value)
        localStorage.setItem('usuario', JSON.stringify(usuario.value))
        
        return true
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao registrar'
      return false
    } finally {
      loading.value = false
    }
  }

  async function getMe() {
    try {
      const response = await api.get('/auth/me')
      if (response.data.success) {
        usuario.value = response.data.data
        localStorage.setItem('usuario', JSON.stringify(usuario.value))
      }
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err)
    }
  }

  function logout() {
    token.value = null
    usuario.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  return {
    token,
    usuario,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    getMe
  }
})