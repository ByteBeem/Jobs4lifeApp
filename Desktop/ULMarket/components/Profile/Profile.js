import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LoginAlert from "../Modal/LoginAlert";

const Profile = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('Loading...');
    const [cellphone, setCellphone] = useState('Loading...');
    const [error, setError] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const storedCellphone = await AsyncStorage.getItem('cellphone');
            const storedUsername = await AsyncStorage.getItem('username');

            if (storedUsername !== null) setUsername(storedUsername);
            if (storedCellphone !== null) setCellphone(storedCellphone);
        } catch (error) {
            console.error('Error fetching data:', error);
            setCellphone('Error fetching data');
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOkPress = () => {
        setModalVisible(false);
    };

    const navigation = useNavigation();

    const handleHomePress = () => {
        navigation.navigate('Home');
    };

    const handleFeedPress = () => {
        navigation.navigate('Sell');
    };

    const handleOkbutton = () => {
        setModalVisible(true);
    };

    const renderPostItem = ({ item }) => (
        <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobText}>Description: {item.post}</Text>
            <Text style={styles.jobText}>{item.text}</Text>
            <Text style={styles.jobText}>Phone number: {item.phone}</Text>
            <Text style={styles.jobText}>Location: {item.location}</Text>
            <Text style={styles.jobText}>R{item.price}</Text>
            <Image source={{ uri: item.imageLink }} style={styles.jobImage} resizeMode="cover" />
            {!loading && (
                <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Buy</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const LogOut = async () => {
        await AsyncStorage.clear();
        navigation.navigate('Login');
    };

    const fetchUserData = async (token) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.get(
                'https://jobs4lifeserver-1648d8d4bba0.herokuapp.com/users/data',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'CustomAppcheck': 'DonaldRSA04?'
                    }
                }
            );

            const { username, cellphone } = response.data;

            await AsyncStorage.setItem('cellphone', cellphone);
            setCellphone(cellphone);
            await AsyncStorage.setItem('username', username);
            setUsername(username);

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError(error.response?.data?.error || 'An error occurred while fetching. Please try again later.');
        }
    };

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const [storedUsername, storedCellphone] = await AsyncStorage.multiGet(["username", "cellphone"]);

                if (!token) {
                    handleOkbutton();
                } else if (!storedCellphone && !storedUsername) {
                    await fetchUserData(token);
                }
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };

        fetchToken();
    }, []);

    useEffect(() => {
        const token = cellphone;

        const fetchPosts = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get(
                    'https://jobs4lifeserver-1648d8d4bba0.herokuapp.com/posts/fetch',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'CustomAppcheck': 'DonaldRSA04?',
                        },
                    }
                );
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('An error occurred while fetching posts. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [cellphone]);

    return (
        <View style={styles.container}>
            <View style={styles.userInfoContainer}>
                <View style={styles.imageContainer}></View>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.cellphone}>{cellphone}</Text>
                    <TouchableOpacity onPress={LogOut} style={styles.button}>
                        <Text style={styles.buttonText}>Log Out</Text>
                    </TouchableOpacity>
                    {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
                </View>
            </View>
            <FlatList
                data={posts}
                renderItem={renderPostItem}
                keyExtractor={item => item.id}
                style={styles.feedContainer}
            />
            <View style={styles.navigation}>
                <TouchableOpacity style={styles.navButton} onPress={handleHomePress}>
                    <Ionicons name="home-outline" size={24} color="black" />
                    <Text>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
          <Ionicons name="heart-circle" size={29} color="black" />

          <Text>Love</Text>
        </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={handleFeedPress}>
                    <MaterialIcons name="sell" size={24} color="black" />
                    <Text>Sell</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
            <LoginAlert visible={modalVisible} message="This section requires you to log in first" onOkPress={handleOkPress} />
        </View>
    );
};

const ProfileLazy = () => (
    <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
        <Profile />
    </Suspense>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '20%',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    imageContainer: {
        marginRight: 20,
        width: 50,
    },
    userInfo: {
        flex: 1,
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
    username: {
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    jobCard: {
        backgroundColor: '#f9f9f9',
        padding: '5%',
        marginBottom: '5%',
        borderRadius: 8,
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    feedContainer: {
        flex: 1,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: '5%',
    },
    jobText: {
        fontSize: 16,
        marginBottom: '3%',
    },
    applyButton: {
        backgroundColor: 'blue',
        padding: '3%',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: '3%',
    },
    jobImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
    },
    cellphone: {
        fontSize: 23,
        fontWeight: 'bold',
    },
});

export default ProfileLazy;
