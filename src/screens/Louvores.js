import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import Card from '../components/Card'; 
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar'
import { Icon } from 'react-native-elements';
import { Flatlist, Font } from '../components/Styles';
import { useIsFocused } from '@react-navigation/native';
import  CustomisableAlert, { showAlert } from 'react-native-customisable-alert';
import { StyleSheet, View, TouchableOpacity, Linking, Keyboard, Image} from 'react-native';
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
    const [search, setSearch] = useState(false);
    const [isMedley, setIsMedley] = useState(false);
    const [empty, setEmpty] = useState(true)
    const [louvores, setLouvores] = useState([]);
    const [repertorio, setRepertorio] = useState([]);
    const [medley, setMedley] = useState([]);
    const isFocused = useIsFocused();
    const { logo, filtroData } = route.params;

    const sendToWhatsapp = () => {    
        let message = `Louvores (${filtroData()}):\n`
        repertorio.map((item,index) => { 
           message += `\n${index+1}. ${item.toLowerCase()}`
        })
       
        console.log(message)
    
        Linking.canOpenURL('whatsapp://send?text=').then(() => {
            Linking.openURL(`whatsapp://send?text=${message}`)
        }).catch(() => {
            showAlert({
                title: "Erro ao se conectar ao WhatsApp!",
                message: "Verifique se o WhatsApp está instalado corretamente, ou contate o administrador do sistema",
                alertType: "error",
            });
        })
    }

    const getRepertorio = async () => {
        setRepertorio([])
        const docRef = await doc(firebaseConnection.db, 'repertorio', 'sabado');
        const docLouvor = await getDoc(docRef);
        if(docLouvor.data()['musics'].length === 0){
            setEmpty(true)
            return
        }
        await docLouvor.data()['musics'].forEach(({title}) => {
            setRepertorio(prev => [...prev, title])
        });
        setEmpty(false)
    }

    //Exclui um louvor da base
    const deleteLouvor = async ({keyID, name}) => {
        try {               
            setLoaded(true);
            
            await deleteDoc(doc(firebaseConnection.db, 'louvores', keyID));
            await getData();

            setLoaded(false);

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

    //Altera alguns dados do louvor
    const updateLouvor = async (louvor) => {        
        const docRef = doc(firebaseConnection.db, "louvores", louvor.id)

        await updateDoc(docRef, {
            title: louvor.title,
            group: louvor.group,
            cipher: louvor.cipher,
            lyrics: louvor.lyrics
        })

        showAlert({
            title: "Alteração de louvor",
            message: "Sucesso!😁 ",
            alertType: "success"
        });

        await getData()

    }

    //pega os louvores da base
    const getData = async () => {
        setSearch(false)
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
            //
            setLouvores(
                data.filter(item => 
                    (
                        item.title.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
                        item.group.toLowerCase().indexOf(filter.toLowerCase()) > -1 || 
                        item.lyrics.toLowerCase().indexOf(filter.toLowerCase()) > -1 
                    )
                )
            );    
            setSearch(true)
        }else{
            data.sort((a, b) => ( a.title > b.title ? 1 : b.title > a.title ? -1 : 0 ));
            setLouvores(data); 
        }
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
                });      
                
                const newDoc = {...docLouvor.data(), musics: louvor.musics};
                getRepertorio();

                await updateDoc(docRef, newDoc);
                
                setShouldShow(false);  
                setLoaded(false);
                
                showAlert({
                    title: "Louvor adicionado!",
                    message: `"${props.name}" adicionado com sucesso ao repertório 🎉`,
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

    //Adciona um novo louvor na base
    const addLouvor = async (louvor) => {
                        
        const newLouvor = {
            title: louvor.titulo,
            group: louvor.artista,
            cipher: louvor.cifra,
            lyrics: louvor.letra,
            isNotBase: true,
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

    //Função para criar um medley com os louvores
    const addMedley = async (props) => {        
        setIsMedley(true);
        setMedley(medley => [
            ...medley,
            {
                keyID: props.keyID,
                name: props.name,
                content: props.content
            }
        ]) 
    }

    //remove musica do medley
    const removeMedley = (key) => {
        setMedley(medley => [...medley.filter(obj => obj.keyID !== key)])
    }

    //fecha o handler do medley
    const closeMedleyHandler = async () =>  {
        setMedley([])
        setIsMedley(false);
    }

    //função que envia os medleys para o repertório
    const sendMedley = async () => {
        if(medley.length < 2) {
            showAlert({
                title: "ERROR!",
                message: 'Selecione no minimo 2 louvores!',
                alertType: "error",
            });
            return;
        }
        
        const newMedley = {};
        medley.forEach((louvor, index) => {
            if(!index){
                newMedley.keyID = louvor.keyID;
                newMedley.name = louvor.name;
                newMedley.complement = "ICM Worship - Medley";
                newMedley.cifraUrl = "";
                newMedley.content = louvor.content;
                return;
            }

            newMedley.name += " / " + louvor.name;
            newMedley.content += "_".repeat(40) + "\n".repeat(2) + louvor.content;
        });

        setMedley([])
        sendLouvor(newMedley);
        setIsMedley(false);
    }

    useEffect(() => {       
        async function loadLouvores() {
            await getData();
        }

        loadLouvores()
        return
             
    },[filter]);
        

    useEffect(()=> {
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {  hideSearch() });
        async function loadFavs() {
            await getFavoritosList();
        }

        loadFavs();
        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(()=> {
        async function loadRep() {
            await getRepertorio();
        }

        loadRep();
    }, [isFocused]);

    const Louvores = ({ louvores, multiSelect, updateFavs }) => { 

        return (        
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
                        // isNotBase={item.isNotBase}
                        editableRoute={navigation}
                        addFavorites={true}
                        icon="playlist-music-outline"
                        iconType="material-community"
                        deleteLouvor={deleteLouvor}
                        deleteMessage={`O louvor "${item.title}" será excluido permanentemente!`}
                        updateLouvor={updateLouvor}
                        caretFunction={sendLouvor}
                        favfunc={getFavoritosList}
                        updateFunc={updateFavs}
                        longPress={addMedley}
                        uncheckFunction={removeMedley}
                        multiSelect={multiSelect}
                    />
                } 
                ListEmptyComponent={emptyList()}
                keyboardShouldPersistTaps="handled" 
                keyExtractor={item=>item.id.toString()}
            />        
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

    const Favoritos = ({ filter, favoritos, multiSelect, updateFavs }) => {
        const data = filter ? 
            favoritos.filter(item => (
                item.title.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
                item.group.toLowerCase().indexOf(filter.toLowerCase()) > -1 || 
                item.lyrics.toLowerCase().indexOf(filter.toLowerCase()) > -1 
            )) 
        :
            favoritos;

        const removeFavoritos = async({keyID, name}) => {
            try {      
                updateFavs();         
                setLoaded(true);
                const favs = await getFavoritosList();
                const removeFav = favs.findIndex(({id}) => id === keyID);
                favs.splice(removeFav, 1);
                
                await AsyncStorage.removeItem('@favoritos');
                await AsyncStorage.setItem('@favoritos', JSON.stringify(favs))

                await updateFavs();
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
                await updateFavs()
            }

            filterFavs();
            return;
        },[filter])

        return (                   
            <Flatlist
                style={styles.pageBody}
                data={data} 
                renderItem={({item}) => 
                    <Card 
                        keyID={item.id} 
                        name={item.title} 
                        complement={item.group} 
                        content={item.lyrics} 
                        cifraUrl={item.cipher}
                        // isNotBase={true}
                        cipher={true}
                        // editableRoute={navigation}
                        addFavorites={false}
                        icon="playlist-music-outline"
                        iconType="material-community"
                        deleteLouvor={removeFavoritos}
                        deleteMessage={`"${item.title}" será removido de sua lista de favoritos!`}
                        // updateLouvor={updateLouvor}
                        caretFunction={sendLouvor}
                        // updateFunc={updateFavs}
                        longPress={addMedley}
                        uncheckFunction={removeMedley}
                        multiSelect={multiSelect}
                    />
                } 
                ListEmptyComponent={emptyList()}
                keyboardShouldPersistTaps="handled" 
                keyExtractor={(item, idx) => idx}
            />        
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
            
            {shouldShow ? (
                <SearchBar 
                    onChange={value => setFilter(value)}
                    search={search}
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
            ) : (
                <Header
                    title={isMedley ? "MEDLEY" + (medley.length ?  ` - ${medley.length} ` + (medley.length < 2 ? "Selecionado" : "Selecionados") : "") : "MÚSICAS"} 
                    myLeftContainer={
                        <TouchableOpacity 
                            onPress={() => !isMedley ? navigation.navigate('Home') : closeMedleyHandler()} 
                            style={{paddingLeft:5, resizeMode:'contain'}}
                        >
                                {!isMedley ?
                                    <Image 
                                        style={{width:logo.size, height:logo.size, margin:logo.margim}}
                                        source={logo.image}
                                    />
                                :
                                    <Icon
                                        style={{paddingHorizontal: 10, resizeMode: 'contain'}}
                                        name={'md-arrow-back-outline'} 
                                        type='ionicon'
                                        color='#a6a6a6'
                                        size={30}
                                    />
                                }
                        </TouchableOpacity>   
                        }
                        myRightContainer={!isMedley && 
                            <View style={{ flexDirection:"row", alignItems:'center' }}>
                                <TouchableOpacity onPress={() => setShouldShow(!shouldShow)} style={styles.headerComponents}>
                                    <Icon name={'md-search'} type='ionicon' color='#a6a6a6' size={25}/>
                                </TouchableOpacity>
                                
                                <TouchableOpacity onPress={() => navigation.navigate('Repertório', {goBack:true})} style={styles.headerComponents}>
                                    <Icon name="playlist-music-outline" type='material-community' color='#a6a6a6' size={35}/>
                                </TouchableOpacity>
                            </View>        
                        }
                        complement={!isMedley ?           
                            <TouchableOpacity onPress={() => sendToWhatsapp()} style={[styles.headerComponents, {display:!empty?'flex':'none'}]}>
                                <Icon name="share" type='entypo' color='#a6a6a6' size={25}/>
                            </TouchableOpacity>        
                        :        
                            <TouchableOpacity onPress={() => sendMedley()} style={ styles.headerComponents }>
                                <Icon name={'check'} type='feather' color='#a6a6a6' size={30}/>
                            </TouchableOpacity>    
                        }            
                    />     
                )
            }
            
            <TabBar 
                name={['Favoritos','Louvores']} 
                route={[Favoritos,Louvores]} 
                type='ionicon'
                disable={shouldShow}
                routesProps={{
                    filter: filter,
                    louvores: louvores,
                    setLouvores: setLouvores,
                    multiSelect: isMedley
                }}
                getFavoritosList={getFavoritosList}
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

