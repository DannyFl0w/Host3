import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: Props) {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    telefono: "",
    puesto: "",
    turno: "",
    experiencia: "",
    restaurante: ""
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.nombre) {
      Alert.alert("Error", "Por favor completa los campos obligatorios");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    return true;
  };

  const createUser = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: formData.email,
        nombre: formData.nombre,
        telefono: formData.telefono || "+52 614 123 4567",
        puesto: formData.puesto || "Mesero",
        turno: formData.turno || "Matutino",
        experiencia: formData.experiencia || "Nuevo",
        restaurante: formData.restaurante || "Hostee Restaurant",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        createdAt: new Date().toISOString(),
        stats: {
          satisfaccion: 95,
          ordenes: 0,
          calificacion: 5.0
        }
      });

      Alert.alert("¡Éxito!", `Bienvenido, ${formData.nombre}`);
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ 
    icon, 
    placeholder, 
    value, 
    onChangeText, 
    secureTextEntry = false,
    keyboardType = "default",
    required = false
  }: {
    icon: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: any;
    required?: boolean;
  }) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputIconContainer}>
        <Ionicons name={icon as any} size={20} color="#4A90E2" />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder + (required ? " *" : "")}
        placeholderTextColor="#8E8E93"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="restaurant" size={40} color="#FFF" />
          </View>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete al equipo de Hostee</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Información de cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Cuenta</Text>
          
          <InputField
            icon="mail"
            placeholder="Correo electrónico"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            keyboardType="email-address"
            required
          />
          
          <InputField
            icon="lock-closed"
            placeholder="Contraseña"
            value={formData.password}
            onChangeText={(text) => updateFormData('password', text)}
            secureTextEntry
            required
          />
          
          <InputField
            icon="checkmark-circle"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChangeText={(text) => updateFormData('confirmPassword', text)}
            secureTextEntry
            required
          />
        </View>

        {/* Información personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <InputField
            icon="person"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChangeText={(text) => updateFormData('nombre', text)}
            required
          />
          
          <InputField
            icon="call"
            placeholder="Teléfono"
            value={formData.telefono}
            onChangeText={(text) => updateFormData('telefono', text)}
            keyboardType="phone-pad"
          />
        </View>

        {/* Información laboral */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Laboral</Text>
          
          <InputField
            icon="briefcase"
            placeholder="Puesto (ej: Mesero, Bartender)"
            value={formData.puesto}
            onChangeText={(text) => updateFormData('puesto', text)}
          />
          
          <InputField
            icon="time"
            placeholder="Turno (ej: Matutino, Vespertino)"
            value={formData.turno}
            onChangeText={(text) => updateFormData('turno', text)}
          />
          
          <InputField
            icon="trophy"
            placeholder="Experiencia (ej: 2 años, Nuevo)"
            value={formData.experiencia}
            onChangeText={(text) => updateFormData('experiencia', text)}
          />
          
          <InputField
            icon="storefront"
            placeholder="Restaurante"
            value={formData.restaurante}
            onChangeText={(text) => updateFormData('restaurante', text)}
          />
        </View>

        {/* Botones */}
        <TouchableOpacity 
          style={[styles.registerButton, isLoading && styles.disabledButton]}
          onPress={createUser}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.gradientButton}
          >
            {isLoading ? (
              <Text style={styles.buttonText}>Creando cuenta...</Text>
            ) : (
              <>
                <Ionicons name="person-add" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Crear Cuenta</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <Text style={styles.loginLink}>Inicia sesión</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
    marginTop: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#E3F2FD",
  },
  formContainer: {
    flex: 1,
    marginTop: -20,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    paddingBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E3A59",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  inputIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#2E3A59",
    paddingRight: 15,
  },
  registerButton: {
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 15,
  },
  loginText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  loginLink: {
    fontSize: 16,
    color: "#4A90E2",
    fontWeight: "600",
  },
  bottomSpace: {
    height: 30,
  },
});