// Admin Screen for React Native app
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
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
  blue: {
    600: '#2563eb',
  },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

interface DashboardStats {
  totalSales: number;
  ordersToday: number;
  avgOrderValue: number;
  tablesOccupied: number;
  totalTables: number;
  activeReservations: number;
}

interface AdminScreenProps {
  navigation: any;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ navigation }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - In production, this would come from the admin API
  useEffect(() => {
    const mockStats: DashboardStats = {
      totalSales: 2847.50,
      ordersToday: 47,
      avgOrderValue: 60.50,
      tablesOccupied: 8,
      totalTables: 15,
      activeReservations: 12,
    };

    setStats(mockStats);
    setLoading(false);
  }, []);

  const StatCard = ({ title, value, subtitle, color = COLORS.primary[600] }: {
    title: string;
    value: string;
    subtitle?: string;
    color?: string;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ActionButton = ({ title, icon, onPress, color = COLORS.primary[600] }: {
    title: string;
    icon: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity 
      style={[styles.actionButton, { borderColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={[styles.actionTitle, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  if (loading || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Administrativo</Text>
        <Text style={styles.headerSubtitle}>
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo do Dia</Text>
        
        <View style={styles.statsGrid}>
          <StatCard
            title="Vendas Hoje"
            value={`R$ ${stats.totalSales.toFixed(2).replace('.', ',')}`}
            subtitle="↗️ +12% vs ontem"
            color={COLORS.green[600]}
          />
          
          <StatCard
            title="Pedidos"
            value={stats.ordersToday.toString()}
            subtitle="🎯 Meta: 50"
            color={COLORS.blue[600]}
          />
          
          <StatCard
            title="Ticket Médio"
            value={`R$ ${stats.avgOrderValue.toFixed(2).replace('.', ',')}`}
            subtitle="💰 Por pedido"
            color={COLORS.yellow[600]}
          />
          
          <StatCard
            title="Ocupação"
            value={`${stats.tablesOccupied}/${stats.totalTables}`}
            subtitle={`${Math.round((stats.tablesOccupied / stats.totalTables) * 100)}% ocupado`}
            color={COLORS.red[600]}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        
        <View style={styles.actionsGrid}>
          <ActionButton
            title="Gerenciar Mesas"
            icon="🪑"
            onPress={() => {/* Navigate to table management */}}
            color={COLORS.blue[600]}
          />
          
          <ActionButton
            title="Ver Pedidos"
            icon="📋"
            onPress={() => navigation.navigate('Orders')}
            color={COLORS.green[600]}
          />
          
          <ActionButton
            title="Reservas"
            icon="📅"
            onPress={() => navigation.navigate('Reservations')}
            color={COLORS.yellow[600]}
          />
          
          <ActionButton
            title="Cardápio"
            icon="🍽️"
            onPress={() => navigation.navigate('Menu')}
            color={COLORS.red[600]}
          />
          
          <ActionButton
            title="Equipe"
            icon="👥"
            onPress={() => navigation.navigate('Staff')}
            color={COLORS.primary[600]}
          />
          
          <ActionButton
            title="Relatórios"
            icon="📊"
            onPress={() => {/* Navigate to reports */}}
            color={COLORS.gray[700]}
          />
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atividade Recente</Text>
        
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: COLORS.green[600] }]}>
              <Text style={styles.activityIconText}>💰</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Pagamento Recebido</Text>
              <Text style={styles.activityDescription}>Mesa 5 - R$ 127,80</Text>
              <Text style={styles.activityTime}>há 2 minutos</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: COLORS.blue[600] }]}>
              <Text style={styles.activityIconText}>🛎️</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Novo Pedido</Text>
              <Text style={styles.activityDescription}>Mesa 3 - 2x Pizza Margherita</Text>
              <Text style={styles.activityTime}>há 5 minutos</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: COLORS.yellow[600] }]}>
              <Text style={styles.activityIconText}>📅</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Nova Reserva</Text>
              <Text style={styles.activityDescription}>João Silva - 4 pessoas, 20:00</Text>
              <Text style={styles.activityTime}>há 10 minutos</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: COLORS.red[600] }]}>
              <Text style={styles.activityIconText}>⚠️</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Mesa Livre</Text>
              <Text style={styles.activityDescription}>Mesa 7 disponível</Text>
              <Text style={styles.activityTime}>há 15 minutos</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Performance Indicators */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Indicadores</Text>
        
        <View style={styles.indicatorsList}>
          <View style={styles.indicator}>
            <View style={styles.indicatorHeader}>
              <Text style={styles.indicatorTitle}>Tempo Médio de Atendimento</Text>
              <Text style={[styles.indicatorValue, { color: COLORS.green[600] }]}>
                18 min
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%', backgroundColor: COLORS.green[600] }]} />
            </View>
            <Text style={styles.indicatorDescription}>Meta: 20 min</Text>
          </View>
          
          <View style={styles.indicator}>
            <View style={styles.indicatorHeader}>
              <Text style={styles.indicatorTitle}>Satisfação do Cliente</Text>
              <Text style={[styles.indicatorValue, { color: COLORS.blue[600] }]}>
                4.7/5
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '94%', backgroundColor: COLORS.blue[600] }]} />
            </View>
            <Text style={styles.indicatorDescription}>📊 Base: 23 avaliações</Text>
          </View>
          
          <View style={styles.indicator}>
            <View style={styles.indicatorHeader}>
              <Text style={styles.indicatorTitle}>Ocupação Média</Text>
              <Text style={[styles.indicatorValue, { color: COLORS.yellow[600] }]}>
                67%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '67%', backgroundColor: COLORS.yellow[600] }]} />
            </View>
            <Text style={styles.indicatorDescription}>Meta: 80%</Text>
          </View>
        </View>
      </View>

      {/* System Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sistema</Text>
        
        <View style={styles.systemActions}>
          <NativeButton
            title="🔄 Sincronizar Dados"
            onPress={() => {/* Sync data */}}
            variant="secondary"
            size="large"
          />
          
          <View style={styles.buttonSpacer} />
          
          <NativeButton
            title="⚙️ Configurações"
            onPress={() => {/* Navigate to settings */}}
            variant="secondary"
            size="large"
          />
        </View>
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: '#ffffff',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray[500],
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: SPACING.md,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.lg,
  },
  statsGrid: {
    gap: SPACING.md,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: SPACING.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statTitle: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  statSubtitle: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityList: {
    gap: SPACING.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  activityIconText: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  activityDescription: {
    fontSize: 14,
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  indicatorsList: {
    gap: SPACING.lg,
  },
  indicator: {
    padding: SPACING.md,
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
  },
  indicatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  indicatorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray[300],
    borderRadius: 4,
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  indicatorDescription: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  systemActions: {
    flexDirection: 'row',
  },
  buttonSpacer: {
    width: SPACING.md,
  },
});