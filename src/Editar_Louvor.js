import React, {useState} from 'react';
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
    const [louvor, setLouvor] = useState({
        id: route.params.id,
        title: route.params.title,
        group: route.params.group,
        link: route.params.link,
        lyrics: route.params.lyrics
    })

    const updateHandler = () => {
        route.params.updateLouvor(louvor)
        navigation.goBack()
    }

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
                    <Search
                        style={[ styles.textInput, { height:50, borderBottomColor:Theme } ]}   
                        placeholderTextColor={Theme}
                        placeholder={'Título'}       
                        value={louvor.title}    
                        onChangeText={(text)=>{
                            console.log(text)
                            setLouvor({...louvor, title: text})}
                        }            
                    />
                
                    <Search
                        style={[ styles.textInput, { height:50, borderBottomColor:Theme } ]}   
                        placeholderTextColor={Theme}
                        placeholder={'Ministério'}       
                        value={louvor.group}    
                        onChangeText={(text)=> setLouvor({...louvor, group: text})}            
                    />

                <Search
                    style={[ styles.textInput, { height:310, borderBottomColor:Theme, textAlignVertical:'top' } ]}   
                    multiline={true}
                    placeholderTextColor={Theme}
                    placeholder={"Letra da Musica..."}                  
                    value={louvor.lyrics}   
                    onChangeText={text=> setLouvor({...louvor, lyrics: text })}
                />

                <CustomButtom style={styles.button} onPress={() => updateHandler()}>                    
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

