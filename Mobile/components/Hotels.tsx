import React from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';

const FlightApp = () => {
  const upcomingFlights = [
    { id: '1', from: 'Paris', to: 'TUN', date: '20 November 2024', price: '€12.09', class: 'Economy', booking: 'Direct' },
    { id: '2', from: 'Paris', to: 'PR', date: '27 November 2024', price: '€12.09', class: 'Medium', booking: 'Escape to Germany' },
  ];

  const lessExpensiveFlights = [
    { id: '3', from: 'Paris', to: 'TUN', date: '27 November 2024', price: '€12.09', class: 'Economy', booking: 'Escape to Meknès' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput style={styles.input} placeholder="Flights to:" />
        <TextInput style={styles.input} placeholder="Departure: dd/mm/yyyy" />
        <TextInput style={styles.input} placeholder="To: dd/mm/yyyy" />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming flights for: 23 November 2024</Text>
        <FlatList
          data={upcomingFlights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.flightCard}>
              <Text style={styles.flightInfo}>{item.from} - {item.to}</Text>
              <Text style={styles.flightInfo}>{item.date}</Text>
              <Text style={styles.flightInfo}>{item.price}, {item.class}, {item.booking}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Less expensive flights for:</Text>
        <FlatList
          data={lessExpensiveFlights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.flightCard}>
              <Text style={styles.flightInfo}>{item.from} - {item.to}</Text>
              <Text style={styles.flightInfo}>{item.date}</Text>
              <Text style={styles.flightInfo}>{item.price}, {item.class}, {item.booking}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  flightCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  flightInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default FlightApp;