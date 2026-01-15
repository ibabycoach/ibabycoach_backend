# 🔍 GUIA VISUAL - Como Descobrir Onde Seu Backend Está na AWS

## PASSO 1: Faça Login na AWS

1. Acesse: https://console.aws.amazon.com/
2. Digite seu email e senha
3. Você verá o painel principal da AWS

---

## PASSO 2: Procure em Cada Serviço

### 🟢 TESTE 1: Elastic Beanstalk (Verificar Primeiro - Mais Comum)

**Como Acessar:**
1. No painel AWS, no campo de busca no topo, digite: **Elastic Beanstalk**
2. Clique em "Elastic Beanstalk" nos resultados

**O que Procurar:**
- ✅ **Se você ver**: Uma ou mais aplicações listadas (pode ter nome como "ibabycoach", "backend", "api", etc.)
  - **👉 ENCONTRADO! É Elastic Beanstalk**
  - Anote o nome da aplicação e o nome do ambiente
  - **Para atualizar**: Vá para "SOLUÇÃO 1" abaixo

- ❌ **Se você ver**: "You do not have any applications" ou tela vazia
  - Continue para o próximo teste

---

### 🟡 TESTE 2: EC2 (Servidor Virtual)

**Como Acessar:**
1. No campo de busca, digite: **EC2**
2. Clique em "EC2" nos resultados
3. No menu lateral esquerdo, clique em **"Instâncias"** (ou "Instances")

**O que Procurar:**
- ✅ **Se você ver**: Uma ou mais instâncias com estado "running" (em execução)
  - Clique na instância
  - Veja o "Endereço IPv4 público" ou "IP público"
  - **👉 ENCONTRADO! É EC2**
  - Anote o IP
  - **Para atualizar**: Vá para "SOLUÇÃO 2" abaixo

- ❌ **Se você ver**: Lista vazia ou todas "stopped"
  - Continue para o próximo teste

---

### 🔵 TESTE 3: ECS/Fargate (Containers Docker)

**Como Acessar:**
1. No campo de busca, digite: **ECS**
2. Clique em "Elastic Container Service" nos resultados
3. Clique em **"Clusters"** no menu lateral

**O que Procurar:**
- ✅ **Se você ver**: Um ou mais clusters listados
  - Clique no cluster
  - Veja se tem "Services" (serviços) rodando
  - **👉 ENCONTRADO! É ECS**
  - Anote o nome do cluster e do serviço
  - **Para atualizar**: Vá para "SOLUÇÃO 3" abaixo

- ❌ **Se você ver**: "No clusters to display"
  - Seu backend pode não estar na AWS ainda

---

## 📸 DICAS VISUAIS

### Elastic Beanstalk parece com:
```
┌─────────────────────────────────────┐
│ Applications                         │
│ ┌─────────────────────────────────┐ │
│ │ ibabycoach-app                  │ │
│ │ Environment: ibabycoach-prod    │ │
│ │ Status: ● Ready (verde)         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### EC2 parece com:
```
┌──────────────────────────────────────────┐
│ Instances (1)                             │
│ ┌──────────────────────────────────────┐ │
│ │ ● i-01234567 (running)              │ │
│ │ Name: ibabycoach-server             │ │
│ │ Public IPv4: 54.123.45.67           │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

### ECS parece com:
```
┌─────────────────────────────────────┐
│ Clusters (1)                         │
│ ┌─────────────────────────────────┐ │
│ │ ibabycoach-cluster              │ │
│ │ Services: 1                     │ │
│ │ Tasks: 1 running                │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## ✅ ENCONTROU? Vá para a solução correspondente:

### SOLUÇÃO 1: Elastic Beanstalk
Vá para: `ATUALIZAR_ELASTIC_BEANSTALK.md`

### SOLUÇÃO 2: EC2
Vá para: `ATUALIZAR_EC2.md`

### SOLUÇÃO 3: ECS
Vá para: `ATUALIZAR_ECS.md`

---

## ❓ NÃO ENCONTROU EM NENHUM LUGAR?

Possibilidades:
1. **Backend ainda não foi implantado** - Precisa fazer o primeiro deploy
2. **Está em outra conta AWS** - Verifique se está logado na conta correta
3. **Está em outra região** - No canto superior direito, mude a região (ex: Ohio, N. Virginia, São Paulo)

### Quer fazer o primeiro deploy?
Execute: `./scripts/primeiro-deploy.sh`
