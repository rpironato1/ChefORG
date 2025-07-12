# ⚡ QUICK START - KEEP-ALIVE SUPABASE

## 🎯 **1 MINUTO PARA CONFIGURAR**

### **✅ JÁ CRIADO:**
- Edge Function: `keep-alive` 
- Tabela de logs: `system_keepalive_logs`
- Workflow GitHub Actions: `.github/workflows/keepalive.yml`

### **🔧 CONFIGURAÇÃO RÁPIDA:**

#### **GitHub Actions (Recomendado):**
1. Vá em: `Settings > Secrets and variables > Actions`
2. Adicione: `SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZWZwam9kYnZmaGZjdnFzeGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NTM3MzEsImV4cCI6MjA2NzMyOTczMX0.lmxQ_9yHj77NS_C56zIBy8Xp0l-OSQBn-yrC64WvfV0`
3. Commit: `git add . && git commit -m "feat: keep-alive" && git push`

#### **Cron-Job.org (Alternativa):**
1. Acesse: https://cron-job.org/
2. URL: `https://ybefpjodbvfhfcvqsxkl.supabase.co/functions/v1/keep-alive`
3. Método: `POST`
4. Header: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZWZwam9kYnZmaGZjdnFzeGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NTM3MzEsImV4cCI6MjA2NzMyOTczMX0.lmxQ_9yHj77NS_C56zIBy8Xp0l-OSQBn-yrC64WvfV0`

### **📊 TESTAR:**
```sql
SELECT * FROM system_keepalive_logs ORDER BY created_at DESC LIMIT 5;
```

### **🎉 PRONTO!**
Seu projeto nunca mais será pausado após 7 dias! 🚀 