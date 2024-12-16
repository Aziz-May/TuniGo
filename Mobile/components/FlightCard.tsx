import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface FlightCardProps {
  id: string;
  ArrivalAirport: string;
  DepartureAirport: string;
  DepartureDateTime: string;
  Duration: string;
  Price: string;
}

const FlightCard: React.FC<FlightCardProps> = ({
  id,
  ArrivalAirport,
  DepartureAirport,
  DepartureDateTime,
  Duration,
  Price,
}) => {
  const [isBooked, setIsBooked] = useState(false);
  const [message, setMessage] = useState('');

  // Handle booking/unbooking
  const handleBooking = () => {
    if (isBooked) {
      setIsBooked(false);
      setMessage('Booking canceled');
    } else {
      setIsBooked(true);
      setMessage('Booking successful!');
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: '#007C71',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          width: 70,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>
          Upcoming
        </Text>
      </View>

      {/* Booking button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#007C71',
          paddingHorizontal: 4,
          paddingVertical: 4,
          borderRadius: 12,
          width: 90,
          position: 'relative',
          left: 190,
          bottom: 25,
        }}
        onPress={handleBooking}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', textAlign: 'center'  , }}>
          {isBooked ? 'Unbook' : 'Book Now'}
        </Text>
      </TouchableOpacity>

      {/* Success message */}
      {message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      <View style={styles.timeContainer}>
        <Text style={styles.time}>{DepartureDateTime}</Text>
        <Text style={styles.duration}>{Duration}</Text>
        <Text style={styles.time}>{Price}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.flightClass}>destination: {ArrivalAirport}</Text>
        <Text style={styles.flightClass}>departure: {DepartureAirport}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    height: 180, // Increased the height to ensure space for the message
    width: 300,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    marginTop: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flightClass: {
    display: 'flex',
    fontSize: 14,
    color: '#333',
  },
  bookingId: {
    fontSize: 14,
    color: '#666',
  },
  messageContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  messageText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FlightCard;
