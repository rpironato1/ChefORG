// Staff Screen for React Native app
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { NativeButton } from '../components/NativeButton';

const COLORS = {
  primary: {
    600: '#2563eb',
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

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'baixa';
  status: 'pendente' | 'em_andamento' | 'concluida';
  table_id?: number;
  order_id?: number;
  assigned_to?: string;
  created_at: string;
}

interface StaffMember {
  id: number;
  nome: string;
  role: 'recepcao' | 'garcom' | 'cozinheiro' | 'caixa';
  status: 'ativo' | 'inativo' | 'pausa';
  avatar?: string;
}

interface StaffScreenProps {
  navigation: any;
}

export const StaffScreen: React.FC<StaffScreenProps> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedTab, setSelectedTab] = useState<'tasks' | 'team'>('tasks');
  const [loading, setLoading] = useState(true);

  // Mock data - In production, this would come from the staff API
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Atender Mesa 5',
        description: 'Cliente solicitou atendimento',
        priority: 'alta',
        status: 'pendente',
        table_id: 5,
        created_at: '2025-08-22T20:30:00Z',
      },
      {
        id: 2,
        title: 'Preparar Pedido #47',
        description: '2x Pizza Margherita, 1x Refrigerante',
        priority: 'media',
        status: 'em_andamento',
        order_id: 47,
        assigned_to: 'Chef Carlos',
        created_at: '2025-08-22T20:25:00Z',
      },
      {
        id: 3,
        title: 'Limpar Mesa 3',
        description: 'Cliente finalizou refeição',
        priority: 'media',
        status: 'pendente',
        table_id: 3,
        created_at: '2025-08-22T20:20:00Z',
      },
      {
        id: 4,
        title: 'Processar Pagamento',
        description: 'Mesa 7 - R$ 89,50',
        priority: 'alta',
        status: 'pendente',
        table_id: 7,
        created_at: '2025-08-22T20:15:00Z',
      },
    ];

    const mockStaff: StaffMember[] = [
      {
        id: 1,
        nome: 'Ana Santos',
        role: 'recepcao',
        status: 'ativo',
      },
      {
        id: 2,
        nome: 'Carlos Silva',
        role: 'garcom',
        status: 'ativo',
      },
      {
        id: 3,
        nome: 'Maria Costa',
        role: 'cozinheiro',
        status: 'ativo',
      },
      {
        id: 4,
        nome: 'João Pereira',
        role: 'garcom',
        status: 'pausa',
      },
      {
        id: 5,
        nome: 'Paula Lima',
        role: 'caixa',
        status: 'ativo',
      },
    ];

    setTasks(mockTasks);
    setStaff(mockStaff);
    setLoading(false);
  }, []);

  const getPriorityColor = (priority: string) => {
    const colors = {
      alta: COLORS.red[600],
      media: COLORS.yellow[600],
      baixa: COLORS.green[600],
    };
    return colors[priority] || COLORS.gray[500];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: COLORS.gray[500],
      em_andamento: COLORS.orange[600],
      concluida: COLORS.green[600],
    };
    return colors[status] || COLORS.gray[500];
  };

  const getRoleDisplayName = (role: string) => {
    const roles = {
      recepcao: 'Recepção',
      garcom: 'Garçom',
      cozinheiro: 'Cozinheiro',
      caixa: 'Caixa',
    };
    return roles[role] || role;
  };

  const getStatusDisplayName = (status: string) => {
    const statuses = {
      pendente: 'Pendente',
      em_andamento: 'Em Andamento',
      concluida: 'Concluída',
      ativo: 'Ativo',
      inativo: 'Inativo',
      pausa: 'Pausa',
    };
    return statuses[status] || status;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleUpdateTaskStatus = (taskId: number, newStatus: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus as any }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setTasks(prev => prev.filter(task => task.id !== taskId));
          },
        },
      ]
    );
  };

  const handleStaffStatusChange = (staffId: number, newStatus: string) => {
    setStaff(prev =>
      prev.map(member =>
        member.id === staffId
          ? { ...member, status: newStatus as any }
          : member
      )
    );
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View style={styles.taskBadges}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.badgeText}>{item.priority.toUpperCase()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.badgeText}>{getStatusDisplayName(item.status)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.taskDescription}>{item.description}</Text>
      
      <View style={styles.taskMeta}>
        {item.table_id && (
          <Text style={styles.taskMetaText}>🪑 Mesa {item.table_id}</Text>
        )}
        {item.order_id && (
          <Text style={styles.taskMetaText}>📋 Pedido #{item.order_id}</Text>
        )}
        {item.assigned_to && (
          <Text style={styles.taskMetaText}>👤 {item.assigned_to}</Text>
        )}
        <Text style={styles.taskTime}>{formatTime(item.created_at)}</Text>
      </View>

      <View style={styles.taskActions}>
        {item.status === 'pendente' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.orange[600] }]}
            onPress={() => handleUpdateTaskStatus(item.id, 'em_andamento')}
          >
            <Text style={styles.actionButtonText}>Iniciar</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'em_andamento' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.green[600] }]}
            onPress={() => handleUpdateTaskStatus(item.id, 'concluida')}
          >
            <Text style={styles.actionButtonText}>Concluir</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.red[600] }]}
          onPress={() => handleDeleteTask(item.id)}
        >
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStaffMember = ({ item }: { item: StaffMember }) => (
    <View style={styles.staffCard}>
      <View style={styles.staffHeader}>
        <View style={styles.staffAvatar}>
          <Text style={styles.staffAvatarText}>
            {item.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.staffInfo}>
          <Text style={styles.staffName}>{item.nome}</Text>
          <Text style={styles.staffRole}>{getRoleDisplayName(item.role)}</Text>
        </View>

        <View style={[
          styles.staffStatusBadge,
          { backgroundColor: item.status === 'ativo' ? COLORS.green[600] : 
                           item.status === 'pausa' ? COLORS.yellow[600] : COLORS.red[600] }
        ]}>
          <Text style={styles.badgeText}>{getStatusDisplayName(item.status)}</Text>
        </View>
      </View>

      <View style={styles.staffActions}>
        {item.status === 'ativo' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.yellow[600] }]}
            onPress={() => handleStaffStatusChange(item.id, 'pausa')}
          >
            <Text style={styles.actionButtonText}>Pausa</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'pausa' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.green[600] }]}
            onPress={() => handleStaffStatusChange(item.id, 'ativo')}
          >
            <Text style={styles.actionButtonText}>Ativar</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'inativo' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.green[600] }]}
            onPress={() => handleStaffStatusChange(item.id, 'ativo')}
          >
            <Text style={styles.actionButtonText}>Ativar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando equipe...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'tasks' && styles.activeTab]}
          onPress={() => setSelectedTab('tasks')}
        >
          <Text style={[styles.tabText, selectedTab === 'tasks' && styles.activeTabText]}>
            Tarefas ({tasks.filter(t => t.status !== 'concluida').length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'team' && styles.activeTab]}
          onPress={() => setSelectedTab('team')}
        >
          <Text style={[styles.tabText, selectedTab === 'team' && styles.activeTabText]}>
            Equipe ({staff.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {selectedTab === 'tasks' ? (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhuma tarefa encontrada</Text>
              <Text style={styles.emptySubtext}>As tarefas aparecerão aqui quando forem criadas</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={staff}
          renderItem={renderStaffMember}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <NativeButton
          title="+ Nova Tarefa"
          onPress={() => {
            Alert.alert('Nova Tarefa', 'Funcionalidade em desenvolvimento');
          }}
          variant="primary"
          size="medium"
        />
        <View style={styles.actionSpacer} />
        <NativeButton
          title="📊 Relatórios"
          onPress={() => {
            Alert.alert('Relatórios', 'Funcionalidade em desenvolvimento');
          }}
          variant="secondary"
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
  listContainer: {
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
  taskCard: {
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    flex: 1,
    marginRight: SPACING.sm,
  },
  taskBadges: {
    gap: SPACING.xs,
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: COLORS.gray[700],
    marginBottom: SPACING.md,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  taskMetaText: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  taskTime: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginLeft: 'auto',
  },
  taskActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  staffCard: {
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
  staffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  staffAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  staffAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  staffRole: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  staffStatusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  staffActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
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