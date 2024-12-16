import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, getDocs, query, where } from 'firebase/firestore'; // Import required Firestore functions

import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { QueryDocumentSnapshot } from 'firebase/firestore';
// Import components
import DestinationCard from './DestinationCard';
import MightlikeCard from './MightlikeCard';
import PromotionCard from './PromotionCard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestore } from '../firebase';

// Import utility functions
import { getIconName, getBottomIconName } from '../constants/icons';
import { RootStackParamList } from '../types/navigation';
import Agencies from './Agencies';
import Profile from './Profile';
import Destinations from './Destinations'
import Flight from './Flight';
import ConversationListPage from './ConversationListPage';
import Favourites from './Favourites';
interface Destination {
  id: string,
  name: string;
  location: string;
  rating: number;
  image_url: string;
}

interface ProfileData {
  name: string;
  email: string;
  dateOfBirth: string;
  country: string;
  region: string;
  points: number;
  level: string;
}




type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;














function TopNavigationHeader({ 
  navigation, 
  topNavIndex, 
  setTopNavIndex, 
  topNavTabs, 
  profileData
}: {
  navigation: HomeScreenNavigationProp,
  topNavIndex: number,
  setTopNavIndex: (index: number) => void,
  topNavTabs: Array<{name: string, icon: string}>
  profileData: ProfileData
}) {
  return (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {profileData.name || 'Guest'}</Text>
          <View style={styles.pointsContainer}>
            <Text style={styles.points}>{profileData.points} points</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../assets/profile.png')}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.navIcons}>
        {topNavTabs.map((tab, index) => (
          <TouchableOpacity 
            key={tab.name} 
            style={styles.navItem}
            onPress={() => setTopNavIndex(index)}
          >
            <Ionicons
              name={tab.icon as any}
              size={24} 
              color={topNavIndex === index ? '#336749' : '#666'} 
            />
            <Text style={[
              styles.navText, 
              topNavIndex === index && { color: '#336749' }
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
// Placeholder components for different tabs
function FlightScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();// State to store fetched destinations
  const [destinations, setDestinations] = useState<Destination[]>([]); // Define the type as an array of Destination objects
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Fetch the data when the component is mounted
    const fetchDestinations = async () => {
      try {
        const destinationCollection = collection(db, 'destinations');
        const destinationSnapshot = await getDocs(destinationCollection);

        // Map over the documents and extract the data
        const destinationList = destinationSnapshot.docs.map((doc: QueryDocumentSnapshot)  => {
          const data = doc.data() as Destination;
          return {
            id: doc.id,
            name: data.name,
            location: data.location,  // Adjust based on your Firestore structure
            rating: data.rating,
            image_url: data.image_url, // Assuming the URL is stored in Firestore
          };
        });

        setDestinations(destinationList); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching destinations: ", error);
      }
    };

    fetchDestinations(); // Call the function to fetch destinations
  }, []);

  const filteredDestinations = destinations.filter((destination) =>{
    const searchText = searchQuery;
    const name = destination.name;
    const location = destination.location

    // Vérifie si la requête de recherche correspond au nom ou à la localisation
    return name==searchText ;
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          placeholder="Where to go?"
          style={styles.searchInput}
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Discover Wonders</Text>
      
          <TouchableOpacity onPress={() => navigation.navigate('Destinations')}>
            <Text style={styles.seeAll}>See all</Text>

          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id} // Use the document ID as the key for better performance
          image={{ uri: destination.image_url }} // Display image from URL
          title={destination.name}
          location={destination.location}
          rating={destination.rating} // Convert rating to string if needed
        />
      ))}
    </ScrollView>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>places you might like</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Destinations')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {/*<ScrollView horizontal={false} showsVerticalScrollIndicator={false}>*/}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          
        <MightlikeCard
          image={require('../assets/cap.png')}
          title="Cap Angela"
          location="Bizerte"
          rating="7.9"
        />
            <MightlikeCard
          image={require('../assets/eljem.png')}
          title="Amphitheatre of El Jem"
          location="Mahdia"
          rating="8.9"
        />
          <MightlikeCard
          image={require('../assets/yasmine.png')}
          title="Medina of Yasmine Hammamet"
          location="Nabeul"
          rating="8.9"
        />
        </ScrollView>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Our Latest Promotions</Text>
            <Text style={styles.sectionSubtitle}>Best deals from agencies & guides</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promotionsContainer}
        >
          <PromotionCard
            image={require('../assets/sahara-tour.png')}
            title="3-Day Best Sahara Desert Adventure"
            agency="Sahara Expeditions"
            discount="30"
            originalPrice="599"
            discountedPrice="419"
            validUntil="Dec 31, 2024"
            type="agency"
          />
          <PromotionCard
            image={require('../assets/medina-tour.png')}
            title="Medina Walking Tour with Local Expert"
            agency="Ahmed Hassan"
            discount="25"
            originalPrice="80"
            discountedPrice="60"
            validUntil="Dec 15, 2024"
            type="guide"
          />
          <PromotionCard
            image={require('../assets/beach-tour.png')}
            title="Coastal Paradise Weekend Package"
            agency="Tunisia Travel Plus"
            discount="20"
            originalPrice="299"
            discountedPrice="239"
            validUntil="Jan 15, 2025"
            type="agency"
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
}



function HotelsScreen() {
  return (
  <View style={styles.tabContainer}>
    <Text>Hotels Screen</Text>
  </View>
  );
}

function GuideScreen() {
  return (
  <View style={styles.tabContainer}>
    <Text>Guide Screen</Text>
  </View>
  );
}

function DestinationScreen() {
  return (
  <View style={styles.tabContainer}>
  </View>
  );
}

function ChatsScreen() {
  return (
  <View style={styles.tabContainer}>
    <Text>Chats Screen</Text>
  </View>
  );
}

function FavouriteScreen() {
  return (
  <View style={styles.tabContainer}>
    <Text>Favourite Screen</Text>
  </View>
  );
}

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    dateOfBirth: '',
    country: '',
    region: '',
    points: 0,
    level: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        getUserProfile(user.uid); // Fetch profile data using the user's UID
        console.log(user.uid);
        const userRef = doc(firestore, "users", user.uid); 
        console.log(userRef);
      } else {
        // User is signed out
        setProfileData({
          name: '',
          email: '',
          dateOfBirth: '',
          country: '',
          region: '',
          points: 0,
          level: '',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const getUserProfile = async (userId: string) => {
    const q = query(collection(firestore, 'users'), where('uid', '==', userId));

    // Référence au document de l'utilisateur dans la collection 'users'
    const userRef = doc(firestore, "users", "QrbMxf2UX8W4D80J7KW5"); 
  
    try {
      // Récupère les documents correspondants à la requête
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Si le document existe, on peut obtenir les données
        const docSnap = querySnapshot.docs[0]; // On suppose qu'il n'y a qu'un seul document
        const data = docSnap.data();
        setProfileData({
          name: data?.name || '',
          email: data?.email || '',
          dateOfBirth: data?.dateOfBirth || '',
          country: data?.country || '',
          region: data?.region || '',
          points: data?.points || 0,
          level: data?.level || '',
        });
      } else {
        console.log('No such document!');
        Alert.alert('No user data found. Please check if the user is properly registered.');
      }
    } catch (error) {
      console.error('Error getting document:', error);
      Alert.alert('Error retrieving user data. Please try again later.');
    }
  };

  
  
  const [topNavIndex, setTopNavIndex] = useState(0);
  const [bottomNavIndex, setBottomNavIndex] = useState(0);

  const topNavTabs = [
    { name: 'Discover', component: FlightScreen, icon: 'compass' },
    { name: 'Flights', component: Flight, icon: 'airplane' },
    { name: 'Destinations', component: Destinations , icon: 'globe' },
    { name: 'Agency', component: Agencies, icon: 'business' }
  ];

  const bottomNavTabs = [
    { name: 'Home', component: HomeMainContent },
    { name: 'Chats', component: ConversationListPage },
    { name: 'favourites', component: Favourites },
    { name: 'Account', component: Profile }
  ];

  const CurrentTopNavComponent = topNavTabs[topNavIndex].component;
  
  const CurrentBottomNavComponent = bottomNavTabs[bottomNavIndex].component;

  function HomeMainContent() {
    return (
      <>
        <TopNavigationHeader 
        navigation={navigation}
        topNavIndex={topNavIndex}
        setTopNavIndex={setTopNavIndex}
        topNavTabs={topNavTabs}
        profileData={profileData}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <CurrentTopNavComponent />
        </ScrollView>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CurrentBottomNavComponent />
      
      <View style={styles.bottomNav}>
        {bottomNavTabs.map((tab, index) => (
          <TouchableOpacity 
            key={tab.name} 
            style={styles.bottomNavItem} 
            onPress={() => {
              setBottomNavIndex(index);
            }}
          >
            <Ionicons 
              name={getBottomIconName(tab.name)} 
              size={24} 
              color={bottomNavIndex === index ? '#336749' : '#666'} 
            />
            <Text style={[
              styles.bottomNavText, 
              bottomNavIndex === index && styles.activeNavText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  points: {
    marginLeft: 4,
    color: '#666',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#336749',
  },
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
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  promotionsContainer: {
    paddingVertical: 8,
  },
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});
function getUserProfile(uid: string) {
  throw new Error('Function not implemented.');
}

