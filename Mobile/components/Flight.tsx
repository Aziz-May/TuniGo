import React ,{useState ,useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import FlightsList from './FlightsList';
import { getFirestore, doc, getDoc, updateDoc, query , collection, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestore } from '../firebase';
import { useNavigation } from 'expo-router';
import { db } from '../firebase.js'; // Adjust path as needed



interface Flights {
  id :string ,
  ArrivalAirport: string;
  DepartureAirport: string;
  DepartureDateTime: string;
  Duration: string;
  Price: string;
 
}

const Flight = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);

  const [upcomingFlights, setUpcomingFlights] = useState<Flights[]>([]);


  const [isEditing, setIsEditing] = useState(false);
  const auth = getAuth();
  {/*const currentUser = auth.currentUser;
  const documentId = "PC9WYssZCZjoMvexEQbU";*/}


 
    
    
  
    // Fetch data from Firestore
    useEffect(() => {
      const fetchFlights = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'Flights'));
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Flights[];
          setUpcomingFlights(data);
        } catch (error) {
          console.error("Error fetching Flights:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchFlights();
    }, []);

  

  return (
    
    <View style={styles.container}>
      <FlightsList title="Upcoming flights" flights={upcomingFlights} />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
});

export default Flight;