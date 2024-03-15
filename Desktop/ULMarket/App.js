import React from 'react';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Chat from "./components/Chat/Chat";
import users from "./components/Chat/userList";
import Love from "./components/Love/Love";
import Posting from "./components/Love/Posting";
import PaymentWebViewScreen from './components/Modal/PaymentWeb';
import Sell from "./components/Sell/Sell";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Sell" component={Sell} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="users" component={users} options={{ headerShown: false }} />
        <Stack.Screen name="Love" component={Love} options={{ headerShown: false }} />
        <Stack.Screen name="Posting" component={Posting} options={{ headerShown: false }} />
        <Stack.Screen name="Payment" component={PaymentWebViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
