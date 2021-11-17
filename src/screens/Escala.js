import React from 'react';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import { CustomView, CustomSelect } from '../components/Styles';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';

const options = [
    { value: 'Lucas', label: 'Lucas' },
    { value: 'Rafael', label: 'Rafael' },
    { value: 'Otávio', label: 'Otávio' },
    { value: 'Gustavo', label: 'Gustavo' }
]

const ministerios = [
    { value: 'louvor', label: 'Louvor' },
    { value: 'mti', label: 'MTI' }
]

export default function Escala({navigation, route}) {
    const { logo } = route.params; 
    return (
        <View style={styles.bodyStyle}>
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
                <CustomSelect  placeholder="Nome" isMulti={true} options={options} noOptionsMessage={() => null}/>
                <CustomSelect  placeholder="Ministério" isSearchable={false} options={ministerios}/>
            </CustomView>
        </View>        
    )
}

const styles = StyleSheet.create({
    headerComponents: {
        paddingHorizontal: 15,
        resizeMode: 'contain'
    },

    bodyStyle: {
        flex:1
    },

    pageBody: {
        flex:1,
        padding:20,
        paddingHorizontal:15,
        height:"100%"
    },
});


