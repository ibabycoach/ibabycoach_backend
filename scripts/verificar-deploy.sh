#!/bin/bash
# Script para identificar como o backend está implantado na AWS

echo "🔍 Verificando como seu backend está implantado na AWS..."
echo ""

# Verificar Elastic Beanstalk
echo "1️⃣ Verificando Elastic Beanstalk..."
if command -v eb &> /dev/null; then
    eb status 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ ENCONTRADO: Elastic Beanstalk"
        echo "📝 Para atualizar: use o comando 'eb deploy'"
        exit 0
    fi
fi
echo "❌ Não encontrado via EB CLI"
echo ""

# Verificar via AWS CLI
echo "2️⃣ Verificando via AWS CLI..."
if command -v aws &> /dev/null; then
    echo "Checando Elastic Beanstalk..."
    aws elasticbeanstalk describe-environments --query "Environments[?Status=='Ready'].{Name:EnvironmentName,App:ApplicationName,URL:CNAME}" --output table 2>/dev/null
    
    echo ""
    echo "Checando instâncias EC2..."
    aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --query "Reservations[].Instances[].{ID:InstanceId,Name:Tags[?Key=='Name']|[0].Value,IP:PublicIpAddress}" --output table 2>/dev/null
    
    echo ""
    echo "Checando ECS/Fargate..."
    aws ecs list-clusters --query "clusterArns" --output table 2>/dev/null
else
    echo "❌ AWS CLI não instalado"
fi

echo ""
echo "3️⃣ Você também pode verificar no Console AWS:"
echo "   - Elastic Beanstalk: https://console.aws.amazon.com/elasticbeanstalk"
echo "   - EC2: https://console.aws.amazon.com/ec2"
echo "   - ECS: https://console.aws.amazon.com/ecs"
