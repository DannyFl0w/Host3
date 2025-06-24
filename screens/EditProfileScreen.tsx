import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};

type EditProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

interface Props {
  navigation: EditProfileScreenNavigationProp;
}

export default function EditProfileScreen({ navigation }: Props) {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [profile, setProfile] = React.useState({
    nombre: "",
    puesto: "",
    turno: "",
    experiencia: "",
    restaurante: "",
    telefono: "",
    avatar: "",
  });

  // Cargar datos actuales
  React.useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            nombre: data.nombre || "",
            puesto: data.puesto || "",
            turno: data.turno || "",
            experiencia: data.experiencia || "",
            restaurante: data.restaurante || "",
            telefono: data.telefono || "",
            avatar: data.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
          });
        } else {
          setProfile({
            nombre: "",
            puesto: "",
            turno: "",
            experiencia: "",
            restaurante: "",
            telefono: "",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
          });
        }
      } catch (err) {
        Alert.alert("Error", "No se pudieron cargar los datos.");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        ...profile,
        email: auth.currentUser.email,
      }, { merge: true });
      Alert.alert("Éxito", "Perfil actualizado correctamente", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert("Error", "No se pudo guardar el perfil");
    }
    setSaving(false);
  };

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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F6F8FC" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
                source={{ uri: profile.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" }}
                style={styles.avatar}
              />
            </View>
            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={() => {
                Alert.prompt(
                  "Editar Avatar",
                  "Pega aquí la URL de tu nueva foto de perfil:",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Actualizar",
                      onPress: (text) => {
                        if (text) handleChange("avatar", text);
                      }
                    }
                  ],
                  "plain-text",
                  profile.avatar
                );
              }}
            >
              <Ionicons name="camera" size={18} color="#FFF" />
              <Text style={{ color: "#FFF", marginLeft: 6, fontWeight: "600" }}>Cambiar Foto</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.formSection}>
          <Text style={styles.inputLabel}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={profile.nombre}
            onChangeText={text => handleChange("nombre", text)}
            placeholder="Nombre"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.inputLabel}>Puesto</Text>
          <TextInput
            style={styles.input}
            value={profile.puesto}
            onChangeText={text => handleChange("puesto", text)}
            placeholder="Puesto"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.inputLabel}>Turno</Text>
          <TextInput
            style={styles.input}
            value={profile.turno}
            onChangeText={text => handleChange("turno", text)}
            placeholder="Turno"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.inputLabel}>Experiencia</Text>
          <TextInput
            style={styles.input}
            value={profile.experiencia}
            onChangeText={text => handleChange("experiencia", text)}
            placeholder="Experiencia"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.inputLabel}>Restaurante</Text>
          <TextInput
            style={styles.input}
            value={profile.restaurante}
            onChangeText={text => handleChange("restaurante", text)}
            placeholder="Restaurante"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.inputLabel}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={profile.telefono}
            keyboardType="phone-pad"
            onChangeText={text => handleChange("telefono", text)}
            placeholder="Teléfono"
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity
            style={[styles.saveButton, saving && { backgroundColor: "#bbb" }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : (
                <>
                  <Ionicons name="save" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                </>
              )
            }
          </TouchableOpacity>
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F8FC" },
  centered: { justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#8E8E93" },
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: { alignItems: "center" },
  avatarContainer: { marginBottom: 10 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#FFF",
  },
  editAvatarBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E86DE",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 15,
    marginTop: 8,
    elevation: 2,
  },
  formSection: { marginTop: 16, paddingHorizontal: 24 },
  inputLabel: {
    fontWeight: "600",
    color: "#2E86DE",
    marginTop: 18,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#222",
    borderWidth: 1,
    borderColor: "#eee",
  },
  saveButton: {
    backgroundColor: "#2E86DE",
    borderRadius: 15,
    marginTop: 28,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 10,
    fontSize: 16,
  },
  bottomSpace: { height: 60 },
});
