<template>
  <div class="p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-gray-900">Despesas</h1>
        <p class="text-gray-600 mt-1">Gerenciar despesas e pagamentos</p>
      </div>
      <button @click="abrirModal()" class="btn btn-primary flex items-center space-x-2">
        <Plus :size="20" />
        <span>Nova Despesa</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
          <input v-model="filtros.startDate" type="date" class="input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
          <input v-model="filtros.endDate" type="date" class="input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <input v-model="filtros.categoria" type="text" class="input" placeholder="Filtrar por categoria" />
        </div>
        <div class="flex items-end">
          <button @click="buscarDespesas" class="btn btn-primary w-full">
            <Search :size="18" class="inline mr-2" />
            Filtrar
          </button>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="card">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-fcf-blue"></div>
      </div>

      <div v-else-if="despesas.length === 0" class="text-center py-12">
        <FileX :size="48" class="mx-auto text-gray-400 mb-4" />
        <p class="text-gray-600">Nenhuma despesa encontrada</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 text-left">
              <th class="pb-3 text-sm font-semibold text-gray-700">Data</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Fornecedor</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Descrição</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Categoria</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Forma</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-right">Valor</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="despesa in despesas" :key="despesa._id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 text-sm text-gray-600">{{ formatDate(despesa.data_pagamento) }}</td>
              <td class="py-3 text-sm text-gray-900 font-medium">{{ despesa.fornecedor }}</td>
              <td class="py-3 text-sm text-gray-600">{{ despesa.descricao }}</td>
              <td class="py-3 text-sm text-gray-600">{{ despesa.categoria_dre }}</td>
              <td class="py-3">
                <span class="badge badge-info">{{ despesa.forma_pagamento }}</span>
              </td>
              <td class="py-3 text-sm font-mono text-right text-red-600 font-semibold">
                {{ formatCurrency(despesa.valor_pago) }}
              </td>
              <td class="py-3">
                <div class="flex items-center justify-center space-x-2">
                  <button @click="abrirModal(despesa)" class="p-1 hover:bg-gray-200 rounded" title="Editar">
                    <Edit2 :size="16" class="text-fcf-blue" />
                  </button>
                  <button @click="excluirDespesa(despesa._id)" class="p-1 hover:bg-gray-200 rounded" title="Excluir">
                    <Trash2 :size="16" class="text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginação -->
        <div v-if="pagination.pages > 1" class="flex items-center justify-between mt-6">
          <p class="text-sm text-gray-600">
            Mostrando {{ despesas.length }} de {{ pagination.total }} despesas
          </p>
          <div class="flex space-x-2">
            <button
              @click="mudarPagina(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="btn btn-secondary"
            >
              Anterior
            </button>
            <button
              @click="mudarPagina(pagination.page + 1)"
              :disabled="pagination.page === pagination.pages"
              class="btn btn-secondary"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalAberto" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h2 class="text-2xl font-heading font-semibold text-gray-900 mb-6">
            {{ despesaAtual?._id ? 'Editar Despesa' : 'Nova Despesa' }}
          </h2>

          <form @submit.prevent="salvarDespesa" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Banco *</label>
                <input v-model="form.banco" type="text" required class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fornecedor *</label>
                <input v-model="form.fornecedor" type="text" required class="input" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
              <textarea v-model="form.descricao" required class="input" rows="2"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Data Pagamento *</label>
                <input v-model="form.data_pagamento" type="date" required class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Pago *</label>
                <input v-model="form.valor_pago" type="number" step="0.01" required class="input" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento *</label>
                <select v-model="form.forma_pagamento" required class="input">
                  <option value="">Selecione...</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="pix">PIX</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                  <option value="cartao_debito">Cartão de Débito</option>
                  <option value="transferencia">Transferência</option>
                  <option value="boleto">Boleto</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoria DRE *</label>
                <input v-model="form.categoria_dre" type="text" required class="input" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Plano de Contas *</label>
                <input v-model="form.plano_de_contas" type="text" required class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Subgrupo</label>
                <input v-model="form.subgrupo" type="text" class="input" />
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
import { Plus, Search, Edit2, Trash2, FileX } from 'lucide-vue-next'
import api from '@/api/axios'

const loading = ref(true)
const salvando = ref(false)
const modalAberto = ref(false)
const despesas = ref([])
const despesaAtual = ref(null)
const pagination = ref({ page: 1, limit: 20, total: 0, pages: 0 })

const filtros = reactive({
  startDate: '',
  endDate: '',
  categoria: ''
})

const form = reactive({
  banco: '',
  fornecedor: '',
  descricao: '',
  data_pagamento: '',
  valor_pago: '',
  forma_pagamento: '',
  categoria_dre: '',
  plano_de_contas: '',
  subgrupo: ''
})

async function buscarDespesas() {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: pagination.value.page,
      limit: pagination.value.limit
    })

    if (filtros.startDate) params.append('startDate', filtros.startDate)
    if (filtros.endDate) params.append('endDate', filtros.endDate)
    if (filtros.categoria) params.append('categoria', filtros.categoria)

    const response = await api.get(`/despesas?${params}`)
    if (response.data.success) {
      despesas.value = response.data.data
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Erro ao buscar despesas:', error)
  } finally {
    loading.value = false
  }
}

function abrirModal(despesa = null) {
  despesaAtual.value = despesa
  if (despesa) {
    Object.assign(form, {
      banco: despesa.banco,
      fornecedor: despesa.fornecedor,
      descricao: despesa.descricao,
      data_pagamento: despesa.data_pagamento.split('T')[0],
      valor_pago: despesa.valor_pago,
      forma_pagamento: despesa.forma_pagamento,
      categoria_dre: despesa.categoria_dre,
      plano_de_contas: despesa.plano_de_contas,
      subgrupo: despesa.subgrupo || ''
    })
  } else {
    Object.keys(form).forEach(key => form[key] = '')
  }
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  despesaAtual.value = null
}

async function salvarDespesa() {
  try {
    salvando.value = true
    if (despesaAtual.value?._id) {
      await api.put(`/despesas/${despesaAtual.value._id}`, form)
    } else {
      await api.post('/despesas', form)
    }
    fecharModal()
    buscarDespesas()
  } catch (error) {
    console.error('Erro ao salvar despesa:', error)
    alert(error.response?.data?.error || 'Erro ao salvar despesa')
  } finally {
    salvando.value = false
  }
}

async function excluirDespesa(id) {
  if (!confirm('Tem certeza que deseja excluir esta despesa?')) return

  try {
    await api.delete(`/despesas/${id}`)
    buscarDespesas()
  } catch (error) {
    console.error('Erro ao excluir despesa:', error)
    alert('Erro ao excluir despesa')
  }
}

function mudarPagina(novaPagina) {
  pagination.value.page = novaPagina
  buscarDespesas()
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR')
}

onMounted(() => {
  buscarDespesas()
})
</script>