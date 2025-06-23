import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { ref, onValue } from "firebase/database";
import { AntDesign } from "@expo/vector-icons";
import { rtdb } from "../firebaseConfig";

type Mesa = {
  estado: string;
  numero: number;
  ultima_actualizacion: string;
};

export default function MesasScreen() {
  const [mesas, setMesas] = useState<{ [key: string]: Mesa }>({});
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);

  useEffect(() => {
    const mesasRef = ref(rtdb, "/");
    const unsubscribe = onValue(mesasRef, (snapshot) => {
      const data = snapshot.val() || {};
      setMesas(data);
    });
    return () => unsubscribe();
  }, []);

  function getEstadoColor(estado: string) {
    if (estado === "ocupada") return "#f44336";
    if (estado === "reservada") return "#ffa726";
    return "#4caf50";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plano del Restaurante</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {Object.entries(mesas).map(([key, mesa]) => (
          <TouchableOpacity
            key={key}
            style={styles.mesa}
            onPress={() => setSelectedMesa(mesa)}
          >
            <AntDesign name="table" size={40} color={getEstadoColor(mesa.estado)} />
            <Text style={styles.mesaLabel}>Mesa {mesa.numero}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={!!selectedMesa}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedMesa(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMesa && (
              <>
                <Text style={styles.modalTitle}>Mesa {selectedMesa.numero}</Text>
                <Text>
                  Estado:{" "}
                  <Text style={[
                    styles.highlight,
                    { color: getEstadoColor(selectedMesa.estado) }
                  ]}>
                    {selectedMesa.estado.charAt(0).toUpperCase() + selectedMesa.estado.slice(1)}
                  </Text>
                </Text>
                <Text>
                  Última actualización:
                  <Text style={styles.highlight}>{"\n"}{selectedMesa.ultima_actualizacion}</Text>
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedMesa(null)}
                >
                  <Text style={{ color: "#fff" }}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F6F8FC" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#2E86DE" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 50,
  },
  mesa: {
    alignItems: "center",
    margin: 18,
    width: 100,
  },
  mesaLabel: { marginTop: 7, color: "#555", fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 30, minWidth: 250, alignItems: "center", elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#2E86DE", marginBottom: 10 },
  highlight: { fontWeight: "bold", color: "#27ae60" },
  closeButton: { marginTop: 24, backgroundColor: "#2E86DE", borderRadius: 8, padding: 10, paddingHorizontal: 24 },
});
