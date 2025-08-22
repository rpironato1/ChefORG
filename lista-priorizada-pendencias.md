# LISTA PRIORIZADA DE PENDÊNCIAS - SISTEMA ChefORG

**Data da Análise:** Dezembro 2024  
**Critérios de Priorização:** Impacto no Deploy + Funcionalidade Core + Experiência do Usuario  
**Status:** Aguardando documentos complementares para finalização  

---

## 🔴 PRIORIDADE CRÍTICA (Bloqueia Deploy/Produção)

### 1. CORREÇÃO DE BUILD ERRORS ⚡ COMPLEXIDADE: BAIXA
- **Problema:** 128 erros TypeScript impedem build de produção
- **Impacto:** Sistema não pode ser deployed
- **Estimativa:** 4-8 horas
- **Arquivos Afetados:** Multiple .tsx/.ts files
- **Ação:** Corrigir imports, tipos, e unused variables

### 2. IMPLEMENTAÇÃO DE TESTES BÁSICOS ⚡ COMPLEXIDADE: ALTA
- **Problema:** 0% cobertura de testes
- **Impacto:** Sem garantias de qualidade/regressão
- **Estimativa:** 3-5 dias
- **Escopo Mínimo:** Testes unitários para business logic crítica
- **Ação:** Configurar Jest/Vitest + testes para fluxos principais

---

## 🟡 PRIORIDADE ALTA (Funcionalidade Core)

### 3. CORREÇÃO DE DADOS MISTOS ⚡ COMPLEXIDADE: MÉDIA
- **Problema:** Mix de dados real/mock/localStorage gera inconsistências
- **Impacto:** UX inconsistente, bugs em produção
- **Estimativa:** 2-3 dias
- **Ação:** Padronizar uso do Supabase, remover mocks

### 4. DASHBOARD COM DADOS REAIS ⚡ COMPLEXIDADE: MÉDIA
- **Problema:** Dashboard usa apenas dados mock
- **Impacto:** Painéis administrativos não funcionais
- **Estimativa:** 1-2 dias
- **Ação:** Integrar APIs reais nos componentes de dashboard

---

## 🟢 PRIORIDADE MÉDIA (Melhorias UX/Performance)

### 5. IMPLEMENTAR WEBSOCKETS ⚡ COMPLEXIDADE: ALTA
- **Problema:** Atualizações via polling, não tempo real
- **Impacto:** Performance e UX subótima
- **Estimativa:** 3-4 dias
- **Ação:** Implementar Supabase Realtime subscriptions

### 6. MELHORAR SISTEMA DE NOTIFICAÇÕES ⚡ COMPLEXIDADE: BAIXA
- **Problema:** Notificações básicas sem persistência
- **Impacto:** Usuários podem perder alertas importantes
- **Estimativa:** 1 dia
- **Ação:** Implementar sistema de notificações persistentes

---

## 🔵 PRIORIDADE BAIXA (Nice-to-Have)

### 7. DOCUMENTAÇÃO TÉCNICA COMPLETA ⚡ COMPLEXIDADE: BAIXA
- **Problema:** Falta documentação de APIs e deployment
- **Impacto:** Dificuldade de manutenção/onboarding
- **Estimativa:** 1-2 dias
- **Ação:** Gerar OpenAPI docs, guias de deploy

### 8. OTIMIZAÇÕES DE PERFORMANCE ⚡ COMPLEXIDADE: MÉDIA
- **Problema:** Bundle size, lazy loading não otimizado
- **Impacto:** Loading times mais lentos
- **Estimativa:** 2-3 dias
- **Ação:** Code splitting, optimização bundle

---

## 📊 RESUMO DE ESTIMATIVAS

| Prioridade | Itens | Tempo Total | Complexidade Média |
|------------|-------|-------------|-------------------|
| 🔴 Crítica | 2 | 4-6 dias | Média |
| 🟡 Alta | 2 | 3-5 dias | Média |
| 🟢 Média | 2 | 4-5 dias | Alta |
| 🔵 Baixa | 2 | 3-5 dias | Baixa |
| **TOTAL** | **8** | **14-21 dias** | **Variada** |

---

## 🎯 ROADMAP SUGERIDO

### Sprint 1 (5-7 dias) - Deploy Ready
1. Corrigir build errors (🔴)
2. Implementar testes básicos (🔴)

### Sprint 2 (3-5 dias) - Core Stability  
1. Padronizar dados reais (🟡)
2. Dashboard funcional (🟡)

### Sprint 3 (4-5 dias) - UX Enhancements
1. WebSockets implementação (🟢)
2. Sistema notificações (🟢)

### Sprint 4 (3-5 dias) - Polish & Docs
1. Documentação técnica (🔵)
2. Otimizações performance (🔵)

---

## ⚠️ OBSERVAÇÕES IMPORTANTES

- **Estimativas podem variar** baseadas nos documentos PROGRESSO.md e escopo-falt.md
- **Dependências:** Alguns itens podem ter dependências entre si
- **Recursos:** Estimativas assumem 1 desenvolvedor full-time
- **Testing:** Tempo de QA não incluído nas estimativas

---

*Lista em construção - será refinada após análise completa dos documentos pendentes*