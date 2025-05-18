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
import TimePickerModal from './HomeModals/TimePickerModal'; // Dosya yolunuza göre ayarlayın

export default function Home() {
    const [habits, setHabits] = useState([]); // Alışkanlıklar listesi
    const [modalVisible, setModalVisible] = useState(false); // Modal kontrolü
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [habitType, setHabitType] = useState('count'); // Alışkanlık tipi
    const [totalTime, setTotalTime] = useState(''); // Toplam süre
    const [frequency, setFrequency] = useState('daily'); // Sıklık
    const [selectedHabit, setSelectedHabit] = useState({ count: 0 }); // Başlangıçta count değeri 0 olarak ayarlandı
    const [timePickerVisible, setTimePickerVisible] = useState(false);
const openEditModal = (habit) => {
  setSelectedHabit(habit);
  setEditModalVisible(true);
};

  const [newHabit, setNewHabit] = useState({
    name: '',
    habit_type: 'count',
    target_count: '',
    target_time: '', // Yeni alan
    frequency: 'daily',
  });

  const formatTargetTimeForDisplay = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds === undefined) return 'N/A';
  
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
  
    return `${hours} saat ${minutes} dakika`;
  };
  // Alışkanlıkları Backend'den çek
  const fetchHabits = async () => {
    try {
      const response = await axiosInstance.get('habits/get/');
      setHabits(response.data.habits);
    } catch (error) {
      console.error('Error fetching habits:', error.message);
      Alert.alert('Hata!', 'Alışkanlıklar yüklenemedi.');
    }
  };

  // Yeni Alışkanlık Ekle
  
  const handleAddHabit = async () => {
    try {
      // Yeni alışkanlık nesnesini oluştur
      const habitData = {
        name: newHabit.name,
        habit_type: habitType, // habitType'ı buraya ekleyin
        target_count: habitType === 'count' ? newHabit.target_count : null, // Eğer count ise hedef sayıyı ekle
        target_time: habitType === 'time' ? newHabit.target_time : null, // Eğer time ise hedef süreyi ekle
        frequency: frequency, // frequency'yi buraya ekleyin
      };
  
      const response = await axiosInstance.post('habits/add/', habitData);
      Alert.alert('Başarılı!', response.data.message);
      setModalVisible(false); // Modal'ı kapat
      fetchHabits(); // Alışkanlıkları yeniden yükle
    } catch (error) {
      console.error('Error adding habit:', error.message);
      Alert.alert('Hata!', 'Alışkanlık eklenemedi.');
    }
  };
  
  const formatDuration = (duration) => {
    if (duration === null || duration === undefined) return 'N/A';
  
    const totalSeconds = Math.floor(duration); // Saniye cinsine çevir
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  

    

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Sunucu Zamanını Al
  const getServerTime = async () => {
    try {
      const response = await axiosInstance.get('users/get_server_time');
      Alert.alert('Sunucu Zamanı', response.data.message);
    } catch (error) {
      console.error('Error fetching server time:', error.message);
      Alert.alert('Hata!', 'Sunucu zamanını alamadık.');
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  
  
  
  
  const handleDeleteHabit = async (habitId) => {
    try {
      const response = await axiosInstance.delete(`habits/delete/${habitId}/`);
      Alert.alert('Başarılı!', response.data.message);
      fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error.message);
      Alert.alert('Hata!', 'Alışkanlık silinemedi.');
    }
  };
  
  const handleUpdateHabit = async () => {
    try {
      const payload = {
        id: selectedHabit.id,
        name: selectedHabit.name,
        habit_type: selectedHabit.habit_type,
        count: selectedHabit.count, // Artırılmış veya manuel girilmiş değer
        target_count: selectedHabit.target_count,
        target_time: selectedHabit.target_time,
      };
  
      const response = await axiosInstance.put(
        `habits/update/${selectedHabit.id}/`,
        payload
      );
  
      Alert.alert('Başarılı!', response.data.message);
      setEditModalVisible(false);
      fetchHabits(); // Alışkanlıkları güncelle
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
      {item.habit_type === 'count' ? (
        <Text>Hedef: {item.target_count || 'N/A'}</Text>
      ) : (
        <Text>Hedef Süre: {formatDuration(item.target_time) || 'N/A'}</Text>
      )}
      <Text>Sıklık: {item.frequency}</Text>
      <Text>Seri: {item.streak}</Text>
      <Text>Sayım: {item.count}</Text>
      <Text>Tamamlanan: {item.completed_count}</Text>
      <View style={styles.buttonRow}>
      <Pressable
          style={[styles.button, styles.incrementButton]}
          onPress={async () => {
            // İlk olarak `selectedHabit`'i seç ve güncelle
            const updatedHabit = {
              ...item, // Şu anki item verilerini kullan
              count: (item.count || 0) + 1, // `count` değerini artır
            };

            // Güncellenmiş alışkanlık ile API çağrısını yap
            try {
              const payload = {
                name:updatedHabit.name,
                count: updatedHabit.count,
                target_count: updatedHabit.target_count // Yalnızca değişen değeri gönder
              };

              const response = await axiosInstance.put(
                `habits/update/${updatedHabit.id}/`,
                payload
              );

              Alert.alert('Başarılı!', response.data.message);

              // Yerel state'i güncelle
              setSelectedHabit(updatedHabit);
              fetchHabits(); // Listeyi yeniden yükle
            } catch (error) {
              console.error('Error updating habit:', error.message);
              Alert.alert('Hata!', 'Güncelleme başarısız oldu.');
            }
          }}
        >
          <Text style={styles.buttonText}>+1</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.editButton]} onPress={() => openEditModal(item)}>
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

      {/* Hedef Süre veya Hedef Sayısı Seçimi */}
      {selectedHabit?.habit_type === 'count' ? (
        <>
          <Text style={styles.label}>Hedef Sayısı:</Text>
          <TextInput
            placeholder="Hedef Sayısı"
            style={styles.textInput}
            keyboardType="numeric"
            value={String(selectedHabit?.target_count)}
            onChangeText={(value) =>
              setSelectedHabit((prev) => ({
                ...prev,
                target_count: parseInt(value, 10) || 0,
              }))
            }
          />
          {/* Mevcut Sayıyı Düzenle */}
          <Text style={styles.label}>Mevcut Sayı:</Text>
          <TextInput
            placeholder="Mevcut Sayı"
            style={styles.textInput}
            keyboardType="numeric"
            value={String(selectedHabit?.count)}
            onChangeText={(value) =>
              setSelectedHabit((prev) => ({
                ...prev,
                count: parseInt(value, 10) || 0,
              }))
            }
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Hedef Süre:</Text>
          <Pressable onPress={() => setTimePickerVisible(true)}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>
                {formatTargetTimeForDisplay(selectedHabit?.target_time)}
              </Text>
            </View>
          </Pressable>
        </>
      )}

      <TimePickerModal
        visible={timePickerVisible}
        onClose={() => setTimePickerVisible(false)}
        onSelect={(totalSeconds) => {
          setSelectedHabit((prev) => ({ ...prev, target_time: totalSeconds }));
        }}
      />

      {/* Güncelle Butonu */}
      <Pressable
        style={[styles.button, styles.saveButton]}
        onPress={() => handleUpdateHabit()}
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
              <Pressable onPress={() => setTimePickerVisible(true)}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>
                    {newHabit.target_time ? formatTargetTimeForDisplay(newHabit.target_time) : 'Hedef Süre Seçin'}
                  </Text>
                </View>
              </Pressable>
            )}

            {/* Zaman Seçici Modal */}
            <TimePickerModal
              visible={timePickerVisible}
              onClose={() => setTimePickerVisible(false)}
              onSelect={(totalSeconds) => {
                setNewHabit((prev) => ({ ...prev, target_time: totalSeconds }));
              }}
            />

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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
});
