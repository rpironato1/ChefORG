// Push Notification Service for React Native app
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  priority?: 'min' | 'low' | 'default' | 'high' | 'max';
}

export class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Register for push notifications and get Expo push token
   */
  async registerForPushNotificationsAsync(): Promise<string | null> {
    let token = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return null;
      }

      try {
        token = (await Notifications.getExpoPushTokenAsync()).data;
        this.expoPushToken = token;
        console.log('Expo Push Token:', token);

        // In production, send this token to your server
        // await this.sendTokenToServer(token);
      } catch (error) {
        console.error('Error getting Expo push token:', error);
      }
    } else {
      console.warn('Must use physical device for Push Notifications');
    }

    return token;
  }

  /**
   * Send push token to server (mock implementation)
   */
  private async sendTokenToServer(token: string): Promise<void> {
    try {
      // In a real app, you would send this to your backend
      console.log('Sending push token to server:', token);

      // Mock API call
      // await fetch('https://your-api.com/push-tokens', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     token,
      //     userId: 'current-user-id',
      //     deviceType: Platform.OS,
      //   }),
      // });
    } catch (error) {
      console.error('Failed to send push token to server:', error);
    }
  }

  /**
   * Schedule a local notification
   */
  async scheduleLocalNotification(
    notification: NotificationData,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound !== false,
          priority: this.getAndroidPriority(notification.priority),
        },
        trigger: trigger || null, // null means immediate
      });

      console.log('Local notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling local notification:', error);
      throw error;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Send immediate notification for order updates
   */
  async notifyOrderUpdate(orderId: number, status: string): Promise<void> {
    const statusMessages = {
      confirmado: '✅ Seu pedido foi confirmado!',
      preparando: '👨‍🍳 Seu pedido está sendo preparado...',
      pronto: '🍽️ Seu pedido está pronto!',
      entregue: '✨ Seu pedido foi entregue. Bom apetite!',
    };

    const message = statusMessages[status] || `Status atualizado: ${status}`;

    await this.scheduleLocalNotification({
      title: `Pedido #${orderId}`,
      body: message,
      data: { orderId, status, type: 'order_update' },
      priority: 'high',
    });
  }

  /**
   * Send notification for table service requests
   */
  async notifyTableService(tableId: number, requestType: string): Promise<void> {
    const requestMessages = {
      garcom: '🙋‍♂️ Mesa solicita atendimento do garçom',
      conta: '💳 Mesa solicita a conta',
      limpeza: '🧹 Mesa precisa ser limpa',
      problema: '⚠️ Mesa reportou um problema',
    };

    const message = requestMessages[requestType] || 'Solicitação da mesa';

    await this.scheduleLocalNotification({
      title: `Mesa ${tableId}`,
      body: message,
      data: { tableId, requestType, type: 'table_service' },
      priority: 'high',
    });
  }

  /**
   * Send notification for reservation reminders
   */
  async notifyReservationReminder(
    reservationId: number,
    customerName: string,
    time: string
  ): Promise<void> {
    await this.scheduleLocalNotification({
      title: '📅 Lembrete de Reserva',
      body: `${customerName} - Reserva às ${time}`,
      data: { reservationId, customerName, time, type: 'reservation_reminder' },
      priority: 'default',
    });
  }

  /**
   * Send notification for staff task assignments
   */
  async notifyStaffTask(taskId: number, title: string, description: string): Promise<void> {
    await this.scheduleLocalNotification({
      title: `📋 Nova Tarefa: ${title}`,
      body: description,
      data: { taskId, type: 'staff_task' },
      priority: 'high',
    });
  }

  /**
   * Schedule reminder notifications
   */
  async scheduleReminder(
    title: string,
    body: string,
    scheduledTime: Date,
    data?: any
  ): Promise<string> {
    return await this.scheduleLocalNotification(
      {
        title,
        body,
        data: { ...data, type: 'reminder' },
      },
      {
        date: scheduledTime,
      }
    );
  }

  /**
   * Handle notification responses (when user taps notification)
   */
  setupNotificationResponseHandler(
    handler: (response: Notifications.NotificationResponse) => void
  ): void {
    Notifications.addNotificationResponseReceivedListener(handler);
  }

  /**
   * Handle foreground notifications
   */
  setupForegroundNotificationHandler(
    handler: (notification: Notifications.Notification) => void
  ): void {
    Notifications.addNotificationReceivedListener(handler);
  }

  /**
   * Get badge count
   */
  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }

  /**
   * Set badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  /**
   * Clear badge count
   */
  async clearBadgeCount(): Promise<void> {
    await this.setBadgeCount(0);
  }

  /**
   * Convert priority to Android format
   */
  private getAndroidPriority(
    priority?: 'min' | 'low' | 'default' | 'high' | 'max'
  ): Notifications.AndroidNotificationPriority {
    switch (priority) {
      case 'min':
        return Notifications.AndroidNotificationPriority.MIN;
      case 'low':
        return Notifications.AndroidNotificationPriority.LOW;
      case 'high':
        return Notifications.AndroidNotificationPriority.HIGH;
      case 'max':
        return Notifications.AndroidNotificationPriority.MAX;
      default:
        return Notifications.AndroidNotificationPriority.DEFAULT;
    }
  }

  /**
   * Get current push token
   */
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
