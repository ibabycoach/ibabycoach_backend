#!/bin/bash
# Script simples para atualizar o backend - Elastic Beanstalk

echo "🚀 Atualizando backend no Elastic Beanstalk..."
echo ""

# Verifica se está no diretório correto
if [ ! -f "iBabycoach.js" ]; then
    echo "❌ Erro: Execute este script na pasta raiz do projeto"
    exit 1
fi

# Verifica se tem mudanças não commitadas
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Você tem alterações não salvas no Git"
    echo "Deseja commitar agora? (s/n)"
    read -r resposta
    
    if [ "$resposta" = "s" ] || [ "$resposta" = "S" ]; then
        echo "📝 Digite a mensagem do commit:"
        read -r mensagem
        git add .
        git commit -m "$mensagem"
        git push origin main
        echo "✅ Código enviado para o GitHub"
    else
        echo "❌ Cancelado. Commit suas mudanças antes de fazer deploy."
        exit 1
    fi
fi

echo ""
echo "🔄 Fazendo deploy no Elastic Beanstalk..."
eb deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deploy realizado com sucesso!"
    echo ""
    echo "📊 Comandos úteis:"
    echo "   eb status  - Ver status do ambiente"
    echo "   eb logs    - Ver logs da aplicação"
    echo "   eb open    - Abrir no navegador"
else
    echo ""
    echo "❌ Erro no deploy. Execute 'eb logs' para ver os erros"
    exit 1
fi
