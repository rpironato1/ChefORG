// Main App component for React Native
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { notificationService } from './src/services/NotificationService';
import { biometricService } from './src/services/BiometricService';

export default function App() {
  useEffect(() => {
    // Initialize services
    const initializeApp = async () => {
      try {
        // Register for push notifications
        await notificationService.registerForPushNotificationsAsync();
        
        // Set up notification handlers
        notificationService.setupForegroundNotificationHandler((notification) => {
          console.log('Foreground notification received:', notification);
        });
        
        notificationService.setupNotificationResponseHandler((response) => {
          console.log('Notification response:', response);
          // Handle notification tap - navigate to appropriate screen
          const { data } = response.notification.request.content;
          
          if (data?.type === 'order_update' && data?.orderId) {
            // Navigate to order details
          } else if (data?.type === 'table_service' && data?.tableId) {
            // Navigate to table management
          } else if (data?.type === 'reservation_reminder' && data?.reservationId) {
            // Navigate to reservations
          }
        });
        
        // Check biometric availability
        const biometricAvailable = await biometricService.isAvailable();
        console.log('Biometric authentication available:', biometricAvailable);
        
        if (biometricAvailable) {
          const biometricTypes = await biometricService.getBiometricTypeNames();
          console.log('Available biometric types:', biometricTypes);
        }
        
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
