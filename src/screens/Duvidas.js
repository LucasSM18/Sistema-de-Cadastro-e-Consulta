import * as React from 'react';
import Themes from '../themes/Themes';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import { CustomView ,Font } from '../components/Styles';
import { StyleSheet, useColorScheme, TouchableOpacity, Image, View } from 'react-native';

export default function DuvidasScreen({navigation, route}) {
    const { logo } = route.params;
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme].subColor || Themes.light.subColor;
    const Duvidas = [
        'Como adicionar louvores ao repertório?', 
        'Como importar novos louvores a lista?', 
        'Como adicionar louvores a lista de favoritos?'
    ]

    return (
        <View style={{flex:1}}>
            <Header
                title={"DÚVIDAS"} 
                myLeftContainer={(
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerComponents}>
                        <Image 
                            style={{width:logo.size, height:logo.size, margin:logo.margim}}
                            source={logo.image}
                        />
                    </TouchableOpacity>   
                )}
            />
             <CustomView style={styles.pageBody}>
                {Duvidas.map((text, index) => (
                    <TouchableOpacity key={index} style={[styles.button , { borderBottomColor:Theme }]} onPress={() => console.log(text)}>
                        <Font style={{fontSize: 20}}>{text}</Font>
                        <Icon name={'controller-play'} type='entypo' color={Theme} size={30}/>
                    </TouchableOpacity>                 
                ))}
             </CustomView>          
        </View> 
    )
}


const styles = StyleSheet.create({
    headerComponents: {
        paddingHorizontal: 5,
        resizeMode: 'contain'
    },

    pageBody: {
        flex:1,
        padding:10,
        height:"100%"
    },

    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
        paddingBottom: 5,
        borderBottomWidth: 1
    }
})

