// import React, { useEffect } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import MqttClient from '@/components/MQTT';

// const Example = () => {
//   const mqttClient = new MqttClient();
//   useEffect(() => {
//     return () => {
//       mqttClient.disconnect();
//     };
//   }, []);

//   const handleSend = () => {
//     mqttClient.sendMessage('This device', 'From this device');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>MQTT Client Example</Text>
//       <Button title="Send Message" onPress={handleSend} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 16,
//   },
// });

// export default Example;