import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import ActiveSessionScreen from './screens/ActiveSessionScreen';
import FirstTimeUserScreen from './screens/FirstTimeUserScreen';
import FocusFormScreen from './screens/FocusFormScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import SplashScreen from './screens/SplashScreen';
import StreakLostScreen from './screens/StreakLostScreen';
import WeakScreen from './screens/WeakScreen';
import TabNavigator from './navigation/TabNavigator';

const Stack = createNativeStackNavigator();
enableScreens(false);

export default function App() {
  const navTheme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: '#000000',
        card: '#000000',
        border: '#1A1A1A',
        text: '#FFFFFF',
      },
    }),
    []
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme} fallback={<View style={styles.fallback} />}>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' },
            animation: 'none',
            freezeOnBlur: false,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="FirstTimeUser" component={FirstTimeUserScreen} />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="FocusForm" component={FocusFormScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ActiveSession" component={ActiveSessionScreen} />
          <Stack.Screen name="WeakScreen" component={WeakScreen} />
          <Stack.Screen name="StreakLost" component={StreakLostScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
