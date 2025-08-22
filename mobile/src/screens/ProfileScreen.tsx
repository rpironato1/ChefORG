// Profile Screen for React Native app
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
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

interface User {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  role: 'cliente' | 'recepcao' | 'garcom' | 'cozinheiro' | 'caixa' | 'gerente';
}

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [notifications, setNotifications] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);

  // Mock user data - In production, this would come from auth context
  useEffect(() => {
    const mockUser: User = {
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-9999',
      cpf: '123.456.789-00',
      role: 'cliente',
    };

    setUser(mockUser);
    setEditedUser(mockUser);
  }, []);

  const getRoleDisplayName = (role: string) => {
    const roles = {
      cliente: 'Cliente',
      recepcao: 'Recepção',
      garcom: 'Garçom',
      cozinheiro: 'Cozinheiro',
      caixa: 'Caixa',
      gerente: 'Gerente',
    };
    return roles[role] || role;
  };

  const handleSaveProfile = () => {
    if (!editedUser.nome || !editedUser.email) {
      Alert.alert('Erro', 'Nome e email são obrigatórios.');
      return;
    }

    setUser(editedUser as User);
    setIsEditing(false);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const handleCancelEdit = () => {
    setEditedUser(user || {});
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            // In production, this would call auth.signOut()
            Alert.alert('Logout', 'Você foi desconectado com sucesso.');
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Esta ação é irreversível. Tem certeza que deseja excluir sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Conta Excluída', 'Sua conta foi excluída com sucesso.');
          }
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user.nome}</Text>
        <Text style={styles.userRole}>{getRoleDisplayName(user.role)}</Text>
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancelar' : 'Editar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedUser.nome || ''}
              onChangeText={(text) => setEditedUser(prev => ({ ...prev, nome: text }))}
              placeholder="Digite seu nome completo"
            />
          ) : (
            <Text style={styles.value}>{user.nome}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedUser.email || ''}
              onChangeText={(text) => setEditedUser(prev => ({ ...prev, email: text }))}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.value}>{user.email}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Telefone</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedUser.telefone || ''}
              onChangeText={(text) => setEditedUser(prev => ({ ...prev, telefone: text }))}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{user.telefone || 'Não informado'}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>CPF</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedUser.cpf || ''}
              onChangeText={(text) => setEditedUser(prev => ({ ...prev, cpf: text }))}
              placeholder="123.456.789-00"
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.value}>{user.cpf || 'Não informado'}</Text>
          )}
        </View>

        {isEditing && (
          <View style={styles.actionButtons}>
            <NativeButton
              title="Cancelar"
              onPress={handleCancelEdit}
              variant="secondary"
              size="medium"
            />
            <View style={styles.buttonSpacer} />
            <NativeButton
              title="Salvar"
              onPress={handleSaveProfile}
              variant="primary"
              size="medium"
            />
          </View>
        )}
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notificações Push</Text>
            <Text style={styles.settingDescription}>
              Receber notificações sobre pedidos e reservas
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: COLORS.gray[300], true: COLORS.primary[600] }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Autenticação Biométrica</Text>
            <Text style={styles.settingDescription}>
              Usar impressão digital ou Face ID para entrar
            </Text>
          </View>
          <Switch
            value={biometricAuth}
            onValueChange={setBiometricAuth}
            trackColor={{ false: COLORS.gray[300], true: COLORS.primary[600] }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionLabel}>📄 Termos de Uso</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionLabel}>🔒 Política de Privacidade</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionLabel}>❓ Ajuda e Suporte</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionLabel}>⭐ Avaliar o App</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <View style={styles.dangerZone}>
          <NativeButton
            title="🚪 Sair da Conta"
            onPress={handleLogout}
            variant="secondary"
            size="large"
          />
          
          <View style={styles.buttonSpacer} />
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteButtonText}>🗑️ Excluir Conta</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>ChefORG v1.0.0</Text>
        <Text style={styles.appInfoText}>© 2025 ChefORG. Todos os direitos reservados.</Text>
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
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  userRole: {
    fontSize: 16,
    color: COLORS.gray[500],
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  editButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary[600],
  },
  editButtonText: {
    color: COLORS.primary[600],
    fontWeight: '600',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 16,
    color: COLORS.gray[900],
  },
  value: {
    fontSize: 16,
    color: COLORS.gray[900],
    paddingVertical: SPACING.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  buttonSpacer: {
    width: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  actionLabel: {
    fontSize: 16,
    color: COLORS.gray[900],
  },
  actionArrow: {
    fontSize: 18,
    color: COLORS.gray[500],
  },
  dangerZone: {
    alignItems: 'center',
  },
  deleteButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.red[600],
  },
  deleteButtonText: {
    color: COLORS.red[600],
    fontWeight: '600',
    fontSize: 16,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  appInfoText: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginBottom: SPACING.xs,
  },
});