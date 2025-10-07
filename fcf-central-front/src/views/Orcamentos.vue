<template>
  <div class="p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-gray-900">Orçamentos</h1>
        <p class="text-gray-600 mt-1">Gerenciar orçamentos mensais</p>
      </div>
      <button @click="abrirModal()" class="btn btn-primary flex items-center space-x-2">
        <Plus :size="20" />
        <span>Novo Orçamento</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mês</label>
          <select v-model="filtros.mes" class="input">
            <option value="">Todos</option>
            <option v-for="(mes, index) in meses" :key="index" :value="index + 1">{{ mes }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ano</label>
          <input v-model="filtros.ano" type="number" class="input" :min="2020" :max="2100" />
        </div>
        <div class="flex items-end">
          <button @click="buscarComparativo" class="btn btn-primary w-full">
            <BarChart3 :size="18" class="inline mr-2" />
            Ver Comparativo
          </button>
        </div>
      </div>
    </div>

    <!-- Comparativo -->
    <div v-if="comparativo.categorias.length > 0" class="card mb-6">
      <h3 class="text-lg font-heading font-semibold text-gray-900 mb-4">
        Comparativo: {{ meses[filtros.mes - 1] }} {{ filtros.ano }}
      </h3>

      <!-- Totais -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-700 font-medium">Receitas Orçadas</p>
          <p class="text-2xl font-mono font-bold text-blue-900 mt-1">
            {{ formatCurrency(comparativo.totais.receitas_orcadas) }}
          </p>
        </div>
        <div class="p-4 bg-green-50 rounded-lg">
          <p class="text-sm text-green-700 font-medium">Receitas Realizadas</p>
          <p class="text-2xl font-mono font-bold text-green-900 mt-1">
            {{ formatCurrency(comparativo.totais.receitas_realizadas) }}
          </p>
        </div>
        <div class="p-4 bg-red-50 rounded-lg">
          <p class="text-sm text-red-700 font-medium">Despesas Orçadas</p>
          <p class="text-2xl font-mono font-bold text-red-900 mt-1">
            {{ formatCurrency(comparativo.totais.despesas_orcadas) }}
          </p>
        </div>
        <div class="p-4 bg-orange-50 rounded-lg">
          <p class="text-sm text-orange-700 font-medium">Despesas Realizadas</p>
          <p class="text-2xl font-mono font-bold text-orange-900 mt-1">
            {{ formatCurrency(comparativo.totais.despesas_realizadas) }}
          </p>
        </div>
      </div>

      <!-- Tabela de Categorias -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 text-left">
              <th class="pb-3 text-sm font-semibold text-gray-700">Categoria</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Tipo</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-right">Orçado</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-right">Realizado</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-right">Diferença</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-center">%</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in comparativo.categorias" :key="cat.categoria" class="border-b border-gray-100">
              <td class="py-3 text-sm text-gray-900 font-medium">{{ cat.categoria }}</td>
              <td class="py-3">
                <span v-if="cat.tipo === 'receita'" class="badge badge-success">Receita</span>
                <span v-else class="badge badge-danger">Despesa</span>
              </td>
              <td class="py-3 text-sm font-mono text-right">{{ formatCurrency(cat.valor_orcado) }}</td>
              <td class="py-3 text-sm font-mono text-right font-semibold">{{ formatCurrency(cat.valor_realizado) }}</td>
              <td class="py-3 text-sm font-mono text-right" :class="cat.diferenca >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ cat.diferenca >= 0 ? '+' : '' }}{{ formatCurrency(cat.diferenca) }}
              </td>
              <td class="py-3 text-center">
                <span class="text-sm font-mono font-semibold">{{ cat.percentual }}%</span>
              </td>
              <td class="py-3 text-center">
                <span v-if="cat.status === 'dentro'" class="badge badge-success">Dentro</span>
                <span v-else-if="cat.status === 'acima'" class="badge badge-warning">Acima</span>
                <span v-else class="badge badge-info">Abaixo</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Lista de Orçamentos -->
    <div class="card">
      <h3 class="text-lg font-heading font-semibold text-gray-900 mb-4">Todos os Orçamentos</h3>

      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-fcf-blue"></div>
      </div>

      <div v-else-if="orcamentos.length === 0" class="text-center py-12">
        <Target :size="48" class="mx-auto text-gray-400 mb-4" />
        <p class="text-gray-600">Nenhum orçamento cadastrado</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 text-left">
              <th class="pb-3 text-sm font-semibold text-gray-700">Categoria</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Tipo</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-center">Mês/Ano</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-right">Valor Orçado</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="orc in orcamentos" :key="orc._id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 text-sm text-gray-900 font-medium">{{ orc.categoria_dre }}</td>
              <td class="py-3">
                <span v-if="orc.tipo === 'receita'" class="badge badge-success">Receita</span>
                <span v-else class="badge badge-danger">Despesa</span>
              </td>
              <td class="py-3 text-sm text-gray-600 text-center">{{ meses[orc.mes - 1] }}/{{ orc.ano }}</td>
              <td class="py-3 text-sm font-mono text-right font-semibold">{{ formatCurrency(orc.valor_orcado) }}</td>
              <td class="py-3">
                <div class="flex items-center justify-center space-x-2">
                  <button @click="abrirModal(orc)" class="p-1 hover:bg-gray-200 rounded" title="Editar">
                    <Edit2 :size="16" class="text-fcf-blue" />
                  </button>
                  <button @click="excluirOrcamento(orc._id)" class="p-1 hover:bg-gray-200 rounded" title="Excluir">
                    <Trash2 :size="16" class="text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalAberto" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-lg w-full">
        <div class="p-6">
          <h2 class="text-2xl font-heading font-semibold text-gray-900 mb-6">
            {{ orcamentoAtual?._id ? 'Editar Orçamento' : 'Novo Orçamento' }}
          </h2>

          <form @submit.prevent="salvarOrcamento" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoria DRE *</label>
              <input v-model="form.categoria_dre" type="text" required class="input" placeholder="Ex: Despesas Operacionais" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mês *</label>
                <select v-model="form.mes" required class="input">
                  <option value="">Selecione...</option>
                  <option v-for="(mes, index) in meses" :key="index" :value="index + 1">{{ mes }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ano *</label>
                <input v-model="form.ano" type="number" required class="input" :min="2020" :max="2100" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                <select v-model="form.tipo" required class="input">
                  <option value="">Selecione...</option>
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Orçado *</label>
                <input v-model="form.valor_orcado" type="number" step="0.01" required class="input" />
              </div>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-4">
              <button type="button" @click="fecharModal" class="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" :disabled="salvando" class="btn btn-primary">
                {{ salvando ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Target, BarChart3 } from 'lucide-vue-next'
import api from '@/api/axios'

const loading = ref(true)
const salvando = ref(false)
const modalAberto = ref(false)
const orcamentos = ref([])
const orcamentoAtual = ref(null)

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const filtros = reactive({
  mes: new Date().getMonth() + 1,
  ano: new Date().getFullYear()
})

const comparativo = reactive({
  categorias: [],
  totais: {
    receitas_orcadas: 0,
    receitas_realizadas: 0,
    despesas_orcadas: 0,
    despesas_realizadas: 0
  }
})

const form = reactive({
  categoria_dre: '',
  mes: new Date().getMonth() + 1,
  ano: new Date().getFullYear(),
  valor_orcado: '',
  tipo: ''
})

async function buscarOrcamentos() {
  try {
    loading.value = true
    const response = await api.get('/orcamentos')
    if (response.data.success) {
      orcamentos.value = response.data.data
    }
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error)
  } finally {
    loading.value = false
  }
}

async function buscarComparativo() {
  try {
    const response = await api.get(`/orcamentos/comparativo?mes=${filtros.mes}&ano=${filtros.ano}`)
    if (response.data.success) {
      comparativo.categorias = response.data.data.categorias
      comparativo.totais = response.data.data.totais
    }
  } catch (error) {
    console.error('Erro ao buscar comparativo:', error)
  }
}

function abrirModal(orcamento = null) {
  orcamentoAtual.value = orcamento
  if (orcamento) {
    Object.assign(form, {
      categoria_dre: orcamento.categoria_dre,
      mes: orcamento.mes,
      ano: orcamento.ano,
      valor_orcado: orcamento.valor_orcado,
      tipo: orcamento.tipo
    })
  } else {
    form.categoria_dre = ''
    form.valor_orcado = ''
    form.tipo = ''
  }
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  orcamentoAtual.value = null
}

async function salvarOrcamento() {
  try {
    salvando.value = true
    if (orcamentoAtual.value?._id) {
      await api.put(`/orcamentos/${orcamentoAtual.value._id}`, form)
    } else {
      await api.post('/orcamentos', form)
    }
    fecharModal()
    buscarOrcamentos()
    buscarComparativo()
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error)
    alert(error.response?.data?.error || 'Erro ao salvar orçamento')
  } finally {
    salvando.value = false
  }
}

async function excluirOrcamento(id) {
  if (!confirm('Tem certeza que deseja excluir este orçamento?')) return

  try {
    await api.delete(`/orcamentos/${id}`)
    buscarOrcamentos()
    buscarComparativo()
  } catch (error) {
    console.error('Erro ao excluir orçamento:', error)
    alert('Erro ao excluir orçamento')
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0)
}

onMounted(() => {
  buscarOrcamentos()
  buscarComparativo()
})
</script>