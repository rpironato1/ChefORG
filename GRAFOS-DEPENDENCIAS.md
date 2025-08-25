# 🕸️ Grafos de Dependências Visuais - ChefORG

## 📊 Grafo Principal do Sistema

```mermaid
graph TB
    %% Camada de Dados
    subgraph "💾 DATA LAYER"
        DB[(🗄️ Supabase<br/>Database)]
        LS[📦 localStorage<br/>Fallback]
        COMPAT[🔧 Compatibility<br/>Layer]
    end
    
    %% Camada de API
    subgraph "🔌 API LAYER"
        AUTH_API[🔐 auth.ts]
        ORDER_API[🛒 orders.ts]
        MENU_API[🍽️ menu.ts]
        RES_API[📅 reservations.ts]
        PAY_API[💳 payments.ts]
        TABLE_API[🪑 tables.ts]
        FEED_API[⭐ feedback.ts]
        DASH_API[📊 dashboard.ts]
        NOTIF_API[📱 notifications.ts]
        STOCK_API[📦 stock.ts]
        LOYAL_API[🎁 loyalty.ts]
        REP_API[📈 reports.ts]
    end
    
    %% Camada Compartilhada
    subgraph "🔗 SHARED LAYER"
        TYPES[📋 Types]
        UTILS[🛠️ Utils]
        CONSTANTS[⚙️ Constants]
        UI_SHARED[🎨 UI Components]
    end
    
    %% Camada de Aplicação
    subgraph "🌐 APPLICATION LAYER"
        LEGACY[📱 Legacy App<br/>Port 8110]
        WEB[🖥️ Web Module<br/>Port 8110]
        MOBILE[📱 Mobile Module<br/>Port 8100]
    end
    
    %% Camada de Testes
    subgraph "🧪 TESTING LAYER"
        PLAYWRIGHT[🎭 Playwright<br/>Port 8115]
        MCP[🤖 MCP Protocol<br/>All Ports]
        COMPONENT[🧩 Component Tests]
    end
    
    %% Dependências de Dados
    DB --> COMPAT
    LS --> COMPAT
    
    %% Dependências de API
    COMPAT --> AUTH_API
    COMPAT --> ORDER_API
    COMPAT --> MENU_API
    COMPAT --> RES_API
    COMPAT --> PAY_API
    COMPAT --> TABLE_API
    COMPAT --> FEED_API
    COMPAT --> DASH_API
    COMPAT --> NOTIF_API
    COMPAT --> STOCK_API
    COMPAT --> LOYAL_API
    COMPAT --> REP_API
    
    %% Dependências Shared
    AUTH_API --> TYPES
    ORDER_API --> TYPES
    MENU_API --> TYPES
    RES_API --> TYPES
    PAY_API --> TYPES
    TABLE_API --> TYPES
    TYPES --> UTILS
    UTILS --> CONSTANTS
    
    %% Dependências de Aplicação
    LEGACY --> AUTH_API
    LEGACY --> ORDER_API
    LEGACY --> MENU_API
    LEGACY --> RES_API
    LEGACY --> PAY_API
    LEGACY --> TABLE_API
    LEGACY --> FEED_API
    LEGACY --> DASH_API
    LEGACY --> TYPES
    LEGACY --> UTILS
    LEGACY --> UI_SHARED
    
    WEB --> TYPES
    WEB --> UTILS
    WEB --> UI_SHARED
    
    MOBILE --> TYPES
    MOBILE --> UTILS
    MOBILE --> UI_SHARED
    
    %% Dependências de Testes
    PLAYWRIGHT --> LEGACY
    PLAYWRIGHT --> WEB
    MCP --> LEGACY
    MCP --> WEB
    MCP --> MOBILE
    COMPONENT --> UI_SHARED
    
    %% Estilos
    classDef dataLayer fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef apiLayer fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef sharedLayer fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef appLayer fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef testLayer fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class DB,LS,COMPAT dataLayer
    class AUTH_API,ORDER_API,MENU_API,RES_API,PAY_API,TABLE_API,FEED_API,DASH_API,NOTIF_API,STOCK_API,LOYAL_API,REP_API apiLayer
    class TYPES,UTILS,CONSTANTS,UI_SHARED sharedLayer
    class LEGACY,WEB,MOBILE appLayer
    class PLAYWRIGHT,MCP,COMPONENT testLayer
```

## 🗺️ Grafo de Rotas por Nível de Acesso

```mermaid
graph TD
    %% Nível 0 - Acesso Público
    subgraph "🌍 NÍVEL 0 - PÚBLICO"
        HOME[🏠 /]
        MENU_PUB[🍽️ /menu]
        RESERVA[📅 /reserva]
        SPRINT3[🚧 /sprint3-demo]
    end
    
    %% Nível 1 - Rotas de Cliente
    subgraph "👤 NÍVEL 1 - CLIENTE"
        CHECKIN[📱 /checkin]
        CHEGADA[🚶 /chegada-sem-reserva]
        PIN[🔢 /mesa/:id/pin]
        CARDAPIO[🍴 /mesa/:id/cardapio]
        ACOMPANHAR[👀 /mesa/:id/acompanhar]
        PAGAMENTO[💳 /mesa/:id/pagamento]
        FEEDBACK[⭐ /mesa/:id/feedback]
    end
    
    %% Nível 2 - Área Administrativa
    subgraph "🔐 NÍVEL 2 - ADMIN"
        LOGIN[🔑 /login]
        ADMIN_LOGIN[🔑 /admin/login]
        DASHBOARD[📊 /admin/dashboard]
        RECEPCAO[🏨 /admin/recepcao]
        GARCOM[👨‍🍳 /admin/garcom]
        COZINHA[🔥 /admin/cozinha]
        CAIXA[💰 /admin/caixa]
        GERENCIA[👔 /admin/gerencia]
    end
    
    %% Fluxos de Navegação
    HOME --> MENU_PUB
    HOME --> RESERVA
    RESERVA --> CHECKIN
    CHECKIN --> PIN
    CHEGADA --> PIN
    PIN --> CARDAPIO
    CARDAPIO --> ACOMPANHAR
    ACOMPANHAR --> PAGAMENTO
    PAGAMENTO --> FEEDBACK
    
    LOGIN --> DASHBOARD
    ADMIN_LOGIN --> DASHBOARD
    DASHBOARD --> RECEPCAO
    DASHBOARD --> GARCOM
    DASHBOARD --> COZINHA
    DASHBOARD --> CAIXA
    DASHBOARD --> GERENCIA
    
    %% Estilos por nível
    classDef public fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef client fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef admin fill:#fce4ec,stroke:#ad1457,stroke-width:2px
    
    class HOME,MENU_PUB,RESERVA,SPRINT3 public
    class CHECKIN,CHEGADA,PIN,CARDAPIO,ACOMPANHAR,PAGAMENTO,FEEDBACK client
    class LOGIN,ADMIN_LOGIN,DASHBOARD,RECEPCAO,GARCOM,COZINHA,CAIXA,GERENCIA admin
```

## 🔄 Grafo de Inicialização por Cenário

### 📱 Cenário 1: Desenvolvimento Web Completo

```mermaid
graph LR
    subgraph "Sequência Obrigatória"
        S1[1. Verificar Portas<br/>8100-8120] --> S2[2. npm run dev:web<br/>Port 8110]
        S2 --> S3[3. Aguardar Server Ready<br/>~2 segundos]
        S3 --> S4[4. Testar APIs<br/>curl localhost:8110]
        S4 --> S5[5. npm run test:mcp<br/>Port 8115]
    end
    
    classDef step fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    class S1,S2,S3,S4,S5 step
```

### 📲 Cenário 2: Desenvolvimento Mobile + Web

```mermaid
graph LR
    subgraph "Inicialização Paralela"
        M1[1. npm run dev:mobile<br/>Port 8100] 
        W1[1. npm run dev:web<br/>Port 8110]
        
        M1 --> M2[2. Metro Ready<br/>~5 segundos]
        W1 --> W2[2. Vite Ready<br/>~2 segundos]
        
        M2 --> M3[3. Escolher Plataforma<br/>i/a/w]
        W2 --> W3[3. APIs Disponíveis<br/>Backend Ready]
        
        M3 --> SYNC[Sincronização]
        W3 --> SYNC
    end
    
    classDef mobile fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef web fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef sync fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class M1,M2,M3 mobile
    class W1,W2,W3 web
    class SYNC sync
```

### 🧪 Cenário 3: Testes Completos (90%+ Coverage)

```mermaid
graph TB
    T1[1. Sistema Base<br/>Web + Mobile] --> T2[2. MCP Protocol Init<br/>Port 8115]
    T2 --> T3[3. WCAG Compliance<br/>17 critérios]
    T3 --> T4[4. Functional Tests<br/>56 componentes]
    T4 --> T5[5. Performance Tests<br/>Métricas]
    T5 --> T6[6. Coverage Report<br/>90%+ Target]
    
    classDef test fill:#fce4ec,stroke:#ad1457,stroke-width:2px
    class T1,T2,T3,T4,T5,T6 test
```

## ⚡ Matriz de Dependências Críticas

```mermaid
graph TD
    subgraph "🚫 BLOQUEADORES"
        PORT_CONFLICT[❌ Conflito de Portas<br/>8100-8120]
        DB_DOWN[❌ Database Offline<br/>Supabase/localStorage]
        TYPE_ERROR[❌ TypeScript Errors<br/>Shared Module]
    end
    
    subgraph "⚠️ WARNINGS"
        EXPO_MISSING[⚠️ Expo CLI Missing<br/>Mobile opcional]
        AUTH_FAIL[⚠️ Auth Failure<br/>Admin routes]
        API_SLOW[⚠️ API Latency<br/>>3s response]
    end
    
    subgraph "✅ HEALTHY"
        ALL_PORTS[✅ Portas Livres<br/>8100-8120]
        TYPE_VALID[✅ Types Válidos<br/>Shared + Main]
        API_FAST[✅ APIs < 1s<br/>Response time]
    end
    
    PORT_CONFLICT -.->|resolve_port_conflicts| ALL_PORTS
    DB_DOWN -.->|fallback localStorage| API_FAST
    TYPE_ERROR -.->|fix shared types| TYPE_VALID
    
    classDef blocker fill:#ffebee,stroke:#c62828,stroke-width:3px
    classDef warning fill:#fff8e1,stroke:#ff8f00,stroke-width:2px
    classDef healthy fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    
    class PORT_CONFLICT,DB_DOWN,TYPE_ERROR blocker
    class EXPO_MISSING,AUTH_FAIL,API_SLOW warning
    class ALL_PORTS,TYPE_VALID,API_FAST healthy
```

## 🎯 Algoritmo de Resolução Automática

```mermaid
graph TB
    START([🚀 Iniciar Sistema]) --> CHECK{🔍 Validar<br/>Dependências}
    
    CHECK -->|✅ OK| PROCEED[▶️ Prosseguir<br/>Desenvolvimento]
    CHECK -->|❌ ERRO| ANALYZE{🔎 Analisar<br/>Tipo de Erro}
    
    ANALYZE -->|Porta Ocupada| KILL_PORT[🚫 Kill Process<br/>lsof + kill -9]
    ANALYZE -->|Types Error| FIX_TYPES[🔧 Fix TypeScript<br/>shared module]
    ANALYZE -->|DB Offline| FALLBACK[📦 localStorage<br/>Fallback]
    
    KILL_PORT --> RETRY[🔄 Retry<br/>Validation]
    FIX_TYPES --> RETRY
    FALLBACK --> RETRY
    
    RETRY --> CHECK
    
    PROCEED --> MONITOR{📊 Monitor<br/>Health}
    MONITOR -->|OK| CONTINUE[✅ Continue<br/>Development]
    MONITOR -->|Issues| ANALYZE
    
    classDef start fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    classDef decision fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef action fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef error fill:#ffebee,stroke:#c62828,stroke-width:2px
    
    class START start
    class CHECK,ANALYZE,MONITOR decision
    class PROCEED,KILL_PORT,FIX_TYPES,FALLBACK,RETRY,CONTINUE action
```

## 📋 Comandos de Validação

```bash
# Validação completa do sistema
npm run validate:dependencies

# Resolução automática de conflitos
npm run validate:ports

# Help e documentação
npm run validate:help

# Execução manual do script
./validate-dependencies.sh
./validate-dependencies.sh --resolve-ports
./validate-dependencies.sh --help
```

---

*Gerado automaticamente pela análise de dependências do ChefORG*
*Versão: v1.1 - Dezembro 2024*