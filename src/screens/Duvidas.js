import * as React from 'react';
import Themes from '../themes/Themes';
import Header from '../components/Header';
import { Video } from 'expo-av';
import { Icon } from 'react-native-elements';
import { CustomView ,Font } from '../components/Styles';
import { StyleSheet, useColorScheme, ActivityIndicator, TouchableOpacity, Image, Modal, View } from 'react-native';

export default function DuvidasScreen({navigation, route}) {
    const { logo } = route.params;
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme].subColor || Themes.light.subColor;
    const [isVisible, setIsVisible] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [url, setUrl] = React.useState(null);
    const Duvidas = [
        {text: 'Adicionar louvores ao repertório', url: require('../../utils/Adicionar.mp4')},
        {text: 'Importar novos louvores', url: require('../../utils/Importar.mp4')}
    ]
    

    const modalHandler = async (url) => {
        setUrl(url);
        setIsLoading(true)
        setIsVisible(true);
    }

    const videoHandler = async (status) => {
        if(status.didJustFinish) setIsVisible(false);
        if(status.isPlaying) setIsLoading(false);
    }

    return (
        <View style={{flex:1}}>
            <Header
                title={"DÚVIDAS"} 
                myLeftContainer={(
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerComponents}>
                        <Image 
                            style={{width:logo.size, height:logo.size, margin:logo.margim}}
                            source={logo.image}
                        />
                    </TouchableOpacity>   
                )}
            />
            <Modal
                animationType={'fade'}
                style={styles.modal}
                visible={isVisible}
                statusBarTranslucent
                transparent
            >
                <CustomView style={styles.modalBackground}>
                    
                    <ActivityIndicator style={styles.activityIndicator} animating={isLoading} size={100} color="#a6a6a6"/>
                    
                    <TouchableOpacity style={styles.closeModal} onPress={() => setIsVisible(false)}>
                        <Icon name={'cross'} type='entypo' color={Theme} size={30}/>
                    </TouchableOpacity>

                    <Video
                        source={url}
                        resizeMode='contain'
                        onPlaybackStatusUpdate={status => videoHandler(status)}
                        shouldPlay={true}
                        useNativeControls
                        style={{ width:"100%", height:"85%" }}
                    />
                </CustomView>
            </Modal>
            
            <CustomView style={styles.pageBody}>
                {Duvidas.map((obj, index) => (
                    <TouchableOpacity key={index} style={[styles.button , { borderBottomColor:Theme }]} onPress={() => modalHandler(obj.url)}>
                        <Font style={{fontSize: 17}}>{obj.text}</Font>
                        <Icon name={'controller-play'} type='entypo' color={Theme} size={30}/>
                    </TouchableOpacity>                 
                ))}
             </CustomView>          
        </View> 
    )
}


const styles = StyleSheet.create({
    headerComponents: {
        paddingHorizontal: 5,
        resizeMode: 'contain'
    },

    pageBody: {
        flex:1,
        padding:"4%",
        height:"100%"
    },

    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        marginBottom: 25,
        paddingVertical: 5,
        borderBottomWidth: 1,
    },

    controlBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    activityIndicator: {
        position:'absolute',
        alignSelf:'center',
        top:'45%'
    },

    closeModal: {
        alignSelf:"flex-end", 
        margin:10
    },

    modal: {
        flex:1, 
        justifyContent: "center", 
        alignContent: "center"
    },

    modalBackground: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "space-around",
        height:'100%'
    }
})

