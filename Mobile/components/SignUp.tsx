import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, View, Alert,Image,ImageBackground} from 'react-native';
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword , onAuthStateChanged} from "firebase/auth";
import { db } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app'; 


const SignUp = ({ navigation }: any) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    country: '',        
    dateOfBirth: '',        
    gender: '', 
  });

  const getNameFromEmail = (email: string) => {
    const name = email.split('@')[0]; 
    return name.charAt(0).toUpperCase() + name.slice(1); // Met la première lettre en majuscule
  }


  const handleSignUp = async () => {
    // Vérification si les mots de passe correspondent
    if (form.password !== form.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return; // Exit early if passwords don't match
    }

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      console.log('User signed up:', user);

      const name = getNameFromEmail(form.email);

      // Use onAuthStateChanged to ensure the user is authenticated before writing to Firestore
      onAuthStateChanged(auth, async (authenticatedUser) => {
        if (authenticatedUser) {
          try {
            // Save additional data in Firestore
            await addDoc(collection(db, 'users'), {
              uid: authenticatedUser.uid,
              email: form.email,
              country: form.country,
              dateOfBirth: form.dateOfBirth,
              createdAt: new Date().toISOString(),
              name,
            });
            console.log('User data added to Firestore');
            
            // Show success message and navigate
            Alert.alert('Succès', 'Compte créé avec succès');
            navigation.navigate('Home'); // Replace 'Home' with your target screen
          } catch (error) {
            if (error instanceof FirebaseError) {
              // Handle Firebase specific errors
              console.error('Firebase Error:', error.message);
              Alert.alert('Erreur', `Erreur Firebase: ${error.message}`);
            } else {
              console.error('Unknown error:', error);
              Alert.alert('Erreur', 'Une erreur inconnue est survenue.');
            }
          }
        } else {
          console.error('User not authenticated');
        }
      });
      
    } catch (error) {
      // TypeScript wants the error type to be more specific
      if (error instanceof Error) {
        console.error('Error:', error.message); // Handle general errors
        Alert.alert('Erreur', `Erreur: ${error.message}`);
      } else {
        console.error('Unknown error:', error); // If the error isn't an instance of Error
        Alert.alert('Erreur', 'Une erreur inconnue est survenue.');
      }
    }
  };
   return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/sidibo.jpg')} // Replace with your background image
        style={styles.imageBackground}
      >
      <View style={styles.form}>
        <Text style={styles.title}>Create an account</Text>

        <TextInput
          placeholder="Email Address"
          style={styles.input}
          value={form.email}
          onChangeText={email => setForm({ ...form, email })}
        />

    <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={form.password}
          onChangeText={password => setForm({ ...form, password })}
        />

    <TextInput
          placeholder="Confirme Password"
          style={styles.input}
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={confirmPassword => setForm({ ...form, confirmPassword })}
        />
    <TextInput
          placeholder="Country"
          style={styles.input}
          value={form.country}
          onChangeText={country => setForm({ ...form, country })}
        />
    <TextInput
          placeholder="Date of birth
           (YYYY-MM-DD)"
          style={styles.input}
          value={form.dateOfBirth}
          onChangeText={dateOfBirth => setForm({ ...form, dateOfBirth })}
        />
  


          <TouchableOpacity onPress={handleSignUp} style={styles.btn}>
          <Text style={styles.btnText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
      <Image
          source={require('../assets/logotg.png')} // Make sure the path is correct
          style={styles.logo}
        />
    </ImageBackground>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  imageBackground: {
    flex: 1, // Ensure the image covers the whole screen
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  container: {
    flex: 1,
  },

  logo: {
    height: 100,
    width: 100,
    position: 'absolute',
    top: 20, // Adjust the top position as needed
    left:110,
  },
  form: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 8,
    elevation: 5,
    width:'90%',
    position:'relative',
    right:1,
    top:25,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color:'#376A4C',
  },

  input: {
    height: 44,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  btn: {
    backgroundColor: '#007A8C',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
export default SignUp;