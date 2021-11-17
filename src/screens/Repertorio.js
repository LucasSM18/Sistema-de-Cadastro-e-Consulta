import React from 'react';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import { CustomView } from '../components/Styles';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';

export default function Repertorio({navigation, route}) {
    const { goBack, logo } = route.params;
    return (
        <View style={styles.bodyStyle}>
            <Header
                title="REPERTÓRIO"
                myLeftContainer={(
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{paddingLeft:5, resizeMode:'contain'}}>
                        <Image 
                            style={{width:logo.size, height:logo.size, margin:logo.margim}}
                            source={logo.image}
                        />
                    </TouchableOpacity>   
                )}
                myRightContainer={
                    goBack?
                    <TouchableOpacity onPress={() => navigation.goBack()} style={ styles.headerComponents }>
                         <Icon
                            name={goBack}
                            type='material-community'
                            color='#a6a6a6'
                            size={30}
                        />
                    </TouchableOpacity>
                    :
                    null                             
                }
            />  
            <CustomView style={styles.pageBody}></CustomView>          
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
        padding:5,
        height:"100%"
    }
})

