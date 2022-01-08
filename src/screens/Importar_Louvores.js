import React, { useState } from 'react';
import Themes from '../themes/Themes';
import Card from '../components/Card';
import Header from '../components/Header';
import { CheckBox, Icon } from 'react-native-elements';
// import * as DocumentPicker from 'expo-document-picker';
import { collection, getDocs } from 'firebase/firestore';
import firebaseConnection from '../services/firebaseConnection';
import { CustomView, Search, Font, Flatlist } from '../components/Styles';
import { StyleSheet, TouchableOpacity, useColorScheme, Alert, View, Keyboard } from 'react-native';
import { async } from '@firebase/util';

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

    const getArtistas = async () => {
        const artistas = []
        const results = await getDocs(collection(firebaseConnection.db, 'artistas'))
        results.forEach(artista => {
          artistas.push({
            'id': artista.id,
            ...artista.data()
          })
        });
        return artistas
    }

    const searchHandler = async () => {
        setLouvores([]); 
        if (!result) return 
        
        const resultTrim = result.toLowerCase().trim();
        const Artistas = await getArtistas();

        // console.log(resultTrim)

        Artistas.map(async art => {
            const { id, artista } = art;

            if(!isChecked) searchDefault(id, artista, resultTrim);
            else searchByArtist(id, artista, resultTrim);
        });

        // console.log(songs)
        Keyboard.dismiss();
    }

    const searchDefault = async (id, art, mus) => {
        const music = String(mus).replace(/ |\(|\)/g, '-');
        const artist = String(art).toLowerCase().replace(/ /g, '-');
        const url = `${apiUrl}/${artist}/${music}/`;

        const response = await fetch(url);
        const data = await response.text();

        const titleStart = data.indexOf(`<div class="cnt-head_title">`);
        const lyricsStart = data.indexOf("cnt-letra p402_premium")
        const cifraStart = data.indexOf(`<a href="https://www.cifraclub.com.br/`);

        const title = data.substring(
            titleStart + 33,
            titleStart + data.substring(titleStart).indexOf("</h1>")
        ).replace(/&#39;/g,"'");

        const cifra = data.substring(
            cifraStart + 9,
            cifraStart + data.substring(cifraStart).indexOf(`/"`) + 1
        )

        console.log(cifra)

        const lyrics = data.substring(
            lyricsStart + 25,
            lyricsStart + data.substring(lyricsStart).indexOf("</div>") 
        ).replace('<p>','').replace(/<p>|<\/p>|<br\/>/g,'\n').replace(/&#39;/g,"'");

        if(!['DOCTYPE','html', 'head', 'body', 'JFIF'].some(item => lyrics.includes(item))&&response.status!==400){
            setLouvores(louvores => [
                ...louvores,
                {
                    id: id,
                    titulo: title,
                    cifra: cifra,
                    artista: art,
                    letra: lyrics
                }
            ])
        }        
    }

    const searchByArtist = async (id, art, res) => {        
        if(!isChecked && art.toLowerCase().includes(res)){
            const artist = art.toLowerCase().replace(/ /g, '-');
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

                searchDefault(id, art, mus)
            }
        }
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
                    style={{margin:5}}
                    data={louvores} 
                    renderItem={({item}) => 
                        <Card 
                            name={item.titulo} 
                            complement={item.artista} 
                            content={item.letra} 
                            cifraUrl={item.cifra}
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

