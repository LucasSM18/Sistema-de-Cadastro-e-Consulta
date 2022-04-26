import React from 'react';
import Home from './src/screens/Home';
import Themes from './src/themes/Themes';
import Duvidas from './src/screens/Duvidas';
import Louvores from './src/screens/Louvores';
import Sugestoes from './src/screens/Sugestoes';
import Repertorio from './src/screens/Repertorio';
import Editar_Louvor from './src/screens/Editar_Louvor';
import Importa_Louvores from './src/screens/Importar_Louvores';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, useColorScheme, StatusBar } from 'react-native';
import moment from 'moment';

const Stack = createNativeStackNavigator();

const filtroData = () => {
  const today = moment();
  const dateEvent = moment().day(6);
  //
  if(today > dateEvent) return dateEvent.add(1, 'week').format("DD/MM");

  return dateEvent.format('DD/MM');
}

export default function App(){
  const deviceTheme = useColorScheme();
  const theme = Themes[deviceTheme] || Themes.light;
  const logo = { size: 60, margim: 5, image: require('./assets/home.png') };
  const initialPage = Platform.OS !== "web" ? "Home" : "Repertório";
  // const initialPage = "Home";

  return (    
      <NavigationContainer theme={{colors:{background:theme.body}}}>
        <ThemeProvider theme={theme}>
          <StatusBar translucent backgroundColor='transparent' barStyle='light-content'/>
          <Stack.Navigator initialRouteName={initialPage} screenOptions={{headerShown:false}}>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Músicas" component={Louvores} initialParams={{logo:logo, filtroData:filtroData}}/>
            <Stack.Screen name="Importar" component={Importa_Louvores}/>
            <Stack.Screen name="Editar" component={Editar_Louvor}/>
            <Stack.Screen name="Repertório" component={Repertorio} initialParams={{logo:logo, filtroData:filtroData}}/>
            <Stack.Screen name="Dúvidas" component={Duvidas} initialParams={{logo:logo}}/>
            <Stack.Screen name="Sugestões" component={Sugestoes} initialParams={{logo:logo}}/>
          </Stack.Navigator>
        </ThemeProvider>
      </NavigationContainer>
  );  
}

