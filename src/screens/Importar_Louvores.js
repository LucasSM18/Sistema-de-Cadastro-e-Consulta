import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import Themes from '../themes/Themes';
import actualDimensions from '../dimensions/Dimensions';
import { CustomView, Search, CustomButtom, Flatlist, Subfont, Font, Icons_Ionicons, Icons_entypo } from '../components/Styles';
import { StyleSheet, TouchableOpacity, Platform, useColorScheme, View } from 'react-native';

const Internet = (Platform,Theme) => {
    const [result, setResult] = useState('');   
    const [louvores, setLouvores] = useState([]);
     //const api_key = chave para a API
    const url = "https://api.vagalume.com.br/search.excerpt?q="+result+"&limit=5";

    useEffect(() => {            
        fetch(url).then(response =>
            response.json().then(data => {
                // data.sort((a, b) => ( a.title > b.title ? 1 : b.title > a.title ? -1 : 0 ));
                if(result){
                    setLouvores(data);
                }    
                console.log(louvores)                                                     
            })  
        ).catch(err => {
            console.log(err);
        });
    },[result]);

    return (        
        <CustomView style={styles.pageBody}>
            <View style={[styles.search, {borderBottomColor:Theme.subColor}]}>
                <Search
                    style={[{ flex:3, fontSize:16 },Platform.OS==='web'?{ outline:'none' }:null]}
                    placeholderTextColor={Theme.subColor}
                    placeholder="Digite aqui sua pesquisa..." 
                    autoFocus={true}
                    onChangeText={text => setResult(text)}
                    value={result}
                />

                <TouchableOpacity onPress={() => setResult('')} style={{ display:result?'flex':'none' }}>
                    <Icons_entypo size={25} name="cross"/>
                </TouchableOpacity>

                <TouchableOpacity style={{ paddingLeft:16 }}>   
                    <Icons_Ionicons size={25} name={ Platform + '-search' }/>
                </TouchableOpacity>
            </View>

            {/* <Flatlist
                data={louvores} 
                renderItem={({item}) => <Card name={item.title} complement={item.group} content={item.lyrics}/>} 
                keyExtractor={item=>item.id.toString()}
            />         */}
        </CustomView>
    );
};    

const Manual = (Theme) => { 
    const Inputs = ["Louvor...", "Artista/Banda...", "Youtube (Opcional)..."]
    return (        
        <CustomView style={styles.formArea}>  
            {Inputs.map((elements, index) => (
                <Search
                    key={index}
                    style={[ styles.textInput, { height:50, borderBottomColor:Theme.subColor }, Platform.OS==='web'?{ outline:'none' }:null ]}   
                    placeholderTextColor={Theme.subColor}
                    placeholder={elements}                       
                />
            ))}

            <Search
                style={[ 
                    styles.textInput, 
                    { height:200, borderBottomColor:Theme.subColor, textAlignVertical:'top' }, 
                    Platform.OS==='web'?{ outline:'none' }:null 
                ]}   
                placeholderTextColor={Theme.subColor}
                placeholder={"Letra da Musica..."}
                multiline={true}                     
            />

            <TouchableOpacity style={{ alignSelf:'center', marginBottom:20 }} onPress={() => console.log('Teste')}>    
                <Subfont style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Importar Arquivo</Subfont>
            </TouchableOpacity>

            <CustomButtom style={[ styles.button, Platform.OS==='web'?{ width:170, alignSelf:'flex-end' }:null ]}>                    
                <Font>Cadastrar Louvor</Font>                       
            </CustomButtom>                              
        </CustomView>
    );
};    

export default function ImportaLouvores({navigation, route}) {
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme] || Themes.dark;

    return (
        <View style={Platform.OS==='web'?styles.webStyle:styles.mobileStyle}>
            <Header
                title="IMPORTAR MÚSICAS"
                myLeftContainer={(
                    <TouchableOpacity style={ styles.headerComponents } onPress={() => navigation.navigate('Músicas')}>
                        <Icons_Ionicons size={30} name={route.params.platform + '-arrow-back-outline'}/>
                    </TouchableOpacity>
                )}
            />

            <TabBar 
                name={['Manual','Internet']} 
                route={[() => Manual(Theme),() => Internet(route.params.platform,Theme)]} 
                type='ionicon'
                theme={deviceTheme}                                 
                icon={[route.params.platform + '-clipboard-outline', route.params.platform + '-globe-outline']}
                iconOnFocus={[route.params.platform + '-clipboard', route.params.platform + '-globe']}                
            />
            
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

    customView: {
        padding:10,
        paddingHorizontal:15,
    },

    search: {
        padding:10,
        paddingHorizontal:15,
        height:50,
        borderBottomWidth:1,  
        flexDirection:'row', 
        justifyContent:'space-between'
    },

    formArea: {
        padding:20,
        paddingHorizontal:15,
    },

    textInput: {        
        padding:10,
        marginBottom:30,
        fontSize:16, 
        borderBottomWidth:1, 
    },

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
    },

    webStyle: {
        height:actualDimensions.height,
        width:actualDimensions.width
    },

    mobileStyle: {
        flex:1
    }
})

