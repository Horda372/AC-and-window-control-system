// index.tsx

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, StyleSheet, View, Text, TextInput, TouchableOpacity, } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
};

interface ResponseData {
  success: boolean;
  message: string;
}

const Index: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://192.168.0.212:5003/api/login', { //PC ip
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data: ResponseData = await response.json();
      setMessage(data.message);

      if (!response.ok || !data.success) {
        setMessage('Invalid username or password. Please try again.');
        if (Platform.OS === 'web') {
          Cookies.set('isLoggedIn', 'False');
        } else {
          await AsyncStorage.setItem('isLoggedIn', 'False');
        }
        return;
      }

      if (Platform.OS === 'web') {
        Cookies.set('isLoggedIn', 'True', { expires: 15 / 4800 }); // Expires in 1 day
      } else {
        await AsyncStorage.setItem('isLoggedIn', 'True');
      }
      
      navigation.navigate('Home');
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('An error occurred. Please try again later.');
      if (Platform.OS === 'web') {
        Cookies.set('isLoggedIn', 'False');
      } else {
        await AsyncStorage.setItem('isLoggedIn', 'False');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCompleteType="username"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCompleteType="password"
        />
        {message && <Text style={styles.message}>{message}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  message: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4a6fa1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Index;
