// Main navigation configuration for React Native app
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

// Import screens
import { HomeScreen } from '../screens/HomeScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { ReservationScreen } from '../screens/ReservationScreen';
import { OrderScreen } from '../screens/OrderScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AdminScreen } from '../screens/AdminScreen';
import { StaffScreen } from '../screens/StaffScreen';
import { QRScannerScreen } from '../screens/QRScannerScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navigation type definitions
export type RootStackParamList = {
  MainTabs: undefined;
  QRScanner: undefined;
  Admin: undefined;
  Staff: undefined;
  OrderDetails: { orderId: string };
  TableMenu: { tableId: string };
};

export type TabParamList = {
  Home: undefined;
  Menu: undefined;
  Reservations: undefined;
  Orders: undefined;
  Profile: undefined;
};

// Tab Bar Icons (using emojis for now, can be replaced with proper icons)
const TabBarIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons = {
    Home: focused ? '🏠' : '🏘️',
    Menu: focused ? '🍽️' : '📋',
    Reservations: focused ? '📅' : '📆',
    Orders: focused ? '🛍️' : '🛒',
    Profile: focused ? '👤' : '👥',
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>{icons[name] || '📱'}</Text>
    </View>
  );
};

// Main Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Menu" 
        component={MenuScreen} 
        options={{ title: 'Cardápio' }}
      />
      <Tab.Screen 
        name="Reservations" 
        component={ReservationScreen} 
        options={{ title: 'Reservas' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrderScreen} 
        options={{ title: 'Pedidos' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="QRScanner" 
          component={QRScannerScreen}
          options={{ 
            title: 'Scanner QR',
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="Admin" 
          component={AdminScreen}
          options={{ title: 'Administração' }}
        />
        <Stack.Screen 
          name="Staff" 
          component={StaffScreen}
          options={{ title: 'Equipe' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};