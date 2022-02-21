import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import Card from '../components/Card'; 
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar'
import { Icon } from 'react-native-elements';
import { Flatlist, Font } from '../components/Styles';
import  CustomisableAlert, { showAlert } from 'react-native-customisable-alert';
import { StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Image} from 'react-native';
import firebaseConnection from '../services/firebaseConnection';
import { collection, getDocs, getDoc, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.disableYellowBox = true;

const emptyList = () => {
    return  <Font style={{ fontSize:20, alignSelf:'center', marginTop:'2%' }}>Nenhum resultado encontrado</Font>    
}

export default function LouvoresScreen({navigation, route}) {
    const [shouldShow, setShouldShow] = useState(false);
    const [filter, setFilter] = useState('');    
    const [loaded, setLoaded] = useState(false);
    const [louvores, setLouvores] = useState([]);
    const { logo } = route.params

    const deleteLouvor = async ({keyID, name}) => {
        try {               
            setLoaded(true)
            
            await deleteDoc(doc(firebaseConnection.db, 'louvores', keyID));
            await getData();

            setLoaded(false)

            showAlert({
                title: "Exclusão de louvor",
                message: `"${name}" excluído com sucesso!`,
                alertType: "success",
            });

        }
        catch(err) {
            setLoaded(false);
            //
            showAlert({
                title: "ERROR!",
                message: "Ocorreu um erro e não foi possível excluir o louvor no momento. Tente novamente mais tarde",
                alertType: "error"
            });
        }
    }


    const updateLouvor = async (louvor) => {        
        const docRef = doc(firebaseConnection.db, "louvores", louvor.id)

        await updateDoc(docRef, {
            title: louvor.title,
            group: louvor.group,
            lyrics: louvor.lyrics
        })

        showAlert({
            title: "Alteração de louvor",
            message: "Sucesso!😁 ",
            alertType: "success"
        });

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

        return
    }

    //função para enviar os louvores para o repertório
    const sendLouvor = async (props) => {
        const docRef = await doc(firebaseConnection.db, 'repertorio', 'sabado');
        const docLouvor = await getDoc(docRef);
        if (docLouvor.exists()) {
            const louvor = {...docLouvor.data()}
            let hasMusic = !louvor.musics.some(music=> {
                return music.id === props.keyID
            })
            if (hasMusic) {               
                setLoaded(true);

                louvor.musics.push({
                    id: props.keyID,
                    title: props.name,
                    cipher: props.cifraUrl,
                    group: props.complement,
                    lyrics: props.content
                })
                
                const newDoc = {...docLouvor.data(), musics: louvor.musics}
            
                await updateDoc(docRef, newDoc)
                
                setLoaded(false);
                
                showAlert({
                    title: "Louvor adicionado!",
                    message: `${props.name} adicionado com sucesso ao repertório 🎉`,
                    alertType: "success"
                });
               
            }
            else {
                showAlert({
                    title: "Louvor não adicionado!",
                    message: `O louvor "${props.name}" já está no repertório!`,
                    alertType: "error"
                });
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

            showAlert({
                title: "Novo louvor adicionado!",
                message: `"${louvor.titulo}" adicionado com sucesso! 🎉`,
                alertType: "success",
            });

            await getData()
        }
        catch(err) {
            showAlert({
                title: "ERROR!",
                message: 'Houve um erro ao tentar adicionar esse louvor! Tente novamente mais tarde',
                alertType: "error",
            });
            // console.log(err)
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

    const Louvores = ({ louvores }) => {  
        return (        
            <TouchableWithoutFeedback onPress={() => hideSearch()}>
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
                    ListEmptyComponent={emptyList()}
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
            showAlert({
                title: "ERROR!",
                message: `Erro de conexão. Entre em contato com o adminstrador! ${err}`,
                alertType: "error",
            });
        }
    }

    const Favoritos = ({ filter, favoritos }) => {
        const [favList, setFavList] = useState(favoritos);

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

        const removeFavoritos = async({keyID, name}) => {
            try {               
                setLoaded(true);
                const favs = await getFavoritosList();
                const removeFav = favs.findIndex(({id}) => id === keyID);
                favs.splice(removeFav, 1);
                
                await AsyncStorage.removeItem('@favoritos');
                await AsyncStorage.setItem('@favoritos', JSON.stringify(favs))

                setFavList(favoritos)

                setLoaded(false);

                showAlert({
                    title: "Louvor removido da lista",
                    message: `"${name}" foi removido com sucesso!😁'`,
                    alertType: "success",
                });    
            }
            catch(err) {
                showAlert({
                    title: "ERROR!",
                    message: "Ocorreu um erro e não foi possível remover o louvor da lista no momento. Tente novamente mais tarde",
                    alertType: "error",
                });  
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
                    ListEmptyComponent={emptyList()}
                    keyboardShouldPersistTaps="handled" 
                    keyExtractor={(item, idx) => idx}
                />        
            </TouchableWithoutFeedback>
        );
    };    

    const hideSearch = async () => {
        setFilter('');
        setShouldShow(false);
    }

    return (
        <View style={{flex:1}}>       
            {loaded && <Modal/>}
            
            <CustomisableAlert
                alertContainerStyle={{backgroundColor:"#000000", width:"85%"}} 
                titleStyle={{color:"white", fontSize:20, fontWeight:"bold"}} 
                textStyle={{color:"white", fontSize:15}}
                btnLabelStyle={{textTransform:"uppercase"}}
                dismissable={true}
            />
            
            {shouldShow? 
                (
                    <SearchBar 
                        onChange={value => setFilter(value)}
                        leftComponent={
                            <TouchableOpacity onPress={() => hideSearch()}>     
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

