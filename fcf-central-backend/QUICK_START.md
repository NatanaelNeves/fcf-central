# 🚀 Guia Rápido - FCF Central Backend

## Começar em 5 minutos!

### 1️⃣ Clone e instale

```bash
# Clone o repositório
git clone <seu-repo>
cd fcf-central-backend

# Instale as dependências
npm install
```

### 2️⃣ Configure o MongoDB

**Opção Rápida: MongoDB Atlas (Recomendado)**

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie conta gratuita
3. Clique em "Build a Database" → Escolha FREE
4. Configure:
   - Cloud Provider: AWS
   - Region: São Paulo (sa-east-1)
   - Cluster Name: FCF-Central
5. Crie usuário:
   - Username: `fcf-admin`
   - Password: `SuaSenhaForte123` (anote!)
6. Em "Network Access":
   - Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
7. Clique em "Connect" → "Connect your application"
8. Copie a connection string

### 3️⃣ Configure o .env

```bash
# Copie o exemplo
cp .env.example .env

# Edite o .env e cole sua connection string
```

Seu `.env` deve ficar assim:

```env
PORT=4000
NODE_ENV=development

# Cole aqui a connection string do Atlas
# Substitua <password> pela senha que você criou
MONGO_URI=mongodb+srv://fcf-admin:<password>@fcf-central.xxxxx.mongodb.net/fcf-central?retryWrites=true&w=majority

JWT_SECRET=minha_chave_super_secreta_123456
JWT_EXPIRES_IN=7d
```

### 4️⃣ Popule o banco com dados iniciais

```bash
npm run seed
```

Isso vai criar:
- ✅ 2 usuários (admin e user)
- ✅ 7 orçamentos
- ✅ 4 despesas de exemplo
- ✅ 4 receitas de exemplo

**Credenciais criadas:**
- Admin: `admin@fcf.com.br` / `senha123`
- User: `usuario@fcf.com.br` / `senha123`

### 5️⃣ Rode o servidor

```bash
npm run dev
```

Você verá:

```
✅ MongoDB conectado com sucesso

╔═══════════════════════════════════════════╗
║                                           ║
║        🚀 FCF CENTRAL API 🚀             ║
║                                           ║
║  Servidor rodando em:                    ║
║  http://localhost:4000                    ║
║                                           ║
║  Ambiente: development                   ║
║                                           ║
╚═══════════════════════════════════════════╝
```

### 6️⃣ Teste a API

**Health Check:**
```bash
curl http://localhost:4000/health
```

**Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fcf.com.br",
    "senha": "senha123"
  }'
```

Copie o `token` retornado e teste:

**Listar despesas:**
```bash
curl http://localhost:4000/api/despesas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Ver comparativo do mês:**
```bash
curl "http://localhost:4000/api/orcamentos/comparativo?mes=10&ano=2025" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🎉 Pronto!

Seu backend está rodando! Agora você pode:

1. **Testar no Postman/Insomnia**: Importe a coleção de endpoints
2. **Desenvolver o frontend**: A API está pronta para consumo
3. **Personalizar**: Adicione mais categorias, orçamentos, etc.

## 📚 Próximos Passos

- Leia o [README.md](./README.md) completo para mais detalhes
- Explore todos os endpoints disponíveis
- Configure upload de arquivos (próxima feature)
- Implemente o frontend Vue.js

## ❓ Problemas?

**MongoDB não conecta:**
- Verifique se a senha no `.env` está correta
- Confirme se o IP está liberado no Atlas (Network Access)
- Teste a connection string diretamente no MongoDB Compass

**Porta já em uso:**
```bash
# Altere a porta no .env
PORT=5000
```

**Erro ao rodar seed:**
```bash
# Certifique-se que o MongoDB está conectado
# Execute novamente:
npm run seed
```

## 🔥 Dica Pro

Use o **MongoDB Compass** para visualizar seus dados:
- Download: https://www.mongodb.com/try/download/compass
- Cole a mesma connection string do `.env`
- Navegue pelas coleções visualmente

---

**Boa sorte! 🚀⚽**