import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HotelCardProps {
  image: any;
  name: string;
  location: string;
  rating: string;
  price: string;
}

const HotelCard = ({ image, name, location, rating, price }: HotelCardProps) => {
  return (
    <View style={styles.hotelCard}>
      <Image source={image} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{name}</Text>
        <Text style={styles.hotelLocation}>{location}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#ffc107" />
          <Text style={styles.rating}>{rating}</Text>
        </View>
        <Text style={styles.price}>{price}</Text>
      </View>
    </View>
  );
};

interface GuideCardProps {
  image: any;
  name: string;
  location: string;
  rating: string;
  tours: string;
}

const GuideCard = ({ image, name, location, rating, tours }: GuideCardProps) => {
  return (
    <View style={styles.guideCard}>
      <Image source={image} style={styles.guideImage} />
      <View style={styles.guideInfo}>
        <Text style={styles.guideName}>{name}</Text>
        <Text style={styles.guideLocation}>{location}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#ffc107" />
          <Text style={styles.rating}>{rating}</Text>
        </View>
        <Text style={styles.tours}>{tours} tours</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hotelCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hotelImage: {
    width: '100%',
    height: 120,
  },
  hotelInfo: {
    padding: 12,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  guideCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  guideImage: {
    width: '100%',
    height: 120,
  },
  guideInfo: {
    padding: 12,
  },
  guideName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  guideLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tours: {
    fontSize: 14,
    color: '#666',
  },
});

export { HotelCard, GuideCard };