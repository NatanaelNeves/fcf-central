<template>
  <div class="p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-gray-900">Receitas</h1>
        <p class="text-gray-600 mt-1">Gerenciar receitas e recebimentos</p>
      </div>
      <button @click="abrirModal()" class="btn btn-success flex items-center space-x-2">
        <Plus :size="20" />
        <span>Nova Receita</span>
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
          <button @click="buscarReceitas" class="btn btn-primary w-full">
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

      <div v-else-if="receitas.length === 0" class="text-center py-12">
        <FileX :size="48" class="mx-auto text-gray-400 mb-4" />
        <p class="text-gray-600">Nenhuma receita encontrada</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 text-left">
              <th class="pb-3 text-sm font-semibold text-gray-700">Data</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Cliente</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Descrição</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Categoria</th>
              <th class="pb-3 text-sm font-semibold text-gray-700">Forma</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-right">Valor</th>
              <th class="pb-3 text-sm font-semibold text-gray-700 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="receita in receitas" :key="receita._id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 text-sm text-gray-600">{{ formatDate(receita.data_recebimento) }}</td>
              <td class="py-3 text-sm text-gray-900 font-medium">{{ receita.cliente }}</td>
              <td class="py-3 text-sm text-gray-600">{{ receita.descricao }}</td>
              <td class="py-3 text-sm text-gray-600">{{ receita.categoria_dre }}</td>
              <td class="py-3">
                <span class="badge badge-info">{{ receita.forma_recebimento }}</span>
              </td>
              <td class="py-3 text-sm font-mono text-right text-green-600 font-semibold">
                {{ formatCurrency(receita.valor_recebido) }}
              </td>
              <td class="py-3">
                <div class="flex items-center justify-center space-x-2">
                  <button @click="abrirModal(receita)" class="p-1 hover:bg-gray-200 rounded" title="Editar">
                    <Edit2 :size="16" class="text-fcf-blue" />
                  </button>
                  <button @click="excluirReceita(receita._id)" class="p-1 hover:bg-gray-200 rounded" title="Excluir">
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
            Mostrando {{ receitas.length }} de {{ pagination.total }} receitas
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
            {{ receitaAtual?._id ? 'Editar Receita' : 'Nova Receita' }}
          </h2>

          <form @submit.prevent="salvarReceita" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <input v-model="form.cliente" type="text" required class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Data Recebimento *</label>
                <input v-model="form.data_recebimento" type="date" required class="input" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
              <textarea v-model="form.descricao" required class="input" rows="2"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Recebido *</label>
                <input v-model="form.valor_recebido" type="number" step="0.01" required class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Forma de Recebimento *</label>
                <select v-model="form.forma_recebimento" required class="input">
                  <option value="">Selecione...</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="pix">PIX</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                  <option value="cartao_debito">Cartão de Débito</option>
                  <option value="transferencia">Transferência</option>
                  <option value="boleto">Boleto</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoria DRE *</label>
                <input v-model="form.categoria_dre" type="text" required class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Plano de Contas *</label>
                <input v-model="form.plano_de_contas" type="text" required class="input" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Subgrupo</label>
              <input v-model="form.subgrupo" type="text" class="input" />
            </div>

            <div class="flex items-center justify-end space-x-3 pt-4">
              <button type="button" @click="fecharModal" class="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" :disabled="salvando" class="btn btn-success">
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
const receitas = ref([])
const receitaAtual = ref(null)
const pagination = ref({ page: 1, limit: 20, total: 0, pages: 0 })

const filtros = reactive({
  startDate: '',
  endDate: '',
  categoria: ''
})

const form = reactive({
  cliente: '',
  descricao: '',
  data_recebimento: '',
  valor_recebido: '',
  forma_recebimento: '',
  categoria_dre: '',
  plano_de_contas: '',
  subgrupo: ''
})

async function buscarReceitas() {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: pagination.value.page,
      limit: pagination.value.limit
    })

    if (filtros.startDate) params.append('startDate', filtros.startDate)
    if (filtros.endDate) params.append('endDate', filtros.endDate)
    if (filtros.categoria) params.append('categoria', filtros.categoria)

    const response = await api.get(`/receitas?${params}`)
    if (response.data.success) {
      receitas.value = response.data.data
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Erro ao buscar receitas:', error)
  } finally {
    loading.value = false
  }
}

function abrirModal(receita = null) {
  receitaAtual.value = receita
  if (receita) {
    Object.assign(form, {
      cliente: receita.cliente,
      descricao: receita.descricao,
      data_recebimento: receita.data_recebimento.split('T')[0],
      valor_recebido: receita.valor_recebido,
      forma_recebimento: receita.forma_recebimento,
      categoria_dre: receita.categoria_dre,
      plano_de_contas: receita.plano_de_contas,
      subgrupo: receita.subgrupo || ''
    })
  } else {
    Object.keys(form).forEach(key => form[key] = '')
  }
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  receitaAtual.value = null
}

async function salvarReceita() {
  try {
    salvando.value = true
    if (receitaAtual.value?._id) {
      await api.put(`/receitas/${receitaAtual.value._id}`, form)
    } else {
      await api.post('/receitas', form)
    }
    fecharModal()
    buscarReceitas()
  } catch (error) {
    console.error('Erro ao salvar receita:', error)
    alert(error.response?.data?.error || 'Erro ao salvar receita')
  } finally {
    salvando.value = false
  }
}

async function excluirReceita(id) {
  if (!confirm('Tem certeza que deseja excluir esta receita?')) return

  try {
    await api.delete(`/receitas/${id}`)
    buscarReceitas()
  } catch (error) {
    console.error('Erro ao excluir receita:', error)
    alert('Erro ao excluir receita')
  }
}

function mudarPagina(novaPagina) {
  pagination.value.page = novaPagina
  buscarReceitas()
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
  buscarReceitas()
})
</script>