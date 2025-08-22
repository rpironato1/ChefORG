// Order Screen for React Native app
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { NativeButton } from '../components/NativeButton';

const COLORS = {
  primary: {
    600: '#2563eb',
    700: '#1d4ed8',
  },
  gray: {
    100: '#f3f4f6',
    300: '#d1d5db',
    500: '#6b7280',
    700: '#374151',
    900: '#111827',
  },
  green: {
    600: '#16a34a',
  },
  yellow: {
    600: '#ca8a04',
  },
  red: {
    600: '#dc2626',
  },
  orange: {
    600: '#ea580c',
  },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

interface OrderItem {
  id: number;
  menu_item_id: number;
  quantidade: number;
  preco_unitario: number;
  observacoes?: string;
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue';
  nome_item: string;
}

interface Order {
  id: number;
  table_id: number;
  customer_name: string;
  status: 'carrinho' | 'confirmado' | 'preparando' | 'pronto' | 'entregue' | 'pago';
  total: number;
  observacoes?: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderScreenProps {
  navigation: any;
}

export const OrderScreen: React.FC<OrderScreenProps> = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'current' | 'history'>('current');

  // Mock data - In production, this would come from the shared API layer
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 1,
        table_id: 5,
        customer_name: 'João Silva',
        status: 'preparando',
        total: 67.80,
        created_at: '2025-08-22T20:30:00Z',
        items: [
          {
            id: 1,
            menu_item_id: 1,
            quantidade: 2,
            preco_unitario: 28.90,
            status: 'preparando',
            nome_item: 'Pizza Margherita',
          },
          {
            id: 2,
            menu_item_id: 4,
            quantidade: 2,
            preco_unitario: 4.50,
            status: 'pronto',
            nome_item: 'Refrigerante Lata',
          },
          {
            id: 3,
            menu_item_id: 5,
            quantidade: 1,
            preco_unitario: 12.90,
            status: 'pendente',
            nome_item: 'Brownie com Sorvete',
          },
        ],
      },
      {
        id: 2,
        table_id: 3,
        customer_name: 'Maria Santos',
        status: 'confirmado',
        total: 57.80,
        created_at: '2025-08-22T21:00:00Z',
        items: [
          {
            id: 4,
            menu_item_id: 3,
            quantidade: 2,
            preco_unitario: 24.90,
            status: 'pendente',
            nome_item: 'Hambúrguer Artesanal',
          },
          {
            id: 5,
            menu_item_id: 4,
            quantidade: 2,
            preco_unitario: 4.50,
            status: 'pendente',
            nome_item: 'Refrigerante Lata',
          },
        ],
      },
      {
        id: 3,
        table_id: 7,
        customer_name: 'Pedro Costa',
        status: 'pago',
        total: 45.80,
        created_at: '2025-08-22T19:15:00Z',
        items: [
          {
            id: 6,
            menu_item_id: 2,
            quantidade: 1,
            preco_unitario: 32.90,
            status: 'entregue',
            nome_item: 'Pizza Pepperoni',
          },
          {
            id: 7,
            menu_item_id: 5,
            quantidade: 1,
            preco_unitario: 12.90,
            status: 'entregue',
            nome_item: 'Brownie com Sorvete',
          },
        ],
      },
    ];

    setOrders(mockOrders);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      carrinho: COLORS.gray[500],
      confirmado: COLORS.yellow[600],
      preparando: COLORS.orange[600],
      pronto: COLORS.green[600],
      entregue: COLORS.primary[600],
      pago: COLORS.gray[500],
      pendente: COLORS.gray[300],
    };
    return colors[status] || COLORS.gray[500];
  };

  const getStatusText = (status: string) => {
    const texts = {
      carrinho: 'Carrinho',
      confirmado: 'Confirmado',
      preparando: 'Preparando',
      pronto: 'Pronto',
      entregue: 'Entregue',
      pago: 'Pago',
      pendente: 'Pendente',
    };
    return texts[status] || status;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'current') {
      return ['confirmado', 'preparando', 'pronto', 'entregue'].includes(order.status);
    } else {
      return ['pago'].includes(order.status);
    }
  });

  const handleUpdateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus as any }
          : order
      )
    );
  };

  const handleUpdateItemStatus = (orderId: number, itemId: number, newStatus: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map(item =>
                item.id === itemId
                  ? { ...item, status: newStatus as any }
                  : item
              )
            }
          : order
      )
    );
  };

  const renderOrderItem = (item: OrderItem, orderId: number) => (
    <View key={item.id} style={styles.orderItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.nome_item}</Text>
        <Text style={styles.itemQuantity}>Qtd: {item.quantidade}</Text>
        <Text style={styles.itemPrice}>
          R$ {(item.preco_unitario * item.quantidade).toFixed(2).replace('.', ',')}
        </Text>
      </View>
      
      <View style={styles.itemStatusContainer}>
        <View style={[styles.itemStatusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.itemStatusText}>{getStatusText(item.status)}</Text>
        </View>
        
        {item.status === 'pendente' && (
          <TouchableOpacity
            style={styles.startCookingButton}
            onPress={() => handleUpdateItemStatus(orderId, item.id, 'preparando')}
          >
            <Text style={styles.actionButtonText}>Iniciar</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'preparando' && (
          <TouchableOpacity
            style={styles.readyButton}
            onPress={() => handleUpdateItemStatus(orderId, item.id, 'pronto')}
          >
            <Text style={styles.actionButtonText}>Pronto</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'pronto' && (
          <TouchableOpacity
            style={styles.deliverButton}
            onPress={() => handleUpdateItemStatus(orderId, item.id, 'entregue')}
          >
            <Text style={styles.actionButtonText}>Entregar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderOrder = (order: Order) => {
    const allItemsDelivered = order.items.every(item => item.status === 'entregue');
    
    return (
      <View key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderTitle}>Pedido #{order.id}</Text>
            <Text style={styles.orderInfo}>Mesa {order.table_id} • {order.customer_name}</Text>
            <Text style={styles.orderTime}>{formatTime(order.created_at)}</Text>
          </View>
          
          <View style={styles.orderStatusContainer}>
            <View style={[styles.orderStatusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.orderStatusText}>{getStatusText(order.status)}</Text>
            </View>
            <Text style={styles.orderTotal}>
              R$ {order.total.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {order.items.map(item => renderOrderItem(item, order.id))}
        </View>

        {order.observacoes && (
          <View style={styles.orderNotes}>
            <Text style={styles.notesTitle}>Observações:</Text>
            <Text style={styles.notesText}>{order.observacoes}</Text>
          </View>
        )}

        <View style={styles.orderActions}>
          {order.status === 'confirmado' && (
            <NativeButton
              title="Iniciar Preparo"
              onPress={() => handleUpdateOrderStatus(order.id, 'preparando')}
              variant="primary"
              size="medium"
            />
          )}
          
          {allItemsDelivered && order.status === 'entregue' && (
            <NativeButton
              title="Finalizar e Pagar"
              onPress={() => handleUpdateOrderStatus(order.id, 'pago')}
              variant="primary"
              size="medium"
            />
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={styles.loadingText}>Carregando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'current' && styles.activeTab]}
          onPress={() => setSelectedTab('current')}
        >
          <Text style={[styles.tabText, selectedTab === 'current' && styles.activeTabText]}>
            Pedidos Ativos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
          onPress={() => setSelectedTab('history')}
        >
          <Text style={[styles.tabText, selectedTab === 'history' && styles.activeTabText]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {selectedTab === 'current' ? 'Nenhum pedido ativo' : 'Nenhum pedido no histórico'}
            </Text>
            <Text style={styles.emptySubtext}>
              {selectedTab === 'current' 
                ? 'Os pedidos aparecerão aqui quando forem feitos' 
                : 'Os pedidos finalizados aparecerão aqui'
              }
            </Text>
          </View>
        ) : (
          filteredOrders.map(renderOrder)
        )}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <NativeButton
          title="📱 Escanear QR"
          onPress={() => navigation.navigate('QRScanner')}
          variant="secondary"
          size="medium"
        />
        <View style={styles.actionSpacer} />
        <NativeButton
          title="➕ Novo Pedido"
          onPress={() => navigation.navigate('Menu')}
          variant="primary"
          size="medium"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.gray[500],
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary[600],
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray[500],
  },
  activeTabText: {
    color: COLORS.primary[600],
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray[500],
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  orderInfo: {
    fontSize: 14,
    color: COLORS.gray[700],
    marginTop: SPACING.xs,
  },
  orderTime: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: SPACING.xs,
  },
  orderStatusContainer: {
    alignItems: 'flex-end',
  },
  orderStatusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginBottom: SPACING.xs,
  },
  orderStatusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    paddingTop: SPACING.md,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  itemQuantity: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: SPACING.xs,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[600],
    marginTop: SPACING.xs,
  },
  itemStatusContainer: {
    alignItems: 'flex-end',
  },
  itemStatusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    marginBottom: SPACING.xs,
  },
  itemStatusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  startCookingButton: {
    backgroundColor: COLORS.orange[600],
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  readyButton: {
    backgroundColor: COLORS.green[600],
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  deliverButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderNotes: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  notesText: {
    fontSize: 14,
    color: COLORS.gray[600],
  },
  orderActions: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  quickActions: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  actionSpacer: {
    width: SPACING.md,
  },
});