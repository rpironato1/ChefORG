# ChefORG - Dados de Acesso para Desenvolvimento

## 📋 Informações Gerais

Este documento contém todos os dados de acesso necessários para realizar testes e automação no sistema ChefORG durante o desenvolvimento.

**Ambiente:** Desenvolvimento (localStorage)  
**Sistema de Autenticação:** localStorage com dados de teste  
**Senha Padrão:** `123456` (para todos os usuários)

---

## 👥 Contas de Acesso

### 🔐 Administrador/Gerente
- **Email:** `admin@cheforg.com`
- **Senha:** `123456`
- **Cargo:** Gerente
- **Nome:** Admin Sistema
- **Permissões:** Acesso completo ao sistema

### 📞 Recepção
- **Email:** `recepcao@cheforg.com`
- **Senha:** `123456`
- **Cargo:** Recepção
- **Nome:** João Recepcionista
- **Permissões:** Gestão de reservas e atendimento

### 🍽️ Garçom
- **Email:** `garcom@cheforg.com`
- **Senha:** `123456`
- **Cargo:** Garçom
- **Nome:** Maria Garçom
- **Permissões:** Gestão de mesas e pedidos

### 👨‍🍳 Cozinha
- **Email:** `cozinha@cheforg.com`
- **Senha:** `123456`
- **Cargo:** Cozinheiro
- **Nome:** Pedro Cozinheiro
- **Permissões:** Painel de preparo e gestão de pedidos

### 💰 Caixa
- **Email:** `caixa@cheforg.com`
- **Senha:** `123456`
- **Cargo:** Caixa
- **Nome:** Ana Caixa
- **Permissões:** Processamento de pagamentos

### 👤 Cliente
- **Email:** `cliente@test.com`
- **Senha:** `123456`
- **Cargo:** Cliente
- **Nome:** Cliente Teste
- **Permissões:** Acesso limitado a funcionalidades do cliente

---

## 🚪 URLs de Acesso

### Páginas Públicas
- **Home:** `http://localhost:8110/`
- **Menu Público:** `http://localhost:8110/menu`
- **Reserva Online:** `http://localhost:8110/reserva`

### Área Administrativa
- **Login Admin:** `http://localhost:8110/admin/login`
- **Dashboard:** `http://localhost:8110/admin/dashboard`
- **Painel Recepção:** `http://localhost:8110/admin/recepcao`
- **Painel Garçom:** `http://localhost:8110/admin/garcom`
- **Painel Cozinha:** `http://localhost:8110/admin/cozinha`
- **Painel Caixa:** `http://localhost:8110/admin/caixa`
- **Painel Gerência:** `http://localhost:8110/admin/gerencia`

### Páginas do Cliente
- **Check-in QR:** `http://localhost:8110/checkin`
- **Pin da Mesa:** `http://localhost:8110/mesa/{numero}/pin`
- **Cardápio da Mesa:** `http://localhost:8110/mesa/{numero}/cardapio`
- **Acompanhar Pedido:** `http://localhost:8110/mesa/{numero}/acompanhar`
- **Pagamento:** `http://localhost:8110/mesa/{numero}/pagamento`
- **Feedback:** `http://localhost:8110/mesa/{numero}/feedback`

---

## 🔧 Configuração de Desenvolvimento

### Iniciando o Sistema
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar em: http://localhost:8110
```

### Dados de Teste
- **Inicialização:** Automática ao carregar a aplicação
- **Armazenamento:** localStorage do navegador
- **Reset:** Limpar localStorage ou recarregar a página

### Mesas de Teste Disponíveis
- **Mesa 1:** PIN `1234` (Livre)
- **Mesa 2:** PIN `2345` (Ocupada)
- **Mesa 3:** PIN `3456` (Reservada)
- **Mesa 4:** PIN `4567` (Limpeza)
- **Mesa 5:** PIN `5678` (Aguardando)

---

## 🧪 Cenários de Teste

### Fluxo de Autenticação
1. Acessar `http://localhost:8110/admin/login`
2. Inserir credenciais de qualquer usuário acima
3. Verificar redirecionamento baseado no cargo
4. Testar navegação entre painéis (conforme permissões)

### Fluxo do Cliente
1. Acessar uma mesa via QR ou URL direta
2. Inserir PIN da mesa
3. Navegar pelo cardápio
4. Realizar pedido
5. Acompanhar status
6. Finalizar com pagamento e feedback

### Fluxo de Reserva
1. Acessar `http://localhost:8110/reserva`
2. Preencher formulário de reserva
3. Confirmar reserva
4. Check-in via QR code

---

## 🔒 Segurança e Permissões

### Sistema de Roles
- **gerente:** Acesso total
- **recepcao:** Reservas e atendimento
- **garcom:** Mesas e pedidos
- **cozinheiro:** Preparo e cozinha
- **caixa:** Pagamentos
- **cliente:** Funcionalidades limitadas

### Proteção de Rotas
- Todas as rotas `/admin/*` requerem autenticação
- Verificação de cargo para acessos específicos
- Redirecionamento automático para login se não autenticado
- Página de "Acesso Negado" para permissões insuficientes

---

## 📱 Testes Automatizados

### Lighthouse Testing
```bash
# Executar testes completos
npm run test:lighthouse

# Testes detalhados
npm run test:lighthouse:detailed

# Extração de issues
npm run test:lighthouse:extract
```

### Validação Manual
- Testar responsividade em diferentes dispositivos
- Verificar acessibilidade com leitores de tela
- Validar fluxos completos de usuário
- Confirmar performance em conexões lentas

---

## 🔄 Automatização

### Reset de Dados
```javascript
// No console do navegador
localStorage.clear();
location.reload();
```

### Verificação de Estado
```javascript
// Ver dados atuais
console.log(JSON.parse(localStorage.getItem('cheforg_users')));
console.log(JSON.parse(localStorage.getItem('cheforg_tables')));
```

---

## 📞 Contatos e Suporte

**Sistema:** ChefORG - Restaurant Management System  
**Versão:** Desenvolvimento  
**Última Atualização:** $(date)

**Observações:**
- Dados são resetados a cada inicialização
- Senhas são simuladas (não há hash real)
- Sistema otimizado para desenvolvimento e testes
- Transição para Supabase planejada para produção

---

*Este documento deve ser mantido atualizado conforme alterações no sistema de autenticação e dados de teste.*