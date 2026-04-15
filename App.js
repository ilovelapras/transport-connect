import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Ensure these file paths are exactly correct relative to App.js
import ReportScreen from './src/screens/ReportScreen';
import NavigationScreen from './src/screens/NavigationScreen';
import CrowdScreen from './src/screens/CrowdScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#e63946" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ size }) => {
            let iconName;

            if (route.name === 'Report') {
              iconName = '📋';
            } else if (route.name === 'Navigate') {
              iconName = '🧭';
            } else if (route.name === 'Together') {
              iconName = '👥';
            } else {
              iconName = '🏠';
            }

            // This <Text> was likely causing the crash because 'Text' wasn't imported
            return <Text style={{ fontSize: size + 4 }}>{iconName}</Text>;
          },
          tabBarActiveTintColor: '#e63946',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            height: 70,
            paddingBottom: 10, // Adjusted for better spacing
            paddingTop: 8,
          },
          headerStyle: {
            backgroundColor: '#e63946',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: 'TransportConnect',
        })}
      >
        <Tab.Screen name="Report" component={ReportScreen} options={{ title: 'Report' }} />
        <Tab.Screen name="Navigate" component={NavigationScreen} options={{ title: 'Breakdown Routes' }} />
        <Tab.Screen name="Together" component={CrowdScreen} options={{ title: 'Crowdsource' }} />
      </Tab.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}