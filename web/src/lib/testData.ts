// Test data for ChefORG localStorage implementation
import { localStorageClient } from './localStorage';

// Test users data
const testUsers = [
  {
    id: 1,
    nome: 'Admin Sistema',
    telefone: '(11) 99999-9999',
    cpf: '000.000.000-00',
    email: 'admin@cheforg.com',
    role: 'gerente' as const,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    nome: 'João Recepcionista',
    telefone: '(11) 88888-8888',
    cpf: '111.111.111-11',
    email: 'recepcao@cheforg.com',
    role: 'recepcao' as const,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    nome: 'Maria Garçom',
    telefone: '(11) 77777-7777',
    cpf: '222.222.222-22',
    email: 'garcom@cheforg.com',
    role: 'garcom' as const,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    nome: 'Pedro Cozinheiro',
    telefone: '(11) 66666-6666',
    cpf: '333.333.333-33',
    email: 'cozinha@cheforg.com',
    role: 'cozinheiro' as const,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    nome: 'Ana Caixa',
    telefone: '(11) 55555-5555',
    cpf: '444.444.444-44',
    email: 'caixa@cheforg.com',
    role: 'caixa' as const,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    nome: 'Cliente Teste',
    telefone: '(11) 44444-4444',
    cpf: '555.555.555-55',
    email: 'cliente@test.com',
    role: 'cliente' as const,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Test tables data
const testTables = [
  {
    id: 1,
    numero: 1,
    lugares: 2,
    status: 'livre' as const,
    pin: '1234',
    qr_code: 'QR_MESA_001',
    garcom_id: 3,
    cliente_atual: null,
    pedido_atual_id: null,
    observacoes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    numero: 2,
    lugares: 4,
    status: 'ocupada' as const,
    pin: '2345',
    qr_code: 'QR_MESA_002',
    garcom_id: 3,
    cliente_atual: 'Cliente Teste',
    pedido_atual_id: 1,
    observacoes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    numero: 3,
    lugares: 6,
    status: 'reservada' as const,
    pin: '3456',
    qr_code: 'QR_MESA_003',
    garcom_id: 3,
    cliente_atual: null,
    pedido_atual_id: null,
    observacoes: 'Reserva para 19h',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    numero: 4,
    lugares: 8,
    status: 'limpeza' as const,
    pin: '4567',
    qr_code: 'QR_MESA_004',
    garcom_id: null,
    cliente_atual: null,
    pedido_atual_id: null,
    observacoes: 'Aguardando limpeza',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    numero: 5,
    lugares: 2,
    status: 'aguardando' as const,
    pin: '5678',
    qr_code: 'QR_MESA_005',
    garcom_id: 3,
    cliente_atual: null,
    pedido_atual_id: null,
    observacoes: 'Fila de espera',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Test menu items data
const testMenuItems = [
  {
    id: 1,
    nome: 'Hambúrguer Artesanal',
    descricao: 'Hambúrguer 180g com queijo, alface, tomate e molho especial',
    preco: 25.90,
    categoria: 'Hambúrgueres',
    disponivel: true,
    tempo_preparo: 15,
    ingredientes: ['carne', 'queijo', 'alface', 'tomate', 'pão'],
    imagem: '/images/hamburguer.jpg',
    restricoes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    nome: 'Pizza Margherita',
    descricao: 'Pizza tradicional com molho de tomate, mussarela e manjericão',
    preco: 32.50,
    categoria: 'Pizzas',
    disponivel: true,
    tempo_preparo: 20,
    ingredientes: ['massa', 'molho tomate', 'mussarela', 'manjericão'],
    imagem: '/images/pizza-margherita.jpg',
    restricoes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    nome: 'Salada Caesar',
    descricao: 'Alface romana, croutons, parmesão e molho caesar',
    preco: 18.90,
    categoria: 'Saladas',
    disponivel: true,
    tempo_preparo: 10,
    ingredientes: ['alface romana', 'croutons', 'parmesão', 'molho caesar'],
    imagem: '/images/salada-caesar.jpg',
    restricoes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    nome: 'Suco de Laranja',
    descricao: 'Suco natural de laranja 300ml',
    preco: 8.50,
    categoria: 'Bebidas',
    disponivel: true,
    tempo_preparo: 5,
    ingredientes: ['laranja'],
    imagem: '/images/suco-laranja.jpg',
    restricoes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    nome: 'Brownie com Sorvete',
    descricao: 'Brownie de chocolate quente com sorvete de baunilha',
    preco: 15.90,
    categoria: 'Sobremesas',
    disponivel: true,
    tempo_preparo: 8,
    ingredientes: ['brownie', 'sorvete baunilha', 'chocolate'],
    imagem: '/images/brownie.jpg',
    restricoes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Test orders data
const testOrders = [
  {
    id: 1,
    table_id: 2,
    customer_name: 'Cliente Teste',
    status: 'preparando' as const,
    total: 44.40,
    observacoes: 'Sem cebola no hambúrguer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Test order items data
const testOrderItems = [
  {
    id: 1,
    order_id: 1,
    menu_item_id: 1,
    quantidade: 1,
    preco_unitario: 25.90,
    observacoes: 'Sem cebola',
    status: 'preparando' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    order_id: 1,
    menu_item_id: 4,
    quantidade: 2,
    preco_unitario: 8.50,
    observacoes: null,
    status: 'pronto' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Test reservations data
const testReservations = [
  {
    id: 1,
    cliente_nome: 'João Silva',
    cliente_cpf: '123.456.789-00',
    cliente_telefone: '(11) 99999-0000',
    data_hora: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    numero_convidados: 4,
    restricoes: 'Mesa próxima à janela',
    status: 'confirmada' as const,
    mesa_id: 3,
    posicao_fila: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    cliente_nome: 'Maria Santos',
    cliente_cpf: '987.654.321-00',
    cliente_telefone: '(11) 88888-0000',
    data_hora: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    numero_convidados: 2,
    restricoes: null,
    status: 'confirmada' as const,
    mesa_id: null,
    posicao_fila: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Test payments data
const testPayments = [
  {
    id: 1,
    order_id: 1,
    valor: 44.40,
    metodo: 'pix' as const,
    status: 'confirmado' as const,
    codigo_pagamento: 'PIX_12345',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Test feedback data
const testFeedback = [
  {
    id: 1,
    mesa_id: 2,
    order_id: 1,
    estrelas: 5,
    comentario: 'Excelente atendimento e comida deliciosa!',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Test menu categories data
const testMenuCategories = [
  {
    id: 1,
    nome: 'Hambúrgueres',
    descricao: 'Hambúrgueres artesanais',
    ordem: 1,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    nome: 'Pizzas',
    descricao: 'Pizzas tradicionais',
    ordem: 2,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    nome: 'Saladas',
    descricao: 'Saladas frescas',
    ordem: 3,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    nome: 'Bebidas',
    descricao: 'Bebidas variadas',
    ordem: 4,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    nome: 'Sobremesas',
    descricao: 'Sobremesas deliciosas',
    ordem: 5,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Test loyalty data
const testLoyalty = [
  {
    id: 1,
    user_id: 6,
    pontos: 150,
    nivel: 'Bronze',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Function to initialize test data
export const initializeTestData = async () => {
  console.log('Initializing ChefORG test data...');
  
  try {
    // Clear existing data
    localStorage.clear();
    
    // Insert test data
    await localStorageClient.from('users').insert(testUsers);
    await localStorageClient.from('tables').insert(testTables);
    
    // Note: menu_items, orders, etc. might need to be added to the Database type
    // For now, we'll store them directly in localStorage
    localStorage.setItem('cheforg_menu_items', JSON.stringify(testMenuItems));
    localStorage.setItem('cheforg_menu_categories', JSON.stringify(testMenuCategories));
    localStorage.setItem('cheforg_orders', JSON.stringify(testOrders));
    localStorage.setItem('cheforg_order_items', JSON.stringify(testOrderItems));
    localStorage.setItem('cheforg_reservations', JSON.stringify(testReservations));
    localStorage.setItem('cheforg_payments', JSON.stringify(testPayments));
    localStorage.setItem('cheforg_feedback', JSON.stringify(testFeedback));
    localStorage.setItem('cheforg_loyalty', JSON.stringify(testLoyalty));
    
    console.log('Test data initialized successfully!');
    console.log('Available test accounts:');
    console.log('- Admin: admin@cheforg.com');
    console.log('- Recepção: recepcao@cheforg.com');
    console.log('- Garçom: garcom@cheforg.com');
    console.log('- Cozinha: cozinha@cheforg.com');
    console.log('- Caixa: caixa@cheforg.com');
    console.log('- Cliente: cliente@test.com');
    
    return true;
  } catch (error) {
    console.error('Error initializing test data:', error);
    return false;
  }
};

// Function to reset data to initial state
export const resetTestData = () => {
  return initializeTestData();
};

// Function to get current data state for debugging
export const getDataState = () => {
  return {
    users: JSON.parse(localStorage.getItem('cheforg_users') || '[]'),
    tables: JSON.parse(localStorage.getItem('cheforg_tables') || '[]'),
    menuItems: JSON.parse(localStorage.getItem('cheforg_menu_items') || '[]'),
    menuCategories: JSON.parse(localStorage.getItem('cheforg_menu_categories') || '[]'),
    orders: JSON.parse(localStorage.getItem('cheforg_orders') || '[]'),
    orderItems: JSON.parse(localStorage.getItem('cheforg_order_items') || '[]'),
    reservations: JSON.parse(localStorage.getItem('cheforg_reservations') || '[]'),
    payments: JSON.parse(localStorage.getItem('cheforg_payments') || '[]'),
    feedback: JSON.parse(localStorage.getItem('cheforg_feedback') || '[]'),
    loyalty: JSON.parse(localStorage.getItem('cheforg_loyalty') || '[]')
  };
};

export { 
  testUsers, 
  testTables, 
  testMenuItems, 
  testMenuCategories,
  testOrders, 
  testOrderItems, 
  testReservations, 
  testPayments, 
  testFeedback,
  testLoyalty
};