import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const UsersList = () => {
  const navigation = useNavigation();

  // Sample user data
  const users = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
    { id: 4, name: 'User 4' },
    { id: 5, name: 'User 5' },
  ];

  const handleUserPress = (userId) => {
    // Navigate to ChatComponent screen with messages sent by the selected user
    navigation.navigate('Chat', { userId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={29} color="#128C7E" />
        </TouchableOpacity>
        <Text style={styles.title}>Chats</Text>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserPress(item.id)}>
            <View style={styles.userItem}>
              <Text style={styles.userName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#128C7E',
    marginLeft: 10,
  },
  userItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  userName: {
    fontSize: 18,
    color: '#333',
  },
});

export default UsersList;
