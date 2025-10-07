# 🚀 Guia Rápido - FCF Central Frontend

## Começar em 3 minutos!

### ✅ Pré-requisitos

- Node.js 18+ instalado
- Backend rodando em `http://localhost:4000`

---

## 📋 Passo a Passo

### 1️⃣ Criar a estrutura

```bash
# Criar pasta do projeto
mkdir fcf-central-frontend
cd fcf-central-frontend

# Criar estrutura de pastas
mkdir -p src/api src/assets src/components src/layouts src/router src/stores src/views
```

### 2️⃣ Copiar os arquivos

Cole todos os arquivos que gerei nos respectivos locais:

```
fcf-central-frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env
└── src/
    ├── main.js
    ├── App.vue
    ├── style.css
    ├── api/
    │   └── axios.js
    ├── stores/
    │   └── auth.js
    ├── router/
    │   └── index.js
    ├── layouts/
    │   └── MainLayout.vue
    └── views/
        ├── Login.vue
        ├── Dashboard.vue
        ├── Despesas.vue
        ├── Receitas.vue
        ├── Orcamentos.vue
        └── Relatorios.vue
```

### 3️⃣ Instalar dependências

```bash
npm install
```

Aguarde alguns minutos...

### 4️⃣ Criar o arquivo .env

```bash
# Crie o arquivo .env com:
VITE_API_URL=http://localhost:4000/api
```

### 5️⃣ Rodar o frontend

```bash
npm run dev
```

Você verá algo como:

```
  VITE v5.1.5  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### 6️⃣ Abrir no navegador

Acesse: **http://localhost:3000**

---

## 🎉 Pronto para usar!

### Login com:

**Admin:**
- Email: `admin@fcf.com.br`
- Senha: `senha123`

**Usuário:**
- Email: `usuario@fcf.com.br`
- Senha: `senha123`

---

## 📱 O que você verá

1. **Tela de Login** - Azul da FCF com formulário
2. **Dashboard** - Cards coloridos + gráficos
3. **Despesas** - Lista com filtros e CRUD
4. **Receitas** - Lista com filtros e CRUD
5. **Orçamentos** - Comparativo orçado x realizado (apenas admin)
6. **Relatórios** - Resumo mensal com detalhamento

---

## ⚠️ Checklist de Problemas Comuns

**❌ Erro "Failed to fetch"**
- ✅ Backend está rodando? Execute `npm run dev` no backend
- ✅ URL correta no `.env`? Deve ser `http://localhost:4000/api`

**❌ Página em branco**
- ✅ Abra o console (F12) e veja o erro
- ✅ Todos os arquivos foram copiados?
- ✅ `npm install` foi executado?

**❌ "Cannot find module"**
- ✅ Execute `npm install` novamente
- ✅ Delete `node_modules` e `package-lock.json`, depois `npm install`

**❌ Gráficos não aparecem**
- ✅ Rode o seed do backend: `npm run seed`
- ✅ Verifique se há dados cadastrados

---

## 🔥 Comandos Úteis

```bash
# Rodar desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Limpar cache (se necessário)
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 Cores da FCF

As cores oficiais já estão configuradas no Tailwind:

- `bg-fcf-blue` - Azul escuro #002D62
- `bg-fcf-gold` - Dourado #C8A038
- `bg-fcf-blue-light` - Azul claro #0047AB
- `bg-fcf-gold-light` - Dourado claro #D4AF37

---

## 📸 Screenshots Esperados

1. **Login**: Fundo azul gradiente, card branco centralizado
2. **Dashboard**: 4 cards coloridos no topo + 2 gráficos + tabela
3. **Despesas**: Filtros + tabela com ações (editar/excluir)
4. **Sidebar**: Azul FCF com menu vertical à esquerda

---

## ✅ Teste Rápido

1. Faça login com `admin@fcf.com.br` / `senha123`
2. Veja o dashboard com dados
3. Clique em "Despesas" → "Nova Despesa"
4. Preencha o formulário e salve
5. Veja a despesa na lista
6. Clique em "Orçamentos" → "Ver Comparativo"
7. Veja o comparativo com gráficos

---

## 🚀 Próximos Passos

Agora você tem:
- ✅ Backend funcionando
- ✅ Frontend funcionando
- ✅ Sistema completo rodando localmente

Pode:
1. **Testar todas as funcionalidades**
2. **Adicionar mais dados**
3. **Customizar o design**
4. **Fazer deploy (Vercel + Railway)**

---

**Dúvidas? Volte ao README.md completo!** 📚