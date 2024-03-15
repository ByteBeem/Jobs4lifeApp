import React, { useState, useEffect, useCallback, Suspense , useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, useWindowDimensions, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Modal from "../Modal/Modal";
import { StatusBar } from 'expo-status-bar';
import PaymentModal from "../Modal/PaymentModal";

const LazyJobPostCard = React.lazy(() => import('./JobPostCard'));

export default function Home() {
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [color, setColor] = useState('#0000FF');
  const windowWidth = useWindowDimensions().width;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  

  const selectedJobAmountRef = useRef(null);

  const openModal = (amount) => {
   
    selectedJobAmountRef.current = amount;
    setModalVisible(true);
  };

  useEffect(() => {
    if (selectedJobAmountRef.current !== null) {
      setModalVisible(true);
    }
  }, [selectedJobAmountRef.current]);
  
  const closeModal = () => {
    setModalVisible(false);
  };
  
  const handlePaymentSelection = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    console.log(selectedPaymentMethod)
    closeModal();
  };

  const numberOfMessages = 30;

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch('https://jobs4lifeserver-1648d8d4bba0.herokuapp.com/posts/fetch', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'CustomAppcheck': 'DonaldRSA04?',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setJobs(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const handleFeedPress = () => {
    navigation.navigate('Sell');
  };
  const handleLovePress = () => {
    navigation.navigate('Love');
  };
  const handleChatPress = () => {
    navigation.navigate('users');
  };

  const handleSearch = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      setColor(randomColor);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: windowWidth * 0.05, fontWeight: 'bold', color: color, paddingTop: windowWidth * 0.05 }}> 🇿🇦 ULMarket</Text>
      </View>
      <Text style={styles.label}>Search here...</Text>
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
        style={styles.jobPostsContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0000FF']}
          />
        }
      >
        {jobs.slice().reverse().map((job, index) => (
          <Suspense
            key={index}
            fallback={
              <View style={styles.loading}>
                <Text>Loading...</Text>
              </View>
            }
          >
            <LazyJobPostCard job={job} loading={loading} openModal={() => openModal(job.price)} />

          </Suspense>

        ))}
      </ScrollView>
      <StatusBar style="auto" />

      <Modal visible={loading} message="Please wait..." />

      <TouchableOpacity style={styles.chatIconContainer} onPress={handleChatPress}>
        <Ionicons name="chatbubble-ellipses-outline" size={34} color="black" />
        {numberOfMessages > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{numberOfMessages}</Text>
          </View>
        )}
      </TouchableOpacity>
      <PaymentModal
        visible={modalVisible}
        closeModal={closeModal}
        onSelectPayment={handlePaymentSelection}
        price={selectedJobAmountRef.current}
      />
     

      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={handleHomePress}>
          <Ionicons name="home-outline" size={24} color="black" />
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleFeedPress}>
          <MaterialIcons name="sell" size={24} color="black" />
          <Text>Sell</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleLovePress}>
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
});
