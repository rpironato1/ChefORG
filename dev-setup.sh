#!/bin/bash

# 🚀 ChefORG Development Setup Script
# Configura e inicia todos os módulos na sequência correta com portas 8100-8120

set -e

echo "🎯 ChefORG - Script de Desenvolvimento"
echo "======================================="

# Verificar se está no diretório correto
if [ ! -f "package.json" ] || [ ! -d "web" ] || [ ! -d "mobile" ] || [ ! -d "shared" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto ChefORG"
    exit 1
fi

# Função para verificar se porta está em uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Porta $port está em uso. Matando processo..."
        lsof -ti :$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Verificar e liberar portas necessárias
echo "🔍 Verificando portas 8100-8120..."
check_port 8100  # Mobile
check_port 8110  # Web
check_port 8115  # Tests

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm run install:all
fi

# Validar types no shared
echo "🔧 Validando tipos compartilhados..."
cd shared
npm run type-check || {
    echo "❌ Erro nos tipos compartilhados. Corrija os erros antes de continuar."
    exit 1
}
cd ..

echo "✅ Configuração concluída!"
echo ""
echo "🚀 Para iniciar o desenvolvimento:"
echo ""
echo "1. WEB (Desktop/Tablet):"
echo "   npm run dev:web"
echo "   🌐 http://localhost:8110"
echo ""
echo "2. MOBILE (iOS/Android/PWA):"
echo "   npm run dev:mobile"
echo "   📱 http://localhost:8100"
echo ""
echo "3. TESTES (Validação):"
echo "   npm run test:mcp"
echo "   🧪 http://localhost:8115"
echo ""
echo "💡 Dica: Abra terminais separados para cada comando"
echo "📚 Documentação: DOCUMENTACAO-MODULARIZACAO.md"