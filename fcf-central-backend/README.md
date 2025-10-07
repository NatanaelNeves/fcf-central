# FCF Central - Backend API

Sistema de Controle Financeiro para Federação Cearense de Futebol

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **MongoDB** + **Mongoose** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts              # Conexão MongoDB
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── despesaController.ts
│   │   ├── receitaController.ts
│   │   └── orcamentoController.ts
│   ├── middlewares/
│   │   └── auth.ts            # Proteção de rotas
│   ├── models/
│   │   ├── Usuario.ts
│   │   ├── Despesa.ts
│   │   ├── Receita.ts
│   │   └── Orcamento.ts
│   ├── routes/
│   │   └── index.ts
│   ├── app.ts                 # Configuração Express
│   └── server.ts              # Entrada da aplicação
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Instalação e Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
PORT=4000
NODE_ENV=development

# MongoDB local
MONGO_URI=mongodb://localhost:27017/fcf-central

# Ou MongoDB Atlas (recomendado)
# MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/fcf-central

JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRES_IN=7d
```

### 3. Configurar MongoDB

**Opção A: MongoDB Local**
- Instale o MongoDB Community: https://www.mongodb.com/try/download/community
- Inicie o serviço: `mongod`

**Opção B: MongoDB Atlas (Recomendado - Grátis)**
1. Acesse https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um cluster (tier gratuito)
4. Crie um usuário de banco de dados
5. Libere seu IP em Network Access
6. Copie a connection string e cole no `.env`

### 4. Rodar o servidor

**Modo desenvolvimento (com hot reload):**
```bash
npm run dev
```

**Build para produção:**
```bash
npm run build
npm start
```

O servidor estará rodando em `http://localhost:4000`

## 📋 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrar usuário | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Dados do usuário autenticado | ✅ |

### Despesas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/despesas` | Listar despesas (com filtros) | ✅ |
| GET | `/api/despesas/:id` | Detalhe da despesa | ✅ |
| POST | `/api/despesas` | Criar despesa | ✅ |
| PUT | `/api/despesas/:id` | Atualizar despesa | ✅ |
| DELETE | `/api/despesas/:id` | Deletar despesa (soft delete) | ✅ |

### Receitas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/receitas` | Listar receitas (com filtros) | ✅ |
| GET | `/api/receitas/:id` | Detalhe da receita | ✅ |
| POST | `/api/receitas` | Criar receita | ✅ |
| PUT | `/api/receitas/:id` | Atualizar receita | ✅ |
| DELETE | `/api/receitas/:id` | Deletar receita (soft delete) | ✅ |

### Orçamentos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/orcamentos` | Listar orçamentos | ✅ |
| GET | `/api/orcamentos/comparativo?mes=9&ano=2025` | Comparativo orçado x realizado | ✅ |
| POST | `/api/orcamentos` | Criar orçamento | ✅ Admin |
| PUT | `/api/orcamentos/:id` | Atualizar orçamento | ✅ Admin |
| DELETE | `/api/orcamentos/:id` | Deletar orçamento | ✅ Admin |

## 🧪 Testando a API

### 1. Health Check

```bash
curl http://localhost:4000/health
```

### 2. Registrar usuário

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Admin FCF",
    "email": "admin@fcf.com.br",
    "senha": "senha123",
    "role": "admin"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fcf.com.br",
    "senha": "senha123"
  }'
```

Copie o `token` retornado e use nos próximos requests.

### 4. Criar uma despesa

```bash
curl -X POST http://localhost:4000/api/despesas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "banco": "Banco do Brasil",
    "fornecedor": "Fornecedor Teste",
    "descricao": "Compra de material",
    "data_pagamento": "2025-10-05",
    "valor_pago": 1500.00,
    "forma_pagamento": "pix",
    "categoria_dre": "Despesas Operacionais",
    "plano_de_contas": "Material de Escritório"
  }'
```

### 5. Listar despesas

```bash
curl http://localhost:4000/api/despesas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 6. Criar orçamento

```bash
curl -X POST http://localhost:4000/api/orcamentos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "categoria_dre": "Despesas Operacionais",
    "mes": 10,
    "ano": 2025,
    "valor_orcado": 10000,
    "tipo": "despesa"
  }'
```

### 7. Ver comparativo (orçado x realizado)

```bash
curl "http://localhost:4000/api/orcamentos/comparativo?mes=10&ano=2025" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 📦 Exemplos de Payload

### Criar Despesa

```json
{
  "banco": "Banco do Brasil",
  "fornecedor": "Empresa XYZ Ltda",
  "descricao": "Pagamento de serviços de manutenção",
  "data_pagamento": "2025-10-05",
  "valor_pago": 2500.50,
  "forma_pagamento": "transferencia",
  "categoria_dre": "Despesas Administrativas",
  "plano_de_contas": "Manutenção e Conservação",
  "subgrupo": "Predial"
}
```

### Criar Receita

```json
{
  "cliente": "Clube Parceiro ABC",
  "descricao": "Patrocínio campeonato estadual",
  "data_recebimento": "2025-10-01",
  "valor_recebido": 50000.00,
  "forma_recebimento": "transferencia",
  "categoria_dre": "Receitas de Patrocínio",
  "plano_de_contas": "Patrocínios"
}
```

### Criar Orçamento

```json
{
  "categoria_dre": "Despesas com Pessoal",
  "mes": 10,
  "ano": 2025,
  "valor_orcado": 80000,
  "tipo": "despesa"
}
```

## 🔍 Filtros Disponíveis

### Despesas e Receitas

```
GET /api/despesas?startDate=2025-10-01&endDate=2025-10-31
GET /api/despesas?categoria=Despesas%20Operacionais
GET /api/despesas?fornecedor=Empresa
GET /api/despesas?forma_pagamento=pix
GET /api/despesas?page=1&limit=20
```

### Orçamentos

```
GET /api/orcamentos?mes=10&ano=2025
GET /api/orcamentos?tipo=despesa
```

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)**. Após o login, você receberá um token que deve ser enviado no header de todas as requisições protegidas:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Expiração:** O token expira em 7 dias (configurável no `.env`)

## 👥 Roles de Usuário

- **admin**: Acesso completo (CRUD de tudo + gerenciar orçamentos)
- **user**: Pode criar e visualizar despesas/receitas, mas não gerenciar orçamentos

## 🗄️ Models do Banco

### Usuario
```typescript
{
  nome: string
  email: string (único)
  senha_hash: string
  role: 'admin' | 'user'
  criado_em: Date
}
```

### Despesa
```typescript
{
  usuario_id: ObjectId
  banco: string
  fornecedor: string
  descricao: string
  data_pagamento: Date
  valor_pago: number
  forma_pagamento: enum
  categoria_dre: string
  plano_de_contas: string
  subgrupo?: string
  comprovante_url?: string
  deleted: boolean
  audit: Array
}
```

### Receita
```typescript
{
  usuario_id: ObjectId
  cliente: string
  descricao: string
  data_recebimento: Date
  valor_recebido: number
  forma_recebimento: enum
  categoria_dre: string
  plano_de_contas: string
  subgrupo?: string
  comprovante_url?: string
  deleted: boolean
  audit: Array
}
```

### Orcamento
```typescript
{
  categoria_dre: string
  mes: number (1-12)
  ano: number
  valor_orcado: number
  tipo: 'receita' | 'despesa'
}
```

## 🚀 Deploy

### Railway / Render

1. Faça push do código para GitHub
2. Conecte o repositório no Railway/Render
3. Configure as variáveis de ambiente
4. Deploy automático!

**Variáveis necessárias em produção:**
```
NODE_ENV=production
PORT=4000
MONGO_URI=sua_connection_string_atlas
JWT_SECRET=chave_super_secreta
JWT_EXPIRES_IN=7d
```

## 📝 Próximos Passos

- [ ] Implementar upload de comprovantes (Multer + S3)
- [ ] Adicionar relatórios (Excel/PDF)
- [ ] Implementar configurações (CRUD de categorias)
- [ ] Testes unitários (Jest)
- [ ] Rate limiting
- [ ] Documentação Swagger

## 🐛 Troubleshooting

**Erro de conexão MongoDB:**
- Verifique se o MongoDB está rodando
- Confira a connection string no `.env`
- No Atlas, libere seu IP em Network Access

**Erro "JWT_SECRET is not defined":**
- Crie o arquivo `.env` baseado no `.env.example`
- Defina uma chave secreta forte

**Porta já em uso:**
- Altere o `PORT` no `.env` para outra porta (ex: 5000)

## 📧 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.

---

**Desenvolvido para Federação Cearense de Futebol** ⚽