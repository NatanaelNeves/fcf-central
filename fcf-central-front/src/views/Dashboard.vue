<template>
  <div class="p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-heading font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-1">Visão geral financeira - {{ mesAtual }}</p>
    </div>

    <!-- Cards de Resumo -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Receitas -->
      <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">Receitas do Mês</p>
            <p class="text-3xl font-heading font-bold mt-2">{{ formatCurrency(resumo.receitas) }}</p>
          </div>
          <TrendingUp :size="40" class="opacity-50" />
        </div>
      </div>

      <!-- Despesas -->
      <div class="card bg-gradient-to-br from-red-500 to-red-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-100 text-sm font-medium">Despesas do Mês</p>
            <p class="text-3xl font-heading font-bold mt-2">{{ formatCurrency(resumo.despesas) }}</p>
          </div>
          <TrendingDown :size="40" class="opacity-50" />
        </div>
      </div>

      <!-- Saldo -->
      <div class="card text-white" :class="resumo.saldo >= 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Saldo do Mês</p>
            <p class="text-3xl font-heading font-bold mt-2">{{ formatCurrency(resumo.saldo) }}</p>
          </div>
          <Wallet :size="40" class="opacity-50" />
        </div>
      </div>

      <!-- Total Orçado -->
      <div class="card bg-gradient-to-br from-fcf-blue to-fcf-blue-light text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Total Orçado</p>
            <p class="text-3xl font-heading font-bold mt-2">{{ formatCurrency(resumo.orcado) }}</p>
          </div>
          <Target :size="40" class="opacity-50" />
        </div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Gráfico de Orçado x Realizado -->
      <div class="card">
        <h3 class="text-lg font-heading font-semibold text-gray-900 mb-4">Orçado x Realizado</h3>
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-fcf-blue"></div>
        </div>
        <Bar v-else :data="chartData" :options="chartOptions" class="max-h-64" />
      </div>

      <!-- Gráfico de Pizza - Despesas por Categoria -->
      <div class="card">
        <h3 class="text-lg font-heading font-semibold text-gray-900 mb-4">Despesas por Categoria</h3>
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-fcf-blue"></div>
        </div>
        <Doughnut v-else :data="pieChartData" :options="pieChartOptions" class="max-h-64" />
      </div>
    </div>

    <!-- Últimos Lançamentos -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-heading font-semibold text-gray-900">Últimos Lançamentos</h3>
        <button @click="mostrarTodos = !mostrarTodos" class="text-sm text-fcf-blue hover:text-fcf-blue-light font-medium flex items-center gap-1">
          {{ mostrarTodos ? 'Ver menos' : 'Ver todos' }}
          <ChevronDown v-if="!mostrarTodos" :size="16" />
          <ChevronUp v-if="mostrarTodos" :size="16" />
        </button>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-fcf-blue"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 text-left">
              <th class="pb-3 text-sm font-semibold text-gray-700">Data</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Tipo</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Descrição</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Categoria</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in lancamentosExibidos" :key="item._id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 text-sm text-gray-600">{{ formatDate(item.data) }}</td>
              <td class="py-3">
                <span v-if="item.tipo === 'receita'" class="badge badge-success">Receita</span>
                <span v-else class="badge badge-danger">Despesa</span>
              </td>
              <td class="py-3 text-sm text-gray-900 font-medium">{{ item.descricao }}</td>
              <td class="py-3 text-sm text-gray-600">{{ item.categoria_dre }}</td>
              <td class="py-3 text-sm font-mono text-right" :class="item.tipo === 'receita' ? 'text-green-600' : 'text-red-600'">
                {{ item.tipo === 'receita' ? '+' : '-' }}{{ formatCurrency(item.valor) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { TrendingUp, TrendingDown, Wallet, Target, ChevronDown, ChevronUp } from 'lucide-vue-next'
import api from '@/api/axios'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const loading = ref(true)
const mostrarTodos = ref(false)
const resumo = ref({
  receitas: 0,
  despesas: 0,
  saldo: 0,
  orcado: 0
})
const comparativo = ref([])
const ultimosLancamentos = ref([])

const mesAtual = computed(() => {
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const data = new Date()
  return `${meses[data.getMonth()]} ${data.getFullYear()}`
})

const lancamentosExibidos = computed(() => {
  return mostrarTodos.value ? ultimosLancamentos.value : ultimosLancamentos.value.slice(0, 5)
})

const chartData = computed(() => ({
  labels: comparativo.value.map(c => c.categoria),
  datasets: [
    {
      label: 'Orçado',
      data: comparativo.value.map(c => c.valor_orcado),
      backgroundColor: '#002D62',
    },
    {
      label: 'Realizado',
      data: comparativo.value.map(c => c.valor_realizado),
      backgroundColor: '#C8A038',
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

const pieChartData = computed(() => {
  const despesasPorCategoria = comparativo.value
    .filter(c => c.tipo === 'despesa' && c.valor_realizado > 0)
  
  return {
    labels: despesasPorCategoria.map(c => c.categoria),
    datasets: [{
      data: despesasPorCategoria.map(c => c.valor_realizado),
      backgroundColor: [
        '#002D62',
        '#C8A038',
        '#0047AB',
        '#D4AF37',
        '#4169E1',
        '#FFD700'
      ]
    }]
  }
})

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

async function carregarDados() {
  try {
    loading.value = true
    const data = new Date()
    const mes = data.getMonth() + 1
    const ano = data.getFullYear()

    // Buscar comparativo
    const resComparativo = await api.get(`/orcamentos/comparativo?mes=${mes}&ano=${ano}`)
    if (resComparativo.data.success) {
      comparativo.value = resComparativo.data.data.categorias
      resumo.value.receitas = resComparativo.data.data.totais.receitas_realizadas
      resumo.value.despesas = resComparativo.data.data.totais.despesas_realizadas
      resumo.value.saldo = resComparativo.data.data.totais.saldo_realizado
      resumo.value.orcado = resComparativo.data.data.totais.despesas_orcadas
    }

    // Buscar últimos lançamentos
    const startDate = new Date(ano, mes - 1, 1).toISOString().split('T')[0]
    const endDate = new Date(ano, mes, 0).toISOString().split('T')[0]

    const [resDespesas, resReceitas] = await Promise.all([
      api.get(`/despesas?startDate=${startDate}&endDate=${endDate}&limit=100`),
      api.get(`/receitas?startDate=${startDate}&endDate=${endDate}&limit=100`)
    ])

    const despesas = resDespesas.data.success ? resDespesas.data.data.map(d => ({
      ...d,
      tipo: 'despesa',
      data: d.data_pagamento,
      valor: d.valor_pago
    })) : []

    const receitas = resReceitas.data.success ? resReceitas.data.data.map(r => ({
      ...r,
      tipo: 'receita',
      data: r.data_recebimento,
      valor: r.valor_recebido
    })) : []

    ultimosLancamentos.value = [...despesas, ...receitas]
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 50) // Limitar a 50 lançamentos no total

  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR')
}

onMounted(() => {
  carregarDados()
})
</script>