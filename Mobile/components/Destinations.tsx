import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; 
import { db } from '../firebase.js'; // Adjust path as needed
import { collection, getDocs } from 'firebase/firestore';

// Define navigation type
type DestinationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Destinations'>;
export interface Review {
  user: string;       // User who wrote the review
  comment: string;    // Review text
  stars: number;      // Rating in stars
  date: string;       // Date of the review (ISO string)
}
// Destination data type
export interface Destination {
  id: string; // Firestore document ID
  name: string;
  image_url: string; // URL of the image from Firestore
  location: string;
  description: string;
  rating: number;
  attractions: string[];
  bestTimeToVisit: string;
  phrase:string;
  opening_hours:string;
  reviews: Review[];

}

const Destinations: React.FC = () => {
  const navigation = useNavigation<DestinationsScreenNavigationProp>();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'destinations'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Destination[];
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Handle card press
  const handleViewPress = (place: Destination) => {
    navigation.navigate('ArticlePage', { place });
  };

  // Render each destination card
  const renderDestinationCard = (destination: Destination) => (
    <TouchableOpacity 
      key={destination.id} 
      style={styles.destinationCard}
      onPress={() => handleViewPress(destination)}
    >
      <Image source={{ uri: destination.image_url }} style={styles.destinationImage} />
      <View style={styles.destinationCardOverlay}>
        <View style={styles.destinationCardHeader}>
          <View>
            <Text style={styles.destinationName}>{destination.name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color="white" />
              <Text style={styles.locationText}>{destination.location}</Text>
            </View>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>{destination.rating}</Text>
          </View>
        </View>
        <Text style={styles.destinationDescription} numberOfLines={2}>
          {destination.phrase}
        </Text>
        <View style={styles.attractionsContainer}>
          {destination.attractions.map((attraction, index) => (
            <View key={index} style={styles.attractionPill}>
              <Text style={styles.attractionText}>{attraction}</Text>
            </View>
          ))}
        </View>
        <View style={styles.bestTimeContainer}>
          <Ionicons name="calendar" size={16} color="#336749" />
          <Text style={styles.bestTimeText}>Best Time: {destination.bestTimeToVisit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render loading spinner or destination list
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Destinations</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <Text style={styles.searchPlaceholder}>Search destinations...</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#336749" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView 
          style={styles.destinationsContainer}
          showsVerticalScrollIndicator={false}
        >
          {destinations.map(renderDestinationCard)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#336749',
  },
  headerPlaceholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: '#666',
  },
  destinationsContainer: {
    paddingHorizontal: 16,
  },
  destinationCard: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationImage: {
    width: '100%',
    height: 200,
  },
  destinationCardOverlay: {
    padding: 16,
  },
  destinationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    marginLeft: 4,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    color: '#666',
  },
  destinationDescription: {
    color: '#666',
    marginBottom: 12,
  },
  attractionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  attractionPill: {
    backgroundColor: '#E6F2EC',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
  },
  attractionText: {
    color: '#336749',
    fontSize: 12,
  },
  bestTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestTimeText: {
    marginLeft: 8,
    color: '#336749',
    fontSize: 14,
  },
});
export default Destinations;