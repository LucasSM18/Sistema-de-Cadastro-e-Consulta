import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import Card from '../components/Card'; 
import SearchBar from '../components/SearchBar'
import { Icon } from 'react-native-elements';
import { Flatlist, Font, CustomView } from '../components/Styles';
import { StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Image, Alert } from 'react-native';
import firebaseConnection from '../services/firebaseConnection'
import { collection, getDocs } from 'firebase/firestore';

console.disableYellowBox = true;


const emptyList = (content) => {
    return  <Font style={{ fontSize:20, alignSelf:'center', marginTop:'2%' }}>{content}</Font>    
}

export default function LouvoresScreen({navigation, route}) {
    const [shouldShow, setShouldShow] = useState(false);
    const [filter, setFilter] = useState('');    
    const { logo } = route.params

    const Louvores = ({ filter }) => {  
        const [louvores, setLouvores] = useState([]);
        const [notFound, setNotFound] = useState('')
    
        useEffect(() => {       

            async function getData() {
                const querySnapshot = await getDocs(collection(firebaseConnection.db, 'louvores'));
                const data = [];
                querySnapshot.forEach((doc)=> {
                    data.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })

              data.sort((a, b) => ( a.title > b.title ? 1 : b.title > a.title ? -1 : 0 ));
                if(filter){
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
                    setLouvores(data); 
                }
                if(!notFound) setNotFound('Nenhum resultado encontrado')
                return
            }

            getData();
                 
        },[filter]);
        
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
                            editableRoute={navigation}
                        />
                    } 
                    ListEmptyComponent={emptyList(notFound)}
                    keyExtractor={item=>item.id.toString()}
                />        
            </TouchableWithoutFeedback>
        );
    };   
    
    const Favoritos = () => {
        return (                   
            <TouchableWithoutFeedback onPress={() => setShouldShow(false)}>
                <CustomView style={styles.pageBody}>
                    <Font style={{ fontSize:30, alignSelf:'center', marginTop:'2%' }}>Em Desenvolvimento</Font>
                </CustomView>
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
        padding:15,
        height:"100%"
    }
})

