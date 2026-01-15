# 🚀 ATUALIZAR BACKEND - Elastic Beanstalk (SEM Ferramentas Instaladas)

## Método Visual - Direto no Console AWS

### PASSO 1: Acesse o Elastic Beanstalk
1. Vá para: https://console.aws.amazon.com/elasticbeanstalk
2. Clique na sua aplicação (ex: "ibabycoach")
3. Clique no ambiente (ex: "ibabycoach-prod")

---

### PASSO 2: Prepare o Código para Upload

Primeiro, salve suas alterações:

```bash
# No terminal, execute:
git add .
git commit -m "feat: Telefone opcional no cadastro"
git push origin main
```

Agora crie um arquivo ZIP do seu projeto:

```bash
# Crie o arquivo de deploy
zip -r deploy.zip . -x "*.git*" -x "*node_modules*" -x "*.DS_Store" -x "*public/images/*"
```

Isso vai criar um arquivo `deploy.zip` na pasta do projeto.

---

### PASSO 3: Faça Upload no Console AWS

1. **No painel do Elastic Beanstalk**, você verá algo assim:
   ```
   Environment: ibabycoach-prod
   Status: ● Ok (verde)
   Running Version: versão-atual
   ```

2. **Clique no botão "Upload and deploy"** (ou "Enviar e implantar")

3. **Uma janela vai abrir:**
   - Clique em "Choose file" (Escolher arquivo)
   - Selecione o arquivo `deploy.zip` que você criou
   - Em "Version label" (Rótulo da versão), digite algo como: `telefone-opcional-2026-01-15`

4. **Clique em "Deploy"**

5. **Aguarde:**
   - O status vai mudar para "Updating" (Atualizando) - cor laranja
   - Isso leva 2-5 minutos
   - Quando ficar "Ok" (verde) - está pronto!

---

### PASSO 4: Verifique se Funcionou

1. **Pegue a URL do seu ambiente:**
   - Está no topo da página: `http://seu-ambiente.elasticbeanstalk.com`
   
2. **Teste no navegador ou terminal:**
   ```bash
   curl http://sua-url.elasticbeanstalk.com/
   ```

3. **Veja os logs se tiver erro:**
   - Na página do ambiente, clique em **"Logs"** no menu lateral
   - Clique em **"Request Logs"** → **"Last 100 Lines"**
   - Clique no link que aparecer para baixar o log

---

## ✅ Pronto! Seu backend está atualizado!

---

## 🔧 Solução de Problemas

### Erro: "Application version não válida"
- O arquivo ZIP está muito grande
- Solução: Certifique-se de excluir node_modules:
  ```bash
  zip -r deploy.zip . -x "*node_modules*" -x "*.git*" -x "*public/images/*"
  ```

### Erro: "Health check failed"
- O servidor não está respondendo
- Verifique os logs (passo 4, item 3)
- Verifique se o `PORT` está correto (deve ser 8080 no EB)

### Status fica em "Severe" (vermelho)
- Algo deu errado na inicialização
- Clique em "Logs" para ver o erro
- Pode ser:
  - Variável de ambiente faltando
  - Erro de conexão com MongoDB
  - Erro no código

---

## 💡 DICA: Instalar Ferramentas Para Facilitar

Para não precisar fazer upload manual toda vez, instale as ferramentas:

```bash
# Instalar AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Instalar EB CLI
pip3 install awsebcli --upgrade --user

# Configurar
aws configure
# Digite: Access Key, Secret Key, região (us-east-1), formato (json)

# Depois disso, você poderá usar:
eb deploy
```

Com as ferramentas instaladas, a atualização fica muito mais simples!
