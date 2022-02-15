import React, { useState } from 'react';
import Themes from '../themes/Themes';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Header from '../components/Header';
import { CheckBox, Icon } from 'react-native-elements';
import { collection, getDocs } from 'firebase/firestore';
import firebaseConnection from '../services/firebaseConnection';
import { CustomView, Search, Font, Flatlist } from '../components/Styles';
import { StyleSheet, TouchableOpacity, useColorScheme, View, Keyboard } from 'react-native';

const emptyList = (content) => {
    return <Font style={{ fontSize:20, alignSelf:'center', marginTop:'2%' }}>{content}</Font>   
}

//função para setar os louvores
export default function ImportaLouvores({navigation, route}) {
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme] || Themes.light;
    const [result, setResult] = useState('');   
    const [louvores, setLouvores] = useState([]);
    const [loaded, setLoaded] = useState(true);
    const [notFound, setNotFound] = useState('')
    const [isChecked, setChecked] = useState(false);
    const apiUrl = "https://api.codetabs.com/v1/proxy?quest=https://www.letras.mus.br"
    // const delay = ms => new Promise(res => setTimeout(res, ms));

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
        setNotFound('');
        Keyboard.dismiss(); 
        if (!result) return 

        setLoaded(false);
        const resultTrim = result.trim();
        const Artistas = await getArtistas();       
    
        // console.log(length)

        await Promise.all(Artistas.map(async art => {
            const { id, artista } = art;            

            if(isChecked) await searchByArtist(artista, resultTrim);
            else await searchDefault(id, artista, resultTrim);

            return;
        }));

        setLoaded(true);
        if(!louvores.length) setNotFound('Nenhum resultado de pesquisa');
        return;
    }

    const searchDefault = async (id, art, mus) => {
        const music = formatString(mus);
        const artist = formatString(art);
        const url = `${apiUrl}/${artist}/${music}/`;

        const response = await fetch(url);

        if(response.status < 400){
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

            const lyrics = data.substring(
                lyricsStart + 25,
                lyricsStart + data.substring(lyricsStart).indexOf("</div>") 
            ).replace('<p>','').replace(/<p>|<\/p>|<br\/>/g,'\n').replace(/&#39;/g,"'");

            const handler = ['DOCTYPE','html', 'head', 'body', 'JFIF'].some(item => title.includes(item) || lyrics.includes(item));

            const filter = !isChecked ? title.toLowerCase().includes(mus.toLowerCase()) || lyrics.toLowerCase().includes(mus.toLowerCase()) : true  

            if(!handler && lyrics.length > 100 && filter){
                // const titleFormat = formatString(title);
                // const artistFormat = formatString(art);
                setLouvores(louvores => [
                    ...louvores,
                    {
                        id: art + id,
                        titulo: title,
                        cifra: cifra,
                        artista: art,
                        letra: lyrics
                    }
                ])
            }
        }        
        return;
    }

    const searchByArtist = async (art, res) => {        
        if(art.toLowerCase().includes(res.toLowerCase())){
            const artist = formatString(art);
            const url = `${apiUrl}/${artist}/mais_acessadas.html`;
           
            const response = await fetch(url);
            const data = await response.text();

            if(response.status>400||data.includes('JFIF')) return

            const listStart = data.indexOf('cnt-list-songs -counter -top-songs js-song-list');

            const items = data.substring(
                listStart,
                listStart + data.substring(listStart).indexOf("</ul>") 
            );

            // console.log(items)

            let  i = 0;
            let preview = null;

            // console.log(i)

            while(i <= 20){
                ++i;
                const itemStart = getPosition(items, "<span>", i) + 6;
                // console.log(itemStart);

                if(itemStart===preview) break;
                
                const mus = items.substring(
                    itemStart,
                    itemStart + items.substring(itemStart).indexOf("</span>")
                );                
                
                // console.log(art + " - " + mus)
                // if(i % 50 === 0) await delay(5000);

                await searchDefault(i, art, mus)
                preview = itemStart;
            }
        } 
        return;       
    }

    const getPosition = (string, subString, index) => {
        return string.split(subString, index).join(subString).length;
    }

    const formatString = (string) => {
        return String(string).replace(/%C3%A9/g, 'e').replace(/&#39;/g,"'").replace(/%C3%A3/g, 'a').replace(/ |\(|\)/g, '-').replace(/\?|\!|\.|\'/g, "")
    }

    const sortedList = (list) => {
        if(isChecked) return list.sort((a,b) => a.titulo > b.titulo ? 1 : b.titulo > a.titulo ? -1 : 0 ); 
        const resultTrim = result.trim().toLowerCase();
        return list.sort((a,b) => b.titulo > a.titulo && a.titulo.toLowerCase().includes(resultTrim) ? -1 : 
                                  a.titulo > b.titulo && b.titulo.toLowerCase().includes(resultTrim) ? 1 : 0 ); 
    }
     
    return (
        <View style={{flex:1}}>
            {!loaded && <Modal/>}
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
                    data={sortedList(louvores)} 
                    renderItem={({item}) => 
                        <Card 
                            name={item.titulo} 
                            complement={item.artista} 
                            content={item.letra} 
                            cifraUrl={item.cifra}
                            icon="add"
                            iconType="material"
                            caretFunction={() => route.params.addLouvor(item) }
                            add={true}
                        />
                    }    
                    ListEmptyComponent={emptyList(notFound)}
                    keyExtractor={(item)=>item.id.toString()}
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
    },
})

