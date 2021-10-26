import React from 'react';
import { Icon } from 'react-native-elements';
import { StyleSheet, TouchableOpacity, Platform, View, Text, Image } from 'react-native';

export default function HomeScreen({navigation, route}) {
    const logo = require('../../assets/logo.png');
    return (
        <View style={[styles.container, Platform.OS!=='web'?{ paddingVertical: 100 }:null]}>
            <Image style={styles.logo} source={logo}/>
            <View style={styles.iconsContainer}>
                <TouchableOpacity style={styles.icons} onPress={() => navigation.navigate('Músicas')}>
                    <Icon size={50} name={route.params.platform + "-musical-notes-outline"} type="ionicon" color="#fff"/>
                    <Text style={styles.text}>MÚSICAS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.icons}>
                    <Icon size={55} name="playlist-music-outline" type="material-community" color="#fff"/>
                    <Text style={styles.text}>REPERTÓRIO</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"#262626",
        alignItems: 'center',
    },

    text: {
        color:"#fff",
        fontWeight:'bold'
    },

    iconsContainer: {
        flexDirection:'row',
        justifyContent:'space-between',
        width:Platform.OS!=='web'?"70%":"50%"
    },

    logo: {
        resizeMode: 'stretch',
        marginVertical:50,
        width:350,
        height:119
    },

    icons: {
        height:60,
        display:'flex',
    }
})