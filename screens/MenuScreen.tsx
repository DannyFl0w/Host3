import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Alert
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from "../firebaseConfig";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Menu: undefined;
  Profile: undefined;
};

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Menu'>;

interface Props {
  navigation: MenuScreenNavigationProp;
}

export default function MenuScreen({ navigation }: Props) {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const userName = auth.currentUser?.email?.split('@')[0] || 'Usuario';

  // Actualizar la hora cada minuto
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const MenuCard = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    colors = ['#4A90E2', '#357ABD'],
    iconColor = '#FFF'
  }: {
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    colors?: readonly [string, string, ...string[]];
    iconColor?: string;
  }) => (
    <TouchableOpacity style={styles.menuCard} onPress={onPress}>
      <LinearGradient
        colors={colors}
        style={styles.menuCardGradient}
      >
        <View style={styles.menuCardContent}>
          <View style={styles.menuCardIcon}>
            <Ionicons name={icon as any} size={32} color={iconColor} />
          </View>
          <View style={styles.menuCardText}>
            <Text style={styles.menuCardTitle}>{title}</Text>
            <Text style={styles.menuCardSubtitle}>{subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );



  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Header */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-circle" size={40} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          {/* Información del turno */}
          <View style={styles.shiftInfo}>
            <View style={styles.shiftItem}>
              <Ionicons name="time" size={16} color="#E3F2FD" />
              <Text style={styles.shiftText}>
                {currentTime.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </Text>
            </View>
            <View style={styles.shiftItem}>
              <Ionicons name="business" size={16} color="#E3F2FD" />
              <Text style={styles.shiftText}>Hostee Restaurant</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Tarjetas de estadísticas rápidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Mesas Activas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Alertas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Órdenes Hoy</Text>
        </View>
      </View>

      {/* Menú principal */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Menú Principal</Text>
        
        <MenuCard
          icon="restaurant"
          title="Mesas"
          subtitle="Gestionar mesas y pedidos"
          onPress={() => Alert.alert("Próximamente", "Función de mesas en desarrollo")}
          colors={['#4A90E2', '#357ABD']}
        />
        
        <MenuCard
          icon="notifications"
          title="Alertas"
          subtitle="Ver notificaciones y alertas"
          onPress={() => Alert.alert("Próximamente", "Función de alertas en desarrollo")}
          colors={['#FF6B6B', '#FF5252']}
        />
        
        <MenuCard
          icon="person"
          title="Perfil"
          subtitle="Ver y editar información personal"
          onPress={() => navigation.navigate('Profile')}
          colors={['#4ECDC4', '#26A69A']}
        />
      </View>



      {/* Estado del servicio */}
      <View style={styles.serviceStatusSection}>
        <View style={styles.serviceStatusCard}>
          <View style={styles.serviceStatusHeader}>
            <View style={styles.serviceStatusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.serviceStatusText}>Servicio Activo</Text>
            </View>
            <Text style={styles.serviceTime}>
              {currentTime.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
          <Text style={styles.serviceDescription}>
            Todo funcionando correctamente. Buen servicio!
          </Text>
        </View>
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    gap: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 16,
    color: "#E3F2FD",
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textTransform: "capitalize",
  },
  profileButton: {
    padding: 5,
  },
  shiftInfo: {
    gap: 8,
  },
  shiftItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  shiftText: {
    fontSize: 14,
    color: "#E3F2FD",
    textTransform: "capitalize",
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: -20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 20,
  },
  menuCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  menuCardGradient: {
    borderRadius: 15,
    padding: 20,
  },
  menuCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuCardText: {
    flex: 1,
  },
  menuCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  menuCardSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },

  serviceStatusSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  serviceStatusCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  serviceStatusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  serviceStatusIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  serviceStatusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
  },
  serviceTime: {
    fontSize: 14,
    color: "#8E8E93",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
  },
  bottomSpace: {
    height: 30,
  },
});