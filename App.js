import React from 'react';
import Home from './src/screens/Home';
import AddLouvores from './src/screens/AddLouvores';
import Themes from './src/themes/Themes';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, StatusBar, Platform } from 'react-native';

const Stack = createNativeStackNavigator();

const platformManager = () => {
  return Platform.OS === 'ios' ? 'ios' : 'md'
}

export default function App(){
  const deviceTheme = useColorScheme();
  const theme = Themes[deviceTheme] || Themes.dark;
  return (    
      <NavigationContainer theme={{colors:{background:theme.body}}}>
        <ThemeProvider theme={theme}>
          <StatusBar translucent backgroundColor='transparent' barStyle={theme.style}/>
          <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown:false}}>
            <Stack.Screen name="Home" component={Home} initialParams={{platform:platformManager()}}/>
            <Stack.Screen name="AddLouvores" component={AddLouvores} initialParams={{platform:platformManager()}}/>
          </Stack.Navigator>
        </ThemeProvider>
      </NavigationContainer>
  );  
}

