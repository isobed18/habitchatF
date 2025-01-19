import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import axiosInstance from './services/axiosInstance.js';
import { saveToken } from './utils/auth.js';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/login/', {
        username,
        password,
      });
      const { token } = response.data;
      await saveToken(token); // Token'ı kaydet
      Alert.alert('Başarılı!', 'Giriş başarılı!');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      Alert.alert('Hata!', 'Kullanıcı adı veya şifre yanlış.');
    }
  };

  const getServerTime = async () => {
    try {
      console.log('Sunucu zamanını almak için istek gönderiliyor...'); // Hata ayıklama bilgisi
      const response = await axiosInstance.get('/get_server_time');
      Alert.alert('Sunucu Zamanı', response.data.message);
    } catch (error) {
      console.error('Error fetching server time:', error.message);
      Alert.alert('Hata!', 'Sunucu zamanını alamadık.');
      console.error('Hata ayrıntıları:', error); // Hata ayrıntılarını konsola yazdır
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kullanıcı Adı</Text>
      <TextInput
        placeholder="Kullanıcı adınızı girin"
        style={styles.textInputStyle}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Şifre</Text>
      <TextInput
        placeholder="Şifrenizi girin"
        style={styles.textInputStyle}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={getServerTime}>
        <Text style={styles.buttonText}>Sunucu Zamanını Al</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle: {
    borderWidth: 1,
    width: '60%',
    height: 50,
    borderRadius: 10,
    marginVertical: 10,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    color: 'black',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
