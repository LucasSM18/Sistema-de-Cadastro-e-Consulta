import React, { useState } from 'react';
import Themes from '../themes/Themes';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar'
import * as DocumentPicker from 'expo-document-picker';
import { CheckBox, Icon } from 'react-native-elements';
import { CustomView, Subfont } from '../components/Styles';
import { StyleSheet, TouchableOpacity, useColorScheme, Image, View } from 'react-native';

const checkBoxes = [
    { id: 1, title: 'Imagem' },
    { id: 2, title: 'Video' },
    { id: 3, title: 'Texto' },
    { id: 4, title: 'Áudio' }
]

const UploadFile = async () => {
    let res = await DocumentPicker.getDocumentAsync({type:"*/*", multiple:true});
    console.log(res);
    alert("Sucesso");
}

const SelectFile = (props) => {
    return(
        <CustomView style={styles.pageBody}>
            <View style={styles.container}>
                <TouchableOpacity style={{alignItems:'center'}} onPress={UploadFile}>
                    <Icon
                        name='file-o'
                        type='font-awesome'
                        color={props.theme}
                        size={70}
                    />                    
                    <Subfont style={{ margin:20, fontSize:14, fontWeight:'bold' }}>CLIQUE AQUI PARA IMPORTAR SEUS ARQUIVOS</Subfont>                                  
                </TouchableOpacity>
            </View>              
        </CustomView>
        
    )
}

const Repositorio = (props) => {
    const [checked, setChecked] = useState({});

    return (
        <CustomView>
            <View style={styles.checkBoxContainer}>
                {checkBoxes.map(checkBox => {
                    const isChecked = checked[checkBox.id];                    
                    return(
                        <CheckBox 
                            center
                            key={checkBox.id} 
                            containerStyle={{backgroundColor: 'transparent', borderWidth:0}} 
                            textStyle={{color:props.theme}}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            title={checkBox.title}
                            checked={!isChecked}
                            checkedColor={props.theme}
                            onPress={() => setChecked({...checked, [checkBox.id]:!isChecked})}
                        />
                    )
                })}
            </View>
        </CustomView>
    )
}

export default function Repertorio({navigation, route}) {    
    const [shouldShow, setShouldShow] = useState(false);
    const { platform, logo } = route.params
    const teste = false;
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme].subColor || Themes.light.subColor;
    
    return (
        <View style={{flex:1}}>
            {shouldShow?(
                <SearchBar 
                    // onChange={value => setFilter(value)}
                    leftComponent={
                        <TouchableOpacity onPress={() => setShouldShow(!shouldShow)}>     
                            <Icon
                                name={platform + '-arrow-back-outline'} 
                                type='ionicon'
                                color='#a6a6a6'
                                size={30}
                            />
                        </TouchableOpacity>                                         
                    }
                />
            ):( 
                <Header
                    title="MÍDIA"
                    myLeftContainer={(
                        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{paddingLeft:5, resizeMode:'contain'}}>
                            <Image 
                                style={{width:logo.size, height:logo.size, margin:logo.margim}}
                                source={logo.image}
                            />                        
                        </TouchableOpacity>   
                    )}
                    myRightContainer={
                        teste?(
                            <TouchableOpacity 
                                onPress={() => setShouldShow(!shouldShow)}  
                                style={styles.headerComponents}
                            >
                                <Icon
                                    name={platform + '-search'} 
                                    type='ionicon'
                                    color='#a6a6a6'
                                    size={25}
                                />
                            </TouchableOpacity> 
                        ):null                              
                    }
                />
            )}

            {teste?(<Repositorio theme={Theme}/>):(<SelectFile theme={Theme}/>)}
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
        height:"100%",
        alignItems:'center',
        justifyContent:'center',
    },

    container: {
        alignItems:'center',
        justifyContent:'center',
    },

    checkBoxContainer: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        margin:10,
        borderBottomWidth:1,
        borderBottomColor:'#a6a6a6'
    }
})

