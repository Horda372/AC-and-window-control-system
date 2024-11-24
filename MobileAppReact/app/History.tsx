import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MqttClient from '@/components/MQTT';
import Cookies from 'js-cookie';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  index: undefined;
};

interface Message {
  id: number;
  topic: string;
  content: string;
  isSender: boolean;
}

const HistoryLogs = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const mqttClientRef = useRef<MqttClient | null>(null);

  const checkLoginStatus = async () => {
    let isLoggedIn;

    if (Platform.OS === 'web') {
      isLoggedIn = Cookies.get('isLoggedIn') || 'False';
    } else {
      isLoggedIn = await AsyncStorage.getItem('isLoggedIn') || 'False';
    }

    if (isLoggedIn !== 'True') {
      navigation.navigate('index');
    }
  };

  const handleNewMessage = (topic: string, content: string) => {
    const newMessage: Message = {
      id: Date.now(),
      topic,
      content,
      isSender: topic.includes('Window monitor'),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  useEffect(() => {
    checkLoginStatus();
    
    if (!mqttClientRef.current) {
      mqttClientRef.current = new MqttClient();

      mqttClientRef.current.addTopic('Window monitor', handleNewMessage);
      mqttClientRef.current.addTopic('This device', handleNewMessage);
      mqttClientRef.current.addTopic('Window info', handleNewMessage);
    }

    return () => {
      // if (mqttClientRef.current) {
      //   mqttClientRef.current.disconnect();
      //   mqttClientRef.current = null;
      // }
    };
  }, []);

  return (
    <LinearGradient colors={['#1e3a5f', '#4a6fa1']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        {messages.map((msg) => (
          <View
            key={msg.id.toString()}
            style={[styles.messageContainer, msg.isSender ? styles.sent : styles.received]}
          >
            <Text style={styles.topic}>{msg.topic}</Text>
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  received: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  sent: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  topic: {
    fontWeight: 'bold',
    color: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 4,
  },
});

export default HistoryLogs;
