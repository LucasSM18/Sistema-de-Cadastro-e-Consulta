import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Themes from '../themes/Themes';
import { CheckBox, Icon } from 'react-native-elements';
import { showAlert, closeAlert } from 'react-native-customisable-alert';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { CustomView, CustomButtom, Flatlist, BarComponent, Title, Font } from '../components/Styles';
import { StyleSheet, ActivityIndicator, TouchableOpacity, useColorScheme, View, Text } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const MedleyArea = (props) => {
    const medleyContent = props.content.split("\n\n");

    const filterParagraph = (id) => {
        if(props.indexArray[props.keyID].includes(id)){
            const index = props.indexArray[props.keyID].indexOf(id);
            props.indexArray[props.keyID].splice(index,1);                
        } else {
            props.indexArray[props.keyID].push(id);
        }

        props.setIndexArray(props.indexArray);
        const content = medleyContent.filter((obj,index) => !props.indexArray[props.keyID].includes(index)).join("\n\n");
        props.setMedleyHandler(prev => [
            ...prev.filter(obj => obj.keyID !== props.keyID), 
            {
                keyID:props.keyID, 
                position:props.position, 
                name:props.name, 
                complement:props.complement, 
                cipher:props.cipher,
                content:content
            }
        ]);
    }

    const addAll = async () => {
        props.indexArray[props.keyID] = [];
        props.setIndexArray(props.indexArray);
        props.setMedleyHandler(prev => [
            ...prev, 
            {
                keyID:props.keyID, 
                position:props.position, 
                name:props.name, 
                complement:props.complement, 
                cipher:props.cipher,
                content:medleyContent.join("\n\n")
            }
        ])
    }

    const removeAll = async () => {
        medleyContent.map((obj,index) => {
            props.indexArray[props.keyID].push(index);
        });
        props.setMedleyHandler(prev => [...prev.filter(obj => obj.keyID !== props.keyID)])
    }

    return (
        <View style={{flex:1}}>
            <View style={[styles.titleArea, { borderBottomColor:props.theme.subColor }]}>
                <View style={{maxWidth:"60%"}}>
                    <Title>{props.name}</Title>
                    <Font style={{fontSize:15}}>{props.complement}</Font>
                </View>

                <TouchableOpacity onPress={() => props.medleyHandler.find(obj => obj.keyID === props.keyID) ? removeAll() : addAll()}>
                    <Icon
                        name={props.medleyHandler.find(obj => obj.keyID === props.keyID) ? "minus-a" : "plus-a"}
                        type="fontisto"
                        color={props.theme.subColor}
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
                                borderColor:props.theme.subColor, 
                                backgroundColor:!props.indexArray[props.keyID].includes(index) && props.theme.cell
                            }
                        ]}
                    >
                        <Text style={{color:props.theme.color, maxWidth:"50%"}}>{item}</Text>
                        <Icon 
                            name={!props.indexArray[props.keyID].includes(index) ? "circle-slice-8" : "checkbox-blank-circle-outline"}
                            type="material-community"
                            color={props.theme.subColor}
                            size={25}
                        />
                    </TouchableOpacity>
                }
                keyExtractor={(item, idx) => idx.toString()}
            />
        </View>
    )
}

export default function MedleyScreen({navigation, route}) { 
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme] || Themes.light;
    const { medley, delay, sendLouvor, addLouvor } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [isChecked, setChecked] = useState(false);
    const [medleyHandler, setMedleyHandler] = useState([]);
    const [indexArray, setIndexArray] = useState({}); 
    const indexObject = {};

    useEffect(() => {
        medley.map(({keyID, name, complement, cipher, content}, index) => {
            indexObject[keyID] = [];
            setMedleyHandler(prev => [...prev, {keyID:keyID, position:index+1, name:name, cipher:cipher, complement:complement, content:content}]);
        }); 
        setIndexArray(indexObject)
    },[]);

    //função que envia os medleys para o repertório
    const sendMedley = async () => {    
        const newMedley = {};
        const subs = medleyHandler.length % 2 === 0 ? Math.floor(15/medleyHandler.length) + 1 : Math.floor(15/medleyHandler.length);
        //
        medleyHandler.sort((a,b) => a.position - b.position).forEach((louvor, index) => {
            if(!index){
                newMedley.keyID = medleyHandler.length > 1 ?  "MeDlEy" + louvor.keyID.substring(0,subs) : louvor.keyID;
                newMedley.name = louvor.name;
                newMedley.complement = medleyHandler.length > 1 ? "ICM Worship - Medley" : louvor.complement;
                newMedley.cifraUrl = medleyHandler.length > 1 ? "" : louvor.cipher;
                newMedley.content = louvor.content + "\n";
                return;
            }

            newMedley.keyID += louvor.keyID.substring(0,subs);
            newMedley.name += " / " + louvor.name;
            newMedley.content += "_".repeat(40) + "\n".repeat(2) + louvor.content;
        });

        if(isChecked) await saveMedley(newMedley);
        else await sendLouvor(newMedley);

        navigation.goBack(); 
    }

    const saveMedley = async (newMedley) => {
        closeAlert();
        const addMedley =  {
            keyID: newMedley.keyID,
            titulo: newMedley.name,
            artista: "ICM Worship",
            cifra: newMedley.cifraUrl,
            letra: newMedley.content
        }
        //
        sendLouvor(newMedley, true);
        await addLouvor(addMedley, true);
        //
        showAlert({
            title: "Sucesso!",
            message: `"${newMedley.name}" salvo e adicionado ao repertório! 🎉`,
            alertType: "success",
        });
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
                                    {() => 
                                        <MedleyArea
                                            {...props} 
                                            theme={Theme}
                                            indexArray={indexArray} 
                                            setIndexArray={setIndexArray} 
                                            medleyHandler={medleyHandler} 
                                            setMedleyHandler={setMedleyHandler}  
                                            position={index+1} 
                                        />
                                    }
                                </Tab.Screen>
                            ))}
                        </Tab.Navigator>
                    </BarComponent>

                    <CheckBox 
                        containerStyle={styles.checkBox} 
                        textStyle={{color:Theme.subColor}}
                        checkedIcon='checkbox-marked-outline'
                        uncheckedIcon='checkbox-blank-outline'
                        iconType='material-community'
                        title="Salvar Medley"
                        checked={isChecked}
                        checkedColor={Theme.subColor}
                        onPress={() => setChecked(!isChecked)}
                    />

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
        marginBottom:5,
        borderRadius:5,
        borderColor:'#737373'
    },

    titleArea: {
        width:"100%",
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
    },

    checkBox: {
        backgroundColor: 'transparent', 
        borderWidth:0, 
        paddingHorizontal:2,
        maxWidth:150
    }
})
