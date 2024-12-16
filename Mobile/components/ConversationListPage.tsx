// ConversationListPage.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getIconName, getBottomIconName } from '../constants/icons';
import { Ionicons } from '@expo/vector-icons';


import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; // adjust path as needed
type ConversationListPageScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConversationListPage'>;

const ConversationListPage = () => {
  const navigation = useNavigation<ConversationListPageScreenNavigationProp>();
  const [conversations, setConversations] = useState([
    { 
      id: '1', 
      name: 'John Doe', 
      lastMessage: '', 
      time: '12:45 PM', 
      avatar: require('../assets/default-profile.png'),
      hasMessages: false // Track if conversation has messages
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      lastMessage: '', 
      time: '11:30 AM', 
      avatar: require('../assets/default-profile.png'),
      hasMessages: false
    },
    // Add more conversations here
  ]);

  // Update the last message in the list
  const updateLastMessage = (id: string, message: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((conversation) =>
        conversation.id === id
          ? { 
              ...conversation, 
              lastMessage: message, 
              hasMessages: true,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : conversation
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversations</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('ConversationPage', {
              name: item.name,
              updateLastMessage: updateLastMessage,
              conversationId: item.id,
            })}
          >
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.messageContainer}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.lastMessage}>
                {item.hasMessages ? item.lastMessage : "Start the conversation"}
              </Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </TouchableOpacity>
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
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#336749',
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  messageContainer: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: 'white',
    fontStyle: 'italic',
  },
  time: {
    fontSize: 12,
    color: 'white',
  },
});

export default ConversationListPage;
