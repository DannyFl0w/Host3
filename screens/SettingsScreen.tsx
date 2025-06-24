import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Settings: undefined;
};

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

export default function SettingsScreen({ navigation }: Props) {
  const [notificaciones, setNotificaciones] = React.useState(true);
  const [temaOscuro, setTemaOscuro] = React.useState(false);

  const handleCambiarContraseña = () => {
    Alert.alert(
      "Cambiar contraseña",
      "Solicita el cambio de contraseña desde la app o contacta a soporte."
    );
  };

  const handleAcercaDe = () => {
    Alert.alert(
      "Acerca de",
      "Hostee App\nVersión 1.0\nDesarrollado por NOVA Host S.A. de C.V."
    );
  };

  const handleSoporte = () => {
    Alert.alert(
      "Soporte",
      "Para soporte técnico, contacta a admin@hostee.com o comunícate con tu supervisor."
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

      {/* Header con gradiente */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Configuración</Text>
      </LinearGradient>

      {/* Preferencias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <View style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={24} color="#4A90E2" />
          </View>
          <Text style={styles.itemLabel}>Notificaciones</Text>
          <View style={{ flex: 1 }} />
          <Switch
            value={notificaciones}
            onValueChange={setNotificaciones}
            thumbColor={notificaciones ? "#4A90E2" : "#eee"}
            trackColor={{ false: "#ccc", true: "#B3D2F7" }}
          />
        </View>
        <View style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="moon" size={24} color="#4A90E2" />
          </View>
          <Text style={styles.itemLabel}>Tema oscuro</Text>
          <View style={{ flex: 1 }} />
          <Switch
            value={temaOscuro}
            onValueChange={setTemaOscuro}
            thumbColor={temaOscuro ? "#4A90E2" : "#eee"}
            trackColor={{ false: "#ccc", true: "#B3D2F7" }}
          />
        </View>
      </View>

      {/* Cuenta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <TouchableOpacity style={styles.menuItem} onPress={handleCambiarContraseña}>
          <View style={styles.iconContainer}>
            <Ionicons name="key" size={24} color="#4A90E2" />
          </View>
          <Text style={styles.itemLabel}>Cambiar contraseña</Text>
        </TouchableOpacity>
      </View>

      {/* Soporte y acerca de */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soporte</Text>
        <TouchableOpacity style={styles.menuItem} onPress={handleSoporte}>
          <View style={styles.iconContainer}>
            <Ionicons name="help-circle" size={24} color="#4A90E2" />
          </View>
          <Text style={styles.itemLabel}>Ayuda y Soporte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleAcercaDe}>
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle" size={24} color="#4A90E2" />
          </View>
          <Text style={styles.itemLabel}>Acerca de</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginTop: 8,
  },
  section: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E3A59",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 7,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  itemLabel: {
    fontSize: 16,
    color: "#2E3A59",
    fontWeight: "500",
  },
  bottomSpace: {
    height: 50,
  },
});
