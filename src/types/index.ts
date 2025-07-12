// Tipos para o sistema completo de restaurante

// ===== ENTIDADES PRINCIPAIS =====
export interface MenuItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  disponivel: boolean;
  tempoPreparacao: number;
  ingredientes: string[];
  imagem?: string;
  restricoes?: string[];
}

export interface Mesa {
  id: string;
  numero: number;
  capacidade: number;
  status: 'livre' | 'ocupada' | 'reservada' | 'limpeza' | 'aguardando';
  qrCode: string;
  pin?: string;
  garcom?: string;
  pedidoAtual?: string;
  clienteAtual?: string;
}

export interface Reserva {
  id: string;
  clienteNome: string;
  clienteCpf: string;
  clienteTelefone: string;
  dataHora: Date;
  numeroConvidados: number;
  restricoes?: string;
  status: 'confirmada' | 'cancelada' | 'realizada' | 'aguardando' | 'em_atendimento';
  mesaId?: string;
  posicaoFila?: number;
}

export interface Pedido {
  id: string;
  mesaId: string;
  itens: PedidoItem[];
  status: 'carrinho' | 'confirmado' | 'preparando' | 'pronto' | 'entregue' | 'pago';
  garcom?: string;
  dataHora: Date;
  total: number;
  observacoes?: string;
  tempoEstimado?: number;
}

export interface PedidoItem {
  id: string;
  menuItemId: string;
  quantidade: number;
  preco: number;
  observacoes?: string;
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue';
}

export interface Cliente {
  id: string;
  nome: string;
  cpf?: string;
  telefone: string;
  email?: string;
  mesaAtual?: string;
  historicoPedidos: string[];
}

export interface Funcionario {
  id: string;
  nome: string;
  cargo: 'recepcao' | 'garcom' | 'cozinheiro' | 'caixa' | 'gerente';
  email: string;
  telefone: string;
  status: 'ativo' | 'inativo';
  dataAdmissao: Date;
  salario?: number;
}

export interface Pagamento {
  id: string;
  pedidoId: string;
  valor: number;
  metodo: 'pix' | 'apple_pay' | 'google_pay' | 'samsung_pay' | 'dinheiro' | 'cartao';
  status: 'pendente' | 'processando' | 'confirmado' | 'cancelado';
  dataHora: Date;
  codigoPagamento?: string;
}

export interface Feedback {
  id: string;
  mesaId: string;
  pedidoId: string;
  estrelas: number;
  comentario?: string;
  dataHora: Date;
}

// ===== TIPOS DE ESTADO =====
export interface FilaEspera {
  id: string;
  clienteNome: string;
  numeroConvidados: number;
  dataHoraChegada: Date;
  posicao: number;
  tempoEstimado: number;
  status: 'aguardando' | 'chamado' | 'atendido';
}

export interface CarrinhoItem {
  menuItemId: string;
  quantidade: number;
  observacoes?: string;
}

export interface EstadoMesa {
  mesaId: string;
  clienteAtivo?: Cliente;
  pedidoAtivo?: Pedido;
  carrinho: CarrinhoItem[];
  statusPagamento: 'pendente' | 'processando' | 'pago';
}

// ===== TIPOS DE INTERFACE =====
export interface ToastMessage {
  id: string;
  tipo: 'sucesso' | 'erro' | 'aviso' | 'info';
  titulo: string;
  mensagem: string;
  duracao?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  children: React.ReactNode;
}

export interface FiltrosCardapio {
  categoria?: string;
  busca?: string;
  disponivel?: boolean;
  restricoes?: string[];
}

// ===== TIPOS DE PAINEL =====
export interface DashboardRecepcao {
  filaEspera: FilaEspera[];
  reservasHoje: Reserva[];
  mesasStatus: { [key: string]: Mesa };
  tempoMedioEspera: number;
}

export interface DashboardGarcom {
  mesasAbertas: Mesa[];
  pedidosPendentes: Pedido[];
  pedidosProntos: Pedido[];
  mesasParaLimpar: Mesa[];
}

export interface DashboardCozinha {
  pedidosPorCategoria: { [categoria: string]: PedidoItem[] };
  filaPedidos: Pedido[];
  tempoMedioPreparo: { [categoria: string]: number };
}

export interface DashboardCaixa {
  mesasComConta: Mesa[];
  pagamentosPendentes: Pagamento[];
  totalDia: number;
}

export interface DashboardGerente {
  vendasDia: number;
  pedidosTotal: number;
  mesasOcupadas: number;
  ticketMedio: number;
  funcionariosAtivos: number;
  reservasHoje: number;
} 