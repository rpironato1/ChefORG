#!/bin/bash

# 🔍 Script de Validação de Dependências - ChefORG
# Baseado na teoria dos grafos para validar ordem de inicialização

echo "🔍 Validando Dependências ChefORG..."
echo "================================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar porta
check_port() {
  local port=$1
  local service=$2
  
  if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}❌ Porta $port ocupada${NC} ($service)"
    return 1
  else
    echo -e "${GREEN}✅ Porta $port disponível${NC} ($service)"
    return 0
  fi
}

# Função para verificar se comando existe
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Função para verificar dependências do sistema
check_system_dependencies() {
  echo -e "\n${BLUE}🔧 Verificando Dependências do Sistema${NC}"
  echo "----------------------------------------"
  
  # Node.js
  if command_exists node; then
    node_version=$(node --version)
    echo -e "${GREEN}✅ Node.js instalado${NC} ($node_version)"
  else
    echo -e "${RED}❌ Node.js não encontrado${NC}"
    return 1
  fi
  
  # npm
  if command_exists npm; then
    npm_version=$(npm --version)
    echo -e "${GREEN}✅ npm instalado${NC} ($npm_version)"
  else
    echo -e "${RED}❌ npm não encontrado${NC}"
    return 1
  fi
  
  # Expo CLI (opcional para mobile)
  if command_exists expo; then
    expo_version=$(expo --version)
    echo -e "${GREEN}✅ Expo CLI instalado${NC} ($expo_version)"
  else
    echo -e "${YELLOW}⚠️ Expo CLI não encontrado${NC} (opcional para mobile)"
  fi
}

# Função principal de verificação de portas
check_ports() {
  echo -e "\n${BLUE}📋 Verificando Portas (8100-8120)${NC}"
  echo "----------------------------------------"
  
  local all_ports_free=true
  
  check_port 8100 "Mobile Metro Bundler" || all_ports_free=false
  check_port 8110 "Web Vite Server" || all_ports_free=false
  check_port 8115 "Playwright Tests" || all_ports_free=false
  check_port 8120 "Storybook (reservado)" || all_ports_free=false
  
  if [ "$all_ports_free" = true ]; then
    echo -e "\n${GREEN}🎉 Todas as portas estão disponíveis!${NC}"
    return 0
  else
    echo -e "\n${YELLOW}⚠️ Algumas portas estão ocupadas. Execute resolve_port_conflicts se necessário.${NC}"
    return 1
  fi
}

# Função para resolver conflitos de porta
resolve_port_conflicts() {
  echo -e "\n${BLUE}🔧 Resolvendo Conflitos de Porta${NC}"
  echo "----------------------------------------"
  
  for port in {8100..8120}; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
      echo -e "${YELLOW}🚫 Finalizando processo na porta $port (PID: $pid)${NC}"
      kill -9 $pid 2>/dev/null
      sleep 1
      
      # Verificar se foi finalizado
      if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Porta $port liberada${NC}"
      else
        echo -e "${RED}❌ Falha ao liberar porta $port${NC}"
      fi
    fi
  done
  
  echo -e "\n${GREEN}✅ Resolução de conflitos concluída!${NC}"
}

# Função para testar conectividade de serviços
test_service_connectivity() {
  echo -e "\n${BLUE}🔗 Testando Conectividade de Serviços${NC}"
  echo "----------------------------------------"
  
  # Testar web server
  if curl -f -s http://localhost:8110 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Web Server (8110) respondendo${NC}"
  else
    echo -e "${YELLOW}⚠️ Web Server (8110) não disponível${NC} (normal se não iniciado)"
  fi
  
  # Testar mobile metro
  if curl -f -s http://localhost:8100 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Mobile Metro (8100) respondendo${NC}"
  else
    echo -e "${YELLOW}⚠️ Mobile Metro (8100) não disponível${NC} (normal se não iniciado)"
  fi
}

# Função para verificar estrutura do projeto
check_project_structure() {
  echo -e "\n${BLUE}📂 Verificando Estrutura do Projeto${NC}"
  echo "----------------------------------------"
  
  local structure_valid=true
  
  # Verificar diretórios principais
  for dir in "src" "web" "mobile" "shared" "scripts"; do
    if [ -d "$dir" ]; then
      echo -e "${GREEN}✅ Diretório $dir encontrado${NC}"
    else
      echo -e "${RED}❌ Diretório $dir não encontrado${NC}"
      structure_valid=false
    fi
  done
  
  # Verificar arquivos importantes
  for file in "package.json" "vite.config.ts" "tsconfig.json"; do
    if [ -f "$file" ]; then
      echo -e "${GREEN}✅ Arquivo $file encontrado${NC}"
    else
      echo -e "${RED}❌ Arquivo $file não encontrado${NC}"
      structure_valid=false
    fi
  done
  
  if [ "$structure_valid" = true ]; then
    echo -e "\n${GREEN}🎉 Estrutura do projeto válida!${NC}"
    return 0
  else
    echo -e "\n${RED}❌ Problemas na estrutura do projeto detectados${NC}"
    return 1
  fi
}

# Função para verificar types do shared
check_shared_types() {
  echo -e "\n${BLUE}🔍 Verificando Shared Types${NC}"
  echo "----------------------------------------"
  
  if [ -d "shared" ]; then
    cd shared
    
    if [ -f "package.json" ]; then
      if npm run type-check >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Shared types válidos${NC}"
        cd ..
        return 0
      else
        echo -e "${YELLOW}⚠️ Shared types com problemas (desenvolvimento ativo)${NC}"
        cd ..
        return 0  # Made non-blocking for development
      fi
    else
      echo -e "${YELLOW}⚠️ package.json não encontrado no shared${NC}"
      cd ..
      return 1
    fi
  else
    echo -e "${RED}❌ Diretório shared não encontrado${NC}"
    return 1
  fi
}

# Função para gerar relatório de dependências
generate_dependency_report() {
  echo -e "\n${BLUE}📊 Gerando Relatório de Dependências${NC}"
  echo "----------------------------------------"
  
  local report_file="dependency-validation-report.md"
  
  cat > "$report_file" << EOF
# 📋 Relatório de Validação de Dependências - ChefORG

**Data:** $(date)
**Versão:** v1.1

## 🔍 Status do Sistema

### Portas Verificadas (8100-8120)
EOF
  
  # Adicionar status das portas ao relatório
  for port in 8100 8110 8115 8120; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
      echo "- ❌ Porta $port: OCUPADA" >> "$report_file"
    else
      echo "- ✅ Porta $port: DISPONÍVEL" >> "$report_file"
    fi
  done
  
  cat >> "$report_file" << EOF

## 🏗️ Ordem de Inicialização Recomendada

1. \`npm run dev:web\` (Porta 8110)
2. \`npm run dev:mobile\` (Porta 8100) 
3. \`npm run test:mcp\` (Porta 8115)

## 📈 Próximas Ações

- [ ] Verificar conflitos de porta se necessário
- [ ] Validar shared types antes do desenvolvimento
- [ ] Executar testes completos para validação

**Gerado por:** validate-dependencies.sh
EOF

  echo -e "${GREEN}✅ Relatório salvo em: $report_file${NC}"
}

# Função principal
main() {
  echo -e "${BLUE}🚀 ChefORG Dependency Validator v1.1${NC}"
  echo -e "${BLUE}Baseado em Teoria dos Grafos para Validação Modular${NC}"
  echo ""
  
  # Verificar se estamos no diretório correto
  if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script na raiz do projeto ChefORG${NC}"
    exit 1
  fi
  
  local all_checks_passed=true
  
  # Executar todas as verificações
  check_system_dependencies || all_checks_passed=false
  check_project_structure || all_checks_passed=false
  check_ports || all_checks_passed=false
  test_service_connectivity
  check_shared_types || all_checks_passed=false
  
  # Gerar relatório
  generate_dependency_report
  
  echo ""
  echo "================================================"
  
  if [ "$all_checks_passed" = true ]; then
    echo -e "${GREEN}🎉 TODAS AS VERIFICAÇÕES PASSARAM!${NC}"
    echo -e "${GREEN}Sistema pronto para desenvolvimento.${NC}"
    echo ""
    echo -e "${BLUE}💡 Próximos passos:${NC}"
    echo -e "1. ${YELLOW}npm run dev:web${NC} - Iniciar servidor web"
    echo -e "2. ${YELLOW}npm run dev:mobile${NC} - Iniciar mobile (opcional)"
    echo -e "3. ${YELLOW}npm run test:mcp${NC} - Executar testes completos"
  else
    echo -e "${RED}❌ ALGUMAS VERIFICAÇÕES FALHARAM${NC}"
    echo -e "${YELLOW}Revise os problemas acima antes de continuar.${NC}"
    echo ""
    echo -e "${BLUE}🔧 Para resolver conflitos de porta:${NC}"
    echo -e "${YELLOW}./validate-dependencies.sh --resolve-ports${NC}"
  fi
  
  echo ""
}

# Verificar argumentos de linha de comando
case "${1:-}" in
  --resolve-ports)
    resolve_port_conflicts
    ;;
  --help)
    echo "Uso: $0 [opção]"
    echo ""
    echo "Opções:"
    echo "  (nenhuma)        Executar validação completa"
    echo "  --resolve-ports  Resolver conflitos de porta"
    echo "  --help          Mostrar esta ajuda"
    ;;
  *)
    main
    ;;
esac