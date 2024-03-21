/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Home from './screen/HomeScreen';
import DataScreen from './screen/DataScreen';
import {name as appName} from './app.json';

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);

const Stack = createNativeStackNavigator();

const App = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="DataScreen" component={DataScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

AppRegistry.registerComponent(appName, () => App);
