import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from "expo-image-picker";

const Feed = () => {
    const [newPost, setNewPost] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [phone, setphone] = useState('');
    const [location, setLocation] = useState('');
    const [price, setprice] = useState('');
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageLink, setImageLink] = useState(null);

    const pickImage = useCallback(async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setLoading(true);
            await uploadImage(result.assets[0].uri);
        }
    }, [uploadImage]);

    const uploadImage = useCallback(async (uri) => {
        const formData = new FormData();
        formData.append('image', {
            uri,
            name: 'image.jpg',
            type: 'image/jpeg',
        });

        try {
            const response = await fetch('https://jobs4lifeserver-1648d8d4bba0.herokuapp.com/posts/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'CustomAppcheck': 'DonaldRSA04?',
                },
            });

            const data = await response.json();

            setLoading(false);
            setImageLink(data.downloadURL);

        } catch (error) {

            Alert.alert('Error', 'Failed to upload image');
            setLoading(false);
        }
    }, []);

    const navigation = useNavigation();
    const handleHomePress = useCallback(() => {
        navigation.navigate('Home');
    }, [navigation]);

    const handleProfilePress = useCallback(() => {
        navigation.navigate('Profile');
    }, [navigation]);

    const handleAddPost = useCallback(async () => {
        if (!newPost.trim()) {
            Alert.alert('Error: Description is empty.');
            return;
        }

        const token = await AsyncStorage.getItem("token");

        if (!price) {
            Alert.alert('Error: You have to enter price.');
            return;
        }
        if (!location) {
            Alert.alert('Error: You have to enter location.');
            return;
        }
        if (!phone) {
            Alert.alert('Error: You have to enter phone.');
            return;
        }
        if (!imageLink) {
            Alert.alert('Error: You have to choose image.');
            return;
        }
        if (!title) {
            Alert.alert('Error: You have to put title.');
            return;
        }
        if (!token || !userId) {
            Alert.alert('Error: You have to log in first.');
            navigation.navigate('Home');
            return;
        }
        setIsPosting(true);

        if (newPost.trim() !== '') {
            try {
                const response = await axios.post('https://jobs4lifeserver-1648d8d4bba0.herokuapp.com/posts/PostSell', {
                    text: newPost,
                    userId: userId,
                    title: title,
                    price: price,
                    location: location,
                    phone: phone,
                    imageLink: imageLink,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'CustomAppcheck': 'DonaldRSA04?',
                    },
                });
                if (response.status === 200) {
                    setImage(null);
                    setLocation('');
                    setUserId('');
                    setphone('');
                    setprice('');
                    setNewPost('');
                    Alert.alert('Posted Successfully , go to Home and refresh to see Your Product:');
                } else {
                    Alert.alert('Error adding post');
                }

                setIsPosting(false);
            } catch (error) {
                Alert.alert('Error adding post:', error);
                setIsPosting(false);
            }
        }
    }, [newPost, price, location, phone, imageLink, title, userId, navigation]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get('https://jobs4lifeserver-1648d8d4bba0.herokuapp.com/auth/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'CustomAppcheck': 'DonaldRSA04?',
                    },
                });
                setUserId(response.data.id);

            } catch (error) {
                Alert.alert('You have to log in first.');
                navigation.navigate("Login");
            }
        };

        fetchUserData();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}> What are you selling?</Text>
            <TextInput
                style={styles.inputPrice}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                multiline
            />
            <TextInput
                style={styles.inputPrice}
                placeholder="Description"
                value={newPost}
                onChangeText={setNewPost}
                multiline
            />

            <Button title="Choose Image" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            <TextInput
                style={styles.inputPrice}
                placeholder="Price(R)"
                value={price}
                onChangeText={setprice}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.inputPrice}
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
                multiline
            />
            <TextInput
                style={styles.inputPrice}
                placeholder="Cellphone"
                value={phone}
                onChangeText={setphone}
                keyboardType="phone-pad"
            />

            {!loading &&
                <TouchableOpacity style={styles.addButton} onPress={handleAddPost}>
                    {isPosting ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.buttonText}>Post</Text>
                    )}
                </TouchableOpacity>
            }

            <View style={styles.navigation}>
                <TouchableOpacity style={styles.navButton} onPress={handleHomePress}>
                    <Ionicons name="home-outline" size={24} color="black" />
                    <Text>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="heart-circle" size={29} color="black" />

                    <Text>Love</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.navButton} onPress={handleProfilePress}>
                    <Ionicons name="person-outline" size={24} color="black" />
                    <Text>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        paddingTop: 25,
    },
    input: {
        width: '100%',
        height: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },

    inputPrice: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    navButton: {
        alignItems: 'center',
    },
    addButton: {
        width: '100%',
        height: 50,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Feed;
