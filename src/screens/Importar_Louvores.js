import React, { useState } from 'react';
import Themes from '../themes/Themes';
import Card from '../components/Card';
import Header from '../components/Header';
import { CheckBox, Icon } from 'react-native-elements';
// import * as DocumentPicker from 'expo-document-picker';
import { CustomView, Search, Font, Flatlist } from '../components/Styles';
import { StyleSheet, TouchableOpacity, useColorScheme, Alert, View, Keyboard, DrawerLayoutAndroidComponent } from 'react-native';


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

const Artistas = [
    "Gabriel Guedes", 
    "Isaías Saad", 
    "Israel Salazar",
    "Nivea Soares", 
    "Ton Carfi",
    "Fernandinho",
    "Marcus Salles",
    "Juliano Son",
    "Hillsong Brasil",
    "Preto No Branco",
    "Ministério Mergulhar",
    "Graça Church",
    "Quatro Por Um",
    "Renascer Praise",
    "Lagoinha Worship",
    "Central 3",
    "Casa Worship",
    "Abba Musica",
    "Ministério Morada",
    "Ministério Zoe",
    "Gabriela Rocha",
    "Diante Do Trono", 
    "Isadora Pompeo",
    "Drops GL Adolescentes",
    "Leandro Borges",
    "Leandro Soares",
    "Samuel Messias",
    "David Quinlan",
    "Coral Kemuel",
    "Kleber Lucas",
    "Fernanda Brum",
    "Soraya Moraes",
    "Mariana Valadão",
    "André Valadão",
    "Marine Friesen",
    "Cassiane"
]

// const UploadFile = async () => {
//     const types = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/pdf","application/msword"]
//     const res = await DocumentPicker.getDocumentAsync({});
//     if(types.includes(res.file.type)){                
//           console.log(res.uri)   
//     } else {
//         Alert.alert( 
//             "ARQUIVO INVÁLIDO!", 
//             "Apenas arquivos .DOC, .DOCX e .PDF são aceitos",
//         );      
//     }
// }

//função para setar os louvores

export default function ImportaLouvores({navigation, route}) {
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme] || Themes.light;
    const [result, setResult] = useState('');   
    const [louvores, setLouvores] = useState([]);
    const [isChecked, setChecked] = useState(false);
    const apiUrl = "https://api.codetabs.com/v1/proxy?quest=https://www.letras.mus.br"

    const getPosition = (string, subString, index) => {
        return string.split(subString, index).join(subString).length;
    }

    const searchDefault = async (art, mus) => {
            const music = mus.replaceAll(' ', '-').replaceAll('(', '-').replaceAll(')','-');
            const artist = art.toLowerCase().replaceAll(' ', '-');
            const url = `${apiUrl}/${artist}/${music}/`;

            const response = await fetch(url);
            const data = await response.text();

            const titleStart = data.indexOf(`<div class="cnt-head_title">`);
            const lyricsStart = data.indexOf("cnt-letra p402_premium")

            const title = data.substring(
                titleStart + 33,
                titleStart + data.substring(titleStart).indexOf("</h1>")
            ).replaceAll("&#39;","'")
            
            const lyrics = data.substring(
                lyricsStart + 25,
                lyricsStart + data.substring(lyricsStart).indexOf("</div>") 
            ).replaceAll('<br/>', '\n').replace('<p>','').replaceAll('<p>','\n').replaceAll('</p>','\n').replaceAll("&#39;","'");

            if(!['<!DOCTYPE HTML> <html','JFIF'].some(item => lyrics.includes(item))&&response.status!==400){
                setLouvores(louvores => [
                    ...louvores,
                    {
                        id: title + '-' + art,
                        titulo: title,
                        artista: art,
                        letra: lyrics
                    }
                ])
            }
        
    }

    const searchByArtist = async (art, res) => {        
         if(art.toLowerCase().includes(res)){
            const artist = art.toLowerCase().replaceAll(' ', '-');
            const url = `${apiUrl}/${artist}/mais_acessadas.html`;

            const response = await fetch(url);
            const data = await response.text();

            const listStart = data.indexOf('cnt-list-songs -counter -top-songs js-song-list');

            const items = data.substring(
                listStart,
                listStart + data.substring(listStart).indexOf("</ul>") 
            );

            let i = items.match(/<li/g).length;

            while(i--){
                const itemStart = getPosition(items, "<span>", i+1) + 6;
                const mus = items.substring(
                    itemStart,
                    itemStart + items.substring(itemStart).indexOf("</span>")
                );                

                searchDefault(art, mus)
            }
        }
    }
     
    const searchHandler = async () => {
        setLouvores([]);
        if (!result) return 
        
        const resultTrim = result.toLowerCase().trim()

        // console.log(resultTrim)
        Artistas.map(async art => {
            if(!isChecked) searchDefault(art, resultTrim);
            else searchByArtist(art, resultTrim);
        });

        // console.log(songs)

        Keyboard.dismiss();
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
                // myRightContainer={(
                //     <TouchableOpacity style={ styles.headerComponents } onPress={() => UploadFile()}>
                //         <Icon name='addfile' type='antdesign' color='#a6a6a6' size={25}/>
                //     </TouchableOpacity>
                // )}
            />

            <CustomView style={styles.pageBody}>
                <View style={[styles.search, {borderBottomColor:Theme.subColor}]}>
                    <Search
                        style={{ flex:3, fontSize:16 }}
                        selectionColor={Theme.color}
                        placeholderTextColor={Theme.subColor}
                        placeholder="Pesquisar Louvores..." 
                        onChangeText={text => setResult(text)}
                        value={result}
                    />

                    <TouchableOpacity onPress={() => setResult('')} style={{ display:result?'flex':'none' }}>
                        <Icon name='cross' type='entypo' color={Theme.subColor} size={25}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => searchHandler()} style={{ marginLeft:10 }}>
                        <Icon name={'md-search'} type='ionicon' color={Theme.subColor} size={25}/>
                    </TouchableOpacity>
                </View>
                
                <CheckBox 
                    containerStyle={styles.checkBox} 
                    textStyle={{color:Theme.subColor}}
                    checkedIcon='check-square-o'
                    uncheckedIcon='square-o'
                    title="Pesquisar por artista"
                    checked={isChecked}
                    checkedColor={Theme.subColor}
                    onPress={() => setChecked(!isChecked)}
                />

                <Flatlist
                    style={{padding:10}}
                    data={louvores} 
                    renderItem={({item}) => 
                        <Card 
                            name={item.titulo} 
                            complement={item.artista} 
                            content={item.letra} 
                            caretFunction={()=> route.params.addLouvor(item)}
                            add={true}
                        />
                    } 
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
    },

    checkBox: {
        backgroundColor: 'transparent', 
        borderWidth:0, 
        paddingHorizontal:2
    }
})

