import React from 'react';
import Welcome from "./components/Welcome/welcome";
import Home from './components/Home/Home';
import Web from "./components/Webview/web";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Web" component={Web} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
