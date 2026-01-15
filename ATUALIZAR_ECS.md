# 🚀 ATUALIZAR BACKEND - ECS/Fargate (SEM Ferramentas Instaladas)

## ⚠️ IMPORTANTE: ECS Requer Docker e AWS CLI

Atualizar via ECS/Fargate **não tem método visual simples**. Você PRECISA instalar:
1. Docker Desktop
2. AWS CLI

Se preferir um método mais simples, considere migrar para Elastic Beanstalk ou EC2.

---

## OPÇÃO 1: Instalar Ferramentas e Usar Script

### Instale Docker Desktop
1. Acesse: https://www.docker.com/products/docker-desktop
2. Baixe para macOS
3. Instale e abra o aplicativo
4. Aguarde aparecer "Docker Desktop is running"

### Instale AWS CLI
```bash
# Baixe e instale
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Configure suas credenciais
aws configure
# Digite:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (ex: us-east-1)
# - Default output format: json
```

### Use o Script Automático
```bash
./scripts/atualizar-ecs.sh
```

---

## OPÇÃO 2: Atualização Manual (Avançado)

### Informações Necessárias:
Você precisa encontrar no Console AWS:
1. **ID da conta AWS** (12 dígitos)
2. **Nome do repositório ECR** 
3. **Nome do cluster ECS**
4. **Nome do serviço ECS**
5. **Região** (ex: us-east-1)

### Como Encontrar no Console:

**Repositório ECR:**
1. Vá para: https://console.aws.amazon.com/ecr
2. Anote o nome do repositório (ex: ibabycoach)

**Cluster e Serviço:**
1. Vá para: https://console.aws.amazon.com/ecs
2. Clique em "Clusters"
3. Clique no seu cluster
4. Na aba "Services", anote o nome do serviço

**ID da Conta:**
1. Clique no seu nome no canto superior direito
2. O ID de 12 dígitos aparece

---

### Comandos Manuais:

```bash
# 1. Salve o código
git add .
git commit -m "feat: Telefone opcional no cadastro"
git push origin main

# 2. Abra o Docker Desktop
open -a Docker
# Aguarde iniciar completamente

# 3. Faça login no ECR (substitua os valores)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.us-east-1.amazonaws.com

# 4. Build da imagem
docker build -t ibabycoach .

# 5. Tag da imagem
docker tag ibabycoach:latest \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/ibabycoach:latest

# 6. Push para AWS
docker push \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/ibabycoach:latest

# 7. Force novo deploy no ECS
aws ecs update-service \
  --cluster ibabycoach-cluster \
  --service ibabycoach-service \
  --force-new-deployment \
  --region us-east-1

# 8. Acompanhe o progresso
aws ecs describe-services \
  --cluster ibabycoach-cluster \
  --services ibabycoach-service \
  --region us-east-1
```

---

## ✅ Verificar se Funcionou

### No Console AWS:
1. Vá para: https://console.aws.amazon.com/ecs
2. Clique no seu cluster
3. Clique no serviço
4. Veja a aba "Deployments"
   - Deve mostrar "PRIMARY" deployment com status "ACTIVE"
5. Veja a aba "Tasks"
   - Deve ter task com status "RUNNING"

### Teste a URL:
```bash
# Pegue a URL no Load Balancer ou use o DNS do serviço
curl http://sua-url-do-ecs/
```

---

## 🔧 Solução de Problemas

### Docker não está rodando
```bash
# Abra o Docker Desktop
open -a Docker

# Aguarde aparecer a baleninha no topo da tela
# Clique nela, deve mostrar "Docker Desktop is running"
```

### Erro de autenticação no ECR
```bash
# Verifique se o AWS CLI está configurado
aws sts get-caller-identity

# Se der erro, configure novamente
aws configure
```

### Build da imagem falha
```bash
# Veja os logs do erro
# Geralmente é:
# - node_modules com problema: Delete e execute npm install
# - Erro no Dockerfile: Verifique sintaxe
# - Falta memória: Feche outros programas
```

### Push demora muito
- É normal! A primeira vez pode levar 5-15 minutos
- Uploads seguintes são mais rápidos (apenas as mudanças)

### Service não atualiza
```bash
# Veja os eventos do serviço
aws ecs describe-services \
  --cluster SEU-CLUSTER \
  --services SEU-SERVICE \
  --region us-east-1 \
  --query 'services[0].events[0:10]'

# Veja logs da task
# No console AWS > ECS > Cluster > Task > Logs
```

---

## 💡 RECOMENDAÇÃO

Se você é iniciante e está achando o ECS/Docker complicado, considere:

### Migrar para Elastic Beanstalk:
- **Vantagem**: Deploy com 1 comando (`eb deploy`)
- **Vantagem**: Gerenciamento mais simples
- **Vantagem**: Logs mais fáceis de acessar

### Migrar para EC2:
- **Vantagem**: Acesso SSH direto
- **Vantagem**: Controle total do servidor
- **Vantagem**: Mais fácil para debug

---

## 📋 Checklist de Deploy ECS

- [ ] Docker Desktop instalado e rodando
- [ ] AWS CLI instalado e configurado
- [ ] Código commitado no Git
- [ ] Build da imagem funcionou
- [ ] Push para ECR funcionou
- [ ] Service atualizado
- [ ] Task nova está "RUNNING"
- [ ] Aplicação responde na URL

---

## 📞 Ajuda Adicional

Para ECS/Docker, recomendo:
1. Instalar Docker Desktop: https://www.docker.com/products/docker-desktop
2. Instalar AWS CLI: https://aws.amazon.com/cli/
3. Usar o script automático: `./scripts/atualizar-ecs.sh`

Ou considerar migração para método mais simples.
