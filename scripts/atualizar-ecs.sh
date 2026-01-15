#!/bin/bash
# Script simples para atualizar o backend - ECS/Docker

echo "🚀 Atualizando backend no ECS/Fargate..."
echo ""

# Solicita informações
echo "📋 Digite o ID da sua conta AWS (12 dígitos):"
read -r AWS_ACCOUNT

echo "📋 Digite a região (ex: us-east-1):"
read -r AWS_REGION

echo "📋 Digite o nome do repositório ECR (ex: ibabycoach):"
read -r REPO_NAME

echo "📋 Digite o nome do serviço ECS (ex: ibabycoach-service):"
read -r SERVICE_NAME

echo "📋 Digite o nome do cluster ECS (ex: ibabycoach-cluster):"
read -r CLUSTER_NAME

echo ""
echo "🔐 Fazendo login no ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com

echo ""
echo "🏗️  Construindo imagem Docker..."
docker build -t $REPO_NAME .

if [ $? -ne 0 ]; then
    echo "❌ Erro ao construir imagem"
    exit 1
fi

echo ""
echo "🏷️  Criando tag da imagem..."
docker tag $REPO_NAME:latest $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest

echo ""
echo "☁️  Enviando para AWS ECR..."
docker push $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest

if [ $? -ne 0 ]; then
    echo "❌ Erro ao enviar imagem"
    exit 1
fi

echo ""
echo "🔄 Forçando novo deploy no ECS..."
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment --region $AWS_REGION

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deploy iniciado com sucesso!"
    echo ""
    echo "📊 Acompanhe o progresso:"
    echo "   aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION"
else
    echo ""
    echo "❌ Erro ao atualizar serviço ECS"
    exit 1
fi
