import React, { useState , useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from '../Modal/Modal'; 

const jobs = [
    {
      title: "Job Title 1",
      description: "Job Description 1",
      requirements: "Job Requirements 1",
      address: "Job Address 1",
      salary: "$1000",
    },
    {
      title: "Job Title 2",
      description: "Job Description 2",
      requirements: "Job Requirements 2",
      address: "Job Address 2",
      salary: "$1500",
    },
    {
      title: "Job Title 2",
      description: "Job Description 2",
      requirements: "Job Requirements 2",
      address: "Job Address 2",
      salary: "$1500",
    },
    {
      title: "Job Title 2",
      description: "Job Description 2",
      requirements: "Job Requirements 2",
      address: "Job Address 2",
      salary: "$1500",
    },
    {
      title: "Job Title 2",
      description: "Job Description 2",
      requirements: "Job Requirements 2",
      address: "Job Address 2",
      salary: "$1500",
    },
    {
      title: "Job Title 2",
      description: "Job Description 2",
      requirements: "Job Requirements 2",
      address: "Job Address 2",
      salary: "$1500",
    },
    {
      title: "Job Title 2",
      description: "Job Description 2",
      requirements: "Job Requirements 2",
      address: "Job Address 2",
      salary: "$1500",
    },
    {
      title: "Job Title 2",
      description: "Job Description 2",
      requirements: "Job Requirements 2",
      address: "Job Address 2",
      salary: "$1500",
    },
    {
      title: "Job Title 2",
      description: "Job Description 2",
      requirements: "Job Requirements 2",
      address: "Job Address 2",
      salary: "$1500",
    },
    {
      title: "Job Title 2",
      description: "Job Description 2",
      requirements: "Job Requirements 2",
      address: "Job Address 2",
      salary: "$1500",
    },
    
  ];

const JobPostCard = ({ job }) => {
    return (
      <View style={styles.jobCard}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.jobText}>{job.description}</Text>
        <Text style={styles.jobText}>{job.requirements}</Text>
        <Text style={styles.jobText}>{job.address}</Text>
        <Text style={styles.jobText}>{job.salary}</Text>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
export default function Home() {
    const [selectedProvince, setSelectedProvince] = useState('Limpopo');
    const [color, setColor] = useState('blue');
    const windowWidth = useWindowDimensions().width;

    const [loading, setLoading] = useState(false);

    const handleFetchJobs = () => {
        setLoading(true);
       
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };
  
    useEffect(() => {
        const intervalId = setInterval(() => {
          const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
          setColor(randomColor);
        }, 1000); 
    
        return () => clearInterval(intervalId);
    }, []); 
  
    return (
        
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontSize: windowWidth * 0.05, fontWeight: 'bold', color: color , paddingTop:windowWidth*0.05 }}> 🇿🇦 Jobs4life</Text>
        </View>
        <Text style={styles.label}>Search for Jobs in...</Text>
        <View style={styles.dropdownContainer}>
          <Picker
        
            selectedValue={selectedProvince}
            onValueChange={(itemValue) => {
                setSelectedProvince(itemValue);
                handleFetchJobs(); 
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
        <ScrollView style={styles.jobPostsContainer}>
          {jobs.map((job, index) => (
            <JobPostCard key={index} job={job} />
          ))}
        </ScrollView>
        <StatusBar style="auto" />
        <Modal visible={loading} message={`Fetching Jobs from ${selectedProvince}
                  please wait..`} />

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
    appName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'blue', 
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
        paddingTop:30,
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
});
