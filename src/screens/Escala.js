import React, { useEffect, useState } from 'react';
import Lista from '../components/List';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import CustomSelect from '../components/Select';
import { CustomView } from '../components/Styles';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, View } from 'react-native';

const options = [
    { label: 'Lucas', value: 'Lucas' },
    { label: 'Rafael', value: 'Rafael' },
    { label: 'Otávio', value: 'Otávio' },
    { label: 'Gustavo', value: 'Gustavo' }
]

const ministerios = [
    { label: 'Louvor', value: 'louvor' },
    { label: 'MTI', value: 'mti' }
]

const escala = [
    { label: 'Semanal', value: false },
    { label: 'Mensal', value: true }
]

export default function Escala({navigation, route}) { 
    const { logo } = route.params; 
    const [close, setClose] = useState(false);
    const [ministerio, setMinisterio] = useState("louvor");
    const [escalaType, setEscalaType] = useState(false);

    useEffect(() => {
        setClose(false)
    },[close])

    return (
        <TouchableWithoutFeedback onPress={() => setClose(true)}>
            <View style={{flex:1}}>
                <Header
                    title="ESCALA"
                    myLeftContainer={(
                        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{paddingLeft:5, resizeMode:'contain'}}>
                            <Image 
                                style={{width:logo.size, height:logo.size, margin:logo.margim}}
                                source={logo.image}
                            />
                        </TouchableOpacity>   
                    )}
                    myRightContainer={
                        <TouchableOpacity onPress={() => console.log('teste')} style={ styles.headerComponents }>
                            <Icon
                                name="share" 
                                type='entypo'
                                color='#a6a6a6'
                                size={25}
                            />
                        </TouchableOpacity>    
                    }
                />            
                <CustomView style={styles.pageBody}>
                    <CustomSelect 
                        placeholder='Nome' 
                        options={options} 
                        multi={true} 
                        dropDownheight={190}
                        searchable={true} 
                        handler={close} 
                        selectedValue={value => console.log(value)}
                        onPress={() => setClose(true)}
                    />
                    <CustomSelect 
                        placeholder='Ministério' 
                        options={ministerios} 
                        handler={close} 
                        default={ministerio}
                        selectedValue={value => setMinisterio(value)}
                        onPress={() => setClose(true)}
                    />
                    <CustomSelect 
                        placeholder='Escala' 
                        width={129}
                        options={escala} 
                        default={escalaType}
                        selectedValue={value => setEscalaType(value)}
                        handler={close} 
                        onPress={() => setClose(true)}
                    />
                    <Lista multi={escalaType} ministerio={ministerio.toString()}/>       
                </CustomView>
            </View>        
        </TouchableWithoutFeedback>
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
        height:"100%"        
    }
});


