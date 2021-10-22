import React from 'react';
import Header from '../components/Header';
import actualDimensions from '../dimensions/Dimensions';
import { Icons_Ionicons } from '../components/Styles';
import { StyleSheet, TouchableOpacity, Platform, View } from 'react-native';

export default function AddLouvores({navigation, route}) {
    return (
        <View style={Platform.OS==='web'?styles.webStyle:styles.mobileStyle}>
            <Header
                title="Importar Louvores" 
                myLeftContainer={(
                    <TouchableOpacity style={ styles.headerComponents } onPress={() => navigation.navigate('Home')}>
                        <Icons_Ionicons size={30} name={route.params.platform + '-arrow-back-outline'}/>
                    </TouchableOpacity>
                )}
            />
        </View>        
    )
}

const styles = StyleSheet.create({
    headerComponents: {
        paddingHorizontal: 15,
        resizeMode: 'contain'
    },

    webStyle: {
        height:actualDimensions.height,
        width:actualDimensions.width
    },

    mobileStyle: {
        flex:1
    }
})

