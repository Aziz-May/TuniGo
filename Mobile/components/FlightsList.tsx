import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import FlightCard from './FlightCard';

interface Flight {
  id :string ,
  ArrivalAirport: string;
  DepartureAirport: string;
  DepartureDateTime: string;
  Duration: string;
  Price: string;
}

interface FlightsListProps {
  title: string;
  flights: Flight[];
}

const FlightsList: React.FC<FlightsListProps> = ({ title, flights }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={flights}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FlightCard
          id={item.id}
          DepartureDateTime={item.DepartureDateTime}
          ArrivalAirport={item.ArrivalAirport}
          DepartureAirport={item.DepartureAirport}
            Duration={item.Duration}
            Price={item.Price}
            
            
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default FlightsList;