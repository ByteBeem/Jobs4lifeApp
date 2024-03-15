import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentModal = ({ visible, closeModal, onSelectPayment , price}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handlePayInApp = async () => {
    setLoading(true);
    try {
    
      const amount = price *100;
      const email = 'users@ulmarket.co.za';
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch('https://spinzserver-e34cd148765a.herokuapp.com/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, email, token }),
      });
      
      const responseData = await response.json();
      
      const paymentUrl = responseData.data.authorization_url ;
      
      navigation.navigate('Payment', { uri: paymentUrl });
    } catch (error) {
      console.error('Error initiating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Which method do you prefer?</Text>
          <TouchableOpacity style={[styles.button, !loading ? null : styles.hiddenButton]} onPress={handlePayInApp} disabled={loading}>
            <Text style={styles.buttonText}>Pay in the app</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, !loading ? null : styles.hiddenButton]} onPress={() => onSelectPayment("COD (Cash on delivery)")} disabled={loading}>
            <Text style={styles.buttonText}>COD (Cash on delivery)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton, !loading ? null : styles.hiddenButton]} onPress={closeModal} disabled={loading}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          {loading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  hiddenButton: {
    display: 'none',
  },
});

export default PaymentModal;
