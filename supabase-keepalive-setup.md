# Sistema Keep-Alive para Supabase (Plano Gratuito)

## 🎯 Objetivo
Manter o projeto Supabase ativo no plano gratuito através de execuções diárias automatizadas, evitando o desligamento após 7 dias de inatividade.

## 🔧 Configuração Implementada

### 1. Edge Function Criada
- **Nome:** `keep-alive`
- **Função:** Executa uma query mínima no banco para manter atividade
- **URL:** `https://[seu-projeto].supabase.co/functions/v1/keep-alive`

### 2. Tabela de Logs
- **Tabela:** `system_keepalive_logs`
- **Função:** Registra todas as execuções do sistema

## 📅 Configuração do Cron Job

### Opção 1: GitHub Actions (Recomendado)
Crie um arquivo `.github/workflows/keepalive.yml` no seu repositório:

```yaml
name: Supabase Keep-Alive

on:
  schedule:
    # Executa todo dia às 08:00 UTC (05:00 BRT)
    - cron: '0 8 * * *'
  workflow_dispatch: # Permite execução manual

jobs:
  keepalive:
    runs-on: ubuntu-latest
    steps:
      - name: Chamar Keep-Alive
        run: |
          curl -X POST "https://[SEU-PROJETO].supabase.co/functions/v1/keep-alive" \
            -H "Authorization: Bearer [SEU-ANON-KEY]" \
            -H "Content-Type: application/json" \
            -d '{"source": "github-actions"}'
```

### Opção 2: Cron-Job.org (Gratuito)
1. Acesse https://cron-job.org/
2. Crie uma conta gratuita
3. Adicione um novo cron job:
   - **URL:** `https://[seu-projeto].supabase.co/functions/v1/keep-alive`
   - **Método:** POST
   - **Frequência:** Diária (ex: 08:00)
   - **Headers:** 
     - `Authorization: Bearer [SEU-ANON-KEY]`
     - `Content-Type: application/json`

### Opção 3: Uptime Robot (Gratuito)
1. Acesse https://uptimerobot.com/
2. Crie uma conta gratuita
3. Adicione um novo monitor:
   - **Tipo:** HTTP(s)
   - **URL:** `https://[seu-projeto].supabase.co/functions/v1/keep-alive`
   - **Interval:** 24 horas

## 🔐 Configuração de Segurança

### Chaves Necessárias:
- **SUPABASE_URL:** URL do seu projeto
- **SUPABASE_ANON_KEY:** Chave anônima do projeto

### Para GitHub Actions:
Adicione as seguintes secrets no seu repositório:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## 📊 Monitoramento

### Verificar Execuções:
```sql
SELECT * FROM system_keepalive_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

### Verificar Status da Função:
```bash
curl -X POST "https://[SEU-PROJETO].supabase.co/functions/v1/keep-alive" \
  -H "Authorization: Bearer [SEU-ANON-KEY]" \
  -H "Content-Type: application/json"
```

## 🛠️ Testando o Sistema

### Teste Manual:
```bash
# Substitua [SEU-PROJETO] e [SEU-ANON-KEY] pelos valores corretos
curl -X POST "https://[SEU-PROJETO].supabase.co/functions/v1/keep-alive" \
  -H "Authorization: Bearer [SEU-ANON-KEY]" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Resposta Esperada:
```json
{
  "success": true,
  "message": "Projeto mantido ativo com sucesso!",
  "timestamp": "2025-07-12T14:26:31.721Z",
  "data": [...],
  "info": "Esta função é executada diariamente para manter o projeto ativo no plano gratuito"
}
```

## 🔄 Automação Completa

### Script de Configuração (Bash):
```bash
#!/bin/bash
# config-keepalive.sh

# Configurações
SUPABASE_URL="https://[SEU-PROJETO].supabase.co"
SUPABASE_ANON_KEY="[SEU-ANON-KEY]"

# Testa a função
echo "Testando keep-alive..."
response=$(curl -s -X POST "$SUPABASE_URL/functions/v1/keep-alive" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json")

echo "Resposta: $response"

# Verifica logs
echo "Últimas execuções:"
# Adicione aqui consulta SQL para verificar logs
```

## 📈 Benefícios

1. **Projeto Sempre Ativo:** Evita desligamento após 7 dias
2. **Operação Mínima:** Usa recursos mínimos do banco
3. **Logs Detalhados:** Registra todas as execuções
4. **Flexível:** Pode ser configurado com diferentes serviços
5. **Gratuito:** Usa apenas recursos do plano gratuito

## ⚠️ Importante

- **Substitua** `[SEU-PROJETO]` pela URL real do seu projeto
- **Substitua** `[SEU-ANON-KEY]` pela chave anônima real
- **Mantenha** as chaves seguras e não as commite no repositório
- **Teste** o sistema antes de colocar em produção

## 🔧 Troubleshooting

### Se a função não executar:
1. Verifique se a URL está correta
2. Verifique se a chave de API está válida
3. Verifique os logs da Edge Function
4. Teste manualmente primeiro

### Se houver erro de permissão:
1. Verifique se o RLS não está bloqueando
2. Use a service role key se necessário
3. Verifique as políticas de segurança

---

✅ **Sistema configurado e pronto para uso!** 