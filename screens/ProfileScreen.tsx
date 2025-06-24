import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Profile: undefined;
  Login: undefined;
  EditProfile: undefined;
  Settings: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: Props) {
  const [meseroData, setMeseroData] = React.useState({
    nombre: "Cargando...",
    email: auth.currentUser?.email || "",
    puesto: "Cargando...",
    turno: "Cargando...",
    experiencia: "Cargando...",
    restaurante: "Cargando...",
    telefono: "Cargando...",
    avatar: "https://images.pexels.com/photos/2664417/pexels-photo-2664417.jpeg",
    stats: {
      satisfaccion: 0,
      ordenes: 0,
      calificacion: 0
    }
  });

  const [loading, setLoading] = React.useState(true);

  // Función para cargar datos del usuario
  const loadUserData = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setMeseroData({
          nombre: userData.nombre || "Usuario",
          email: userData.email || auth.currentUser.email || "",
          puesto: userData.puesto || "Empleado",
          turno: userData.turno || "No definido",
          experiencia: userData.experiencia || "Nuevo",
          restaurante: userData.restaurante || "Hostee Restaurant",
          telefono: userData.telefono || "+52 614 123 4567",
          avatar: userData.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
          stats: userData.stats || {
            satisfaccion: 95,
            ordenes: 0,
            calificacion: 5.0
          }
        });
      } else {
        // Si no existe el documento, usar datos por defecto
        setMeseroData({
          nombre: auth.currentUser.email?.split('@')[0] || "Usuario",
          email: auth.currentUser.email || "",
          puesto: "Empleado",
          turno: "No definido",
          experiencia: "Nuevo",
          restaurante: "Hostee Restaurant",
          telefono: "+52 614 123 4567",
          avatar: "https://images.pexels.com/photos/2664417/pexels-photo-2664417.jpeg",
          stats: {
            satisfaccion: 95,
            ordenes: 0,
            calificacion: 5.0
          }
        });
      }
    } catch (error) {
      console.error("Error cargando datos del usuario:", error);
      Alert.alert("Error", "No se pudieron cargar los datos del perfil");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos cuando se monta el componente
  React.useEffect(() => {
    loadUserData();
  }, []);

  // Recargar datos cuando se enfoca la pantalla
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!loading) {
        loadUserData();
      }
    });

    return unsubscribe;
  }, [navigation, loading]);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.navigate('Login');
            } catch (error) {
              Alert.alert("Error", "No se pudo cerrar la sesión");
            }
          }
        }
      ]
    );
  };

  const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={24} color="#4A90E2" />
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {/* Foto de perfil */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: meseroData.avatar }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          {/* Información básica */}
          <Text style={styles.name}>{meseroData.nombre}</Text>
          <Text style={styles.position}>{meseroData.puesto}</Text>
          <Text style={styles.restaurant}>{meseroData.restaurante}</Text>
        </View>
      </LinearGradient>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{meseroData.stats.satisfaccion}%</Text>
          <Text style={styles.statLabel}>Satisfacción</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{meseroData.stats.ordenes}</Text>
          <Text style={styles.statLabel}>Órdenes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{meseroData.stats.calificacion}</Text>
          <Text style={styles.statLabel}>Calificación</Text>
        </View>
      </View>

      {/* Información personal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        
        <MenuItem
          icon="mail"
          title="Email"
          subtitle={meseroData.email}
          onPress={() => {}}
          showArrow={false}
        />
        
        <MenuItem
          icon="call"
          title="Teléfono"
          subtitle={meseroData.telefono}
          onPress={() => {}}
          showArrow={false}
        />
        
        <MenuItem
          icon="time"
          title="Turno"
          subtitle={meseroData.turno}
          onPress={() => {}}
          showArrow={false}
        />
        
        <MenuItem
          icon="trophy"
          title="Experiencia"
          subtitle={meseroData.experiencia}
          onPress={() => {}}
          showArrow={false}
        />
      </View>

      {/* Acciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración</Text>
        
        <MenuItem
          icon="person"
          title="Editar Perfil"
          onPress={() => navigation.navigate('EditProfile')}
        />
        
        <MenuItem
          icon="settings"
          title="Configuración"
          onPress={() => navigation.navigate('Settings')}
        />
        
        <MenuItem
          icon="help-circle"
          title="Ayuda y Soporte"
          onPress={() => Alert.alert("Ayuda", "Contacta al administrador para soporte")}
        />

        <MenuItem
          icon="refresh"
          title="Actualizar Datos"
          onPress={() => {
            setLoading(true);
            loadUserData();
          }}
        />
      </View>

      {/* Botón de cerrar sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#8E8E93",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFF",
  },
  cameraButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#4A90E2",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  position: {
    fontSize: 18,
    color: "#E3F2FD",
    marginBottom: 3,
  },
  restaurant: {
    fontSize: 16,
    color: "#BBDEFB",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 15,
    paddingVertical: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E5EA",
    marginVertical: 10,
  },
  section: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E3A59",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2E3A59",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
    marginLeft: 10,
  },
  bottomSpace: {
    height: 50,
  },
});