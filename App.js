import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login'; // Login sayfası
import Home from './Home';   // Home sayfası
import ProfilePage from './Profile'; // Profile sayfası

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Ana Sayfa' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfilePage}
          options={{ title: 'Profil Sayfası' }} // Profil sayfası başlığı
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}