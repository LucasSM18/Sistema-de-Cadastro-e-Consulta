import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Card from '../components/Card'; 
import Modal from '../components/Modal';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import { Flatlist, CustomView, Font } from '../components/Styles';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import firebaseConnection from '../services/firebaseConnection';
import  CustomisableAlert, { showAlert, closeAlert } from 'react-native-customisable-alert';
import { StyleSheet, TouchableOpacity, Platform, Image, View, Linking, ActivityIndicator } from 'react-native';

const emptyList = () => {
     return <Font style={{ fontSize:20, alignSelf:'center', marginTop:'2%' }}>Repertório Vazio</Font>   
}

const filtroData = () => {
    const today = moment();
    const dateEvent = moment().day(6);
    //
    if(today > dateEvent) return dateEvent.add(1, 'week').format("DD/MM");

    return dateEvent.format('DD/MM');
}

const sendLouvores = (louvores) => {    
    if(!louvores.length) {
        showAlert({
            title: "Repertório vazio!",
            message: "Inclua alguns louvores antes de enviar para o WhatsApp.",
            alertType: "error",
        });  
        //
        return;
    }

    let message = `Louvores (${filtroData()}):\n`
    louvores.map(item => {
       const song = item.title + ' - ' + item.group;
       message += `\n${song}\n`
    })
   
    // console.log(message)

    Linking.canOpenURL('whatsapp://send?text=').then(() => {
        Linking.openURL(`whatsapp://send?text=${message}`)
    }).catch(() => {
        showAlert({
            title: "Erro ao se conectar ao WhatsApp!",
            message: "Verifique se o WhatsApp está instalado corretamente, ou contate o administrador do sistema.",
            alertType: "error",
        });
    })
}

export default function Repertorio({navigation, route}) {
    const { goBack, logo } = route.params;
    const [louvores, setLouvores] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [remove, setRemove] = useState(false)
    
    const deleteLouvor = async ({keyID, name}) => {
        try {               
            setRemove(true);
            // console.log(keyID + ' ' + name)
            const docRef = await doc(firebaseConnection.db, "repertorio", 'sabado')
            const docRepertorio = await getDoc(docRef)

            if (docRepertorio.exists()) {
                const repertorio = {...docRepertorio.data()}
                const novoRepertorio = {...repertorio }
                novoRepertorio.musics = repertorio.musics.filter(music=> music.id !== keyID)

                await updateDoc(docRef, novoRepertorio)
            }
            //await deleteDoc(doc(firebaseConnection.db, 'repertorio', id))

            await getData();
            setRemove(false);

            showAlert({
                title: "Louvor removido!",
                message: `"${name}" foi removido com sucesso!`,
                alertType: "success",
            });     
        }
        catch(err) {
            showAlert({
                title: "ERRO!",
                message: "Ocorreu um erro e não foi possível excluir o louvor no momento. Tente novamente mais tarde",
                alertType: "error",
            });
        }
    }

    const clearRepertório = async () => {
        const docRef = await doc(firebaseConnection.db, "repertorio", 'sabado');
        const docRepertorio = await getDoc(docRef);
      
        if (docRepertorio.exists()) {
            const repertorio = {...docRepertorio.data()}
            const clearRepertorio = {...repertorio }
            clearRepertorio.musics = []
      
            await updateDoc(docRef, clearRepertorio)
        }

        await getData();           
    }

    const getData = async () => {
        const docRef = await doc(firebaseConnection.db, 'repertorio', 'sabado')
        const docLouvor = await getDoc(docRef)
        const data = [];
        if (docLouvor.exists()) {
            docLouvor.data()['musics'].forEach((doc)=> {
                // console.log(doc)
                data.push({
                    id: doc.id,
                    title: doc.title,
                    cipher: doc.cipher,
                    group: doc.group,
                    lyrics: doc.lyrics
                })
            })
        }

        setLouvores(data)
    }
        
    const alertHandler = async () => {
        closeAlert(); 
        setRemove(true);
        await clearRepertório();
        setRemove(false);
    }

    useEffect(() => {       
        async function loadLouvores() {
            await getData();
            setLoaded(true);
        }

        loadLouvores()
        return             
    },[]);

    return (
        <View style={{flex:1}}>
            {remove && <Modal/>}

            {Platform.OS !== "web" && 
                <CustomisableAlert
                    alertContainerStyle={{backgroundColor:"#000000", width:"85%"}} 
                    titleStyle={{color:"white", fontSize:20, fontWeight:"bold"}} 
                    textStyle={{color:"white", fontSize:15}}
                    btnLabelStyle={{textTransform:"uppercase"}}
                    dismissable={true}
                />
            }

            <Header
                title={"REPERTÓRIO"} 
                myLeftContainer={(
                    <TouchableOpacity disabled={Platform.OS !== "web" ? false : true} onPress={() => navigation.navigate('Home')} style={{ paddingLeft:5, resizeMode:'contain' }}>
                        <Image 
                            style={{width:logo.size, height:logo.size, margin:logo.margim}}
                            source={logo.image}
                        />
                    </TouchableOpacity>   
                )}
                myRightContainer={
                    Platform.OS !== "web" &&
                        <View style={{flexDirection:"row", display: louvores.length ? 'flex' : 'none'}}>                  
                            <TouchableOpacity 
                                onPress={() => 
                                    showAlert({
                                        title: "Você tem certeza?",
                                        message: "Todos os louvores serão excluidos do repertório",
                                        alertType: "warning",
                                        leftBtnLabel: "CANCELAR",
                                        btnLabel: "CONTINUAR",
                                        onPress: () => alertHandler() 
                                    })
                                } 
                                style={[styles.headerComponents]}
                            >
                                <Icon
                                    name="trash-o" 
                                    type='font-awesome'
                                    color='#a6a6a6'
                                    size={25}
                                />
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => sendLouvores(louvores)} style={ styles.headerComponents }>
                                <Icon
                                    name="share" 
                                    type='entypo'
                                    color='#a6a6a6'
                                    size={25}
                                />
                            </TouchableOpacity>
                    </View>
                }
                complement={
                    goBack &&
                        <TouchableOpacity onPress={() => navigation.goBack()} style={ styles.headerComponents }>
                             <Icon
                                name="music-note-outline"
                                type='material-community'
                                color='#a6a6a6'
                                size={30}
                            />
                        </TouchableOpacity>                        
                }
            />  
            <CustomView style={styles.pageBody}>
                {loaded ? 
                    (
                        <Flatlist
                            data={louvores} 
                            style={{flex:1}}
                            renderItem={({item}) => 
                                <Card 
                                    keyID={item.id} 
                                    name={item.title} 
                                    cifraUrl={item.cipher}
                                    complement={item.group} 
                                    content={item.lyrics} 
                                    icon="cross"
                                    iconType="entypo"
                                    caretFunction={ Platform.OS !== "web" && deleteLouvor}
                                />
                            } 
                            ListEmptyComponent={emptyList()}
                            keyExtractor={item=>item.id}
                        />
                    ) : <ActivityIndicator size={100} color="#000000"/> 
                }
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
        height:"100%",
        justifyContent:'center'
    },

    modal: {
        flex:1, 
        justifyContent: "center", 
        alignContent: "center"
    },

    modalBackground: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        height:'100%'
    }
})

