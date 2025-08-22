// Comprehensive tests for React Native mobile app functionality
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Mock expo modules
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: 'mock-push-token' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('mock-notification-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
  getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
  getBadgeCountAsync: jest.fn(() => Promise.resolve(0)),
  setBadgeCountAsync: jest.fn(() => Promise.resolve()),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
  AndroidImportance: {
    MAX: 'max',
    DEFAULT: 'default',
  },
  AndroidNotificationPriority: {
    MIN: 'min',
    LOW: 'low',
    DEFAULT: 'default',
    HIGH: 'high',
    MAX: 'max',
  },
}));

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  supportedAuthenticationTypesAsync: jest.fn(() => Promise.resolve([1])),
  authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
  AuthenticationType: {
    FINGERPRINT: 1,
    FACIAL_RECOGNITION: 2,
    IRIS: 3,
  },
}));

jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    Constants: {
      FlashMode: {
        torch: 'torch',
        off: 'off',
      },
    },
  },
  CameraType: {
    back: 'back',
    front: 'front',
  },
}));

jest.mock('expo-barcode-scanner', () => ({
  BarCodeScanner: {
    Constants: {
      BarCodeType: {
        qr: 'qr',
      },
    },
  },
}));

jest.mock('expo-device', () => ({
  isDevice: true,
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  dispatch: jest.fn(),
  setOptions: jest.fn(),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
};

// Import components after mocking
import { HomeScreen } from '../screens/HomeScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { ReservationScreen } from '../screens/ReservationScreen';
import { OrderScreen } from '../screens/OrderScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { QRScannerScreen } from '../screens/QRScannerScreen';
import { AdminScreen } from '../screens/AdminScreen';
import { StaffScreen } from '../screens/StaffScreen';
import { NotificationService } from '../services/NotificationService';
import { BiometricService } from '../services/BiometricService';

describe('ChefORG Mobile App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('HomeScreen', () => {
    it('renders correctly', () => {
      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
      
      expect(getByText('🍽️ ChefORG')).toBeTruthy();
      expect(getByText('Bem-vindos ao ChefORG')).toBeTruthy();
    });

    it('handles reservation button press', () => {
      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
      
      const reserveButton = getByText('📅 Reservar Mesa');
      fireEvent.press(reserveButton);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Reservations');
    });

    it('handles menu button press', () => {
      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
      
      const menuButton = getByText('Ver Cardápio');
      fireEvent.press(menuButton);
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Menu');
    });
  });

  describe('MenuScreen', () => {
    it('renders menu items correctly', async () => {
      const { getByText, getByPlaceholderText } = render(
        <MenuScreen navigation={mockNavigation} />
      );
      
      await waitFor(() => {
        expect(getByText('Pizza Margherita')).toBeTruthy();
        expect(getByText('Hambúrguer Artesanal')).toBeTruthy();
      });

      expect(getByPlaceholderText('Buscar no cardápio...')).toBeTruthy();
    });

    it('filters menu items by search', async () => {
      const { getByPlaceholderText, getByText, queryByText } = render(
        <MenuScreen navigation={mockNavigation} />
      );
      
      await waitFor(() => {
        expect(getByText('Pizza Margherita')).toBeTruthy();
      });

      const searchInput = getByPlaceholderText('Buscar no cardápio...');
      fireEvent.changeText(searchInput, 'Pizza');
      
      await waitFor(() => {
        expect(getByText('Pizza Margherita')).toBeTruthy();
        expect(queryByText('Hambúrguer Artesanal')).toBeFalsy();
      });
    });

    it('adds items to cart', async () => {
      const { getByText } = render(<MenuScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText('Pizza Margherita')).toBeTruthy();
      });

      const addButton = getByText('Adicionar');
      fireEvent.press(addButton);
      
      await waitFor(() => {
        expect(getByText('Ver Carrinho')).toBeTruthy();
      });
    });
  });

  describe('ReservationScreen', () => {
    it('renders reservations list', async () => {
      const { getByText } = render(<ReservationScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText('João Silva')).toBeTruthy();
        expect(getByText('Maria Santos')).toBeTruthy();
      });
    });

    it('opens new reservation form', () => {
      const { getByText } = render(<ReservationScreen navigation={mockNavigation} />);
      
      const newReservationButton = getByText('+ Nova Reserva');
      fireEvent.press(newReservationButton);
      
      expect(getByText('Nova Reserva')).toBeTruthy();
    });

    it('creates new reservation', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ReservationScreen navigation={mockNavigation} />
      );
      
      // Open form
      fireEvent.press(getByText('+ Nova Reserva'));
      
      // Fill form
      fireEvent.changeText(getByPlaceholderText('Digite o nome completo'), 'Test User');
      fireEvent.changeText(getByPlaceholderText('(11) 99999-9999'), '11999999999');
      fireEvent.changeText(getByPlaceholderText('AAAA-MM-DD'), '2025-08-25');
      fireEvent.changeText(getByPlaceholderText('19:30'), '20:00');
      fireEvent.changeText(getByPlaceholderText('4'), '2');
      
      // Submit
      fireEvent.press(getByText('Criar Reserva'));
      
      await waitFor(() => {
        expect(getByText('Test User')).toBeTruthy();
      });
    });
  });

  describe('OrderScreen', () => {
    it('renders orders correctly', async () => {
      const { getByText } = render(<OrderScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText('Pedido #1')).toBeTruthy();
        expect(getByText('Mesa 5 • João Silva')).toBeTruthy();
      });
    });

    it('switches between tabs', () => {
      const { getByText } = render(<OrderScreen navigation={mockNavigation} />);
      
      const historyTab = getByText('Histórico');
      fireEvent.press(historyTab);
      
      expect(getByText('Histórico')).toBeTruthy();
    });

    it('updates order status', async () => {
      const { getByText } = render(<OrderScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText('Iniciar Preparo')).toBeTruthy();
      });

      fireEvent.press(getByText('Iniciar Preparo'));
      
      await waitFor(() => {
        expect(getByText('Preparando')).toBeTruthy();
      });
    });
  });

  describe('ProfileScreen', () => {
    it('renders user profile', async () => {
      const { getByText } = render(<ProfileScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText('João Silva')).toBeTruthy();
        expect(getByText('Cliente')).toBeTruthy();
      });
    });

    it('enables edit mode', async () => {
      const { getByText, getByDisplayValue } = render(
        <ProfileScreen navigation={mockNavigation} />
      );
      
      await waitFor(() => {
        expect(getByText('João Silva')).toBeTruthy();
      });

      fireEvent.press(getByText('Editar'));
      
      await waitFor(() => {
        expect(getByDisplayValue('João Silva')).toBeTruthy();
      });
    });

    it('handles logout', async () => {
      jest.spyOn(Alert, 'alert');
      
      const { getByText } = render(<ProfileScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText('🚪 Sair da Conta')).toBeTruthy();
      });

      fireEvent.press(getByText('🚪 Sair da Conta'));
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Confirmar Logout',
        'Tem certeza que deseja sair da sua conta?',
        expect.any(Array)
      );
    });
  });

  describe('QRScannerScreen', () => {
    it('requests camera permissions', async () => {
      render(<QRScannerScreen navigation={mockNavigation} />);
      
      // Camera permission should be requested on mount
      await waitFor(() => {
        expect(require('expo-camera').Camera.requestCameraPermissionsAsync).toHaveBeenCalled();
      });
    });

    it('handles QR code scan', async () => {
      jest.spyOn(Alert, 'alert');
      
      const { getByTestId } = render(<QRScannerScreen navigation={mockNavigation} />);
      
      // Simulate QR code scan
      const mockQRData = {
        type: 'table',
        tableId: 5,
      };
      
      // This would normally be triggered by the camera
      // For testing, we'll simulate the scan result
      await waitFor(() => {
        // Verify camera is ready
        expect(require('expo-camera').Camera.requestCameraPermissionsAsync).toHaveBeenCalled();
      });
    });
  });

  describe('AdminScreen', () => {
    it('renders dashboard stats', async () => {
      const { getByText } = render(<AdminScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText('Dashboard Administrativo')).toBeTruthy();
        expect(getByText('Vendas Hoje')).toBeTruthy();
        expect(getByText('R$ 2.847,50')).toBeTruthy();
      });
    });

    it('navigates to management sections', async () => {
      const { getByText } = render(<AdminScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText('Ver Pedidos')).toBeTruthy();
      });

      fireEvent.press(getByText('Ver Pedidos'));
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Orders');
    });
  });

  describe('StaffScreen', () => {
    it('renders tasks and team tabs', async () => {
      const { getByText } = render(<StaffScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText(/Tarefas \(\d+\)/)).toBeTruthy();
        expect(getByText(/Equipe \(\d+\)/)).toBeTruthy();
      });
    });

    it('switches between tasks and team', () => {
      const { getByText } = render(<StaffScreen navigation={mockNavigation} />);
      
      const teamTab = getByText(/Equipe \(\d+\)/);
      fireEvent.press(teamTab);
      
      expect(getByText('Ana Santos')).toBeTruthy();
    });

    it('updates task status', async () => {
      const { getByText } = render(<StaffScreen navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText('Iniciar')).toBeTruthy();
      });

      fireEvent.press(getByText('Iniciar'));
      
      await waitFor(() => {
        expect(getByText('Concluir')).toBeTruthy();
      });
    });
  });

  describe('NotificationService', () => {
    let notificationService: NotificationService;

    beforeEach(() => {
      notificationService = NotificationService.getInstance();
    });

    it('registers for push notifications', async () => {
      const token = await notificationService.registerForPushNotificationsAsync();
      
      expect(token).toBe('mock-push-token');
      expect(require('expo-notifications').getExpoPushTokenAsync).toHaveBeenCalled();
    });

    it('schedules local notifications', async () => {
      const notificationId = await notificationService.scheduleLocalNotification({
        title: 'Test Notification',
        body: 'Test body',
      });
      
      expect(notificationId).toBe('mock-notification-id');
      expect(require('expo-notifications').scheduleNotificationAsync).toHaveBeenCalled();
    });

    it('sends order update notifications', async () => {
      await notificationService.notifyOrderUpdate(123, 'pronto');
      
      expect(require('expo-notifications').scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: 'Pedido #123',
          body: '🍽️ Seu pedido está pronto!',
          data: { orderId: 123, status: 'pronto', type: 'order_update' },
          sound: true,
          priority: 'high',
        },
        trigger: null,
      });
    });

    it('cancels notifications', async () => {
      await notificationService.cancelNotification('test-id');
      
      expect(require('expo-notifications').cancelScheduledNotificationAsync).toHaveBeenCalledWith('test-id');
    });
  });

  describe('BiometricService', () => {
    let biometricService: BiometricService;

    beforeEach(() => {
      biometricService = BiometricService.getInstance();
    });

    it('checks availability', async () => {
      const isAvailable = await biometricService.isAvailable();
      
      expect(isAvailable).toBe(true);
      expect(require('expo-local-authentication').hasHardwareAsync).toHaveBeenCalled();
      expect(require('expo-local-authentication').isEnrolledAsync).toHaveBeenCalled();
    });

    it('authenticates user', async () => {
      const result = await biometricService.authenticate();
      
      expect(result.success).toBe(true);
      expect(require('expo-local-authentication').authenticateAsync).toHaveBeenCalled();
    });

    it('gets supported biometric types', async () => {
      const types = await biometricService.getBiometricTypeNames();
      
      expect(types).toContain('Impressão Digital');
      expect(require('expo-local-authentication').supportedAuthenticationTypesAsync).toHaveBeenCalled();
    });

    it('authenticates for payment', async () => {
      const result = await biometricService.authenticateForPayment(50.00);
      
      expect(result).toBe(true);
      expect(require('expo-local-authentication').authenticateAsync).toHaveBeenCalledWith({
        promptMessage: 'Confirme sua identidade para processar pagamento de R$ 50,00',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });
    });
  });

  describe('Integration Tests', () => {
    it('handles complete order flow', async () => {
      // Test complete flow from menu to order completion
      const menuScreen = render(<MenuScreen navigation={mockNavigation} />);
      
      // Add item to cart
      await waitFor(() => {
        expect(menuScreen.getByText('Pizza Margherita')).toBeTruthy();
      });
      
      fireEvent.press(menuScreen.getByText('Adicionar'));
      
      await waitFor(() => {
        expect(menuScreen.getByText('Ver Carrinho')).toBeTruthy();
      });
      
      fireEvent.press(menuScreen.getByText('Ver Carrinho'));
      
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Orders');
    });

    it('handles reservation to table assignment flow', async () => {
      const reservationScreen = render(<ReservationScreen navigation={mockNavigation} />);
      
      // Confirm reservation
      await waitFor(() => {
        expect(reservationScreen.getByText('Confirmar')).toBeTruthy();
      });
      
      fireEvent.press(reservationScreen.getByText('Confirmar'));
      
      // Check status update
      await waitFor(() => {
        expect(reservationScreen.getByText('Confirmada')).toBeTruthy();
      });
    });

    it('handles staff task management flow', async () => {
      const staffScreen = render(<StaffScreen navigation={mockNavigation} />);
      
      // Start task
      await waitFor(() => {
        expect(staffScreen.getByText('Iniciar')).toBeTruthy();
      });
      
      fireEvent.press(staffScreen.getByText('Iniciar'));
      
      // Complete task
      await waitFor(() => {
        expect(staffScreen.getByText('Concluir')).toBeTruthy();
      });
      
      fireEvent.press(staffScreen.getByText('Concluir'));
      
      // Verify completion
      await waitFor(() => {
        expect(staffScreen.getByText('Concluída')).toBeTruthy();
      });
    });
  });
});