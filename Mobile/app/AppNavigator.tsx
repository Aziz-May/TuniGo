import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation'; // Create this file if not exists
import Home from '../components/Home';
import Profile from '../components/Profile';
import Agencies from '../components/Agencies';
import DestinationCard from '@/components/DestinationCard';
import Destinations from '@/components/Destinations';
import ArticlePage from '@/components/ArticlePage';
import SignUp from '@/components/SignUp';
import Login from '@/components/Login';
import SplashScreen from '@/components/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import ConversationPage from '@/components/ConversationPage';

// Define the type for your navigation parameters

// Create the stack navigator with the defined type
const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
   return (
    

   
     <Stack.Navigator initialRouteName='Splash'>
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={{ headerShown: false }} 
        />
       <Stack.Screen
         name="Home"
         component={Home}
         options={{ headerShown: false }}
       />
       <Stack.Screen
         name="Profile"
         component={Profile}
         options={{
           headerTitle: 'Profile',
           headerStyle: {
             backgroundColor: '#fff',
           },
           headerTintColor: '#336749',
         }}
       />
       <Stack.Screen 
          name="Destinations" 
          component={Destinations} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ArticlePage" 
          component={ArticlePage} 
          options={({ route }) => ({ 
            title: route.params.place.name,
            headerBackTitle: 'Back'
          })}
        />
         <Stack.Screen 
          name="ConversationPage" 
          component={ConversationPage} 
          options={({ route }) => ({ 
            title: route.params.name,
            headerBackTitle: 'Back'
          })}
        />
     </Stack.Navigator>
     
   );
}