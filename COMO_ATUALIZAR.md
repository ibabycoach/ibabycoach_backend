# 🆕 GUIA RÁPIDO DE ATUALIZAÇÃO - Para Iniciantes

## 📍 PASSO 1: Descubra Como Está Implantado

### Opção A: Usando o Script (Mais Fácil)
```bash
chmod +x scripts/verificar-deploy.sh
./scripts/verificar-deploy.sh
```

### Opção B: Verificando Manualmente no Console AWS

1. Acesse: https://aws.amazon.com/console/
2. Faça login
3. Verifique em cada serviço:

**🟢 Elastic Beanstalk** (Mais Comum)
- Vá em: https://console.aws.amazon.com/elasticbeanstalk
- Se você ver uma aplicação chamada "ibabycoach" ou similar → **É Elastic Beanstalk**

**🟡 EC2** (Servidor Virtual)
- Vá em: https://console.aws.amazon.com/ec2
- Clique em "Instâncias"
- Se tiver uma instância "Running" com nome relacionado ao ibabycoach → **É EC2**

**🔵 ECS** (Docker/Container)
- Vá em: https://console.aws.amazon.com/ecs
- Se você ver clusters ou serviços → **É ECS/Fargate**

---

## 🚀 PASSO 2: Atualize Sua Nova Versão

Depois de identificar, siga o método correspondente:

---

### ✅ Método 1: ELASTIC BEANSTALK (Mais Simples)

#### Forma Automática (Recomendado):
```bash
# 1. Torne o script executável (só precisa fazer uma vez)
chmod +x scripts/atualizar-eb.sh

# 2. Execute para atualizar
./scripts/atualizar-eb.sh
```

#### Forma Manual:
```bash
# 1. Salve suas alterações no Git
git add .
git commit -m "Descrição da mudança"
git push origin main

# 2. Faça o deploy
eb deploy

# 3. Pronto! Aguarde 2-5 minutos
```

#### Verificar Status:
```bash
eb status          # Ver status
eb logs            # Ver logs de erro
eb open            # Abrir no navegador
```

---

### ✅ Método 2: EC2 (Servidor Próprio)

#### Forma Automática (Recomendado):
```bash
# 1. Torne o script executável (só precisa fazer uma vez)
chmod +x scripts/atualizar-ec2.sh

# 2. Execute para atualizar
./scripts/atualizar-ec2.sh
# O script vai pedir: IP do servidor e caminho da chave SSH
```

#### Forma Manual:
```bash
# 1. Salve suas alterações no Git
git add .
git commit -m "Descrição da mudança"
git push origin main

# 2. Conecte ao servidor (substitua com seus dados)
ssh -i ~/caminho/sua-chave.pem ubuntu@SEU-IP-EC2

# 3. No servidor, atualize o código
cd ibabycoach_backend
git pull origin main
npm install --production

# 4. Reinicie a aplicação
pm2 restart ibabycoach

# 5. Verifique se está rodando
pm2 status
pm2 logs ibabycoach --lines 50

# 6. Saia do servidor
exit
```

---

### ✅ Método 3: ECS/FARGATE (Docker)

#### Forma Automática (Recomendado):
```bash
# 1. Torne o script executável (só precisa fazer uma vez)
chmod +x scripts/atualizar-ecs.sh

# 2. Execute para atualizar
./scripts/atualizar-ecs.sh
# O script vai pedir: ID da conta AWS, região, nomes dos serviços
```

#### Forma Manual:
```bash
# 1. Salve suas alterações no Git
git add .
git commit -m "Descrição da mudança"
git push origin main

# 2. Build da nova imagem
docker build -t ibabycoach .

# 3. Login no ECR (substitua SEU_ACCOUNT e REGIAO)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin SEU_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# 4. Tag e push
docker tag ibabycoach:latest SEU_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/ibabycoach:latest
docker push SEU_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/ibabycoach:latest

# 5. Force deploy no ECS
aws ecs update-service --cluster SEU-CLUSTER --service SEU-SERVICE --force-new-deployment
```

---

## 🔧 PASSO 3: Verificar Se Funcionou

### Para todos os métodos:

1. **Acesse a URL do seu backend**
   - Ex: `http://seu-dominio.com` ou `http://ip-do-servidor:4111`

2. **Teste o endpoint de cadastro**
   ```bash
   curl -X POST http://sua-url/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Teste","email":"teste@email.com","password":"123456"}'
   ```

3. **Verifique os logs**
   - EB: `eb logs`
   - EC2: `ssh -i sua-chave.pem ubuntu@ip 'pm2 logs'`
   - ECS: No console AWS → ECS → seu serviço → Logs

---

## 📋 CHECKLIST Antes de Cada Atualização

- [ ] Testei localmente? (`npm start`)
- [ ] Commitei no Git? (`git status`)
- [ ] Enviei para GitHub? (`git push`)
- [ ] Sei qual método usar?
- [ ] Tenho acesso/credenciais AWS?

---

## 🆘 Problemas Comuns

### "comando não encontrado: eb"
```bash
pip install awsebcli --upgrade --user
```

### "Permission denied (publickey)" no EC2
```bash
chmod 400 sua-chave.pem
```

### "Cannot connect to the Docker daemon"
```bash
# No macOS
open -a Docker
# Aguarde o Docker iniciar
```

### "AWS credentials not found"
```bash
aws configure
# Digite: Access Key, Secret Key, Region
```

---

## 💡 DICA: Fluxo Completo Típico

```bash
# 1. Faça suas alterações no código
# ...edite os arquivos...

# 2. Teste localmente
npm start
# Teste no navegador: http://localhost:4111

# 3. Salve no Git
git add .
git commit -m "feat: Telefone opcional no cadastro"
git push origin main

# 4. Atualize o servidor
./scripts/atualizar-eb.sh
# (ou atualizar-ec2.sh ou atualizar-ecs.sh)

# 5. Aguarde 2-5 minutos

# 6. Teste no servidor
# Acesse sua URL de produção

# 7. Pronto! ✅
```

---

## 📞 Precisa de Ajuda?

Se algo não funcionar:

1. **Veja os logs** (comando específico do seu método)
2. **Reverta se necessário**: `git revert HEAD`
3. **Peça ajuda** com a mensagem de erro específica

---

## 🎯 Próximos Passos Recomendados

- [ ] Salve em lugar seguro: IP, chave SSH, credenciais AWS
- [ ] Configure alertas de erro (CloudWatch)
- [ ] Configure domínio próprio (Route 53)
- [ ] Configure SSL/HTTPS (Certificate Manager)
- [ ] Configure CI/CD automático (GitHub Actions)
