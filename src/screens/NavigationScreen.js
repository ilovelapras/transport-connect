import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const NavigationScreen = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const routes = [
    { id: 1, name: 'Macpherson MRT', description: 'Alternative route for Circle Line → Downtown Line' },
    { id: 2, name: 'Raffles Place MRT', description: 'Route to Exit B for shuttlebus' },
    { id: 3, name: 'Outram Park MRT', description: 'Alternative route for East West Line → North East Line' },
    { id: 4, name: 'Chinatown MRT', description: 'Route to Exit C for shuttlebus' },
  ];

  const startARNavigation = async () => {
    console.log("Attempting to start AR..."); // Check your terminal for this!

    try {
      // If permissions haven't been asked for yet
      if (!permission || permission.status === 'undetermined') {
        const result = await requestPermission();
        if (result.granted) {
          setIsNavigating(true);
        }
      }
      // If permission was already denied
      else if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please enable camera access in your phone settings to use AR navigation."
        );
      }
      // If everything is good
      else {
        setIsNavigating(true);
      }
    } catch (error) {
      console.error("Camera Error:", error);
    }
  };

  const selectRoute = (route) => {
    setSelectedRoute(route);
    Alert.alert(
      'Route Selected',
      `Target: ${route.name}\n\nReady to start AR guidance?`,
      [
        { text: 'Not Now', style: 'cancel' },
        { text: 'Start AR', onPress: () => startARNavigation() }
      ]
    );
  };

  // Screen 1: The AR Camera
  if (isNavigating && permission?.granted) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back">
          <View style={styles.arOverlay}>
            <View style={styles.arHeader}>
              <Text style={styles.arDestination}>📍 {selectedRoute?.name}</Text>
              <TouchableOpacity style={styles.stopButton} onPress={() => setIsNavigating(false)}>
                <Text style={styles.stopButtonText}>Exit AR</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arArrow}>⬆️</Text>
              <Text style={styles.arInstruction}>Follow the arrows on floor</Text>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // Screen 2: The List (Main Screen)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Pathfinding</Text>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.routeCard}>
            <Text style={styles.routeName}>{item.name}</Text>
            <Text style={styles.routeDesc}>{item.description}</Text>
            <Button title="Select Route" onPress={() => selectRoute(item)} color="#e63946" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333', marginTop: 10 },
  routeCard: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  routeName: { fontSize: 18, fontWeight: 'bold', color: '#e63946' },
  routeDesc: { fontSize: 14, color: '#666', marginVertical: 8 },
  cameraContainer: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  arOverlay: { flex: 1, justifyContent: 'space-between', padding: 20 },
  arHeader: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginTop: 40, alignItems: 'center' },
  arDestination: { fontSize: 16, fontWeight: 'bold' },
  stopButton: { marginTop: 10, backgroundColor: '#333', padding: 10, borderRadius: 5 },
  stopButtonText: { color: 'white', fontWeight: 'bold' },
  arrowContainer: { alignItems: 'center', marginBottom: 60 },
  arArrow: { fontSize: 100 },
  arInstruction: { color: 'white', fontSize: 18, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 10 }
});

export default NavigationScreen;