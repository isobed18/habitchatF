import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/api/login/', { // her giriste adb reverse tcp:8000 tcp:8000 yapın(android emulatoru localhosta portlama)
        username: username,
        password: password,
      });

      Alert.alert('Giriş Başarılı', `Hoş geldin, ${response.data.name}!`);
    } catch (error) {
      if (error.response) {
        // Sunucu yanıt verdi ama hata kodu ile
        Alert.alert('Giriş Hatası', error.response.data.message || 'Bir hata oluştu.');
      } else {
        // Sunucuya ulaşamadı
        Alert.alert('Hata', 'Ağ bağlantısı sağlanamadı.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kullanıcı Adı</Text>
      <TextInput
        placeholder='Kullanıcı adınızı girin'
        style={styles.textInputStyle}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Şifre</Text>
      <TextInput
        placeholder='Şifrenizi girin'
        style={styles.textInputStyle}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
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