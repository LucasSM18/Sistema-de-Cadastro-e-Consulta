import React, { useState } from 'react';
import Themes from '../themes/Themes';
import Card from '../components/Card';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import * as DocumentPicker from 'expo-document-picker';
import { CustomView, Search, Font, Flatlist } from '../components/Styles';
import { StyleSheet, TouchableOpacity, useColorScheme, Alert, View } from 'react-native';


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

const api_key = "b002d29b365f405ba68f1c2ed126840b";

const Artistas = [
    "Gabriel Guedes", 
    "Isaias Saad", 
    "Israel Salazar",
    "Nívea Soares", 
    "Ton Carfi",
    "Fernandinho",
    "Marcus Salles",
    "Hillsong em Português",
    "Central 3",
    "Casa Worship",
    "Ministério Morada",
    "Ministério Zoe",
    "Livres Para Adorar",
    "Gabriela Rocha",
    "Diante do Trono", 
    "Isadora Pompeo",
    "Gl Adolescentes",
    "Leandro Borges",
    "Kemuel",
    "Kleber Lucas",
    "Fernanda Brum",
    "Soraya Moraes",
    "Mariana Valadão",
    "André Valadão",
    "Marine Friesen",
    "Cassiane"
]

const UploadFile = async () => {
    const types = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/pdf","application/msword"]
    const res = await DocumentPicker.getDocumentAsync({});
    if(types.includes(res.file.type)){                
          console.log(res.uri)   
    } else {
        Alert.alert( 
            "ARQUIVO INVÁLIDO!", 
            "Apenas arquivos .DOC, .DOCX e .PDF são aceitos",
        );      
    }
}

const emptyList = (content) => {
    return  <Font style={{ fontSize:20, alignSelf:'center', marginTop:'2%' }}>{content}</Font>    
}

export default function ImportaLouvores({navigation}) {
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme] || Themes.light;
    const [result, setResult] = useState('');   
    const [notFound, setNotFound] = useState('')
    const [louvores, setLouvores] = useState([]);
    
    const search = () => {   
        setNotFound('')
        setLouvores([])
        Artistas.map(artista => {
            let url = `https://api.vagalume.com.br/search.php?art=${artista}&mus=${result}&apikey=${api_key}`;
            fetch(url).then(response =>
                response.json().then(data => {
                    if(data.type!=="song_notfound"){
                        data.mus.map(mus => {
                            setLouvores(louvores => [
                                ...louvores,
                                {
                                    id: mus.id,
                                    titulo: mus.name,
                                    artista: data.art.name,
                                    letra: mus.text
                                }
                            ]);
                        });             
                    }                              
                })  
            ).catch(() => {
                setNotFound("Nenhum resultado encontrado");
            });
        });
    }
    
    return (
        <View style={{flex:1}}>
            <Header
                title="IMPORTAR MÚSICAS"
                myLeftContainer={(
                    <TouchableOpacity style={ styles.headerComponents } onPress={() => navigation.goBack()}>
                        <Icon name={'md-arrow-back-outline'} type='ionicon' color='#a6a6a6' size={30}/>
                    </TouchableOpacity>
                )}
                myRightContainer={(
                    <TouchableOpacity style={ styles.headerComponents } onPress={() => UploadFile()}>
                        <Icon name='addfile' type='antdesign' color='#a6a6a6' size={25}/>
                    </TouchableOpacity>
                )}
            />

            <CustomView style={styles.pageBody}>
                <View style={[styles.search, {borderBottomColor:Theme.subColor}]}>
                    <Search
                        style={{ flex:3, fontSize:16 }}
                        selectionColor={Theme.color}
                        placeholderTextColor={Theme.subColor}
                        placeholder="Digite aqui sua pesquisa..." 
                        onChangeText={text => setResult(text)}
                        value={result}
                    />

                    <TouchableOpacity onPress={() => setResult('')} style={{ display:result?'flex':'none' }}>
                        <Icon name='cross' type='entypo' color={Theme.subColor} size={25}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => search()} style={{ marginLeft:10 }}>
                        <Icon name={'md-search'} type='ionicon' color={Theme.subColor} size={25}/>
                    </TouchableOpacity>
                </View>
                
                <Flatlist
                    data={louvores} 
                    ListEmptyComponent={emptyList(notFound)}
                    renderItem={({item}) => <Card name={item.titulo} complement={item.artista} content={item.letra}/>} 
                    keyExtractor={(item)=>item.id}
                />            
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
    }
})

