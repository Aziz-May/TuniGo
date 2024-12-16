import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface DestinationCardProps {
  image: any;
  title: string;
  location: string;
  rating: number;
}

export default function DestinationCard({ image, title, location, rating }: DestinationCardProps) {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.cardImage} /> 
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardLocation}>{location}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.rating}>{rating}</Text>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>view</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginRight: 16,
    width: 200,
    overflow: 'hidden',
   
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#336749',
    padding: 8,
  },
  cardLocation: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  rating: {
    marginLeft: 4,
  },
  viewButton: {
    backgroundColor: '#336749',
    padding: 8,
    borderRadius: 4,
    margin: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: 'white',
  },
});