import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { getIconName, getBottomIconName } from '../constants/icons';
import { Ionicons } from '@expo/vector-icons';


import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; // adjust path as needed
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestore } from '@/firebase';
import { Destination } from './Destinations';
type favouritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favourites'>;

interface ProfileData {
  name: string;
  email: string;
  dateOfBirth: string;
  country: string;
  region: string;
  points: number;
  level: string;
  favouritesIds:string[];
}



const Favourites = () => {
    const navigation = useNavigation<favouritesScreenNavigationProp>();
    const db = getFirestore();
    const auth = getAuth();
    const [favouriteDestinations, setFavouriteDestinations] = useState<Destination[]>([]);
    const [profileData, setProfileData] = useState<ProfileData>({
      name: '',
      email: '',
      dateOfBirth: '',
      country: '',
      region: '',
      points: 0,
      level: '',
      favouritesIds:[],
    });


    const fetchFavorites = async () => {
      const user = getAuth().currentUser;
      if (user) {
        // Requête Firestore pour récupérer l'utilisateur par UID
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        try {
          const querySnapshot = await getDocs(q);
          
  
          if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0]; // On suppose qu'il n'y a qu'un seul document
            const data = docSnap.data();
            const favouritesIds = data?.favourites || []; 
            
            setProfileData({
              name: data?.name || '',
              email: data?.email || '',
              dateOfBirth: data?.dateOfBirth || '',
              country: data?.country || '',
              region: data?.region || '',
              points: data?.points || 0,
              level: data?.level || '',
              favouritesIds,
            });
            
            
            
            
  
            // On va récupérer toutes les destinations en fonction des IDs dans favourites
            const fetchedDestinations: Destination[] = []; // Initialisation d'un tableau pour les destinations
  
            // Pour chaque ID de destination, on va chercher la destination correspondante
            for (const id of favouritesIds) {
              if (id) { // S'assurer que l'ID est valide
                const destinationRef = doc(firestore, 'destinations', id);
                const destinationSnap = await getDoc(destinationRef);
    
                if (destinationSnap.exists()) {
                  console.log(destinationSnap.data());
                  const destinationData = destinationSnap.data() as Destination;
                  fetchedDestinations.push(destinationData);
                }
              }
            }
    
            // Mettre à jour l'état avec les destinations récupérées
            setFavouriteDestinations(fetchedDestinations);
          } else {
            console.log('Aucun utilisateur trouvé');
            Alert.alert('Aucun utilisateur trouvé, veuillez vérifier si l\'utilisateur est bien enregistré.');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur :', error);
          Alert.alert('Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.');
        }
      }
    };


    useEffect(() => {
      fetchFavorites();
    }, []);




    

  {/*const [favouritePlaces, setFavouritePlaces] = useState([
    {
      id: '1',
      name: 'Tabarka ',
      state: 'Jendouba',
      image: require('../assets/tabarka.png'),
      rating: '4.5',
    },
    {
      id: '2',
      name: 'eljem',
      state: 'Mahdia',
      image: require('../assets/eljem.png'),
      rating: '5.0',
    },
    {
      id: '3',
      name: 'Douz ',
      state: 'Kebili',
      image: require('../assets/sahara-tour.png'),
      rating: '4.7',
    },
  ]);
*/}
  const handlePlaceAction = (id: string, action: string) => {
    if (action === 'remove') {
      Alert.alert(
        'Remove from Favourites',
        'Are you sure you want to remove this place from your favourites?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async() => {
              const user = getAuth().currentUser;
              if (user) {
                try {
                  // Requête Firestore pour récupérer l'utilisateur par UID
                  const q = query(collection(firestore, 'users'), where('uid', '==', user.uid));
                  const querySnapshot = await getDocs(q);
  
                  if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0]; // Récupère le premier document de l'utilisateur
                    const userDocRef = doc(firestore, 'users', docSnap.id); // Référence du document utilisateur
                    const data = docSnap.data(); // Récupère les données du document
                    //console.log(data);

                    console.log('Hi there');
  
                    if (data && data.favourites) {
                      // Filtrer les favoris pour supprimer le lieu en fonction de son nom
                      const updatedFavourites = data.favourites.filter((fav: string) => fav !== id);
  
                      // Affichage des nouveaux favoris après suppression
                     
                      // console.log('Updated Favourites:', updatedFavourites);
  
                      // Mise à jour du champ "favourites" dans Firestore uniquement si la liste a changé
                      if (updatedFavourites.length !== data.favourites.length) {
                        console.log("GHHHHHHHHHHHHHHHHHHH");
                        await updateDoc(userDocRef, {
                          favourites: updatedFavourites,
                        });
                      }
  
                      // Mise à jour de l'état local après modification de Firestore
                      setFavouriteDestinations((prev) =>
                        prev.filter((place) => place.name !== id) // Filtrer par le nom du lieu
                      );
  
                      // Optionnel : Confirmer la suppression via un message à l'utilisateur
                      Alert.alert('Success', 'The place has been removed from your favourites.');
                    } else {
                      console.error('No favourites found in user data');
                    }
                  } else {
                    console.error('User document not found in Firestore');
                    Alert.alert('Error', 'User document not found.');
                  }
                } catch (error) {
                  console.error('Error removing destination from favourites:', error);
                  Alert.alert('Error removing destination. Please try again later.');
                }
              }
            },
          },
        ]
      );
    } else if (action === 'visit') {
      Alert.alert('Visit Place', `You will now be directed to ${id}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favourites</Text>
      </View>

      <FlatList
        data={favouriteDestinations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.placeContainer}>
             <Image source={{ uri: item.image_url }} style={styles.placeImage} />
            <View style={styles.placeInfo}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeState}>{item.state}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.ratingStar}>★</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.threeDots}
              onPress={() => {
                Alert.alert('Options', '', [
                  {
                    text: 'Remove from Favourites',
                    onPress: () => handlePlaceAction(item.id, 'remove'),
                  },
                  {
                    text: 'Visit',
                    onPress: () => handlePlaceAction(item.id, 'visit'),
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ]);
              }}
            >
              <Text style={styles.threeDotsText}>⋮</Text>
            </TouchableOpacity>
          </View>
        )}
      />
       
      
    </View>
  );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
      },
      bottomNavItem: {
        alignItems: 'center',
      },
      bottomNavText: {
        marginTop: 4,
        fontSize: 12,
        color: '#666',
      },
      activeNavText: {
        color: '#336749',
      },
    navIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
      },
      navItem: {
        alignItems: 'center',
      },
      navText: {
        marginTop: 4,
        fontSize: 12,
        color: '#666',
      },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    backgroundColor: '#336749',
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10, // Reduced padding for minimal space
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    height: 110, // Slightly increased height
  },
  placeImage: {
    width: 90, // Square size
    height: 90,
    borderRadius: 10, // Optional rounded corners
    marginRight: 10,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeState: {
    fontSize: 14,
    color: '#888',
    opacity: 0.8, // Reduced opacity for the state text
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingStar: {
    fontSize: 16,
    color: '#FFD700',
    marginLeft: 4,
  },
  threeDots: {
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 20,
  },
  threeDotsText: {
    fontSize: 18,
    color: '#333',
  },
});

export default Favourites;
