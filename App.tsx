import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FastingProvider } from './src/context/FastingContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <FastingProvider>
        <ProfileProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </ProfileProvider>
      </FastingProvider>
    </SafeAreaProvider>
  );
}
