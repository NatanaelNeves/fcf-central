<template>
  <div class="p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-heading font-bold text-gray-900">Relatórios</h1>
      <p class="text-gray-600 mt-1">Visualizar e exportar relatórios financeiros</p>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <h3 class="text-lg font-heading font-semibold text-gray-900 mb-4">Filtros</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mês</label>
          <select v-model="filtros.mes" class="input">
            <option v-for="(mes, index) in meses" :key="index" :value="index + 1">{{ mes }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ano</label>
          <input v-model="filtros.ano" type="number" class="input" :min="2020" :max="2100" />
        </div>
        <div class="flex items-end">
          <button @click="gerarRelatorio" class="btn btn-primary w-full">
            <FileText :size="18" class="inline mr-2" />
            Gerar Relatório
          </button>
        </div>
      </div>
    </div>

    <!-- Resumo -->
    <div v-if="relatorio" class="space-y-6">
      <!-- Cards de Resumo -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p class="text-green-100 text-sm font-medium">Total Receitas</p>
          <p class="text-3xl font-heading font-bold mt-2">{{ formatCurrency(relatorio.total_receitas) }}</p>
          <p class="text-green-100 text-sm mt-2">{{ relatorio.qtd_receitas }} lançamentos</p>
        </div>

        <div class="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <p class="text-red-100 text-sm font-medium">Total Despesas</p>
          <p class="text-3xl font-heading font-bold mt-2">{{ formatCurrency(relatorio.total_despesas) }}</p>
          <p class="text-red-100 text-sm mt-2">{{ relatorio.qtd_despesas }} lançamentos</p>
        </div>

        <div class="card text-white" :class="relatorio.saldo >= 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'">
          <p :class="relatorio.saldo >= 0 ? 'text-blue-100' : 'text-orange-100'" class="text-sm font-medium">Saldo</p>
          <p class="text-3xl font-heading font-bold mt-2">{{ formatCurrency(relatorio.saldo) }}</p>
          <p :class="relatorio.saldo >= 0 ? 'text-blue-100' : 'text-orange-100'" class="text-sm mt-2">{{ relatorio.saldo >= 0 ? 'Positivo' : 'Negativo' }}</p>
        </div>
      </div>

      <!-- Ações de Export -->
      <div class="card">
        <h3 class="text-lg font-heading font-semibold text-gray-900 mb-4">Exportar Relatório</h3>
        <div class="flex flex-wrap gap-4">
          <button class="btn btn-success flex items-center space-x-2">
            <FileSpreadsheet :size="20" />
            <span>Exportar Excel</span>
            <span class="badge bg-white text-green-600 ml-2">Em breve</span>
          </button>
          <button class="btn btn-danger flex items-center space-x-2">
            <FileText :size="20" />
            <span>Exportar PDF</span>
            <span class="badge bg-white text-red-600 ml-2">Em breve</span>
          </button>
          <button @click="imprimirRelatorio" class="btn btn-secondary flex items-center space-x-2">
            <Printer :size="20" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      <!-- Detalhamento por Categoria -->
      <div class="card">
        <h3 class="text-lg font-heading font-semibold text-gray-900 mb-4">Detalhamento por Categoria</h3>
        
        <!-- Receitas -->
        <div class="mb-6">
          <h4 class="text-md font-semibold text-green-700 mb-3">Receitas</h4>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 text-left">
                  <th class="pb-2 text-sm font-semibold text-gray-700">Categoria</th>
                  <th class="pb-2 text-sm font-semibold text-gray-700 text-right">Valor</th>
                  <th class="pb-2 text-sm font-semibold text-gray-700 text-right">% Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cat in relatorio.receitas_por_categoria" :key="cat.categoria" class="border-b border-gray-100">
                  <td class="py-2 text-sm text-gray-900">{{ cat.categoria }}</td>
                  <td class="py-2 text-sm font-mono text-right text-green-600 font-semibold">{{ formatCurrency(cat.total) }}</td>
                  <td class="py-2 text-sm text-right">{{ cat.percentual }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Despesas -->
        <div>
          <h4 class="text-md font-semibold text-red-700 mb-3">Despesas</h4>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 text-left">
                  <th class="pb-2 text-sm font-semibold text-gray-700">Categoria</th>
                  <th class="pb-2 text-sm font-semibold text-gray-700 text-right">Valor</th>
                  <th class="pb-2 text-sm font-semibold text-gray-700 text-right">% Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cat in relatorio.despesas_por_categoria" :key="cat.categoria" class="border-b border-gray-100">
                  <td class="py-2 text-sm text-gray-900">{{ cat.categoria }}</td>
                  <td class="py-2 text-sm font-mono text-right text-red-600 font-semibold">{{ formatCurrency(cat.total) }}</td>
                  <td class="py-2 text-sm text-right">{{ cat.percentual }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else class="card text-center py-12">
      <FileText :size="48" class="mx-auto text-gray-400 mb-4" />
      <p class="text-gray-600 mb-2">Nenhum relatório gerado</p>
      <p class="text-sm text-gray-500">Selecione um período e clique em "Gerar Relatório"</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { FileText, FileSpreadsheet, Printer } from 'lucide-vue-next'
import api from '@/api/axios'

const relatorio = ref(null)

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const filtros = reactive({
  mes: new Date().getMonth() + 1,
  ano: new Date().getFullYear()
})

async function gerarRelatorio() {
  try {
    const dataInicio = new Date(filtros.ano, filtros.mes - 1, 1)
    const dataFim = new Date(filtros.ano, filtros.mes, 0)
    
    const startDate = dataInicio.toISOString().split('T')[0]
    const endDate = dataFim.toISOString().split('T')[0]

    // Buscar despesas e receitas do período
    const [resDespesas, resReceitas] = await Promise.all([
      api.get(`/despesas?startDate=${startDate}&endDate=${endDate}&limit=1000`),
      api.get(`/receitas?startDate=${startDate}&endDate=${endDate}&limit=1000`)
    ])

    const despesas = resDespesas.data.success ? resDespesas.data.data : []
    const receitas = resReceitas.data.success ? resReceitas.data.data : []

    // Calcular totais
    const total_despesas = despesas.reduce((sum, d) => sum + d.valor_pago, 0)
    const total_receitas = receitas.reduce((sum, r) => sum + r.valor_recebido, 0)
    const saldo = total_receitas - total_despesas

    // Agrupar por categoria
    const despesasPorCategoria = {}
    despesas.forEach(d => {
      if (!despesasPorCategoria[d.categoria_dre]) {
        despesasPorCategoria[d.categoria_dre] = 0
      }
      despesasPorCategoria[d.categoria_dre] += d.valor_pago
    })

    const receitasPorCategoria = {}
    receitas.forEach(r => {
      if (!receitasPorCategoria[r.categoria_dre]) {
        receitasPorCategoria[r.categoria_dre] = 0
      }
      receitasPorCategoria[r.categoria_dre] += r.valor_recebido
    })

    // Converter para array e calcular percentuais
    const despesas_por_categoria = Object.entries(despesasPorCategoria).map(([categoria, total]) => ({
      categoria,
      total,
      percentual: total_despesas > 0 ? ((total / total_despesas) * 100).toFixed(1) : 0
    }))

    const receitas_por_categoria = Object.entries(receitasPorCategoria).map(([categoria, total]) => ({
      categoria,
      total,
      percentual: total_receitas > 0 ? ((total / total_receitas) * 100).toFixed(1) : 0
    }))

    relatorio.value = {
      total_despesas,
      total_receitas,
      saldo,
      qtd_despesas: despesas.length,
      qtd_receitas: receitas.length,
      despesas_por_categoria,
      receitas_por_categoria
    }

  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    alert('Erro ao gerar relatório')
  }
}

function imprimirRelatorio() {
  window.print()
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0)
}
</script>

<style scoped>
@media print {
  .btn {
    display: none;
  }
}
</style>