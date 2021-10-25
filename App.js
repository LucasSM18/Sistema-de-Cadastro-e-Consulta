import React from 'react';
import Louvores from './src/screens/Louvores';
import Importa_Louvores from './src/screens/Importar_Louvores';
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
          <Stack.Navigator initialRouteName="Músicas" screenOptions={{headerShown:false}}>
            <Stack.Screen name="Músicas" component={Louvores} initialParams={{platform:platformManager()}}/>
            <Stack.Screen name="Importar" component={Importa_Louvores} initialParams={{platform:platformManager()}}/>
          </Stack.Navigator>
        </ThemeProvider>
      </NavigationContainer>
  );  
}

