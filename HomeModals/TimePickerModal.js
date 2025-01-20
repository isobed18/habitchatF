import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const TimePickerModal = ({ visible, onClose, onSelect }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleConfirm = () => {
    const totalSeconds = (hours * 3600) + (minutes * 60);
    onSelect(totalSeconds);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Hedef Süre Seçin</Text>
          <Text>Saat:</Text>
          <Picker
            selectedValue={hours}
            style={styles.picker}
            onValueChange={(itemValue) => setHours(itemValue)}
          >
            {[...Array(24).keys()].map((i) => (
              <Picker.Item key={i} label={`${i} saat`} value={i} />
            ))}
          </Picker>
          <Text>Dakika:</Text>
          <Picker
            selectedValue={minutes}
            style={styles.picker}
            onValueChange={(itemValue) => setMinutes(itemValue)}
          >
            {[...Array(60).keys()].map((i) => (
              <Picker.Item key={i} label={`${i} dakika`} value={i} />
            ))}
          </Picker>
          <Button title="Tamam" onPress={handleConfirm} />
          <Button title="İptal" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default TimePickerModal;