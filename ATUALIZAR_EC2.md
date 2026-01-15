# 🚀 ATUALIZAR BACKEND - EC2 (SEM Ferramentas Instaladas)

## Informações Necessárias

Antes de começar, você precisa saber:
1. **IP do servidor EC2** (ex: 54.123.45.67)
2. **Arquivo de chave SSH** (.pem) - geralmente está em Downloads

Se não tem essas informações, veja como encontrar no arquivo `DESCOBRIR_METODO_VISUAL.md`

---

## PASSO 1: Encontre Sua Chave SSH

A chave SSH é um arquivo `.pem` que você baixou quando criou o servidor.

**Onde procurar:**
- Pasta Downloads
- Pasta Documentos
- Pode ter nome como: `ibabycoach-key.pem`, `aws-key.pem`, `my-ec2-key.pem`

**Quando encontrar:**
```bash
# Vá para a pasta onde está a chave
cd ~/Downloads  # ou onde você salvou

# Dê permissão correta (só precisa fazer 1x)
chmod 400 sua-chave.pem
```

---

## PASSO 2: Prepare o Código

Salve suas alterações no GitHub:

```bash
# No terminal, na pasta do projeto:
git add .
git commit -m "feat: Telefone opcional no cadastro"
git push origin main
```

---

## PASSO 3: Conecte ao Servidor e Atualize

### Método Manual (Passo a Passo):

```bash
# 1. Conecte ao servidor (substitua com seus dados)
ssh -i ~/Downloads/sua-chave.pem ubuntu@SEU-IP-AQUI

# Se der erro "too open", execute primeiro:
# chmod 400 ~/Downloads/sua-chave.pem

# 2. Você vai ver algo como:
# ubuntu@ip-172-31-45-67:~$
# Significa que está dentro do servidor!

# 3. Entre na pasta do projeto
cd ibabycoach_backend
# ou
cd ibabycoach-backend
# ou
cd /var/www/ibabycoach

# Se não souber o nome exato, liste as pastas:
ls ~
ls /var/www

# 4. Baixe a nova versão do código
git pull origin main

# 5. Instale dependências (caso tenha adicionado novas)
npm install --production

# 6. Reinicie o servidor
pm2 restart ibabycoach
# ou
pm2 restart all

# 7. Veja se está rodando
pm2 status

# 8. Veja os logs (últimas 50 linhas)
pm2 logs ibabycoach --lines 50
# Pressione Ctrl+C para sair dos logs

# 9. Saia do servidor
exit
```

---

## PASSO 4: Teste se Funcionou

```bash
# Substitua com o IP do seu servidor
curl http://SEU-IP:4111/

# Ou abra no navegador:
# http://SEU-IP:4111
```

---

## ✅ Pronto! Seu backend está atualizado!

---

## 📝 Exemplo Completo Com Valores Reais

Aqui está um exemplo usando valores fictícios. **Substitua com os seus!**

```bash
# 1. Conectar
ssh -i ~/Downloads/minha-chave-aws.pem ubuntu@54.123.45.67

# 2. Ir para pasta
cd ibabycoach_backend

# 3. Atualizar código
git pull origin main

# 4. Instalar deps
npm install --production

# 5. Reiniciar
pm2 restart ibabycoach

# 6. Ver status
pm2 status

# 7. Sair
exit
```

---

## 🔧 Solução de Problemas

### Erro: "Permission denied (publickey)"
```bash
# A chave precisa ter permissão 400
chmod 400 ~/Downloads/sua-chave.pem

# Tente conectar novamente
ssh -i ~/Downloads/sua-chave.pem ubuntu@SEU-IP
```

### Erro: "No such file or directory" (pasta não encontrada)
```bash
# Depois de conectar, procure a pasta:
ls ~
ls /var/www
ls /home/ubuntu

# Use o caminho completo que encontrar:
cd /caminho/completo/da/pasta
```

### Erro: "git pull" não funciona
```bash
# Pode precisar configurar git no servidor
git config --global user.email "seu@email.com"
git config --global user.name "Seu Nome"

# Se pedir senha do GitHub, use Personal Access Token
# Gere em: https://github.com/settings/tokens
```

### Aplicação não reinicia (pm2 restart falha)
```bash
# Veja os erros
pm2 logs ibabycoach --lines 100

# Ou reinicie manualmente
pm2 delete ibabycoach
pm2 start iBabycoach.js --name ibabycoach
pm2 save
```

### Como ver se o servidor está rodando mesmo
```bash
# Dentro do servidor EC2:
pm2 status

# Deve mostrar algo como:
# ibabycoach │ online │ ...

# Se mostrar "stopped" ou "errored":
pm2 logs ibabycoach
```

---

## 💡 DICA: Script Automático

Para não precisar fazer tudo manualmente, crie um script local:

```bash
# Crie um arquivo: atualizar.sh
nano atualizar.sh

# Cole este conteúdo (SUBSTITUA os valores):
#!/bin/bash
ssh -i ~/Downloads/SUA-CHAVE.pem ubuntu@SEU-IP << 'EOF'
cd ibabycoach_backend
git pull origin main
npm install --production
pm2 restart ibabycoach
pm2 status
EOF

# Salve: Ctrl+O, Enter, Ctrl+X

# Torne executável:
chmod +x atualizar.sh

# Use sempre que quiser atualizar:
./atualizar.sh
```

---

## 📞 Precisa de Ajuda?

Se algo não funcionar:
1. Copie a mensagem de erro completa
2. Verifique se tem acesso SSH ao servidor
3. Verifique se o IP está correto
4. Verifique se a chave .pem está no lugar certo
