
// index.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import MqttClient from '@/components/MQTT';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Cookies from 'js-cookie';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  index: undefined;
};

const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [acStatus, setACStatus] = useState<string>('Unknown');
  const [isWindowOpen, setIsWindowOpen] = useState<string>('Unknown');
  const StatusTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const mqttClient = new MqttClient();

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


  useFocusEffect(
    React.useCallback(() => {
      checkLoginStatus(); 
      checkStatus();
       const statusCheckInterval = setInterval(() => {
         checkStatus();
       }, 3000);

      mqttClient.addTopic('Window monitor', handleMQTTMessage);
      mqttClient.addTopic('Window info', handleMQTTMessage);
      mqttClient.addTopic('This device', handleMQTTMessage);



      return () => {
        // mqttClient.disconnect();
         //clearInterval(statusCheckInterval);
        // if (StatusTimeoutRef.current) clearTimeout(StatusTimeoutRef.current);
        
      };
    }, [navigation])
  );

  const handleMQTTMessage = (topic: string, message: string) => {
    if (topic === 'Window monitor') {
      setIsWindowOpen(message === 'open' ? 'open' : 'closed');
      resetTimeout();
    } else if (topic === 'Window info') {
      if (message === 'On' || message === 'Off') {
        setACStatus(message);
        resetTimeout();
      }
    }
  };

  const resetTimeout = () => {
    if (StatusTimeoutRef.current) clearTimeout(StatusTimeoutRef.current);
    StatusTimeoutRef.current = setTimeout(() => {
      setACStatus('Offline');
      setIsWindowOpen('Offline');
    }, 5000);
  };


  const toggleAC = () => {
    const newStatus = acStatus === 'On' ? 'Off' : 'On';
    mqttClient.sendMessage('This device', newStatus);
    setACStatus(newStatus);
  };

  const checkStatus = () => {
    mqttClient.sendMessage('This device', 'check');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AC Status Monitor</Text>
      <View style={styles.controlContainer}>
        <FontAwesome name="window-maximize" size={40} color={acStatus === 'On' ? 'blue' : 'gray'} />
        <Text style={styles.label}>AC Status: {acStatus}</Text>
        
        <TouchableOpacity style={styles.toggleButton} onPress={toggleAC}>
          <FontAwesome name={acStatus === 'On' ? 'toggle-on' : 'toggle-off'} size={40} color="white" />
          <Text style={styles.buttonText}>{acStatus === 'On' ? 'Turn Off' : 'Turn On'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Window Status Monitor</Text>
      <View style={styles.statusContainer}>
        <FontAwesome name="window-maximize" size={40} color={isWindowOpen === 'open' ? 'green' : 'gray'} />
        <Text style={styles.label}>Window is {isWindowOpen}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  controlContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  statusContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
    color: '#333',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a6fa1',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Home;
