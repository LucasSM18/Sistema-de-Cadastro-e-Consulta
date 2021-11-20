import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import CustomSelect from '../components/Select';
import { CustomView } from '../components/Styles';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, View } from 'react-native';

const options = [
    { label: 'Lucas', value: 'Lucas' },
    { label: 'Rafael', value: 'Rafael' },
    { label: 'Otávio', value: 'Otávio' },
    { label: 'Gustavo', value: 'Gustavo' }
]

const ministerios = [
    { label: 'Louvor', value: 'louvor' },
    { label: 'MTI', value: 'mti' }
]

export default function Escala({navigation, route}) { 
    const { logo } = route.params; 
    const [nomeHandler, setNomeHandler] = useState(false);
    const [ministerioHandler, setMinisterioHandler] = useState(false);
    
    return (
        <TouchableWithoutFeedback onPress={() => setNomeHandler(true)||setMinisterioHandler(true)}>
            <View style={{flex:1}}>
                <Header
                    title="ESCALA"
                    myLeftContainer={(
                        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{paddingLeft:5, resizeMode:'contain'}}>
                            <Image 
                                style={{width:logo.size, height:logo.size, margin:logo.margim}}
                                source={logo.image}
                            />
                        </TouchableOpacity>   
                    )}
                    myRightContainer={
                        <TouchableOpacity onPress={() => navigation.navigate('Repertório' , {goBack:'calendar-month-outline'})} style={ styles.headerComponents }>
                            <Icon
                                name={"playlist-music-outline"} 
                                type='material-community'
                                color='#a6a6a6'
                                size={35}
                            />
                        </TouchableOpacity>                               
                    }
                />            
                <CustomView style={styles.pageBody}>
                    <CustomSelect 
                        placeholder='Nome' 
                        zIndex={2} 
                        options={options} 
                        multi={true} 
                        searchable={true} 
                        handler={ministerioHandler} 
                        onPress={state => setNomeHandler(state)}
                    />
                    <CustomSelect 
                        placeholder='Ministério' 
                        zIndex={1} 
                        options={ministerios} 
                        handler={nomeHandler} 
                        onPress={state => setMinisterioHandler(state)}
                    />
                </CustomView>
            </View>        
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    headerComponents: {
        paddingHorizontal: 15,
        resizeMode: 'contain'
    },

    pageBody: {
        flex:1,
        padding:20,
        paddingHorizontal:15,
        height:"100%"        
    }
});


