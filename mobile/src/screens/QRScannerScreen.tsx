// QR Scanner Screen with camera functionality
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Dimensions,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { NativeButton } from '../components/NativeButton';

const COLORS = {
  primary: {
    600: '#2563eb',
  },
  gray: {
    100: '#f3f4f6',
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
  md: 16,
  lg: 24,
  xl: 32,
};

const { width, height } = Dimensions.get('window');

interface QRScannerScreenProps {
  navigation: any;
}

export const QRScannerScreen: React.FC<QRScannerScreenProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.back);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    Vibration.vibrate();

    // Parse QR code data
    try {
      let qrData;
      
      // Try to parse as JSON first
      try {
        qrData = JSON.parse(data);
      } catch {
        // If not JSON, treat as simple string
        qrData = { data, type: 'simple' };
      }

      // Handle different QR code types
      if (qrData.type === 'table') {
        // Table QR code
        Alert.alert(
          'Mesa Escaneada',
          `Mesa ${qrData.tableId} detectada!`,
          [
            {
              text: 'Ver Cardápio',
              onPress: () => {
                navigation.navigate('Menu', { tableId: qrData.tableId });
              },
            },
            {
              text: 'Fazer Pedido',
              onPress: () => {
                navigation.navigate('Orders', { tableId: qrData.tableId });
              },
            },
            {
              text: 'Escanear Novamente',
              onPress: () => setScanned(false),
              style: 'cancel',
            },
          ]
        );
      } else if (qrData.type === 'order') {
        // Order QR code
        Alert.alert(
          'Pedido Encontrado',
          `Pedido #${qrData.orderId} detectado!`,
          [
            {
              text: 'Ver Detalhes',
              onPress: () => {
                navigation.navigate('Orders', { orderId: qrData.orderId });
              },
            },
            {
              text: 'Escanear Novamente',
              onPress: () => setScanned(false),
              style: 'cancel',
            },
          ]
        );
      } else if (qrData.type === 'payment') {
        // Payment QR code
        Alert.alert(
          'Pagamento PIX',
          'QR Code de pagamento detectado!',
          [
            {
              text: 'Processar Pagamento',
              onPress: () => {
                // Handle payment processing
                Alert.alert('Sucesso', 'Pagamento processado com sucesso!');
                navigation.goBack();
              },
            },
            {
              text: 'Cancelar',
              onPress: () => navigation.goBack(),
              style: 'cancel',
            },
          ]
        );
      } else {
        // Generic QR code
        Alert.alert(
          'QR Code Detectado',
          data,
          [
            {
              text: 'Copiar',
              onPress: () => {
                // In a real app, you would copy to clipboard
                Alert.alert('Copiado', 'Texto copiado para a área de transferência');
              },
            },
            {
              text: 'Escanear Novamente',
              onPress: () => setScanned(false),
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível processar o QR Code',
        [
          {
            text: 'Escanear Novamente',
            onPress: () => setScanned(false),
          },
        ]
      );
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Solicitando permissão da câmera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Acesso à câmera negado</Text>
        <Text style={styles.permissionSubtext}>
          Por favor, permita o acesso à câmera nas configurações do app para usar o scanner QR.
        </Text>
        <NativeButton
          title="Voltar"
          onPress={() => navigation.goBack()}
          variant="primary"
          size="medium"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={cameraType}
        flashMode={flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
      >
        {/* Overlay with scanning frame */}
        <View style={styles.overlay}>
          {/* Top overlay */}
          <View style={styles.overlayTop}>
            <Text style={styles.instructionText}>
              Posicione o QR Code dentro do quadro
            </Text>
          </View>

          {/* Middle section with scanning frame */}
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scanningFrame}>
              {/* Scanning frame corners */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Scanning line animation could go here */}
              {!scanned && (
                <View style={styles.scanningLine} />
              )}
            </View>
            <View style={styles.overlaySide} />
          </View>

          {/* Bottom overlay with controls */}
          <View style={styles.overlayBottom}>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleFlash}
              >
                <Text style={styles.controlButtonText}>
                  {flashOn ? '🔦' : '💡'}
                </Text>
                <Text style={styles.controlButtonLabel}>Flash</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setScanned(false)}
                disabled={!scanned}
              >
                <Text style={[
                  styles.controlButtonText,
                  scanned && styles.controlButtonActive
                ]}>
                  🔄
                </Text>
                <Text style={styles.controlButtonLabel}>Escanear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleCameraType}
              >
                <Text style={styles.controlButtonText}>📷</Text>
                <Text style={styles.controlButtonLabel}>Virar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomActions}>
              <NativeButton
                title="Fechar"
                onPress={() => navigation.goBack()}
                variant="secondary"
                size="medium"
              />
            </View>
          </View>
        </View>
      </Camera>

      {/* Success overlay when QR is scanned */}
      {scanned && (
        <View style={styles.successOverlay}>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successText}>QR Code Detectado!</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: '#ffffff',
  },
  permissionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  permissionSubtext: {
    fontSize: 14,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: SPACING.xl,
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: 250,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scanningFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#ffffff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanningLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary[600],
    opacity: 0.8,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xl,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  controlButtonText: {
    fontSize: 24,
    marginBottom: SPACING.md,
  },
  controlButtonActive: {
    opacity: 0.6,
  },
  controlButtonLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  bottomActions: {
    alignItems: 'center',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: SPACING.xl,
    alignItems: 'center',
    minWidth: 200,
  },
  successIcon: {
    fontSize: 48,
    color: COLORS.green[600],
    marginBottom: SPACING.md,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    textAlign: 'center',
  },
});