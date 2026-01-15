# iBabyCoach - Deploy na AWS

## Opção 1: AWS Elastic Beanstalk (Recomendado)

### Pré-requisitos
1. Conta AWS ativa
2. AWS CLI instalado
3. EB CLI instalado

### Instalação do EB CLI
```bash
pip install awsebcli --upgrade --user
```

### Passos para Deploy

1. **Configure suas credenciais AWS**
```bash
aws configure
# Insira: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)
```

2. **Inicialize o Elastic Beanstalk**
```bash
eb init -p node.js-18 ibabycoach --region us-east-1
```

3. **Configure variáveis de ambiente**
```bash
eb setenv MONGODB_URI="sua-string-mongodb" \
  jwtSecretKey="sua-chave-secreta" \
  PORT=8080
```

4. **Crie o ambiente e faça deploy**
```bash
eb create ibabycoach-prod --instance-type t3.small
eb deploy
```

5. **Abra a aplicação**
```bash
eb open
```

### Comandos Úteis
- `eb status` - Ver status do ambiente
- `eb logs` - Ver logs da aplicação
- `eb ssh` - Conectar via SSH
- `eb deploy` - Deploy de novas versões
- `eb terminate` - Encerrar ambiente

---

## Opção 2: AWS EC2 (Maior Controle)

### 1. Crie uma instância EC2
- Acesse AWS Console → EC2
- Launch Instance
- Escolha: Ubuntu Server 22.04 LTS
- Tipo: t3.small ou t3.medium
- Configure Security Group: HTTP (80), HTTPS (443), SSH (22), Custom TCP (4111)

### 2. Conecte via SSH e configure
```bash
ssh -i sua-chave.pem ubuntu@seu-ip-ec2

# Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instale PM2
sudo npm install -g pm2

# Clone o repositório
git clone https://github.com/ibabycoach/ibabycoach_backend.git
cd ibabycoach_backend

# Instale dependências
npm install --production

# Configure variáveis de ambiente
nano .env
# Adicione todas as variáveis necessárias

# Inicie com PM2
pm2 start iBabycoach.js --name ibabycoach
pm2 save
pm2 startup
```

### 3. Configure Nginx (Recomendado)
```bash
sudo apt install nginx -y

# Configure reverse proxy
sudo nano /etc/nginx/sites-available/ibabycoach

# Cole:
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:4111;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:4111/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Ative a configuração
sudo ln -s /etc/nginx/sites-available/ibabycoach /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Opção 3: AWS ECS/Fargate com Docker (Escalável)

### 1. Crie um Dockerfile
Veja o arquivo `Dockerfile` incluído no projeto.

### 2. Build e push para ECR
```bash
# Autentique no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin SEU_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Crie repositório ECR
aws ecr create-repository --repository-name ibabycoach

# Build da imagem
docker build -t ibabycoach .

# Tag e push
docker tag ibabycoach:latest SEU_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/ibabycoach:latest
docker push SEU_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/ibabycoach:latest
```

### 3. Configure ECS
- Acesse ECS Console
- Create Cluster → Fargate
- Create Task Definition
- Create Service

---

## Checklist Antes do Deploy

- [ ] Configure MongoDB Atlas ou AWS DocumentDB
- [ ] Configure variáveis de ambiente (.env)
- [ ] Adicione credenciais Firebase em local seguro
- [ ] Configure CORS para domínio de produção
- [ ] Configure SSL/HTTPS
- [ ] Configure backups do banco de dados
- [ ] Configure CloudWatch para logs
- [ ] Configure Route 53 para DNS (se tiver domínio)
- [ ] Configure S3 para upload de imagens (recomendado)

## Variáveis de Ambiente Necessárias
```
MONGODB_URI=mongodb+srv://...
jwtSecretKey=sua-chave-secreta
PORT=8080
NODE_ENV=production
```

## Custos Estimados AWS
- **Elastic Beanstalk**: ~$15-30/mês (t3.small)
- **EC2**: ~$15-30/mês + volumes EBS
- **ECS Fargate**: ~$20-40/mês
- **MongoDB Atlas**: Grátis (M0) até ~$57/mês (M10)

## Suporte
Para problemas no deploy, verifique:
1. Logs: `eb logs` ou `pm2 logs`
2. Security Groups (portas abertas)
3. Variáveis de ambiente configuradas
4. Conexão com MongoDB
