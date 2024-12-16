import React, { useState, useEffect,  } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, doc, getDoc, updateDoc, query , collection, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestore } from '../firebase';

interface ProfileData {
  name: string;
  email: string;
  dateOfBirth: string;
  country: string;
  region: string;
  points: number;
  level: string;
}

const Profile = ({ navigation }: any) => {
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
  {/*const currentUser = auth.currentUser;
  const documentId = "PC9WYssZCZjoMvexEQbU";*/}


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

  
 

  const updateProfile = async () => {
    const user = auth.currentUser;
    
    if (user) {
      const q = query(collection(firestore, 'users'), where('uid', '==', user.uid));
      try {
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0]; // On suppose qu'il n'y a qu'un seul document
          const userRef = doc(firestore, 'users', docSnap.id); // Utilise l'ID du document récupéré

          // Mise à jour du document avec les nouvelles données
          await updateDoc(userRef, {
            name: profileData.name,
            email: profileData.email,
            dateOfBirth: profileData.dateOfBirth,
            country: profileData.country,
            region: profileData.region,
            points: profileData.points,
            level: profileData.level,
          });
          
          Alert.alert('Profile updated successfully!');
          setIsEditing(false);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error updating profile. Please try again later.');
      }
    }
  };





  const getLevelColor = (points: number) => {
    if (points >= 2000) return '#FFD700'; // Gold
    if (points >= 1000) return '#C0C0C0'; // Silver
    return '#CD7F32'; // Bronze
  };

  const renderPoints = () => (
    <View style={styles.pointsContainer}>
      <Text style={styles.pointsTitle}>Reward Points</Text>
      <Text style={[styles.pointsValue, { color: getLevelColor(profileData.points) }]}>
        {profileData.points}
      </Text>
      <Text style={styles.levelText}>{profileData.level}</Text>
      <Text style={styles.pointsInfo}>
        Earn more points by booking flights, guides, and exploring Tunisia!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={require('../assets/default-profile.png')} // Make sure to add this image
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Text style={styles.editImageText}>Edit Photo</Text>
          </TouchableOpacity>
        </View>

        {renderPoints()}

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={profileData.name}
              editable={isEditing}
              onChangeText={(text) => setProfileData({ ...profileData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={profileData.email}
              editable={isEditing}
              onChangeText={(text) => setProfileData({ ...profileData, email: text })}
              keyboardType="email-address"
              
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={profileData.dateOfBirth}
              editable={isEditing}
              onChangeText={(text) => setProfileData({ ...profileData, dateOfBirth: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={profileData.country}
              editable={isEditing}
              onChangeText={(text) => setProfileData({ ...profileData, country: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Region</Text>
            <TextInput
              style={styles.input}
              value={profileData.region}
              editable={isEditing}
              onChangeText={(text) => setProfileData({ ...profileData, region: text })}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (isEditing) {
              updateProfile();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  editImageButton: {
    padding: 8,
  },
  editImageText: {
    color: '#2E8B57',
    fontSize: 16,
  },
  pointsContainer: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  levelText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  pointsInfo: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2E8B57',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile;