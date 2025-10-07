# FCF Central - Frontend

Interface web moderna para o sistema de controle financeiro da FCF.

## 🎨 Tecnologias

- **Vue 3** - Framework JavaScript
- **Vite** - Build tool
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Roteamento
- **TailwindCSS** - Estilização
- **Chart.js** - Gráficos
- **Axios** - Requisições HTTP
- **Lucide Icons** - Ícones

## 📁 Estrutura do Projeto

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js          # Configuração Axios
│   ├── assets/
│   ├── components/           # Componentes reutilizáveis
│   ├── layouts/
│   │   └── MainLayout.vue    # Layout com sidebar
│   ├── router/
│   │   └── index.js          # Rotas
│   ├── stores/
│   │   └── auth.js           # Store de autenticação
│   ├── views/
│   │   ├── Login.vue
│   │   ├── Dashboard.vue
│   │   ├── Despesas.vue
│   │   ├── Receitas.vue
│   │   ├── Orcamentos.vue
│   │   └── Relatorios.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css             # Estilos globais + Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz:

```bash
VITE_API_URL=http://localhost:4000/api
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

### 4. Build para produção

```bash
npm run build
```

Os arquivos compilados estarão em `dist/`

## 📱 Funcionalidades

### ✅ Autenticação
- Login com email e senha
- Proteção de rotas
- Controle de permissões (admin/user)
- Logout

### 📊 Dashboard
- Cards com resumo financeiro
- Gráfico orçado x realizado
- Gráfico de despesas por categoria
- Últimos lançamentos

### 💸 Despesas
- Listar todas as despesas
- Filtrar por data, categoria, fornecedor
- Criar nova despesa
- Editar despesa existente
- Excluir despesa (soft delete)
- Paginação

### 💰 Receitas
- Listar todas as receitas
- Filtrar por data, categoria, cliente
- Criar nova receita
- Editar receita existente
- Excluir receita
- Paginação

### 🎯 Orçamentos (apenas Admin)
- Criar orçamentos mensais
- Comparativo orçado x realizado
- Visualização por categoria
- Indicadores de performance

### 📈 Relatórios
- Gerar relatório mensal
- Totais de receitas e despesas
- Detalhamento por categoria
- Imprimir relatório
- Exportação (em desenvolvimento)

## 🎨 Design System

### Cores (FCF)

```css
--fcf-blue: #002D62      /* Azul principal */
--fcf-gold: #C8A038      /* Dourado */
--fcf-blue-light: #0047AB /* Azul claro */
--fcf-gold-light: #D4AF37 /* Dourado claro */
```

### Tipografia

- **Headings**: Poppins (semibold, bold)
- **Body**: Inter (regular, medium, semibold)
- **Numbers**: Roboto Mono

### Componentes Base

- `.btn` - Botões
- `.btn-primary` - Botão primário (azul FCF)
- `.btn-secondary` - Botão secundário (cinza)
- `.btn-success` - Botão verde
- `.btn-danger` - Botão vermelho
- `.input` - Campos de entrada
- `.card` - Cards
- `.badge` - Badges/tags

## 🔐 Autenticação

O sistema usa **JWT** armazenado no `localStorage`. 

**Credenciais de teste:**
- Admin: `admin@fcf.com.br` / `senha123`
- User: `usuario@fcf.com.br` / `senha123`

## 🛣️ Rotas

| Rota | Componente | Acesso |
|------|-----------|--------|
| `/login` | Login.vue | Público |
| `/` | Dashboard.vue | Autenticado |
| `/despesas` | Despesas.vue | Autenticado |
| `/receitas` | Receitas.vue | Autenticado |
| `/orcamentos` | Orcamentos.vue | Admin |
| `/relatorios` | Relatorios.vue | Autenticado |

## 📦 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento (localhost:3000)
npm run build    # Build para produção
npm run preview  # Preview do build
```

## 🔧 Configuração do Vite

O proxy está configurado para redirecionar `/api` para `http://localhost:4000`:

```js
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true
    }
  }
}
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push para GitHub
2. Importe o projeto no Vercel
3. Configure a variável de ambiente:
   - `VITE_API_URL`: URL da sua API em produção
4. Deploy automático!

### Netlify

1. Build: `npm run build`
2. Publish directory: `dist`
3. Configure variáveis de ambiente

## 🐛 Troubleshooting

**Erro "Failed to fetch":**
- Verifique se o backend está rodando
- Confirme a `VITE_API_URL` no `.env`
- Verifique CORS no backend

**Login não funciona:**
- Abra o DevTools → Network
- Verifique se a requisição está sendo feita
- Confirme as credenciais

**Gráficos não aparecem:**
- Verifique se há dados no período selecionado
- Abra o console para ver erros

## 📚 Próximas Features

- [ ] Upload de comprovantes
- [ ] Exportação Excel/PDF real
- [ ] Notificações toast
- [ ] Dark mode
- [ ] Filtros avançados
- [ ] Multi-idioma
- [ ] PWA (Progressive Web App)

## 🤝 Desenvolvimento

```bash
# Instalar
npm install

# Rodar
npm run dev

# Build
npm run build
```

---

**Desenvolvido com ❤️ para Federação Cearense de Futebol** ⚽