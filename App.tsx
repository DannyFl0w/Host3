import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';
import ProfileScreen from './screens/ProfileScreen';
import MesasScreen from './screens/MesasScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SettingsScreen from "./screens/SettingsScreen";
import AlertsScreen from "./screens/AlertsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menú Principal' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil de Usuario' }} />
        <Stack.Screen name="Mesas" component={MesasScreen} options={{ title: 'Mesas del Restaurante' }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configuración' }} />
        <Stack.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Notificaciones' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
