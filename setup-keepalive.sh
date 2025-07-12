#!/bin/bash

# 🔧 CONFIGURAÇÃO DO KEEP-ALIVE SUPABASE
# Este script configura o sistema para manter o projeto ativo no plano gratuito

echo "🚀 Configurando Keep-Alive para Supabase..."

# Configurações do projeto
SUPABASE_URL="https://ybefpjodbvfhfcvqsxkl.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZWZwam9kYnZmaGZjdnFzeGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NTM3MzEsImV4cCI6MjA2NzMyOTczMX0.lmxQ_9yHj77NS_C56zIBy8Xp0l-OSQBn-yrC64WvfV0"

echo "📊 Testando função keep-alive..."

# Testa a função
response=$(curl -s -X POST "$SUPABASE_URL/functions/v1/keep-alive" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": true, "source": "manual-test"}')

echo "📋 Resposta da função:"
echo "$response"

# Verifica se funcionou
if echo "$response" | grep -q '"success": true'; then
  echo "✅ Função keep-alive está funcionando!"
else
  echo "❌ Erro na função keep-alive"
  echo "Verifique os logs e configurações"
  exit 1
fi

echo ""
echo "🔗 URLs importantes:"
echo "- Edge Function: $SUPABASE_URL/functions/v1/keep-alive"
echo "- Dashboard: https://supabase.com/dashboard/project/ybefpjodbvfhfcvqsxkl"
echo ""

echo "📅 Próximos passos:"
echo "1. Configure um cron job externo (GitHub Actions, cron-job.org, etc.)"
echo "2. Use a URL: $SUPABASE_URL/functions/v1/keep-alive"
echo "3. Método: POST"
echo "4. Header: Authorization: Bearer [SUA-CHAVE-ANON]"
echo "5. Frequência: Diária"
echo ""

echo "🛠️ Opções de configuração:"
echo ""
echo "OPÇÃO 1 - GitHub Actions:"
echo "- Arquivo já criado: .github/workflows/keepalive.yml"
echo "- Adicione a secret SUPABASE_ANON_KEY no repositório"
echo "- Valor da secret: $SUPABASE_ANON_KEY"
echo ""

echo "OPÇÃO 2 - Cron-Job.org:"
echo "- Acesse: https://cron-job.org/"
echo "- URL: $SUPABASE_URL/functions/v1/keep-alive"
echo "- Método: POST"
echo "- Header: Authorization: Bearer $SUPABASE_ANON_KEY"
echo "- Frequência: Diária (08:00 UTC)"
echo ""

echo "OPÇÃO 3 - Uptime Robot:"
echo "- Acesse: https://uptimerobot.com/"
echo "- URL: $SUPABASE_URL/functions/v1/keep-alive"
echo "- Interval: 24 horas"
echo ""

echo "🎉 Configuração concluída!"
echo "O sistema está pronto para manter seu projeto Supabase ativo 24/7!" 