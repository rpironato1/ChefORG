# ChefORG - Sistema de Gestão para Restaurantes

Sistema completo de gestão para bares e restaurantes desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

### Dashboard

- Visão geral das vendas e métricas em tempo real
- Gráficos de vendas por período
- Status das mesas em tempo real
- Pedidos recentes e atividades

### Gestão de Mesas

- Visualização em grade e lista
- Status de ocupação (livre, ocupada, reservada, limpeza)
- Controle de garçons responsáveis
- Tempo de ocupação e valor das contas

### Cardápio

- Gestão completa dos itens do menu
- Categorização por tipo (entradas, pratos principais, bebidas, etc.)
- Controle de disponibilidade
- Informações nutricionais e ingredientes
- Tempo de preparação

### Pedidos

- Acompanhamento em tempo real
- Status por item (pendente, preparando, pronto, entregue)
- Filtros por status e mesa
- Histórico completo de pedidos

### Funcionários

- Cadastro completo da equipe
- Gestão de cargos e permissões
- Controle de status (ativo/inativo)
- Informações de contato e salário

### Reservas

- Sistema de reservas com calendário
- Gestão de clientes e contatos
- Status de confirmação
- Observações especiais

### Relatórios

- Análise de vendas por período
- Performance por funcionário
- Produtos mais vendidos
- Horários de pico
- Insights e recomendações

### Configurações

- Informações do restaurante
- Configurações de notificação
- Parâmetros do sistema
- Configurações de impressão
- Segurança e backup

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca para interface de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool moderna e rápida
- **React Router** - Roteamento da aplicação
- **Lucide React** - Biblioteca de ícones
- **Recharts** - Biblioteca para gráficos
- **Date-fns** - Manipulação de datas

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🚀 Instalação e Execução

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd ChefORG
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:

```bash
npm run dev
```

4. Acesse a aplicação em `http://localhost:8110`

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   └── layout/          # Componentes de layout
│       ├── Layout.tsx   # Layout principal
│       ├── Sidebar.tsx  # Menu lateral
│       └── Header.tsx   # Cabeçalho
├── pages/               # Páginas da aplicação
│   ├── Dashboard.tsx    # Página inicial
│   ├── Mesas.tsx       # Gestão de mesas
│   ├── Cardapio.tsx    # Gestão do cardápio
│   ├── Pedidos.tsx     # Gestão de pedidos
│   ├── Funcionarios.tsx # Gestão de funcionários
│   ├── Reservas.tsx    # Gestão de reservas
│   ├── Relatorios.tsx  # Relatórios e análises
│   └── Configuracoes.tsx # Configurações
├── types/               # Definições de tipos TypeScript
│   └── index.ts        # Tipos principais
├── App.tsx             # Componente raiz
├── main.tsx            # Ponto de entrada
└── index.css           # Estilos globais
```

## 🎨 Design System

O sistema utiliza um design consistente baseado em:

- **Cores primárias**: Tons de laranja (#f97316)
- **Tipografia**: Inter (Google Fonts)
- **Componentes**: Cards, botões, formulários padronizados
- **Layout responsivo**: Mobile-first com Tailwind CSS

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🚧 Próximos Passos

### 2. Implementação da Lógica de Negócio

- [ ] Context API para estado global
- [ ] Hooks customizados para lógica reutilizável
- [ ] Validações de formulário
- [ ] Manipulação de estado complexo

### 3. Banco de Dados

- [ ] Modelagem do banco de dados
- [ ] Implementação com Supabase
- [ ] Migrations e seeds
- [ ] Relacionamentos entre entidades

### 4. APIs e Integrações

- [ ] APIs RESTful para CRUD
- [ ] Autenticação e autorização
- [ ] WebSockets para atualizações em tempo real
- [ ] Integração com sistemas de pagamento

### 5. Testes

- [ ] Testes unitários com Jest
- [ ] Testes de integração
- [ ] Testes end-to-end com Cypress
- [ ] Cobertura de código

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas, entre em contato através de:

- Email: suporte@cheforg.com
- GitHub Issues: [Criar issue](link-para-issues)

---

Desenvolvido com ❤️ para transformar a gestão de restaurantes
