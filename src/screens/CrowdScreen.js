import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CrowdScreen = () => {
  const [startStation, setStartStation] = useState('City Hall');
  const [endStation, setEndStation] = useState('Marina Bay Sands');
  const [isTraveling, setIsTraveling] = useState(false);

  const stations = [
    'City Hall', 'Marina Bay Sands', 'Raffles Place', 'Orchard Road',
    'Tanjong Pagar', 'Sentosa', 'Bugis', 'Chinatown', 'Dhoby Ghaut',
    'Somerset', 'Nichols Road', 'Botanic Gardens', 'Novena',
    'Toa Payoh', 'Braddell', 'Bishan', 'Ang Mo Kio', 'Yio Chu Kang',
    'Khatib', 'Yishun'
  ];

  const handleDeclareTravel = () => {
    if (startStation !== endStation) {
      setIsTraveling(true);
      Alert.alert(
        'Travel Intent Declared',
        `You are traveling from ${startStation} to ${endStation}`,
        [{ text: 'Cancel Travel', onPress: () => setIsTraveling(false) }]
      );
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
        </>
      ) : (
        <View style={styles.travelingBox}>
          <Text style={styles.travelingTitle}>Currently Traveling:</Text>
          <Text style={styles.travelingRoute}>{startStation} → {endStation}</Text>
          <Button title="Cancel" onPress={() => setIsTraveling(false)} color="#999" />
        </View>
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
});

export default CrowdScreen;