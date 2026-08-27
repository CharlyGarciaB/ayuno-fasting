import React from 'react';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { ProtocolsScreen } from '../screens/ProtocolsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { Preparation72hScreen } from '../screens/Preparation72hScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RefeedScreen } from '../screens/RefeedScreen';
import { colors } from '../theme/colors';
import { RootStackParamList, MainTabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navTheme: Theme = {
  dark: true,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
};

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '⏱️',
    Protocols: '📋',
    History: '📊',
    Settings: '⚙️',
  };
  return (
    <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.6 }}>
      {icons[label]}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Ayuno', headerTitle: 'Mi Ayuno' }} />
      <Tab.Screen name="Protocols" component={ProtocolsScreen} options={{ title: 'Protocolos', headerTitle: 'Protocolos' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Historial', headerTitle: 'Historial' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ajustes', headerTitle: 'Ajustes' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="Preparation72h"
          component={Preparation72hScreen}
          options={{ title: 'Preparación 72h' }}
        />
        <Stack.Screen
          name="Refeed"
          component={RefeedScreen}
          options={{ title: 'Ruptura del ayuno', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
