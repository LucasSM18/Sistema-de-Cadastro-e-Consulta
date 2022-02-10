import * as React from 'react';
import Themes from '../themes/Themes';
import Header from '../components/Header';
import { Icon } from 'react-native-elements';
import { CustomView, Search } from '../components/Styles';
import { StyleSheet, useColorScheme, TouchableOpacity, Image, View } from 'react-native';

export default function DuvidasScreen({navigation, route}) {
    const { logo } = route.params;
    const deviceTheme = useColorScheme();
    const Theme = Themes[deviceTheme] || Themes.light;
    const [sugestão, setSugestão] = React.useState("");
    const input = React.useRef(null);

    React.useEffect(() => {
        input.current && input.current.focus();
    }, []);

    return (
        <View style={{flex:1}}>
            <Header
                title={"SUGESTÕES"} 
                myLeftContainer={(
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{paddingLeft:5, resizeMode:'contain'}}>
                        <Image 
                            style={{width:logo.size, height:logo.size, margin:logo.margim}}
                            source={logo.image}
                        />
                    </TouchableOpacity>   
                )}
                myRightContainer={
                    <TouchableOpacity onPress={() => console.log('teste')} style={styles.headerComponents}>
                        <Icon
                            name={'send'} 
                            type="material-community"
                            color='#a6a6a6'
                            size={25}
                        />
                    </TouchableOpacity>                               
                }
            />
             <CustomView style={styles.pageBody}>
                <Search
                    style={[ styles.textInput, { maxHeight:"55%", borderBottomColor:Theme.subColor, textAlignVertical:'top' } ]}
                    autoFocus={true}
                    ref={input}
                    multiline={true} 
                    selectionColor={Theme.color}
                    placeholderTextColor={Theme.subColor}
                    placeholder={"Sugestões para o aplicativo..."}                  
                    value={sugestão}   
                    onChangeText={text => setSugestão(text)}
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
        padding:"4%",
        height:"100%"
    },

    textInput: {        
        padding:10,
        marginBottom:30,
        fontSize:16, 
        borderBottomWidth:1
    }
})

