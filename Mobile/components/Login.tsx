// components/Login.tsx
import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground,Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';  // Importing the firebase auth instance
import { FirebaseError } from 'firebase/app';

const Login  = ({ navigation }: any) => {

  //const navigation = useNavigation(); // Access the navigation prop

  const [form, setForm] = useState({
    email: '',
    password: '',
  });


  const handleLogin = async () => {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    try {
      // Sign in the user using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed in:', user);
      

      // If login is successful, navigate to Home
      Alert.alert('Successfully logged in!');
      navigation.navigate('Home'); // Navigate to Home screen after successful login
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred while logging in.');
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/sidibo.jpg')} // Replace with your background image
        style={styles.imageBackground}
      >
        <View style={styles.container}>
          {/* Header part, inside the box */}
          <View style={styles.formContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>
                Welcome to <Text style={{ color: '#55A5B1' }}>Tunisia</Text>
              </Text>
              <Text style={styles.subtitle}>
                Discover the Magic of a Timeless Destination
              </Text>
            </View>

            {/* Email input */}
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email address</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={styles.inputControl}
                placeholder="Enter your email"
                placeholderTextColor="#6b7288"
                value={form.email}
                onChangeText={email => setForm({ ...form, email })}
              />
            </View>

            {/* Password input */}
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                secureTextEntry
                style={styles.inputControl}
                placeholder="********"
                placeholderTextColor="#6b7288"
                value={form.password}
                onChangeText={password => setForm({ ...form, password })}
              />
            </View>

            {/* Forgot password link */}
            <View>
              <Text style={{ textAlign: 'right', fontSize: 12, color: '#677184',position:'relative', bottom:12, }}>
                Forgot password?
              </Text>
            </View>

            {/* Sign In button */}
            <View style={styles.formAction}>
              <TouchableOpacity
                onPress={handleLogin}> 
                 
                  
      
              
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Sign In</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer for "Sign Up" */}
          <Text style={styles.formFooter}>Don't have an account?</Text>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <View style={styles.btn2}>
            <Text style={styles.btnText}>Sign Up</Text>
        </View>
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
    padding: 24,
    flex: 1,
    height:'100%',
    position:'relative',
    top:-10,
    justifyContent: 'center', // Make sure the content stays centered vertically
  },

  header: {
    marginVertical: 36,
  },
  
  /*formContainer: {
    backgroundColor: '#e8ecf4',
    borderRadius: 12,
    padding: 10,
    marginTop: 20,
    flex: 1,
  },*/
  form: {
    backgroundColor: '#F6F6F6',
    padding: 20,
    borderRadius: 18,
    elevation: 5,
    width: '85%',
    height:'75%',
    paddingTop:0,
    position:'relative',
    top:55,
    zIndex:0,
  },

  title: {
    fontSize: 27,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
    color: '#35684B',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#618972',
    textAlign: 'left',
  },
  logo: {
    height: 100,
    width: 100,
    position:'absolute',
    top:5,
    zIndex:1,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 500,
    color: '#222',
  },
  formContainer: {
    backgroundColor: '#e8ecf4',
    borderRadius: 12,
    padding: 15,
    marginTop: 80,
    flex: 1,
    width:'122%',
    position:'relative',
    top:-5,
    paddingBottom:300,
    opacity: 0.9, // Optional: Add opacity to blend the background image slightly with the form
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  btn: {
    position:'relative',
    bottom:20,
    backgroundColor: '#007A8C',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#007A8C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btn2: {
    position:'relative',
    top:18,
    backgroundColor: '#007A8C',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#007A8C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
export default Login;