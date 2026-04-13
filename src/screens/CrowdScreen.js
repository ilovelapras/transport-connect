import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CrowdScreen = () => {
  const [startStation, setStartStation] = useState('City Hall');
  const [endStation, setEndStation] = useState('Marina Bay Sands');
  const [isTraveling, setIsTraveling] = useState(false);
  const [isLooking, setIsLooking] = useState(false);
  const [crowdTravels, setCrowdTravels] = useState([
    { from: 'City Hall', to: 'Marina Bay Sands', time: '2 min ago' },
    { from: 'Raffles Place', to: 'Orchard Road', time: '5 min ago' },
    { from: 'Bugis', to: 'Chinatown', time: '8 min ago' },
    { from: 'Tanjong Pagar', to: 'Sentosa', time: '12 min ago' },
    { from: 'Somerset', to: 'Botanic Gardens', time: '15 min ago' },
  ]);

  const stations = [
    'City Hall', 'Marina Bay Sands', 'Raffles Place', 'Orchard Road',
    'Tanjong Pagar', 'Sentosa', 'Bugis', 'Chinatown', 'Dhoby Ghaut',
    'Somerset', 'Nichols Road', 'Botanic Gardens', 'Novena',
    'Toa Payoh', 'Braddell', 'Bishan', 'Ang Mo Kio', 'Yio Chu Kang',
    'Khatib', 'Yishun'
  ];

  const handleDeclareTravel = () => {
    if (startStation !== endStation) {
      setIsLooking(true);
    } else {
      Alert.alert('Error', 'Start and end stations must be different.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crowd Sourcing Travel</Text>
      <Text style={styles.subtitle}>Declare your travel to help others</Text>

      {!isTraveling ? (
        <>
          <Text style={styles.label}>Starting Station:</Text>
          <Picker
            style={styles.picker}
            selectedValue={startStation}
            onValueChange={(itemValue) => setStartStation(itemValue)}
          >
            {stations.map(station => (
              <Picker.Item key={station} label={station} value={station} />
            ))}
          </Picker>

          <Text style={styles.label}>Destination Station:</Text>
          <Picker
            style={styles.picker}
            selectedValue={endStation}
            onValueChange={(itemValue) => setEndStation(itemValue)}
          >
            {stations.map(station => (
              <Picker.Item key={station} label={station} value={station} />
            ))}
          </Picker>

          <Button
            title="Declare Travel Intent"
            onPress={handleDeclareTravel}
            color="#e63946"
            disabled={startStation === endStation}
          />

          {/* Crowd Travels List */}
          <View style={styles.crowdTravelsSection}>
            <Text style={styles.crowdTravelsTitle}>Recent Travel Intentions:</Text>
            <View style={styles.crowdTravelsList}>
              {crowdTravels.map((travel, index) => (
                <View key={index} style={styles.crowdTravelItem}>
                  <Text style={styles.crowdTravelFrom}>{travel.from}</Text>
                  <Text style={styles.crowdTravelArrow}>→</Text>
                  <Text style={styles.crowdTravelTo}>{travel.to}</Text>
                  <Text style={styles.crowdTravelTime}>{travel.time}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <>
          {isLooking ? (
            <View style={styles.lookingContainer}>
              <Text style={styles.membersFound}>0 members found</Text>
              <View style={styles.lookingContent}>
                <Text style={styles.lookingTitle}>Currently Looking...</Text>
                <View style={styles.loadingWrapper}>
                  <ActivityIndicator size="large" color="#e63946" />
                </View>
              </View>
              <View style={styles.cancelButtonContainer}>
                <Button title="Cancel" onPress={() => setIsLooking(false)} color="#999" />
              </View>
            </View>
          ) : (
            <View style={styles.travelingBox}>
              <Text style={styles.travelingTitle}>Currently Traveling:</Text>
              <Text style={styles.travelingRoute}>{startStation} → {endStation}</Text>
              <Button title="Cancel" onPress={() => setIsTraveling(false)} color="#999" />
            </View>
          )}
        </>
      )}
    </View>
  );
};

// FIX: Added the missing StyleSheet which was causing the crash
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    backgroundColor: 'white',
    marginBottom: 15,
  },
  travelingBox: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#90caf9',
  },
  travelingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 10,
  },
  travelingRoute: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  // New styles for crowd travels section
  crowdTravelsSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  crowdTravelsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  crowdTravelsList: {
    gap: 10,
  },
  crowdTravelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  crowdTravelFrom: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e63946',
  },
  crowdTravelArrow: {
    fontSize: 16,
    marginHorizontal: 8,
    color: '#666',
  },
  crowdTravelTo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  crowdTravelTime: {
    fontSize: 14,
    color: '#999',
    marginLeft: 'auto',
  },
  // New styles for looking screen
  lookingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lookingContent: {
    alignItems: 'center',
  },
  lookingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingWrapper: {
    marginBottom: 20,
  },
  membersFound: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  cancelButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default CrowdScreen;