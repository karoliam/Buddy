// TODO tee (eiku kahvi :D) navigator
import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Login from '../views/Login';
import CreatePost from '../views/CreatePost';
import RegisterUserDataForm from '../components/RegisterUserDataForm';
import RegisterForm from '../components/RegisterForm';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Create post" component={CreatePost} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="RegisterForm"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Tabs" component={TabScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="RegisterUserDataForm"
        component={RegisterUserDataForm}
      />
      <Stack.Screen name="RegisterForm" component={RegisterForm} />
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
