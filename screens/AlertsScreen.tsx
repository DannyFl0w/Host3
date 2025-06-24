import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const alertasMock = [
  {
    id: "a1",
    mesa: 5,
    mensaje: "¡Bebida derramada!",
    fecha: "2024-06-24 14:10",
    prioridad: "alta"
  },
  {
    id: "a2",
    mesa: 8,
    mensaje: "Mesa lista para ordenar",
    fecha: "2024-06-24 14:12",
    prioridad: "media"
  },
  {
    id: "a3",
    mesa: 3,
    mensaje: "Cliente solicita la cuenta",
    fecha: "2024-06-24 14:15",
    prioridad: "baja"
  },
];

const getPriorityColor = (prioridad?: string) => {
  if (prioridad === "alta") return "#FF5252";
  if (prioridad === "media") return "#FFA726";
  return "#4A90E2";
};

export default function AlertsMockScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones de Mis Mesas</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {alertasMock.map(alerta => (
          <View key={alerta.id} style={[styles.alertCard, { borderLeftColor: getPriorityColor(alerta.prioridad) }]}>
            <Ionicons
              name="alert-circle"
              size={30}
              color={getPriorityColor(alerta.prioridad)}
              style={{ marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.mensaje}>Mesa {alerta.mesa}: {alerta.mensaje}</Text>
              <Text style={styles.fecha}>{alerta.fecha}</Text>
              <Text style={[styles.prioridad, { color: getPriorityColor(alerta.prioridad) }]}>
                {alerta.prioridad?.toUpperCase() || "NORMAL"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F8FC", paddingTop: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#2E86DE" },
  list: { paddingHorizontal: 10, paddingBottom: 30 },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 6,
    elevation: 2,
  },
  mensaje: { fontSize: 16, fontWeight: "600", color: "#333" },
  fecha: { fontSize: 13, color: "#8E8E93", marginTop: 3 },
  prioridad: { fontSize: 14, fontWeight: "bold", marginTop: 6 },
});
