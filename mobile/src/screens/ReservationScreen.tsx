// Reservation Screen for React Native app
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
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
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

interface Reservation {
  id: number;
  cliente_nome: string;
  cliente_telefone: string;
  cliente_cpf: string;
  data_reserva: string;
  horario: string;
  pessoas: number;
  status: 'pendente' | 'confirmada' | 'em_andamento' | 'finalizada' | 'cancelada';
  observacoes?: string;
}

interface ReservationScreenProps {
  navigation: any;
}

export const ReservationScreen: React.FC<ReservationScreenProps> = ({ navigation }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newReservation, setNewReservation] = useState({
    cliente_nome: '',
    cliente_telefone: '',
    cliente_cpf: '',
    data_reserva: '',
    horario: '',
    pessoas: '',
    observacoes: '',
  });

  // Mock data - In production, this would come from the shared API layer
  useEffect(() => {
    const mockReservations: Reservation[] = [
      {
        id: 1,
        cliente_nome: 'João Silva',
        cliente_telefone: '(11) 99999-9999',
        cliente_cpf: '123.456.789-00',
        data_reserva: '2025-08-23',
        horario: '20:00',
        pessoas: 4,
        status: 'confirmada',
        observacoes: 'Mesa próxima à janela',
      },
      {
        id: 2,
        cliente_nome: 'Maria Santos',
        cliente_telefone: '(11) 88888-8888',
        cliente_cpf: '987.654.321-00',
        data_reserva: '2025-08-24',
        horario: '19:30',
        pessoas: 2,
        status: 'pendente',
      },
      {
        id: 3,
        cliente_nome: 'Pedro Costa',
        cliente_telefone: '(11) 77777-7777',
        cliente_cpf: '456.789.123-00',
        data_reserva: '2025-08-22',
        horario: '18:00',
        pessoas: 6,
        status: 'finalizada',
      },
    ];

    setReservations(mockReservations);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: COLORS.yellow[600],
      confirmada: COLORS.green[600],
      em_andamento: COLORS.primary[600],
      finalizada: COLORS.gray[500],
      cancelada: COLORS.red[600],
    };
    return colors[status] || COLORS.gray[500];
  };

  const getStatusText = (status: string) => {
    const texts = {
      pendente: 'Pendente',
      confirmada: 'Confirmada',
      em_andamento: 'Em Andamento',
      finalizada: 'Finalizada',
      cancelada: 'Cancelada',
    };
    return texts[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleCreateReservation = () => {
    // Validate form
    if (!newReservation.cliente_nome || !newReservation.cliente_telefone || 
        !newReservation.data_reserva || !newReservation.horario || !newReservation.pessoas) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Create new reservation
    const reservation: Reservation = {
      id: reservations.length + 1,
      cliente_nome: newReservation.cliente_nome,
      cliente_telefone: newReservation.cliente_telefone,
      cliente_cpf: newReservation.cliente_cpf,
      data_reserva: newReservation.data_reserva,
      horario: newReservation.horario,
      pessoas: parseInt(newReservation.pessoas),
      status: 'pendente',
      observacoes: newReservation.observacoes,
    };

    setReservations(prev => [reservation, ...prev]);
    setShowForm(false);
    setNewReservation({
      cliente_nome: '',
      cliente_telefone: '',
      cliente_cpf: '',
      data_reserva: '',
      horario: '',
      pessoas: '',
      observacoes: '',
    });

    Alert.alert('Sucesso', 'Reserva criada com sucesso!');
  };

  const handleStatusChange = (reservationId: number, newStatus: string) => {
    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, status: newStatus as any }
          : reservation
      )
    );
  };

  const renderReservation = (reservation: Reservation) => (
    <View key={reservation.id} style={styles.reservationCard}>
      <View style={styles.reservationHeader}>
        <Text style={styles.clientName}>{reservation.cliente_nome}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.status) }]}>
          <Text style={styles.statusText}>{getStatusText(reservation.status)}</Text>
        </View>
      </View>

      <View style={styles.reservationDetails}>
        <Text style={styles.detailText}>📞 {reservation.cliente_telefone}</Text>
        <Text style={styles.detailText}>📅 {formatDate(reservation.data_reserva)} às {reservation.horario}</Text>
        <Text style={styles.detailText}>👥 {reservation.pessoas} pessoas</Text>
        {reservation.observacoes && (
          <Text style={styles.detailText}>📝 {reservation.observacoes}</Text>
        )}
      </View>

      {reservation.status === 'pendente' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleStatusChange(reservation.id, 'confirmada')}
          >
            <Text style={styles.actionButtonText}>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleStatusChange(reservation.id, 'cancelada')}
          >
            <Text style={styles.actionButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {reservation.status === 'confirmada' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.startButton]}
            onPress={() => handleStatusChange(reservation.id, 'em_andamento')}
          >
            <Text style={styles.actionButtonText}>Iniciar Atendimento</Text>
          </TouchableOpacity>
        </View>
      )}

      {reservation.status === 'em_andamento' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.finishButton]}
            onPress={() => handleStatusChange(reservation.id, 'finalizada')}
          >
            <Text style={styles.actionButtonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={styles.loadingText}>Carregando reservas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Add Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Reservas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.addButtonText}>+ Nova Reserva</Text>
        </TouchableOpacity>
      </View>

      {/* Reservations List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {reservations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhuma reserva encontrada</Text>
            <Text style={styles.emptySubtext}>Crie sua primeira reserva!</Text>
          </View>
        ) : (
          reservations.map(renderReservation)
        )}
      </ScrollView>

      {/* New Reservation Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nova Reserva</Text>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome *</Text>
              <TextInput
                style={styles.textInput}
                value={newReservation.cliente_nome}
                onChangeText={(text) => setNewReservation(prev => ({ ...prev, cliente_nome: text }))}
                placeholder="Digite o nome completo"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone *</Text>
              <TextInput
                style={styles.textInput}
                value={newReservation.cliente_telefone}
                onChangeText={(text) => setNewReservation(prev => ({ ...prev, cliente_telefone: text }))}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CPF</Text>
              <TextInput
                style={styles.textInput}
                value={newReservation.cliente_cpf}
                onChangeText={(text) => setNewReservation(prev => ({ ...prev, cliente_cpf: text }))}
                placeholder="123.456.789-00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Data *</Text>
              <TextInput
                style={styles.textInput}
                value={newReservation.data_reserva}
                onChangeText={(text) => setNewReservation(prev => ({ ...prev, data_reserva: text }))}
                placeholder="AAAA-MM-DD"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Horário *</Text>
              <TextInput
                style={styles.textInput}
                value={newReservation.horario}
                onChangeText={(text) => setNewReservation(prev => ({ ...prev, horario: text }))}
                placeholder="19:30"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número de Pessoas *</Text>
              <TextInput
                style={styles.textInput}
                value={newReservation.pessoas}
                onChangeText={(text) => setNewReservation(prev => ({ ...prev, pessoas: text }))}
                placeholder="4"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Observações</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newReservation.observacoes}
                onChangeText={(text) => setNewReservation(prev => ({ ...prev, observacoes: text }))}
                placeholder="Preferências especiais..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formButtons}>
              <NativeButton
                title="Cancelar"
                onPress={() => setShowForm(false)}
                variant="secondary"
                size="large"
              />
              <View style={styles.buttonSpacer} />
              <NativeButton
                title="Criar Reserva"
                onPress={handleCreateReservation}
                variant="primary"
                size="large"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  addButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
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
  },
  reservationCard: {
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
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  reservationDetails: {
    marginBottom: SPACING.md,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: COLORS.green[600],
  },
  cancelButton: {
    backgroundColor: COLORS.red[600],
  },
  startButton: {
    backgroundColor: COLORS.primary[600],
  },
  finishButton: {
    backgroundColor: COLORS.gray[500],
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.gray[500],
  },
  formContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: SPACING.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 16,
    color: COLORS.gray[900],
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  buttonSpacer: {
    width: SPACING.md,
  },
});