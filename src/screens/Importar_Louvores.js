import React, { useState, useEffect } from 'react';
import Themes from '../themes/Themes';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import * as DocumentPicker from 'expo-document-picker';
import { CustomView, Search, Flatlist } from '../components/Styles';
import { StyleSheet, TouchableOpacity, Platform, useColorScheme, View } from 'react-native';


// const CadastrarLouvores = (louvor) => {
//     console.log(louvor)
//     fetch("http://127.0.0.1:5000/", {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json', 
//             'Content-Type': 'application/json;' 
//         },
//         body: JSON.stringify(louvor)
//     })
//     .then((response) => response.json())
//     .catch(err => { console.log(err) });
    
// }

// const autoIncrement = () => {
//     const [ID, setID] = useState()
//     useEffect(() => {            
//         fetch("http://127.0.0.1:5000/").then(response =>
//             response.json().then(data => {
//                 setID(Math.max.apply(null, data.map(data => data.id)) + 1)                          
//             })  
//         ).catch(err => {
//             console.log(err);
//         });
//     },[]);   

//     return ID;
// }

const UploadFile = async () => {
    let res = await DocumentPicker.getDocumentAsync({type:"application/msword,application/pdf", multiple:true});
    console.log(res);
    alert("Sucesso");
}

export default function ImportaLouvores({navigation, route}) {
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme].subColor || Themes.dark.subColor;
    const { platform } = route.params;
    const [result, setResult] = useState('');   
    const [louvores, setLouvores] = useState([]);
    const api_key = "b002d29b365f405ba68f1c2ed126840b";
    const url = "https://api.vagalume.com.br/search.excerpt?q="+result+"&limit=5";

    useEffect(() => {            
        fetch(url).then(response =>
            response.json().then(data => {
                // data.sort((a, b) => ( a.title > b.title ? 1 : b.title > a.title ? -1 : 0 ));
                if(result){
                    setLouvores(data);
                }    
                console.log(louvores)                                                     
            })  
        ).catch(err => {
            console.log(err);
        });
    },[result]);

    return (
        <View style={styles.bodyStyle}>
            <Header
                title="IMPORTAR MÚSICAS"
                myLeftContainer={(
                    <TouchableOpacity style={ styles.headerComponents } onPress={() => navigation.navigate('Músicas')}>
                        <Icon name={platform + '-arrow-back-outline'} type='ionicon' color='#a6a6a6' size={30}/>
                    </TouchableOpacity>
                )}
                myRightContainer={(
                    <TouchableOpacity style={ styles.headerComponents } onPress={() => UploadFile()}>
                        <Icon name='addfile' type='antdesign' color='#a6a6a6' size={25}/>
                    </TouchableOpacity>
                )}
            />

            <CustomView style={styles.pageBody}>
                <View style={[styles.search, {borderBottomColor:Theme}]}>
                    <Search
                        style={[{ flex:3, fontSize:16 },Platform.OS==='web'?{ outline:'none' }:null]}
                        placeholderTextColor={Theme}
                        placeholder="Digite aqui sua pesquisa..." 
                        autoFocus={true}
                        onChangeText={text => setResult(text)}
                        value={result}
                    />

                    <TouchableOpacity onPress={() => setResult('')} style={{ display:result?'flex':'none' }}>
                        <Icon name='cross' type='entypo' color={Theme} size={25}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ paddingLeft:16 }}>   
                        <Icon name={platform + '-search'} type='ionicon' color={Theme} size={25}/>
                    </TouchableOpacity>
                </View>

                {/* <Flatlist
                    data={louvores} 
                    renderItem={({item}) => <Card name={item.title} complement={item.group} content={item.lyrics}/>} 
                    keyExtractor={item=>item.id.toString()}
                    />
                */}
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
    },

    search: {
        padding:10,
        paddingHorizontal:15,
        height:50,
        borderBottomWidth:1,  
        flexDirection:'row', 
        justifyContent:'space-between'
    },

    bodyStyle: {
        flex:1
    }
})

