import React from 'react';
import { Icon } from 'react-native-elements';
import { StyleSheet, TouchableOpacity, Platform, View, Text, Image } from 'react-native';

export default function HomeScreen({navigation}) {
    const logo = require('../../assets/logo.png');
    const icons = ["music-note-outline", "playlist-music-outline", "calendar-month-outline", "cloud-outline", "robot", "comment-question-outline"]
    const text = ["Músicas", "Repertório", "Escala", "Mídia", "ChatBot", "Dúvidas"]
    
    return (
        <View style={[styles.container, Platform.OS!=='web'?{ paddingVertical: 100 }:null]}>
            <Image style={styles.logo} source={logo}/>
            <View style={styles.iconsContainer}>
                {text.map((elements, index) => (
                <TouchableOpacity key={index} disabled={index!==0?true:false} style={styles.icons} onPress={() => navigation.navigate(elements)}>
                    <Icon size={55} name={icons[index]} type="material-community" color="#fff"/>
                    <Text style={styles.text}>{elements.toUpperCase()}</Text>
                </TouchableOpacity>
                ))}
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
        fontWeight:'bold',
        textAlign:'center'
    },

    iconsContainer: {
        flex:1,
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'space-evenly',
        width:"100%"
    },

    logo: {
        resizeMode: 'stretch',
        marginVertical:50,
        width:350,
        height:119
    },

    icons: {
        height:60,
        flexBasis:'30%',
        marginVertical:20,
        display:'flex',
    }
})