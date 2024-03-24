import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Modal from "../Modal/ModalImage";
import { Ionicons } from "@expo/vector-icons";

const JobPostCard = React.memo(({ job, loading, openModal }) => {
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImagePress = useCallback((imageUrl) => {
    setSelectedImage(imageUrl);
    setFullImageVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setFullImageVisible(false);
    setSelectedImage('');
  }, []);

  return (
    <View style={styles.jobCard}>
      <Text style={styles.jobTitle}>{job.title}</Text>
      <Text style={styles.jobText}>Description: {job.post}</Text>
      <Text style={styles.jobText}>{job.text}</Text>
      <Text style={styles.jobText}>Phone number: {job.phone}</Text>
      <Text style={styles.jobText}>Location: {job.location}</Text>
      <Text style={styles.jobText}>R{job.price}</Text>
      <TouchableOpacity onPress={() => handleImagePress(job.imageLink)}>
        <Image source={{ uri: job.imageLink }} style={styles.jobImage} resizeMode="cover" />
      </TouchableOpacity>
      {!loading && (
        <TouchableOpacity style={styles.applyButton} onPress={openModal}>
          <Text style={styles.applyButtonText}>Buy</Text>
        </TouchableOpacity>
      )}
      <Modal
        visible={fullImageVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
          <Ionicons name="close-circle" size={54} color="black" />
        </TouchableOpacity>
        <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  jobCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  jobText: {
    fontSize: 16,
    marginBottom: 6,
  },
  applyButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 12,
  },
  jobImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    backgroundColor: 'white',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  fullImage: {
    width: '130%',
    height: '88%',
  },
});

export default JobPostCard;
