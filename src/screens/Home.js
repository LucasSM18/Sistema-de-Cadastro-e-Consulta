import React from 'react';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import { StyleSheet, TouchableOpacity, ScrollView, View, Text, Image } from 'react-native';


export default function HomeScreen({navigation}) {
    const logo = require('../../assets/logo.png');
    const icons = ["music-note-outline", "playlist-music-outline", "lightbulb-on-outline", "comment-question-outline"]
    const text = ["Músicas", "Repertório", "Sugestões", "Dúvidas"]

    const filtroData = () => {
        const today = moment();
        const dateEvent = moment().day(6);
        //
        if(today > dateEvent) return dateEvent.add(1, 'week').format("DD/MM");
      
        return dateEvent.format('DD/MM');
    }      
    
    return (
        <ScrollView style={styles.pageBody}>
            <View style={styles.container}>
                <Image style={styles.logo} source={logo}/>
                <View style={styles.iconsContainer}>
                    {text.map((elements, index) => (
                        <View key={index} style={styles.icons}>
                            <TouchableOpacity onPress={() => navigation.navigate(elements, {filtroData:filtroData})}>
                                <Icon size={55} name={icons[index]} type="material-community" color="#fff"/>
                                <Text style={styles.text}>{elements.toUpperCase()}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    pageBody: {
        backgroundColor:"#262626",
        flexGrow:1
    },

    container: {
        marginVertical:90,
        alignItems: 'center'
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
        justifyContent:'space-around',
        width:"100%"
    },

    logo: {
        resizeMode: 'contain',
        justifyContent:'center',
        width:360,
        height:200
    },

    icons: {
        height:60,
        flexBasis:'40%',
        marginVertical:45,
        display:'flex'
    }
})