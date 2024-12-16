import React, { useState, useEffect} from 'react';
import { StyleSheet, ScrollView, Image, Text, View, Dimensions,TextInput, 
  TouchableOpacity, 
  FlatList, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
//import YoutubePlayer from 'react-native-youtube-iframe';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { Destination } from '../components/Destinations';
import DestinationReview  from './DestinationReview'; // Import the DestinationReview component
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, arrayUnion, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase';


type ArticlePageRouteProp = RouteProp<RootStackParamList, 'ArticlePage'>;
type ArticlePageProps = {
  route: ArticlePageRouteProp;
};

const ArticlePage = ({ route }: ArticlePageProps) => {
  const { place } = route.params;
  const auth = getAuth();
  const db = getFirestore();
  const [isFavorited, setIsFavorited] = useState(false);

  const checkIfFavorited = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favouriteDestinations = userData?.favourites || [];
        setIsFavorited(favouriteDestinations.includes(place.id));
      }
    }
  };


  useEffect(() => {
    checkIfFavorited();
  }, []);


  const handleAddToFavorites = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(collection(firestore, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const docSnap = querySnapshot.docs[0];

        const userDocRef = doc(db, 'users', docSnap.id); // Utilisez votre collection d'utilisateurs
        
        await updateDoc(userDocRef, {
          favourites: arrayUnion(place.id)  // Ajouter l'ID de l'article aux favoris
        });
        setIsFavorited(true);
        Alert.alert('Success', `${place.name} has been added to your favorites!`);
      } catch (error) {
        Alert.alert('Error', 'An error occurred while adding to favorites.');
      }
    } else {
      Alert.alert('Error', 'You must be logged in to add to favorites.');
    }
  };

  return(
    <ScrollView style={styles.container}>
      <Image source={{ uri: place.image_url}} style={styles.heroImage} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{place.name}</Text>
          <View style={styles.rating}>
            <Feather name="star" size={24} color="#FFD700" />
            <Text style={styles.ratingText}>{place.rating}</Text>
          </View>
        </View>
        

        

        <View style={styles.attractionsContainer}>
          {place.attractions.map((attraction, index) => (
            <View key={index} style={styles.attractionPill}>
              <Text style={styles.attractionText}>{attraction}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.addButton, isFavorited && styles.favoritedButton]}
          onPress={handleAddToFavorites}
        >
        <Text style={styles.addButtonText}>
            {isFavorited ? 'Added to Favorites' : 'Add to Favorites'}
          </Text>

        </TouchableOpacity>
        
        <Text style={styles.description}>{place.phrase}</Text>
      
        
    
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Feather name="map-pin" size={24} color="#007A8C" />
            <Text style={styles.infoText}>{place.location}</Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="clock" size={24} color="#007A8C" />
            <Text style={styles.infoText}>{place.opening_hours}</Text>
          </View>
          </View>
          <Text style={styles.description}>{place.description}</Text>
       
          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
          <Text style={styles.reviewsSectionTitle}>Reviews</Text>
          
          <DestinationReview destinationId={place.id} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroImage: {
    width: '100%',
    height: 400,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007A8C',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 20,
    color: '#007A8C',
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 16,
  },
  videoContainer: {
    marginVertical: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 18,
    color: '#007A8C',
    
  },
  reviewsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  reviewsSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007A8C',
    marginBottom: 15,
  },
  reviewInputContainer: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  reviewInput: {
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  submitReviewButton: {
    backgroundColor: '#007A8C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitReviewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reviewsList: {
    marginTop: 15,
  },
  reviewItem: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  attractionText: {
    color: '#336749',
    fontSize: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007A8C',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
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
  reviewDate: {
    fontSize: 14,
    color: '#888',
    alignSelf: 'flex-end',
  },
  addButton: {
    backgroundColor: '#007A8C',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    width:130,
    marginBottom:20,
    position:'relative',
    left:160,
  },
  favoritedButton: {
    backgroundColor: '#4CAF50', // Changer la couleur si ajouté aux favoris
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
},
}
);


export default ArticlePage;