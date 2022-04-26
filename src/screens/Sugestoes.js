import * as React from 'react';
import Themes from '../themes/Themes';
import Header from '../components/Header';
import { CustomView, CustomButtom, Search } from '../components/Styles';
import firebaseConnection from '../services/firebaseConnection';
import { collection, addDoc } from 'firebase/firestore';
import CustomisableAlert, { showAlert } from 'react-native-customisable-alert';
import { StyleSheet, useColorScheme, TouchableOpacity, Text, Image, View } from 'react-native';

export default function DuvidasScreen({navigation, route}) {
    const { logo } = route.params;
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme] || Themes.light;
    const [sugestão, setSugestão] = React.useState("");
    const input = React.useRef(null);

    React.useEffect(() => {
        input.current.focus();
    }, []);

    const addSugestao = async () => {
        try {     
            if(sugestão){
                await addDoc(collection(firebaseConnection.db, 'sugestoes'), {sugestao: sugestão})

                showAlert({
                    title: "Sugestão Enviada",
                    message: "A sugestão foi enviada para os administradores, muito obrigado pela contribuição!",
                    alertType: "success",
                });
                setSugestão("")
            }
        }
        catch(err) {
            showAlert({
                title: "ERROR!",
                message: 'Houve um erro ao tentar enviar, tente novamente mais tarde',
                alertType: "error",
            });
        }
    }
    return (
        <View style={{flex:1}}>
            <CustomisableAlert
                alertContainerStyle={{backgroundColor:"#000000", width:"85%"}} 
                titleStyle={{color:"white", fontSize:20, fontWeight:"bold"}} 
                textStyle={{color:"white", fontSize:15}}
                btnLabelStyle={{textTransform:"uppercase"}}
                dismissable={true}
            />
            <Header
                title={"SUGESTÕES"} 
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
                <Search
                    style={[ styles.textInput, { borderBottomColor:Theme.subColor, textAlignVertical:'top' } ]}
                    autoFocus={true}
                    ref={input}
                    multiline={true} 
                    selectionColor={Theme.color}
                    placeholderTextColor={Theme.subColor}
                    placeholder={"Sugestões para o aplicativo..."}                  
                    value={sugestão}   
                    onChangeText={text => setSugestão(text)}
                />             

                <CustomButtom onPress={() => addSugestao()}>
                    <Text style={styles.textbuttom}>ENVIAR</Text>
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

    pageBody: {
        flex:1,
        
        padding:"4%",
        height:"100%"
    },

    textInput: {        
        padding:10,
        marginBottom:30,
        fontSize:16, 
        borderBottomWidth:1
    },

    textbuttom: {
        color:'#fff',
        fontSize:15
    }
})

