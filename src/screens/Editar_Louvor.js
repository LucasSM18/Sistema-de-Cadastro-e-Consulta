import React, {useState} from 'react';
import Themes from '../themes/Themes';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
// import * as DocumentPicker from 'expo-document-picker';
import { CustomView, Search } from '../components/Styles';
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';


// const UploadFile = async () => {
//     let res = await DocumentPicker.getDocumentAsync({type:"application/msword,application/pdf", multiple:true});
//     console.log(res);
//     alert("Sucesso");
// }

export default function EditarLouvor({navigation, route}) {
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme] || Themes.light;
    const [louvor, setLouvor] = useState({
        id: route.params.id,
        title: route.params.title,
        group: route.params.group,
        cipher: route.params.cipher,
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
                // myRightContainer={(
                //     <TouchableOpacity style={ styles.headerComponents } onPress={() => UploadFile()}>
                //         <Icon name='file-edit-outline' type='material-community' color='#a6a6a6' size={30}/>
                //     </TouchableOpacity>
                // )}
                complement={( 
                    <TouchableOpacity onPress={() => updateHandler()} style={styles.headerComponents}>
                        <Icon
                            name={'send'} 
                            type="material-community"
                            color='#a6a6a6'
                            size={25}
                        />
                    </TouchableOpacity>
                )}
            />

            <CustomView style={styles.formArea}>  
                    <Search
                        style={[ styles.textInput, { flex:1, borderBottomColor:Theme.subColor, borderBottomWidth:1 } ]}   
                        placeholderTextColor={Theme.subColor}
                        placeholder={'Título'}     
                        selectionColor={Theme.color} 
                        value={louvor.title}    
                        onChangeText={(text)=>{
                            console.log(text)
                            setLouvor({...louvor, title: text})}
                        }            
                    />
                
                    <Search
                        style={[ styles.textInput, { flex:1, borderBottomColor:Theme.subColor, borderBottomWidth:1 } ]}   
                        placeholderTextColor={Theme.subColor}
                        placeholder={'Ministério'}       
                        selectionColor={Theme.color}
                        value={louvor.group}    
                        onChangeText={(text)=> setLouvor({...louvor, group: text})}            
                    />

                    <Search
                        style={[ styles.textInput, { flex:1, borderBottomColor:Theme.subColor, borderBottomWidth:1 } ]}   
                        placeholderTextColor={Theme.subColor}
                        placeholder={'Cifras (Opcional)'}
                        selectionColor={Theme.color}       
                        value={louvor.cipher}    
                        onChangeText={(text)=> setLouvor({...louvor, cipher: text})}            
                    />

                    <Search
                        style={[ styles.textInput, { flex:10, borderColor:Theme.subColor,  borderRadius:4, borderWidth:1 } ]}   
                        multiline={true}
                        placeholderTextColor={Theme.subColor}
                        placeholder={"Letra da Musica..."}
                        selectionColor={Theme.color}                  
                        value={louvor.lyrics}   
                        onChangeText={text=> setLouvor({...louvor, lyrics: text })}
                    />

                {/* <CustomButtom style={styles.button} onPress={() => updateHandler()}>                    
                    <Text style={{color:'#fff'}}>Editar</Text>                       
                </CustomButtom>                               */}
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
        flex:1,
        padding:20,
        paddingHorizontal:15,
    },

    textInput: {        
        padding:10,
        marginBottom:30,
        fontSize:16,
    }
})

