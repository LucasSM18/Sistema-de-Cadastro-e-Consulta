import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Themes from '../themes/Themes';
import { Icon } from 'react-native-elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { CustomView, CustomButtom, Flatlist, BarComponent, Title, Font } from '../components/Styles';
import { StyleSheet, ActivityIndicator, TouchableOpacity, useColorScheme, View, Text } from 'react-native';

const Tab = createMaterialTopTabNavigator();


export default function MedleyScreen({navigation, route}) { 
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme] || Themes.light;
    const { medley, delay, sendLouvor } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [medleyHandler, setMedleyHandler] = useState([]);
    const [indexArray, setIndexArray] = useState({}); 
    const indexObject = {};

    useEffect(() => {
        medley.map(({keyID, name, complement, content}, index) => {
            indexObject[keyID] = [];
            setMedleyHandler(prev => [...prev, {keyID:keyID, position:index+1, name:name, complement:complement, content:content}]);
        }); 
        setIndexArray(indexObject)
    },[]);


    const MedleyArea = ({keyID, name, content, complement, position}) => {
        const medleyContent = content.split("\n\n");

        //arrumar
        const filterParagraph = (id) => {
            if(indexArray[keyID].includes(id)){
                const index = indexArray[keyID].indexOf(id);
                indexArray[keyID].splice(index,1);                
            } else {
                indexArray[keyID].push(id);
            }

            console.log(indexArray)
            setIndexArray(indexArray);
            const content = medleyContent.filter((obj,index) => !indexArray[keyID].includes(index)).join("\n\n");
            setMedleyHandler(prev => [
                ...prev.filter(obj => obj.keyID !== keyID), 
                {
                    keyID:keyID, 
                    position:position, 
                    name:name, 
                    complement:complement, 
                    content:content
                }
            ]);
        }

        const addAll = async () => {
            indexArray[keyID] = [];
            setIndexArray(indexArray);
            setMedleyHandler(prev => [
                ...prev, 
                {
                    keyID:keyID, 
                    position:position, 
                    name:name, 
                    complement:complement, 
                    content:medleyContent.join("\n\n")
                }
            ])
        }

        const removeAll = async () => {
            medleyContent.map((obj,index) => {
                indexArray[keyID].push(index);
            });
            setMedleyHandler(prev => [...prev.filter(obj => obj.keyID !== keyID)])
        }

        return (
            <View style={{flex:1}}>
                <View style={[styles.titleArea, { borderBottomColor:Theme.subColor }]}>
                    <View>
                        <Title>{name}</Title>
                        <Font style={{fontSize:15}}>{complement}</Font>
                    </View>

                    <TouchableOpacity onPress={() => medleyHandler.find(obj => obj.keyID === keyID) ? removeAll() : addAll()}>
                        <Icon
                            name={medleyHandler.find(obj => obj.keyID === keyID) ? "minus-a" : "plus-a"}
                            type="fontisto"
                            color={Theme.subColor}
                            size={25}
                        />  
                    </TouchableOpacity>   
                </View>

                <Flatlist
                    data={medleyContent} 
                    renderItem={({item, index}) => 
                        <TouchableOpacity 
                            onPress={() => filterParagraph(index)} 
                            style={[
                                styles.contentList, 
                                {
                                    borderColor:Theme.subColor, 
                                    backgroundColor:!indexArray[keyID].includes(index) && Theme.cell
                                }
                            ]}
                        >
                            <Text style={{color:Theme.color, maxWidth:"50%"}}>{item}</Text>
                            <Icon 
                                name={!indexArray[keyID].includes(index) ? "circle-slice-8" : "checkbox-blank-circle-outline"}
                                type="material-community"
                                color={Theme.subColor}
                                size={25}
                            />
                        </TouchableOpacity>
                    }
                    keyExtractor={(item, idx) => idx.toString()}
                />
            </View>
        )
    }

    //função que envia os medleys para o repertório
    const sendMedley = async () => {        
        const newMedley = {};
        const subs = medleyHandler.length % 2 === 0 ? Math.floor(15/medleyHandler.length) + 1 : Math.floor(15/medleyHandler.length);
        medleyHandler.sort((a,b) => a.position - b.position).forEach((louvor, index) => {
            if(!index){
                newMedley.keyID = medleyHandler.length > 1 ?  "MeDlEy" + louvor.keyID.substring(0,subs) : louvor.keyID;
                newMedley.name = louvor.name;
                newMedley.complement = medleyHandler.length > 1 ? "ICM Worship - Medley" : louvor.complement;
                newMedley.cifraUrl = "";
                newMedley.content = louvor.content + "\n";
                return;
            }

            newMedley.keyID += louvor.keyID.substring(0,subs);
            newMedley.name += " / " + louvor.name;
            newMedley.content += "_".repeat(40) + "\n".repeat(2) + louvor.content;
        });


        await sendLouvor(newMedley);
        // setIndexArray({})
        // setMedleyHandler([]);
        navigation.goBack();
    }

    const loadingMedley = async () => {
        await delay(1500);
        setIsLoading(false);
    }

    useEffect(() => {
        async function load() {
            await loadingMedley()
        }
        load();
    },[])

    return (
        <View style={{flex:1}}>
            <Header
                title={"EDITAR MEDLEY"} 
                myLeftContainer={(
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerComponents}>
                        <Icon
                            name={'md-arrow-back-outline'} 
                            type='ionicon'
                            color='#a6a6a6'
                            size={30}
                        />
                    </TouchableOpacity>   
                )}
            />

            {!isLoading ?
                <CustomView style={styles.pageBody}>
                    <BarComponent style={styles.medleyArea}>
                        <Tab.Navigator 
                            initialRouteName="Louvor 1"
                            tabBarPosition="top"
                            screenOptions={{
                                tabBarStyle: {backgroundColor: 'transparent'},
                                tabBarPressColor: '#fff',
                                tabBarActiveTintColor: '#fff',   
                                tabBarInactiveTintColor: '#a6a6a6'                            
                            }}
                        >
                            {medley.map((props, index) => (
                                <Tab.Screen key={index} name={`Louvor ${index+1}`}>
                                    {() => <MedleyArea position={index+1} {...props}/>}
                                </Tab.Screen>
                            ))}
                        </Tab.Navigator>
                    </BarComponent>

                
                    <CustomButtom onPress={() => sendMedley()}>                    
                        <Text style={{color:'#fff'}}>ENVIAR</Text>                       
                    </CustomButtom>          
                </CustomView>
            :
                <CustomView style={styles.pageBody}>
                    <ActivityIndicator size={100} color="#000000"/>
                </CustomView>
            }
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
        padding:20,
        paddingHorizontal:15,
        height:"100%",
        justifyContent:'center'
    },

    medleyArea: {
        flex:1,
        borderWidth:1,
        marginBottom:15,
        borderRadius:5,
        borderColor:'#737373'
    },

    titleArea: {
        padding:15, 
        borderBottomWidth:1, 
        alignItems:"center",
        justifyContent:"space-between",
        flexDirection:"row",
    },

    contentList: {
        borderBottomWidth:1,
        paddingHorizontal:15,
        padding:5,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    }
})
