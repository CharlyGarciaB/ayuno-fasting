import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FastingProvider } from './src/context/FastingContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <FastingProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </FastingProvider>
    </SafeAreaProvider>
  );
}
