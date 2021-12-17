import React from 'react';
import Themes from '../themes/Themes';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import * as DocumentPicker from 'expo-document-picker';
import { CustomView, Search, CustomButtom } from '../components/Styles';
import { StyleSheet, TouchableOpacity, useColorScheme, Text, View } from 'react-native';

const UploadFile = async () => {
    let res = await DocumentPicker.getDocumentAsync({type:"application/msword,application/pdf", multiple:true});
    console.log(res);
    alert("Sucesso");
}

export default function EditarLouvor({navigation, route}) {
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme].subColor || Themes.light.subColor;
    const Inputs = ["Louvor...", "Artista/Banda..."]
    const louvor = [ route.params.title, route.params.group, route.params.link ]
    const { lyrics } = route.params;

    return (
        <View style={{flex:1}}>
            <Header
                title="EDITAR MÚSICA"
                myLeftContainer={(
                    <TouchableOpacity style={ styles.headerComponents } onPress={() => navigation.goBack()}>
                        <Icon
                            name={'md-arrow-back-outline'} 
                            type='ionicon'
                            color='#a6a6a6'
                            size={30}
                        />
                    </TouchableOpacity>
                )}
                myRightContainer={(
                    <TouchableOpacity style={ styles.headerComponents } onPress={() => UploadFile()}>
                        <Icon name='file-edit-outline' type='material-community' color='#a6a6a6' size={30}/>
                    </TouchableOpacity>
                )}
            />

            <CustomView style={styles.formArea}>  
                {Inputs.map((elements, index) => (
                    <Search
                        key={index}
                        style={[ styles.textInput, { height:50, borderBottomColor:Theme } ]}   
                        placeholderTextColor={Theme}
                        placeholder={elements}       
                        value={louvor[index]}                
                    />
                ))}

                <Search
                    style={[ styles.textInput, { height:310, borderBottomColor:Theme, textAlignVertical:'top' } ]}   
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
    }
})

