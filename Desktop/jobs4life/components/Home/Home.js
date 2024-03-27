import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList, StyleSheet, Text, View, TouchableOpacity, useWindowDimensions, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from '../Modal/Modal';

const API_ENDPOINT = 'https://jobs4lifeserver-1648d8d4bba0.herokuapp.com/posts/jobs';

const JobPostCard = ({ job }) => {
  return (
    <View style={styles.jobCard}>
      <Text style={styles.jobTitle}>{job.title}</Text>
      <Text style={styles.jobTitle}>Description</Text>
      <Text style={styles.jobText}>{job.description}</Text>
      <Image source={{ uri: job.imageLink }} style={styles.jobImage} />
      <Text style={styles.jobTitle}>Requirements</Text>
      <Text style={styles.jobText}>{job.requirements}</Text>
      <Text style={styles.jobTitle}>Address</Text>
      <Text style={styles.jobText}>{job.address}</Text>
      <Text style={styles.jobTitle}>Salary</Text>
      <Text style={styles.jobText}>R{job.salary}</Text>
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function Home() {
  const [selectedProvince, setSelectedProvince] = useState('Limpopo');
  const [color, setColor] = useState('#0000FF');
  const windowWidth = useWindowDimensions().width;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
  };

  const fetchJobs = async (page = 1) => {
    setLoading(true);

    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('CustomAppCheck', 'DonaldRSA04?');

      const response = await fetch(`${API_ENDPOINT}?page=${page}&province=${selectedProvince}`, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data && data.jobs && data.jobs.length > 0) {
        if (page === 1) {
          setJobs(data.jobs);
        } else {
          setJobs(prevJobs => [...prevJobs, ...data.jobs]);
        }
        setTotalPages(data.totalPages || 4);
        setNoMorePosts(page >= data.totalPages);
      } else {
        setJobs([]);
        setTotalPages(1);
        setNoMorePosts(true);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      setColor(randomColor);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [selectedProvince, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: windowWidth * 0.05, fontWeight: 'bold', color: color, paddingTop: windowWidth * 0.08 }}> 🇿🇦 Jobs4life</Text>
      </View>

      <Text style={styles.label}>Choose province...</Text>
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedProvince}
          onValueChange={(itemValue) => {
            setSelectedProvince(itemValue);
            setCurrentPage(1);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Limpopo" value="Limpopo" />
          <Picker.Item label="Mpumalanga" value="Mpumalanga" />
          <Picker.Item label="Free State" value="Free State" />
          <Picker.Item label="Gauteng" value="Gauteng" />
          <Picker.Item label="Eastern Cape" value="Eastern Cape" />
          <Picker.Item label="KwaZulu-Natal" value="KwaZulu-Natal" />
          <Picker.Item label="Northern Cape" value="Northern Cape" />
          <Picker.Item label="North West" value="North West" />
          <Picker.Item label="Western Cape" value="Western Cape" />
        </Picker>
      </View>

      {loading ? (
        <Modal visible={true} message={`Fetching Jobs from ${selectedProvince} please wait..`} />
      ) : (
        <>
          {jobs.length > 0 ? (
            <>
              <FlatList
                style={styles.jobPostsContainer}
                data={jobs}
                renderItem={({ item }) => <JobPostCard job={item} />}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#0000FF']}
                  />
                }
                onEndReachedThreshold={0.1}
                onEndReached={handleNextPage}
              />

              {loadingMore && <ActivityIndicator style={styles.loadingMoreIndicator} size="large" color="#0000FF" />}
              {noMorePosts && (
                <View style={styles.noMorePostsContainer}>
                  <Text style={styles.noMorePostsText}>Sorry, That is all we have.</Text>
                </View>
              )}

              <View style={styles.paginationContainer}>
               
                <Text style={styles.paginationText}>Page {currentPage} of {totalPages}</Text>
              </View>
            </>
          ) : (
            <View style={styles.noJobsContainer}>
              <Text style={styles.noJobsText}>No jobs available in {selectedProvince}</Text>
            </View>
          )}
        </>
      )}

      <StatusBar style="auto" />
   
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
  },
  picker: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  label: {
    marginRight: 10,
    fontSize: 23,
    color: '#333',
    paddingTop: 33,
  },
  jobPostsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '5%',
    marginTop: '5%',
  },
  jobCard: {
    backgroundColor: '#f9f9f9',
    padding: '5%',
    marginBottom: '5%',
    borderRadius: 8,
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
  jobImage: {
    width: '100%',
    height: 200,
    marginBottom: '5%',
    borderRadius: 8,
  },
  applyButton: {
    backgroundColor: 'blue',
    padding: '3%',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: '3%',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noJobsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noJobsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  paginationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paginationText: {
    fontSize: 16,
  },
  loadingMoreIndicator: {
    marginTop: 10,
  },
  noMorePostsContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  noMorePostsText: {
    fontSize: 16,
    color: '#999',
  },
});
