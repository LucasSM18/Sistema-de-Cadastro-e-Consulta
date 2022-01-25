import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import Card from '../components/Card'; 
import SearchBar from '../components/SearchBar'
import { Icon } from 'react-native-elements';
import { Flatlist, Font } from '../components/Styles';
import { StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Image, Alert, Keyboard } from 'react-native';
import firebaseConnection from '../services/firebaseConnection';
import { collection, getDocs, getDoc, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


console.disableYellowBox = true;

const emptyList = (content) => {
    return  <Font style={{ fontSize:20, alignSelf:'center', marginTop:'2%' }}>{content}</Font>    
}

export default function LouvoresScreen({navigation, route}) {
    const [shouldShow, setShouldShow] = useState(false);
    const [filter, setFilter] = useState('');    
    const [louvores, setLouvores] = useState([]);
    const [notFound, setNotFound] = useState('');
    const { logo } = route.params

    const deleteLouvor = async ({keyID, name}) => {
        try {               
            await deleteDoc(doc(firebaseConnection.db, 'louvores', keyID))
            Alert.alert(
                "Exclusão de Louvor",
                `"${name}" excluído com sucesso!`
            )   
            await getData()

        }
        catch(err) {
            Alert.alert(
                "Erro",
                `${err}: Ocorreu um erro e não foi possível excluir o louvor no momento. Tente novamente mais tarde`
            )
        }
    }


    const updateLouvor = async (louvor) => {        
        const docRef = doc(firebaseConnection.db, "louvores", louvor.id)

        await updateDoc(docRef, {
            title: louvor.title,
            group: louvor.group,
            lyrics: louvor.lyrics
        })
        Alert.alert(
            "Alteração de Louvor",
            "Sucesso!😁 "
        )

        await getData()

    }

    const getData = async () => {
        const querySnapshot = await getDocs(collection(firebaseConnection.db, 'louvores'));
        const data = [];
        querySnapshot.forEach((doc)=> {
            data.push({
                id: doc.id,
                ...doc.data()
            })
        })

        if(filter){
            if(filter.length > 2){
                data.sort((a, b) => ( 
                        a.title.toLowerCase().includes(filter.toLowerCase()) ? -1 
                    : 
                        b.title.toLowerCase().includes(filter.toLowerCase()) ? 1 : 0 
                ));
            }

            setLouvores(
                data.filter(item => 
                    (
                        item.title.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
                        item.group.toLowerCase().indexOf(filter.toLowerCase()) > -1 || 
                        item.lyrics.toLowerCase().indexOf(filter.toLowerCase()) > -1 
                    )
                )
            );    
        }else{
            data.sort((a, b) => ( a.title > b.title ? 1 : b.title > a.title ? -1 : 0 ));
            setLouvores(data); 
        }
        if(!notFound) setNotFound('Nenhum resultado encontrado')
        return
    }

    //função para enviar os louvores para o repertório
    const sendLouvor = async (props) => {
        const docRef = await doc(firebaseConnection.db, 'repertorio', 'sabado')
        const docLouvor = await getDoc(docRef)
        if (docLouvor.exists()) {
            const louvor = {...docLouvor.data()}
            let hasMusic = !louvor.musics.some(music=> {
                return music.id === props.keyID
            })
            if (hasMusic) {

                louvor.musics.push({
                    id: props.keyID,
                    title: props.name,
                    cipher: props.cifraUrl,
                    group: props.complement,
                    lyrics: props.content
                })
                
                const newDoc = {...docLouvor.data(), musics: louvor.musics}
 
            
                await updateDoc(docRef, newDoc)
                
                Alert.alert("Repertório",
                "Louvor adicionado com sucesso ao repertório 🎉")
               
            }
            else {
                Alert.alert("Repertório",
                `O louvor "${props.name}" já está no repertório!`)
            }
        }
        return
    }    

    const addLouvor = async (louvor) => {
                        
        const newLouvor = {
            title: louvor.titulo,
            group: louvor.artista,
            cipher: louvor.cifra,
            lyrics: louvor.letra
        }
    
        try {
            await addDoc(collection(firebaseConnection.db, 'louvores'), newLouvor)
            Alert.alert("Novo louvor",
            `"${louvor.titulo}" adicionado com sucesso! 🎉`)

            
            await getData()
        }
        catch(err) {
            Alert.alert('Houve um erro ao tentar adicionar esse louvor! Tente novamente mais tarde')
            console.log(err)
        }

    }

    useEffect(() => {       
        async function loadLouvores() {
            await getData();
        }

        loadLouvores()
        return
             
    },[filter]);
        

    useEffect(()=> {
        async function loadFavs() {
            await getFavoritosList()
        }
        loadFavs()
    }, [])

    const Louvores = ({ filter, louvores }) => {  
        setFilter(filter)
        return (        
            <TouchableWithoutFeedback onPress={() => setShouldShow(false)}>
                <Flatlist
                    style={styles.pageBody}
                    data={louvores} 
                    renderItem={({item}) => 
                        <Card 
                            keyID={item.id} 
                            name={item.title} 
                            complement={item.group} 
                            content={item.lyrics} 
                            cifraUrl={item.cipher}
                            editableRoute={navigation}
                            addFavorites={true}
                            icon="playlist-music-outline"
                            iconType="material-community"
                            deleteLouvor={deleteLouvor}
                            updateLouvor={updateLouvor}
                            caretFunction={sendLouvor}
                            favfunc={getFavoritosList}
                            updateFunc={getData}
                            
                        />
                    } 
                    ListEmptyComponent={emptyList(notFound)}
                    keyboardShouldPersistTaps="handled" 
                    keyExtractor={item=>item.id.toString()}
                />        
            </TouchableWithoutFeedback>
        );
    };   
    
    const getFavoritosList = async() => {
        try {
            const fav = await AsyncStorage.getItem('@favoritos');
            
            return fav ? JSON.parse(fav) : []
        }
        catch(err) {
            Alert.alert('Erro', `Erro de conexão. Entre em contato com o adminstrador! ${err}`)
        }
    }

    const Favoritos = ({ filter, favoritos }) => {
        const [favList, setFavList] = useState(favoritos);
        setFilter(filter);

        const searchFavorites = async () => {
            if(!filter){
                favoritos.sort((a, b) => ( a.title > b.title ? 1 : b.title > a.title ? -1 : 0 ));
                setFavList(favoritos);                
                return;
            } 

            if(filter.length > 2){
                favoritos.sort((a, b) => ( 
                        a.title.toLowerCase().includes(filter.toLowerCase()) ? -1 
                    : 
                        b.title.toLowerCase().includes(filter.toLowerCase()) ? 1 : 0 
                ));
            }
            
            setFavList(favoritos.filter(item => 
                (
                    item.title.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
                    item.group.toLowerCase().indexOf(filter.toLowerCase()) > -1 || 
                    item.lyrics.toLowerCase().indexOf(filter.toLowerCase()) > -1 
                )
            ));            
        }

        const removeFavoritos = async({keyID}) => {
            try {               
                const favs = await getFavoritosList();
                const removeFav = favs.findIndex(({id}) => id === keyID);
                favs.splice(removeFav, 1);
                
                await AsyncStorage.removeItem('@favoritos');
                await AsyncStorage.setItem('@favoritos', JSON.stringify(favs))

                Alert.alert(
                    "Remoção do Louvor da lista",
                    `"${name}" removido com sucesso!😁'`
                )   
    
            }
            catch(err) {
                Alert.alert(
                    "Erro",
                    `${err}: Ocorreu um erro e não foi possível remover o louvor da lista no momento. Tente novamente mais tarde`
                )
            }
        }

        useEffect(() => {
            async function filterFavs() {
                await searchFavorites();
            }

            filterFavs();
            return;
        },[filter])

        return (                   
            <TouchableWithoutFeedback onPress={() => setShouldShow(false)}>
               <Flatlist
                    style={styles.pageBody}
                    data={favList} 
                    renderItem={({item}) => 
                        <Card 
                            keyID={item.id} 
                            name={item.title} 
                            complement={item.group} 
                            content={item.lyrics} 
                            cifraUrl={item.cipher}
                            // editableRoute={navigation}
                            addFavorites={false}
                            icon="playlist-music-outline"
                            iconType="material-community"
                            deleteLouvor={removeFavoritos}
                            // updateLouvor={updateLouvor}
                            caretFunction={sendLouvor}
                            updateFunc={getData}
                        />
                    } 
                    ListEmptyComponent={emptyList(notFound)}
                    keyboardShouldPersistTaps="handled" 
                    keyExtractor={(item, idx) => idx}
                />        
            </TouchableWithoutFeedback>
        );
    };    

    return (
        <View style={{flex:1}}>       
            {shouldShow? 
                (
                    <SearchBar 
                        onChange={value => setFilter(value)}
                        leftComponent={
                            <TouchableOpacity onPress={() => setShouldShow(!shouldShow)}>     
                                <Icon
                                    name={'md-arrow-back-outline'} 
                                    type='ionicon'
                                    color='#a6a6a6'
                                    size={30}
                                />
                            </TouchableOpacity>                                         
                        }
                    />
                ):
                (
                    <Header
                        title="MÚSICAS" 
                        myLeftContainer={(
                            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{paddingLeft:5, resizeMode:'contain'}}>
                                <Image 
                                    style={{width:logo.size, height:logo.size, margin:logo.margim}}
                                    source={logo.image}
                                />
                            </TouchableOpacity>   
                        )}
                        myRightContainer={
                            <TouchableOpacity onPress={() => setShouldShow(!shouldShow)} style={styles.headerComponents}>
                                <Icon
                                    name={'md-search'} 
                                    type='ionicon'
                                    color='#a6a6a6'
                                    size={25}
                                />
                            </TouchableOpacity>                               
                        }
                        complement={                
                            <TouchableOpacity onPress={() => navigation.navigate('Repertório', {goBack:true})} style={ styles.headerComponents }>
                                <Icon
                                    name="playlist-music-outline" 
                                    type='material-community'
                                    color='#a6a6a6'
                                    size={35}
                                />
                            </TouchableOpacity>                
                        }            
                    />     
                )
            }            
            <TabBar 
                name={['Favoritos','Louvores']} 
                route={[Favoritos,Louvores]} 
                type='ionicon'
                filter={filter}
                disable={shouldShow}
                louvores={louvores}
                getFavoritosList={getFavoritosList}
                setLouvores={setLouvores}
                addLouvor={addLouvor}
                navigation={navigation}
                customButtomRoute='Importar'                
                icon={['md-heart-outline', 'md-musical-note-outline']}
                iconOnFocus={['md-heart','md-musical-note']}                
            />
        </View>    
    );
}

const styles = StyleSheet.create({
    headerComponents: {
        paddingHorizontal: 15,
        resizeMode: 'contain'
    },
   
    pageBody: {
        flex:1,
        margin:5,
        height:"100%"
    }
})

