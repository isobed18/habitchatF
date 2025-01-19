import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import axiosInstance from './services/axiosInstance';

export default function Home() {
    const [habits, setHabits] = useState([]); // Alışkanlıklar listesi
    const [modalVisible, setModalVisible] = useState(false); // Modal kontrolü
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [habitType, setHabitType] = useState('count'); // Alışkanlık tipi
    const [totalTime, setTotalTime] = useState(''); // Toplam süre
    const [frequency, setFrequency] = useState('daily'); // Sıklık
    const [selectedHabit, setSelectedHabit] = useState(null);

const openEditModal = (habit) => {
  setSelectedHabit(habit);
  setEditModalVisible(true);
};

  const [newHabit, setNewHabit] = useState({
    name: '',
    habit_type: 'count',
    target_count: '',
    frequency: 'daily',
  });

  // Alışkanlıkları Backend'den çek
  const fetchHabits = async () => {
    try {
      const response = await axiosInstance.get('api/get_habits');
      setHabits(response.data.habits);
    } catch (error) {
      console.error('Error fetching habits:', error.message);
      Alert.alert('Hata!', 'Alışkanlıklar yüklenemedi.');
    }
  };

  // Yeni Alışkanlık Ekle
  const handleAddHabit = async () => {
    try {
      const response = await axiosInstance.post('api/add_habit', newHabit);
      Alert.alert('Başarılı!', response.data.message);
      setModalVisible(false); // Modal'ı kapat
      fetchHabits(); // Alışkanlıkları yeniden yükle
    } catch (error) {
      console.error('Error adding habit:', error.message);
      Alert.alert('Hata!', 'Alışkanlık eklenemedi.');
    }
  };

  // Sunucu Zamanını Al
  const getServerTime = async () => {
    try {
      const response = await axiosInstance.get('users/api/get_server_time');
      Alert.alert('Sunucu Zamanı', response.data.message);
    } catch (error) {
      console.error('Error fetching server time:', error.message);
      Alert.alert('Hata!', 'Sunucu zamanını alamadık.');
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleIncrement = async (habitId) => {
    try {
      const response = await axiosInstance.post(`api/increment_habit_count/${habitId}/`);
      Alert.alert('Başarılı!', response.data.message);
      fetchHabits(); // Alışkanlıkları güncelle
    } catch (error) {
      console.error('Error incrementing habit:', error.message);
      Alert.alert('Hata!', 'Sayım artırılamadı.');
    }
  };
  
  const handleDecrement = async (habitId) => {
    try {
      const response = await axiosInstance.post(`api/decrement_habit_count/${habitId}/`);
      Alert.alert('Başarılı!', response.data.message);
      fetchHabits();
    } catch (error) {
      console.error('Error decrementing habit:', error.message);
      Alert.alert('Hata!', 'Sayım azaltılamadı.');
    }
  };
  
  const handleDeleteHabit = async (habitId) => {
    try {
      const response = await axiosInstance.delete(`api/delete_habit/${habitId}/`);
      Alert.alert('Başarılı!', response.data.message);
      fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error.message);
      Alert.alert('Hata!', 'Alışkanlık silinemedi.');
    }
  };
  
  const handleUpdateHabit = async () => {
    try {
      const response = await axiosInstance.put(`api/update_habit/${selectedHabit.id}/`, selectedHabit);
      Alert.alert('Başarılı!', response.data.message);
      setEditModalVisible(false);
      fetchHabits();
    } catch (error) {
      console.error('Error updating habit:', error.message);
      Alert.alert('Hata!', 'Güncelleme başarısız oldu.');
    }
  };
  



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alışkanlıklarım</Text>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <View style={styles.habitCard}>
              <Text style={styles.habitName}>{item.name}</Text>
              <Text>Tür: {item.habit_type}</Text>
              <Text>Hedef: {item.target_count || 'N/A'}</Text>
              <Text>Sıklık: {item.frequency}</Text>
              <Text>Seri: {item.streak}</Text>
              <Text>Sayım: {item.count}</Text>
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.button, styles.incrementButton]}
                  onPress={() => handleIncrement(item.id)}
                >
                  <Text style={styles.buttonText}>+</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.decrementButton]}
                  onPress={() => handleDecrement(item.id)}
                >
                  <Text style={styles.buttonText}>-</Text>
                </Pressable>

                <Pressable style={[styles.button, styles.editButton]}  onPress={() => openEditModal(item)} >
                <Text style={styles.buttonText}>Düzenle</Text>
                </Pressable>
                <Pressable
  style={[styles.button, styles.deleteButton]}
  onPress={() => handleDeleteHabit(item.id)}
>
  <Text style={styles.buttonText}>Sil</Text>
</Pressable>
    </View>
    </View>
    )}  
      />

      {/* Sunucu Zamanı */}
      <Pressable style={styles.button} onPress={getServerTime}>
        <Text style={styles.buttonText}>Sunucu Zamanını Al</Text>
      </Pressable>

      {/* Yeni Alışkanlık Ekle */}
      <Pressable
        style={[styles.button, styles.addButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Yeni Alışkanlık Ekle</Text>
      </Pressable>    
      
     
{/* Düzenleme Modal */}
  
<Modal
  animationType="slide"
  transparent={true}
  visible={editModalVisible}
  onRequestClose={() => setEditModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Alışkanlığı Düzenle</Text>

      <TextInput
        placeholder="Alışkanlık Adı"
        style={styles.textInput}
        value={selectedHabit?.name}
        onChangeText={(value) =>
          setSelectedHabit((prev) => ({ ...prev, name: value }))
        }
      />
      <TextInput
        placeholder="Hedef Sayısı"
        style={styles.textInput}
        keyboardType="numeric"
        value={String(selectedHabit?.target_count)}
        onChangeText={(value) =>
          setSelectedHabit((prev) => ({ ...prev, target_count: value }))
        }
      />
      <Pressable
        style={[styles.button, styles.saveButton]}
        onPress={handleUpdateHabit}
      >
        <Text style={styles.buttonText}>Güncelle</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.cancelButton]}
        onPress={() => setEditModalVisible(false)}
      >
        <Text style={styles.buttonText}>İptal</Text>
      </Pressable>
    </View>
  </View>
</Modal>



{/* Yeni Alışkanlık Ekle Modal */}
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Yeni Alışkanlık Ekle</Text>

      <TextInput
        placeholder="Alışkanlık Adı"
        style={styles.textInput}
        value={newHabit.name}
        onChangeText={(value) =>
          setNewHabit((prev) => ({ ...prev, name: value }))
        }
      />
      
      {/* Alışkanlık Tipi Seçimi */}
      <Text>Alışkanlık Tipi:</Text>
      <Pressable style={styles.selectionBox} onPress={() => setHabitType(habitType === 'count' ? 'time' : 'count')}>
        <Text style={styles.selectionText}>
          {habitType === 'count' ? 'Sayım Kontrollü' : 'Zaman Kontrollü'}
        </Text>
      </Pressable>

      {/* Hedef Sayısı veya Süre Girişi */}
      {habitType === 'count' ? (
        <TextInput
          placeholder="Hedef Sayısı"
          style={styles.textInput}
          keyboardType="numeric"
          value={newHabit.target_count}
          onChangeText={(value) =>
            setNewHabit((prev) => ({ ...prev, target_count: value }))
          }
        />
      ) : (
        <TextInput
          placeholder="Toplam Süre (örn: 01:30:00)"
          style={styles.textInput}
          value={totalTime}
          onChangeText={(value) => setTotalTime(value)}
        />
      )}

      {/* Sıklık Seçimi */}
      <Text>Sıklık:</Text>
      <Pressable style={styles.selectionBox} onPress={() => setFrequency(frequency === 'daily' ? 'weekly' : frequency === 'weekly' ? 'monthly' : 'daily')}>
        <Text style={styles.selectionText}>
          {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.saveButton]}
        onPress={handleAddHabit}
      >
        <Text style={styles.buttonText}>Ekle</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.cancelButton]}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.buttonText}>İptal</Text>
      </Pressable>
    </View>
  </View>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  habitCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: '#28A745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#28A745',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#DC3545',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#FFC107',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  incrementButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
  },
  decrementButton: {
    backgroundColor: '#DC3545',
    padding: 10,
    borderRadius: 5,
  },
  selectionBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 16,
    color: '#333',
  },
  
});
