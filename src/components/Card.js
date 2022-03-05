import * as React from 'react';
import { BarComponent } from './Styles';
import { Icon } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import { StyleSheet, Alert, View, Modal, Text, Linking, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class CardFactory extends React.Component {
    constructor(props){
        super(props);
        this.icon = {'up': 'caret-up', 'down': 'caret-down'};
        this.state = { expanded: false, showWebView: false, checked: false };          
        this.url = `https://www.youtube.com/results?search_query=${props.name}+${props.complement}`
        this.updateFunc = this.props.updateFunc
    }  

    renderWebView() {
        return (
            this.state.showWebView &&
            <Modal
                animationType={'slide'}
                visible={this.state.showWebView}
                onRequestClose={() => this.setState({showWebView: false})}
                transparent
            >
                <WebView
                    source={{
                    uri: this.props.cifraUrl,
                    }}
                    style={{ flex:1 }}
                />
            </Modal>
        );
    }

    linkHandler = async (url) => {         
            const supported = await Linking.canOpenURL(url);
            //
            if(supported) await Linking.openURL(url);
            else Alert.alert('Link inacessível! Por favor entre em contato com o administrador');       
    }

    onToggleHandler = async (expanded) => {
        this.setState({expanded: expanded})
        Keyboard.dismiss()
    }

    addToFavoriteList = async ()=> {
        try {
            const favs = await this.props.favfunc()

            const found = favs.find(fav => fav.id == this.props.keyID)

            if (found) {
                Alert.alert('Louvor já está na lista de favoritos!')
                return
            }

            favs.push({
                id: this.props.keyID
            })

            await AsyncStorage.setItem('@favoritos', JSON.stringify(favs))
            Alert.alert('Louvor adicionado com sucesso aos favoritos! 😁')
            await this.updateFunc()
        }
        catch(err) {
            Alert.alert('Erro', `${err} Não foi possível registrar esse favorito! Tente novamente mais tarde!`)
        }

    }

    longPressHandler = async () => {
        this.props.longPress(this.props);
        this.setState({checked: true})    
    }

    checkMode = async (checked) => {
        this.setState({checked: checked});
        if(checked){ 
            this.props.longPress(this.props);
            return;
        }    
        this.props.longPress(this.props, true);        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.multiSelect !== this.props.multiSelect) this.setState({checked: false})
    }

    render(){          
        let icon = this.icon['down'];
        if(this.state.expanded) icon = this.icon['up'];
        return(           
            <BarComponent 
                style={{
                    borderRadius:10, 
                    margin:15, 
                    marginBottom:1
                }}
            >     
                {this.renderWebView()}
                <Collapse 
                    isExpanded={this.state.expanded} 
                    onToggle={(isExpanded) => this.onToggleHandler(isExpanded)}
                    handleLongPress={() => this.longPressHandler()}
                    style={{ 
                        backgroundColor: 'transparent'
                    }}
                >
                    <CollapseHeader style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:10 }}>
                        {this.props.multiSelect ? 
                            ( 
                                <TouchableOpacity onPress={() => this.state.checked ? this.checkMode(false) : this.checkMode(true)}>
                                    <Icon name={this.state.checked ? 'checkbox-marked-outline' : 'checkbox-blank-outline'} type={'material-community'} size={28} color='#a6a6a6' style={{marginRight: 10}}/>
                                </TouchableOpacity>
                            ) : (
                                this.props.addFavorites &&
                                    <TouchableOpacity onPress={this.addToFavoriteList}>
                                        <Icon name={'md-heart'} type={'ionicon'} size={28} color='#a6a6a6' style={{marginRight: 10}}/>
                                    </TouchableOpacity>
                            )
                        }
                        <View style={{flex:1}}>
                            <Text style={{ color:'#fff', fontSize:18 }}>{this.props.name}</Text>
                            <Text style={{ color:'#a6a6a6' }}>{this.props.complement}</Text>
                        </View> 
                              
                        {this.props.caretFunction &&
                            <TouchableOpacity onPress={() => this.props.caretFunction(this.props)&&Keyboard.dismiss()}>
                                <Icon
                                    name={this.props?.icon}
                                    type={this.props?.iconType}
                                    color='#a6a6a6'
                                    size={35}
                                />  
                            </TouchableOpacity>
                        }                               
                    </CollapseHeader>      
                    <CollapseBody style={{ paddingHorizontal:30 }}>
                        {this.props.complement !== "Ministério de Louvor - ICM" &&
                            <View style={{flexDirection:'row', marginVertical:20}}>
                                <Text style={styles.linkContainer}>
                                    (
                                        <TouchableOpacity onPress={() => this.linkHandler(this.url)}>                                    
                                            <Text style={styles.link}>Youtube</Text>
                                        </TouchableOpacity>
                                    )
                                </Text>
                            
                                {this.props.cifraUrl &&
                                    <Text style={styles.linkContainer}>
                                        (
                                            <TouchableOpacity onPress={() => Platform.OS !== "web" ? this.setState({showWebView: true}) : this.linkHandler(this.props.cifraUrl) }>                                    
                                                <Text style={styles.link}>Cifras</Text>
                                            </TouchableOpacity>
                                    )
                                    </Text>
                                }
                    
                                    
                                {this.props.keyID && this.props.updateLouvor &&
                                    <Text style={styles.linkContainer}>
                                        (
                                            <TouchableOpacity 
                                                onPress={() => 
                                                    this.props.editableRoute.navigate('Editar', 
                                                    {
                                                        id:this.props.keyID,
                                                        title:this.props.name,
                                                        group:this.props.complement,
                                                        lyrics:this.props.content,
                                                        cipher:this.props.cifraUrl,
                                                        updateLouvor: this.props.updateLouvor
                                                    })
                                                }
                                            >                                    
                                                <Text style={styles.link}>Editar</Text>                                    
                                            </TouchableOpacity>
                                        )
                                    </Text>  
                                }

                                {this.props.keyID && this.props.deleteLouvor &&
                                    <Text style={styles.linkContainer}>
                                        (
                                            <TouchableOpacity 
                                                onPress={()=> {
                                                    this.props.deleteLouvor(this.props)
                                                }}
                                            >                                    
                                                <Text style={styles.link}>Remover</Text>
                                            </TouchableOpacity>
                                        )
                                    </Text>                                      
                                }                         
                            </View>
                        }                        
                        <Text style={{ color:'#fff' }}>{this.props.content}</Text>
                    </CollapseBody>                          
                </Collapse>

                <TouchableOpacity 
                    onPress={() => this.setState({expanded: !this.state.expanded})}
                    style={{
                        alignItems:'center',
                        justifyContent:'center',
                        flexDirection:'row'
                    }}
                >
                    <Icon
                        name={icon} 
                        type='font-awesome-5'
                        color='#a6a6a6'
                        size={25}
                    />
                </TouchableOpacity>       
            </BarComponent>            
               
        )
    }
}

const styles = StyleSheet.create({
    link: {
        color:'#00ffff', 
        fontWeight:'bold', 
        textDecorationLine: 'underline'
    },

    linkContainer:{
        color:'#fff', 
        fontSize:17,
        marginRight:5
    }
})