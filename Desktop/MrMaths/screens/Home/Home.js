import React, { useState, useEffect, useCallback, Suspense, useMemo, useRef, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, useWindowDimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import Modal from "../Modal/Modal";
import { StatusBar } from 'expo-status-bar';
import PaymentModal from "../Modal/PaymentModal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../Login/UserContext';
import JobPostCard from './JobPostCard';
import axios from "axios";
import LoginAlert from "../Modal/LoginAlert";
import io from 'socket.io-client';

export default function Home() {
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [color, setColor] = useState('#0000FF');
  const windowWidth = useWindowDimensions().width;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const isFocused = useIsFocused();
  const { userId: loggedInUserId } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [alertmodalVisible, setAlertModalVisible] = useState(false);
  
  const [messageInQueueCount, setMessageInQueueCount] = useState({});

  const selectedJobAmountRef = useRef(null);
  const selectedJobIdRef = useRef(null);
  const selectedJobNameRef = useRef(null);
  const lastJobIdRef = useRef(null);

  const socket = useMemo(() => {
    if (loggedInUserId !== null) {
      return io('https://chattingservers-5a55bd5569a9.herokuapp.com/', {
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5,
        query: {
          userId: loggedInUserId
        }
      });
    }
    return null;
  }, [loggedInUserId]);

  useEffect(() => {
    const handleCheckOfflineMessages = () => {
      if (socket) {
        socket.emit('getOfflineMessageDetails');
      }
    };

    if (socket) {
      handleCheckOfflineMessages();
      socket.on('connect', handleCheckOfflineMessages);
      socket.on('offlineMessageDetails', ({ count, senderIds }) => {
       
        
        setMessageInQueueCount(count)
        console.log('senderIds', senderIds);
      });
    }

    return () => {
      if (socket) {
        socket.off('connect', handleCheckOfflineMessages);
      }
    };
  }, [socket]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      setColor(randomColor);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const openModal = useCallback((amount, idJob, name) => {
    console.log('pressed')
    if (!loggedInUserId) {
      setAlertModalVisible(true);
      setModalVisible(false);
    } else {
      selectedJobAmountRef.current = amount;
      selectedJobIdRef.current = idJob;
      selectedJobNameRef.current = name;
      setModalVisible(true);
    }
  }, []);

  useEffect(() => {
    if (selectedJobAmountRef.current !== null) {
      setModalVisible(true);
    }
  }, [selectedJobAmountRef.current]);

  const closeModal = () => {
    setModalVisible(false);
    
    selectedJobAmountRef.current = null;
    selectedJobIdRef.current = null;
    selectedJobNameRef.current = null;
  };
  
  const handlePaymentSelection = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    closeModal();
    
    setSelectedPaymentMethod(null);
  };
  

  const numberOfMessages = messageInQueueCount;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jobs4lifeserver-1648d8d4bba0.herokuapp.com/posts/fetch', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'CustomAppcheck': 'DonaldRSA04?',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setJobs(data);
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  const fetchMore = useCallback(async () => {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await fetch(`https://jobs4lifeserver-1648d8d4bba0.herokuapp.com/posts/fetchMore/${nextPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'CustomAppcheck': 'DonaldRSA04?',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length === 0) {
        setNoMorePosts(true);
      } else {
        setJobs(prevJobs => [...prevJobs, ...data]);
        lastJobIdRef.current = data[data.length - 1].id;
        setPage(nextPage);
      }
      setLoadingMore(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoadingMore(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    fetchMore(page);
  };

  const handleLogoutPress = useCallback(async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }, [navigation]);

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const handleFeedPress = () => {
    navigation.navigate('Sell');
  };

  const handleChatPress = () => {
    navigation.navigate('Chats');
  };

  const handleSearch = () => {
    setLoading(true);
    axios.get(`https://jobs4lifeserver-1648d8d4bba0.herokuapp.com/posts/search/${search}`, {
      headers: {
        'Content-Type': 'application/json',
        'CustomAppcheck': 'DonaldRSA04?'
      },
      params: {
        search: search
      }
    })
      .then(response => {
        setJobs(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        setLoading(false);
      });
  };


  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      setColor(randomColor);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOkPress = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: windowWidth * 0.05, fontWeight: 'bold', color: color, paddingTop: windowWidth * 0.05 }}> 🇿🇦 TurfMarket</Text>
      </View>
      <Text style={styles.label}></Text>
      <View style={styles.dropdownContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.navButton} onPress={handleSearch}>
          <Ionicons name="send" size={40} color="green" />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0000FF']}
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isNearEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isNearEnd && !loadingMore && !refreshing) {
            handleLoadMore();
          }
        }}
      >
        {jobs.slice().reverse().map((job) => (
      <JobPostCard
        key={job.id}
        job={job}
        loading={loading}
        openModal={() => openModal(job.price, job.userId, job.title)} 
      />
    ))}

        {loadingMore && <ActivityIndicator style={styles.loadingMoreIndicator} size="large" color="#0000FF" />}
        {noMorePosts && (
          <View style={styles.noMorePostsContainer}>
            <Text style={styles.noMorePostsText}>Sorry, That is all we have.</Text>
          </View>
        )}
      </ScrollView>
      <StatusBar style="auto" />
      <LoginAlert visible={alertmodalVisible} message="This section requires you to log in first" onOkPress={handleOkPress} />
      <Modal visible={loading} message="Please wait..." />
      <PaymentModal
        visible={modalVisible}
        closeModal={closeModal}
        onSelectPayment={handlePaymentSelection}
        price={selectedJobAmountRef.current}
        id={selectedJobIdRef.current}
        name={selectedJobNameRef.current}
      />
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={handleHomePress}>
          {isFocused ? (
            <Ionicons name="refresh" size={40} color="black" onPress={handleRefresh} />
          ) : (
            <Ionicons name="home-outline" size={24} color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleFeedPress}>
          <MaterialIcons name="sell" size={24} color="black" />
          <Text>Sell</Text>
        </TouchableOpacity>
        {loggedInUserId && (
          <TouchableOpacity style={styles.navButton} onPress={handleChatPress}>
            <Ionicons name="chatbubble-ellipses-outline" size={34} color="black" />
            {numberOfMessages > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{numberOfMessages}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.navButton} onPress={handleLogoutPress}>
          <AntDesign name="logout" size={24} color="black" />
          <Text>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '10%',
  },
  header: {
    position: 'absolute',
    top: '2%',
    left: '2%',
    backgroundColor: 'transparent',
    paddingTop: '5%',
    zIndex: 999,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    marginTop: '5%',
    paddingVertical: 12,
  },
  feedContainer: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: '2%',
    left: '2%',
    backgroundColor: 'transparent',
    paddingTop: '5%',
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  badgeContainer: {

    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 50,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  label: {
    marginRight: 10,
    fontSize: 23,
    color: '#333',
    paddingTop: 30,
  },
  jobPostsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '5%',
    marginTop: '5%',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMoreIndicator: {
    marginVertical: 20,
  },
  noMorePostsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noMorePostsText: {
    fontSize: 16,
    color: '#999',
  },
});
