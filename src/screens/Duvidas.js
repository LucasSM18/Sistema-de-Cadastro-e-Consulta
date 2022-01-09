import * as React from 'react';
import Header from '../components/Header';
import { CustomView } from '../components/Styles';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';

export default function LouvoresScreen({navigation, route}) {
    const { logo } = route.params;

    return (
        <View style={{flex:1}}>
            <Header
                title={"DÚVIDAS"} 
                myLeftContainer={(
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{paddingLeft:5, resizeMode:'contain'}}>
                        <Image 
                            style={{width:logo.size, height:logo.size, margin:logo.margim}}
                            source={logo.image}
                        />
                    </TouchableOpacity>   
                )}
            />
             <CustomView style={styles.pageBody}>
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

