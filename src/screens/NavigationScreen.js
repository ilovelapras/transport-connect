import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const isWeb = Platform.OS === 'web';

const NavigationScreen = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [arrowDirection, setArrowDirection] = useState('⬆️');
  const [directionInterval, setDirectionInterval] = useState(null);
  const navStartTimeRef = useRef(null);

  const routes = [
    { id: 1, name: 'Macpherson MRT', description: 'Alternative route for Circle Line → Downtown Line' },
    { id: 2, name: 'Raffles Place MRT', description: 'Route to Exit B for shuttlebus' },
    { id: 3, name: 'Outram Park MRT', description: 'Alternative route for East West Line → North East Line' },
    { id: 4, name: 'Chinatown MRT', description: 'Route to Exit C for shuttlebus' },
  ];

  const startARNavigation = async () => {
    console.log("Attempting to start AR..."); // Check your terminal for this!
    console.log("Current permission status:", permission); // Debug permission status

    try {
      if (isWeb) {
        navStartTimeRef.current = Date.now();
        setIsNavigating(true);
        setRandomDirection();
        startDirectionInterval();
        return;
      }

      // If permissions haven't been asked for yet
      if (!permission || permission.status === 'undetermined') {
        console.log("Requesting camera permission...");
        const result = await requestPermission();
        console.log("Permission result:", result);
        if (result.granted) {
          console.log("Permission granted, starting navigation");
          setIsNavigating(true);
          // Set initial random direction
          setRandomDirection();
          // Start changing direction every 3 seconds
          startDirectionInterval();
          // Record navigation start time
          navStartTimeRef.current = Date.now();
        } else {
          console.log("Permission denied");
          Alert.alert(
            "Permission Required",
            "Please enable camera access in your phone settings to use AR navigation."
          );
        }
      }
      // If permission was already denied
      else if (!permission.granted) {
        console.log("Permission already denied");
        Alert.alert(
          "Permission Required",
          "Please enable camera access in your phone settings to use AR navigation."
        );
      }
      // If everything is good
      else {
        console.log("Permission already granted, starting navigation");
        setIsNavigating(true);
        // Set initial random direction
        setRandomDirection();
        // Start changing direction every 3 seconds
        startDirectionInterval();
        // Record navigation start time
        navStartTimeRef.current = Date.now();
      }
    } catch (error) {
      console.error("Camera Error:", error);
      Alert.alert("Error", "Failed to access camera: " + error.message);
    }
  };

  const selectRoute = (route) => {
    console.log('Button pressed for route:', route.name); // Debug log
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

  // Helper function to set a random direction based on navigation time
  const setRandomDirection = () => {
    const navStartTime = navStartTimeRef.current;
    const now = Date.now();
    const elapsedSeconds = navStartTime ? (now - navStartTime) / 1000 : 0;

    let directions;
    // First 10 seconds: only left/right arrows
    if (elapsedSeconds < 10) {
      directions = ['⬆️'];
      console.log('Phase 1 (0-10s): showing left/right only');
    }
    // After 10 seconds: all directions including straight
    else {
      directions = ['⬅️'];
      console.log('Phase 2 (10s+): showing all directions');
    }

    const randomIndex = Math.floor(Math.random() * directions.length);
    setArrowDirection(directions[randomIndex]);
    console.log('Arrow direction changed to:', arrowDirection, '(elapsed:', elapsedSeconds.toFixed(1), 's)');
  };

  // Start the interval to change direction every 3 seconds
  const startDirectionInterval = () => {
    // Clear any existing interval
    if (directionInterval !== null) {
      clearInterval(directionInterval);
    }

    // Set new interval to change direction every 3 seconds
    const intervalId = setInterval(() => {
      setRandomDirection();
    }, 3000); // 3000 milliseconds = 3 seconds

    setDirectionInterval(intervalId);
    console.log('Started direction change interval (every 3 seconds)');
  };

  // Stop the interval when navigating stops
  const stopDirectionInterval = () => {
    if (directionInterval !== null) {
      clearInterval(directionInterval);
      setDirectionInterval(null);
      console.log('Stopped direction change interval');
    }
  };

  // Clean up interval when component unmounts or navigation stops
  useEffect(() => {
    return () => {
      stopDirectionInterval();
    };
  }, [stopDirectionInterval]);

  const arOverlay = (
    <View style={styles.arOverlay}>
      <View style={styles.arHeader}>
        <Text style={styles.arDestination}>📍 {selectedRoute?.name}</Text>
        <TouchableOpacity style={styles.stopButton} onPress={() => {
          setIsNavigating(false);
          stopDirectionInterval();
        }}>
          <Text style={styles.stopButtonText}>Exit AR</Text>
        </TouchableOpacity>
      </View>
      {isWeb ? (
        <Text style={styles.webArBanner}>Browser preview — directions only (no camera)</Text>
      ) : null}
      <View style={styles.arrowContainer}>
        <Text style={styles.arArrow}>{arrowDirection}</Text>
        <Text style={styles.arInstruction}>Follow the arrows on floor</Text>
      </View>
    </View>
  );

  // Screen 1: The AR Camera (native) or simulated path (web)
  if (isNavigating && (permission?.granted || isWeb)) {
    return (
      <View style={styles.cameraContainer}>
        {isWeb ? (
          <View style={[styles.camera, styles.webArBackdrop]}>{arOverlay}</View>
        ) : (
          <CameraView style={styles.camera} facing="back">
            {arOverlay}
          </CameraView>
        )}
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
  arInstruction: { color: 'white', fontSize: 18, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 10 },
  webArBackdrop: {
    backgroundColor: '#16213e',
  },
  webArBanner: {
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginBottom: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
});

export default NavigationScreen;