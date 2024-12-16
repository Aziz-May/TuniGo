import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a message type with timestamp
interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

const ConversationPage = ({ route, navigation }: any) => {
  const { name, updateLastMessage, conversationId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Load messages when component mounts
  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  // Save messages whenever they change
  useEffect(() => {
    saveMessages();
  }, [messages]);

  // Load messages from AsyncStorage
  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(`messages_${conversationId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Failed to load messages', error);
      Alert.alert('Error', 'Could not load previous messages');
    }
  };

  // Save messages to AsyncStorage
  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages', error);
      Alert.alert('Error', 'Could not save messages');
    }
  };

  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObject: Message = {
        id: `${Date.now()}`, // Unique ID based on timestamp
        sender: 'You',
        text: newMessage,
        timestamp: Date.now()
      };

      const updatedMessages = [...messages, newMessageObject];
      setMessages(updatedMessages);
      
      // Update last message in conversation list
      updateLastMessage(conversationId, newMessage);
      
      // Clear input
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/default-profile.png')} style={styles.avatar} />
        <Text style={styles.headerTitle}>Chat with {name}</Text>
      </View>
      <ScrollView 
        style={styles.messagesContainer}
        ref={(ref) => ref && ref.scrollToEnd({animated: true})}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={message.sender === 'You' ? styles.yourMessage : styles.contactMessage}
          >
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage}>
          <View style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};




const styles = StyleSheet.create({
  messageTime: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    backgroundColor: '#075e54',
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  yourMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderRadius: 20,
    marginBottom: 10,
    padding: 10,
    maxWidth: '80%',
  },
  contactMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 10,
    padding: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    backgroundColor: '#e5e5e5',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#075e54',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default ConversationPage;

