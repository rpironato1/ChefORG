# LISTA PRIORIZADA DE PENDÊNCIAS - SISTEMA ChefORG

**Data da Análise:** Dezembro 2024  
**Critérios de Priorização:** Impacto no Deploy + Funcionalidade Core + Experiência do Usuario  
**Base de Análise:** Escopo-realizar.md + Código atual (10.057 linhas)  
**Status Geral:** 75% implementado, não pronto para produção

---

## 🔴 PRIORIDADE CRÍTICA (Bloqueia Deploy/Produção) - **SPRINT 1**

### 1. CORREÇÃO DE BUILD ERRORS ⚡ COMPLEXIDADE: BAIXA

- **Problema:** 128 erros TypeScript impedem build de produção
- **Impacto:** ❌ Sistema não pode ser deployado
- **Estimativa:** 6-8 horas
- **Arquivos Principais:**
  - `src/components/auth/ProtectedRoute.tsx` (Property 'state' does not exist)
  - `src/contexts/AppContext.tsx` (ApiResponse not exported)
  - `src/hooks/useBusinessLogic.ts` (unused variables, undefined types)
  - Multiple files (unused React imports)
- **Ação Específica:**
  1. Corrigir exports/imports em `lib/api/index.ts`
  2. Remover imports não utilizados
  3. Corrigir tipagem no contexto de autenticação
  4. Validar undefined checks no business logic

### 2. IMPLEMENTAÇÃO DE TESTES CRÍTICOS ⚡ COMPLEXIDADE: ALTA

- **Problema:** 0% cobertura de testes (não atende seção 8 do escopo)
- **Impacto:** ❌ Sem garantias de qualidade, impossível deploy seguro
- **Estimativa:** 3-5 dias
- **Escopo Mínimo:**
  - Testes unitários para `useBusinessLogic.ts` (PIN, validações)
  - Testes de integração para APIs críticas (reservations, orders, payments)
  - Testes E2E para fluxo principal (reserva → pedido → pagamento)
- **Ação:** Configurar Vitest + React Testing Library + Playwright

### 3. CORREÇÃO CONTEXT API ⚡ COMPLEXIDADE: MÉDIA

- **Problema:** `ProtectedRoute` não consegue acessar `state` do contexto
- **Impacto:** ❌ Rotas protegidas não funcionam, sistema de autenticação quebrado
- **Estimativa:** 4-6 horas
- **Arquivo:** `src/components/auth/ProtectedRoute.tsx` + `src/contexts/AppContext.tsx`
- **Ação:** Reintegrar AppContext com autenticação Supabase

---

## 🟡 PRIORIDADE ALTA (Funcionalidade Core) - **SPRINT 2**

### 4. DASHBOARD COM DADOS REAIS ⚡ COMPLEXIDADE: MÉDIA

- **Problema:** Dashboard usa 100% dados mock (não atende seção 4.11 do escopo)
- **Impacto:** ⚠️ Painéis administrativos não funcionais para produção
- **Estimativa:** 2-3 dias
- **Arquivos:** `src/pages/admin/Dashboard.tsx` + `lib/api/reports.ts`
- **Ação:**
  1. Implementar queries reais em `reports.ts`
  2. Conectar componentes de gráfico com dados do Supabase
  3. Criar agregações de vendas, reservas, tempo médio

### 5. SISTEMA DE ESTOQUE ⚡ COMPLEXIDADE: ALTA

- **Problema:** Seção 4.12 do escopo não implementada (stock.ts tem apenas 25 linhas)
- **Impacto:** ⚠️ Controle de ingredientes e custos ausente
- **Estimativa:** 3-4 dias
- **Ação:**
  1. Criar tabela `stock` no Supabase
  2. Implementar CRUD completo em `lib/api/stock.ts`
  3. Integrar com menu items (consumo por prato)
  4. Tela de gestão de estoque

### 6. PROGRAMA DE FIDELIDADE ⚡ COMPLEXIDADE: MÉDIA

- **Problema:** Seção 4.13 parcialmente implementada, não integrada aos fluxos
- **Impacto:** ⚠️ Funcionalidade prometida não funcional
- **Estimativa:** 2-3 dias
- **Arquivos:** `lib/api/loyalty.ts` + fluxos de pagamento
- **Ação:**
  1. Integrar pontos no fluxo de feedback
  2. Sistema de cupons e descontos
  3. Tela de fidelidade para clientes

### 7. CORREÇÃO DE DADOS MISTOS ⚡ COMPLEXIDADE: MÉDIA

- **Problema:** Dashboard, fila virtual e métricas usam dados mock
- **Impacto:** ⚠️ Inconsistências graves entre dados reais e simulados
- **Estimativa:** 2-3 dias
- **Ação:**
  1. Substituir localStorage por Supabase na fila virtual
  2. Remover todos os dados mock dos dashboards
  3. Padronizar fonte única de dados

---

## 🟢 PRIORIDADE MÉDIA (Melhorias UX/Performance) - **SPRINT 3**

### 8. IMPLEMENTAR WEBSOCKETS ⚡ COMPLEXIDADE: ALTA

- **Problema:** Atualizações via polling a cada 20s, não tempo real
- **Impacto:** 🔄 Performance subótima, UX não profissional
- **Estimativa:** 3-4 dias
- **Ação:** Implementar Supabase Realtime subscriptions para:
  - Status de pedidos (cozinha → garçom → cliente)
  - Disponibilidade de mesas
  - Fila virtual em tempo real

### 9. TESTES DE INTEGRAÇÃO WHATSAPP/SMS ⚡ COMPLEXIDADE: MÉDIA

- **Problema:** Seção 7.1 e 7.2 do escopo não testadas (estrutura criada)
- **Impacto:** 🔄 Funcionalidades anunciadas podem não funcionar
- **Estimativa:** 1-2 dias
- **Arquivos:** `lib/api/notifications.ts` + `supabase/functions/send-notification`
- **Ação:** Testar integração Twilio em ambiente sandbox

### 10. PAGAMENTOS MANUAIS NO CAIXA ⚡ COMPLEXIDADE: BAIXA

- **Problema:** API criada mas não integrada ao `PainelCaixa.tsx`
- **Impacto:** 🔄 Fluxo de pagamento manual incompleto
- **Estimativa:** 6-8 horas
- **Ação:** Conectar `createManualPayment` ao painel do caixa

### 11. SISTEMA DE RELATÓRIOS ⚡ COMPLEXIDADE: ALTA

- **Problema:** Seção 6.10 do escopo não funcional (queries mockadas)
- **Impacto:** 🔄 Gestão gerencial prejudicada
- **Estimativa:** 2-3 dias
- **Ação:**
  1. Implementar queries agregadas no `reports.ts`
  2. Relatórios de vendas por período
  3. Análise de performance de itens
  4. Métricas de tempo de atendimento

---

## 🔵 PRIORIDADE BAIXA (Polimento e Extras) - **SPRINT 4**

### 12. DOCUMENTAÇÃO OPENAPI ⚡ COMPLEXIDADE: BAIXA

- **Problema:** Seção 9.1 do escopo não implementada
- **Impacto:** 📚 Documentação de API ausente para integrações
- **Estimativa:** 1 dia
- **Ação:** Gerar Swagger/OpenAPI para todos os endpoints

### 13. IMPRESSORA FISCAL ⚡ COMPLEXIDADE: ALTA

- **Problema:** Seção 7.4 do escopo não implementada (opcional)
- **Impacto:** 📄 Compliance fiscal para alguns estabelecimentos
- **Estimativa:** 3-5 dias
- **Ação:** Integração com SAT-CF-e ou similares

### 14. OTIMIZAÇÕES DE PERFORMANCE ⚡ COMPLEXIDADE: MÉDIA

- **Problema:** Aplicação não otimizada para produção
- **Impacto:** 🚀 Performance e SEO podem ser melhorados
- **Estimativa:** 2-3 dias
- **Ação:**
  1. Lazy loading de componentes
  2. Otimização de imagens
  3. Cache de queries frequentes
  4. Bundle splitting

### 15. MELHORIAS DE UX/UI ⚡ COMPLEXIDADE: BAIXA

- **Problema:** Algumas telas sem loading states e error handling
- **Impacto:** 🎨 UX pode ser mais polida
- **Estimativa:** 1-2 dias
- **Ação:**
  1. Loading skeletons em todas as telas
  2. Error boundaries globais
  3. Feedback visual aprimorado
  4. Animações de transição

---

## 📋 ROADMAP DE IMPLEMENTAÇÃO

### **SPRINT 1 (CRÍTICO) - 5-7 DIAS**

**Objetivo:** Tornar o sistema deployável

- ✅ Corrigir 128 erros TypeScript
- ✅ Implementar testes básicos (cobertura mínima 30%)
- ✅ Corrigir Context API e autenticação
- **Entrega:** Sistema deployável e estável

### **SPRINT 2 (FUNCIONALIDADE) - 7-10 DIAS**

**Objetivo:** Completar funcionalidades core

- ✅ Dashboard com dados reais
- ✅ Sistema de estoque funcional
- ✅ Programa de fidelidade integrado
- ✅ Padronizar fontes de dados
- **Entrega:** Todas as funcionalidades do escopo operacionais

### **SPRINT 3 (PERFORMANCE) - 5-7 DIAS**

**Objetivo:** Melhorar performance e confiabilidade

- ✅ WebSockets / tempo real
- ✅ Testar notificações WhatsApp/SMS
- ✅ Completar pagamentos manuais
- ✅ Sistema de relatórios funcional
- **Entrega:** Sistema profissional e performático

### **SPRINT 4 (POLIMENTO) - 3-5 DIAS**

**Objetivo:** Finalizar detalhes e extras

- ✅ Documentação OpenAPI
- ✅ Otimizações de performance
- ✅ Melhorias de UX/UI
- 🔄 Impressora fiscal (se necessário)
- **Entrega:** Sistema production-ready completo

---

## 🎯 CRITÉRIOS DE ACEITAÇÃO

### Para Deploy em Produção:

- [ ] **Build sem erros TypeScript** (0 erros)
- [ ] **Cobertura de testes mínima** (30% para funções críticas)
- [ ] **Autenticação funcional** (todas as rotas protegidas)
- [ ] **APIs principais funcionais** (reserva, pedido, pagamento)
- [ ] **Dashboard com dados reais** (sem mocks)

### Para Uso Comercial:

- [ ] **WebSockets implementados** (atualizações tempo real)
- [ ] **Sistema de relatórios** (vendas, performance)
- [ ] **Controle de estoque** (ingredientes, custos)
- [ ] **Programa de fidelidade** (pontos, cupons)
- [ ] **Notificações testadas** (WhatsApp/SMS funcionais)

### Para Sistema Completo:

- [ ] **100% do escopo implementado**
- [ ] **Documentação OpenAPI**
- [ ] **Performance otimizada**
- [ ] **Compliance fiscal** (se necessário)
- [ ] **Testes E2E abrangentes**

---

**CONCLUSÃO:** O projeto está 75% completo com excelente fundação técnica. Com **5-7 dias de Sprint Crítico**, o sistema estará pronto para deploy básico. Com **20-25 dias de desenvolvimento focado**, todas as funcionalidades do escopo estarão 100% implementadas e testadas.

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

| Prioridade | Itens | Tempo Total    | Complexidade Média |
| ---------- | ----- | -------------- | ------------------ |
| 🔴 Crítica | 2     | 4-6 dias       | Média              |
| 🟡 Alta    | 2     | 3-5 dias       | Média              |
| 🟢 Média   | 2     | 4-5 dias       | Alta               |
| 🔵 Baixa   | 2     | 3-5 dias       | Baixa              |
| **TOTAL**  | **8** | **14-21 dias** | **Variada**        |

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

_Lista em construção - será refinada após análise completa dos documentos pendentes_
