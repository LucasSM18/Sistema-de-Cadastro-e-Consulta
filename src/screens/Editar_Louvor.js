import React from 'react';
import Themes from '../themes/Themes';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import { CustomView, Search, CustomButtom } from '../components/Styles';
import { StyleSheet, TouchableOpacity, Platform, useColorScheme, Text, View } from 'react-native';


export default function EditarLouvor({navigation, route}) {
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme].subColor || Themes.dark.subColor;
    const Inputs = ["Louvor...", "Artista/Banda...", "Youtube (Opcional)..."]
    const louvor = [ route.params.title, route.params.group, route.params.link ]
    const { platform, lyrics } = route.params;

    return (
        <View style={styles.bodyStyle}>
            <Header
                title="EDITAR MÚSICA"
                myLeftContainer={(
                    <TouchableOpacity style={ styles.headerComponents } onPress={() => navigation.goBack()}>
                        <Icon
                            name={platform + '-arrow-back-outline'} 
                            type='ionicon'
                            color='#a6a6a6'
                            size={30}
                        />
                    </TouchableOpacity>
                )}
            />

            <CustomView style={styles.formArea}>  
                {Inputs.map((elements, index) => (
                    <Search
                        key={index}
                        style={[ styles.textInput, { height:50, borderBottomColor:Theme }, Platform.OS==='web'?{ outline:'none' }:null ]}   
                        placeholderTextColor={Theme}
                        placeholder={elements}       
                        value={louvor[index]}                
                    />
                ))}

                <Search
                    style={[ 
                        styles.textInput, 
                        { height:300, borderBottomColor:Theme, textAlignVertical:'top' }, 
                        Platform.OS==='web'?{ outline:'none' }:null 
                    ]}   
                    multiline={true}
                    placeholderTextColor={Theme}
                    placeholder={"Letra da Musica..."}                  
                    value={lyrics}   
                />

                <CustomButtom style={styles.button}>                    
                    <Text style={{color:'#fff'}}>Editar</Text>                       
                </CustomButtom>                              
            </CustomView>     
        </View>        
    )
}

const styles = StyleSheet.create({
    headerComponents: {
        paddingHorizontal: 15,
        resizeMode: 'contain'
    },

    formArea: {
        padding:20,
        paddingHorizontal:15,
    },

    textInput: {        
        padding:10,
        marginBottom:30,
        fontSize:16, 
        borderBottomWidth:1, 
    },

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
    },

    bodyStyle: {
        flex:1
    }
})

