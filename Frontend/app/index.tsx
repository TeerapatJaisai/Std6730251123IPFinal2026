import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';

// Backend ที่รันอยู่บน Server
const API_URL = 'http://119.59.102.161:3084';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleLogin = async () => {
    // ตรวจสอบว่ากรอกครบหรือไม่
    if (!username.trim() || !password.trim()) {
      showAlert('Error', 'Please enter username and password');
      return;
    }

    try {
      setLoading(true);

      console.log('Connecting to:', `${API_URL}/api/login`);

      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password
        })
      });

      const data = await response.json();

      console.log('Status:', response.status);
      console.log('Login response:', data);

      if (response.ok && data.success) {
        router.replace('/dashboard');
      } else {
        showAlert(
          'Login Failed',
          data.message || 'Invalid username or password'
        );
      }

    } catch (error) {
      console.error('Login error:', error);

      showAlert(
        'Connection Error',
        'Unable to connect to backend server'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        HR Manager Login
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Username (admin)"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Password (password123)"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[
          styles.btn,
          loading && styles.btnDisabled
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.btnText}>
            Login
          </Text>
        )}
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },

  input: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dddddd'
  },

  btn: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },

  btnDisabled: {
    opacity: 0.6
  },

  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16
  }
});