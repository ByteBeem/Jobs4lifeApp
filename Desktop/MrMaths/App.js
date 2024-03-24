import React from 'react';
import Solved from './screens/Home/Home';
import Main from "./screens/Main";
import { NavigationContainer } from '@react-navigation/native';
import welcome from "./screens/Walkthrough";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
    <NavigationContainer>
      
      <Stack.Navigator initialRouteName="welcome">
      <Stack.Screen name="welcome" component={welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Solved" component={Solved} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
       
      </Stack.Navigator>
    
    </NavigationContainer>
      </UserProvider>
  );
}
