/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import HomeScreen from './src/screens/HomeScreen'
import React, { Component,useState } from 'react';
import { ScrollView, SafeAreaView, Text, TouchableOpacity} from 'react-native';

import { StartScreen } from './src/screens/StartScreen';
import { NavigationContainer } from '@react-navigation/native';
import WeatherForecast from './src/screens/WeatherForecast';
import SlideBottom from './src/screens/SlideBottom';
import ZoomImage from './src/screens/ZoomImage';
import SplashScreen from './src/screens/SplashScreen';
import { useNavigation } from '@react-navigation/native';
import WeatherImage from './src/screens/WeatherImage';

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

const Stack = createStackNavigator();

const MyHome = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1}}>
        <HomeScreen/>
        <WeatherImage/>
        <SlideBottom style={{zIndex: 100}}>
          <WeatherForecast />
        </SlideBottom>
    </SafeAreaView>
  )
}

class App extends Component {
  state = {
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={({ route, navigation }) => ({headerShown: false, gestureEnabled: true})} >
          <Stack.Screen name="Start" component={MyHome} />
          <Stack.Screen name="ZoomImage" component={ZoomImage} />
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={() => ({ headerShown: false, animationEnabled: false })} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;