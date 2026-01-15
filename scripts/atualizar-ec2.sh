#!/bin/bash
# Script simples para atualizar o backend - EC2

echo "🚀 Atualizando backend no EC2..."
echo ""

# Solicita informações
echo "📋 Digite o IP da sua instância EC2:"
read -r EC2_IP

echo "📋 Digite o caminho da sua chave SSH (ex: ~/Downloads/minha-chave.pem):"
read -r KEY_PATH

# Expande ~ para o caminho completo
KEY_PATH="${KEY_PATH/#\~/$HOME}"

if [ ! -f "$KEY_PATH" ]; then
    echo "❌ Arquivo de chave não encontrado: $KEY_PATH"
    exit 1
fi

echo ""
echo "🔄 Conectando ao servidor e atualizando..."

ssh -i "$KEY_PATH" ubuntu@$EC2_IP << 'ENDSSH'
    echo "📂 Entrando na pasta do projeto..."
    cd ~/ibabycoach_backend || cd ~/ibabycoach-backend || cd /var/www/ibabycoach*
    
    if [ $? -ne 0 ]; then
        echo "❌ Pasta do projeto não encontrada"
        exit 1
    fi
    
    echo "📥 Baixando última versão do código..."
    git pull origin main
    
    echo "📦 Instalando dependências..."
    npm install --production
    
    echo "🔄 Reiniciando aplicação..."
    pm2 restart ibabycoach || pm2 restart all
    
    echo ""
    echo "✅ Atualização concluída!"
    echo ""
    echo "📊 Status da aplicação:"
    pm2 status
ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deploy realizado com sucesso!"
    echo ""
    echo "📊 Para ver logs: ssh -i $KEY_PATH ubuntu@$EC2_IP 'pm2 logs'"
else
    echo ""
    echo "❌ Erro no deploy"
    exit 1
fi
