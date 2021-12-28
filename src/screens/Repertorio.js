import React from 'react';
import moment from 'moment';
import Card from '../components/Card'; 
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import { CustomView } from '../components/Styles';
import { StyleSheet, TouchableOpacity, Image, View, Linking } from 'react-native';

const filtroData = () => {
    const today = moment();
    const dateEvent = moment().day(6);
    //
    if(today > dateEvent) return dateEvent.add(1, 'week').format("DD/MM");

    return dateEvent.format('DD/MM');
}

const sendLouvores = () => {    
    const message = `Repertório - ${filtroData()}`;
    Linking.canOpenURL('whatsapp://send?text=').then(() => {
        Linking.openURL(`whatsapp://send?text=${message}`)
    }).catch(() => {
        alert("Houve um erro ao tentar enviar o Repertório!\n Verifique se o WhatsApp está instalado corretamente, ou contate o administrador do sistema.")
    })
}

export default function Repertorio({navigation, route}) {
    const { goBack, logo } = route.params;
    return (
        <View style={{flex:1}}>
            <Header
                title={"REPERTÓRIO" + ' - ' + filtroData()} 
                myLeftContainer={(
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{paddingLeft:5, resizeMode:'contain'}}>
                        <Image 
                            style={{width:logo.size, height:logo.size, margin:logo.margim}}
                            source={logo.image}
                        />
                    </TouchableOpacity>   
                )}
                myRightContainer={
                    <TouchableOpacity onPress={() => sendLouvores()} style={ styles.headerComponents }>
                        <Icon
                            name="share" 
                            type='entypo'
                            color='#a6a6a6'
                            size={25}
                        />
                    </TouchableOpacity>                               
                }
                complement={
                    goBack?
                        <TouchableOpacity onPress={() => navigation.goBack()} style={ styles.headerComponents }>
                             <Icon
                                name="music-note-outline"
                                type='material-community'
                                color='#a6a6a6'
                                size={30}
                            />
                        </TouchableOpacity>
                    :
                    null                             
                }
            />  
            <CustomView style={styles.pageBody}>
                <Card name="Musica1" complement='Grupo1' content='teste1' />
                <Card name="Musica2" complement='Grupo2' content='teste2' />
                <Card name="Musica3" complement='Grupo3' content='teste3' /> 
                {/* <Flatlist
                    data={louvores} 
                    ListEmptyComponent={
                        <Font style={{ fontSize:20, alignSelf:'center', marginTop:'2%' }}>Lista Vazia</Font> 
                    }
                    renderItem={({item}) => 
                        <Card 
                            name={item.titulo} 
                            complement={item.artista} 
                            content={item.letra} 
                        />
                    } 
                    keyExtractor={(item)=>item.id}
                />           */}
            </CustomView>          
        </View>        
    )
}

const styles = StyleSheet.create({
    headerComponents: {
        paddingHorizontal: 15,
        resizeMode: 'contain'
    },

    pageBody: {
        flex:1,
        padding:5,
        height:"100%"
    }
})

