import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import Card from '../components/Card'; 
import SearchBar from '../components/SearchBar'
import { Icon } from 'react-native-elements';
import { Flatlist, Subfont, CustomView } from '../components/Styles';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';


export default function LouvoresScreen({navigation, route}) {
    const [shouldShow, setShouldShow] = useState(false);
    const [filter, setFilter] = useState('');    
    const { platform, logo } = route.params

    const Louvores = ({ filter }) => {  
        const [louvores, setLouvores] = useState([]);
    
        useEffect(() => {            
            fetch("http://127.0.0.1:5000/").then(response =>
                response.json().then(data => {
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
                })  
            ).catch(err => {
                console.log(err);
            });
        },[filter]);
        
        return (        
            <Flatlist
                style={styles.pageBody}
                data={louvores} 
                renderItem={({item}) => <Card name={item.title} complement={item.group} content={item.lyrics} editableRoute={navigation}/>} 
                keyExtractor={item=>item.id.toString()}
            />        
        );
    };   
    
    const Favoritos = () => {
        return (        
            <CustomView style={styles.pageBody}>
                <Subfont style={{ fontSize:30, alignSelf:'center', marginTop:'2%' }}>Em Desenvolvimento</Subfont>
            </CustomView>
        );
    };    

    return (
        <View style={styles.bodyStyle}>       
            {shouldShow? 
                (
                    <SearchBar 
                        onChange={value => setFilter(value)}
                        leftComponent={
                            <TouchableOpacity onPress={() => setShouldShow(!shouldShow)}>     
                                <Icon
                                    name={platform + '-arrow-back-outline'} 
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
                                    name={platform + '-search'} 
                                    type='ionicon'
                                    color='#a6a6a6'
                                    size={25}
                                />
                            </TouchableOpacity>                               
                        }
                        complement={                
                            <TouchableOpacity onPress={() => navigation.navigate('Repertório', {goBack:'music-note-outline'})} style={ styles.headerComponents }>
                                <Icon
                                    name={"playlist-music-outline"} 
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
                icon={[platform + '-heart-outline', platform + '-musical-note-outline']}
                iconOnFocus={[platform + '-heart', platform + '-musical-note']}                
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
    },

    bodyStyle: {
        flex:1
    }
})

