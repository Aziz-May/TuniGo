import React, {useEffect, useState} from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; // adjust path as needed
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

type AgenciesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Agencies'>;

// Agency data type
interface Agency {
  id: string; // ID de document dans Firestore
  name: string;
  description: string;
  specialties: string[];
  rating: number;
  logo_url: string; // URL du logo
}






{/*}
const agenciesData: Agency[] = [
  {
    id: '1',
    name: 'Sahara Expeditions',
    logo_url: require('../assets/sahara-expeditions-logo.png'),
    description: 'Specialists in desert tours and adventures',
    specialties: ['Desert Tours', 'Camel Treks', 'Camping'],
    rating: 4.8
  },
  {
    id: '2',
    name: 'Trivago',
    logo_url: require('../assets/trivago-logo.jpg'),
    description: 'Comprehensive travel solutions across Tunisia',
    specialties: ['Cultural Tours', 'Beach Holidays', 'Group Travel'],
    rating: 4.5
  },
  {
    id: '3',
    name: 'Travelocity',
    logo_url: require('../assets/travelocity-logo.png'),
    description: 'Exploring coastal and historic destinations',
    specialties: ['Coastal Tours', 'Historical Sites', 'Guided Walks'],
    rating: 4.7
  }
];
*/}


const Agencies: React.FC = () => {
  const navigation = useNavigation<AgenciesScreenNavigationProp>();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les agences depuis Firestore
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        console.log("Fetching data from Firestore...");
        const querySnapshot = await getDocs(collection(db, 'Agencies'));
        
        console.log("QuerySnapshot:", querySnapshot); // Log pour vérifier si `querySnapshot` est défini
        console.log("Documents trouvés :", querySnapshot.docs);
  
        const data = querySnapshot.docs
          .map((doc) => {
            const docData = doc.data();

            // Validate required fields
            if (
              typeof docData.name === 'string' &&
              typeof docData.description === 'string' &&
              Array.isArray(docData.specialties) &&
              typeof docData.rating === 'number' &&
              typeof docData.logo_url === 'string'
            ) {
              return {
                id: doc.id,
                name: docData.name,
                description: docData.description,
                specialties: docData.specialties,
                rating: docData.rating,
                logo_url: docData.logo_url,
              };
            }
            return null; // Skip invalid documents
          })
          .filter((agency): agency is Agency => agency !== null); // Filter out null values

        console.log("Documents fetched:", data);
        setAgencies(data);
      } catch (error) {
        console.error("Error fetching agencies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);


  
  
  
  const renderAgencyItem = ({ item }: { item: Agency })  => (
    <TouchableOpacity 
      style={styles.agencyCard}
      onPress={() => {/*navigation.navigate('AgencyDetails', { agencyId: agency.id }); // Naviguer vers les détails de l'agence
    }}*/}}
    >
      <View style={styles.agencyCardHeader}>
        <Image source={{ uri: item.logo_url }}  style={styles.agencyLogo} />
        <View>
          <Text style={styles.agencyName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.agencyDescription}>{item.description}</Text>
      <View style={styles.specialtiesContainer}>
        {item.specialties.map((specialty, index) => (
          <View key={index} style={styles.specialtyPill}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#336749" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={agencies}
          renderItem={renderAgencyItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.agenciesContainer}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Travel Agencies</Text>
              </View>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" />
                <Text style={styles.searchPlaceholder}>Search agencies...</Text>
              </View>
            </>
          }
          ListFooterComponent={
            <View style={{ padding: 16 }}>
              <Text style={{ textAlign: 'center', color: '#666' }}>End of List</Text>
            </View>
          }
        />
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#336749',
  },
  headerPlaceholder: {
    width: 40, // Match back button width
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
  agenciesContainer: {
    paddingHorizontal: 16,
  },
  agencyCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agencyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  agencyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  agencyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: '#666',
  },
  agencyDescription: {
    color: '#666',
    marginBottom: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyPill: {
    backgroundColor: '#E6F2EC',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
  },
  specialtyText: {
    color: '#336749',
    fontSize: 12,
  },
});
export default Agencies;