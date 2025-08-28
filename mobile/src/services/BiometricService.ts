// Biometric Authentication Service for React Native app
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometricType?: string;
}

export class BiometricService {
  private static instance: BiometricService;

  private constructor() {}

  static getInstance(): BiometricService {
    if (!BiometricService.instance) {
      BiometricService.instance = new BiometricService();
    }
    return BiometricService.instance;
  }

  /**
   * Check if biometric authentication is available on the device
   */
  async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Get supported biometric types
   */
  async getSupportedBiometrics(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      if (await this.isAvailable()) {
        return await LocalAuthentication.supportedAuthenticationTypesAsync();
      }
      return [];
    } catch (error) {
      console.error('Error getting supported biometrics:', error);
      return [];
    }
  }

  /**
   * Get human-readable biometric type names
   */
  async getBiometricTypeNames(): Promise<string[]> {
    const types = await this.getSupportedBiometrics();
    const typeNames: string[] = [];

    types.forEach(type => {
      switch (type) {
        case LocalAuthentication.AuthenticationType.FINGERPRINT:
          typeNames.push('Impressão Digital');
          break;
        case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
          typeNames.push('Reconhecimento Facial');
          break;
        case LocalAuthentication.AuthenticationType.IRIS:
          typeNames.push('Íris');
          break;
        default:
          typeNames.push('Biometria');
      }
    });

    return typeNames;
  }

  /**
   * Authenticate user with biometrics
   */
  async authenticate(options?: {
    promptMessage?: string;
    cancelLabel?: string;
    fallbackLabel?: string;
    disableDeviceFallback?: boolean;
  }): Promise<BiometricResult> {
    try {
      // Check if biometric authentication is available
      if (!(await this.isAvailable())) {
        return {
          success: false,
          error: 'Autenticação biométrica não disponível neste dispositivo',
        };
      }

      // Get supported biometric types for better user messaging
      const biometricTypes = await this.getBiometricTypeNames();
      const biometricType = biometricTypes[0] || 'Biometria';

      // Perform authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:
          options?.promptMessage || `Use sua ${biometricType.toLowerCase()} para entrar`,
        cancelLabel: options?.cancelLabel || 'Cancelar',
        fallbackLabel: options?.fallbackLabel || 'Usar senha',
        disableDeviceFallback: options?.disableDeviceFallback || false,
      });

      if (result.success) {
        return {
          success: true,
          biometricType,
        };
      } else {
        let errorMessage = 'Falha na autenticação';

        if (result.error === 'UserCancel') {
          errorMessage = 'Autenticação cancelada pelo usuário';
        } else if (result.error === 'UserFallback') {
          errorMessage = 'Usuário optou por usar senha';
        } else if (result.error === 'SystemCancel') {
          errorMessage = 'Autenticação cancelada pelo sistema';
        } else if (result.error === 'PasscodeNotSet') {
          errorMessage = 'Nenhuma senha configurada no dispositivo';
        } else if (result.error === 'BiometricNotAvailable') {
          errorMessage = 'Biometria não disponível';
        } else if (result.error === 'BiometricNotEnrolled') {
          errorMessage = 'Nenhuma biometria cadastrada';
        } else if (result.error === 'InvalidContext') {
          errorMessage = 'Contexto de autenticação inválido';
        }

        return {
          success: false,
          error: errorMessage,
          biometricType,
        };
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'Erro interno na autenticação biométrica',
      };
    }
  }

  /**
   * Quick biometric authentication for sensitive actions
   */
  async authenticateForAction(actionName: string): Promise<boolean> {
    const result = await this.authenticate({
      promptMessage: `Confirme sua identidade para ${actionName}`,
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
    });

    if (result.success) {
      return true;
    } else if (result.error && !result.error.includes('cancelada')) {
      // Show error for non-cancellation errors
      Alert.alert('Erro de Autenticação', result.error);
    }

    return false;
  }

  /**
   * Authenticate for payment operations
   */
  async authenticateForPayment(amount: number): Promise<boolean> {
    const formattedAmount = amount.toFixed(2).replace('.', ',');

    return await this.authenticateForAction(`processar pagamento de R$ ${formattedAmount}`);
  }

  /**
   * Authenticate for admin actions
   */
  async authenticateForAdmin(): Promise<boolean> {
    return await this.authenticateForAction('acessar funções administrativas');
  }

  /**
   * Authenticate for sensitive data access
   */
  async authenticateForDataAccess(): Promise<boolean> {
    return await this.authenticateForAction('acessar dados sensíveis');
  }

  /**
   * Check if device has passcode set up (required for biometrics)
   */
  async hasPasscodeSet(): Promise<boolean> {
    try {
      // This is indirectly checked by isEnrolledAsync
      return await LocalAuthentication.isEnrolledAsync();
    } catch (error) {
      console.error('Error checking passcode:', error);
      return false;
    }
  }

  /**
   * Get security level description
   */
  async getSecurityLevel(): Promise<string> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (!hasHardware) {
        return 'Biometria não suportada';
      }

      if (!isEnrolled) {
        return 'Biometria não configurada';
      }

      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return 'Reconhecimento facial ativo';
      }

      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return 'Impressão digital ativa';
      }

      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        return 'Reconhecimento de íris ativo';
      }

      return 'Biometria ativa';
    } catch (error) {
      console.error('Error getting security level:', error);
      return 'Status desconhecido';
    }
  }

  /**
   * Show biometric setup instructions
   */
  showSetupInstructions(): void {
    Alert.alert(
      'Configurar Biometria',
      'Para usar a autenticação biométrica, acesse as configurações do seu dispositivo e configure sua impressão digital ou reconhecimento facial.',
      [
        { text: 'Depois', style: 'cancel' },
        {
          text: 'Abrir Configurações',
          onPress: () => {
            // In a real app, you might open device settings
            // Linking.openSettings();
          },
        },
      ]
    );
  }

  /**
   * Prompt user to enable biometric authentication
   */
  async promptToEnable(): Promise<boolean> {
    const isAvailable = await this.isAvailable();

    if (isAvailable) {
      return true;
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();

    if (!hasHardware) {
      Alert.alert(
        'Biometria Não Suportada',
        'Este dispositivo não suporta autenticação biométrica.'
      );
      return false;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!isEnrolled) {
      return new Promise(resolve => {
        Alert.alert(
          'Configurar Biometria',
          'Para usar esta funcionalidade, você precisa configurar a autenticação biométrica no seu dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
            {
              text: 'Configurar',
              onPress: () => {
                this.showSetupInstructions();
                resolve(false);
              },
            },
          ]
        );
      });
    }

    return false;
  }
}

// Export singleton instance
export const biometricService = BiometricService.getInstance();
