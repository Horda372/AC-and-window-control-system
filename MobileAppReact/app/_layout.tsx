import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#2c3e50', '#4ca1af']} // Gray/Blue
        style={styles.gradient}
      >
        <View style={styles.overlay}>
          <Drawer
            screenOptions={{
              headerStyle: styles.header,
              headerTitle: ({ children }) => (
                <LinearGradient
                  colors={['#4ca1af', '#2c3e50']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.titleGradient}
                >
                  <Text style={styles.titleText}>{children}</Text>
                </LinearGradient>
              ),
              drawerStyle: styles.drawer,
              drawerLabelStyle: styles.drawerLabel,
              drawerActiveTintColor: '#ffffff',
              drawerInactiveTintColor: '#bdc3c7',
            }}
          >

            <Drawer.Screen
              name="Home"
              options={{
                drawerLabel: 'Home',
                title: 'Home',
              }}
            />

            <Drawer.Screen
              name="History"
              options={{
                drawerLabel: 'History',
                title: 'Message History',
              }}
            />
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: 'Login',
                title: 'Login',
              }}
            />
             <Drawer.Screen
              name="Extra"
              options={{
                drawerLabel: 'Extra',
                title: 'Bonus Content',
              }}
            />
          </Drawer>
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  titleGradient: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  drawer: {
    backgroundColor: '#34495e',
    width: 240,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
