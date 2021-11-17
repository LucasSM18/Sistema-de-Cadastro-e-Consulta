import React, { useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar'
import * as DocumentPicker from 'expo-document-picker';
import { CheckBox, Icon } from 'react-native-elements';
import { CustomView, Font } from '../components/Styles';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';

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

const SelectFile = () => {
    return(
        <CustomView style={styles.pageBody}>
            <View style={styles.container}>
                <TouchableOpacity style={{alignItems:'center'}} onPress={UploadFile}>
                    <Icon
                        name='file-o'
                        type='font-awesome'
                        color='#a6a6a6'
                        size={70}
                    />                    
                    <Font style={{ margin:20, fontSize:14, fontWeight:'bold' }}>CLIQUE AQUI PARA IMPORTAR SEUS ARQUIVOS</Font>                                  
                </TouchableOpacity>
            </View>              
        </CustomView>
        
    )
}

const Repositorio = () => {
    const [checked, setChecked] = useState({})

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
                            textStyle={{color:'#a6a6a6'}}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            title={checkBox.title}
                            checked={!isChecked}
                            checkedColor='#a6a6a6'
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
    const teste = false;
    const { platform, logo } = route.params

    return (
        <View style={styles.bodyStyle}>
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

            {teste?(<Repositorio/>):(<SelectFile/>)}
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

