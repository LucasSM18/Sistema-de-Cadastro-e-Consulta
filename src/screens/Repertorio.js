import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Card from '../components/Card'; 
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import { Flatlist, Font, CustomView } from '../components/Styles';
import { deleteDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import firebaseConnection from '../services/firebaseConnection';
import { StyleSheet, TouchableOpacity, Alert, Image, View, Linking } from 'react-native';

const filtroData = () => {
    const today = moment();
    const dateEvent = moment().day(6);
    //
    if(today > dateEvent) return dateEvent.add(1, 'week').format("DD/MM");

    return dateEvent.format('DD/MM');
}

const sendLouvores = () => {    
    const message = `Repertório - ${filtroData()}`;
    Linking.canOpenURL('whatsapp://send?text=').then(() => {
        Linking.openURL(`whatsapp://send?text=${message}`)
    }).catch(() => {
        alert("Houve um erro ao tentar enviar o Repertório!\n Verifique se o WhatsApp está instalado corretamente, ou contate o administrador do sistema.")
    })
}

export default function Repertorio({navigation, route}) {
    const { goBack, logo } = route.params;
    const [louvores, setLouvores] = useState([]);

    const deleteLouvor = async (id, name) => {
        try {               
            console.log(id, name)
            const docRef = await doc(firebaseConnection.db, "repertorio", 'sabado')
            const docRepertorio = await getDoc(docRef)

            if (docRepertorio.exists()) {
                const repertorio = {...docRepertorio.data()}
                const novoRepertorio = {...repertorio }
                novoRepertorio.musics = repertorio.musics.filter(music=> music.id !== id)

                await updateDoc(docRef, novoRepertorio)
            }
            //await deleteDoc(doc(firebaseConnection.db, 'repertorio', id))

            await getData()
            Alert.alert(
                "Exclusão de Louvor",
                `"${name}" excluído com sucesso!`
            )             
        }
        catch(err) {
            Alert.alert(
                "Erro",
                `${err}: Ocorreu um erro e não foi possível excluir o louvor no momento. Tente novamente mais tarde`
            )
        }

     }

    const getData = async () => {
        const docRef = await doc(firebaseConnection.db, 'repertorio', 'sabado')
        const docLouvor = await getDoc(docRef)
        const data = [];
        if (docLouvor.exists()) {
            docLouvor.data()['musics'].forEach((doc)=> {
                console.log(doc)
                data.push({
                    id: doc.id,
                    title: doc.title,
                    group: doc.group,
                    lyrics: doc.lyrics
                })
            })
        }

        setLouvores(data)
    }
        

    useEffect(() => {       
        async function loadLouvores() {
            await getData();
        }

        loadLouvores()
        return             
    },[]);

    return (
        <View style={{flex:1}}>
            <Header
                title={"REPERTÓRIO" + ' - ' + filtroData()} 
                myLeftContainer={(
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{paddingLeft:5, resizeMode:'contain'}}>
                        <Image 
                            style={{width:logo.size, height:logo.size, margin:logo.margim}}
                            source={logo.image}
                        />
                    </TouchableOpacity>   
                )}
                myRightContainer={
                    <TouchableOpacity onPress={() => sendLouvores()} style={ styles.headerComponents }>
                        <Icon
                            name="share" 
                            type='entypo'
                            color='#a6a6a6'
                            size={25}
                        />
                    </TouchableOpacity>                               
                }
                complement={
                    goBack?
                        <TouchableOpacity onPress={() => navigation.goBack()} style={ styles.headerComponents }>
                             <Icon
                                name="music-note-outline"
                                type='material-community'
                                color='#a6a6a6'
                                size={30}
                            />
                        </TouchableOpacity>
                    :
                    null                             
                }
            />  
            <CustomView style={styles.pageBody}>
                <Flatlist
                    data={louvores} 
                    renderItem={({item}) => 
                        <Card 
                            keyID={item.id} 
                            name={item.title} 
                            complement={item.group} 
                            content={item.lyrics} 
                            deleteLouvor={deleteLouvor}
                        />
                    } 
                    keyExtractor={item=>item.id}
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
    }
})

