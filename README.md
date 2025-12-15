# iBabyCoach Backend

Backend API para o aplicativo iBabyCoach.

## 🔒 Segurança e Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no arquivo `.env.example`:

```bash
cp .env.example .env
```

Configure as seguintes variáveis:
- `MONGO_URI`: URL de conexão com o MongoDB
- `PORT`: Porta do servidor (padrão: 4111)

### Credenciais Firebase

1. Obtenha o arquivo de credenciais do Firebase Admin SDK
2. Salve na pasta `Helper/` com o nome: `ibabycoach-bb27e-firebase-adminsdk-XXXXX.json`
3. **NUNCA** faça commit deste arquivo no repositório

## 📦 Instalação

```bash
npm install
```

## 🚀 Execução

```bash
npm start
```

## ⚠️ Importante

- Nunca compartilhe arquivos `.env` ou credenciais do Firebase
- Mantenha o `.gitignore` atualizado
- Use variáveis de ambiente para informações sensíveis
