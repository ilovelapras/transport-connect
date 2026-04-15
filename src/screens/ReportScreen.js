import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';

const ReportScreen = () => {
  const [reportText, setReportText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (reportText.trim()) {
      setIsSubmitted(true);
    } else {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
    }
  };

  const resetForm = () => {
    setReportText('');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successText}>Thank you. Your report has been submitted! ✅</Text>
        <View style={styles.buttonWrapper}>
          <Button title="Submit Another Report" onPress={resetForm} color="#e63946" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report MRT Breakdown</Text>
      <Text style={styles.subtitle}>Help others by reporting issues</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe the breakdown or issue..."
        multiline
        numberOfLines={4}
        value={reportText}
        onChangeText={setReportText}
      />
      <Button title="Submit Report" onPress={handleSubmit} color="#e63946" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: 'white',
    minHeight: 120,
    ...Platform.select({ android: { textAlignVertical: 'top' }, default: {} }),
  },
  successContainer: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center' },
  successText: { fontSize: 20, fontWeight: 'bold', color: '#2a9d8f', textAlign: 'center', marginBottom: 30 },
  buttonWrapper: { width: '100%', paddingHorizontal: 20 }
});

export default ReportScreen;