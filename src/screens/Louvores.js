import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import Card from '../components/Card'; 
import Themes from '../themes/Themes';
import SearchBar from '../components/SearchBar'
import actualDimensions from '../dimensions/Dimensions';
import { Flatlist, Subfont, Icons_Ionicons, CustomView } from '../components/Styles';
import { StyleSheet, View, TouchableOpacity, Image, useColorScheme, Platform } from 'react-native';


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
            renderItem={({item}) => <Card name={item.title} complement={item.group} content={item.lyrics}/>} 
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

export default function LouvoresScreen({navigation, route}) {
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme] || Themes.dark;
    const logo = {
        size: Theme.style==='dark-content'?80:60,
        margim: Theme.style==='dark-content'?0:5,
        image: Theme.style==='dark-content'?require('../../assets/logo_light.png'):
               require('../../assets/logo_dark.png')
    };

    const [shouldShow, setShouldShow] = useState(false);
    const [filter, setFilter] = useState('');    

    return (
        <View style={Platform.OS==='web'?styles.webStyle:styles.mobileStyle}>       
            {shouldShow? 
                (
                    <SearchBar 
                        onChange={value => setFilter(value)}
                        placeholderTextColor = {Theme.subColor}
                        leftComponent={
                            <TouchableOpacity onPress={() => setShouldShow(!shouldShow)}>         
                                <Icons_Ionicons size={30} name={route.params.platform + '-arrow-back-outline'}/>
                            </TouchableOpacity>                                         
                        }
                    />
                ):
                (
                    <Header
                        title="Músicas" 
                        myLeftContainer={(
                            <TouchableOpacity style={{paddingLeft:5, resizeMode:'contain'}}>
                                <Image 
                                    style={{width:logo.size, height:logo.size, margin:logo.margim}}
                                    source={logo.image}/>
                            </TouchableOpacity>   
                        )}
                        myRightContainer={
                            <TouchableOpacity 
                                onPress={() => setShouldShow(!shouldShow)}  
                                style={styles.headerComponents}
                            >
                                <Icons_Ionicons size={25} name={route.params.platform + '-search'}/>
                            </TouchableOpacity>                               
                        }
                        complement={                
                            <TouchableOpacity style={ styles.headerComponents }>
                                <Icons_Ionicons size={30} name={route.params.platform + '-arrow-forward-outline'}/>
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
                theme={deviceTheme} 
                navigation={navigation}
                customButtomRoute='Importar'                
                icon={[route.params.platform + '-heart-outline', route.params.platform + '-musical-note-outline']}
                iconOnFocus={[route.params.platform + '-heart', route.params.platform + '-musical-note']}                
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

    webStyle: {
        height:actualDimensions.height,
        width:actualDimensions.width
    },

    mobileStyle: {
        flex:1
    }
})

